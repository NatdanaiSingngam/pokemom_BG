const fs = require('fs');

const path = 'C:/Users/xxxx-xx-x--xxxx-x/.gemini/antigravity/scratch/pokemon_board_game/frontend/src/app/page.js';
let content = fs.readFileSync(path, 'utf8');

const targetStr = `  const POKEMON_CLASSES = [
    { id: 'trainer', name: 'โปเกมอนเทรนเนอร์', icon: '🧢', desc: 'มีโบนัสแต้มหนุน +1 ทุกครั้งที่โยนบอลจับมอน!' },
    { id: 'breeder', name: 'บรีดเดอร์', icon: '🥚', desc: 'ลูกเต๋าทอยได้ต่ำสุด 2 ตลอดกาล' },
    { id: 'ranger', name: 'แรงเจอร์', icon: '⛺', desc: 'ไม่ได้รับผลเสียจากช่อง EVENT ป่า' },
    { id: 'researcher', name: 'นักวิจัย', icon: '🔬', desc: 'ดูไพ่เหตุการณ์ล่วงหน้าได้ 1 ใบ' },
  ];`;

const replacement = `  const POKEMON_CLASSES = [
    { id: 'trainer', name: 'โปเกมอนเทรนเนอร์', icon: '🧢', desc: 'โบนัสแต้ม +1 ทอยเต๋าจับมอน (เริ่มด้วย พิคาชู)' },
    { id: 'breeder', name: 'บรีดเดอร์', icon: '🥚', desc: 'ลูกเต๋าทอยได้ต่ำสุด 2 ตลอดกาล (เริ่มด้วย อีวุย)' },
    { id: 'rocket', name: 'แก๊งร็อคเก็ต', icon: '🚀', desc: 'ขโมยเงินได้ +500 เมื่อปล้นสำเร็จ (เริ่มด้วย ซูแบท)' },
    { id: 'researcher', name: 'นักวิจัย', icon: '🔬', desc: 'ดูไพ่เหตุการณ์ล่วงหน้าได้ 1 ใบ (เริ่มด้วย พารีกอน)' },
    { id: 'gym_leader', name: 'หัวหน้ายิม', icon: '🥊', desc: 'ทอยเต๋าต่อสู้ยิมได้แต้ม +2 เสมอ (เริ่มด้วย วันริกี)' },
    { id: 'camper', name: 'แคมเปอร์', icon: '⛺', desc: 'โอกาสเจอโปเกมอน Common ในป่า +10% (เริ่มด้วย คาเตอร์ปี)' },
    { id: 'psychic', name: 'พลังจิต', icon: '🔮', desc: 'ลดเวลาติดคุกเหลือ 1 เทิร์นเสมอ (เริ่มด้วย เคซี)' },
    { id: 'swimmer', name: 'นักว่ายน้ำ', icon: '🩱', desc: 'ซื้อไอเทมที่ร้านค้าลดราคา 20% (เริ่มด้วย เซนิกาเมะ)' }
  ];`;

content = content.replace(targetStr, replacement);

fs.writeFileSync(path, content, 'utf8');
console.log("Patched POKEMON_CLASSES in page.js");
