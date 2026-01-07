
import React, { useState } from 'react';
import { 
  EXALTED_VENUS, MAX_STORAGE_PER_CREATOR_MB, APP_FEE_PERCENTAGE 
} from '../constants';
import { parsePriceList } from '../geminiService';

export const CreatorStudio: React.FC = () => {
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [rawText, setRawText] = useState('');
  const [aiProducts, setAiProducts] = useState<any[]>([]);
  const [ytSynced, setYtSynced] = useState(EXALTED_VENUS.youtubeConfig?.isConnected);
  
  const handleAiParse = async () => {
    if (!rawText.trim()) return;
    setIsAiLoading(true);
    const result = await parsePriceList(rawText);
    if (result) setAiProducts(result);
    setIsAiLoading(false);
  };

  const syncYoutube = () => {
    setIsAiLoading(true);
    setTimeout(() => {
      setYtSynced(true);
      setIsAiLoading(false);
    }, 2000);
  };

  return (
    <div className="p-4 md:p-12 space-y-12 bg-[#fcfdfe] min-h-screen pb-40">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase mb-2">Studio</h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Kreator: {EXALTED_VENUS.displayName}</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={syncYoutube}
            className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${ytSynced ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-red-600 text-white shadow-xl'}`}
          >
            {ytSynced ? 'YouTube Povezan ✅' : 'Poveži YouTube 🎬'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* AI Generator Section */}
          <div className="bg-white rounded-[3.5rem] p-12 border-4 border-indigo-50 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 blur-[80px] pointer-events-none"></div>
             
             <div className="flex items-center gap-5 mb-10 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white rounded-[1.5rem] flex items-center justify-center text-3xl shadow-xl shadow-indigo-200">✨</div>
                <div>
                   <h3 className="text-2xl font-black uppercase tracking-tighter">AI Cenovnik Generator</h3>
                   <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Paste tvoj cenovnik - mi pravimo luksuznu prodavnicu</p>
                </div>
             </div>
             
             <textarea 
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Npr: Tarot čitanje 20 min 65€, 30 min 75€, Natalna karta 120€..."
                className="w-full h-48 bg-gray-50 border-2 border-gray-100 rounded-[2.5rem] p-8 text-sm font-medium focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all mb-8 shadow-inner text-gray-900 placeholder:text-gray-300"
             />
             
             <button 
                onClick={handleAiParse}
                disabled={isAiLoading}
                className="w-full bg-gray-950 text-white py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-indigo-600 transition-all disabled:opacity-50 shadow-2xl"
             >
                {isAiLoading ? 'Gemini Kreira Tvoju Prodavnicu...' : 'Generiši Prodavnicu'}
             </button>

             {aiProducts.length > 0 && (
               <div className="mt-16 animate-fade-in-up">
                  <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-6">Preview Tvojih Usluga</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {aiProducts.map((p, i) => (
                      <div key={i} className="p-8 bg-white rounded-[2.5rem] border-2 border-indigo-100 relative group overflow-hidden shadow-lg">
                         <div className="text-xl font-black text-gray-900 mb-2">{p.name}</div>
                         <div className="text-[11px] text-gray-400 font-bold uppercase mb-6 leading-relaxed">{p.description}</div>
                         <div className="flex items-center justify-between">
                            <div className="text-2xl font-black text-indigo-600">€{p.price}</div>
                            <div className="text-[8px] bg-indigo-50 px-3 py-1.5 rounded-lg font-black uppercase text-indigo-600 border border-indigo-100">{p.type}</div>
                         </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-10 flex justify-center">
                     <button className="bg-emerald-600 text-white px-12 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-widest shadow-xl shadow-emerald-100">SAČUVAJ I OBJAVI PRODAVNICU ✅</button>
                  </div>
               </div>
             )}
          </div>

          {/* Finance Overview */}
          <div className="bg-gray-950 rounded-[3.5rem] p-16 text-white relative overflow-hidden shadow-2xl group">
             <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full -mr-48 -mt-48 blur-[100px]"></div>
             <h2 className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em] mb-4">Mesečna Zarada</h2>
             <div className="flex items-end gap-6">
                <div className="text-7xl font-black tracking-tighter">€1,240.50</div>
                <div className="text-emerald-400 font-black text-sm mb-4">+12.4%</div>
             </div>
             <div className="mt-12 flex gap-4">
                <button className="bg-white text-gray-950 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-400 hover:text-white transition-all">Isplati na Payoneer</button>
                <button className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest">Istorija</button>
             </div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="bg-gradient-to-br from-indigo-700 to-indigo-900 p-12 rounded-[3.5rem] shadow-2xl text-white relative overflow-hidden">
             <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20"></div>
             <h3 className="font-black text-sm uppercase mb-8 tracking-widest">Podešavanja Pretplate</h3>
             <div className="space-y-4">
                {EXALTED_VENUS.subscriptionTiers?.map(t => (
                  <div key={t.id} className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 hover:bg-white/20 transition-all cursor-pointer">
                     <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{t.name}</span>
                        <span className="font-black">€{t.price}</span>
                     </div>
                     <div className="text-[9px] font-bold text-indigo-200">Aktivno • {t.benefits.length} benefita</div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
