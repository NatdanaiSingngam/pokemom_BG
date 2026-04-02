const fs = require('fs');
const path = 'C:/Users/xxxx-xx-x--xxxx-x/.gemini/antigravity/scratch/pokemon_board_game/backend/server.js';
let content = fs.readFileSync(path, 'utf8');

const evoDictStr = `const EVOLUTIONS = {
  "mon_001": "mon_002", "mon_002": "mon_003", 
  "mon_004": "mon_005", "mon_005": "mon_006", 
  "mon_007": "mon_008", "mon_008": "mon_009", 
  "mon_010": "mon_011", "mon_011": "mon_012", 
  "mon_013": "mon_014", "mon_014": "mon_015", 
  "mon_016": "mon_017", "mon_017": "mon_018", 
  "mon_019": "mon_020",
  "mon_025": "mon_026",
  "mon_041": "mon_042",
  "mon_063": "mon_064", "mon_064": "mon_065",
  "mon_066": "mon_067", "mon_067": "mon_068",
  "mon_092": "mon_093", "mon_093": "mon_094",
  "mon_129": "mon_130",
  "mon_133": "mon_134",
  "mon_147": "mon_148", "mon_148": "mon_149"
};
`;

const insertPt = `const RAW_POKEMON_DB = [`;
content = content.replace(insertPt, evoDictStr + '\n' + insertPt);

const evolveEvtStr = `  // Event: evolve_pokemon
  socket.on('evolve_pokemon', ({ pokemonIndex }) => {
    let targetRoomId; let targetGameState; let playerIndex = -1;
    for (const [roomId, gameState] of Object.entries(rooms)) {
      playerIndex = gameState.players.findIndex(p => p.socketId === socket.id);
      if (playerIndex !== -1) { targetRoomId = roomId; targetGameState = gameState; break; }
    }
    if (!targetGameState) return;

    const player = targetGameState.players[playerIndex];
    const pokemonId = player.pokemons[pokemonIndex];
    if (!pokemonId) return;

    const nextEvoId = EVOLUTIONS[pokemonId];
    if (!nextEvoId) {
      socket.emit('action_feedback', { type: 'ERROR', message: 'โปเกมอนร่างนี้ไม่สามารถวิวัฒนาการต่อได้แล้ว!' });
      return;
    }

    const evolveCost = 2000;
    if (player.money < evolveCost) {
      socket.emit('action_feedback', { type: 'ERROR', message: \`เงินไม่พอ! การพัฒนาร่างต้องใช้ \${evolveCost}฿\` });
      return;
    }

    const nextMon = POKEMON_DB.find(p => p.id === nextEvoId);
    // หักเงิน เปลี่ยนร่าง
    player.money -= evolveCost;
    player.pokemons[pokemonIndex] = nextEvoId;
    
    io.to(targetRoomId).emit('update_game_state', targetGameState);
    socket.emit('action_feedback', { type: 'SUCCESS', message: \`✨ ยินดีด้วย! โปเกมอนคุณพัฒนาร่างกลายเป็น \${nextMon.name} แล้ว!\` });
  });

  // Event: sell_pokemon -> ผู้เล่นกดขายมอนสเตอร์`;

const sellEvtSearch = `  // Event: sell_pokemon -> ผู้เล่นกดขายมอนสเตอร์`;
content = content.replace(sellEvtSearch, evolveEvtStr);

fs.writeFileSync(path, content, 'utf8');
console.log("Patched server for evolution");
