const CLASSES_DB = [
  { 
    id: 'rookie', 
    name: 'เทรนเนอร์หน้าใหม่ (Rookie)', 
    icon: '🧢', 
    starterPokemon: 'mon_133', // Eevee
    passiveDetails: 'ทอยเต๋าใหม่ได้ 1 ครั้งต่อเทิร์น', 
    activeDetails: '', 
    ultimateDetails: 'Evolve!: สุ่มพัฒนาร่างอีวุยเพื่อรับบัฟพิเศษ (เช่น ไฟ=เพิ่มเงิน, น้ำ=เดินไกล, ไฟฟ้า=จั่วการ์ด)' 
  },
  { 
    id: 'bug_catcher', 
    name: 'นักจับแมลง (Bug Catcher)', 
    icon: '🦋', 
    starterPokemon: 'mon_010', // Caterpie
    passiveDetails: 'ทอยเต๋าจับโปเกมอนประเภทแมลงและพืช +1 แต้ม', 
    activeDetails: '', 
    ultimateDetails: 'Sleep Powder: ปล่อยละอองนิทรา ทำให้ผู้เล่นทุกคนหลับ ข้ามเทิร์น 1 รอบ' 
  },
  { 
    id: 'hiker', 
    name: 'นักปีนเขา (Hiker)', 
    icon: '⛰️', 
    starterPokemon: 'mon_074', // Geodude
    passiveDetails: 'ไม่โดนเอฟเฟกต์การ์ดที่ทำให้หยุดเดิน/ติดกับดัก', 
    activeDetails: '', 
    ultimateDetails: 'Earthquake: แผ่นดินไหว! ผู้เล่นทุกคนในระยะ 3 ช่องรอบตัว เงินกระเด็นหายไป 20%' 
  },
  { 
    id: 'rocket_grunt', 
    name: 'ลูกสมุนร็อคเก็ต (Rocket Grunt)', 
    icon: '🚀', 
    starterPokemon: 'mon_041', // Zubat
    passiveDetails: 'เดินผ่านใคร จะขโมยเงิน 100 ทันที โดยไม่ต้องกดใช้', 
    activeDetails: '', 
    ultimateDetails: 'Snatch: สุ่มขโมยโปเกมอน 1 ตัว จากเป้าหมายเพื่อเอาไปขายเอง' 
  },
  { 
    id: 'beauty', 
    name: 'สาวงาม (Beauty)', 
    icon: '💄', 
    starterPokemon: 'mon_037', // Vulpix
    passiveDetails: 'ซื้อของในร้านค้าลดราคา 20% และขายของแพงขึ้น 10%', 
    activeDetails: '', 
    ultimateDetails: 'Attract: สเน่ห์ดึงดูด! บังคับผู้เล่น 1 คนให้เดินมาหยุดที่ช่องเดียวกับตัวเอง' 
  },
  { 
    id: 'swimmer', 
    name: 'นักว่ายน้ำ (Swimmer)', 
    icon: '🩱', 
    starterPokemon: 'mon_116', // Horsea
    passiveDetails: 'เดินตกช่องที่เป็น "น้ำ" จะได้จั่วการ์ดฟรี 1 ใบ', 
    activeDetails: '', 
    ultimateDetails: 'Whirlpool: วางน้ำวนลงบนช่องเป้าหมาย ใครเดินตกจะเสียเทิร์น 1 รอบ' 
  },
  { 
    id: 'fisherman', 
    name: 'นักตกปลา (Fisherman)', 
    icon: '🎣', 
    starterPokemon: 'mon_129', // Magikarp
    passiveDetails: 'ทุกครั้งที่ทอยเต๋าได้เลข 1 จะได้เงินปลอบใจ 300', 
    activeDetails: '', 
    ultimateDetails: 'Gyarados Intimidate: ให้คอยคิงพัฒนาร่าง ขู่คำรามให้ทุกคนถอยหลัง 3 ช่องในเทิร์นหน้า' 
  },
  { 
    id: 'psychic', 
    name: 'เอสเปอร์ (Psychic)', 
    icon: '🔮', 
    starterPokemon: 'mon_063', // Abra
    passiveDetails: '', 
    activeDetails: 'ทิ้งการ์ด 1 ใบ เพื่อสลับที่กับผู้เล่นที่อยู่ใกล้ที่สุด', 
    ultimateDetails: 'HypnoPendulum: สะกดจิตหมู่ บังคับให้ทุกคนทิ้งการ์ดไอเทมในมือทั้งหมด' 
  },
  { 
    id: 'biker', 
    name: 'เด็กแว้น (Biker)', 
    icon: '🏍️', 
    starterPokemon: 'mon_109', // Koffing
    passiveDetails: 'ทอยเต๋าเดิน +2 แต้มเสมอ แต่ต้องเสียค่าน้ำมันเทิร์นละ 150', 
    activeDetails: '', 
    ultimateDetails: 'Smokescreen: ปล่อยควันพิษบังจอ! คลุมบอร์ด 1 โซน ใครเดินผ่านติดสถานะพิษ' 
  },
  { 
    id: 'gambler', 
    name: 'นักพนัน (Gambler)', 
    icon: '🎰', 
    starterPokemon: 'mon_052', // Meowth
    passiveDetails: 'Pay Day: ได้เงินเท่ากับแต้มเต๋าที่ทอยได้ x 50 ทุกครั้งที่เดิน', 
    activeDetails: '', 
    ultimateDetails: 'Jackpot: โยนเหรียญ! ถ้าออกหัว ได้รับ 3,000 ถ้าออกก้อย เสีย 3,000' 
  },
  { 
    id: 'aroma_lady', 
    name: 'นักพฤกษศาสตร์ (Aroma Lady)', 
    icon: '🌸', 
    starterPokemon: 'mon_043', // Oddish
    passiveDetails: '', 
    activeDetails: 'วางการ์ดกับดักสถานะ (ชา/พิษ) ลงบนรอยเท้าที่ตัวเองเดินผ่าน', 
    ultimateDetails: 'Solar Beam: ยิงลำแสงทำลายอีเวนต์บนช่อง 1 ช่องให้กลายเป็นช่องเปล่า' 
  },
  { 
    id: 'black_belt', 
    name: 'จอมคาราเต้ (Black Belt)', 
    icon: '🥋', 
    starterPokemon: 'mon_066', // Machop
    passiveDetails: 'ต่อสู้กับยิม (Gym) จะทอยเต๋าได้โบนัส +2 ดาเมจเสมอ', 
    activeDetails: '', 
    ultimateDetails: 'Seismic Toss: จับผู้เล่น 1 คน โยนกระเด็นไปตกที่ช่องสุ่ม' 
  },
  { 
    id: 'channeler', 
    name: 'หมอผี (Channeler)', 
    icon: '👻', 
    starterPokemon: 'mon_092', // Gastly
    passiveDetails: '', 
    activeDetails: 'สาปแช่ง! เสียเงิน 300 ทำให้เป้าหมายทิ้งการ์ดแบบสุ่ม 1 ใบ', 
    ultimateDetails: 'Destiny Bond: ผูกวิญญาณ! สลับเงินของตัวเองกับเป้าหมาย (ใช้ตอนจนสุด)' 
  },
  { 
    id: 'ranger', 
    name: 'พรานป่า (Ranger)', 
    icon: '🏕️', 
    starterPokemon: 'mon_123', // Scyther
    passiveDetails: 'เข้าช่องป่า (Safari) ไม่เสียค่าเข้า และได้โปเกบอลฟรี 1 ลูก', 
    activeDetails: '', 
    ultimateDetails: 'Slash & Steal: ฟันฉับ! ขโมยการ์ดไอเทมจากมือเป้าหมาย 2 ใบ' 
  },
  { 
    id: 'scientist', 
    name: 'นักวิทยาศาสตร์ (Scientist)', 
    icon: '🧪', 
    starterPokemon: 'mon_081', // Magnemite
    passiveDetails: 'ใน Draw Phase จั่วการ์ด 2 ใบ (เลือกเก็บ 1 ทิ้ง 1)', 
    activeDetails: '', 
    ultimateDetails: 'Master Clone: ก๊อปปี้ Ultimate Skill ของใครก็ได้ในสนามมาใช้ 1 ครั้ง' 
  },
  { 
    id: 'rich_boy', 
    name: 'คุณหนูไฮโซ (Rich Boy)', 
    icon: '💎', 
    starterPokemon: 'mon_058', // Growlithe
    passiveDetails: 'เริ่มเกมมาพร้อมกับเงินทุน 5,000 ฿ ทันที', 
    activeDetails: '', 
    ultimateDetails: 'Bribe System: ติดสินบน! ซื้อโปเกมอนป่าตัวที่โผล่มาได้เลยโดยไม่ต้องทอยเต๋าจับ' 
  }
];

module.exports = CLASSES_DB;
