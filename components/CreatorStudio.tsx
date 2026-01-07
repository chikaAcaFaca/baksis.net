
import React, { useState } from 'react';
import { 
  EXALTED_VENUS, OPERATOR_NAME, 
  MAX_STORAGE_PER_CREATOR_MB, APP_FEE_PERCENTAGE 
} from '../constants';

export const CreatorStudio: React.FC = () => {
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newPrice, setNewPrice] = useState<number>(0);
  const [storageUsed] = useState(EXALTED_VENUS.stats.storageUsed);
  
  const storagePercentage = (storageUsed / MAX_STORAGE_PER_CREATOR_MB) * 100;
  const myProfit = newPrice * (1 - APP_FEE_PERCENTAGE / 100);

  return (
    <div className="p-4 md:p-12 space-y-12 bg-[#fcfdfe] min-h-screen pb-40">
      
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase mb-2">Studio</h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Domaćin: {EXALTED_VENUS.displayName}</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsAddingProduct(true)}
            className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-200 active:scale-95 transition-all"
          >
            Novi Proizvod
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Analytics Card */}
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-gray-950 rounded-[3.5rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 p-12 opacity-10">
                <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clipRule="evenodd" /></svg>
             </div>
             
             <h2 className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em] mb-4">Pregled Finansija</h2>
             <div className="flex flex-wrap gap-12">
                <div>
                   <div className="text-5xl font-black tracking-tighter">€{EXALTED_VENUS.stats.balance?.toLocaleString()}</div>
                   <div className="text-[9px] font-black uppercase text-gray-500 tracking-widest mt-3">Spreman za isplatu</div>
                </div>
                <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                   <div className="text-3xl font-black tracking-tighter text-emerald-400">95%</div>
                   <div className="text-[9px] font-black uppercase text-gray-400 tracking-widest mt-2">Tvoj Prosek Isplate</div>
                </div>
             </div>
             
             <div className="mt-12 flex gap-4">
                <button className="bg-white text-gray-950 px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-all">
                   Isplati na Payoneer
                </button>
                <button className="bg-white/10 text-white border border-white/20 px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest">
                   Istorija
                </button>
             </div>
          </div>

          {/* Autopilot: Active Products */}
          <div className="bg-white rounded-[3.5rem] p-10 border border-gray-100 shadow-xl">
             <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-black uppercase tracking-tighter">Pasivna Zarada (Autopilot)</h3>
                <span className="bg-emerald-100 text-emerald-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">Sistem Online</span>
             </div>
             <div className="space-y-4">
                {[
                  { name: 'Natalna Karta PDF', sales: 14, earned: 350, emoji: '📑' },
                  { name: 'VIP Video Pristup', sales: 8, earned: 120, emoji: '🔒' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-6 bg-gray-50 rounded-[2.5rem] border border-gray-100 group hover:border-indigo-600 transition-all">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:rotate-12 transition-transform">{item.emoji}</div>
                        <div>
                          <div className="font-black text-xs uppercase text-gray-900">{item.name}</div>
                          <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{item.sales} Prodaja</div>
                        </div>
                    </div>
                    <div className="text-right">
                       <div className="text-sm font-black text-indigo-600">€{item.earned}</div>
                       <div className="text-[8px] text-emerald-500 font-black uppercase tracking-widest">Neto: €{item.earned * 0.95}</div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Sidebar: System Stats */}
        <div className="space-y-10">
          <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl">
             <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-6">Skladište Sadržaja</h3>
             <div className="w-full bg-gray-100 h-8 rounded-2xl overflow-hidden mb-4 p-1.5 shadow-inner">
                <div className="bg-indigo-600 h-full rounded-xl transition-all duration-1000 shadow-lg shadow-indigo-200" style={{ width: `${storagePercentage}%` }}></div>
             </div>
             <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-gray-500">
                <span>{storageUsed}MB Iskorišćeno</span>
                <span className="text-indigo-600">Premium Limit</span>
             </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/20 transition-all"></div>
             <h3 className="font-black text-sm uppercase mb-4 relative z-10">Poveži Zaradu</h3>
             <p className="text-[10px] font-medium opacity-80 leading-relaxed mb-10 relative z-10">
                Bakšis se isplaćuje direktno. Poveži svoj YouTube kanal da automatski kreiraš 'Locked' sadržaj.
             </p>
             <button className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:shadow-xl transition-all relative z-10">
                Social Sync Setup
             </button>
          </div>
        </div>
      </div>

      {/* New Product Modal (Simplified for Sales Engine Demo) */}
      {isAddingProduct && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-md">
          <div className="bg-white rounded-[3.5rem] w-full max-w-lg p-10 md:p-14 shadow-2xl border border-gray-100 relative">
             <button onClick={() => setIsAddingProduct(false)} className="absolute top-10 right-10 text-gray-300 hover:text-gray-950 transition-colors">✕</button>
             
             <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Novi Autopilot Proizvod</h2>
             <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-10">Postavi cenu i pusti sistem da radi</p>
             
             <div className="space-y-8">
                <div>
                   <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 block">Naziv (E-book, Video, Savet)</label>
                   <input type="text" placeholder="npr. Moj Astro Vodič" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold" />
                </div>
                
                <div>
                   <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 block">Tvoja Cena (€)</label>
                   <input 
                    type="number" 
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    placeholder="0.00" 
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 text-2xl font-black text-indigo-600" 
                   />
                </div>

                <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100 space-y-4">
                   <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-indigo-400">
                      <span>Provizija Platforme (5%)</span>
                      <span>€{(newPrice * 0.05).toFixed(2)}</span>
                   </div>
                   <div className="h-px bg-indigo-100"></div>
                   <div className="flex justify-between items-center">
                      <span className="text-xs font-black uppercase tracking-widest text-gray-900">Tebi Na Račun:</span>
                      <span className="text-3xl font-black text-emerald-500 tracking-tighter">€{myProfit.toFixed(2)}</span>
                   </div>
                </div>

                <button 
                  onClick={() => setIsAddingProduct(false)}
                  className="w-full bg-gray-950 text-white py-6 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:bg-indigo-600 transition-all"
                >
                   Aktiviraj Prodaju
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
