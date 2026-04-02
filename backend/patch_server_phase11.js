const fs = require('fs');

const path = 'C:/Users/xxxx-xx-x--xxxx-x/.gemini/antigravity/scratch/pokemon_board_game/backend/server.js';
let content = fs.readFileSync(path, 'utf8');

// 1. imports
const importTarget = `const io = new Server(server, {`;
const importNew = `const CLASSES_DB = require('./classesDB');
const ITEMS_DB = require('./itemsDB');
const io = new Server(server, {`;
content = content.replace(importTarget, importNew);


// 2. update join_room
const joinRoomTarget = `      cards: { 'POKE_BALL': 10 }, // เริ่มต้น 10 ลูก
      pokemons: [],
      statusModifiers: [],
      ultimateCooldown: 0
    };`;
const joinRoomNew = `      cards: { 'POKE_BALL': 10 }, // เริ่มต้น 10 ลูก
      hand: [], // สำหรับระบบใหม่
      pokemons: [],
      statusModifiers: [],
      ultimateCooldown: 0
    };`;
content = content.replace(joinRoomTarget, joinRoomNew);


// 3. update select_class
const selectClassTarget = `    const CLASS_STARTERS = {
      'trainer': 'mon_025',     // Pikachu
      'breeder': 'mon_133',     // Eevee
      'rocket': 'mon_041',      // Zubat
      'researcher': 'mon_137',  // Porygon
      'gym_leader': 'mon_066',  // Machop
      'camper': 'mon_010',      // Caterpie
      'psychic': 'mon_063',     // Abra
      'swimmer': 'mon_007'      // Squirtle
    };

    targetGameState.players[playerIndex].classId = classId;
    if (CLASS_STARTERS[classId]) {
      // แจกโปเกมอนเริ่มต้น
      targetGameState.players[playerIndex].pokemons = [CLASS_STARTERS[classId]];
    }`;

const selectClassNew = `    targetGameState.players[playerIndex].classId = classId;
    const selectedClass = CLASSES_DB.find(c => c.id === classId);
    if (selectedClass) {
      // แจกโปเกมอนเริ่มต้น
      targetGameState.players[playerIndex].pokemons = [selectedClass.starterPokemon];
      
      // ถ้าเป็น Rich Boy ได้เงิน 5000
      if (classId === 'rich_boy') {
         targetGameState.players[playerIndex].money = 5000;
      }
    }`;
content = content.replace(selectClassTarget, selectClassNew);


// 4. remove old EVENT use_active_item
const removeActiveItemStart = content.indexOf(`  // Event: use_active_item -> ใช้การ์ดโจมตี/แกล้ง`);
const removeActiveItemEnd = content.indexOf(`  // Event: use_reaction -> ใช้การ์ดป้องกัน`);
if (removeActiveItemStart !== -1 && removeActiveItemEnd !== -1) {
    const chunkToRemove = content.substring(removeActiveItemStart, removeActiveItemEnd);
    content = content.replace(chunkToRemove, '');
}

// 5. Build the new use_item and use_ultimate endpoints
const endTurnIndex = content.indexOf(`  // Event: end_turn -> ผู้เล่นกดส่งผ่านเทิร์นให้คนถัดไป`);
const newEndpoints = `  // Event: use_item -> ระบบกดใช้งานไอเทม
  socket.on('use_item', ({ itemId, targetPlayerId }) => {
    let targetRoomId = null; let targetGameState = null; let playerIndex = -1;
    for (const [roomId, gameState] of Object.entries(rooms)) {
      playerIndex = gameState.players.findIndex(p => p.socketId === socket.id);
      if (playerIndex !== -1) { targetRoomId = roomId; targetGameState = gameState; break; }
    }
    if (!targetGameState) return;

    const player = targetGameState.players[playerIndex];
    const handIndex = player.hand.indexOf(itemId);

    if (handIndex === -1) {
      socket.emit('action_feedback', { type: 'ERROR', message: 'คุณไม่มีไอเทมนี้ในกระเป๋า!' });
      return;
    }

    // ลบออกจากกระเป๋า
    player.hand.splice(handIndex, 1);

    // ประมวลผลลอจิกตามประเภทไอเทม
    const item = ITEMS_DB.find(i => i.id === itemId);
    
    switch (itemId) {
      case 'bicycle':
        player.extraDice = (player.extraDice || 0) + 1; // สมมติลอจิกให้ทอยเต๋าอีก 1 
        io.to(targetRoomId).emit('system_message', { message: \`🚲 \${player.name} ปั่นจักรยานเตรียมเหยียบมิดไมล์ในเลี้ยวหน้า!\` });
        break;
      case 'nugget':
        player.money += 3000;
        io.to(targetRoomId).emit('system_message', { message: \`💰 \${player.name} ขายก้อนทองคำนัคเก็ต ได้เงินมา 3,000฿!\` });
        break;
      case 'escape_rope':
        player.position = 0; // วาร์ปกลับจุดเริ่มต้น (เมือง)
        io.to(targetRoomId).emit('system_message', { message: \`🪢 \${player.name} ใช้เชือกหลบหนีวาร์ปกลับไปที่จุดเริ่มต้น!\` });
        break;
      case 'full_heal':
        player.statusModifiers = [];
        io.to(targetRoomId).emit('system_message', { message: \`✨ \${player.name} พ่นยา Full Heal อาการแจ่มใสแล้ว!\` });
        break;
      default:
        io.to(targetRoomId).emit('system_message', { message: \`⭐ \${player.name} ใช้งาน \${item ? item.name : itemId}!\` });
        break;
    }

    io.to(targetRoomId).emit('update_game_state', targetGameState);
  });

  // Event: use_ultimate
  socket.on('use_ultimate', () => {
    let targetRoomId = null; let targetGameState = null; let playerIndex = -1;
    for (const [roomId, gameState] of Object.entries(rooms)) {
      playerIndex = gameState.players.findIndex(p => p.socketId === socket.id);
      if (playerIndex !== -1) { targetRoomId = roomId; targetGameState = gameState; break; }
    }
    if (!targetGameState) return;

    const player = targetGameState.players[playerIndex];

    if (player.ultimateCooldown > 0) {
      socket.emit('action_feedback', { type: 'ERROR', message: \`ท่าไม้ตายยังไม่พร้อม! คูลดาวน์เหลือ \${player.ultimateCooldown} เทิร์น\` });
      return;
    }

    const classData = CLASSES_DB.find(c => c.id === player.classId);
    
    // ตั้งคูลดาวน์
    player.ultimateCooldown = 5;

    // ประมวลผลลอจิกตามอาชีพ (ตัวอย่างชั่วคราว)
    switch(player.classId) {
      case 'bug_catcher':
        // ทำทุกคนหลับ
        targetGameState.players.forEach(p => {
          if (p.playerId !== player.playerId && p.classId !== 'hiker') {
            p.statusModifiers.push('SLEEP');
          }
        });
        io.to(targetRoomId).emit('system_message', { message: \`💤 \${player.name} พ่น Sleep Powder! ทุกคนในห้องหลับกลางอากาศ!\` });
        break;
      case 'hiker':
        io.to(targetRoomId).emit('system_message', { message: \`💥 แผ่นดินไหว! \${player.name} ทุบพื้น ทุกคนเสียเงิน 20%!\` });
        targetGameState.players.forEach(p => {
          if (p.playerId !== player.playerId) {
            p.money = Math.floor(p.money * 0.8);
          }
        });
        break;
      case 'rookie':
        io.to(targetRoomId).emit('system_message', { message: \`🌟 \${player.name} ให้ Eevee พัฒนาร่าง! ได้รับบัฟเสริมพลังกระทันหัน!\` });
        break;
      default:
        io.to(targetRoomId).emit('system_message', { message: \`🔥 \${player.name} เปิดใช้ท่าไม้ตายขั้นสูงสุด \${classData ? classData.ultimateDetails.split(':')[0] : ''}!\` });
        break;
    }

    io.to(targetRoomId).emit('update_game_state', targetGameState);
  });

`;

content = content.slice(0, endTurnIndex) + newEndpoints + content.slice(endTurnIndex);

// 6. Update end_turn to reduce ultimateCooldown
const nextTurnLogicStr = `    gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;`;
const nextTurnLogicNew = `    gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    const nextPlayer = gameState.players[gameState.currentPlayerIndex];
    if (nextPlayer && nextPlayer.ultimateCooldown > 0) {
       nextPlayer.ultimateCooldown -= 1;
    }`;
content = content.replace(nextTurnLogicStr, nextTurnLogicNew);


fs.writeFileSync(path, content, 'utf8');
console.log("Patched server.js completely for 16 classes and items");
