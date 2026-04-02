const fs = require('fs');

const path = 'C:/Users/xxxx-xx-x--xxxx-x/.gemini/antigravity/scratch/pokemon_board_game/frontend/src/app/page.js';
let content = fs.readFileSync(path, 'utf8');

const targetCheck = "{socket?.id === gameState.players[gameState.currentPlayerIndex]?.socketId ? (";

const replacementStr = `{socket?.id === gameState.players[gameState.currentPlayerIndex]?.socketId ? (
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
                   ) : (`;

content = content.replace(targetCheck, replacementStr + "\n" + "                    isRolling ? (");
// Wait, targetCheck is already replacing. Let's do it cleanly using split or exact match.
// To be safe, I'll use regex.

const exactMatch = `{socket?.id === gameState.players[gameState.currentPlayerIndex]?.socketId ? (
                    isRolling ? (`;

const newCode = `{socket?.id === gameState.players[gameState.currentPlayerIndex]?.socketId ? (
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
                   ) : isRolling ? (`;

content = content.replace(exactMatch, newCode);

fs.writeFileSync(path, content, 'utf8');
console.log("Patched page.js for JAIL");
