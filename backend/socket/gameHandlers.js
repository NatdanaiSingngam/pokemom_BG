const { POKEMON_DB } = require('../data/pokemonDB');
const CLASSES_DB = require('../classesDB');
const ITEMS_DB = require('../itemsDB');
const { generateSafariEncounters, generateGymEncounter, getRandomEncounter } = require('../utils/boardHelpers');

module.exports = function registerGameHandlers(io, socket, gameStore) {
  
  // Helper สำหรับดึง State ด้วย O(1) ผ่าน `socket.data.roomId`
  const getRoom = () => {
    if (!socket.data || !socket.data.roomId) return null;
    return gameStore.getRoom(socket.data.roomId);
  };
  
  const getPlayer = (gameState) => {
    if (!socket.data || !socket.data.playerId || !gameState) return null;
    return gameState.players.find(p => p.playerId === socket.data.playerId);
  };

  socket.on('join_room', ({ roomId, playerName, savedPlayerId }) => {
    let gameState = gameStore.getRoom(roomId);
    
    // 1. ถ้ายังไม่มี ให้สร้างใหม่
    if (!gameState) {
      gameState = gameStore.createRoom(roomId);
      console.log(`[Room] สร้างห้องใหม่สำเร็จ: ${roomId}`);
    }

    socket.data = socket.data || {};

    // 2. เช็คตัวตนเก่า (Reconnect)
    let existingPlayer = null;
    if (savedPlayerId) {
       existingPlayer = gameState.players.find(p => p.playerId === savedPlayerId);
    } else {
       existingPlayer = gameState.players.find(p => p.name === playerName);
    }

    if (existingPlayer) {
       existingPlayer.socketId = socket.id;
       existingPlayer.isDisconnected = false;
       socket.data.roomId = roomId;
       socket.data.playerId = existingPlayer.playerId;
       
       socket.join(roomId);
       console.log(`[Room] ${playerName} (Reconnect) กลับเข้าห้อง ${roomId}`);
       io.to(roomId).emit('update_game_state', gameState);
       socket.emit('action_feedback', { type: 'INFO', message: 'กลับเข้าสู่เกมสำเร็จ!' });
       return;
    }

    // 3. ป้องกันห้องเต็ม
    if (gameState.status === 'PLAYING') {
      socket.emit('action_feedback', { type: 'ERROR', message: 'ห้องเริ่มเกมไปแล้ว เข้าแทรกไม่ได้' });
      return;
    }
    if (gameState.players.length >= 4) {
      socket.emit('action_feedback', { type: 'ERROR', message: 'จำนวนผู้เล่นเต็มแล้ว (4/4)' });
      return;
    }

    // Assign หัวห้อง 
    if (gameState.players.length === 0) {
      gameState.hostId = socket.id;
    }

    const newPlayerId = `p_${Math.random().toString(36).substring(2, 9)}`;
    const newPlayer = {
      socketId: socket.id, 
      playerId: newPlayerId,
      name: playerName,
      classId: null, 
      position: 0,   
      money: 1500,   
      cards: { 'POKE_BALL': 10 }, 
      hand: [], 
      pokemons: [],
      statusModifiers: [],
      ultimateCooldown: 0,
      jailedTurns: 0,
      isDisconnected: false
    };
    gameState.players.push(newPlayer);
    
    socket.data.roomId = roomId;
    socket.data.playerId = newPlayerId;
    
    socket.join(roomId);
    console.log(`[Room] ${playerName} เข้าร่วมห้อง ${roomId}`);
    io.to(roomId).emit('update_game_state', gameState);
  });

  socket.on('start_game', () => {
    const gameState = getRoom();
    if (!gameState) return;
    
    if (gameState.hostId !== socket.id && !gameState.players.find(p => p.socketId === gameState.hostId)) {
        gameState.hostId = socket.id; 
    }

    if (gameState.hostId !== socket.id) {
      socket.emit('action_feedback', { type: 'ERROR', message: 'เฉพาะหัวห้องเท่านั้นที่สามารถเริ่มเกมได้' });
      return;
    }

    gameState.status = 'PLAYING';
    io.to(gameState.roomId).emit('update_game_state', gameState);
  });

  socket.on('select_class', (classId) => {
    const gameState = getRoom();
    const player = getPlayer(gameState);
    if (!gameState || !player || gameState.status !== 'WAITING') return;

    player.classId = classId;
    const selectedClass = CLASSES_DB.find(c => c.id === classId);
    if (selectedClass) {
      player.pokemons = [selectedClass.starterPokemon];
      if (classId === 'rich_boy') {
         player.money = 5000;
      }
    }
    io.to(gameState.roomId).emit('update_game_state', gameState);
  });

  socket.on('roll_dice', () => {
    const gameState = getRoom();
    const player = getPlayer(gameState);
    if (!gameState || !player) return;

    const playerIndex = gameState.players.findIndex(p => p.playerId === player.playerId);
    
    // ✅ Phase & Turn Check
    if (gameState.currentPlayerIndex !== playerIndex) {
      socket.emit('action_feedback', { type: 'ERROR', message: 'ยังไม่ใช่เทิร์นของคุณ!' });
      return;
    }

    const diceValue = Math.floor(Math.random() * 6) + 1;
    let bonus = player.extraDice ? Math.floor(Math.random() * 6) + 1 : 0;
    player.extraDice = 0; 
    const totalDice = diceValue + bonus;

    let newPosition = player.position + totalDice;
    let getsSalary = false;

    if (player.position > 0 && newPosition >= 40) {
      newPosition = 0; 
      getsSalary = true;
    } else if (newPosition >= 40) {
      newPosition = newPosition % 40; 
    }
    player.position = newPosition;

    if (getsSalary) {
      player.money += 500;
      io.to(gameState.roomId).emit('system_message', { message: `🎉 ${player.name} รับเงินเดือน 500฿ ที่จุด START!` });
    }

    const tileType = gameState.boardMap[player.position];
    io.to(gameState.roomId).emit('dice_rolled', { 
      player: player.name, result: totalDice, targetTile: player.position 
    });

    if (tileType === 'WILD') {
      io.to(gameState.roomId).emit('encounter_started', {
        playerId: player.playerId, socketId: player.socketId, name: player.name, tileType, encounter: getRandomEncounter(player.position)
      });
    } else if (tileType === 'SAFARI') {
      io.to(gameState.roomId).emit('player_landed', {
        playerId: player.playerId, socketId: player.socketId, name: player.name, position: player.position, tileType, safariEncounters: generateSafariEncounters()
      });
    } else if (tileType === 'GYM') {
      io.to(gameState.roomId).emit('player_landed', {
        playerId: player.playerId, socketId: player.socketId, name: player.name, position: player.position, tileType, gymData: generateGymEncounter()
      });
    } else {
      io.to(gameState.roomId).emit('player_landed', {
        playerId: player.playerId, socketId: player.socketId, name: player.name, position: player.position, tileType
      });
    }

    io.to(gameState.roomId).emit('update_game_state', gameState);
  });

  socket.on('attempt_gym_battle', ({ gymPower }) => {
    const gameState = getRoom();
    const player = getPlayer(gameState);
    if (!gameState || !player) return;

    let diceRoll = Math.floor(Math.random() * 6) + 1;
    let bonus = player.classId === 'black_belt' ? 2 : 0;
    const totalScore = diceRoll + bonus;

    io.to(gameState.roomId).emit('dice_rolled', { player: player.name, result: totalScore, targetTile: player.position });

    if (totalScore >= gymPower) {
      player.money += 2000;
      socket.emit('action_feedback', { type: 'SUCCESS', message: `ทอยได้ ${totalScore} ... ชนะ!` });
    } else {
      player.money = Math.max(0, player.money - 500);
      socket.emit('action_feedback', { type: 'ERROR', message: `ทอยได้ ${totalScore} ... แพ้ เสีย 500฿` });
    }
    io.to(gameState.roomId).emit('update_game_state', gameState);
  });

  socket.on('attempt_catch', ({ pokemonId, ballType = 'POKE_BALL' }) => {
    const gameState = getRoom();
    const player = getPlayer(gameState);
    if (!gameState || !player) return;

    const pokemon = POKEMON_DB.find(p => p.id === pokemonId);
    if (!pokemon) return;

    if (!player.cards[ballType] || player.cards[ballType] <= 0) {
      socket.emit('action_feedback', { type: 'ERROR', message: 'คุณไม่มีลูกบอลประเภทนี้เหลืออยู่แล้ว!' });
      return;
    }

    player.cards[ballType] -= 1;
    let catchRoll = Math.floor(Math.random() * 6) + 1;
    if (ballType === 'ULTRA_BALL') catchRoll += 2;

    let targetScore = pokemon.rarity === 'Legendary' ? 6 : pokemon.rarity === 'Very Rare' ? 5 : pokemon.rarity === 'Rare' ? 4 : 3;

    const success = catchRoll >= targetScore;
    if (success) {
      player.pokemons.push(pokemon.id);
      io.to(gameState.roomId).emit('catch_result', {
        playerId: player.playerId, socketId: player.socketId, status: 'SUCCESS', roll: catchRoll, pokemon, remainingBalls: player.cards[ballType]
      });
    } else {
      io.to(gameState.roomId).emit('catch_result', {
        playerId: player.playerId, socketId: player.socketId, status: 'FAILED', roll: catchRoll, remainingBalls: player.cards[ballType]
      });
    }
    io.to(gameState.roomId).emit('update_game_state', gameState);
  });

  socket.on('end_encounter', () => {
    socket.emit('action_feedback', { type: 'INFO', message: 'วิ่งหนีไปได้!' });
  });

  socket.on('sell_pokemon', ({ pokemonId }) => {
    const gameState = getRoom();
    const player = getPlayer(gameState);
    if (!gameState || !player) return;

    if (player.position !== 0) {
      socket.emit('action_feedback', { type: 'ERROR', message: 'สามารถขายได้ที่โหนด START เท่านั้น!' });
      return;
    }

    if (player.pokemons.length <= 1) {
      socket.emit('action_feedback', { type: 'ERROR', message: 'คุณต้องมีโปเกมอนไว้อย่างน้อย 1 ตัว!' });
      return;
    }

    const pokemonIndex = player.pokemons.indexOf(pokemonId);
    if (pokemonIndex === -1) return;

    const pokemon = POKEMON_DB.find(p => p.id === pokemonId);
    player.pokemons.splice(pokemonIndex, 1);
    player.money += pokemon.price;

    io.to(gameState.roomId).emit('update_game_state', gameState);
    socket.emit('action_feedback', { type: 'SUCCESS', message: `ขายได้ ${pokemon.price}฿` });
  });

  socket.on('buy_item', ({ itemId }) => {
    const gameState = getRoom();
    const player = getPlayer(gameState);
    if (!gameState || !player) return;

    const item = ITEMS_DB.find(i => i.id === itemId);
    if (!item) return;

    if (player.money < item.price) {
      socket.emit('action_feedback', { type: 'ERROR', message: `เงินไม่พอ!` });
      return;
    }

    player.money -= item.price;
    if (itemId === 'poke_ball' || itemId === 'ultra_ball') {
       const key = itemId === 'poke_ball' ? 'POKE_BALL' : 'ULTRA_BALL';
       player.cards[key] = (player.cards[key] || 0) + 1;
    } else {
       player.hand = player.hand || [];
       player.hand.push(itemId);
    }
    io.to(gameState.roomId).emit('update_game_state', gameState);
  });

  socket.on('discard_item', ({ itemId }) => {
    const gameState = getRoom();
    const player = getPlayer(gameState);
    if (!gameState || !player || !player.hand) return;

    const index = player.hand.indexOf(itemId);
    if (index !== -1) {
       player.hand.splice(index, 1);
       io.to(gameState.roomId).emit('update_game_state', gameState);
    }
  });

  socket.on('use_item', ({ itemId }) => {
    const gameState = getRoom();
    const player = getPlayer(gameState);
    if (!gameState || !player || !player.hand) return;

    const handIndex = player.hand.indexOf(itemId);
    if (handIndex === -1) return;
    player.hand.splice(handIndex, 1);

    const emitSys = (msg) => io.to(gameState.roomId).emit('system_message', { message: msg });

    switch (itemId) {
      case 'bicycle': 
        player.extraDice = (player.extraDice || 0) + 1; 
        emitSys(`🚲 ${player.name} ปั่นจักรยานซิ่ง! (ได้ลูกเต๋าเพิ่ม 1 ลูก)`);
        break;
      case 'nugget': 
        player.money += 3000; 
        emitSys(`🥇 ${player.name} ขายก้อนทองคำได้ 3,000฿!`);
        break;
      case 'escape_rope': 
        player.position = 0; 
        emitSys(`🧶 ${player.name} ใช้เชือกหลบหนีวาร์ปกลับจุด START!`);
        break;
      case 'full_heal': 
        player.statusModifiers = []; 
        player.jailedTurns = 0;
        emitSys(`💊 ${player.name} ใช้ยารักษา ลบล้างสถานะผิดปกติทั้งหมด!`);
        break;
      case 'max_repel':
        player.statusModifiers.push('REPEL');
        emitSys(`🧴 ${player.name} พ่นสเปรย์ไล่แมลง (ป้องกันภัย 2 เทิร์น)`);
        break;
      case 'rocket_uniform':
        gameState.players.forEach(p => {
           if (p.playerId !== player.playerId && p.hand && p.hand.length > 0) {
              const stolen = p.hand.pop();
              if (player.hand.length < 5) player.hand.push(stolen);
           }
        });
        emitSys(`👕 ${player.name} ใส่ชุดร็อคเก็ตปล้นไพ่ชาวบ้าน!`);
        break;
      case 'snorlax_flute':
        gameState.players.forEach(p => {
           if (p.playerId !== player.playerId) p.statusModifiers.push('SLEEP');
        });
        emitSys(`🪈 เสียงขลุ่ยคาบิกอนดังขึ้น! คนอื่นเผลอหลับไปเทิร์นหน้า!`);
        break;
      case 'exp_share':
        let stolenTotal = 0;
        gameState.players.forEach(p => {
           if (p.playerId !== player.playerId && p.money > 0) {
              let amt = Math.floor(p.money * 0.2);
              p.money -= amt;
              stolenTotal += amt;
           }
        });
        player.money += stolenTotal;
        emitSys(`📡 EXP Share ทำงาน! ${player.name} ดูดเงินชาวบ้านมารวม ${stolenTotal}฿!`);
        break;
    }
    io.to(gameState.roomId).emit('update_game_state', gameState);
  });

  socket.on('use_ultimate', () => {
    const gameState = getRoom();
    const player = getPlayer(gameState);
    if (!gameState || !player || player.ultimateCooldown > 0) return;

    player.ultimateCooldown = 5;
    const emitSys = (msg) => io.to(gameState.roomId).emit('system_message', { message: msg });
    const others = gameState.players.filter(p => p.playerId !== player.playerId);
    const getRandomOther = () => others.length > 0 ? others[Math.floor(Math.random() * others.length)] : null;

    switch(player.classId) {
      case 'rookie':
        player.money += 2000;
        player.extraDice = (player.extraDice || 0) + 1;
        emitSys(`✨ ${player.name} ใช้อัลติ Evolve! ได้เงิน 2000฿ และบัฟเต๋าฟรี!`);
        break;
      case 'bug_catcher':
        others.forEach(p => p.statusModifiers.push('SLEEP'));
        emitSys(`🦋 ${player.name} โปรย Sleep Powder! คนอื่นหลับลึก 1 เทิร์น!`);
        break;
      case 'hiker':
        others.forEach(p => p.money = Math.floor(Math.max(0, p.money * 0.8)));
        emitSys(`⛰️ ${player.name} ใช้ Earthquake! พสุธากัมปนาท เงินทุกคนร่วงหล่น 20%!`);
        break;
      case 'rocket_grunt':
        const target = getRandomOther();
        if (target && target.pokemons && target.pokemons.length > 0) {
           const pIdx = Math.floor(Math.random() * target.pokemons.length);
           const pMon = target.pokemons.splice(pIdx, 1)[0];
           player.pokemons.push(pMon);
           emitSys(`🚀 ${player.name} ใช้ Snatch โฉบโปเกมอนของ ${target.name} ไปหน้าตาเฉย!`);
        } else {
           emitSys(`🚀 ${player.name} ใช้ Snatch แต่วืด (เหยื่อไม่มีโปเกมอน)`);
        }
        break;
      case 'beauty':
        const bTarget = getRandomOther();
        if (bTarget) {
           bTarget.position = player.position;
           emitSys(`💄 ${player.name} โปรยเสน่ห์ Attract ดึง ${bTarget.name} มาหาวิ่ววับ!`);
        }
        break;
      case 'swimmer':
        const sTarget = getRandomOther();
        if (sTarget) {
            sTarget.statusModifiers.push('SLEEP');
            emitSys(`🩱 ${player.name} สร้าง Whirlpool ดักทาง ${sTarget.name} ให้จมน้ำ 1 เทิร์น!`);
        }
        break;
      case 'fisherman':
        others.forEach(p => p.position = Math.max(0, p.position - 3));
        emitSys(`🎣 ${player.name} โชว์ออร่า Intimidate! ศัตรูทุกคนถอยร่นไป 3 ช่อง!`);
        break;
      case 'psychic':
        others.forEach(p => p.hand = []);
        emitSys(`🔮 ${player.name} ใช้ HypnoPendulum! สะกดจิตให้ทุกคนฉีกการ์ดคามือหมด!`);
        break;
      case 'biker':
        others.forEach(p => p.money = Math.max(0, p.money - 800));
        emitSys(`🏍️ ${player.name} เร่งเครื่องพ่น Smokescreen! สำลักควันเสียค่าหมอคนละ 800฿!`);
        break;
      case 'gambler':
        const win = Math.random() > 0.5;
        if (win) {
           player.money += 3000;
           emitSys(`🎰 กริ๊งๆ! ${player.name} แจ็คพอตแตก รับโชคใหญ่ 3,000฿!`);
        } else {
           player.money = Math.max(0, player.money - 3000);
           emitSys(`🎰 แป๋ว... ${player.name} แจ็คพอตขาดทุน โดนแดก 3,000฿!`);
        }
        break;
      case 'aroma_lady':
        const alTarget = getRandomOther();
        if (alTarget) {
            alTarget.jailedTurns = 2;
            emitSys(`🌸 ${player.name} ยิง Solar Beam ใส่ ${alTarget.name} ปลิวเข้าโรงพยาบาล (คุก) 2 เทิร์น!`);
        }
        break;
      case 'black_belt':
        const bbTarget = getRandomOther();
        if (bbTarget) {
            const randPos = Math.floor(Math.random() * 40);
            bbTarget.position = randPos;
            emitSys(`🥋 ${player.name} ใช้ Seismic Toss จับ ${bbTarget.name} เหวี่ยงปลิวไปตกช่อง ${randPos}!`);
        }
        break;
      case 'channeler':
        const cTarget = getRandomOther();
        if (cTarget) {
            const temp = player.money;
            player.money = cTarget.money;
            cTarget.money = temp;
            emitSys(`👻 ${player.name} แผลงฤทธิ์ Destiny Bond! สลับเงินกับ ${cTarget.name} หน้าตาเฉย!`);
        }
        break;
      case 'ranger':
        const rTarget = getRandomOther();
        if (rTarget && rTarget.hand.length > 0) {
            const stolenC = rTarget.hand.pop();
            if (player.hand.length < 5) player.hand.push(stolenC);
            emitSys(`🏕️ ${player.name} ใช้ Slash & Steal! ปล้นไพ่จาก ${rTarget.name} มาได้!`);
        } else {
            emitSys(`🏕️ ${player.name} ใช้ Slash & Steal แต่วืด (เป้าหมายกระเป๋าว่าง)`);
        }
        break;
      case 'scientist':
        player.ultimateCooldown = 0;
        emitSys(`🧪 ${player.name} ใช้ Master Clone อัลติคูลดาวน์เสร็จทันที!`);
        break;
      case 'rich_boy':
        player.pokemons = player.pokemons || [];
        const randomP = POKEMON_DB[Math.floor(Math.random() * POKEMON_DB.length)].id;
        player.pokemons.push(randomP);
        emitSys(`💎 ${player.name} ใช้ Bribe System ยัดเงินใต้โต๊ะ ได้โปเกมอนลึกลับมาฟรีๆ 1 ตัว!`);
        break;
      default:
        emitSys(`⚡ ${player.name} ใช้ท่าไม้ตาย (ยังไม่ได้ระบุพลัง)`);
        break;
    }
    io.to(gameState.roomId).emit('update_game_state', gameState);
  });

  socket.on('end_turn', () => {
    const gameState = getRoom();
    const player = getPlayer(gameState);
    if (!gameState || !player) return;

    const playerIndex = gameState.players.findIndex(p => p.playerId === player.playerId);
    if (gameState.currentPlayerIndex !== playerIndex) return;

    let nextIndex = gameState.currentPlayerIndex + 1;
    if (nextIndex >= gameState.players.length) {
      nextIndex = 0;
      gameState.turnCount += 1;
      // ลด cooldown ตามรอบเทิร์นเกมรวม
      gameState.players.forEach(p => {
         if (p.ultimateCooldown > 0) p.ultimateCooldown -= 1;
      });
    }
    gameState.currentPlayerIndex = nextIndex;

    // Auto-skip loops for disconnected players
    let loops = 0;
    while (gameState.players[gameState.currentPlayerIndex]?.isDisconnected && loops < 5) {
       gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
       if (gameState.currentPlayerIndex === 0) gameState.turnCount += 1;
       loops++;
    }

    io.to(gameState.roomId).emit('update_game_state', gameState);
  });

  socket.on('disconnect', () => {
    const gameState = getRoom();
    const player = getPlayer(gameState);
    if (gameState && player) {
       console.log(`[Socket] ${player.name} หลุดจากห้อง ${gameState.roomId} (รอ Reconnect)`);
       player.isDisconnected = true;
       
       const allDisconnected = gameState.players.every(p => p.isDisconnected);
       if (allDisconnected) {
          gameStore.deleteRoom(gameState.roomId);
       } else {
          // ถ้าเทิร์นของหนีหลุดอยู่ ให้ส่งออโต้เทิร์นเผื่อเพลเยอร์อื่นต่อ
          if (gameState.currentPlayerIndex === gameState.players.findIndex(p => p.playerId === player.playerId)) {
             gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
          }
          io.to(gameState.roomId).emit('update_game_state', gameState);
       }
    }
  });

};
