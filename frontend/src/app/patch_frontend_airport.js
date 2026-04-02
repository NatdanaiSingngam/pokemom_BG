const fs = require('fs');

const path = 'C:/Users/xxxx-xx-x--xxxx-x/.gemini/antigravity/scratch/pokemon_board_game/frontend/src/app/page.js';
let content = fs.readFileSync(path, 'utf8');

const targetStr = `// ===== SHOP: ร้านซื้อไอเทม =====`;

const airportCode = `// ===== AIRPORT: สนามบินวิทยุ =====
    if (landedTile === 'AIRPORT') {
      const myPlayer = gameState?.players?.find(p => p.socketId === socket?.id);
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-slate-900 border-[3px] border-sky-400/50 p-6 sm:p-10 rounded-[2rem] max-w-2xl w-full shadow-[0_0_60px_rgba(56,189,248,0.3)] relative overflow-hidden flex flex-col max-h-[90vh]">
            
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
                        className={\`flex flex-col items-center justify-center p-2 rounded-xl border transition-all \${isCurrent ? 'bg-slate-800 border-rose-500 opacity-50 cursor-not-allowed' : 'bg-slate-800/80 border-slate-600 hover:border-sky-400 hover:bg-slate-700 hover:scale-110'}\`}
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

    `;

content = content.replace(targetStr, airportCode + targetStr);

fs.writeFileSync(path, content, 'utf8');
console.log("Patched page.js for AIRPORT");
