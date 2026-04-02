const fs = require('fs');

const path = 'C:/Users/xxxx-xx-x--xxxx-x/.gemini/antigravity/scratch/pokemon_board_game/backend/server.js';
let content = fs.readFileSync(path, 'utf8');

// Add generateSafariEncounters mapping
// Right above getRandomEncounter function (around line 190)
const getRandomEncounterCode = `function getRandomEncounter(position = 0) {`;

const newCodeSafariGen = `
// สุ่มซาฟารีตามเรต: Common 80%, Rare 10%, Very Rare 7%, Legendary 3%
function getSafariEncounter() {
  const roll = Math.floor(Math.random() * 100) + 1;
  let targetRarity = 'Common';
  if (roll <= 3) targetRarity = 'Legendary';
  else if (roll <= 10) targetRarity = 'Very Rare';
  else if (roll <= 20) targetRarity = 'Rare';
  
  const possible = POKEMON_DB.filter(p => p.rarity === targetRarity);
  if(possible.length === 0) return POKEMON_DB[0];
  return possible[Math.floor(Math.random() * possible.length)];
}

function generateSafariEncounters() {
  return [getSafariEncounter(), getSafariEncounter(), getSafariEncounter(), getSafariEncounter()];
}

function getRandomEncounter(position = 0) {`;

content = content.replace(getRandomEncounterCode, newCodeSafariGen);

// Now patch the player_landed section in socket.on('roll_dice')
// Currently lines 429-436 look like:
/*
    } else {
      io.to(targetRoomId).emit('player_landed', {
        playerId: player.playerId,
        name: player.name,
        position: player.position,
        tileType: tileType
      });
    }
*/
const oldLandedBlock = `    } else {
      io.to(targetRoomId).emit('player_landed', {
        playerId: player.playerId,
        name: player.name,
        position: player.position,
        tileType: tileType
      });
    }`;

const newLandedBlock = `    } else if (tileType === 'SAFARI') {
      const safariEncounters = generateSafariEncounters();
      io.to(targetRoomId).emit('player_landed', {
        playerId: player.playerId,
        name: player.name,
        position: player.position,
        tileType: tileType,
        safariEncounters
      });
    } else {
      io.to(targetRoomId).emit('player_landed', {
        playerId: player.playerId,
        name: player.name,
        position: player.position,
        tileType: tileType
      });
    }`;

content = content.replace(oldLandedBlock, newLandedBlock);

fs.writeFileSync(path, content, 'utf8');
console.log("Patched server.js for SAFARI logic.");
