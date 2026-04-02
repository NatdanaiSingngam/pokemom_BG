const fs = require('fs');

const path = 'C:/Users/xxxx-xx-x--xxxx-x/.gemini/antigravity/scratch/pokemon_board_game/backend/server.js';
let content = fs.readFileSync(path, 'utf8');

// First, ensure initialGameState has currentEvent
const initialGameStateTarget = `    boardMap: generateBoardMap() // กระดานสุ่มแบบใหม่ประจำห้อง 40 ช่อง!
  };`;
const initialGameStateNew = `    boardMap: generateBoardMap(), // กระดานสุ่มแบบใหม่ประจำห้อง 40 ช่อง!
    currentEvent: null // เก็บ pending event (Reaction System)
  };`;
content = content.replace(initialGameStateTarget, initialGameStateNew);

// Function to resolve event
const resolveEventCode = `
function resolveCurrentEvent(roomId) {
  const gameState = rooms[roomId];
  if (!gameState || !gameState.currentEvent) return;

  const event = gameState.currentEvent;
  
  if (!event.cancelled) {
    // โดนผลเต็มๆ!
    if (event.type === 'STEAL') {
      const attacker = gameState.players.find(p => p.playerId === event.attackerId);
      const target = gameState.players.find(p => p.playerId === event.targetId);
      
      if (attacker && target) {
        let stealAmount = 500;
        // อาชีพแก๊งร็อคเก็ตขโมยเก่งขึ้น
        if (attacker.classId === 'rocket') stealAmount = 1000;
        
        target.money = Math.max(0, target.money - stealAmount);
        attacker.money += stealAmount;
        
        io.to(roomId).emit('action_feedback', { type: 'SUCCESS', message: \`🚨 \${attacker.name} ขโมยเงิน \${target.name} สำเร็จ \${stealAmount}฿!\` });
      }
    }
  } else {
    // ป้องกันสำเร็จ
    io.to(roomId).emit('action_feedback', { type: 'SUCCESS', message: \`🛡️ \${gameState.players.find(p => p.playerId === event.targetId)?.name} ใช้การ์ดโล่สกัดกั้นสำเร็จ!\` });
  }

  gameState.currentEvent = null;
  io.to(roomId).emit('update_game_state', gameState);
}
`;

// Insert it somewhere around the top, e.g. after generateBoardMap
const generateBoardTarget = `// ฟังก์ชันสำหรับจำลอง GameState เริ่มต้น`;
content = content.replace(generateBoardTarget, resolveEventCode + '\n' + generateBoardTarget);

// Now the socket handlers
const endTurnTarget = `  // Event: end_turn -> ผู้เล่นกดส่งผ่านเทิร์นให้คนถัดไป`;
const handlersCode = `  // Event: use_active_item -> ใช้การ์ดโจมตี/แกล้ง
  socket.on('use_active_item', ({ itemId }) => {
    let targetRoomId = null;
    let targetGameState = null;
    let playerIndex = -1;

    for (const [roomId, gameState] of Object.entries(rooms)) {
      playerIndex = gameState.players.findIndex(p => p.socketId === socket.id);
      if (playerIndex !== -1) { targetRoomId = roomId; targetGameState = gameState; break; }
    }
    if (!targetGameState) return;

    const player = targetGameState.players[playerIndex];

    if (!player.cards[itemId] || player.cards[itemId] <= 0) {
      socket.emit('action_feedback', { type: 'ERROR', message: 'คุณไม่มีการ์ดใบนี้!' });
      return;
    }

    if (itemId === 'CARD_STEAL') {
      // หาเป้าหมายที่มีเงินเยอะสุด (ไม่รวมตัวเอง)
      const opponents = targetGameState.players.filter(p => p.playerId !== player.playerId);
      if (opponents.length === 0) {
        socket.emit('action_feedback', { type: 'ERROR', message: 'ไม่มีเป้าหมายให้ขโมยเงิน' });
        return;
      }
      
      const target = opponents.reduce((prev, current) => (prev.money > current.money) ? prev : current);

      player.cards[itemId] -= 1; // ลบการ์ดจากมือ

      // ตั้ง Event ไว้ หน่วง 5 วินาที
      targetGameState.currentEvent = {
        id: Date.now().toString(),
        type: 'STEAL',
        attackerId: player.playerId,
        attackerName: player.name,
        targetId: target.playerId,
        targetName: target.name,
        cancelled: false,
        expiresAt: Date.now() + 5000 // 5 seconds reaction window
      };

      io.to(targetRoomId).emit('update_game_state', targetGameState);
      io.to(targetRoomId).emit('action_feedback', { type: 'ERROR', message: \`⚠️ \${player.name} กำลังจะขโมยเงิน \${target.name}!\` });

      // จับเวลา
      setTimeout(() => {
        resolveCurrentEvent(targetRoomId);
      }, 5000);
    }
  });

  // Event: use_reaction -> ใช้การ์ดป้องกัน
  socket.on('use_reaction', ({ eventId }) => {
    let targetRoomId = null;
    let targetGameState = null;
    let playerIndex = -1;

    for (const [roomId, gameState] of Object.entries(rooms)) {
      playerIndex = gameState.players.findIndex(p => p.socketId === socket.id);
      if (playerIndex !== -1) { targetRoomId = roomId; targetGameState = gameState; break; }
    }
    if (!targetGameState || !targetGameState.currentEvent) return;

    const event = targetGameState.currentEvent;
    const player = targetGameState.players[playerIndex];

    if (event.id !== eventId) return; // เก่าไปแล้ว
    if (event.targetId !== player.playerId) return; // ไม่ใช่เป้าหมาย

    if (player.cards['CARD_SHIELD'] > 0) {
      player.cards['CARD_SHIELD'] -= 1;
      event.cancelled = true;
      io.to(targetRoomId).emit('update_game_state', targetGameState);
      // ฝนตกขี้หมูไหล ให้ resolve เร็วขึ้นไม่ตั้งรอ
      // (ถ้ากดยกเลิกปุ๊บ timeout จะยังคงทำงานในอีก x วินาที แต่ event.cancelled เป็น true แล้ว เลยปลอดภัย)
    }
  });

  // Event: end_turn -> ผู้เล่นกดส่งผ่านเทิร์นให้คนถัดไป`;

content = content.replace(endTurnTarget, handlersCode);

fs.writeFileSync(path, content, 'utf8');
console.log("Patched server for Reaction Queue");
