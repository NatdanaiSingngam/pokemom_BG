const fs = require('fs');

const path = 'C:/Users/xxxx-xx-x--xxxx-x/.gemini/antigravity/scratch/pokemon_board_game/frontend/src/app/page.js';
let content = fs.readFileSync(path, 'utf8');

const evoDictStr = `const EVOLUTIONS = {
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
`;

const insertPt = `const RAW_POKEMON_DB = [`;
content = content.replace(insertPt, evoDictStr + '\n' + insertPt);


const monListRenderStr = `{myPokemons.map((mon, idx) => (
                      <div key={idx} className="bg-slate-900 border border-slate-700 rounded-xl p-2 flex flex-col items-center text-center shadow-lg relative group">
                        <span className="text-2xl sm:text-3xl mb-1 drop-shadow-md">{mon.image || '🐾'}</span>
                        <span className="font-black text-white text-[10px] sm:text-xs truncate w-full">{mon.name}</span>
                        <span className={\`text-[7px] font-bold px-1 py-0.5 mt-1 rounded uppercase \${mon.rarity === 'Legendary' ? 'bg-amber-500 text-slate-900' : mon.rarity === 'Very Rare' ? 'bg-rose-500 text-white' : mon.rarity === 'Rare' ? 'bg-blue-500 text-white' : 'bg-slate-600 text-slate-200'}\`}>
                          {mon.rarity}
                        </span>
                      </div>
                    ))}`;

const newMonListRenderStr = `{myPokemons.map((mon, idx) => (
                      <div key={idx} className="bg-slate-900 border border-slate-700 rounded-xl p-2 flex flex-col items-center text-center shadow-lg relative group">
                        <span className="text-2xl sm:text-3xl mb-1 drop-shadow-md">{mon.image || '🐾'}</span>
                        <span className="font-black text-white text-[10px] sm:text-xs truncate w-full">{mon.name}</span>
                        <span className={\`text-[7px] font-bold px-1 py-0.5 mt-1 rounded uppercase \${mon.rarity === 'Legendary' ? 'bg-amber-500 text-slate-900' : mon.rarity === 'Very Rare' ? 'bg-rose-500 text-white' : mon.rarity === 'Rare' ? 'bg-blue-500 text-white' : 'bg-slate-600 text-slate-200'}\`}>
                          {mon.rarity}
                        </span>
                        {EVOLUTIONS[mon.id] && (
                          <button
                            onClick={() => socket.emit('evolve_pokemon', { pokemonIndex: idx })}
                            className="mt-2 w-full text-[8px] bg-sky-600 hover:bg-sky-500 text-white font-bold py-1 rounded"
                            title="พัฒนาร่างใช้ 2000฿"
                          >
                            ✨ อีโว (2,000฿)
                          </button>
                        )}
                      </div>
                    ))}`;

content = content.replace(monListRenderStr, newMonListRenderStr);

fs.writeFileSync(path, content, 'utf8');
console.log("Patched EVOLUTIONS rendering in page.js");
