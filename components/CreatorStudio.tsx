
import React, { useState, useEffect } from 'react';
import { EXALTED_VENUS, GROWTH_BOOST_MINUTES_LIMIT } from '../constants';
import { syncYouTubeChannel, analyzeVideoForSocials } from '../geminiService';
import { AIClippingSuggestion } from '../types';

export const CreatorStudio: React.FC = () => {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);
  const [isYoutubeStudioConnected, setIsYoutubeStudioConnected] = useState(false);
  const [activeReservations, setActiveReservations] = useState([1, 2]);
  
  // Radno vreme
  const [workHours, setWorkHours] = useState({ start: '10:00', end: '18:00', days: 'Pon-Pet' });

  // Video Clipping States
  const [videoUrl, setVideoUrl] = useState('');
  const [clippingSuggestions, setClippingSuggestions] = useState<AIClippingSuggestion[]>([]);

  useEffect(() => {
    // Provera da li su već povezani servisi
    const ytStatus = localStorage.getItem('yt_studio_connected') === 'true';
    const calStatus = localStorage.getItem('google_cal_connected') === 'true';
    setIsYoutubeStudioConnected(ytStatus);
    setIsCalendarConnected(calStatus);
  }, []);

  const handleYouTubeStudioConnect = async () => {
    setIsSyncing(true);
    // Simulacija Google OAuth dijaloga za YouTube Data API v3
    setTimeout(async () => {
      const data = await syncYouTubeChannel('@exaltedvenustarotastrolog913');
      if (data) {
        localStorage.setItem('synced_yt_data', JSON.stringify(data));
        localStorage.setItem('yt_studio_connected', 'true');
        setIsYoutubeStudioConnected(true);
        setIsSyncing(false);
        alert("YouTube Studio uspešno povezan! Vaši najnoviji videi su sada vidljivi na profilu.");
      }
    }, 2000);
  };

  const handleCalendarConnect = () => {
    setIsSyncing(true);
    // Simulacija OAuth za Google Calendar API
    setTimeout(() => {
      localStorage.setItem('google_cal_connected', 'true');
      setIsCalendarConnected(true);
      setIsSyncing(false);
      alert("Google Calendar povezan! Vaši klijenti sada mogu videti slobodne termine.");
    }, 1500);
  };

  const handleVideoAnalysis = async () => {
    if (!videoUrl.trim()) return;
    setIsAiLoading(true);
    const result = await analyzeVideoForSocials(videoUrl, EXALTED_VENUS.bio);
    if (result) {
      setClippingSuggestions(result);
    }
    setIsAiLoading(false);
  };

  return (
    <div className="p-4 md:p-12 space-y-12 bg-[#0f0f0f] text-white min-h-screen pb-40">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Creator Studio</h1>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest italic leading-relaxed">
            Upravljaj svojim sadržajem i klijentima direktno sa Google naloga.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          
          {/* Official Integrations Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-10 rounded-[3rem] border-2 transition-all ${isYoutubeStudioConnected ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/5 border-white/5'}`}>
               <div className="flex items-center gap-4 mb-6">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png" className="w-8 h-8 object-contain" alt="" />
                  <h3 className="text-lg font-black uppercase tracking-tighter">YouTube Studio</h3>
               </div>
               <p className="text-[10px] text-gray-500 font-bold uppercase mb-8 leading-relaxed">
                 {isYoutubeStudioConnected 
                  ? 'Zvanično povezano. Bakšis.net automatski osvežava vaše videe i Shorts formate.' 
                  : 'Povežite svoj YT Studio za automatsku prodaju produženih videa i analizu sadržaja.'}
               </p>
               <button 
                onClick={handleYouTubeStudioConnect}
                disabled={isSyncing}
                className={`w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${isYoutubeStudioConnected ? 'bg-emerald-600 text-white' : 'bg-white text-black hover:bg-gray-200'}`}
               >
                 {isSyncing ? 'Povezivanje...' : isYoutubeStudioConnected ? 'Zvanično Povezano ✅' : 'Poveži YouTube Studio 🔓'}
               </button>
            </div>

            <div className={`p-10 rounded-[3rem] border-2 transition-all ${isCalendarConnected ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-white/5 border-white/5'}`}>
               <div className="flex items-center gap-4 mb-6">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" className="w-8 h-8 object-contain" alt="" />
                  <h3 className="text-lg font-black uppercase tracking-tighter">Google Calendar</h3>
               </div>
               <p className="text-[10px] text-gray-500 font-bold uppercase mb-8 leading-relaxed">
                 {isCalendarConnected 
                  ? 'Zvanično povezano. Vaše radno vreme je sinkovano sa Google kalendarom.' 
                  : 'Omogućite klijentima da zakažu termine direktno u vaš slobodan prostor.'}
               </p>
               <button 
                onClick={handleCalendarConnect}
                disabled={isSyncing}
                className={`w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${isCalendarConnected ? 'bg-indigo-600 text-white' : 'bg-white text-black hover:bg-gray-200'}`}
               >
                 {isSyncing ? 'Povezivanje...' : isCalendarConnected ? 'Zvanično Povezano ✅' : 'Poveži Kalendar 📅'}
               </button>
            </div>
          </div>

          {/* Business & Calendar Management */}
          {isCalendarConnected && (
            <div className="bg-gray-900 rounded-[3.5rem] p-12 border border-white/5">
               <h3 className="text-2xl font-black uppercase tracking-tighter mb-10">Upravljanje Terminima</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                     <div className="p-8 bg-black/40 rounded-[2rem] border border-white/5">
                        <h4 className="text-[10px] font-black uppercase text-indigo-400 mb-6 tracking-widest">Podešavanje Radnog Vremena</h4>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <label className="text-[8px] font-black text-gray-500 uppercase">Početak</label>
                              <input type="time" value={workHours.start} onChange={e => setWorkHours({...workHours, start: e.target.value})} className="w-full bg-black/20 border border-white/5 p-3 rounded-xl text-xs font-black" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[8px] font-black text-gray-500 uppercase">Kraj</label>
                              <input type="time" value={workHours.end} onChange={e => setWorkHours({...workHours, end: e.target.value})} className="w-full bg-black/20 border border-white/5 p-3 rounded-xl text-xs font-black" />
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="bg-indigo-600/5 p-10 rounded-[2.5rem] border border-indigo-500/10">
                     <h4 className="text-[10px] font-black uppercase text-gray-400 mb-6 tracking-widest">Predstojeća Čitanja</h4>
                     <div className="space-y-4">
                        {activeReservations.map(i => (
                          <div key={i} className="flex justify-between items-center p-5 bg-black/40 rounded-2xl border border-white/5 group hover:border-indigo-500/30 transition-all">
                             <div>
                                <div className="text-[10px] font-black text-white">SUTRA, 11:00</div>
                                <div className="text-[8px] font-bold text-indigo-400 uppercase">Marko J. (Natal)</div>
                             </div>
                             <button className="bg-white text-black px-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">Pokreni Video</button>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
          )}

          {/* Social Orbit */}
          <div className="bg-gray-900 rounded-[3.5rem] p-12 border border-white/5">
             <div className="flex justify-between items-end mb-10">
                <h3 className="text-2xl font-black uppercase tracking-tighter">Social Orbit AI 🚀</h3>
                <span className="text-[8px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-widest">YouTube API Connected</span>
             </div>
             <div className="flex flex-col sm:flex-row gap-4 mb-10 bg-black/40 p-4 rounded-[2.5rem] border border-white/5">
                <input 
                  type="text" 
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="Link YouTube videa za clipping..."
                  className="flex-1 bg-transparent px-8 py-5 text-sm font-medium outline-none text-white"
                />
                <button 
                  onClick={handleVideoAnalysis}
                  disabled={isAiLoading}
                  className="bg-indigo-600 text-white px-10 py-5 rounded-[1.75rem] font-black text-[11px] uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-2xl"
                >
                  {isAiLoading ? 'AI Skenira...' : 'Generiši Klipove'}
                </button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {clippingSuggestions.map((s) => (
                  <div key={s.id} className="bg-white/5 border border-white/5 rounded-[2.5rem] p-10 space-y-8 group hover:border-indigo-500/30 transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-3xl group-hover:bg-indigo-600/10 transition-all"></div>
                    <div className="flex justify-between items-start relative z-10">
                       <span className="text-[10px] font-black uppercase text-indigo-400">{s.startTime} - {s.endTime}</span>
                       <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Viral Score: 98%</span>
                    </div>
                    <p className="text-sm font-bold text-gray-200 leading-relaxed italic relative z-10">"{s.hook}"</p>
                    <button className="w-full bg-white text-black py-4 rounded-xl font-black text-[9px] uppercase tracking-widest relative z-10 group-hover:bg-indigo-600 group-hover:text-white transition-all">Eksportuj za Reels</button>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="bg-gray-900 p-12 rounded-[3.5rem] border border-white/5 shadow-2xl">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-8 text-center">Tvoj Profit</h4>
             <div className="space-y-10 text-center">
                <div>
                   <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] block mb-2">Payoneer Balans</span>
                   <div className="text-5xl font-black text-white tracking-tighter">€{EXALTED_VENUS.stats.balance}</div>
                </div>
                <div className="space-y-4 pt-10 border-t border-white/5">
                   <div className="flex justify-between items-center text-[10px] font-black uppercase">
                      <span className="text-gray-500">Isplata</span>
                      <span className="text-emerald-500">Automatska ✅</span>
                   </div>
                   <button className="w-full bg-white text-black py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">Prebaci na Karticu</button>
                </div>
             </div>
          </div>
          
          <div className="bg-white p-12 rounded-[3.5rem] text-black shadow-2xl relative overflow-hidden group">
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/5 rounded-full group-hover:scale-150 transition-all duration-700"></div>
             <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8 flex items-center gap-3">
               Savet Baksice <span className="w-2 h-2 bg-indigo-600 rounded-full animate-ping"></span>
             </h4>
             <p className="text-xs font-bold leading-relaxed italic text-gray-800">
                "Povezivanjem YouTube Studia tvoja prodaja produženih videa skače za 40%. Nemoj da klijenti čekaju na linkove - neka sistem radi za tebe."
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
