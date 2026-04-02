const fs = require('fs');
const path = 'C:/Users/xxxx-xx-x--xxxx-x/.gemini/antigravity/scratch/pokemon_board_game/frontend/src/app/page.js';
let content = fs.readFileSync(path, 'utf8');

// 1. Add state variable for Safari Data
const stateTarget = `const [landedTile, setLandedTile] = useState(null); // เก็บช่องที่เพิ่งเดินไปตก`;
const sfState = `const [landedTile, setLandedTile] = useState(null);
  const [safariData, setSafariData] = useState(null);`;
content = content.replace(stateTarget, sfState);

// 2. Update player_landed to save safari data
const setLandedTileRegex = /setLandedTile\(data\.tileType\);\s*setEncounterData\(null\);/g;
content = content.replace(setLandedTileRegex, `setLandedTile(data.tileType);\n          if (data.safariEncounters) setSafariData(data.safariEncounters);\n          setEncounterData(null);`);

// 3. Add SAFARI to renderTileActionModal
const shopTarget = `// ===== SHOP: ร้านซื้อไอเทม =====`;
const safariSect = `// ===== SAFARI: ซาฟารี =====
    if (landedTile === 'SAFARI') {
       return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-slate-900 border-[3px] border-emerald-500/50 p-6 sm:p-10 rounded-[2rem] max-w-3xl w-full shadow-[0_0_80px_rgba(16,185,129,0.3)] relative flex flex-col">
            <div className="text-center mb-6 z-10">
              <div className="text-6xl mb-4 animate-bounce">🦁</div>
              <h2 className="text-2xl sm:text-4xl font-black text-emerald-400 mb-2 tracking-widest uppercase truncate drop-shadow-md">ซาฟารีโซน</h2>
              <p className="text-slate-300 font-medium text-sm sm:text-base">
                สุ่มเจอโปเกมอน 4 ตัว! เลือกตัวที่คุณอยากจับที่สุด:
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 z-10">
              {safariData?.map((mon, idx) => (
                <button
                  key={\`safari_\${idx}\`}
                  onClick={() => {
                     setEncounterData(mon);
                     setLandedTile('WILD'); // โยกไปใช้ระบบต่อสู้ปกติ
                     setSafariData(null);
                  }}
                  className="bg-slate-800/80 hover:bg-slate-700 border border-slate-600 hover:border-emerald-400 rounded-2xl p-4 flex flex-col items-center justify-center transition-all hover:scale-105 shadow-lg group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-5xl mb-2 drop-shadow-lg scale-100 group-hover:scale-110 transition-transform">{mon.image || '🐾'}</span>
                  <span className="font-black text-white text-sm whitespace-nowrap mb-1">{mon.name}</span>
                  <span className={\`text-[9px] font-bold px-2 py-0.5 rounded shadow-inner uppercase \${mon.rarity === 'Legendary' ? 'bg-amber-500 text-slate-900' : mon.rarity === 'Very Rare' ? 'bg-rose-500 text-white' : mon.rarity === 'Rare' ? 'bg-blue-500 text-white' : 'bg-slate-600 text-slate-200'}\`}>
                     {mon.rarity}
                  </span>
                </button>
              ))}
            </div>

            <button 
                onClick={handleEndTurn}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 px-4 rounded-xl transition-all border border-slate-600 z-10"
              >
                ออกจากซาฟารี (จบเทิร์น)
            </button>
          </div>
        </div>
       )
    }

    // ===== SHOP: ร้านซื้อไอเทม =====`;

content = content.replace(shopTarget, safariSect);

fs.writeFileSync(path, content, 'utf8');
console.log("Patched SAFARI UI onto page.js");
