const fs = require('fs');
const path = 'C:/Users/xxxx-xx-x--xxxx-x/.gemini/antigravity/scratch/pokemon_board_game/frontend/src/app/page.js';
let code = fs.readFileSync(path, 'utf8');

// Fix 1: The corrupted part at the top of the PLAYING phase
const corruptedPart = `      <div className="fixed inset-0 w-full h-full                        </div>
                    ) : (
                      // ปุ่มทอยเต๋าปกติ
                      <button 
                        onClick={handleRollDice}
                        disabled={isRolling}
                        className="w-full bg-gradient-to-br from-rose-500 to-rose-700 hover:from-rose-400 hover:to-rose-600 text-white font-black py-4 sm:py-6 px-6 sm:px-10 rounded-[1.5rem] sm:rounded-[2rem] shadow-[0_0_40px_rgba(225,29,72,0.6)] transition-all transform hover:-translate-y-2 active:translate-y-0 text-2xl sm:text-4xl tracking-wider border-[3px] border-rose-400/50 group"
                      >
                        <span className="inline-block group-hover:animate-bounce transition-transform duration-700 mr-4">🎲</span>ทอยเต๋า
                      </button>
                    )
                  )
                 ) : (
                    <div className="w-full bg-slate-800/80 text-slate-500 font-bold py-4 sm:py-6 px-6 sm:px-10 rounded-[1.5rem] sm:rounded-[2rem] text-lg sm:text-2xl flex items-center justify-center gap-4 border-2 border-slate-700 border-dashed">ass = POKEMON_CLASSES.find(c => c.id === player.classId);`;

const goodCode = `      <div className="fixed inset-0 w-full h-full bg-slate-950 text-slate-100 overflow-hidden font-sans">
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

           const playerClass = POKEMON_CLASSES.find(c => c.id === player.classId);`;

code = code.replace(corruptedPart, goodCode);

// Fix 2: The actual ternary fix at the bottom!
const missingParenPart = `                      </button>
                    )
                 ) : (
                    <div className="w-full bg-slate-800/80 text-slate-500 font-bold py-4 sm:py-6 px-6 sm:px-10 rounded-[1.5rem] sm:rounded-[2rem] text-lg sm:text-2xl flex items-center justify-center gap-4 border-2 border-slate-700 border-dashed">`;

const fixedParenPart = `                      </button>
                    )
                  )
                 ) : (
                    <div className="w-full bg-slate-800/80 text-slate-500 font-bold py-4 sm:py-6 px-6 sm:px-10 rounded-[1.5rem] sm:rounded-[2rem] text-lg sm:text-2xl flex items-center justify-center gap-4 border-2 border-slate-700 border-dashed">`;                     

code = code.replace(missingParenPart, fixedParenPart);

fs.writeFileSync(path, code, 'utf8');
console.log("Fixed page.js syntax");
