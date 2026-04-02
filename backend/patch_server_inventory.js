const fs = require('fs');

const path = 'C:/Users/xxxx-xx-x--xxxx-x/.gemini/antigravity/scratch/pokemon_board_game/backend/server.js';
let content = fs.readFileSync(path, 'utf8');

const buyItemStart = content.indexOf(`socket.on('buy_item', ({ itemId }) => {`);
const discardItemEnd = content.indexOf(`// Event: jail_action`);

if (buyItemStart !== -1 && discardItemEnd !== -1) {
   const originalCodeChunk = content.substring(buyItemStart, discardItemEnd);
   const newCodeChunk = `socket.on('buy_item', ({ itemId }) => {
    let targetRoomId = null;
    let targetGameState = null;
    let playerIndex = -1;

    for (const [roomId, gameState] of Object.entries(rooms)) {
      playerIndex = gameState.players.findIndex(p => p.socketId === socket.id);
      if (playerIndex !== -1) { targetRoomId = roomId; targetGameState = gameState; break; }
    }
    if (!targetGameState) return;
    const player = targetGameState.players[playerIndex];

    const item = ITEMS_DB.find(i => i.id === itemId);
    if (!item) {
      socket.emit('action_feedback', { type: 'ERROR', message: 'ไอเทมนี้ไม่มีในระบบ!' });
      return;
    }

    if (player.money < item.price) {
      socket.emit('action_feedback', { type: 'ERROR', message: \`เงินไม่พอ! ต้องการ \${item.price.toLocaleString()}฿\` });
      return;
    }

    // หักเงิน
    player.money -= item.price;
    
    // หากเป็นบอล เอาเข้า cards, หากเป็นอื่นๆ เอาเข้า hand
    if (itemId === 'poke_ball' || itemId === 'ultra_ball') {
       const ballKey = itemId === 'poke_ball' ? 'POKE_BALL' : 'ULTRA_BALL';
       player.cards[ballKey] = (player.cards[ballKey] || 0) + 1;
    } else {
       player.hand = player.hand || [];
       player.hand.push(itemId);
    }

    io.to(targetRoomId).emit('update_game_state', targetGameState);
    socket.emit('action_feedback', { type: 'SUCCESS', message: \`🛍️ ซื้อ \${item.name} สำเร็จ!\` });
    
    // ตรวจสอบหลังจากซื้อว่ามือเต็มมั้ย
    if (player.hand && player.hand.length > 5) {
       socket.emit('hand_full_discard_required', { 
           message: 'การ์ดในมือคุณเต็มแล้ว! (สูงสุด 5 ใบ) ต้องทิ้งการ์ด 1 ใบ' 
       });
    }
  });

  // Event: discard_item
  socket.on('discard_item', ({ itemId }) => {
    let targetRoomId = null;
    let targetGameState = null;
    let playerIndex = -1;

    for (const [roomId, gameState] of Object.entries(rooms)) {
      playerIndex = gameState.players.findIndex(p => p.socketId === socket.id);
      if (playerIndex !== -1) { targetRoomId = roomId; targetGameState = gameState; break; }
    }
    if (!targetGameState) return;

    const player = targetGameState.players[playerIndex];
    if (player.hand) {
       const index = player.hand.indexOf(itemId);
       if (index !== -1) {
          player.hand.splice(index, 1);
          io.to(targetRoomId).emit('update_game_state', targetGameState);
          socket.emit('action_feedback', { type: 'INFO', message: \`ทิ้งการ์ดเรียบร้อย\` });
       }
    }
  });

  `;
   content = content.replace(originalCodeChunk, newCodeChunk);
}

fs.writeFileSync(path, content, 'utf8');
console.log("Patched server.js for inventory logic and shop logic");
