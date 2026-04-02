const fs = require('fs');
const path = 'C:/Users/xxxx-xx-x--xxxx-x/.gemini/antigravity/scratch/pokemon_board_game/frontend/src/app/page.js';
let content = fs.readFileSync(path, 'utf8');

// 1. Add handLimitMsg state right after showInventory
const stateTarget = `const [showInventory, setShowInventory] = useState(false); // Modal กระเป๋า`;
const stateNew = `const [showInventory, setShowInventory] = useState(false); // Modal กระเป๋า\n  const [handLimitMsg, setHandLimitMsg] = useState('');`;
content = content.replace(stateTarget, stateNew);

// 2. Remove the old Effect ตรวจจับจำนวนไพ่เกิน
const effectTargetStart = `  // Effect ตรวจจับจำนวนไพ่เกิน`;
const effectTargetEnd = `}, [gameState, socket, showInventory]);`;
const effectChunk = content.substring(content.indexOf(effectTargetStart), content.indexOf(effectTargetEnd) + effectTargetEnd.length);
content = content.replace(effectChunk, '');

// 3. Add socket listener for hand_full_discard_required
const socketListenerTarget = `    socket.on('action_feedback', (feedback) => {`;
const socketListenerNew = `    socket.on('hand_full_discard_required', (data) => {
      setHandLimitMsg(data.message);
      setShowInventory(true);
    });

    socket.on('action_feedback', (feedback) => {`;
content = content.replace(socketListenerTarget, socketListenerNew);

// 4. Update renderInventoryModal cards handling
// Lines 976 to 978:
// const otherCards = Object.entries(allCards).filter(([id]) => id !== 'POKE_BALL' && id !== 'ULTRA_BALL');
// const totalOtherCards = otherCards.reduce((acc, [_, count]) => acc + count, 0);
// const isOverLimit = totalOtherCards > 5;
const inventoryCardsTarget = `const otherCards = Object.entries(allCards).filter(([id]) => id !== 'POKE_BALL' && id !== 'ULTRA_BALL');
    const totalOtherCards = otherCards.reduce((acc, [_, count]) => acc + count, 0);
    const isOverLimit = totalOtherCards > 5;`;

const inventoryCardsNew = `const otherCards = myPlayer.hand || [];
    const totalOtherCards = otherCards.length;
    const isOverLimit = totalOtherCards > 5;`;
content = content.replace(inventoryCardsTarget, inventoryCardsNew);

// 5. Update InventoryCards Section
const otherCardsSectionStart = content.indexOf(`{otherCards.map(([id, count]) => {`);
const otherCardsSectionEnd = content.indexOf(`</div>`, content.indexOf(`ใช้อัตโนมัติเวลาโดนแกล้ง</span>}`) + 100);

if (otherCardsSectionStart !== -1) {
    const sectionChunk = `                        {otherCards.map(([id, count]) => {
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
                                    ทิ้ง (Discard)
                                  </button>
                                </div>
                             </div>
                          ));
                        })}`;

    const newSectionChunk = `                        {otherCards.map((id, index) => {
                          const itemInfo = ITEMS_DB.find(i => i.id === id);
                          if (!itemInfo) return null;
                          return (
                             <div key={\`\${id}_\${index}\`} className="bg-gradient-to-r from-indigo-900 to-slate-800 p-2 rounded-lg border border-indigo-500/30 flex justify-between items-center shadow-lg">
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">🎴</span>
                                  <div className="flex flex-col">
                                    <span className="font-black text-[11px] text-indigo-200 uppercase">{itemInfo.name}</span>
                                    <span className="text-[8px] text-slate-400">{itemInfo.description}</span>
                                  </div>
                                </div>
                                <div className="flex gap-1 shrink-0">
                                    <button
                                      onClick={() => {
                                        socket.emit('use_item', { itemId: id });
                                        setShowInventory(false);
                                      }}
                                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-1 rounded-md text-[9px] font-bold border border-emerald-400 transition-colors"
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
                        })}`;
    content = content.replace(sectionChunk, newSectionChunk);
}

// 6. Fix closing button in inventory when overlimit
const limitWarningTarget = `⚠️ คุณมีการ์ดเกินขีดจำกัด (สูงสุด 5 ใบ) ต้องทิ้งการ์ดก่อนถึงจะปิดกระเป๋าได้`;
content = content.replace(limitWarningTarget, `{handLimitMsg ? handLimitMsg : '⚠️ คุณมีการ์ดเกินขีดจำกัด (สูงสุด 5 ใบ) ต้องทิ้งการ์ดก่อนถึงจะปิดกระเป๋าได้'}`);


// 7. Inject Ultimate Button in Corners
const cornerTarget = `                  <div className="text-slate-400 font-bold text-[8px] sm:text-[10px] leading-none mb-1 flex items-center gap-1.5">
                    <span>🔴×{player.cards?.['POKE_BALL'] ?? 0}</span>
                    {(player.cards?.['ULTRA_BALL'] ?? 0) > 0 && <span>🟣×{player.cards['ULTRA_BALL']}</span>}
                  </div>`;
const cornerNew = cornerTarget + `
                 {player.socketId === socket?.id && (
                    <div className="mt-2 flex gap-1 pointer-events-auto">
                        <button 
                            disabled={player.ultimateCooldown > 0 || !isCurrentTurn} 
                            onClick={() => socket.emit('use_ultimate')}
                            className={\`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-md border text-[8px] sm:text-[10px] font-black transition-all \${player.ultimateCooldown > 0 || !isCurrentTurn ? 'bg-slate-800/80 text-slate-500 border-slate-700/80 cursor-not-allowed' : 'bg-gradient-to-r from-amber-600 to-rose-600 text-white border-rose-500 shadow-md hover:scale-105 active:scale-95'}\`}
                        >
                            <span className="leading-none text-[11px] mb-0.5 whitespace-nowrap">💥 Ultimate</span>
                            <span className="leading-none whitespace-nowrap text-[8px] text-amber-200">
                               {player.ultimateCooldown > 0 ? \`(รอ \${player.ultimateCooldown} เทิร์น)\` : (playerClass ? playerClass.ultimateDetails.split(':')[0] : 'พร้อมใช้!')}
                            </span>
                        </button>
                    </div>
                 )}`;
content = content.replace(cornerTarget, cornerNew);

fs.writeFileSync(path, content, 'utf8');
console.log("Patched page.js final UI");
