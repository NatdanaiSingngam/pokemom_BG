const fs = require('fs');

const path = 'C:/Users/xxxx-xx-x--xxxx-x/.gemini/antigravity/scratch/pokemon_board_game/frontend/src/app/page.js';
let content = fs.readFileSync(path, 'utf8');

// 1. Replace POKEMON_CLASSES
const classesStart = content.indexOf('const POKEMON_CLASSES = [');
const classesEnd = content.indexOf('];', classesStart) + 2;

const newClasses = `const POKEMON_CLASSES = [
  { id: 'rookie', name: 'เทรนเนอร์หน้าใหม่ (Rookie)', icon: '🧢', starterPokemon: 'mon_133', passiveDetails: 'ทอยเต๋าใหม่ได้ 1 ครั้งต่อเทิร์น', activeDetails: '', ultimateDetails: 'Evolve!: สุ่มพัฒนาร่างอีวุยเพื่อรับบัฟพิเศษ' },
  { id: 'bug_catcher', name: 'นักจับแมลง (Bug Catcher)', icon: '🦋', starterPokemon: 'mon_010', passiveDetails: 'ทอยเต๋าจับโปเกมอนประเภทแมลงและพืช +1 แต้ม', activeDetails: '', ultimateDetails: 'Sleep Powder: ทำให้ทุกคนข้าม 1 เทิร์น' },
  { id: 'hiker', name: 'นักปีนเขา (Hiker)', icon: '⛰️', starterPokemon: 'mon_074', passiveDetails: 'ไม่โดนเอฟเฟกต์การ์ดหยุดเดิน', activeDetails: '', ultimateDetails: 'Earthquake: แผ่นดินไหว! ผู้เล่นรอบข้างเสียเงิน 20%' },
  { id: 'rocket_grunt', name: 'ลูกสมุนร็อคเก็ต (Rocket Grunt)', icon: '🚀', starterPokemon: 'mon_041', passiveDetails: 'เดินผ่านใคร ขโมยเงิน 100 ฿ ทันที', activeDetails: '', ultimateDetails: 'Snatch: สุ่มขโมยโปเกมอน 1 ตัว จากเป้าหมาย' },
  { id: 'beauty', name: 'สาวงาม (Beauty)', icon: '💄', starterPokemon: 'mon_037', passiveDetails: 'ซื้อของลด 20% / ขายแพงขึ้น 10%', activeDetails: '', ultimateDetails: 'Attract: บังคับผู้เล่น 1 คนกระโดดมาหา' },
  { id: 'swimmer', name: 'นักว่ายน้ำ (Swimmer)', icon: '🩱', starterPokemon: 'mon_116', passiveDetails: 'ตกช่องสระน้ำ จั่วการ์ดฟรี 1 ใบ', activeDetails: '', ultimateDetails: 'Whirlpool: วางน้ำวน ใครตกจะเสีย 1 เทิร์น' },
  { id: 'fisherman', name: 'นักตกปลา (Fisherman)', icon: '🎣', starterPokemon: 'mon_129', passiveDetails: 'ทอยได้เลข 1 รับเงิน 300 ฿', activeDetails: '', ultimateDetails: 'Intimidate: ทุกคนถอยหลัง 3 ช่องเทิร์นหน้า' },
  { id: 'psychic', name: 'เอสเปอร์ (Psychic)', icon: '🔮', starterPokemon: 'mon_063', passiveDetails: 'กดฉีกไพ่บนมือ 1 ใบเพื่อสลับที่กับคนใกล้สุด', activeDetails: '', ultimateDetails: 'HypnoPendulum: บังคับทุกคนทิ้งการ์ดให้หมดกระเป๋า' },
  { id: 'biker', name: 'เด็กแว้น (Biker)', icon: '🏍️', starterPokemon: 'mon_109', passiveDetails: 'ทอยเต๋า +2 แต้มเสมอ แต่เสียน้ำมัน 150 ฿/เทิร์น', activeDetails: '', ultimateDetails: 'Smokescreen: ปล่อยควันพิษ คลุมบอร์ด 1 โซน' },
  { id: 'gambler', name: 'นักพนัน (Gambler)', icon: '🎰', starterPokemon: 'mon_052', passiveDetails: 'Pay Day: เดินปุ๊บได้เงิน = แต้ม x 50', activeDetails: '', ultimateDetails: 'Jackpot: โยนเหรียญ! เสีย 3000 หรือ ได้ 3000' },
  { id: 'aroma_lady', name: 'นักพฤกษศาสตร์ (Aroma Lady)', icon: '🌸', starterPokemon: 'mon_043', passiveDetails: 'เดินผ่านวางกับดักพิษตามรอยเท้า', activeDetails: '', ultimateDetails: 'Solar Beam: ระเบิดช่อง 1 ช่องทิ้งไปเลย' },
  { id: 'black_belt', name: 'จอมคาราเต้ (Black Belt)', icon: '🥋', starterPokemon: 'mon_066', passiveDetails: 'สู้ยิมหน้าเต๋า +2 แต้มเสมอ', activeDetails: '', ultimateDetails: 'Seismic Toss: จับใครก็ได้ 1 คนโยนกระเด็นสุ่มช่อง' },
  { id: 'channeler', name: 'หมอผี (Channeler)', icon: '👻', starterPokemon: 'mon_092', passiveDetails: 'สาปแช่ง 300฿ ให้ศัตรูทิ้งไพ่รัวๆ', activeDetails: '', ultimateDetails: 'Destiny Bond: สลับเงินตัวเองกับเป้าหมาย!' },
  { id: 'ranger', name: 'พรานป่า (Ranger)', icon: '🏕️', starterPokemon: 'mon_123', passiveDetails: 'เข้า Safari ฟรี! แถมโปเกบอลฟรี 1 ลูก', activeDetails: '', ultimateDetails: 'Slash & Steal: ฟันฉับ ขโมยไพ่คู่กรณี 2 ใบ' },
  { id: 'scientist', name: 'นักวิทยาศาสตร์ (Scientist)', icon: '🧪', starterPokemon: 'mon_081', passiveDetails: 'จั่ว 2 ใบ เลือกทิ้ง 1 เก็บ 1 ในช่วงเริ่มเทิร์น', activeDetails: '', ultimateDetails: 'Master Clone: ก๊อปอัลติเมทใครก็ได้ 1 ท่า' },
  { id: 'rich_boy', name: 'คุณหนูไฮโซ (Rich Boy)', icon: '💎', starterPokemon: 'mon_058', passiveDetails: 'เริ่มเกมมีเงินทุนทันที 5,000 ฿!', activeDetails: '', ultimateDetails: 'Bribe System: ยัดเงินซื้อโปเกมอนป่าไม่ต้องทอยเต๋า' }
];

const ITEMS_DB = [
  { id: 'bicycle', name: 'จักรยาน (Bicycle)', type: 'MOVEMENT', price: 500, description: 'ปั่นฉิว! ทอยเต๋าเดินเพิ่ม 1 ลูกในเทิร์นนี้' },
  { id: 'poke_ball', name: 'Poké Ball', type: 'CATCH', price: 200, description: 'ใช้โยนจับโปเกมอน (ไม่นับเป็นโควต้า 5 ใบ)' },
  { id: 'ultra_ball', name: 'Ultra Ball', type: 'CATCH', price: 1000, description: 'ทอย+2 (ไม่นับโควต้า 5 ใบ)' },
  { id: 'nugget', name: 'ก้อนทองคำ (Nugget)', type: 'SELL', price: 1000, description: 'กดสลายได้เงิน 3000฿' },
  { id: 'escape_rope', name: 'เชือกหลบหนี (Escape Rope)', type: 'MOVEMENT', price: 400, description: 'วาร์ปกลับเมือง' },
  { id: 'full_heal', name: 'ยารักษา (Full Heal)', type: 'HEAL', price: 300, description: 'ล้างสถานะผิดปกติ' },
  { id: 'max_repel', name: 'สเปรย์ไล่ (Max Repel)', type: 'DEFENSE', price: 600, description: 'กางบาเรีย 2 เทิร์น' },
  { id: 'rocket_uniform', name: 'เสื้อร็อคเก็ต (Team Rocket Uniform)', type: 'ATTACK', price: 1000, description: 'ขโมยไพ่คนรอบตัว' },
  { id: 'snorlax_flute', name: 'ขลุ่ยคาบิกอน (Snorlax Flute)', type: 'TRAP', price: 1500, description: 'เสกคาบิกอนขวางทาง' },
  { id: 'exp_share', name: 'EXP Share', type: 'PASSIVE_BUFF', price: 2000, description: 'ดูดเงินเพื่อน 20%' }
];`;

content = content.substring(0, classesStart) + newClasses + content.substring(classesEnd);

// 2. Remove old SHOP_ITEMS
const shopStart = content.indexOf('const SHOP_ITEMS = ');
const shopEnd = content.indexOf('];', shopStart) + 2;
content = content.substring(0, shopStart) + "const SHOP_ITEMS = ITEMS_DB;" + content.substring(shopEnd);


fs.writeFileSync(path, content, 'utf8');
console.log("Patched page.js basic structures");
