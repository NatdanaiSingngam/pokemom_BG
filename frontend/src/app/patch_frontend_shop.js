const fs = require('fs');

const path = 'C:/Users/xxxx-xx-x--xxxx-x/.gemini/antigravity/scratch/pokemon_board_game/frontend/src/app/page.js';
let content = fs.readFileSync(path, 'utf8');

const targetStr = `      const SHOP_ITEMS = [
        { id: 'POKE_BALL',  name: 'Poké Ball',  icon: '🔴', price: 200,  desc: 'ลูกบอลมาตรฐาน' },
        { id: 'ULTRA_BALL', name: 'Ultra Ball', icon: '🟣', price: 1000, desc: '+2 แต้มเต๋าตอนจับ' },
      ];`;

const newStr = `      const SHOP_ITEMS = [
        { id: 'POKE_BALL',  name: 'Poké Ball',  icon: '🔴', price: 200,  desc: 'ลูกบอลมาตรฐาน' },
        { id: 'ULTRA_BALL', name: 'Ultra Ball', icon: '🟣', price: 1000, desc: '+2 แต้มเต๋าตอนจับ' },
        { id: 'CARD_STEAL', name: 'การ์ดขโมยเงิน', icon: '😈', price: 600, desc: 'ขโมยเงินจากเป้าหมาย 500฿' },
        { id: 'CARD_SHIELD', name: 'การ์ดโล่ป้องกัน', icon: '🛡️', price: 400, desc: 'ป้องกันการ์ดแกล้ง 1 ครั้ง' },
      ];`;

content = content.replace(targetStr, newStr);

fs.writeFileSync(path, content, 'utf8');
console.log("Patched SHOP_ITEMS in page.js");
