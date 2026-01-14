
import React, { useState, useEffect } from 'react';
import { EXALTED_VENUS } from '../constants';
import { syncYouTubeChannel, analyzeVideoForSocials } from '../geminiService';
import { AIClippingSuggestion } from '../types';
import { supabase } from '../supabaseClient';

export const CreatorStudio: React.FC = () => {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);
  const [isYoutubeStudioConnected, setIsYoutubeStudioConnected] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  // Video Clipping States
  const [videoUrl, setVideoUrl] = useState('');
  const [clippingSuggestions, setClippingSuggestions] = useState<AIClippingSuggestion[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session) {
        setUser(session.user);
        
        // Proveravamo ulogu koju smo sačuvali pre OAuth inicijacije
        const role = localStorage.getItem('baksis_user_role');
        
        // Ako je korisnik došao kao kreator, pretpostavljamo da su YT i Calendar dozvole zatražene
        if (role === 'CREATOR') {
          setIsYoutubeStudioConnected(true);
          setIsCalendarConnected(true);
        }
      } else if (!error) {
        // Ako nema sesije, a nema ni greške, možemo opciono preusmeriti korisnika
        console.log("No session found in Studio.");
      }
    };
    checkAuth();
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    const data = await syncYouTubeChannel(user?.user_metadata?.full_name || 'Creator');
    if (data) {
      localStorage.setItem('synced_yt_data', JSON.stringify(data));
      alert("YouTube Studio podaci osveženi!");
    }
    setIsSyncing(false);
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
            Dobrodošao nazad, {user?.user_metadata?.full_name || 'Kreatore'}. Svi sistemi su spremni.
          </p>
        </div>
        <button onClick={handleManualSync} className="text-[9px] font-black uppercase tracking-widest border border-white/10 px-6 py-3 rounded-xl hover:bg-white/5">
          {isSyncing ? 'Sinkronizujem...' : 'Osveži YT Podatke 🔄'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-10 rounded-[3rem] border-2 transition-all ${isYoutubeStudioConnected ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/5 border-white/5'}`}>
               <div className="flex items-center gap-4 mb-6">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png" className="w-8 h-8 object-contain" alt="" />
                  <h3 className="text-lg font-black uppercase tracking-tighter">YouTube Studio</h3>
               </div>
               <p className="text-[10px] text-gray-500 font-bold uppercase mb-8 leading-relaxed">
                 {isYoutubeStudioConnected 
                  ? 'Povezano. Vaši najnoviji videi se automatski analiziraju.' 
                  : 'Povežite YT nalog za automatsku sinkronizaciju sadržaja.'}
               </p>
               <div className="flex items-center gap-2 text-[9px] font-black text-emerald-500 uppercase">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  Status: {isYoutubeStudioConnected ? 'Aktivan' : 'Potrebna prijava'}
               </div>
            </div>

            <div className={`p-10 rounded-[3rem] border-2 transition-all ${isCalendarConnected ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-white/5 border-white/5'}`}>
               <div className="flex items-center gap-4 mb-6">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" className="w-8 h-8 object-contain" alt="" />
                  <h3 className="text-lg font-black uppercase tracking-tighter">Google Calendar</h3>
               </div>
               <p className="text-[10px] text-gray-500 font-bold uppercase mb-8 leading-relaxed">
                 {isCalendarConnected 
                  ? 'Povezano. Klijenti vide samo slobodne termine iz vašeg kalendara.' 
                  : 'Povežite kalendar za automatsko zakazivanje.'}
               </p>
               <div className="flex items-center gap-2 text-[9px] font-black text-indigo-500 uppercase">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                  Status: {isCalendarConnected ? 'Sinkronizovan' : 'Potrebna prijava'}
               </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-[3.5rem] p-12 border border-white/5">
             <div className="flex justify-between items-end mb-10">
                <h3 className="text-2xl font-black uppercase tracking-tighter">Social Orbit AI 🚀</h3>
                <span className="text-[8px] font-black text-indigo-400 bg-indigo-400/10 px-3 py-1 rounded-full uppercase tracking-widest">Powered by Gemini 3 Flash</span>
             </div>
             <div className="flex flex-col sm:flex-row gap-4 mb-10 bg-black/40 p-4 rounded-[2.5rem] border border-white/5">
                <input 
                  type="text" 
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="Zalepi YouTube link za viralnu analizu..."
                  className="flex-1 bg-transparent px-8 py-5 text-sm font-medium outline-none text-white"
                />
                <button 
                  onClick={handleVideoAnalysis}
                  disabled={isAiLoading}
                  className="bg-indigo-600 text-white px-10 py-5 rounded-[1.75rem] font-black text-[11px] uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-2xl"
                >
                  {isAiLoading ? 'AI Analiza...' : 'Generiši Klipove'}
                </button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {clippingSuggestions.map((s) => (
                  <div key={s.id} className="bg-white/5 border border-white/5 rounded-[2.5rem] p-10 space-y-8 group hover:border-indigo-500/30 transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-3xl"></div>
                    <div className="flex justify-between items-start relative z-10">
                       <span className="text-[10px] font-black uppercase text-indigo-400">{s.startTime} - {s.endTime}</span>
                       <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Preporučeno</span>
                    </div>
                    <p className="text-sm font-bold text-gray-200 leading-relaxed italic relative z-10">"{s.hook}"</p>
                    <button className="w-full bg-white text-black py-4 rounded-xl font-black text-[9px] uppercase tracking-widest relative z-10 hover:bg-indigo-600 hover:text-white transition-all">Preuzmi Opis & Meta</button>
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
                   <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] block mb-2">Dostupno za isplatu</span>
                   <div className="text-5xl font-black text-white tracking-tighter">€0.00</div>
                </div>
                <div className="space-y-4 pt-10 border-t border-white/5">
                   <div className="flex justify-between items-center text-[10px] font-black uppercase">
                      <span className="text-gray-500">Payoneer Status</span>
                      <span className="text-emerald-500">Verifikovan ✅</span>
                   </div>
                   <button disabled className="w-full bg-white/5 text-gray-500 py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest cursor-not-allowed">Isplati Sredstva</button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
