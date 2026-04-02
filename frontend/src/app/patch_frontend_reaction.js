const fs = require('fs');

const path = 'C:/Users/xxxx-xx-x--xxxx-x/.gemini/antigravity/scratch/pokemon_board_game/frontend/src/app/page.js';
let content = fs.readFileSync(path, 'utf8');

const targetStr = `  // --------------------------------------------------------
  // ส่วน UI ย่อย
  // --------------------------------------------------------`;

const newStr = `  // --------------------------------------------------------
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
                  className={\`w-full font-black py-4 px-6 rounded-xl shadow-lg border transition-all text-lg \${hasShield ? 'bg-gradient-to-r from-emerald-600 to-emerald-400 text-white border-emerald-400 hover:scale-105' : 'bg-slate-800 text-slate-500 border-slate-700 opacity-50 cursor-not-allowed'}\`}
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
        <style dangerouslySetInnerHTML={{__html: \`
          @keyframes scaleX {
            from { transform: scaleX(1); }
            to { transform: scaleX(0); }
          }
        \`}} />
      </div>
    );
  };

  // --------------------------------------------------------
  // ส่วน UI ย่อย
  // --------------------------------------------------------`;

content = content.replace(targetStr, newStr);

// Now ensure we mount renderReactionModal at the bottom just like renderTileActionModal
const renderBottomTarget = `        {renderTileActionModal()}`;
const renderBottomNew = `        {renderReactionModal()}
        {renderTileActionModal()}`;
content = content.replace(renderBottomTarget, renderBottomNew);

fs.writeFileSync(path, content, 'utf8');
console.log("Patched renderReactionModal inside page.js");
