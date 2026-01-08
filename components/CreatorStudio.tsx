
import React, { useState } from 'react';
import { EXALTED_VENUS, GROWTH_BOOST_MINUTES_LIMIT } from '../constants';
import { syncYouTubeChannel, analyzeVideoForSocials } from '../geminiService';
import { AIClippingSuggestion } from '../types';

export const CreatorStudio: React.FC = () => {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Social Orbit States
  const [videoUrl, setVideoUrl] = useState('');
  const [clippingSuggestions, setClippingSuggestions] = useState<AIClippingSuggestion[]>([]);
  const [minutesUsed, setMinutesUsed] = useState(EXALTED_VENUS.stats.growthMinutesUsed);

  const handleYouTubeSync = async () => {
    setIsSyncing(true);
    const data = await syncYouTubeChannel(EXALTED_VENUS.youtubeConfig?.handle || '@exaltedvenustarotastrolog913');
    if (data) {
      // U realnoj aplikaciji ovde bismo sačuvali podatke u Supabase
      localStorage.setItem('synced_yt_data', JSON.stringify(data));
      alert("Profil uspešno sinhronizovan sa YouTube kanalom! Boje, slike i videi su ažurirani.");
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

  const progressPercentage = (minutesUsed / GROWTH_BOOST_MINUTES_LIMIT) * 100;

  return (
    <div className="p-4 md:p-12 space-y-12 bg-[#0f0f0f] text-white min-h-screen pb-40">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Creator Studio</h1>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Kreator: {EXALTED_VENUS.displayName}</p>
        </div>
        
        <div className="flex gap-4">
           <button 
            onClick={handleYouTubeSync}
            disabled={isSyncing}
            className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-900/20 disabled:opacity-50"
           >
             {isSyncing ? 'Sinhronizujem...' : 'Sinhronizuj sa YouTube 🔄'}
           </button>
           <div className="bg-gray-900 border border-white/10 px-8 py-4 rounded-2xl">
              <span className="text-[10px] font-black uppercase text-emerald-400">Growth Boost: {minutesUsed}/100 MIN</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          
          <div className="bg-gray-900 rounded-[3rem] p-8 md:p-12 border border-white/5 relative overflow-hidden">
             <div className="relative z-10">
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-8">Social Orbit - AI Video Clipping</h3>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-12 bg-black/40 p-4 rounded-[2.5rem] border border-white/5">
                   <input 
                    type="text" 
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="Unesi link sa YouTube-a..."
                    className="flex-1 bg-transparent px-6 py-4 text-sm font-medium outline-none text-white"
                   />
                   <button 
                    onClick={handleVideoAnalysis}
                    disabled={isAiLoading}
                    className="bg-indigo-600 text-white px-10 py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl"
                   >
                     {isAiLoading ? 'AI Analizira...' : 'Generiši Viralne Klipove'}
                   </button>
                </div>

                <div className="space-y-6">
                  {clippingSuggestions.map((s) => (
                    <div key={s.id} className="bg-white/5 border border-white/5 rounded-3xl p-6">
                       <div className="flex justify-between items-center mb-4">
                          <span className="text-[10px] font-black uppercase text-indigo-400">Segment: {s.startTime} - {s.endTime}</span>
                          <button className="text-[9px] font-black uppercase bg-white text-black px-4 py-2 rounded-lg">Preuzmi</button>
                       </div>
                       <p className="text-sm font-bold italic">"{s.hook}"</p>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="bg-gray-900 p-10 rounded-[3rem] border border-white/5">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-6">Status Kanala</h4>
             <div className="space-y-4">
                <div className="flex justify-between items-center py-4 border-b border-white/5">
                   <span className="text-xs font-bold">YouTube Sync</span>
                   <span className="text-xs text-emerald-500 font-black">AUTOMATSKO</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-white/5">
                   <span className="text-xs font-bold">Poslednja Provera</span>
                   <span className="text-xs text-gray-400 font-black">Pre 5 min</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
