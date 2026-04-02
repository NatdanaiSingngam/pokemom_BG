const fs = require('fs');

const path = 'C:/Users/xxxx-xx-x--xxxx-x/.gemini/antigravity/scratch/pokemon_board_game/backend/server.js';
let content = fs.readFileSync(path, 'utf8');

const targetSelectClassStr = `    targetGameState.players[playerIndex].classId = classId;`;

const newSelectClassStr = `    const CLASS_STARTERS = {
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

content = content.replace(targetSelectClassStr, newSelectClassStr);

fs.writeFileSync(path, content, 'utf8');
console.log("Patched select_class in server.js");
