
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
  const otherProducts = EXALTED_VENUS_PRODUCTS.filter(p => p.type !== 'EXTENDED_VIDEO');

  // Boje brenda preuzete sa YT
  const accentColor = syncedData?.brandColors?.[0] || '#6366f1';

  return (
    <div className="bg-[#0f0f0f] min-h-screen pb-40 text-white">
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
        <img src={syncedData?.bannerUrl || user.banner} className="w-full h-full object-cover opacity-60" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-16 relative z-10">
        <div className="flex flex-col gap-10">
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <img src={syncedData?.avatarUrl || user.avatar} className="w-32 h-32 md:w-44 md:h-44 rounded-full border-4 border-[#0f0f0f] shadow-2xl object-cover" alt="" />
              <div className="flex-1 text-center md:text-left space-y-4 pt-4">
                 <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">{user.displayName}</h1>
                 <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-[11px] font-black uppercase tracking-widest text-gray-500">
                    <span className="text-white">@{user.username}</span>
                    <span>15.6K PRETPLATNIKA</span>
                    <span className="flex items-center gap-2"><span className="w-2 h-2 bg-emerald-500 rounded-full"></span> YT SINHRONIZOVAN</span>
                 </div>
                 <p className="text-sm font-medium text-gray-400 max-w-2xl leading-relaxed italic">{syncedData?.bio || user.bio}</p>
                 <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <button onClick={() => handleAction(DEFAULT_TIERS[1])} className="bg-white text-black px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all">Pretplati se (Premium)</button>
                    <button onClick={() => handleAction({name: 'Donacija', price: 10})} className="bg-white/10 text-white px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest border border-white/10">Bakšiš 💸</button>
                 </div>
              </div>
          </div>

          <div className="flex border-b border-white/10 overflow-x-auto scrollbar-hide">
            {[
              { id: 'HOME', label: 'Home' },
              { id: 'VIDEOS', label: 'Videos' },
              { id: 'SHORTS', label: 'Shorts' },
              { id: 'EXTENDED', label: 'Extended (Premium)' },
              { id: 'PRIVATNO', label: 'Privatno' }
            ].map(tab => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id as any)} 
                className={`px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === tab.id ? 'text-white border-b-2 border-white' : 'text-gray-500'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === 'HOME' && (
              <div className="space-y-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {user.subscriptionTiers?.map((tier) => (
                    <div key={tier.id} className="bg-gray-900/50 border border-white/10 rounded-[2.5rem] p-10 hover:border-white/20 transition-all shadow-2xl">
                       <h3 className="text-xl font-black uppercase tracking-tight mb-2">{tier.name}</h3>
                       <div className="text-3xl font-black text-indigo-400 mb-8">${tier.price}</div>
                       <ul className="space-y-4 mb-10 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          {tier.benefits.map((b, i) => <li key={i}>• {b}</li>)}
                       </ul>
                       <button onClick={() => handleAction(tier)} className="w-full bg-white text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest">Kupi Plan</button>
                    </div>
                  ))}
                </div>

                <div className="space-y-8">
                   <h2 className="text-2xl font-black uppercase tracking-tighter">Najnovije sa YouTube-a</h2>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {(syncedData?.latestVideos || [1,2,3]).map((v: any, i: number) => (
                        <div key={i} className="bg-gray-900 border border-white/5 rounded-3xl overflow-hidden group">
                           <div className="aspect-video bg-black relative">
                              {v.thumbnail && <img src={v.thumbnail} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all" />}
                              <div className="absolute inset-0 flex items-center justify-center">
                                 <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">▶</div>
                              </div>
                           </div>
                           <div className="p-6">
                              <h4 className="text-xs font-black uppercase tracking-tight line-clamp-2">{v.title || 'Video u pripremi...'}</h4>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'SHORTS' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                 {(syncedData?.latestShorts || [1,2,3,4,5]).map((s: any, i: number) => (
                   <div key={i} className="aspect-[9/16] bg-gray-900 rounded-3xl overflow-hidden relative group border border-white/5">
                      <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover:opacity-100">📱</div>
                      <div className="absolute bottom-4 left-4 right-4">
                         <p className="text-[10px] font-black uppercase leading-tight line-clamp-2">{s.title || 'Shorts u pripremi...'}</p>
                      </div>
                   </div>
                 ))}
              </div>
            )}

            {activeTab === 'EXTENDED' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {extendedVideos.map(video => (
                  <div key={video.id} className="bg-gray-900 rounded-[3rem] overflow-hidden border border-white/5 group shadow-2xl">
                     <div className="relative aspect-video">
                        <img src={video.imageUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all" alt="" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                           <button onClick={() => handleAction(video)} className="bg-white text-black px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl">Otključaj 🔓</button>
                        </div>
                        <div className="absolute top-6 right-6 bg-black/80 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10">PREMIUM</div>
                     </div>
                     <div className="p-10">
                        <h3 className="text-xl font-black uppercase mb-4 tracking-tight">{video.name}</h3>
                        <p className="text-[11px] font-medium text-gray-500 leading-relaxed mb-8 italic">{video.description}</p>
                        <div className="flex items-center justify-between pt-6 border-t border-white/5">
                           <div className="flex flex-col">
                              <span className="text-2xl font-black text-white tracking-tighter">${video.price}</span>
                              <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">+ 30 DANA EARLY BIRD</span>
                           </div>
                           <button onClick={() => handleAction(video)} className="bg-white/10 text-white px-8 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-white hover:text-black transition-all border border-white/10">Kupi Video</button>
                        </div>
                     </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
