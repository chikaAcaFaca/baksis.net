
import React, { useState } from 'react';
import { EXALTED_VENUS, GROWTH_BOOST_MINUTES_LIMIT } from '../constants';
import { parsePriceList, analyzeVideoForSocials } from '../geminiService';
import { AIClippingSuggestion } from '../types';

export const CreatorStudio: React.FC = () => {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [rawText, setRawText] = useState('');
  const [aiProducts, setAiProducts] = useState<any[]>([]);
  
  // Social Orbit States
  const [videoUrl, setVideoUrl] = useState('');
  const [clippingSuggestions, setClippingSuggestions] = useState<AIClippingSuggestion[]>([]);
  const [isGrowthBoost, setIsGrowthBoost] = useState(true);
  const [minutesUsed, setMinutesUsed] = useState(EXALTED_VENUS.stats.growthMinutesUsed);
  const [editingClipId, setEditingClipId] = useState<string | null>(null);

  const handleVideoAnalysis = async () => {
    if (!videoUrl.trim()) return;
    if (minutesUsed >= GROWTH_BOOST_MINUTES_LIMIT) {
      alert("Iskoristili ste limit od 100 minuta. Kupite novi Growth Boost!");
      return;
    }

    setIsAiLoading(true);
    const result = await analyzeVideoForSocials(videoUrl, EXALTED_VENUS.bio);
    if (result) {
      setClippingSuggestions(result);
      // Simulacija potrošnje na osnovu broja klipova (prosečno 5 min po klipu analize)
      setMinutesUsed(prev => Math.min(GROWTH_BOOST_MINUTES_LIMIT, prev + 15));
    }
    setIsAiLoading(false);
  };

  const updateClip = (id: string, updates: Partial<AIClippingSuggestion>) => {
    setClippingSuggestions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const progressPercentage = (minutesUsed / GROWTH_BOOST_MINUTES_LIMIT) * 100;

  return (
    <div className="p-4 md:p-12 space-y-12 bg-[#fcfdfe] min-h-screen pb-40">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase mb-2">Studio</h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Kreator: {EXALTED_VENUS.displayName}</p>
        </div>
        <button 
          onClick={() => setIsGrowthBoost(!isGrowthBoost)}
          className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${isGrowthBoost ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-200' : 'bg-gray-100 text-gray-400'}`}
        >
          {isGrowthBoost ? 'Growth Boost Aktivan ($4.99) 🚀' : 'Kupi Growth Boost $4.99'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          
          {/* Social Orbit 2.0 - High End AI Editor */}
          <div className="bg-gray-950 rounded-[3.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
             <div className="relative z-10">
                
                {/* Usage Analytics Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                   <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center text-3xl shadow-lg shadow-indigo-500/20">🌍</div>
                      <div>
                         <h3 className="text-2xl font-black uppercase tracking-tighter">Social Orbit 2.0</h3>
                         <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">AI Video Processing Engine</p>
                      </div>
                   </div>

                   <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 min-w-[280px]">
                      <div className="flex justify-between items-center mb-4">
                         <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">Plan: 100 Minuta</span>
                         <span className="text-[10px] font-black text-emerald-400">{minutesUsed} / 100 MIN</span>
                      </div>
                      <div className="h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                         <div 
                          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 rounded-full transition-all duration-1000"
                          style={{ width: `${progressPercentage}%` }}
                         ></div>
                      </div>
                      <p className="text-[8px] font-bold text-gray-500 mt-4 uppercase tracking-[0.2em] text-center italic">Pretvori sate snimaka u dane sadržaja</p>
                   </div>
                </div>

                {/* Input Control */}
                <div className="flex flex-col sm:flex-row gap-4 mb-12 bg-white/5 p-4 rounded-[2.5rem] border border-white/10 shadow-inner">
                   <input 
                    type="text" 
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="YouTube URL..."
                    className="flex-1 bg-transparent px-6 py-4 text-sm font-medium outline-none placeholder:text-gray-600 border-none focus:ring-0"
                   />
                   <button 
                    onClick={handleVideoAnalysis}
                    disabled={isAiLoading || !videoUrl.trim()}
                    className="bg-indigo-600 text-white px-10 py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50"
                   >
                     {isAiLoading ? 'Analiziram Video...' : 'Pokreni AI Obradu'}
                   </button>
                </div>

                {/* Generated Clips with Live Edit */}
                <div className="space-y-8">
                  {clippingSuggestions.map((s) => (
                    <div key={s.id} className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden group hover:border-indigo-500/50 transition-all shadow-2xl">
                       <div className="p-8">
                          <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                             <div className="flex flex-wrap items-center gap-6">
                                <div className="bg-indigo-600/20 text-indigo-400 px-5 py-2.5 rounded-2xl text-[10px] font-black border border-indigo-600/30 uppercase tracking-widest">
                                   Segment: {s.startTime} — {s.endTime}
                                </div>
                                <div className="flex gap-2">
                                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 border border-white/5 px-3 py-1.5 rounded-lg">{s.selectedRatio}</span>
                                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 border border-white/5 px-3 py-1.5 rounded-lg">{s.selectedRes}</span>
                                </div>
                             </div>
                             
                             <div className="flex gap-3">
                                <button 
                                  onClick={() => setEditingClipId(editingClipId === s.id ? null : s.id)}
                                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${editingClipId === s.id ? 'bg-white text-gray-950' : 'bg-white/10 text-white hover:bg-white/20'}`}
                                >
                                  {editingClipId === s.id ? 'Završi Edit' : 'Edituj Klip 📝'}
                                </button>
                                <button className="bg-indigo-500 text-white px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-400 shadow-lg shadow-indigo-600/20 transition-all">
                                  Sačuvaj & Publish 🚀
                                </button>
                             </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
                            <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                               <div className="text-[9px] font-black uppercase tracking-widest text-indigo-400 mb-4 opacity-70">Video Hook (On Screen):</div>
                               <p className="text-xl font-black tracking-tight leading-tight text-white italic">"{s.hook}"</p>
                            </div>
                          </div>

                          {/* Live Editor UI */}
                          {editingClipId === s.id && (
                            <div className="space-y-10 mt-10 p-10 bg-indigo-600/5 border-t border-white/5 animate-fade-in rounded-b-[2.5rem]">
                               <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                  {/* Captions Editor */}
                                  <div className="space-y-4">
                                     <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Titlovi (Captions):</label>
                                        <span className="text-[8px] font-bold text-gray-600 uppercase">Auto-generisano od strane Geminija</span>
                                     </div>
                                     <textarea 
                                      value={s.captions}
                                      onChange={(e) => updateClip(s.id, { captions: e.target.value })}
                                      className="w-full h-44 bg-black/40 border border-white/10 rounded-3xl p-6 text-sm font-medium outline-none focus:border-indigo-500 transition-all resize-none shadow-inner"
                                      placeholder="Uredi titlove..."
                                     />
                                  </div>
                                  
                                  {/* Format & Res Controls */}
                                  <div className="space-y-8">
                                     <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-5">Aspect Ratio (Format):</label>
                                        <div className="grid grid-cols-2 gap-4">
                                           {(['9:16', '16:9'] as const).map(ratio => (
                                             <button 
                                              key={ratio}
                                              onClick={() => updateClip(s.id, { selectedRatio: ratio })}
                                              className={`flex flex-col items-center gap-2 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${s.selectedRatio === ratio ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'bg-white/5 text-gray-400 border border-white/5'}`}
                                             >
                                               <span className="text-xl">{ratio === '9:16' ? '📱' : '📺'}</span>
                                               {ratio === '9:16' ? 'Portrait' : 'Landscape'}
                                             </button>
                                           ))}
                                        </div>
                                     </div>
                                     
                                     <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-5">Izlazna Rezolucija:</label>
                                        <div className="grid grid-cols-2 gap-4">
                                           {(['720p', '1080p'] as const).map(res => (
                                             <button 
                                              key={res}
                                              onClick={() => updateClip(s.id, { selectedRes: res })}
                                              className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${s.selectedRes === res ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20' : 'bg-white/5 text-gray-400 border border-white/5'}`}
                                             >
                                               {res}
                                             </button>
                                           ))}
                                        </div>
                                     </div>
                                  </div>
                               </div>

                               <div className="pt-8 border-t border-white/5">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-6">Fino Podešavanje Trajanja (Vremenska Linija):</label>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                     <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-600 block mb-2">Početak</span>
                                        <input 
                                          type="text" 
                                          value={s.startTime}
                                          onChange={(e) => updateClip(s.id, { startTime: e.target.value })}
                                          className="w-full bg-transparent border-none text-2xl font-black tracking-tighter outline-none text-indigo-400"
                                        />
                                     </div>
                                     <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-600 block mb-2">Kraj</span>
                                        <input 
                                          type="text" 
                                          value={s.endTime}
                                          onChange={(e) => updateClip(s.id, { endTime: e.target.value })}
                                          className="w-full bg-transparent border-none text-2xl font-black tracking-tighter outline-none text-indigo-400"
                                        />
                                     </div>
                                  </div>
                               </div>
                            </div>
                          )}
                       </div>
                    </div>
                  ))}
                </div>

                {clippingSuggestions.length === 0 && !isAiLoading && (
                  <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[2.5rem]">
                     <div className="text-5xl mb-6 opacity-20">🚀</div>
                     <p className="text-gray-500 font-black uppercase tracking-[0.2em] text-xs">Spreman za tvoj prvi viralni klip</p>
                  </div>
                )}
             </div>
          </div>

          {/* Legacy Tools */}
          <div className="bg-white rounded-[3.5rem] p-12 border-4 border-indigo-50 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 blur-[80px] pointer-events-none"></div>
             <div className="flex items-center gap-5 mb-10 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white rounded-[1.5rem] flex items-center justify-center text-3xl shadow-xl shadow-indigo-200">✨</div>
                <div>
                   <h3 className="text-2xl font-black uppercase tracking-tighter">Cenovnik Generator</h3>
                   <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Pretvori tekst u prodavnicu</p>
                </div>
             </div>
             <textarea 
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Napiši svoje usluge..."
                className="w-full h-48 bg-gray-50 border-2 border-gray-100 rounded-[2.5rem] p-8 text-sm font-medium focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all mb-8 shadow-inner text-gray-900"
             />
             <button 
                onClick={() => setIsAiLoading(true)}
                className="w-full bg-gray-950 text-white py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-indigo-600 transition-all"
             >
                Analiziraj Ponudu
             </button>
          </div>
        </div>

        <div className="space-y-10">
          <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-gray-100 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
             <h3 className="font-black text-xs uppercase mb-8 tracking-widest text-gray-400">Social Orbit Status 🌍</h3>
             <div className="space-y-6">
                <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100">
                   <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Instagram API</span>
                   <span className="text-emerald-500 text-[9px] font-black">POVEZANO</span>
                </div>
                <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100">
                   <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">TikTok API</span>
                   <span className="text-emerald-500 text-[9px] font-black">POVEZANO</span>
                </div>
             </div>
          </div>
          
          <div className="bg-indigo-600 p-12 rounded-[3.5rem] shadow-2xl text-white relative overflow-hidden group">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
             <h3 className="font-black text-xs uppercase mb-4 tracking-widest text-indigo-200">Growth Stats</h3>
             <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-10">Napredak ovog meseca</p>
             <div className="space-y-8">
                <div>
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                      <span>Viral Clips</span>
                      <span>12 / 50</span>
                   </div>
                   <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white w-1/4"></div>
                   </div>
                </div>
                <div>
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                      <span>Minutes Used</span>
                      <span>{minutesUsed}m</span>
                   </div>
                   <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white w-[42%]"></div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
