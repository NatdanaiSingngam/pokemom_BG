const fs = require('fs');

const path = 'C:/Users/xxxx-xx-x--xxxx-x/.gemini/antigravity/scratch/pokemon_board_game/backend/server.js';
let content = fs.readFileSync(path, 'utf8');

const targetStr = `    const ITEM_CATALOG = {
      'POKE_BALL':  { name: 'Poké Ball',  price: 200 },
      'ULTRA_BALL': { name: 'Ultra Ball', price: 1000 },
    };`;

const newStr = `    const ITEM_CATALOG = {
      'POKE_BALL':  { name: 'Poké Ball',  price: 200 },
      'ULTRA_BALL': { name: 'Ultra Ball', price: 1000 },
      'CARD_STEAL': { name: 'การ์ดขโมยเงิน', price: 600 },
      'CARD_SHIELD': { name: 'การ์ดโล่ป้องกัน', price: 400 },
    };`;

content = content.replace(targetStr, newStr);

fs.writeFileSync(path, content, 'utf8');
console.log("Patched ITEM_CATALOG in server");
