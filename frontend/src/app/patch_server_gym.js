const fs = require('fs');
const path = 'C:/Users/xxxx-xx-x--xxxx-x/.gemini/antigravity/scratch/pokemon_board_game/backend/server.js';
let content = fs.readFileSync(path, 'utf8');

const generateGymCode = `
function generateGymEncounter() {
  const GYM_LEADERS = [
    { name: 'ทาเคชิ (Brock)', power: 2, element: '🪨' },
    { name: 'คาสึมิ (Misty)', power: 3, element: '💧' },
    { name: 'มาจิส (Lt. Surge)', power: 4, element: '⚡' },
    { name: 'เอริกะ (Erika)', power: 4, element: '🌱' },
    { name: 'เคียว (Koga)', power: 5, element: '☠️' },
    { name: 'นัตสึเมะ (Sabrina)', power: 5, element: '🔮' },
    { name: 'คาสึระ (Blaine)', power: 6, element: '🔥' },
    { name: 'ซาคากิ (Giovanni)', power: 6, element: '🌍' },
  ];
  return GYM_LEADERS[Math.floor(Math.random() * GYM_LEADERS.length)];
}

// สุ่มซาฟารี`;

const insertPtGenSafari = `// สุ่มซาฟารี`;
content = content.replace(insertPtGenSafari, generateGymCode);

const landingOldBlock = `    } else if (tileType === 'SAFARI') {
      const safariEncounters = generateSafariEncounters();
      io.to(targetRoomId).emit('player_landed', {
        playerId: player.playerId,
        name: player.name,
        position: player.position,
        tileType: tileType,
        safariEncounters
      });
    } else {`;

const landingNewBlock = `    } else if (tileType === 'SAFARI') {
      const safariEncounters = generateSafariEncounters();
      io.to(targetRoomId).emit('player_landed', {
        playerId: player.playerId,
        name: player.name,
        position: player.position,
        tileType: tileType,
        safariEncounters
      });
    } else if (tileType === 'GYM') {
      const gymData = generateGymEncounter();
      io.to(targetRoomId).emit('player_landed', {
        playerId: player.playerId,
        name: player.name,
        position: player.position,
        tileType: tileType,
        gymData
      });
    } else {`;

content = content.replace(landingOldBlock, landingNewBlock);

const battleApiCode = `  // Event: attempt_gym_battle -> ตีโปเกมอนยิม
  socket.on('attempt_gym_battle', ({ gymPower }) => {
    let targetRoomId; let targetGameState; let playerIndex = -1;
    for (const [roomId, gameState] of Object.entries(rooms)) {
      playerIndex = gameState.players.findIndex(p => p.socketId === socket.id);
      if (playerIndex !== -1) { targetRoomId = roomId; targetGameState = gameState; break; }
    }
    if (!targetGameState) return;

    const player = targetGameState.players[playerIndex];
    let diceRoll = Math.floor(Math.random() * 6) + 1;
    let bonus = 0;
    
    // โบนัสอาชีพ Gym Leader (+2 เสมอ)
    if (player.classId === 'gym_leader') {
      bonus += 2;
    }

    const totalScore = diceRoll + bonus;

    io.to(targetRoomId).emit('dice_rolled', { 
      player: player.name, 
      result: totalScore, 
      targetTile: player.position 
    });

    if (totalScore >= gymPower) {
      player.money += 2000;
      io.to(targetRoomId).emit('update_game_state', targetGameState);
      io.to(targetRoomId).emit('system_message', { message: \`🌟 แจ้งเตือนกระดาน: \${player.name} โค่นยิมลีดเดอร์สำเร็จ รับไปเลย 2,000฿!\` });
      socket.emit('action_feedback', { type: 'SUCCESS', message: \`⚔️ ทอยได้ \${diceRoll}\${bonus > 0 ? \` (+\${bonus} โบนัส)\` : ''} = \${totalScore}... คุณชนะยิมลีดเดอร์!\` });
    } else {
      player.money = Math.max(0, player.money - 500);
      io.to(targetRoomId).emit('update_game_state', targetGameState);
      socket.emit('action_feedback', { type: 'ERROR', message: \`💀 ทอยได้ \${diceRoll}\${bonus > 0 ? \` (+\${bonus} โบนัส)\` : ''} = \${totalScore}... พลังไม่พอ! พ่ายแพ้ยิมลีดเดอร์ เสียค่ารักษาพยาบาล 500฿\` });
    }
  });

  // Event: attempt_catch`;

const battleApiSearch = `  // Event: attempt_catch`;
content = content.replace(battleApiSearch, battleApiCode);

fs.writeFileSync(path, content, 'utf8');
console.log("Patched server.js for gym battle");
