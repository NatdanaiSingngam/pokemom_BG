const { POKEMON_DB } = require('../data/pokemonDB');

function generateGymEncounter() {
  const GYM_LEADERS = [
    { name: 'ทาเคชิ (Brock)', power: 2, element: '🪨' },
    { name: 'คาสึมิ (Misty)', power: 3, element: '💧' },
    { name: 'มาจิส (Lt. Surge)', power: 4, element: '⚡' },
    { name: 'เอริกะ (Erika)', power: 4, element: '🌱' },
    { name: 'เคียว (Koga)', power: 5, element: '☠️' },
    { name: 'นัตสึเมะ (Sabrina)', power: 5, element: '🔮' },
    { name: 'คาสึระ (Blaine)', power: 6, element: '🔥' },
    { name: 'ซาคากิ (Giovanni)', power: 6, element: '🌍' },
  ];
  return GYM_LEADERS[Math.floor(Math.random() * GYM_LEADERS.length)];
}

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

function getRandomEncounter(position = 0) {
  let targetRarity = "";
  const rowIndex = Math.floor(position / 10);

  if (rowIndex === 0) {
    targetRarity = "Common";      
  } else if (rowIndex === 1) {
    targetRarity = "Rare";        
  } else if (rowIndex === 2) {
    targetRarity = "Very Rare";   
  } else {
    targetRarity = "Legendary";   
  }

  const possiblePokemons = POKEMON_DB.filter(p => p.rarity === targetRarity);
  if(possiblePokemons.length === 0) return POKEMON_DB[0]; // fallback
  
  const randomIndex = Math.floor(Math.random() * possiblePokemons.length);
  return possiblePokemons[randomIndex];
}

// ฟังก์ชันสร้างกระดาน 40 ช่อง (สุ่มย่อยในแต่ละแถว)
function generateBoardMap() {
  const map = new Array(40).fill('WILD');
  
  // กำหนดช่องมุม 4 มุมคงที่
  map[0] = 'START';
  map[10] = 'JAIL';
  map[20] = 'AIRPORT';
  map[30] = 'SAFARI';

  // ฟังก์ชันสุ่มภายในช่วง index ที่กำหนด
  const fillRow = (startIdx, endIdx) => {
    let availableSlots = [];
    for (let i = startIdx; i <= endIdx; i++) availableSlots.push(i);
    
    // สับไพ่ (Shuffle) สล็อตว่าง
    availableSlots.sort(() => Math.random() - 0.5);
    
    // ดึง slot แรกให้เป็น EVENT
    map[availableSlots.pop()] = 'EVENT';
    
    // ดึง slot ต่อมาให้เป็น SHOP (ร้านค้า)
    map[availableSlots.pop()] = 'SHOP';

    // ดึงอีก 1 ช่อง ให้เป็น GYM (ลดจาก 2 เหลือ 1 ต่อแถว)
    map[availableSlots.pop()] = 'GYM';

    // ที่เหลือตกเป็น WILD โดยปริยาย
  };

  // แถวที่ 1-4 สับไพ่ยึดอัตราส่วนช่อง
  fillRow(1, 9);
  fillRow(11, 19);
  fillRow(21, 29);
  fillRow(31, 39);

  return map;
}

module.exports = {
  generateGymEncounter,
  getSafariEncounter,
  generateSafariEncounters,
  getRandomEncounter,
  generateBoardMap
};
