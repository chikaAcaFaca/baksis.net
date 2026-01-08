
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
      setMinutesUsed(prev => Math.min(GROWTH_BOOST_MINUTES_LIMIT, prev + 12)); // Simulacija potrošnje
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
          
          {/* Social Orbit 2.0 */}
          <div className="bg-gray-950 rounded-[3.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
             <div className="relative z-10">
                
                {/* Header Orbit */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                   <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center text-3xl shadow-lg shadow-indigo-500/20">🌍</div>
                      <div>
                         <h3 className="text-2xl font-black uppercase tracking-tighter">Social Orbit 2.0</h3>
                         <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">YouTube ➔ Viralni Shorts & Reels</p>
                      </div>
                   </div>

                   <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 min-w-[280px]">
                      <div className="flex justify-between items-center mb-4">
                         <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">Growth Plan: 100 Minuta</span>
                         <span className="text-[10px] font-black text-emerald-400">{minutesUsed} / 100 MIN</span>
                      </div>
                      <div className="h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                         <div 
                          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 rounded-full transition-all duration-1000"
                          style={{ width: `${progressPercentage}%` }}
                         ></div>
                      </div>
                      <p className="text-[8px] font-bold text-gray-500 mt-4 uppercase tracking-[0.2em] text-center">Analiziraj dugačke videe i dominiraj Balkanom</p>
                   </div>
                </div>

                {/* Search / Input Area */}
                <div className="flex flex-col sm:flex-row gap-4 mb-12 bg-white/5 p-4 rounded-[2.5rem] border border-white/10">
                   <input 
                    type="text" 
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="Zalepi YouTube link ovde..."
                    className="flex-1 bg-transparent px-6 py-4 text-sm font-medium outline-none placeholder:text-gray-600 border-none focus:ring-0"
                   />
                   <button 
                    onClick={handleVideoAnalysis}
                    disabled={isAiLoading}
                    className="bg-indigo-600 text-white px-10 py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50"
                   >
                     {isAiLoading ? 'Gemini Analizira...' : 'Kreiraj Klipove'}
                   </button>
                </div>

                {/* Clips Result Area */}
                <div className="grid grid-cols-1 gap-8">
                  {clippingSuggestions.map((s) => (
                    <div key={s.id} className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden group hover:border-indigo-500/50 transition-all">
                       <div className="p-8">
                          <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                             <div className="flex items-center gap-6">
                                <div className="bg-indigo-600/20 text-indigo-400 px-4 py-2 rounded-xl text-xs font-black border border-indigo-600/30">
                                   {s.startTime} — {s.endTime}
                                </div>
                                <div className="text-sm font-black text-gray-400 uppercase tracking-widest">{s.duration}s Trajanje</div>
                             </div>
                             
                             <div className="flex gap-3">
                                <button 
                                  onClick={() => setEditingClipId(editingClipId === s.id ? null : s.id)}
                                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${editingClipId === s.id ? 'bg-white text-gray-950' : 'bg-white/10 text-white hover:bg-white/20'}`}
                                >
                                  {editingClipId === s.id ? 'Zatvori Editor' : 'Uredi Klip 📝'}
                                </button>
                                <button className="bg-emerald-600 text-white px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 shadow-lg shadow-emerald-600/20">
                                  1-Click Deploy 🚀
                                </button>
                             </div>
                          </div>

                          {/* Preview / Hook */}
                          <div className="p-6 bg-white/5 rounded-2xl border border-white/5 mb-8">
                             <div className="text-[9px] font-black uppercase tracking-widest text-indigo-400 mb-3">AI Predloženi Hook:</div>
                             <p className="text-xl font-black italic tracking-tight">"{s.hook}"</p>
                          </div>

                          {/* Editor Section (Conditional) */}
                          {editingClipId === s.id && (
                            <div className="space-y-8 mt-10 p-8 bg-indigo-600/5 border-t border-white/5 animate-fade-in">
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                  {/* Captions Editor */}
                                  <div>
                                     <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-4">Uredi Titlove (Captions):</label>
                                     <textarea 
                                      value={s.captions}
                                      onChange={(e) => updateClip(s.id, { captions: e.target.value })}
                                      className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-6 text-sm font-medium outline-none focus:border-indigo-500 transition-all resize-none"
                                     />
                                  </div>
                                  
                                  {/* Settings Area */}
                                  <div className="space-y-6">
                                     <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-4">Format (Aspect Ratio):</label>
                                        <div className="flex gap-3">
                                           {(['9:16', '16:9'] as const).map(ratio => (
                                             <button 
                                              key={ratio}
                                              onClick={() => updateClip(s.id, { selectedRatio: ratio })}
                                              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${s.selectedRatio === ratio ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400'}`}
                                             >
                                               {ratio === '9:16' ? '📱 Portrait' : '💻 Landscape'}
                                             </button>
                                           ))}
                                        </div>
                                     </div>
                                     
                                     <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-4">Rezolucija:</label>
                                        <div className="flex gap-3">
                                           {(['720p', '1080p'] as const).map(res => (
                                             <button 
                                              key={res}
                                              onClick={() => updateClip(s.id, { selectedRes: res })}
                                              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${s.selectedRes === res ? 'bg-emerald-600 text-white' : 'bg-white/5 text-gray-400'}`}
                                             >
                                               {res}
                                             </button>
                                           ))}
                                        </div>
                                     </div>
                                  </div>
                               </div>

                               <div className="grid grid-cols-2 gap-6">
                                  <div>
                                     <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-3">Početak (Start):</label>
                                     <input 
                                      type="text" 
                                      value={s.startTime}
                                      onChange={(e) => updateClip(s.id, { startTime: e.target.value })}
                                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold outline-none"
                                     />
                                  </div>
                                  <div>
                                     <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-3">Kraj (End):</label>
                                     <input 
                                      type="text" 
                                      value={s.endTime}
                                      onChange={(e) => updateClip(s.id, { endTime: e.target.value })}
                                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold outline-none"
                                     />
                                  </div>
                               </div>
                            </div>
                          )}
                       </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>

          {/* Cenovnik Generator */}
          <div className="bg-white rounded-[3.5rem] p-12 border-4 border-indigo-50 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 blur-[80px] pointer-events-none"></div>
             <div className="flex items-center gap-5 mb-10 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white rounded-[1.5rem] flex items-center justify-center text-3xl shadow-xl shadow-indigo-200">✨</div>
                <div>
                   <h3 className="text-2xl font-black uppercase tracking-tighter">Cenovnik Generator</h3>
                   <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">AI pravi luksuzni profil za tebe</p>
                </div>
             </div>
             <textarea 
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Npr: Tarot čitanje 30 min 65€..."
                className="w-full h-48 bg-gray-50 border-2 border-gray-100 rounded-[2.5rem] p-8 text-sm font-medium focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all mb-8 shadow-inner text-gray-900"
             />
             <button 
                onClick={() => setIsAiLoading(true)}
                className="w-full bg-gray-950 text-white py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-indigo-600 transition-all shadow-2xl"
             >
                Generiši Prodavnicu
             </button>
          </div>
        </div>

        <div className="space-y-10">
          <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-gray-100 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
             <h3 className="font-black text-xs uppercase mb-8 tracking-widest text-gray-400">Security Vault 🔐</h3>
             <p className="text-[10px] font-bold text-gray-500 mb-8 leading-relaxed uppercase">
               Svi tvoji kredencijali za društvene mreže su zaštićeni vojnom enkripcijom. Koristimo ih samo za 1-click automatizaciju.
             </p>
             <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                   <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Connected Accounts</span>
                   <span className="text-emerald-500 text-[10px] font-black">ENCRYPTED</span>
                </div>
             </div>
          </div>
          
          <div className="bg-indigo-600 p-12 rounded-[3.5rem] shadow-2xl text-white">
             <h3 className="font-black text-xs uppercase mb-4 tracking-widest text-indigo-200">Growth Boost Perk</h3>
             <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-8">Povećaj domet na svim mrežama</p>
             <div className="space-y-6">
                <div className="flex items-center gap-4">
                   <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-xs">✓</div>
                   <span className="text-[10px] font-black uppercase tracking-widest">No Branding</span>
                </div>
                <div className="flex items-center gap-4">
                   <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-xs">✓</div>
                   <span className="text-[10px] font-black uppercase tracking-widest">Priority AI clipping</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
