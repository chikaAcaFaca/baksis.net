
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  EXALTED_VENUS, MOCK_FOLLOWER, EXALTED_VENUS_PRODUCTS, DEFAULT_TIERS
} from '../constants';
import { User, DigitalProduct } from '../types';
import { PaymentModal } from './PaymentModal';
import { AuthModal } from './AuthModal';

export const Profile: React.FC = () => {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState<'HOME' | 'VIDEOS' | 'SHORTS' | 'EXTENDED' | 'PRIVATNO'>('HOME');
  const [paymentModal, setPaymentModal] = useState<{ isOpen: boolean; product: DigitalProduct; priceOverride?: number } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [syncedData, setSyncedData] = useState<any>(null);
  
  const [tarotDuration, setTarotDuration] = useState<20 | 30 | 45>(20);
  const tarotPrices = { 20: 65, 30: 75, 45: 85 };

  useEffect(() => {
    try {
      const loggedInStatus = localStorage.getItem('baksis_logged_in') === 'true';
      setIsLoggedIn(loggedInStatus);
      
      const localData = localStorage.getItem('synced_yt_data');
      if (localData) setSyncedData(JSON.parse(localData));
      
      window.scrollTo(0, 0);
    } catch (e) {}
  }, [username]);

  const normalizedUsername = username?.toLowerCase();
  const user: User = normalizedUsername === MOCK_FOLLOWER.username.toLowerCase() ? MOCK_FOLLOWER : EXALTED_VENUS;
  
  const handleAction = (product: any, price?: number) => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }
    setPaymentModal({ isOpen: true, product, priceOverride: price });
  };

  const extendedVideos = EXALTED_VENUS_PRODUCTS.filter(p => p.type === 'EXTENDED_VIDEO');
  const privateProducts = EXALTED_VENUS_PRODUCTS.filter(p => p.type !== 'EXTENDED_VIDEO');

  return (
    <div className="bg-[#0f0f0f] min-h-screen pb-40 text-white selection:bg-indigo-500">
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onSuccess={() => setIsLoggedIn(true)} />
      
      {paymentModal && (
        <PaymentModal 
          isOpen={paymentModal.isOpen} 
          onClose={() => setPaymentModal(null)} 
          itemName={`${paymentModal.product.name}${paymentModal.priceOverride && tarotPrices[tarotDuration as keyof typeof tarotPrices] === paymentModal.priceOverride ? ` (${tarotDuration} min)` : ''}`} 
          price={paymentModal.priceOverride || paymentModal.product.price} 
          onSuccess={() => {}} 
          isInternal={user.isInternalProject}
        />
      )}

      {/* YouTube Banner */}
      <div className="h-44 md:h-[320px] w-full relative overflow-hidden group border-b border-white/5">
        <img src={syncedData?.bannerUrl || user.banner} className="w-full h-full object-cover opacity-40 transition-transform duration-[20s] linear animate-slow-zoom" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-16 relative z-10">
        <div className="flex flex-col gap-10">
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="relative">
                <img src={syncedData?.avatarUrl || user.avatar} className="w-32 h-32 md:w-44 md:h-44 rounded-full border-4 border-[#0f0f0f] shadow-2xl object-cover" alt="" />
                <div className="absolute bottom-2 right-2 bg-indigo-600 p-2 rounded-full border-4 border-[#0f0f0f]">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.25.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812z"/></svg>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left space-y-4 pt-4">
                 <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">{user.displayName}</h1>
                 <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <span className="text-white">@{user.username}</span>
                    <span>15.6K PRETPLATNIKA</span>
                    <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-lg border border-emerald-500/20">YT SINHRONIZOVAN ✅</span>
                 </div>
                 <p className="text-sm font-medium text-gray-400 max-w-2xl leading-relaxed italic line-clamp-2 md:line-clamp-none">
                    {syncedData?.bio || user.bio}
                 </p>
                 <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <button onClick={() => handleAction(DEFAULT_TIERS[1])} className="bg-white text-black px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all shadow-xl shadow-white/5">Pretplati se (Premium)</button>
                    <button onClick={() => handleAction({name: 'Bakšiš', price: 10})} className="bg-white/5 text-white px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest border border-white/10 hover:bg-white/10">Podrži Rad 💸</button>
                 </div>
              </div>
          </div>

          <div className="flex border-b border-white/10 overflow-x-auto scrollbar-hide">
            {[
              { id: 'HOME', label: 'Home' },
              { id: 'VIDEOS', label: 'Videos' },
              { id: 'SHORTS', label: 'Shorts' },
              { id: 'EXTENDED', label: 'Produženi' },
              { id: 'PRIVATNO', label: 'Privatno Čitanje' }
            ].map(tab => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id as any)} 
                className={`px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === tab.id ? 'text-white' : 'text-gray-500 hover:text-white'}`}
              >
                {tab.label}
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-white"></div>}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === 'HOME' && (
              <div className="space-y-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {user.subscriptionTiers?.map((tier) => (
                    <div key={tier.id} className="bg-gray-900/40 backdrop-blur-md border border-white/5 rounded-[3rem] p-10 hover:border-indigo-500/50 transition-all group">
                       <h3 className="text-xl font-black uppercase tracking-tight mb-2 group-hover:text-indigo-400 transition-colors">{tier.name}</h3>
                       <div className="text-4xl font-black text-white mb-8 tracking-tighter">${tier.price}</div>
                       <ul className="space-y-4 mb-10 text-[9px] font-black text-gray-500 uppercase tracking-widest leading-relaxed">
                          {tier.benefits.map((b, i) => <li key={i} className="flex gap-2"><span>→</span> {b}</li>)}
                       </ul>
                       <button onClick={() => handleAction(tier)} className="w-full bg-white text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest group-hover:bg-indigo-600 group-hover:text-white transition-all">Odaberi Plan</button>
                    </div>
                  ))}
                </div>

                <div className="space-y-8">
                   <h2 className="text-2xl font-black uppercase tracking-tighter">Najnovije sa YouTube-a</h2>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {(syncedData?.latestVideos || [1,2,3]).map((v: any, i: number) => (
                        <div key={i} className="bg-gray-900/40 rounded-[2.5rem] overflow-hidden border border-white/5 group shadow-2xl">
                           <div className="aspect-video bg-black relative">
                              {v.thumbnail ? (
                                <img src={v.thumbnail} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center opacity-20">YT VIDEO</div>
                              )}
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                 <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">▶</div>
                              </div>
                           </div>
                           <div className="p-6">
                              <h4 className="text-[11px] font-black uppercase tracking-tight line-clamp-2 leading-relaxed text-gray-300">{v.title || 'Video u pripremi...'}</h4>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'SHORTS' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6">
                 {(syncedData?.latestShorts || [1,2,3,4,5]).map((s: any, i: number) => (
                   <div key={i} className="aspect-[9/16] bg-gray-900/40 rounded-[2rem] overflow-hidden relative group border border-white/5">
                      <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-40 transition-all">📱</div>
                      <div className="absolute bottom-6 left-4 right-4 z-10">
                         <p className="text-[10px] font-black uppercase leading-tight line-clamp-2 text-white/80">{s.title || 'Shorts u pripremi...'}</p>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                   </div>
                 ))}
              </div>
            )}

            {activeTab === 'EXTENDED' && (
              <div className="space-y-12">
                <div className="bg-indigo-600/5 border border-indigo-600/20 p-8 rounded-[3rem] flex flex-col md:flex-row justify-between items-center gap-6">
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tighter text-indigo-400">Price Ladder Bridge 🌉</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-2">Kupovinom jednog videa otključavaš Early Bird status na 30 dana!</p>
                  </div>
                  <div className="text-[10px] font-black uppercase bg-indigo-600 text-white px-6 py-3 rounded-xl tracking-widest">Bonus: +30 Dana Status</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {extendedVideos.map(video => (
                    <div key={video.id} className="bg-gray-900/40 rounded-[3.5rem] overflow-hidden border border-white/5 group hover:border-white/10 transition-all">
                       <div className="relative aspect-video">
                          <img src={video.imageUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700" alt="" />
                          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                             <button onClick={() => handleAction(video)} className="bg-white text-black px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl">Otključaj Sadržaj 🔓</button>
                          </div>
                          <div className="absolute top-6 right-6 bg-black/80 backdrop-blur-md px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10">PRODUŽENO</div>
                       </div>
                       <div className="p-10">
                          <h3 className="text-2xl font-black uppercase mb-4 tracking-tighter leading-none">{video.name}</h3>
                          <p className="text-[11px] font-medium text-gray-500 leading-relaxed mb-10 italic">"{video.description}"</p>
                          <div className="flex items-center justify-between pt-8 border-t border-white/5">
                             <div className="flex flex-col">
                                <span className="text-3xl font-black text-white tracking-tighter">${video.price}</span>
                                <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Uključuje Early Bird</span>
                             </div>
                             <button onClick={() => handleAction(video)} className="bg-white/5 text-white px-10 py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-white hover:text-black transition-all border border-white/10">Kupi Odmah</button>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'PRIVATNO' && (
              <div className="space-y-12">
                 {/* Premium Private Session Hero */}
                 <div className="bg-gray-900/40 rounded-[4rem] overflow-hidden border border-white/5 flex flex-col md:flex-row min-h-[550px] shadow-2xl relative">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
                    <div className="md:w-1/2 relative group overflow-hidden">
                       <img src="https://images.unsplash.com/photo-1576669801775-ffed63192b48?w=1200&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[10s]" alt="" />
                       <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0f0f0f]/80"></div>
                    </div>
                    <div className="p-12 md:p-20 md:w-1/2 flex flex-col justify-center relative z-10">
                       <div className="inline-flex bg-indigo-600/20 text-indigo-400 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 border border-indigo-600/30">Dostupni Termini Danas 📅</div>
                       <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8 leading-[0.9]">Privatno Tarot<br/><span className="text-indigo-500">Čitanje 1 na 1</span></h3>
                       <p className="text-gray-500 text-sm font-medium leading-relaxed mb-12 italic max-w-md">"Gledate svako otvaranje uživo preko video poziva. Bez cenzure, bez ograničenja na teme."</p>
                       
                       <div className="space-y-10">
                          <div className="space-y-4">
                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-2">Izaberi trajanje sesije:</label>
                            <div className="flex gap-4 p-2 bg-black/40 rounded-[2.5rem] border border-white/5 shadow-inner">
                               {[20, 30, 45].map(d => (
                                 <button 
                                  key={d} 
                                  onClick={() => setTarotDuration(d as any)} 
                                  className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${tarotDuration === d ? 'bg-white text-black shadow-2xl' : 'text-gray-500 hover:text-white'}`}
                                 >
                                    {d} MIN
                                 </button>
                               ))}
                            </div>
                          </div>
                          <div className="flex items-center justify-between px-2 pt-4">
                             <div className="flex flex-col">
                                <div className="text-5xl font-black text-white tracking-tighter">${tarotPrices[tarotDuration as keyof typeof tarotPrices]}</div>
                                <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mt-1">Instant Isplata Kreatoru</span>
                             </div>
                             <button onClick={() => handleAction({name: 'Privatno Čitanje 1:1', price: tarotPrices[tarotDuration as keyof typeof tarotPrices]})} className="bg-indigo-600 text-white px-14 py-6 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/40 hover:scale-105 active:scale-95 transition-all">Zakaži Odmah</button>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Other Private Products */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {privateProducts.filter(p => p.type !== 'TAROT_READING').map(product => (
                      <div key={product.id} className="bg-gray-900/40 rounded-[3.5rem] p-10 border border-white/5 group hover:border-indigo-500/30 transition-all shadow-xl">
                         <div className="aspect-video rounded-[2.5rem] overflow-hidden mb-10 border border-white/5 relative">
                            <img src={product.imageUrl} className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-[5s]" alt="" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                         </div>
                         <h4 className="text-2xl font-black uppercase tracking-tighter mb-4 text-gray-200">{product.name}</h4>
                         <p className="text-[11px] font-medium text-gray-500 leading-relaxed mb-10 italic line-clamp-2">"{product.description}"</p>
                         <div className="flex items-center justify-between pt-8 border-t border-white/5">
                            <span className="text-3xl font-black text-white tracking-tighter">${product.price}</span>
                            <button onClick={() => handleAction(product)} className="bg-white text-black px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-indigo-600 hover:text-white transition-all">Naruči Uslugu</button>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slow-zoom { from { transform: scale(1); } to { transform: scale(1.15); } }
        .animate-slow-zoom { animation: slow-zoom 25s infinite alternate ease-in-out; }
      `}} />
    </div>
  );
};
