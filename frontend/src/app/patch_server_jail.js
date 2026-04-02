const fs = require('fs');
const path = '../../backend/server.js';
// Actually wait, let's use the absolute path to be safe.
const absolutePath = 'C:/Users/xxxx-xx-x--xxxx-x/.gemini/antigravity/scratch/pokemon_board_game/backend/server.js';
let content = fs.readFileSync(absolutePath, 'utf8');

// 1. Add jailedTurns to new player
content = content.replace(
  /position: 0,\s+money: 1000,\s+cards:/,
  `position: 0,
        jailedTurns: 0,
        money: 1000,
        cards:`
);

// 2. Add jailed logic when moving to tile 10 (JAIL) 
// The tile landing logic is in `socket.on('roll_dice')`
const targetTileCode = `const targetTile = targetGameState.boardMap[player.position];`;
const newTargetTileCode = `const targetTile = targetGameState.boardMap[player.position];
    
    // Check if player landed on Jail
    if (targetTile === 'JAIL') {
      player.jailedTurns = 3;
      socket.emit('action_feedback', { type: 'ERROR', message: 'คุณถูกจับขังตัวอยู่ในคุกใต้ดิน!' });
    }`;
content = content.replace(targetTileCode, newTargetTileCode);

// 3. Add jail_action event handling inside io.on('connection')
const endTurnEventStr = `// Event: end_turn`;
const jailEventsCode = `
  // Event: jail_action -> เมื่อผู้เล่นเลือกทางออกจากคุก
  socket.on('jail_action', ({ action }) => {
    let targetRoomId = null;
    let targetGameState = null;
    let playerIndex = -1;

    for (const [roomId, gameState] of Object.entries(rooms)) {
      playerIndex = gameState.players.findIndex(p => p.socketId === socket.id);
      if (playerIndex !== -1) { targetRoomId = roomId; targetGameState = gameState; break; }
    }
    if (!targetGameState) return;

    if (targetGameState.currentPlayerIndex !== playerIndex) return;
    const player = targetGameState.players[playerIndex];

    if (action === 'pay') {
      if (player.money >= 500) {
        player.money -= 500;
        player.jailedTurns = 0;
        io.to(targetRoomId).emit('update_game_state', targetGameState);
        socket.emit('action_feedback', { type: 'SUCCESS', message: 'จ่าย 500฿ แหกคุกสำเร็จ! ทอยเต๋าเดินต่อได้เลย' });
      } else {
         socket.emit('action_feedback', { type: 'ERROR', message: 'เงินไม่พอจ่ายค่าปรับ!' });
      }
    } else if (action === 'roll') {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      if (d1 === d2) {
        player.jailedTurns = 0;
        player.position = (player.position + d1 + d2) % 40;
        io.to(targetRoomId).emit('update_game_state', targetGameState);
        socket.emit('action_feedback', { type: 'SUCCESS', message: \`ทอยได้ \${d1},\${d2} เต๋าคู่! หลบหนีสำเร็จและเดินหน้าต่อ!\` });
        
        // Trigger landing logic
        const targetTile = targetGameState.boardMap[player.position];
        io.to(targetRoomId).emit('player_landed', {
          playerId: player.playerId,
          position: player.position,
          tileType: targetTile
        });
      } else {
        player.jailedTurns -= 1;
        socket.emit('action_feedback', { type: 'ERROR', message: \`ทอยได้ \${d1} กับ \${d2} ไม่ใช่เต๋าคู่... ยังต้องติดคุกต่ออีก \${player.jailedTurns} เทิร์น\` });
        // บังคับเปลี่ยนเทิร์นเลย
        targetGameState.currentPlayerIndex = (targetGameState.currentPlayerIndex + 1) % targetGameState.players.length;
        io.to(targetRoomId).emit('update_game_state', targetGameState);
      }
    }
  });

  // Event: end_turn`;
content = content.replace(endTurnEventStr, jailEventsCode);

fs.writeFileSync(absolutePath, content, 'utf8');
console.log("Patched server.js for JAIL");
