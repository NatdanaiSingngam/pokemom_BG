'use client';

import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'https://pokemombg-production.up.railway.app';

const EVOLUTIONS = {
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

const RAW_POKEMON_DB = [
  { id: 1, name: "ฟุชิงิดาเนะ", types: ["Grass", "Poison"], rarity: "Rare", basePrice: 3000 },
  { id: 2, name: "ฟุชิงิโซ", types: ["Grass", "Poison"], rarity: "Rare", basePrice: 3000 },
  { id: 3, name: "ฟุชิงิบานะ", types: ["Grass", "Poison"], rarity: "Very Rare", basePrice: 6000 },
  { id: 4, name: "ฮิโตคาเงะ", types: ["Fire"], rarity: "Rare", basePrice: 3000 },
  { id: 5, name: "ลิซาร์โด", types: ["Fire"], rarity: "Rare", basePrice: 3000 },
  { id: 6, name: "ลิซาร์ดอน", types: ["Fire", "Flying"], rarity: "Very Rare", basePrice: 6000 },
  { id: 7, name: "เซนิกาเมะ", types: ["Water"], rarity: "Rare", basePrice: 3000 },
  { id: 8, name: "คาเมล", types: ["Water"], rarity: "Rare", basePrice: 3000 },
  { id: 9, name: "คาเม็กซ์", types: ["Water"], rarity: "Very Rare", basePrice: 6000 },
  { id: 10, name: "คาเตอร์ปี", types: ["Bug"], rarity: "Common", basePrice: 1000 },
  { id: 11, name: "ทรานเซล", types: ["Bug"], rarity: "Common", basePrice: 1000 },
  { id: 12, name: "บัตเตอร์ฟรี", types: ["Bug", "Flying"], rarity: "Common", basePrice: 1000 },
  { id: 13, name: "บีเดิล", types: ["Bug", "Poison"], rarity: "Common", basePrice: 1000 },
  { id: 14, name: "โคคูน", types: ["Bug", "Poison"], rarity: "Common", basePrice: 1000 },
  { id: 15, name: "สเปียร์", types: ["Bug", "Poison"], rarity: "Common", basePrice: 1000 },
  { id: 16, name: "ป๊ปโปะ", types: ["Normal", "Flying"], rarity: "Common", basePrice: 1000 },
  { id: 17, name: "พีเจียน", types: ["Normal", "Flying"], rarity: "Common", basePrice: 1000 },
  { id: 18, name: "พีเจียต", types: ["Normal", "Flying"], rarity: "Rare", basePrice: 3000 },
  { id: 19, name: "โครัตตา", types: ["Normal"], rarity: "Common", basePrice: 1000 },
  { id: 20, name: "รัตตา", types: ["Normal"], rarity: "Common", basePrice: 1000 },
  { id: 21, name: "โอนิซูซุเมะ", types: ["Normal", "Flying"], rarity: "Common", basePrice: 1000 },
  { id: 22, name: "โอนิดริว", types: ["Normal", "Flying"], rarity: "Common", basePrice: 1000 },
  { id: 23, name: "อาร์โบ", types: ["Poison"], rarity: "Common", basePrice: 1000 },
  { id: 24, name: "อาร์บ็อก", types: ["Poison"], rarity: "Rare", basePrice: 3000 },
  { id: 25, name: "พิคาชู", types: ["Electric"], rarity: "Rare", basePrice: 3000 },
  { id: 26, name: "ไรชู", types: ["Electric"], rarity: "Rare", basePrice: 3000 },
  { id: 27, name: "แซนด์", types: ["Ground"], rarity: "Common", basePrice: 1000 },
  { id: 28, name: "แซนด์แพน", types: ["Ground"], rarity: "Rare", basePrice: 3000 },
  { id: 29, name: "นิโดรัน♀", types: ["Poison"], rarity: "Common", basePrice: 1000 },
  { id: 30, name: "นิโดรินา", types: ["Poison"], rarity: "Common", basePrice: 1000 },
  { id: 31, name: "นิโดควีน", types: ["Poison", "Ground"], rarity: "Rare", basePrice: 3000 },
  { id: 32, name: "นิโดรัน♂", types: ["Poison"], rarity: "Common", basePrice: 1000 },
  { id: 33, name: "นิโดริโน", types: ["Poison"], rarity: "Common", basePrice: 1000 },
  { id: 34, name: "นิโดคิง", types: ["Poison", "Ground"], rarity: "Rare", basePrice: 3000 },
  { id: 35, name: "ปิปปี", types: ["Normal"], rarity: "Rare", basePrice: 3000 },
  { id: 36, name: "พิกซี", types: ["Normal"], rarity: "Rare", basePrice: 3000 },
  { id: 37, name: "โรคอน", types: ["Fire"], rarity: "Rare", basePrice: 3000 },
  { id: 38, name: "คิวคอน", types: ["Fire"], rarity: "Very Rare", basePrice: 6000 },
  { id: 39, name: "พูริน", types: ["Normal"], rarity: "Common", basePrice: 1000 },
  { id: 40, name: "พุคุริน", types: ["Normal"], rarity: "Rare", basePrice: 3000 },
  { id: 41, name: "ซูแบท", types: ["Poison", "Flying"], rarity: "Common", basePrice: 1000 },
  { id: 42, name: "โกลแบท", types: ["Poison", "Flying"], rarity: "Common", basePrice: 1000 },
  { id: 43, name: "นาโซโนะคุสะ", types: ["Grass", "Poison"], rarity: "Common", basePrice: 1000 },
  { id: 44, name: "คุไซฮานะ", types: ["Grass", "Poison"], rarity: "Common", basePrice: 1000 },
  { id: 45, name: "รัฟเฟลเซีย", types: ["Grass", "Poison"], rarity: "Rare", basePrice: 3000 },
  { id: 46, name: "พารัส", types: ["Bug", "Grass"], rarity: "Common", basePrice: 1000 },
  { id: 47, name: "พาราเซกต์", types: ["Bug", "Grass"], rarity: "Rare", basePrice: 3000 },
  { id: 48, name: "คองปัง", types: ["Bug", "Poison"], rarity: "Common", basePrice: 1000 },
  { id: 49, name: "มอร์ฟอน", types: ["Bug", "Poison"], rarity: "Rare", basePrice: 3000 },
  { id: 50, name: "ดิกด้า", types: ["Ground"], rarity: "Common", basePrice: 1000 },
  { id: 51, name: "ดักทริโอ", types: ["Ground"], rarity: "Rare", basePrice: 3000 },
  { id: 52, name: "เนียส", types: ["Normal"], rarity: "Common", basePrice: 1000 },
  { id: 53, name: "เพอร์เซียน", types: ["Normal"], rarity: "Rare", basePrice: 3000 },
  { id: 54, name: "โคดัก", types: ["Water"], rarity: "Common", basePrice: 1000 },
  { id: 55, name: "โกลดัก", types: ["Water"], rarity: "Rare", basePrice: 3000 },
  { id: 56, name: "แมนคี", types: ["Fighting"], rarity: "Common", basePrice: 1000 },
  { id: 57, name: "โอโคริซารุ", types: ["Fighting"], rarity: "Rare", basePrice: 3000 },
  { id: 58, name: "การ์ดี", types: ["Fire"], rarity: "Rare", basePrice: 3000 },
  { id: 59, name: "วินดี", types: ["Fire"], rarity: "Very Rare", basePrice: 6000 },
  { id: 60, name: "เนียวโรโมะ", types: ["Water"], rarity: "Common", basePrice: 1000 },
  { id: 61, name: "เนียวโรโซ", types: ["Water"], rarity: "Common", basePrice: 1000 },
  { id: 62, name: "เนียวโรบอม", types: ["Water", "Fighting"], rarity: "Rare", basePrice: 3000 },
  { id: 63, name: "เคซี", types: ["Psychic"], rarity: "Rare", basePrice: 3000 },
  { id: 64, name: "ยุนเกเรอร์", types: ["Psychic"], rarity: "Rare", basePrice: 3000 },
  { id: 65, name: "ฟูดิน", types: ["Psychic"], rarity: "Very Rare", basePrice: 6000 },
  { id: 66, name: "วันริกี", types: ["Fighting"], rarity: "Common", basePrice: 1000 },
  { id: 67, name: "โกริกี", types: ["Fighting"], rarity: "Common", basePrice: 1000 },
  { id: 68, name: "ไคริกี", types: ["Fighting"], rarity: "Very Rare", basePrice: 6000 },
  { id: 69, name: "มาดาสึโบมิ", types: ["Grass", "Poison"], rarity: "Common", basePrice: 1000 },
  { id: 70, name: "อุตสึดง", types: ["Grass", "Poison"], rarity: "Common", basePrice: 1000 },
  { id: 71, name: "อุตสึบอท", types: ["Grass", "Poison"], rarity: "Rare", basePrice: 3000 },
  { id: 72, name: "เมโนคุราเกะ", types: ["Water", "Poison"], rarity: "Common", basePrice: 1000 },
  { id: 73, name: "โดคุคุราเกะ", types: ["Water", "Poison"], rarity: "Rare", basePrice: 3000 },
  { id: 74, name: "อิชิซึบุเตะ", types: ["Rock", "Ground"], rarity: "Common", basePrice: 1000 },
  { id: 75, name: "โกโลน", types: ["Rock", "Ground"], rarity: "Common", basePrice: 1000 },
  { id: 76, name: "โกโลเนีย", types: ["Rock", "Ground"], rarity: "Very Rare", basePrice: 6000 },
  { id: 77, name: "โพนีตา", types: ["Fire"], rarity: "Rare", basePrice: 3000 },
  { id: 78, name: "แกลลอป", types: ["Fire"], rarity: "Very Rare", basePrice: 6000 },
  { id: 79, name: "ยาดง", types: ["Water", "Psychic"], rarity: "Common", basePrice: 1000 },
  { id: 80, name: "ยาโดรัน", types: ["Water", "Psychic"], rarity: "Rare", basePrice: 3000 },
  { id: 81, name: "คอยล์", types: ["Electric"], rarity: "Common", basePrice: 1000 },
  { id: 82, name: "เรคอยล์", types: ["Electric"], rarity: "Rare", basePrice: 3000 },
  { id: 83, name: "คาโมเนกิ", types: ["Normal", "Flying"], rarity: "Very Rare", basePrice: 6000 },
  { id: 84, name: "โดโด", types: ["Normal", "Flying"], rarity: "Common", basePrice: 1000 },
  { id: 85, name: "โดโดริโอ", types: ["Normal", "Flying"], rarity: "Rare", basePrice: 3000 },
  { id: 86, name: "เพาแวง", types: ["Water"], rarity: "Common", basePrice: 1000 },
  { id: 87, name: "จูกอน", types: ["Water", "Ice"], rarity: "Very Rare", basePrice: 6000 },
  { id: 88, name: "เบโตเบตา", types: ["Poison"], rarity: "Common", basePrice: 1000 },
  { id: 89, name: "เบโตเบตอน", types: ["Poison"], rarity: "Rare", basePrice: 3000 },
  { id: 90, name: "เชลเดอร์", types: ["Water"], rarity: "Common", basePrice: 1000 },
  { id: 91, name: "พาร์เชน", types: ["Water", "Ice"], rarity: "Very Rare", basePrice: 6000 },
  { id: 92, name: "กอส", types: ["Ghost", "Poison"], rarity: "Very Rare", basePrice: 6000 },
  { id: 93, name: "โกสต์", types: ["Ghost", "Poison"], rarity: "Very Rare", basePrice: 6000 },
  { id: 94, name: "เก็งการ์", types: ["Ghost", "Poison"], rarity: "Very Rare", basePrice: 6000 },
  { id: 95, name: "อิวาร์ค", types: ["Rock", "Ground"], rarity: "Very Rare", basePrice: 6000 },
  { id: 96, name: "สลีป", types: ["Psychic"], rarity: "Common", basePrice: 1000 },
  { id: 97, name: "สลีปเปอร์", types: ["Psychic"], rarity: "Rare", basePrice: 3000 },
  { id: 98, name: "แคร็บ", types: ["Water"], rarity: "Common", basePrice: 1000 },
  { id: 99, name: "คิงเกลอร์", types: ["Water"], rarity: "Rare", basePrice: 3000 },
  { id: 100, name: "บิริริดามา", types: ["Electric"], rarity: "Common", basePrice: 1000 },
  { id: 101, name: "มารุมายน์", types: ["Electric"], rarity: "Rare", basePrice: 3000 },
  { id: 102, name: "ทามาทามะ", types: ["Grass", "Psychic"], rarity: "Rare", basePrice: 3000 },
  { id: 103, name: "นัซซี", types: ["Grass", "Psychic"], rarity: "Very Rare", basePrice: 6000 },
  { id: 104, name: "คิวบอน", types: ["Ground"], rarity: "Rare", basePrice: 3000 },
  { id: 105, name: "การะการะ", types: ["Ground"], rarity: "Very Rare", basePrice: 6000 },
  { id: 106, name: "ซาวามูลาร์", types: ["Fighting"], rarity: "Very Rare", basePrice: 6000 },
  { id: 107, name: "เอบิวาลาร์", types: ["Fighting"], rarity: "Very Rare", basePrice: 6000 },
  { id: 108, name: "เบโรรินกา", types: ["Normal"], rarity: "Very Rare", basePrice: 6000 },
  { id: 109, name: "โดกัส", types: ["Poison"], rarity: "Common", basePrice: 1000 },
  { id: 110, name: "มาตาโดกัส", types: ["Poison"], rarity: "Rare", basePrice: 3000 },
  { id: 111, name: "ไซฮอร์น", types: ["Ground", "Rock"], rarity: "Rare", basePrice: 3000 },
  { id: 112, name: "ไซดอน", types: ["Ground", "Rock"], rarity: "Very Rare", basePrice: 6000 },
  { id: 113, name: "ลัคกี", types: ["Normal"], rarity: "Very Rare", basePrice: 6000 },
  { id: 114, name: "มอนจารา", types: ["Grass"], rarity: "Very Rare", basePrice: 6000 },
  { id: 115, name: "การูรา", types: ["Normal"], rarity: "Very Rare", basePrice: 6000 },
  { id: 116, name: "ทัททู", types: ["Water"], rarity: "Common", basePrice: 1000 },
  { id: 117, name: "ซีดรา", types: ["Water"], rarity: "Very Rare", basePrice: 6000 },
  { id: 118, name: "โทซาคินโตะ", types: ["Water"], rarity: "Common", basePrice: 1000 },
  { id: 119, name: "อซึมาโอ", types: ["Water"], rarity: "Rare", basePrice: 3000 },
  { id: 120, name: "ฮิโตเดมัน", types: ["Water"], rarity: "Rare", basePrice: 3000 },
  { id: 121, name: "สตาร์มี", types: ["Water", "Psychic"], rarity: "Very Rare", basePrice: 6000 },
  { id: 122, name: "บาร์เรียด", types: ["Psychic"], rarity: "Very Rare", basePrice: 6000 },
  { id: 123, name: "สไตรค์", types: ["Bug", "Flying"], rarity: "Very Rare", basePrice: 6000 },
  { id: 124, name: "รูจูลา", types: ["Ice", "Psychic"], rarity: "Very Rare", basePrice: 6000 },
  { id: 125, name: "เอเลบู", types: ["Electric"], rarity: "Very Rare", basePrice: 6000 },
  { id: 126, name: "บูเบอร์", types: ["Fire"], rarity: "Very Rare", basePrice: 6000 },
  { id: 127, name: "ไคลอส", types: ["Bug"], rarity: "Very Rare", basePrice: 6000 },
  { id: 128, name: "เคนทารอส", types: ["Normal"], rarity: "Very Rare", basePrice: 6000 },
  { id: 129, name: "คอยคิง", types: ["Water"], rarity: "Common", basePrice: 1000 },
  { id: 130, name: "เกียราดอส", types: ["Water", "Flying"], rarity: "Very Rare", basePrice: 6000 },
  { id: 131, name: "ลาพลาส", types: ["Water", "Ice"], rarity: "Very Rare", basePrice: 6000 },
  { id: 132, name: "เมตามอน", types: ["Normal"], rarity: "Very Rare", basePrice: 6000 },
  { id: 133, name: "อีวุย", types: ["Normal"], rarity: "Very Rare", basePrice: 6000 },
  { id: 134, name: "ชาวเวอร์ส", types: ["Water"], rarity: "Very Rare", basePrice: 6000 },
  { id: 135, name: "ธันเดอร์ส", types: ["Electric"], rarity: "Very Rare", basePrice: 6000 },
  { id: 136, name: "บูสเตอร์", types: ["Fire"], rarity: "Very Rare", basePrice: 6000 },
  { id: 137, name: "พารีกอน", types: ["Normal"], rarity: "Very Rare", basePrice: 6000 },
  { id: 138, name: "โอมไนต์", types: ["Rock", "Water"], rarity: "Very Rare", basePrice: 6000 },
  { id: 139, name: "ออมสตาร์", types: ["Rock", "Water"], rarity: "Very Rare", basePrice: 6000 },
  { id: 140, name: "คาบุโตะ", types: ["Rock", "Water"], rarity: "Very Rare", basePrice: 6000 },
  { id: 141, name: "คาบุตปส์", types: ["Rock", "Water"], rarity: "Very Rare", basePrice: 6000 },
  { id: 142, name: "พเทอรา", types: ["Rock", "Flying"], rarity: "Very Rare", basePrice: 6000 },
  { id: 143, name: "คาบิกอน", types: ["Normal"], rarity: "Very Rare", basePrice: 6000 },
  { id: 144, name: "ฟรีเซอร์", types: ["Ice", "Flying"], rarity: "Legendary", basePrice: 15000 },
  { id: 145, name: "ธันเดอร์", types: ["Electric", "Flying"], rarity: "Legendary", basePrice: 15000 },
  { id: 146, name: "ไฟเยอร์", types: ["Fire", "Flying"], rarity: "Legendary", basePrice: 15000 },
  { id: 147, name: "มินิริว", types: ["Dragon"], rarity: "Very Rare", basePrice: 6000 },
  { id: 148, name: "ฮาคุริว", types: ["Dragon"], rarity: "Very Rare", basePrice: 6000 },
  { id: 149, name: "ไคริว", types: ["Dragon", "Flying"], rarity: "Very Rare", basePrice: 6000 },
  { id: 150, name: "มิวทู", types: ["Psychic"], rarity: "Legendary", basePrice: 15000 },
  { id: 151, name: "มิว", types: ["Psychic"], rarity: "Legendary", basePrice: 15000 }
];

const typeEmojis = {
  "Grass": "🌱", "Poison": "☠️", "Fire": "🔥", "Flying": "🦅", 
  "Water": "💧", "Bug": "🐞", "Normal": "🐾", "Electric": "⚡", 
  "Ground": "🪨", "Rock": "🪨", "Fighting": "🥊", "Psychic": "🔮", 
  "Ghost": "👻", "Ice": "🧊", "Dragon": "🐉"
};

const POKEMON_DB = RAW_POKEMON_DB.map(p => ({
  id: `mon_${p.id.toString().padStart(3, '0')}`,
  name: p.name,
  types: p.types,
  rarity: p.rarity,
  price: p.basePrice,
  image: typeEmojis[p.types[0]] || "🐾" 
}));

const POKEMON_CLASSES = [
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
  { id: 'bicycle', name: 'จักรยาน (Bicycle)', type: 'MOVEMENT', price: 500, description: 'ปั่นฉิว! ทอยเต๋าเดินเพิ่ม 1 ลูกในเทิร์นนี้', icon: '🚲' },
  { id: 'poke_ball', name: 'Poké Ball', type: 'CATCH', price: 200, description: 'ใช้โยนจับโปเกมอน (ไม่นับเป็นโควต้า 5 ใบ)', icon: '🔴' },
  { id: 'ultra_ball', name: 'Ultra Ball', type: 'CATCH', price: 1000, description: 'ทอย+2 (ไม่นับโควต้า 5 ใบ)', icon: '🟣' },
  { id: 'nugget', name: 'ก้อนทองคำ (Nugget)', type: 'SELL', price: 1000, description: 'กดสลายได้เงิน 3000฿', icon: '🥇' },
  { id: 'escape_rope', name: 'เชือกหลบหนี (Escape Rope)', type: 'MOVEMENT', price: 400, description: 'วาร์ปกลับเมือง', icon: '🧶' },
  { id: 'full_heal', name: 'ยารักษา (Full Heal)', type: 'HEAL', price: 300, description: 'ล้างสถานะผิดปกติ', icon: '💊' },
  { id: 'max_repel', name: 'สเปรย์ไล่ (Max Repel)', type: 'DEFENSE', price: 600, description: 'กางบาเรีย 2 เทิร์น', icon: '🧴' },
  { id: 'rocket_uniform', name: 'เสื้อร็อคเก็ต (Team Rocket Uniform)', type: 'ATTACK', price: 1000, description: 'ขโมยไพ่คนรอบตัว', icon: '👕' },
  { id: 'snorlax_flute', name: 'ขลุ่ยคาบิกอน (Snorlax Flute)', type: 'TRAP', price: 1500, description: 'เสกคาบิกอนขวางทาง', icon: '🪈' },
  { id: 'exp_share', name: 'EXP Share', type: 'PASSIVE_BUFF', price: 2000, description: 'ดูดเงินเพื่อน 20%', icon: '📡' }
];

export default function Home() {
  const [socket, setSocket] = useState(null);
  
  // State 
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');
  
  const [isConnected, setIsConnected] = useState(false);
  const [gameState, setGameState] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [diceLog, setDiceLog] = useState(''); // เก็บไว้แสดงผลลูกเต๋า
  const [landedTile, setLandedTile] = useState(null);
  const [safariData, setSafariData] = useState(null);
  const [gymData, setGymData] = useState(null);
  const [encounterData, setEncounterData] = useState(null); // เก็บโปเกมอนที่เจอตามป่า
  const [catchResult, setCatchResult] = useState(null); // ผลการจับโปเกมอน
  const [showInventory, setShowInventory] = useState(false); // Modal กระเป๋า
  const [handLimitMsg, setHandLimitMsg] = useState('');
  const [isRolling, setIsRolling] = useState(false); // สถานะกำลังทอยเต๋าหมุนๆ
  const [rollingDiceFace, setRollingDiceFace] = useState(1); // หน้าลูกเต๋าหลอกๆ ตอนหมุน 1
  const [rollingDiceFace2, setRollingDiceFace2] = useState(6); // หน้าลูกเต๋าหลอกๆ ตอนหมุน 2
  const [isCatchRolling, setIsCatchRolling] = useState(false); // หมุนเต๋าจับโปเกมอน
  const [catchRollingFace, setCatchRollingFace] = useState(1);
  const [shopFeedback, setShopFeedback] = useState(null); // ข้อความตอบกลับจากร้านค้า
  const [gymRollResult, setGymRollResult] = useState(null); // ผลทอยเต๋ายิม { roll, won, gymPower }
  const [isGymRolling, setIsGymRolling] = useState(false);
  const [gymRollingFace, setGymRollingFace] = useState(1);
  const [eventCardData, setEventCardData] = useState(null); // ข้อมูลการ์ด EVENT ที่จั่วมาได้
  const [activeEventSocketId, setActiveEventSocketId] = useState(null);
  const [activeEventPlayerName, setActiveEventPlayerName] = useState('');
  const [gameOverData, setGameOverData] = useState(null);

  // New States for Classes/Mechs
  const [diceResult, setDiceResult] = useState(null); // { total, d1, d2 }
  const [turnDrawData, setTurnDrawData] = useState(null); // { card, cardName, autoAdded, reason }
  const [scientistChoice, setScientistChoice] = useState(null); // { cards: [] }
  const [pendingReroll, setPendingReroll] = useState(null); // { d1, d2, result }



  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('connect', () => {
      console.log('Connected to socket server:', socket.id);
    });

    socket.on('update_game_state', (state) => {
      setGameState(prev => {
        // ถ้า currentPlayerIndex เปลี่ยน (เทิร์นถ่ายไปคนอื่น) ให้ล้าง Modal ทั้งหมด
        if (prev && prev.currentPlayerIndex !== state.currentPlayerIndex) {
          setLandedTile(null);
          setEncounterData(null);
          setCatchResult(null);
          setSafariData(null);
          setGymData(null);
          setGymRollResult(null);
          setEventCardData(null);
          setActiveEventSocketId(null);
          setActiveEventPlayerName('');
        }
        return state;
      });
      setIsConnected(true);
      setErrorMsg('');
    });

    socket.on('hand_full_discard_required', (data) => {
      setHandLimitMsg(data.message);
      setShowInventory(true);
    });

    socket.on('action_feedback', (feedback) => {
      if (feedback.type === 'ERROR') {
        setErrorMsg(feedback.message);
        setTimeout(() => setErrorMsg(''), 3000); // เคลียร์ error
      } else if (feedback.type === 'SUCCESS') {
        setShopFeedback(feedback.message);
        setTimeout(() => setShopFeedback(null), 3000);
      }
    });

    socket.on('system_message', (data) => {
       setDiceLog(data.message); // Reuse dice log area for system announcements
       setTimeout(() => setDiceLog(''), 5000);
    });


    // รับ event แจ้งผลทอยเต๋า
    socket.on('dice_rolled', ({ player, result, d1, d2, isReroll }) => {
      setDiceResult({ total: result, d1, d2 });
      if (!isReroll) {
        setDiceLog(`🎲 ${player} ทอยได้ ${result}! ${d2 ? `(${d1}+${d2})` : ''}`);
      } else {
        setDiceLog(`🔄 ${player} ทอยใหม่ได้ ${result}!`);
      }
      setTimeout(() => setDiceLog(''), 4000);
      setIsRolling(false);
      setPendingReroll(null);
      // เคลียร์ผลลัพธ์เต๋าเพื่อปิดหน้าต่างแสดงลูกเต๋าเมื่อเวลาผ่านไป (ให้สอดคล้องกับ delay ของ player_landed 2000ms)
      setTimeout(() => setDiceResult(null), 1800);
    });


    // Event รับเมื่อตัวละครขยับตกช่องไหน
    socket.on('player_landed', (data) => {
      // หน่วงเวลาให้อนิเมชั่นเต๋านิดนึงก่อนโชว์ Pop-up แบบเก๋งๆ
      setTimeout(() => {
        setActiveEventSocketId(data.socketId);
        setActiveEventPlayerName(data.name);
        setLandedTile(data.tileType);
        if (data.safariEncounters) setSafariData(data.safariEncounters);
        if (data.gymData) setGymData(data.gymData);
        setEncounterData(null);
        setCatchResult(null);
      }, 800); 
    });

    socket.on('encounter_started', (data) => {
      setTimeout(() => {
        setActiveEventSocketId(data.socketId);
        setActiveEventPlayerName(data.name);
        setLandedTile(data.tileType);
        setEncounterData(data.encounter);
        setCatchResult(null);
      }, 800); 
    });

    socket.on('catch_result', (data) => {
      setActiveEventSocketId(data.socketId);
      setCatchResult(data);
      setIsCatchRolling(false);
    });

    // ผลทอยเต๋ายิม → ประกาศผลพร้อมอนิเมชั่น
    socket.on('gym_roll_result', (data) => {
      setGymRollResult(data);
      setIsGymRolling(false);
    });

    // จั่วการ์ด EVENT ได้
    socket.on('event_card_drawn', (data) => {
      setEventCardData(data);
    });

    socket.on('game_over', (data) => {
      setGameOverData(data);
    });

    // --- New Class/Mech Listeners ---
    socket.on('turn_draw_result', (data) => {
      setTurnDrawData(data);
    });

    socket.on('scientist_card_choice', (data) => {
      setScientistChoice(data);
    });

    socket.on('reroll_choice_available', (data) => {
      setPendingReroll(data);
      setIsRolling(false);
    });


    // รับ feedback จาก shop (ซื้อ/ขาย)
    socket.on('action_feedback', (feedback) => {
      if (feedback.type === 'SUCCESS') {
        setShopFeedback(feedback.message);
        setTimeout(() => setShopFeedback(null), 3000);
      } else if (feedback.type === 'ERROR') {
        setErrorMsg(feedback.message);
        setTimeout(() => setErrorMsg(''), 3000);
      }
    });

    return () => {
      socket.off('connect');
      socket.off('update_game_state');
      socket.off('action_feedback');
      socket.off('dice_rolled');
      socket.off('player_landed');
      socket.off('encounter_started');
      socket.off('catch_result');
      socket.off('gym_roll_result');
      socket.off('event_card_drawn');
      socket.off('game_over');
    };
  }, [socket]);

  const handleJoinGame = (e) => {
    e.preventDefault();
    if (!playerName.trim() || !roomId.trim()) {
      setErrorMsg('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    
    if (socket) {
      setErrorMsg('');
      socket.emit('join_room', { 
        roomId: roomId.trim().toUpperCase(), 
        playerName: playerName.trim() 
      });
    }
  };

  // ฟังก์ชันทอยเต๋า (+ เพิ่มแอนิเมชันหน่วงเวลา 1.5 วินาทีก่อนส่งเซิร์ฟเวอร์)
  const handleRollDice = () => {
    if (socket && !isRolling) {
      setDiceResult(null);
      setIsRolling(true);
      
      // สับเปลี่ยนหน้าลูกเต๋ารัวๆ ทุก 100ms เพื่อความสมจริง
      const rollInterval = setInterval(() => {
        setRollingDiceFace(Math.floor(Math.random() * 6) + 1);
        setRollingDiceFace2(Math.floor(Math.random() * 6) + 1);
      }, 100);

      // หน่วงเวลา 1.5 วินาทีก่อนส่งคำสั่งจริงไปหลังบ้าน
      setTimeout(() => {
        clearInterval(rollInterval);
        socket.emit('roll_dice');
      }, 1500);
    }
  };

  const handleEndTurn = () => {
    if (socket) {
      socket.emit('end_turn');
      setLandedTile(null); // กดปุ๊บ ล้าง Pop-up ถ่ายเทิร์นเลย
      setEncounterData(null);
      setCatchResult(null);
    }
  };

  const handleCatchAttempt = (ballType = 'POKE_BALL') => {
    if (socket && encounterData && !isCatchRolling) {
      setIsCatchRolling(true);
      setCatchResult(null);
      
      const rollInterval = setInterval(() => {
        setCatchRollingFace(Math.floor(Math.random() * 6) + 1);
      }, 100);

      setTimeout(() => {
        clearInterval(rollInterval);
        socket.emit('attempt_catch', { pokemonId: encounterData.id, ballType: ballType });
      }, 1500);
    }
  };

  const handleEndEncounter = () => {
    if (socket) {
      socket.emit('end_encounter');
      socket.emit('end_turn'); // ส่งผ่านเทิร์นทันทีเมือกดหนี
      setLandedTile(null);
      setEncounterData(null);
      setCatchResult(null);
    }
  };

  const handleSellPokemon = (pokemonId) => {
    if (socket) socket.emit('sell_pokemon', { pokemonId });
  };

  const handleBuyItem = (itemId) => {
    if (socket) socket.emit('buy_item', { itemId });
  };

  // --------------------------------------------------------
  // ส่วน UI ของระบบ Reaction
  // --------------------------------------------------------
  const renderReactionModal = () => {
    if (!gameState || !gameState.currentEvent) return null;
    const event = gameState.currentEvent;
    if (event.cancelled) return null; // ถูกป้องกันไปแล้ว รอแปปเดี๋ยวกล่องจะหายไปเองเมื่อ server reset

    const myPlayer = gameState.players.find(p => p.socketId === socket?.id);
    const isTarget = myPlayer?.playerId === event.targetId;
    const hasShield = myPlayer?.cards?.['CARD_SHIELD'] > 0;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-[fadeIn_0.1s_ease-out] pointer-events-auto">
        <div className="bg-slate-900 border-4 border-rose-500 p-6 sm:p-10 rounded-[2rem] max-w-xl w-full shadow-[0_0_80px_rgba(225,29,72,0.4)] relative flex flex-col items-center text-center overflow-hidden">
           {/* แถบหลอดเวลา (จำลองด้วย CSS animation 5 วิ) */}
           <div className="absolute top-0 left-0 w-full h-2 bg-slate-800">
             <div className="h-full bg-rose-500 w-full origin-left animate-[scaleX_5s_linear_forwards]" style={{ animationTimingFunction: 'linear' }}></div>
           </div>

           <div className="text-6xl mb-4 animate-[bounce_0.5s_infinite]">🚨</div>
           <h2 className="text-2xl sm:text-3xl font-black text-rose-400 mb-2">เข้าสู่การต่อสู้!</h2>
           <p className="text-slate-300 font-bold mb-6 text-sm sm:text-lg">
             <span className="text-blue-400">{event.attackerName}</span> กำลังใช้การ์ดขโมยเงินใส่ <span className="text-amber-400">{event.targetName}</span>
           </p>

           {isTarget ? (
             <div className="w-full flex flex-col gap-3 items-center">
                <p className="text-white text-xs mb-2">คุณตกเป็นเป้าหมาย! คุณมีการ์ดป้องกันหรือไม่?</p>
                <button
                  disabled={!hasShield}
                  onClick={() => socket.emit('use_reaction', { eventId: event.id })}
                  className={`w-full font-black py-4 px-6 rounded-xl shadow-lg border transition-all text-lg ${hasShield ? 'bg-gradient-to-r from-emerald-600 to-emerald-400 text-white border-emerald-400 hover:scale-105' : 'bg-slate-800 text-slate-500 border-slate-700 opacity-50 cursor-not-allowed'}`}
                >
                  🛡️ ใช้ CARD_SHIELD ป้องกัน {hasShield ? '(มีอยู่)' : '(ไม่มี)'}
                </button>
             </div>
           ) : (
             <div className="text-slate-500 font-bold text-sm animate-pulse">
                กำลังประมวลผลผลลัพธ์... โปรดรอ
             </div>
           )}
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes scaleX {
            from { transform: scaleX(1); }
            to { transform: scaleX(0); }
          }
        `}} />
      </div>
    );
  };

  // --------------------------------------------------------
  // ส่วน UI ย่อย
  // --------------------------------------------------------

  // ข้อมูลอาชีพจำลอง (เฟส 1) - ผู้เล่นสามารถเลือกได้ในหน้า Lobby


  // ไม่ใช้แล้ว เพราะประกาศเป็น Global ข้างนอกแทน

  // ข้อมูลสไตล์ประจำช่องกระดาน
  const TILE_INFO = {
    'START': { label: 'START', icon: '🏁', bg: 'bg-rose-950/80 border-rose-500 shadow-[inset_0_0_15px_rgba(225,29,72,0.6)] text-rose-300' },
    'JAIL': { label: 'เข้าคุก', icon: '⛓️', bg: 'bg-slate-900/90 border-slate-500 text-slate-300 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]' },
    'AIRPORT': { label: 'เที่ยวบิน', icon: '✈️', bg: 'bg-cyan-950/90 border-cyan-500 text-cyan-300' },
    'SAFARI': { label: 'ซาฟารี', icon: '🦁', bg: 'bg-amber-950/90 border-amber-500 text-amber-400' },
    'GYM': { label: 'ยิม', icon: '🥊', bg: 'bg-orange-950/60 border-orange-700/60 text-orange-400' },
    'SHOP': { label: 'ร้านค้า', icon: '🏪', bg: 'bg-blue-950/60 border-blue-700/60 text-blue-400' },
    'EVENT': { label: 'อีเวนต์', icon: '❓', bg: 'bg-purple-950/60 border-purple-700/60 text-purple-400' },
    'WILD': { label: 'ป่า', icon: '🌲', bg: 'bg-emerald-950/40 border-emerald-800/60 text-emerald-500' }
  };

  // คำนวณพิกัดบนตาราง 11x11 ตามตำแหน่งแบบวนขวา
  // เริ่มจากล่างขวา -> ซ้าย (0-10) -> บน (11-19) -> ขวา (20-30) -> ล่าง (31-39)
  const getGridArea = (i) => {
    if (i >= 0 && i <= 10) return { gridColumn: 11 - i, gridRow: 11 };
    if (i >= 11 && i <= 19) return { gridColumn: 1, gridRow: 21 - i };
    if (i >= 20 && i <= 30) return { gridColumn: i - 19, gridRow: 1 };
    if (i >= 31 && i <= 39) return { gridColumn: 11, gridRow: i - 29 };
    return { gridColumn: 1, gridRow: 1 };
  };

  // Render บอร์ดกระดานเกม สไตล์เกมเศรษฐี 40 ช่อง (11x11 Grid Hollow)
  const renderBoardGrid = () => {
    if (!gameState || !gameState.boardMap) return null;
    
    return (
      <div className="w-full h-full relative p-2 sm:p-6 border-[3px] border-slate-800/80 rounded-[2rem] sm:rounded-[3rem] shadow-[inset_0_0_60px_rgba(0,0,0,0.8),0_0_40px_rgba(0,0,0,0.6)] bg-slate-900/60 backdrop-blur-xl aspect-square flex items-center justify-center">
        <div 
          className="grid gap-[3px] sm:gap-[6px] w-full h-full bg-slate-950 p-[6px] rounded-[1.5rem] sm:rounded-[2.5rem] border-[2px] border-slate-800"
          style={{ gridTemplateColumns: 'repeat(11, minmax(0, 1fr))', gridTemplateRows: 'repeat(11, minmax(0, 1fr))' }}
        >
          {gameState.boardMap.map((type, index) => {
            const playersOnThisTile = gameState.players.filter(p => p.position === index);
            const tileData = TILE_INFO[type] || TILE_INFO['WILD'];
            const coords = getGridArea(index);
            const isCorner = index % 10 === 0;
            
            return (
              <div 
                key={index} 
                className={`rounded-md border flex flex-col items-center justify-center relative transition-all duration-300 ${tileData.bg} overflow-hidden`}
                style={coords}
              >
                {/* หมายเลขช่อง */}
                <div className={`absolute ${isCorner ? 'top-[2px]' : 'top-[2px]'} left-[3px] text-[7px] sm:text-[8px] font-bold opacity-60 text-slate-300 z-0`}>
                  {index}
                </div>
                
                {/* ไอคอนและชื่อช่อง */}
                <div className="flex flex-col items-center gap-0 sm:gap-0.5 opacity-80 z-0 select-none">
                   <span className={isCorner ? "text-lg sm:text-2xl pt-1" : "text-sm sm:text-xl"}>{tileData.icon}</span>
                   <span className="text-[6px] sm:text-[7px] font-bold tracking-wider hidden sm:block leading-none mt-0.5">{tileData.label}</span>
                </div>
                
                {/* Visual Cue: ระดับความหายากของป่าตามโซน */}
                {type === 'WILD' && !isCorner && (
                  <div className="absolute top-[3px] right-[4px] text-[7px] sm:text-[9px] drop-shadow-md z-0 opacity-90 animate-pulse">
                    {index < 10 ? '🟢' : index < 20 ? '⭐' : index < 30 ? '⭐⭐' : '⭐⭐⭐'}
                  </div>
                )}
                
                {/* รายชื่อ Player Pins ที่ตกช่องนี้ */}
                <div className="absolute inset-0 flex flex-wrap gap-0.5 items-center justify-center pointer-events-none p-0.5 sm:p-1 z-10 w-full h-full content-center">
                  {playersOnThisTile.map((p) => {
                    const isMe = p.socketId === socket?.id;
                    const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-violet-500'];
                    const colorIndex = gameState.players.findIndex(x => x.socketId === p.socketId);
                    const color = colors[colorIndex % colors.length];

                    return (
                      <div 
                        key={p.socketId}
                        className={`w-4 h-4 sm:w-6 sm:h-6 rounded-full ${color} shadow-lg shadow-black flex items-center justify-center border ${isMe ? 'border-white z-20 scale-110 shadow-[0_0_10px_rgba(255,255,255,0.6)]' : 'border-slate-800/80 z-10'} text-[7px] sm:text-[9px] font-black transform transition-transform animate-[bounce_0.5s_ease-out] relative bg-gradient-to-br from-white/20 to-transparent`}
                        title={p.name}
                      >
                        {p.name.substring(0, 1).toUpperCase()}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render Modal ประจำช่อง (Tile Action Modal) + ระบบจับโปเกมอน
  const renderTileActionModal = () => {
    if (!landedTile) return null;

    const isSpectator = activeEventSocketId !== socket?.id;
    const activePlayer = gameState?.players?.find(p => p.socketId === activeEventSocketId) || gameState?.players?.find(p => p.socketId === socket?.id);

    const spectatorBanner = isSpectator ? (
      <div className="absolute top-4 sm:top-10 left-1/2 -translate-x-1/2 bg-blue-600/90 text-white font-black text-sm sm:text-lg px-8 py-3 rounded-full shadow-[0_0_30px_rgba(37,99,235,0.8)] z-[9999] animate-pulse whitespace-nowrap border-[3px] border-white/30 pointer-events-auto">
        👀 กำลังรับชม {activeEventPlayerName} ตัดสินใจ...
      </div>
    ) : null;

    // ===== GYM: ท้าประลองยิมลีดเดอร์ =====
    if (landedTile === 'GYM' && gymData) {
      const myPlayer = gameState?.players?.find(p => p.socketId === socket?.id);
      const isGymLeaderClass = myPlayer?.classId === 'gym_leader';

      const handleGymRoll = () => {
        if (isGymRolling || gymRollResult) return;
        setIsGymRolling(true);
        let count = 0;
        const interval = setInterval(() => {
          setGymRollingFace(Math.floor(Math.random() * 6) + 1);
          count++;
          if (count >= 18) {
            clearInterval(interval);
            socket.emit('attempt_gym_battle', { gymPower: gymData.power });
          }
        }, 80);
      };
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-[fadeIn_0.3s_ease-out]">
          {spectatorBanner}
          <div className={`bg-slate-900 border-4 border-orange-500/80 p-6 sm:p-10 rounded-[2rem] max-w-lg w-full shadow-[0_0_80px_rgba(249,115,22,0.4)] text-center ${isSpectator ? 'pointer-events-none opacity-80' : ''}`}>
            
            <div className="text-6xl mb-2 animate-pulse">{gymData.element}</div>
            <h2 className="text-3xl sm:text-4xl font-black text-orange-400 mb-2 uppercase">ท้าประลองยิม!</h2>
            
            <div className="bg-slate-800 border-2 border-slate-700 p-4 rounded-xl mb-6">
              <p className="text-slate-300 font-bold mb-1">ยิมลีดเดอร์ที่คุณพบ:</p>
              <h3 className="text-2xl font-black text-white">{gymData.name}</h3>
              <p className="text-rose-400 font-black mt-2 text-lg">ระดับพลัง: {gymData.power} 🔥</p>
            </div>

            <div className="mb-6">
              {isGymRolling && !gymRollResult ? (
                <div className="flex flex-col items-center gap-3 py-6">
                  <div className="w-24 h-24 bg-orange-500/20 border-4 border-orange-400 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(249,115,22,0.7)] animate-[spin_0.25s_linear_infinite]">
                    <span className="text-6xl font-black text-orange-300">{gymRollingFace}</span>
                  </div>
                  <p className="text-orange-400 font-black animate-pulse text-lg">กำลังต่อสู้...</p>
                </div>
              ) : gymRollResult ? (
                <div className={`rounded-2xl p-5 border-2 ${gymRollResult.won ? 'bg-emerald-900/40 border-emerald-500' : 'bg-rose-900/40 border-rose-500'}`}>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">ผลการทอยเต๋า</p>
                  <div className={`text-8xl font-black leading-none mb-3 drop-shadow-[0_0_30px_rgba(255,255,255,0.4)] animate-[bounce_0.5s_ease-out] ${gymRollResult.won ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {gymRollResult.roll}
                  </div>
                  <h3 className={`text-2xl font-black mb-1 ${gymRollResult.won ? 'text-emerald-300' : 'text-rose-300'}`}>
                    {gymRollResult.won ? '🏆 ชนะยิม!' : '💀 แพ้ยิม...'}
                  </h3>
                  <p className="text-slate-300 font-bold text-sm">
                    {gymRollResult.won ? `🎉 รับ 2,000฿ + สิทธิ์ Evolve ฟรี 1 ครั้ง!` : `😢 เสีย 500฿ (ต้องการ ${gymData.power}+ แต่ได้ ${gymRollResult.roll})`}
                  </p>
                  <button
                    onClick={() => { setGymRollResult(null); handleEndTurn(); }}
                    className={`mt-5 w-full font-black py-3 rounded-xl text-white transition-all hover:-translate-y-1 active:translate-y-0 ${gymRollResult.won ? 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_8px_20px_-8px_rgba(52,211,153,0.8)]' : 'bg-rose-700 hover:bg-rose-600'}`}
                  >
                    {gymRollResult.won ? '🎉 รับรางวัลและจบเทิร์น' : '😮‍💨 รับชะตาและจบเทิร์น'}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleGymRoll}
                    className="w-full bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-500 hover:to-rose-500 text-white font-black py-4 px-6 rounded-xl shadow-[0_10px_20px_-10px_rgba(249,115,22,0.8)] text-xl border-2 border-orange-400 hover:-translate-y-1 transition-transform"
                  >
                    🎲 ทอยเต๋าต่อสู้! (ต้องการ {gymData.power} ขึ้นไป)
                  </button>
                  {isGymLeaderClass && <p className="text-emerald-400 text-xs font-bold mt-1">✨ โบนัสอาชีพ: แต้มเต๋าจะ +2 เสมอ!</p>}
                </div>
              )}
            </div>

            {!isGymRolling && !gymRollResult && (
              <button 
                onClick={handleEndTurn}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold py-3 px-4 rounded-xl transition-all border border-slate-600"
              >
                หนีดีกว่า (จบเทิร์น)
              </button>
            )}
          </div>
        </div>
      );
    }
    
    
    // ===== AIRPORT: สนามบินวิทยุ =====
    if (landedTile === 'AIRPORT') {
      const myPlayer = gameState?.players?.find(p => p.socketId === socket?.id);
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          {spectatorBanner}
          <div className={`bg-slate-900 border-[3px] border-sky-400/50 p-6 sm:p-10 rounded-[2rem] max-w-2xl w-full shadow-[0_0_60px_rgba(56,189,248,0.3)] relative overflow-hidden flex flex-col max-h-[90vh] ${isSpectator ? 'pointer-events-none opacity-80' : ''}`}>
            
            <div className="text-center mb-6 shrink-0 relative z-10">
              <div className="text-6xl mb-4 animate-bounce">✈️</div>
              <h2 className="text-2xl sm:text-4xl font-black text-sky-400 mb-2 tracking-widest drop-shadow-md uppercase">สนามบิน</h2>
              <p className="text-slate-300 font-medium text-sm sm:text-base max-w-sm mx-auto">
                เลือกช่องเป้าหมายที่คุณต้องการบินไปลงจอด! (ฟรีตลอดสาย)
              </p>
            </div>

            <div className="flex-1 overflow-y-auto w-full pr-2 mb-4">
               <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 gap-2">
                 {Array.from({ length: 40 }).map((_, i) => {
                    const isCurrent = i === myPlayer?.position;
                    // หาประเภทช่องเพื่อแสดงสัญลักษณ์
                    const tileType = gameState?.boardMap ? gameState.boardMap[i] : 'WILD';
                    let icon = '🌾';
                    if (tileType === 'START') icon = '🏁';
                    if (tileType === 'SHOP') icon = '🏪';
                    if (tileType === 'JAIL') icon = '⛓️';
                    if (tileType === 'AIRPORT') icon = '✈️';
                    if (tileType === 'SAFARI') icon = '🦁';
                    if (tileType === 'EVENT') icon = '❓';
                    if (tileType === 'GYM') icon = '🥊';

                    return (
                      <button
                        key={i}
                        disabled={isCurrent}
                        onClick={() => {
                           socket.emit('airport_warp', { targetPos: i });
                           setLandedTile(null);
                        }}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${isCurrent ? 'bg-slate-800 border-rose-500 opacity-50 cursor-not-allowed' : 'bg-slate-800/80 border-slate-600 hover:border-sky-400 hover:bg-slate-700 hover:scale-110'}`}
                      >
                         <span className="text-xl mb-1">{icon}</span>
                         <span className="text-[10px] font-black text-slate-300">{i}</span>
                      </button>
                    )
                 })}
               </div>
            </div>
            
            {/* The active player won't need end turn if they warp. But wait, if they warp they land there immediately. */}
            <div className="shrink-0 mt-2">
              <button 
                onClick={handleEndTurn}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 px-4 rounded-xl transition-all border border-slate-600"
              >
                ไม่บิน (จบเทิร์น)
              </button>
            </div>
          </div>
        </div>
      );
    }

    // ===== SAFARI: ซาฟารี =====
    if (landedTile === 'SAFARI') {
       return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          {spectatorBanner}
          <div className={`bg-slate-900 border-[3px] border-emerald-500/50 p-6 sm:p-10 rounded-[2rem] max-w-3xl w-full shadow-[0_0_80px_rgba(16,185,129,0.3)] relative flex flex-col ${isSpectator ? 'pointer-events-none opacity-80' : ''}`}>
            <div className="text-center mb-6 z-10">
              <div className="text-6xl mb-4 animate-bounce">🦁</div>
              <h2 className="text-2xl sm:text-4xl font-black text-emerald-400 mb-2 tracking-widest uppercase truncate drop-shadow-md">ซาฟารีโซน</h2>
              <p className="text-slate-300 font-medium text-sm sm:text-base">
                สุ่มเจอโปเกมอน 4 ตัว! เลือกตัวที่คุณอยากจับที่สุด:
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 z-10">
              {safariData?.map((mon, idx) => (
                <button
                  key={`safari_${idx}`}
                  onClick={() => {
                     setEncounterData(mon);
                     setLandedTile('WILD'); // โยกไปใช้ระบบต่อสู้ปกติ
                     setSafariData(null);
                  }}
                  className="bg-slate-800/80 hover:bg-slate-700 border border-slate-600 hover:border-emerald-400 rounded-2xl p-4 flex flex-col items-center justify-center transition-all hover:scale-105 shadow-lg group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-5xl mb-2 drop-shadow-lg scale-100 group-hover:scale-110 transition-transform">{mon.image || '🐾'}</span>
                  <span className="font-black text-white text-sm whitespace-nowrap mb-1">{mon.name}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded shadow-inner uppercase ${mon.rarity === 'Legendary' ? 'bg-amber-500 text-slate-900' : mon.rarity === 'Very Rare' ? 'bg-rose-500 text-white' : mon.rarity === 'Rare' ? 'bg-blue-500 text-white' : 'bg-slate-600 text-slate-200'}`}>
                     {mon.rarity}
                  </span>
                </button>
              ))}
            </div>

            <button 
                onClick={handleEndTurn}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 px-4 rounded-xl transition-all border border-slate-600 z-10"
              >
                ออกจากซาฟารี (จบเทิร์น)
            </button>
          </div>
        </div>
       )
    }

    // ===== SHOP: ร้านซื้อไอเทม =====
    if (landedTile === 'SHOP') {
      const myPlayer = gameState?.players?.find(p => p.socketId === socket?.id);
      const pokeBalls  = myPlayer?.cards?.['POKE_BALL']  || 0;
      const ultraBalls = myPlayer?.cards?.['ULTRA_BALL'] || 0;

      const SHOP_ITEMS = ITEMS_DB;

      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-md animate-[fadeIn_0.3s_ease-out]">
          {spectatorBanner}
          <div className={`bg-gradient-to-br from-blue-600 to-blue-900 p-1.5 rounded-3xl max-w-lg w-full shadow-[0_0_80px_rgba(59,130,246,0.4)] max-h-[92vh] flex flex-col ${isSpectator ? 'pointer-events-none opacity-80' : ''}`}>
            <div className="bg-slate-900 rounded-[20px] flex flex-col overflow-hidden border border-white/10 max-h-[88vh]">

              {/* Header */}
              <div className="px-6 pt-6 pb-3 text-center relative shrink-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-20 bg-blue-500/20 blur-2xl rounded-full pointer-events-none"/>
                <div className="text-4xl mb-2">🏪</div>
                <h2 className="text-2xl font-black text-white tracking-widest">🏪 POKÉ MART</h2>
                <p className="text-blue-300 text-xs mt-1 font-medium">💰 เงินของคุณ: <span className="text-amber-400 font-black text-sm">{(myPlayer?.money || 0).toLocaleString()}฿</span>
                  <span className="mx-2 text-slate-600">|</span>
                  🔴 ×{pokeBalls}
                  <span className="mx-1 text-slate-600">·</span>
                  🟣 ×{ultraBalls}
                </p>
                {/* Shop Feedback Toast */}
                {shopFeedback && (
                  <div className="mt-2 bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold px-3 py-2 rounded-xl animate-[fadeIn_0.2s_ease-out]">
                    {shopFeedback}
                  </div>
                )}
              </div>

              {/* Body — scrollable */}
              <div className="overflow-y-auto px-5 pb-4 space-y-4 flex-1">
                {/* ฝั่งซื้อ */}
                <div>
                  <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-2">🛍️ ซื้อไอเทม</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {SHOP_ITEMS.map(item => (
                      <button
                        key={item.id}
                        onClick={() => handleBuyItem(item.id)}
                        className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500/60 rounded-xl p-3 text-left transition-all group"
                      >
                        <div className="text-2xl mb-1">{item.icon}</div>
                        <div className="text-white font-black text-sm">{item.name}</div>
                        <div className="text-slate-400 text-[10px] mb-2">{item.description}</div>
                        <div className="text-amber-400 font-black text-xs group-hover:text-amber-300">{item.price.toLocaleString()}฿</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 pb-5 pt-3 border-t border-slate-800 shrink-0">
                <button
                  onClick={handleEndTurn}
                  className="w-full bg-white text-slate-900 hover:bg-slate-200 font-black py-3 px-4 rounded-xl shadow-lg transition-all tracking-wide text-sm"
                >
                  🚪 ออกจากร้านค้า (จบเทิร์น)
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // ===== START: Hub & Sell =====
    if (landedTile === 'START') {
      const myPlayer = gameState?.players?.find(p => p.socketId === socket?.id);
      const myPokemons = myPlayer?.pokemons?.map(id => POKEMON_DB.find(p => p.id === id)).filter(Boolean) || [];

      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-md animate-[fadeIn_0.3s_ease-out]">
          {spectatorBanner}
          <div className={`bg-gradient-to-br from-rose-600 to-rose-900 p-1.5 rounded-3xl max-w-lg w-full shadow-[0_0_80px_rgba(225,29,72,0.4)] max-h-[92vh] flex flex-col ${isSpectator ? 'pointer-events-none opacity-80' : ''}`}>
            <div className="bg-slate-900 rounded-[20px] flex flex-col overflow-hidden border border-white/10 max-h-[88vh]">

              {/* Header */}
              <div className="px-6 pt-6 pb-3 text-center relative shrink-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-20 bg-rose-500/20 blur-2xl rounded-full pointer-events-none"/>
                <div className="text-4xl mb-2">🏁</div>
                <h2 className="text-2xl font-black text-white tracking-widest">เมืองหลวง (HUB)</h2>
                <p className="text-rose-300 text-xs mt-2 font-medium bg-rose-950/50 p-2 rounded-lg border border-rose-900/50">
                  🎉 รับโบนัสเงินเดือน <b>500฿</b>! <br/>ณ จุดนี้ คุณสามารถขายโปเกมอนที่จับมาได้
                </p>
                {/* Shop Feedback Toast */}
                {shopFeedback && (
                  <div className="mt-2 bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold px-3 py-2 rounded-xl animate-[fadeIn_0.2s_ease-out]">
                    {shopFeedback}
                  </div>
                )}
              </div>

              {/* Body — scrollable */}
              <div className="overflow-y-auto px-5 pb-4 space-y-4 flex-1">
                {/* ฝั่งขาย */}
                <div>
                  <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-2">💰 ขายโปเกมอน</h3>
                  {myPokemons.length === 0 ? (
                    <div className="text-center py-6 text-slate-600">
                      <div className="text-3xl mb-2">🕸️</div>
                      <p className="text-sm font-bold">กระเป๋าว่างเปล่า</p>
                      <p className="text-xs">จับโปเกมอนในป่าก่อนแล้วนำมาขายที่นี่รอบถัดไป</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {myPokemons.map((mon, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-slate-800/70 border border-slate-700 rounded-xl px-3 py-2 hover:border-emerald-600/50 transition-all">
                          <span className="text-2xl">{mon.image}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-black text-sm truncate">{mon.name}</p>
                            <p className={`text-[10px] font-bold ${mon.rarity === 'Legendary' ? 'text-amber-400' : mon.rarity === 'Very Rare' ? 'text-rose-400' : mon.rarity === 'Rare' ? 'text-blue-400' : 'text-slate-400'}`}>
                              {mon.rarity}
                            </p>
                          </div>
                          <button
                            onClick={() => handleSellPokemon(mon.id)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-3 py-1.5 rounded-lg transition-colors shrink-0"
                          >
                            ขาย {mon.price.toLocaleString()}฿
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 pb-5 pt-3 border-t border-slate-800 shrink-0">
                <button
                  onClick={handleEndTurn}
                  className="w-full bg-white text-slate-900 hover:bg-slate-200 font-black py-3 px-4 rounded-xl shadow-lg transition-all tracking-wide text-sm"
                >
                  🚪 ออกเดินทางต่อ (จบเทิร์น)
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // ===== WILD และช่องอื่นๆ =====
    let content = { title: '', msg: '', color: '' };
    switch (landedTile) {
      case 'WILD':
        if (encounterData) {
          content = { 
            title: `พบ ${encounterData.name.toUpperCase()} ปรากฏตัว!`, 
            msg: `ระดับความหายาก: ${encounterData.rarity} | โอกาสจับสำเร็จจะอิงตามค่าลูกเต๋าที่คุณทอยได้ต่อไปนี้...`, 
            color: 'from-emerald-600 to-emerald-800' 
          };
        } else {
          content = { title: 'พื้นที่ป่าลึก', msg: 'คุณเดินเข้ามาในป่าลึก... ความเงียบสงัดเข้าปกคลุม', color: 'from-emerald-700 to-emerald-900' };
        }
        break;
      case 'GYM':
        content = { title: 'ประลองยิม', msg: 'ท้าประลองยิมลีดเดอร์! เตรียมตัวรับมือการต่อสู้สุดเดือด', color: 'from-orange-600 to-red-800' };
        break;
      case 'EVENT': {
        // ส่ง event จั่วการ์ดทันที (ถ้ายังไม่เคยจั่ว)
        if (!eventCardData && !isSpectator) {
          setTimeout(() => socket.emit('draw_event_card'), 50);
        }
        // ถ้ามีผลการ์ดแล้ว โชวล่ายการ์ดแบบเต็มหน้าจอ
        if (eventCardData) {
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
              {spectatorBanner}
              <div className={`bg-gradient-to-br ${eventCardData.color} p-1.5 rounded-[2rem] max-w-sm w-full shadow-[0_0_80px_rgba(0,0,0,0.7)] animate-[bounceIn_0.4s_ease-out] ${isSpectator ? 'pointer-events-none opacity-80' : ''}`}>
                <div className="bg-slate-900 rounded-[1.8rem] p-8 flex flex-col items-center text-center border border-white/10">
                  <div className="text-7xl mb-3 animate-[bounce_0.6s_ease-out]">{eventCardData.icon}</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">การ์ดเหตุการณ์</div>
                  <h2 className="text-3xl font-black text-white mb-3">{eventCardData.title}</h2>
                  <p className="text-slate-300 font-bold mb-6">{eventCardData.desc}</p>
                  <button
                    onClick={() => { setEventCardData(null); handleEndTurn(); }}
                    className="w-full bg-white text-slate-900 hover:bg-slate-100 font-black py-3 rounded-xl transition-all hover:-translate-y-1"
                  >
                    ✅ รับชะตาและจบเทิร์น
                  </button>
                </div>
              </div>
            </div>
          );
        }
        // กำลังรอชาร์ด
        content = { title: 'จั่วการ์ดเหตุการณ์...', msg: 'โชคชะตาชี้ขาดกำยังดึงการ์ด...', color: 'from-purple-700 to-purple-900' };
        break;
      }

      default:
        content = { title: 'ไม่ทราบพิกัด', msg: '...', color: 'from-slate-600 to-slate-800' };
    }

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-[fadeIn_0.3s_ease-out]">
        {spectatorBanner}
        <div className={`bg-gradient-to-br ${content.color} p-1.5 rounded-3xl max-w-sm w-full shadow-[0_0_80px_rgba(0,0,0,0.6)] transform ${isSpectator ? 'pointer-events-none opacity-80' : ''}`}>
          <div className="bg-slate-900 rounded-[20px] p-8 text-center h-full border border-white/10 relative overflow-hidden">
            {/* กราฟิกแสงวงกลมแบบสว่างตรงกลาง */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/10 blur-2xl rounded-full"></div>
            
            <div className={`text-5xl mb-3 mt-4 relative z-10 transition-transform ${encounterData && catchResult?.status !== 'SUCCESS' ? 'animate-[bounce_2s_ease-in-out_infinite] scale-125' : ''}`}>
              {encounterData ? encounterData.image : '✨'}
            </div>
            
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-widest mb-1 relative z-10 leading-tight">
              {content.title}
            </h2>
            
            {encounterData && (
              <div className="flex items-center justify-center gap-2 mb-3 mt-2 relative z-10">
                 {encounterData.types?.map(t => (
                   <span key={t} className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">{t}</span>
                 ))}
                 <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase shadow-lg ${
                   encounterData.rarity === 'Legendary' ? 'bg-amber-500 text-slate-900 border border-amber-300' :
                   encounterData.rarity === 'Very Rare' ? 'bg-rose-500 text-white' :
                   encounterData.rarity === 'Rare' ? 'bg-blue-500 text-white' : 'bg-slate-300 text-slate-800'
                 }`}>
                   {encounterData.rarity === 'Legendary' ? '⭐ Legendary (6)' : encounterData.rarity === 'Very Rare' ? '🔴 Very Rare (5+)' : encounterData.rarity === 'Rare' ? '🟡 Rare (4+)' : '🟢 Common (3+)'}
                 </span>
              </div>
            )}
            
            <p className="text-slate-300 font-medium text-[11px] sm:text-sm mb-6 leading-relaxed mx-auto relative z-10">
              {content.msg}
            </p>
            
            {encounterData && catchResult?.status !== 'SUCCESS' ? (
              isCatchRolling ? (
                <div className="w-full py-4 flex flex-col items-center justify-center gap-2 relative z-10 mb-4 bg-slate-900/50 rounded-xl border border-slate-700">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center animate-[spin_0.3s_linear_infinite] border-2 border-slate-300">
                    <span className="text-4xl font-black text-rose-600 drop-shadow-md animate-pulse">
                      {catchRollingFace}
                    </span>
                  </div>
                  <p className="text-amber-400 font-bold mt-2 animate-pulse text-sm">กำลังทอยเต๋าจับโปเกมอน...</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2 relative z-10 mb-4">
                   <button 
                    onClick={() => handleCatchAttempt('POKE_BALL')}
                    disabled={(gameState?.players?.find(p => p.socketId === socket?.id)?.cards?.['POKE_BALL'] || 0) <= 0}
                    className={`w-full bg-gradient-to-b from-rose-500 to-rose-700 text-white font-black py-4 px-4 rounded-xl shadow-[0_10px_20px_-10px_rgba(225,29,72,0.8)] transition-transform tracking-wide text-lg sm:text-xl border border-rose-400 group overflow-hidden ${
                      (gameState?.players?.find(p => p.socketId === socket?.id)?.cards?.['POKE_BALL'] || 0) <= 0 ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:-translate-y-1 active:translate-y-0'
                    }`}
                   >
                     <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"></div>
                     🔴 โยน Poké Ball! (เหลือ {gameState?.players?.find(p => p.socketId === socket?.id)?.cards?.['POKE_BALL'] || 0} ลูก)
                   </button>

                   <button 
                    onClick={() => handleCatchAttempt('ULTRA_BALL')}
                    disabled={(gameState?.players?.find(p => p.socketId === socket?.id)?.cards?.['ULTRA_BALL'] || 0) <= 0}
                    className={`w-full bg-gradient-to-b from-purple-500 to-purple-700 text-white font-black py-4 px-4 rounded-xl shadow-[0_10px_20px_-10px_rgba(147,51,234,0.8)] transition-transform tracking-wide text-lg sm:text-xl border border-purple-400 group overflow-hidden ${
                      (gameState?.players?.find(p => p.socketId === socket?.id)?.cards?.['ULTRA_BALL'] || 0) <= 0 ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:-translate-y-1 active:translate-y-0'
                    }`}
                   >
                     <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"></div>
                     🟣 โยน Ultra Ball! (+2 แต้ม) (เหลือ {gameState?.players?.find(p => p.socketId === socket?.id)?.cards?.['ULTRA_BALL'] || 0} ลูก)
                   </button>

                   <button 
                    onClick={handleEndEncounter}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 px-4 rounded-xl transition-all border border-slate-600/50 mt-2"
                   >
                     🏃‍♂️ ยอมแพ้และจบเทิร์น
                   </button>
                </div>
              )
            ) : null}
            
            {catchResult && (
              <div className={`fixed inset-0 z-[60] flex flex-col items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]`}>
                <div className={`relative w-full max-w-sm rounded-[2rem] p-1.5 shadow-[0_0_80px] ${catchResult.status === 'SUCCESS' ? 'bg-gradient-to-br from-emerald-400 to-emerald-700 shadow-emerald-500/40' : 'bg-gradient-to-br from-rose-500 to-rose-800 shadow-rose-500/40'}`}>
                  <div className="bg-slate-900 rounded-[1.7rem] px-8 py-10 flex flex-col items-center text-center">
                    {catchResult.status === 'SUCCESS' ? (
                      <>
                        <div className="text-7xl mb-4 animate-[bounce_0.5s_ease-out]">{encounterData?.image || '🐾'}</div>
                        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">ผลการทอยเต๋า</p>
                        <div className="text-8xl font-black text-emerald-400 leading-none mb-4 drop-shadow-[0_0_30px_rgba(52,211,153,0.6)] animate-[ping_0.3s_ease-out_1]">
                          {catchResult.roll}
                        </div>
                        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                          <span className="text-4xl">✅</span>
                        </div>
                        <h2 className="text-2xl font-black text-white mb-1">จับสำเร็จ!</h2>
                        <p className="text-emerald-300 font-bold">
                          <span className="text-white bg-emerald-600 px-2 py-0.5 rounded">{encounterData?.name}</span> เข้ากระเป๋าของคุณแล้ว!
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="text-7xl mb-4 animate-[shake_0.4s_ease-in-out]">{encounterData?.image || '🐾'}</div>
                        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">ผลการทอยเต๋า</p>
                        <div className="text-8xl font-black text-rose-400 leading-none mb-4 drop-shadow-[0_0_30px_rgba(251,113,133,0.6)]">
                          {catchResult.roll}
                        </div>
                        <div className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center mb-4">
                          <span className="text-4xl">💨</span>
                        </div>
                        <h2 className="text-2xl font-black text-white mb-1">หลุดมือ!</h2>
                        <p className="text-rose-300 font-bold">โปเกมอนยังไม่ยอมให้จับ ลองใหม่อีกครั้ง!</p>
                      </>
                    )}

                    <button
                      onClick={() => {
                        if (catchResult.status === 'SUCCESS') {
                          setCatchResult(null);
                          setEncounterData(null); // จับสำเร็จ → ล้างโปเกมอนออกด้วย ไม่งั้นะ Loop กลับหน้าปาบอล
                          handleEndTurn();         // จบเทิร์นอัตโนมัติ
                        } else {
                          setCatchResult(null);    // จับไม่ติด → แค่ล้างผลออก กลับไปโยนต่อได้
                        }
                      }}
                      className={`mt-8 w-full font-black py-3 px-6 rounded-xl text-white transition-transform hover:-translate-y-1 active:translate-y-0 ${catchResult.status === 'SUCCESS' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_10px_20px_-10px_rgba(52,211,153,0.9)]' : 'bg-rose-600 hover:bg-rose-500 shadow-[0_10px_20px_-10px_rgba(251,113,133,0.9)]'}`}
                    >
                      {catchResult.status === 'SUCCESS' ? '🎉 เยี่ยม! ไปต่อ' : '🎲 โยนอีกครั้ง / จบเทิร์น'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {(!encounterData || catchResult?.status === 'SUCCESS') && !catchResult && (
              <button 
                onClick={handleEndTurn}
                className="w-full relative z-10 bg-white text-slate-900 hover:bg-slate-200 font-black py-4.5 px-4 rounded-xl shadow-[0_10px_20px_-10px_rgba(255,255,255,0.4)] transition-transform hover:-translate-y-1 active:translate-y-0 tracking-wide text-sm sm:text-lg"
              >
                จบเทิร์น (End Action)
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderGameOverModal = () => {
    if (!gameOverData) return null;
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl">
        <div className="bg-gradient-to-br from-amber-500 to-amber-700 p-2 rounded-[3rem] w-full max-w-2xl shadow-[0_0_100px_rgba(245,158,11,0.6)] text-center animate-[bounceIn_0.5s_ease-out]">
          <div className="bg-slate-900 border-2 border-amber-400/50 p-10 rounded-[2.5rem] h-full flex flex-col items-center">
            <span className="text-8xl mb-4 animate-[bounce_1s_ease-in-out_infinite]">🏆</span>
            <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500 mb-2 drop-shadow-lg">GAME OVER!</h1>
            <p className="text-xl text-slate-300 font-bold mb-8">การแข่งขันสิ้นสุดลงแล้ว (ครบ 2 รอบ)</p>
            
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 mb-8 w-full">
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">ผู้ชนะเลิศ (แชมเปียน)</p>
              <h2 className="text-3xl sm:text-5xl font-black text-white">{gameOverData.winner?.name}</h2>
              <p className="text-amber-400 mt-4 font-bold flex flex-wrap items-center justify-center gap-4 text-lg">
                <span className="bg-slate-900/50 px-4 py-2 rounded-lg">💰 {(gameOverData.winner?.money || 0).toLocaleString()} ฿</span>
                <span className="bg-slate-900/50 px-4 py-2 rounded-lg">🐾 โปเกมอน {gameOverData.winner?.pokemons?.length || 0} ตัว</span>
              </p>
            </div>

            <button 
              onClick={() => window.location.reload()}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-8 py-4 rounded-xl shadow-[0_10px_20px_-10px_rgba(16,185,129,0.8)] hover:scale-105 transition-transform w-full text-xl"
            >
              🔄 กลับสู่หน้าหลัก (เล่นใหม่)
            </button>
          </div>
        </div>
      </div>
    );
  };

  // --- อนิเมชั่นเต๋า (รองรับทอย 2 ลูก) ---
  const renderDiceDisplay = () => {
    if (!isRolling && !diceResult) return null;
    
    // Check if the current player has an active extraDice buff during the roll phase
    const hasExtraDice = gameState?.players[gameState.currentPlayerIndex]?.extraDice > 0;
    const isShowingTwoDice = (isRolling && hasExtraDice) || (!isRolling && diceResult?.d2 !== null && diceResult?.d2 !== undefined);

    const d1 = isRolling ? rollingDiceFace : diceResult?.d1;
    const d2 = isRolling ? (hasExtraDice ? rollingDiceFace2 : null) : diceResult?.d2;

    return (
      <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none ${isRolling || diceResult ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
        <div className="flex gap-6 animate-[bounceIn_0.5s_ease-out]">
          {/* Dice 1 */}
          <div className={`w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-3xl flex items-center justify-center shadow-[0_20px_50px_rgba(255,255,255,0.3)] border-4 border-slate-200 ${isRolling ? 'animate-[spin_0.2s_linear_infinite]' : ''}`}>
            <span className="text-6xl sm:text-7xl font-black text-rose-600 drop-shadow-md">{d1 || 1}</span>
          </div>
          
          {/* Dice 2 (ถ้ามี) */}
          {isShowingTwoDice && (
            <div className={`w-24 h-24 sm:w-32 sm:h-32 bg-sky-100 rounded-3xl flex items-center justify-center shadow-[0_20px_50px_rgba(56,189,248,0.3)] border-4 border-sky-300 ${isRolling ? 'animate-[spin_0.2s_linear_infinite_reverse]' : ''}`}>
              <span className="text-6xl sm:text-7xl font-black text-sky-600 drop-shadow-md">{d2 || 1}</span>
            </div>
          )}
        </div>
        
        {!isRolling && diceResult && (
          <div className="mt-8 bg-slate-900/90 px-8 py-4 rounded-2xl border-2 border-white/20 shadow-2xl animate-[fadeInUp_0.3s_ease-out]">
            <p className="text-white text-xl font-bold">ได้แต้มรวม: <span className="text-4xl text-yellow-400 ml-2">{diceResult.total}</span></p>
          </div>
        )}
      </div>
    );
  };

  // --- Modal สุ่มการ์ดตอนเริ่มเทิร์น ---
  const renderTurnDrawModal = () => {
    if (!turnDrawData) return null;
    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <div className="bg-slate-900 border-4 border-white/20 p-8 rounded-[2rem] max-w-sm w-full text-center shadow-2xl animate-[bounceIn_0.4s_ease-out]">
          <div className="text-7xl mb-4">🎴</div>
          <h2 className="text-2xl font-black text-white mb-2 underline decoration-sky-500">จั่วการ์ดเริ่มเทิร์น!</h2>
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 mb-6 group transition-all hover:bg-slate-700">
             <div className="text-4xl mb-2">{ITEMS_DB.find(i => i.id === turnDrawData.card)?.icon || '📦'}</div>
             <div className="text-xl font-bold text-sky-400">{turnDrawData.cardName}</div>
             <p className="text-slate-400 text-sm mt-1">{ITEMS_DB.find(i => i.id === turnDrawData.card)?.description}</p>
          </div>
          {turnDrawData.autoAdded ? (
            <p className="text-emerald-400 font-bold mb-6">✅ เพิ่มเข้ากระเป๋าเรียบร้อย!</p>
          ) : (
            <p className="text-rose-400 font-bold mb-6">❌ {turnDrawData.reason}</p>
          )}
          <button 
            onClick={() => setTurnDrawData(null)}
            className="w-full bg-sky-600 hover:bg-sky-500 text-white font-black py-4 rounded-xl shadow-lg transition-transform hover:-translate-y-1"
          >
            ไปต่อ! (GOT IT)
          </button>
        </div>
      </div>
    );
  };

  // --- Modal เลือกการ์ดสำหรับ Scientist ---
  const renderScientistChoiceModal = () => {
    if (!scientistChoice) return null;
    const sendChoice = (cId) => {
       const discarded = scientistChoice.cards.find(x => x !== cId);
       socket.emit('scientist_choose_card', { card: cId, discarded });
       setScientistChoice(null);
    };
    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <div className="bg-slate-900 border-4 border-emerald-500/50 p-8 rounded-[2.5rem] max-w-lg w-full text-center shadow-2xl">
          <div className="text-6xl mb-4 animate-pulse">🧪</div>
          <h2 className="text-2xl font-black text-white mb-1">ความรู้คือพลัง!</h2>
          <p className="text-emerald-400 font-bold mb-6 italic">นักวิทยาศาสตร์วิเคราะห์การ์ดได้ 2 ใบ เลือกเก็บ 1 ใบ!</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            {scientistChoice.cards.map((cId, idx) => {
              const item = ITEMS_DB.find(i => i.id === cId);
              return (
                <button
                  key={idx}
                  onClick={() => sendChoice(cId)}
                  className="bg-slate-800 border-2 border-slate-700 p-4 rounded-2xl hover:border-emerald-500 hover:bg-slate-700 transition-all group overflow-hidden relative"
                >
                  <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">✨</div>
                  <div className="text-4xl mb-2">{item?.icon || '📦'}</div>
                  <div className="text-sm font-black text-white mb-1">{item?.name}</div>
                  <p className="text-[10px] text-slate-400 leading-tight">{item?.description}</p>
                </button>
              );
            })}
          </div>
          <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">อีกใบจะถูกส่งคืนกองกลาง</p>
        </div>
      </div>
    );
  };

  // --- Modal ตัดสินใจ Reroll สำหรับ Rookie ---
  const renderRookieRerollModal = () => {
    if (!pendingReroll) return null;
    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <div className="bg-slate-900 border-4 border-sky-500/50 p-8 rounded-[2.5rem] max-w-sm w-full text-center shadow-2xl">
          <div className="text-6xl mb-4">💤</div>
          <h2 className="text-2xl font-black text-white mb-1">มือใหม่หัดทอย!</h2>
          <p className="text-sky-400 font-bold mb-6">คุณทอยได้ <span className="text-2xl text-white">{pendingReroll.result}</span> ... จะทลุยต่อหรือเริ่มใหม่?</p>
          
          <div className="flex flex-col gap-3">
             <button
               onClick={() => {
                 socket.emit('confirm_roll', { useNew: false });
                 setPendingReroll(null);
               }}
               className="w-full bg-slate-800 hover:bg-slate-700 text-white font-black py-4 rounded-xl border border-slate-600 transition-all font-bold"
             >
               ✅ ใช้ผลเดิม ({pendingReroll.result}) แล้วเดินเลย
             </button>
             <button
               onClick={() => {
                 socket.emit('confirm_roll', { useNew: true });
                 setPendingReroll(null);
               }}
               className="w-full bg-sky-600 hover:bg-sky-500 text-white font-black py-4 rounded-xl shadow-lg shadow-sky-900/40 transition-transform hover:-translate-y-1"
             >
               🎲 ทอยใหม่! (Reroll)
             </button>
          </div>
        </div>
      </div>
    );
  };

  // Render Modal กระเป๋า (Inventory) & ระบบจัดการการ์ด
  const renderInventoryModal = () => {
    try {
      if (!showInventory) return null;
      const myPlayer = gameState?.players.find(p => p.socketId === socket?.id);
      if (!myPlayer) return null;

      const isMyTurn = gameState?.currentPlayerIndex === gameState?.players.findIndex(p => p.socketId === socket?.id);

    const myPokemons = myPlayer.pokemons?.map(id => POKEMON_DB.find(p => p.id === id)).filter(Boolean) || [];
    
    const allCards = myPlayer.cards || {};
    const pokeBalls = allCards['POKE_BALL'] || 0;
    const ultraBalls = allCards['ULTRA_BALL'] || 0;

    const otherCards = myPlayer.hand || [];
    const totalOtherCards = otherCards.length;
    const isOverLimit = totalOtherCards > 5;

    const handleDiscard = (itemId) => {
      socket.emit('discard_item', { itemId });
    };

    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
        <div className="bg-slate-900 border-[3px] border-amber-500/50 rounded-[2rem] w-full max-w-4xl shadow-[0_0_80px_rgba(245,158,11,0.2)] overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="p-4 sm:p-6 shrink-0 relative bg-slate-800/80 border-b border-slate-700 flex justify-between items-center">
            <div>
              <h2 className="text-xl sm:text-3xl font-black text-amber-400 flex items-center gap-2 tracking-widest">
                🎒 กระเป๋าของฉัน
              </h2>
              <div className="mt-1 text-xs sm:text-sm font-bold">
                {isMyTurn ? <span className="text-emerald-400">✅ ตอนนี้เป็นเทิร์นของคุณ (สามารถใช้งานการ์ดได้)</span> : <span className="text-slate-400">รอให้ถึงเทิร์นของคุณเพื่อใช้งานการ์ด</span>}
              </div>
              {isOverLimit && (
                <p className="text-xs sm:text-sm text-rose-400 font-bold mt-1 bg-rose-900/40 p-2 rounded-lg border border-rose-500/50 inline-block animate-pulse">
                  {handLimitMsg ? handLimitMsg : '⚠️ คุณมีการ์ดเกินขีดจำกัด (สูงสุด 5 ใบ) ต้องทิ้งการ์ดก่อนถึงจะปิดกระเป๋าได้'}
                </p>
              )}
            </div>
            {!isOverLimit && (
              <button 
                onClick={() => setShowInventory(false)} 
                className="text-slate-400 hover:text-white text-3xl font-black transition-colors bg-slate-700/50 hover:bg-rose-500 hover:shadow-[0_0_15px_rgba(225,29,72,0.8)] w-10 h-10 rounded-full flex items-center justify-center pb-1"
              >
                &times;
              </button>
            )}
          </div>

          {/* Body Content - Split Left/Right */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* โปเกมอนที่จับมาได้ */}
            <div className="flex flex-col">
              <h3 className="text-xs sm:text-sm font-black text-emerald-400 uppercase tracking-widest mb-3 border-b-2 border-emerald-500/30 pb-2">
                🐾 โปเกมอน ({myPokemons.length})
              </h3>
              <div className="bg-slate-800/40 rounded-2xl p-3 flex-1 overflow-y-auto border border-emerald-900/30">
                {myPokemons.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full opacity-50 py-10 space-y-2">
                    <span className="text-5xl opacity-30">🕸️</span>
                    <p className="font-bold text-slate-400 text-center text-xs">คุณยังไม่ได้จับโปเกมอนเลยสักตัวเดียว</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                    {myPokemons.map((mon, idx) => {
                      const myPlayerForBag = gameState?.players?.find(p => p.socketId === socket?.id);
                      const hasFreeEvo = (myPlayerForBag?.freeEvos || 0) > 0;
                      const canAfford = (myPlayerForBag?.money || 0) >= 2000;
                      const canEvolve = EVOLUTIONS[mon.id];
                      const evoDisabled = !hasFreeEvo && !canAfford;
                      return (
                      <div key={idx} className="bg-slate-900 border border-slate-700 rounded-xl p-2 flex flex-col items-center text-center shadow-lg relative group">
                        <span className="text-2xl sm:text-3xl mb-1 drop-shadow-md">{mon.image || '🐾'}</span>
                        <span className="font-black text-white text-[10px] sm:text-xs truncate w-full">{mon.name}</span>
                        <span className={`text-[7px] font-bold px-1 py-0.5 mt-1 rounded uppercase ${mon.rarity === 'Legendary' ? 'bg-amber-500 text-slate-900' : mon.rarity === 'Very Rare' ? 'bg-rose-500 text-white' : mon.rarity === 'Rare' ? 'bg-blue-500 text-white' : 'bg-slate-600 text-slate-200'}`}>
                          {mon.rarity}
                        </span>
                        {canEvolve && (
                          <button
                            onClick={() => socket.emit('evolve_pokemon', { pokemonIndex: idx })}
                            disabled={evoDisabled}
                            className={`mt-2 w-full text-[8px] text-white font-bold py-1 rounded transition-colors ${
                              evoDisabled ? 'bg-slate-700 opacity-50 cursor-not-allowed' :
                              hasFreeEvo ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-sky-600 hover:bg-sky-500'
                            }`}
                            title={hasFreeEvo ? 'ใช้สิทธิ์อีโวฟรีจากยิม' : 'พัฒนาร่างราคา 2,000฿'}
                          >
                            ✨ อีโว {hasFreeEvo ? '(ฟรี! 🎁)' : '(2,000฿)'}
                          </button>
                        )}
                      </div>
                    )})}
                  </div>
                )}
              </div>
            </div>

            {/* ไอเทมและการ์ด */}
            <div className="flex flex-col">
               <h3 className="text-xs sm:text-sm font-black text-blue-400 uppercase tracking-widest mb-3 flex items-center justify-between border-b-2 border-blue-500/30 pb-2">
                <span>🎴 การ์ดไอเทม</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${isOverLimit ? 'bg-rose-500 text-white animate-pulse' : 'bg-blue-900 text-blue-200'}`}>
                  มือ: {totalOtherCards}/5 ใบ
                </span>
              </h3>
              <div className="bg-slate-800/40 rounded-2xl p-3 flex-1 overflow-y-auto border border-blue-900/30">
                
                {/* Balls Section (Infinite limit) */}
                <div className="mb-4 bg-slate-900/50 p-3 rounded-xl border border-slate-700">
                   <h4 className="text-[10px] text-slate-400 font-bold mb-2 uppercase">ลูกบอล (ไม่จำกัดความจุ)</h4>
                   <div className="flex gap-3">
                     <div className="bg-slate-800 px-3 py-2 rounded-lg flex items-center gap-2 border border-rose-900/40 flex-1">
                        <span className="text-xl">🔴</span>
                        <div className="flex flex-col">
                           <span className="text-[9px] text-rose-300 font-bold uppercase">Poké Ball</span>
                           <span className="font-black text-white text-sm">×{pokeBalls}</span>
                        </div>
                     </div>
                     <div className="bg-slate-800 px-3 py-2 rounded-lg flex items-center gap-2 border border-purple-900/40 flex-1">
                        <span className="text-xl">🟣</span>
                        <div className="flex flex-col">
                           <span className="text-[9px] text-purple-300 font-bold uppercase">Ultra Ball</span>
                           <span className="font-black text-white text-sm">×{ultraBalls}</span>
                        </div>
                     </div>
                   </div>
                </div>

                {/* Cards Section */}
                <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700 min-h-[150px]">
                   <h4 className="text-[10px] text-slate-400 font-bold mb-2 uppercase flex items-center justify-between">
                     <span>การ์ดพิเศษ (ใส่ได้ 5 ใบ)</span>
                   </h4>
                   
                   {otherCards.length === 0 ? (
                      <div className="flex items-center justify-center h-20 text-slate-500 text-xs font-bold">ไม่มีการ์ดพิเศษ</div>
                   ) : (
                      <div className="space-y-2">
                        {otherCards.map((id, index) => {
                          const itemInfo = ITEMS_DB.find(i => i.id === id);
                          if (!itemInfo) return null;
                          return (
                             <div key={`${id}_${index}`} className="bg-gradient-to-r from-indigo-900 to-slate-800 p-2 rounded-lg border border-indigo-500/30 flex justify-between items-center shadow-lg">
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">🎴</span>
                                  <div className="flex flex-col">
                                    <span className="font-black text-[11px] text-indigo-200 uppercase">{itemInfo.name}</span>
                                    <span className="text-[8px] text-slate-400">{itemInfo.description}</span>
                                  </div>
                                </div>
                                <div className="flex gap-1 shrink-0">
                                    <button
                                      disabled={!isMyTurn}
                                      onClick={() => {
                                        socket.emit('use_item', { itemId: id });
                                        setShowInventory(false);
                                      }}
                                      className={`${!isMyTurn ? 'bg-slate-700 text-slate-500 cursor-not-allowed border-slate-600' : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400'} px-2 py-1 rounded-md text-[9px] font-bold border transition-colors`}
                                    >
                                      ใช้งาน
                                    </button>
                                  <button
                                    onClick={() => {
                                      handleDiscard(id);
                                      if (totalOtherCards - 1 <= 5) setHandLimitMsg('');
                                    }}
                                    className="bg-rose-900/60 hover:bg-rose-600 text-rose-200 hover:text-white px-2 py-1 rounded-md text-[9px] font-bold border border-rose-700 transition-colors"
                                  >
                                    ทิ้ง
                                  </button>
                                </div>
                             </div>
                          );
                        })}
                      </div>
                   )}
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    );
    } catch (e) {
      return (
        <div className="fixed z-[100] inset-0 p-10 bg-red-900 text-white font-mono text-xl whitespace-pre-wrap overflow-y-auto">
          <button onClick={() => setShowInventory(false)} className="bg-black p-4 mb-4">CLOSE ERROR</button>
          <h2>Error in renderInventoryModal: {e.message}</h2>
          <p>{e.stack}</p>
        </div>
      );
    }
  };

  // --------------------------------------------------------
  // โหมด PLAYING : หน้ากระดานเต็มจอ 4 มุม
  // --------------------------------------------------------
  if (gameState && gameState.status === 'PLAYING') {
    return (
      <div className="fixed inset-0 w-full h-full bg-slate-950 text-slate-100 overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black z-0"></div>

        {/* 4 มุมประจำตำแหน่งผู้เล่น */}
        {gameState.players.map((player, idx) => {
           // Mapping ตำแหน่งมุม 0=ซ้ายบน, 1=ขวาบน, 2=ซ้ายล่าง, 3=ขวาล่าง 
           const cornerClasses = [
             "top-4 left-4 sm:top-8 sm:left-8 flex-row",                      // Player 1
             "top-4 right-4 sm:top-8 sm:right-8 flex-row-reverse",            // Player 2
             "bottom-4 left-4 sm:bottom-8 sm:left-8 flex-row",                // Player 3
             "bottom-4 right-4 sm:bottom-8 sm:right-8 flex-row-reverse"       // Player 4
           ];
           
           const alignment = [
             "text-left",
             "text-right",
             "text-left",
             "text-right"
           ];

           const playerClass = POKEMON_CLASSES.find(c => c.id === player.classId);
           const isCurrentTurn = gameState.currentPlayerIndex === idx;
           
           return (
             <div key={player.socketId} className={`absolute z-20 ${cornerClasses[idx % 4]} flex items-center gap-3 w-40 sm:w-72 bg-slate-900/80 backdrop-blur-xl border ${isCurrentTurn ? 'border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.5)] scale-110' : 'border-slate-700/60 shadow-2xl'} p-3 sm:p-5 rounded-[1.5rem] transition-all duration-500`}>
               <div className={`w-10 h-10 sm:w-16 sm:h-16 shrink-0 rounded-[1rem] flex items-center justify-center text-xl sm:text-3xl font-black ${isCurrentTurn ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-slate-900 shadow-lg' : 'bg-slate-800 text-slate-400'}`}>
                 {playerClass ? playerClass.icon : '❓'}
               </div>
               <div className={`flex-1 min-w-0 ${alignment[idx % 4]}`}>
                 <div className="font-black text-slate-100 flex items-center justify-between gap-1.5 truncate text-sm sm:text-xl leading-none mb-1">
                   {player.name}
                   {player.socketId === socket?.id && <span className="text-[8px] sm:text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded-sm uppercase tracking-widest">You</span>}
                 </div>
                 <div className="text-emerald-400 font-mono font-bold text-xs sm:text-base leading-none mb-1 flex items-center justify-between">
                   <span>💰 {(player.money ?? 1500).toLocaleString()}฿</span>
                   {player.socketId === socket?.id && (
                     <button onClick={() => setShowInventory(true)} className="ml-2 bg-slate-800 hover:bg-slate-700 text-white rounded-md px-2 py-0.5 text-[8px] sm:text-[10px] shadow border border-slate-600 transition-colors pointer-events-auto shadow-black">
                       🎒 {player.pokemons ? player.pokemons.length : 0}
                     </button>
                   )}
                 </div>
                 <div className="text-slate-400 font-bold text-[8px] sm:text-[10px] leading-none mb-1 flex items-center gap-1.5 flex-wrap">
                   <span>🔴×{player.cards?.['POKE_BALL'] ?? 0}</span>
                   {(player.cards?.['ULTRA_BALL'] ?? 0) > 0 && <span>🟣×{player.cards['ULTRA_BALL']}</span>}
                   <div className={`w-full mt-1.5 flex gap-1 flex-wrap opacity-70 ${idx % 2 === 1 ? 'justify-end' : 'justify-start'}`}>
                      {player.pokemons?.slice(0, 3).map((monId, pIdx) => {
                         const mon = POKEMON_DB.find(m => m.id === monId);
                         return (
                           <span key={pIdx} className={`px-1 rounded-[4px] text-[7px] text-white border shadow-sm ${mon?.rarity === 'Legendary' ? 'bg-amber-600 border-amber-400' : 'bg-slate-800 border-slate-700'}`}>
                             {mon?.name?.split(' ')[0] || 'PKMN'}
                           </span>
                         );
                      })}
                      {(player.pokemons?.length || 0) > 3 && <span className="text-[7px] text-slate-500 font-black">+{player.pokemons.length - 3}</span>}
                   </div>
                 </div>
                 {player.socketId === socket?.id && (
                    <div className="mt-2 flex gap-1 pointer-events-auto">
                        <button 
                            disabled={player.ultimateCooldown > 0 || !isCurrentTurn} 
                            onClick={() => socket.emit('use_ultimate')}
                            className={`flex-1 flex flex-col items-center justify-center py-1 px-2 rounded-md border text-[8px] sm:text-[10px] font-black transition-all ${player.ultimateCooldown > 0 || !isCurrentTurn ? 'bg-slate-800/80 text-slate-500 border-slate-700/80 cursor-not-allowed' : 'bg-gradient-to-r from-amber-600 to-rose-600 text-white border-rose-500 shadow-md hover:scale-105 active:scale-95'}`}
                        >
                            <span className="leading-none text-[11px] mb-0.5 whitespace-nowrap">💥 Ultimate</span>
                            <span className="leading-none whitespace-nowrap text-[8px] text-amber-200">
                               {player.ultimateCooldown > 0 ? `(รอ ${player.ultimateCooldown} เทิร์น)` : (playerClass ? playerClass.ultimateDetails.split(':')[0] : 'พร้อมใช้!')}
                            </span>
                        </button>
                    </div>
                 )}
                  {isCurrentTurn ? (
                   <div className="mt-1 sm:mt-2 bg-amber-500/20 text-amber-300 font-bold px-2 py-1 rounded-lg text-[7px] sm:text-xs border border-amber-500/30 animate-pulse border-dashed">
                     🌟 ตาของคุณ
                   </div>
                 ) : (
                   <div className="mt-1 sm:mt-2 text-slate-600 font-bold text-[7px] sm:text-xs tracking-wider">
                     รอผู้เล่นอื่น...
                   </div>
                 )}
               </div>
             </div>
           )
        })}

        {/* กระดานเกมตรงกลางจอ (ทำขนาดให้ใหญ่ที่สุดเท่าที่จะใส่ได้โดยไม่ล้น) */}
        <div className="absolute inset-0 flex items-center justify-center p-20 sm:p-24 lg:p-36 xl:p-12 2xl:p-24 z-10 pointer-events-none">
          <div className="h-full w-full max-w-[120vh] max-h-[120vw] relative flex items-center justify-center pointer-events-auto">
             
             {renderBoardGrid()}
             
             {/* แผงควบคุมและทอยเต๋า ลอยอยู่ตรงกลางกระดาน */}
             <div className="absolute inset-0 m-auto w-full h-[65%] flex flex-col items-center justify-center z-10 pointer-events-auto scale-75 sm:scale-100">
               <h1 className="absolute z-0 text-[3rem] sm:text-[5rem] xl:text-[6rem] font-black tracking-widest text-slate-700/20 rotate-[-12deg] leading-none text-center select-none pointer-events-none drop-shadow-sm">
                  POKÉMON<br/><span className="text-[2rem] sm:text-[4rem] xl:text-[4.5rem]">MONOPOLY</span>
               </h1>
               
               <div className="relative z-10 text-center bg-slate-900/90 backdrop-blur-xl p-6 sm:p-10 rounded-[3rem] border-4 border-slate-800 shadow-[0_0_80px_rgba(0,0,0,0.8)] w-[90%] sm:w-full max-w-lg transition-all scale-90 sm:scale-100">
                 <div className="text-amber-400 font-black text-xl sm:text-3xl mb-3 flex items-center justify-center gap-3 tracking-wider">
                   <span className="animate-pulse">✨</span> TURN {gameState.turnCount} <span className="animate-pulse">✨</span>
                 </div>
                 <div className="text-slate-300 font-bold mb-6 sm:mb-8 text-base sm:text-xl">
                   ตานี้เป็นของ:<br/>
                   <span className="text-amber-500 text-2xl sm:text-5xl font-black mt-2 block tracking-tight uppercase px-4 truncate">
                     {gameState.players[gameState.currentPlayerIndex]?.name || '...'}
                   </span>
                 </div>
                 
                 {socket?.id === gameState.players[gameState.currentPlayerIndex]?.socketId ? (
                   gameState.players[gameState.currentPlayerIndex]?.jailedTurns > 0 ? (
                     <div className="flex flex-col gap-3 w-full">
                        <div className="bg-rose-900/40 p-4 rounded-2xl border border-rose-500/50 mb-2 animate-pulse">
                           <h3 className="text-xl sm:text-2xl font-black text-rose-400 mb-1">⛓️ คุณติดคุกใต้ดิน!</h3>
                           <p className="text-xs sm:text-sm font-bold text-slate-300">เหลือเวลาขังอีก {gameState.players[gameState.currentPlayerIndex]?.jailedTurns} เทิร์น</p>
                        </div>
                        <button 
                          onClick={() => socket.emit('jail_action', {action: 'pay'})} 
                          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black py-3 sm:py-4 px-6 rounded-xl shadow-lg border border-emerald-400/50 transform hover:scale-105 transition-all text-sm sm:text-lg"
                        >
                          💸 จ่าย 500฿ แหกคุกทันที
                        </button>
                        <button 
                          onClick={() => socket.emit('jail_action', {action: 'roll'})} 
                          className="w-full bg-slate-700 hover:bg-slate-600 text-white font-black py-3 sm:py-4 px-6 rounded-xl shadow-lg border border-slate-500 transform hover:scale-105 transition-all text-sm sm:text-lg"
                        >
                          🎲 เสี่ยงทอยเต๋าคู่ (แต้มต้องเท่ากัน)
                        </button>
                     </div>
                   ) : (
                    isRolling ? (
                      <div className="w-full py-5 flex flex-col items-center justify-center gap-4 bg-slate-800/40 rounded-[2rem] border border-slate-700/50">
                         <div className="flex gap-4">
                            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-white rounded-2xl sm:rounded-3xl shadow-[0_10px_40px_rgba(255,255,255,0.6)] flex items-center justify-center animate-[spin_0.3s_linear_infinite] border-4 border-slate-200">
                               <span className="text-5xl sm:text-7xl font-black text-rose-600 drop-shadow-md animate-pulse rotate-[-15deg]">
                                 {rollingDiceFace}
                               </span>
                            </div>
                            {gameState.players[gameState.currentPlayerIndex]?.extraDice > 0 && (
                              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-sky-100 rounded-2xl sm:rounded-3xl shadow-[0_10px_40px_rgba(56,189,248,0.4)] flex items-center justify-center animate-[spin_0.3s_linear_infinite] border-4 border-sky-300">
                                 <span className="text-5xl sm:text-7xl font-black text-sky-600 drop-shadow-md animate-pulse rotate-[15deg]">
                                   {rollingDiceFace2}
                                 </span>
                              </div>
                            )}
                         </div>
                         <p className="text-amber-400 font-bold mt-2 animate-pulse text-sm sm:text-lg tracking-widest uppercase">กำลังทุ่มกำลังทั้งหมด...</p>
                      </div>
                    ) : (
                      // ปุ่มทอยเต๋าปกติ
                      <div className="flex flex-col gap-3 w-full">
                        {['biker', 'psychic', 'aroma_lady', 'channeler', 'hiker'].includes(gameState.players[gameState.currentPlayerIndex]?.classId) && (
                           <button 
                             onClick={() => {
                               const cp = gameState.players[gameState.currentPlayerIndex];
                               if (cp.classId === 'channeler') {
                                 const others = gameState.players.filter(p => p.socketId !== socket?.id);
                                 if (others.length > 0) socket.emit('use_active_skill', { skillId: 'active', targetId: others[0].playerId });
                               } else {
                                 socket.emit('use_active_skill', { skillId: 'active' });
                               }
                             }}
                             className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white font-black py-4 px-6 rounded-2xl shadow-xl border border-purple-400/30 transition-all flex items-center justify-center gap-3 relative overflow-hidden group mb-2"
                           >
                             <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                             <span className="text-2xl animate-pulse">⚡</span>
                             <span className="text-lg">ใช้สกิลอาชีพ ({POKEMON_CLASSES.find(c => c.id === gameState.players[gameState.currentPlayerIndex]?.classId)?.name.split(' ')[0]})</span>
                           </button>
                         )}
                        <button 
                          onClick={handleRollDice}
                          disabled={isRolling}
                          className="w-full bg-gradient-to-br from-rose-500 to-rose-700 hover:from-rose-400 hover:to-rose-600 text-white font-black py-4 sm:py-6 px-6 sm:px-10 rounded-[1.5rem] sm:rounded-[2rem] shadow-[0_0_40px_rgba(225,29,72,0.6)] transition-all transform hover:-translate-y-2 active:translate-y-0 text-2xl sm:text-4xl tracking-wider border-[3px] border-rose-400/50 group"
                        >
                          <span className="inline-block group-hover:animate-bounce transition-transform duration-700 mr-4">🎲</span>ทอยเต๋า
                        </button>
                        <button 
                          onClick={() => setShowInventory(true)} 
                          className="w-full bg-slate-800 hover:bg-slate-700 text-amber-400 font-black py-3 sm:py-4 px-6 rounded-xl shadow-lg border border-amber-500/30 transition-all text-sm sm:text-lg mb-2"
                        >
                          🎒 เปิดกระเป๋าของฉัน (โปเกมอน & ไอเทม)
                        </button>
                      </div>
                    )
                  )
                 ) : (
                    <div className="w-full bg-slate-800/80 text-slate-500 font-bold py-4 sm:py-6 px-6 sm:px-10 rounded-[1.5rem] sm:rounded-[2rem] text-lg sm:text-2xl flex items-center justify-center gap-4 border-2 border-slate-700 border-dashed">
                       <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-slate-500 animate-ping"></div>
                       กำลังรอเพื่อนเล่น...
                    </div>
                 )}
                 {diceLog && (
                   <div className="absolute -top-12 sm:-top-16 left-1/2 -translate-x-1/2 whitespace-nowrap bg-amber-500 text-slate-900 font-black py-3 sm:py-4 px-8 sm:px-12 rounded-full shadow-2xl animate-[bounceIn_0.4s_ease-out] text-xl sm:text-4xl border-[4px] sm:border-[6px] border-slate-900 z-50">
                     {diceLog}
                   </div>
                 )}
               </div>
             </div>

          </div>
        </div>

        {renderReactionModal()}
        {renderTileActionModal()}
        {renderInventoryModal()}
        {renderGameOverModal()}
        {renderDiceDisplay()}
        {renderTurnDrawModal()}
        {renderScientistChoiceModal()}
        {renderRookieRerollModal()}
      </div>
    );
  }

  // --------------------------------------------------------
  // โหมด WAITING: หน้า Lobby ปกติ
  // --------------------------------------------------------

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 selection:bg-rose-500 selection:text-white">
      <div className={`w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-[0_0_50px_rgba(30,41,59,0.5)] overflow-hidden transition-all duration-500 ${isConnected ? 'max-w-4xl' : 'max-w-md'}`}>
        
        {/* Header สไตล์เกมโปเกมอน */}
        <div className="bg-gradient-to-r from-red-600 to-rose-600 py-6 px-8 text-center relative overflow-hidden flex items-center justify-between">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 border-[15px] border-white/10 rounded-full opacity-50"></div>
          
          <div className="relative z-10 text-left">
            <h1 className="text-3xl font-black text-white tracking-wider drop-shadow-lg font-sans">
              POKÉMON
            </h1>
            <p className="text-red-100 font-bold tracking-[0.3em] mt-1 text-[10px]">BOARD GAME</p>
          </div>

          {isConnected && gameState && (
            <div className="text-right z-10 hidden sm:block">
              <div className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-sm border border-white/20 text-xs font-bold px-4 py-1.5 rounded-full text-white tracking-wider shadow-lg">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                ROOM ID: {gameState.roomId}
              </div>
            </div>
          )}
        </div>

        <div className="p-8">
          {/* แจ้งเตือนข้อผิดพลาด (Global) */}
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm text-center font-medium shadow-[inset_0_0_20px_rgba(239,68,68,0.1)] animate-[pulse_0.5s_ease-out]">
              ⚠️ {errorMsg}
            </div>
          )}

          {!isConnected || !gameState ? (
            <form onSubmit={handleJoinGame} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400 ml-1">ชื่อตัวละครของคุณ</label>
                <input 
                  type="text" 
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-medium"
                  placeholder="ชื่อเท่ๆ ของคุณ (เช่น ซาโตชิ)"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400 ml-1">พิมพ์โค้ดลับเพื่อเข้าห้อง</label>
                <input 
                  type="text" 
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-bold uppercase tracking-wider"
                  placeholder="เช่น ROOM99"
                />
              </div>

              <button 
                type="submit" 
                className="w-full mt-4 bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white font-bold py-4 px-4 rounded-xl shadow-lg shadow-rose-900/40 transform hover:-translate-y-1 transition-all"
              >
                ตะลุยโลกโปเกมอน (Join Game)
              </button>
            </form>
          ) : gameState.status === 'WAITING' ? (
            
            /* หน้าต่าง Waiting Room: รอผู้เล่น */
            <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
              <div className="text-center pb-6 border-b border-slate-800">
                <div className="inline-flex items-center gap-2 bg-slate-800/80 border border-slate-700 text-xs font-bold px-4 py-1.5 rounded-full text-slate-300 mb-4 tracking-wider">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                  ROOM: {gameState.roomId} (WAITING)
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">รายชื่อผู้เล่นที่กำลังรอ</h2>
                <p className="text-rose-400 font-medium text-sm mt-1">{gameState.players.length} / 4 เตรียมพร้อม</p>
              </div>

              <ul className="space-y-3">
                {gameState.players.map((player, idx) => {
                  const isHost = player.socketId === gameState.hostId;
                  const isMe = player.socketId === socket.id;
                  const playerClass = POKEMON_CLASSES.find(c => c.id === player.classId);
                  
                  return (
                    <li 
                      key={player.socketId} 
                      className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                        isMe 
                          ? 'bg-rose-950/20 border-rose-500/50' 
                          : 'bg-slate-800/40 border-slate-700/50'
                      }`}
                    >
                      <div className="h-12 w-12 flex flex-shrink-0 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 shadow-inner">
                        <span className="text-xl font-black text-slate-600">{idx + 1}</span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-200 truncate flex items-center gap-2 text-lg">
                          {player.name}
                          {isMe && <span className="text-[10px] bg-rose-600 px-2 py-0.5 rounded-md text-white font-black tracking-widest uppercase">You</span>}
                          {isHost && <span className="text-[10px] bg-amber-500 px-2 py-0.5 rounded-md text-slate-900 font-black tracking-widest uppercase">Host</span>}
                        </p>
                        <p className="text-xs font-mono mt-0.5 truncate flex items-center gap-1.5 font-bold">
                          {playerClass ? <span className="text-amber-400">{playerClass.icon} {playerClass.name}</span> : <span className="text-slate-500 animate-pulse">⏳ กำลังเลือกอาชีพ...</span>}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* ส่วนเลือกอาชีพของฉัน */}
              <div className="mt-4 p-5 bg-slate-900/60 border border-slate-700/50 rounded-2xl shadow-inner">
                 <h3 className="text-sm font-bold text-slate-400 mb-3 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                   เลือกเส้นทางอาชีพของคุณ
                 </h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {POKEMON_CLASSES.map(cls => {
                       const myClass = gameState.players.find(p => p.socketId === socket.id)?.classId;
                       const isSelected = myClass === cls.id;
                       return (
                         <button
                           key={cls.id}
                           onClick={() => socket.emit('select_class', cls.id)}
                           className={`p-3 text-left rounded-xl transition-all duration-300 ${isSelected ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-slate-900 shadow-[0_0_15px_rgba(245,158,11,0.4)] border border-amber-400 scale-[1.02]' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:border-slate-500'}`}
                         >
                            <div className="font-black text-sm mb-1">{cls.icon} {cls.name}</div>
                            <div className={`text-[10px] leading-tight ${isSelected ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>{cls.desc}</div>
                         </button>
                       )
                    })}
                 </div>
              </div>
              
              <div className="pt-4 text-center">
                {socket.id === gameState.hostId ? (
                   <button 
                     onClick={() => socket.emit('start_game')}
                     className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-bold py-4 px-4 rounded-xl shadow-lg shadow-green-900/40 transform hover:-translate-y-1 transition-all text-lg tracking-wider focus:outline-none focus:ring-2 focus:ring-green-400"
                   >
                     🚀 เริ่มเกม (Start Game)
                   </button>
                ) : (
                  <div className="inline-flex items-center gap-2 text-slate-500 text-sm font-medium p-4">
                    <svg className="w-5 h-5 animate-spin text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    รอหัวหน้าห้องกดเริ่มเกม...
                  </div>
                )}
              </div>
            </div>

          ) : null}
        </div>
      </div>
      
      {/* Modal จบเทิร์นแบบ Pop-up (จะเด้งเมื่อมี landedTile อยู่ภายนอกสุด) */}
      {renderTileActionModal()}

      {/* Modal กระเป๋า (จะเด้งเมื่อกดปุ่มกระเป๋า) */}
      {renderInventoryModal()}
    </div>
  );
}
