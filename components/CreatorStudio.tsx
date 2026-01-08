
import React, { useState } from 'react';
import { EXALTED_VENUS, GROWTH_BOOST_MINUTES_LIMIT } from '../constants';
import { syncYouTubeChannel, analyzeVideoForSocials } from '../geminiService';
import { AIClippingSuggestion } from '../types';

export const CreatorStudio: React.FC = () => {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);
  const [isYoutubeStudioConnected, setIsYoutubeStudioConnected] = useState(false);
  
  // Radno vreme state
  const [workHours, setWorkHours] = useState({ start: '10:00', end: '18:00', days: 'Pon-Pet' });

  // Social Orbit States
  const [videoUrl, setVideoUrl] = useState('');
  const [clippingSuggestions, setClippingSuggestions] = useState<AIClippingSuggestion[]>([]);
  const [minutesUsed, setMinutesUsed] = useState(EXALTED_VENUS.stats.growthMinutesUsed);

  // Define mock reservations to fix the scope issue with 'i'
  const activeReservations = [1, 2];

  const handleYouTubeStudioConnect = () => {
    // Simulacija OAuth2 flow-a
    setIsSyncing(true);
    setTimeout(() => {
      setIsYoutubeStudioConnected(true);
      setIsSyncing(false);
      alert("YouTube Studio zvanično povezan! Podaci će se automatski osvežavati.");
    }, 2000);
  };

  const handleYouTubeSync = async () => {
    setIsSyncing(true);
    const data = await syncYouTubeChannel(EXALTED_VENUS.youtubeConfig?.handle || '@exaltedvenustarotastrolog913');
    if (data) {
      localStorage.setItem('synced_yt_data', JSON.stringify(data));
      alert("Profil uspešno sinhronizovan sa najnovijim videima!");
    }
    setIsSyncing(false);
  };

  const handleVideoAnalysis = async () => {
    if (!videoUrl.trim()) return;
    setIsAiLoading(true);
    const result = await analyzeVideoForSocials(videoUrl, EXALTED_VENUS.bio);
    if (result) {
      setClippingSuggestions(result);
      setMinutesUsed(prev => Math.min(GROWTH_BOOST_MINUTES_LIMIT, prev + 15));
    }
    setIsAiLoading(false);
  };

  return (
    <div className="p-4 md:p-12 space-y-12 bg-[#0f0f0f] text-white min-h-screen pb-40">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Creator Studio</h1>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest italic leading-relaxed">
            "Legalna i direktna veza između vašeg YT Studia i Bakšis.net profila."
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4">
           {!isYoutubeStudioConnected ? (
             <button 
              onClick={handleYouTubeStudioConnect}
              disabled={isSyncing}
              className="bg-white text-black px-10 py-5 rounded-[1.75rem] font-black text-[11px] uppercase tracking-widest hover:bg-gray-200 transition-all shadow-2xl flex items-center gap-3"
             >
               <img src="https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png" className="w-5 h-5 object-contain" alt="" />
               {isSyncing ? 'Povezivanje...' : 'Poveži YouTube Studio 🔓'}
             </button>
           ) : (
             <button 
              onClick={handleYouTubeSync}
              className="bg-emerald-600 text-white px-8 py-5 rounded-[1.75rem] font-black text-[11px] uppercase tracking-widest shadow-xl flex items-center gap-3"
             >
               <span>YT Studio Povezan ✅</span>
               <span className="text-[8px] bg-emerald-500 px-2 py-0.5 rounded">AUTO-SYNC</span>
             </button>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          
          {/* Calendar Management */}
          <div className="bg-gray-900 rounded-[3.5rem] p-10 md:p-14 border border-white/5 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
             <h3 className="text-2xl font-black uppercase tracking-tighter mb-10 flex items-center gap-4">
               Podešavanje Kalendara 📅
             </h3>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                <div className="space-y-8">
                   <div className="p-8 bg-black/40 rounded-[2rem] border border-white/5 space-y-4">
                      <h4 className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Google Calendar Link</h4>
                      <button 
                        onClick={() => setIsCalendarConnected(!isCalendarConnected)}
                        className={`w-full py-4 rounded-xl text-[10px] font-black uppercase transition-all ${isCalendarConnected ? 'bg-emerald-600/10 text-emerald-500 border border-emerald-500/20' : 'bg-white text-black'}`}
                      >
                        {isCalendarConnected ? 'Zvanični Google Sync Aktivan ✅' : 'Poveži Google Nalog'}
                      </button>
                      <p className="text-[8px] text-gray-500 italic">"Klijenti vide samo 'Slobodan termin'. Privatni opisi događaja su sakriveni."</p>
                   </div>

                   <div className="p-8 bg-black/40 rounded-[2rem] border border-white/5 space-y-4">
                      <h4 className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Radno Vreme</h4>
                      <div className="flex gap-4">
                         <input type="text" value={workHours.start} onChange={e => setWorkHours({...workHours, start: e.target.value})} className="flex-1 bg-black/20 border border-white/5 px-4 py-3 rounded-lg text-xs font-black text-center" />
                         <input type="text" value={workHours.end} onChange={e => setWorkHours({...workHours, end: e.target.value})} className="flex-1 bg-black/20 border border-white/5 px-4 py-3 rounded-lg text-xs font-black text-center" />
                      </div>
                      <select className="w-full bg-black/20 border border-white/5 px-4 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest">
                         <option>Ponedeljak - Petak</option>
                         <option>Svaki Dan</option>
                         <option>Samo Vikend</option>
                      </select>
                   </div>
                </div>

                <div className="bg-indigo-600/5 p-10 rounded-[2.5rem] border border-indigo-500/10 flex flex-col justify-center">
                   <h4 className="text-[11px] font-black uppercase text-gray-400 mb-6 tracking-widest">Aktivne Rezervacije</h4>
                   <div className="space-y-4">
                      {activeReservations.map(i => (
                        <div key={i} className="flex justify-between items-center p-4 bg-black/20 rounded-2xl border border-white/5">
                           <div>
                              <div className="text-[10px] font-black text-white">Danas, 17:00</div>
                              <div className="text-[8px] font-bold text-indigo-400 uppercase">Tarot (20 min)</div>
                           </div>
                           <button className="text-[8px] font-black uppercase text-gray-500 hover:text-white">Detalji</button>
                        </div>
                      ))}
                      {/* Fixed: Use length check on activeReservations instead of accessing 'i' outside the map callback */}
                      {activeReservations.length === 0 && <div className="text-center py-10 text-[10px] text-gray-600 italic">Nema novih upita za danas.</div>}
                   </div>
                </div>
             </div>
          </div>

          {/* Social Orbit */}
          <div className="bg-gray-900 rounded-[3.5rem] p-10 md:p-14 border border-white/5">
             <h3 className="text-2xl font-black uppercase tracking-tighter mb-8">Social Orbit - AI Video Clipping</h3>
             <div className="flex flex-col sm:flex-row gap-4 mb-10 bg-black/40 p-4 rounded-[2.5rem] border border-white/5 shadow-inner">
                <input 
                  type="text" 
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="Link najnovijeg YouTube videa..."
                  className="flex-1 bg-transparent px-8 py-5 text-sm font-medium outline-none text-white placeholder:text-gray-600"
                />
                <button 
                  onClick={handleVideoAnalysis}
                  disabled={isAiLoading}
                  className="bg-indigo-600 text-white px-10 py-5 rounded-[1.75rem] font-black text-[11px] uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-2xl"
                >
                  {isAiLoading ? 'AI Skenira...' : 'Generiši Viralne Klipove'}
                </button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {clippingSuggestions.map((s) => (
                  <div key={s.id} className="bg-white/5 border border-white/5 rounded-[2rem] p-8 space-y-6 group hover:border-indigo-500/30 transition-all">
                    <div className="flex justify-between items-start">
                       <span className="text-[10px] font-black uppercase text-indigo-400 bg-indigo-400/10 px-3 py-1 rounded-lg">{s.startTime} - {s.endTime}</span>
                       <div className="flex gap-2">
                          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
                          <span className="text-[8px] font-black text-gray-500 uppercase">VIRAL SCORE: 94%</span>
                       </div>
                    </div>
                    <p className="text-[10px] font-bold text-gray-300 italic leading-relaxed">"{s.hook}"</p>
                    <button className="w-full bg-white text-black py-4 rounded-xl font-black text-[9px] uppercase tracking-widest group-hover:bg-indigo-600 group-hover:text-white transition-all">Preuzmi za TikTok / Reels</button>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="bg-gray-900 p-12 rounded-[3.5rem] border border-white/5 shadow-2xl">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-8">Balans & Isplata</h4>
             <div className="space-y-8">
                <div>
                   <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] block mb-2">Raspoloživo</span>
                   <div className="text-5xl font-black text-white tracking-tighter">€{EXALTED_VENUS.stats.balance}</div>
                </div>
                <div className="space-y-4 pt-8 border-t border-white/5">
                   <div className="flex justify-between items-center text-[10px] font-black uppercase">
                      <span className="text-gray-500">Metod Isplate</span>
                      <span className="text-emerald-500">Payoneer Aktivno ✅</span>
                   </div>
                   <button className="w-full bg-indigo-600 py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-600/20">Isplati Odmah</button>
                </div>
             </div>
          </div>
          
          <div className="bg-white p-10 rounded-[3rem] text-black">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Savet Baksice 🤖</h4>
             <p className="text-xs font-bold leading-relaxed italic">
                "Termini za natalne karte se najbolje prodaju između 19:00 i 22:00. Poveži kalendar i otvori slotove tada!"
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
