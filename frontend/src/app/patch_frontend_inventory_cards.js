const fs = require('fs');

const path = 'C:/Users/xxxx-xx-x--xxxx-x/.gemini/antigravity/scratch/pokemon_board_game/frontend/src/app/page.js';
let content = fs.readFileSync(path, 'utf8');

const targetStr = `                        {otherCards.map(([id, count]) => {
                          const isCardSelectable = true; // Later phases will link to DB
                          return Array.from({ length: count }).map((_, i) => (
                             <div key={\`\${id}_\${i}\`} className="bg-gradient-to-r from-indigo-900 to-slate-800 p-2 rounded-lg border border-indigo-500/30 flex justify-between items-center shadow-lg">
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">🎴</span>
                                  <span className="font-black text-[11px] text-indigo-200 uppercase">{id}</span>
                                </div>
                                <button
                                  onClick={() => handleDiscard(id)}
                                  className="bg-rose-900/60 hover:bg-rose-600 text-rose-200 hover:text-white px-2 py-1 rounded-md text-[9px] font-bold border border-rose-700 transition-colors"
                                >
                                  ทิ้งการ์ด
                                </button>
                             </div>
                          ));
                        })}`;

const newStr = `                        {otherCards.map(([id, count]) => {
                          const isCardSelectable = true; // Later phases will link to DB
                          const cardNames = {
                             'CARD_STEAL': { name: 'การ์ดขโมยเงิน', icon: '😈', useable: true },
                             'CARD_SHIELD': { name: 'การ์ดโล่ป้องกัน', icon: '🛡️', useable: false }
                          };
                          
                          return Array.from({ length: count }).map((_, i) => (
                             <div key={\`\${id}_\${i}\`} className="bg-gradient-to-r from-indigo-900 to-slate-800 p-2 rounded-lg border border-indigo-500/30 flex justify-between items-center shadow-lg">
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">{cardNames[id]?.icon || '🎴'}</span>
                                  <div className="flex flex-col">
                                    <span className="font-black text-[11px] text-indigo-200 uppercase">{cardNames[id]?.name || id}</span>
                                    {!cardNames[id]?.useable && <span className="text-[8px] text-slate-400">ใช้อัตโนมัติเวลาโดนแกล้ง</span>}
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  {cardNames[id]?.useable && (
                                    <button
                                      onClick={() => {
                                        socket.emit('use_active_item', { itemId: id });
                                        setShowInventory(false);
                                      }}
                                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-1 rounded-md text-[9px] font-bold border border-emerald-400 transition-colors"
                                    >
                                      ใช้งาน
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleDiscard(id)}
                                    className="bg-rose-900/60 hover:bg-rose-600 text-rose-200 hover:text-white px-2 py-1 rounded-md text-[9px] font-bold border border-rose-700 transition-colors"
                                  >
                                    ทิ้งการ์ด
                                  </button>
                                </div>
                             </div>
                          ));
                        })}`;

content = content.replace(targetStr, newStr);

fs.writeFileSync(path, content, 'utf8');
console.log("Patched otherCards rendering in page.js");
