const fs = require('fs');

const path = 'C:/Users/xxxx-xx-x--xxxx-x/.gemini/antigravity/scratch/pokemon_board_game/backend/server.js';
let content = fs.readFileSync(path, 'utf8');

const endTurnStr = "  // Event: end_turn -> ผู้เล่นกดส่งผ่านเทิร์นให้คนถัดไป";
const airportEvent = `  // Event: airport_warp -> เลือกช่องที่จะเดินทางไป
  socket.on('airport_warp', ({ targetPos }) => {
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

    player.position = targetPos;
    io.to(targetRoomId).emit('update_game_state', targetGameState);
    socket.emit('action_feedback', { type: 'SUCCESS', message: \`✈️ บินด่วนไปที่ช่อง \${targetPos} สำเร็จ!\` });

    const targetTile = targetGameState.boardMap[player.position];
    io.to(targetRoomId).emit('player_landed', {
      playerId: player.playerId,
      position: player.position,
      tileType: targetTile
    });
  });

  // Event: end_turn -> ผู้เล่นกดส่งผ่านเทิร์นให้คนถัดไป`;

content = content.replace(endTurnStr, airportEvent);

fs.writeFileSync(path, content, 'utf8');
console.log("Added AIRPORT to backend");
