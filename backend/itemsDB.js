const ITEMS_DB = [
  { id: 'bicycle', name: 'จักรยาน (Bicycle)', type: 'MOVEMENT', price: 500, description: 'ปั่นฉิว! ทอยเต๋าเดินเพิ่ม 1 ลูกในเทิร์นนี้' },
  { id: 'poke_ball', name: 'Poké Ball', type: 'CATCH', price: 200, description: 'ลูกบอลพื้นฐาน ใช้โยนจับโปเกมอนทั่วไป (ใช้ 1 ลูก/การจับ)' },
  { id: 'ultra_ball', name: 'Ultra Ball', type: 'CATCH', price: 1000, description: 'เพิ่มเรทการจับให้ง่ายขึ้น ถือว่าทอยเต๋า +2 แต้ม' },
  { id: 'nugget', name: 'ก้อนทองคำ (Nugget)', type: 'SELL', price: 1000, description: 'ไอเทมขยะทองคำ เก็บไว้เอาไปกดขายเพื่อรับเงิน 3,000 ฿' },
  { id: 'escape_rope', name: 'เชือกหลบหนี (Escape Rope)', type: 'MOVEMENT', price: 400, description: 'วาร์ปตัวเองกลับไปที่ "เมือง (จุดเริ่มต้น)" ที่ใกล้ที่สุดทันที' },
  { id: 'full_heal', name: 'ยารักษา (Full Heal)', type: 'HEAL', price: 300, description: 'ล้างสถานะผิดปกติทั้งหมด (หลับ, พิษ, ชา)' },
  { id: 'max_repel', name: 'สเปรย์ไล่ (Max Repel)', type: 'DEFENSE', price: 600, description: 'กางบาเรีย ไม่ให้คนอื่นใช้สกิลใส่ หรือหนีอีเวนต์ร้ายๆ ได้ 2 เทิร์น' },
  { id: 'rocket_uniform', name: 'ชุดแก๊งร็อคเก็ต (Team Rocket Uniform)', type: 'ATTACK', price: 1000, description: 'เนียนเป็นโจรกระชากการ์ด 1 ใบจากมือเป้าหมาย (สุ่มเด็ดการ์ดบนมือ)' },
  { id: 'snorlax_flute', name: 'ขลุ่ยปลุกคาบิกอน (Snorlax Flute)', type: 'TRAP', price: 1500, description: 'เสกคาบิกอนไปขวางทางบล็อคช่องเดิน 1 เส้นทาง (ใครเดินผ่านหยุดทันที)' },
  { id: 'exp_share', name: 'เครื่องแบ่งประสบการณ์ (EXP Share)', type: 'PASSIVE_BUFF', price: 2000, description: 'แอบดูดเงินเพื่อน! พอกดใช้เล็งเป้าหมาย เค้าได้เงิน เราจะได้ด้วย 20%' }
];

module.exports = ITEMS_DB;
