const fs = require('fs');
const path = 'C:/Users/xxxx-xx-x--xxxx-x/.gemini/antigravity/scratch/pokemon_board_game/frontend/src/app/page.js';
let content = fs.readFileSync(path, 'utf8');

// 1. Add gymData state
const baseStateTarget = `const [safariData, setSafariData] = useState(null);`;
const baseStateNew = `const [safariData, setSafariData] = useState(null);
  const [gymData, setGymData] = useState(null);`;
content = content.replace(baseStateTarget, baseStateNew);

// 2. Capture data.gymData in player_landed
const playerLandedTarget = `          if (data.safariEncounters) setSafariData(data.safariEncounters);
          setEncounterData(null);`;
const playerLandedNew = `          if (data.safariEncounters) setSafariData(data.safariEncounters);
          if (data.gymData) setGymData(data.gymData);
          setEncounterData(null);`;
content = content.replace(playerLandedTarget, playerLandedNew);

// 3. Add GYM UI in renderTileActionModal()
const actionModalTarget = `    // ===== AIRPORT: สนามบินวิทยุ =====`;
const gymUiCode = `    // ===== GYM: ท้าประลองยิมลีดเดอร์ =====
    if (landedTile === 'GYM' && gymData) {
      const myPlayer = gameState?.players?.find(p => p.socketId === socket?.id);
      const isGymLeaderClass = myPlayer?.classId === 'gym_leader';
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-[fadeIn_0.3s_ease-out]">
          <div className="bg-slate-900 border-4 border-orange-500/80 p-6 sm:p-10 rounded-[2rem] max-w-lg w-full shadow-[0_0_80px_rgba(249,115,22,0.4)] text-center">
            
            <div className="text-6xl mb-2 animate-pulse">{gymData.element}</div>
            <h2 className="text-3xl sm:text-4xl font-black text-orange-400 mb-2 uppercase">ท้าประลองยิม!</h2>
            
            <div className="bg-slate-800 border-2 border-slate-700 p-4 rounded-xl mb-6">
              <p className="text-slate-300 font-bold mb-1">ยิมลีดเดอร์ที่คุณพบ:</p>
              <h3 className="text-2xl font-black text-white">{gymData.name}</h3>
              <p className="text-rose-400 font-black mt-2 text-lg">ระดับพลัง: {gymData.power} 🔥</p>
            </div>

            <div className="mb-6 flex flex-col gap-2">
               <button
                 onClick={() => {
                   socket.emit('attempt_gym_battle', { gymPower: gymData.power });
                   setLandedTile(null); // ปิดหน้าต่างให้ลุ้นโบลด์เอาบนกระดาน
                 }}
                 className="w-full bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-500 hover:to-rose-500 text-white font-black py-4 px-6 rounded-xl shadow-[0_10px_20px_-10px_rgba(249,115,22,0.8)] text-xl border-2 border-orange-400"
               >
                 🎲 ทอยเต๋าต่อสู้! (ต้องการ {gymData.power} ขึ้นไป)
               </button>
               {isGymLeaderClass && <p className="text-emerald-400 text-xs font-bold mt-1">✨ โบนัสอาชีพ: แต้มเต๋าจะ +2 เสมอ!</p>}
            </div>

            <button 
                onClick={handleEndTurn}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold py-3 px-4 rounded-xl transition-all border border-slate-600"
              >
                หนีดีกว่า (จบเทิร์น)
            </button>
          </div>
        </div>
      );
    }
    
    // ===== AIRPORT: สนามบินวิทยุ =====`;
content = content.replace(actionModalTarget, gymUiCode);

fs.writeFileSync(path, content, 'utf8');
console.log("Patched page.js for Gym UI");
