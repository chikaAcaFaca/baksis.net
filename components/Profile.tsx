
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  EXALTED_VENUS, MOCK_FOLLOWER, EXALTED_VENUS_PRODUCTS, DEFAULT_TIERS
} from '../constants';
import { User, DigitalProduct } from '../types';
import { PaymentModal } from './PaymentModal';
import { AuthModal } from './AuthModal';

export const Profile: React.FC = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'HOME' | 'SHORTS' | 'EXTENDED' | 'PRIVATNO'>('HOME');
  const [paymentModal, setPaymentModal] = useState<{ isOpen: boolean; product: DigitalProduct; priceOverride?: number } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [tarotDuration, setTarotDuration] = useState<20 | 30 | 45>(20);
  const tarotPrices = { 20: 65, 30: 75, 45: 85 };

  useEffect(() => {
    try {
      const loggedInStatus = localStorage.getItem('baksis_logged_in') === 'true';
      setIsLoggedIn(loggedInStatus);
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

      {/* YouTube Style Banner */}
      <div className="h-44 md:h-[280px] w-full relative overflow-hidden group border-b border-white/5">
        <img src={user.banner} className="w-full h-full object-cover opacity-80" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent"></div>
        <div className="absolute bottom-6 right-6 flex gap-3">
           {user.socialLinks?.youtube && (
             <a href={user.socialLinks.youtube} target="_blank" rel="noreferrer" className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 hover:bg-red-600 transition-all flex items-center gap-2">
               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z"/></svg>
               YouTube
             </a>
           )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-12 relative z-10">
        <div className="flex flex-col gap-12">
          
          {/* Channel Info Section */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <img src={user.avatar} className="w-28 h-28 md:w-40 md:h-40 rounded-full border-4 border-[#0f0f0f] shadow-2xl object-cover" alt="" />
              <div className="flex-1 text-center md:text-left space-y-4 pt-4">
                 <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">{user.displayName}</h1>
                    <div className="bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-600/30 self-center md:self-auto">Verifikovan</div>
                 </div>
                 <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-[11px] font-black uppercase tracking-widest text-gray-500">
                    <span className="text-white">@{user.username}</span>
                    <span>15.6K PRETPLATNIKA</span>
                    <span>142 VIDEA</span>
                 </div>
                 <p className="text-sm font-medium text-gray-400 max-w-2xl leading-relaxed italic line-clamp-2 md:line-clamp-none">
                    {user.bio}
                 </p>
                 <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                    <button onClick={() => handleAction(DEFAULT_TIERS[0])} className="bg-white text-black px-8 py-3.5 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all">Pretplati se</button>
                    <button onClick={() => handleAction({name: 'Donacija', price: 10})} className="bg-white/10 text-white px-8 py-3.5 rounded-full font-black text-[10px] uppercase tracking-widest border border-white/10 hover:bg-white/20 transition-all">Podrži Bakšišom</button>
                 </div>
              </div>
          </div>

          {/* YT Style Tabs */}
          <div className="flex border-b border-white/10 overflow-x-auto scrollbar-hide">
            {[
              { id: 'HOME', label: 'Home' },
              { id: 'SHORTS', label: 'Shorts' },
              { id: 'EXTENDED', label: 'Produženi' },
              { id: 'PRIVATNO', label: 'Privatno Čitanje' }
            ].map(tab => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id as any)} 
                className={`px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap ${activeTab === tab.id ? 'text-white border-b-2 border-white' : 'text-gray-500 hover:text-white'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="py-8">
            {activeTab === 'HOME' && (
              <div className="space-y-20">
                {/* Price Ladder Showcase */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {user.subscriptionTiers?.map((tier, idx) => (
                    <div key={tier.id} className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden group hover:border-indigo-500/50 transition-all">
                       <div className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-4">Plan #{idx + 1}</div>
                       <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-2">{tier.name}</h3>
                       <div className="text-4xl font-black text-indigo-400 tracking-tighter mb-8">${tier.price}</div>
                       <ul className="space-y-4 mb-10">
                          {tier.benefits.map((b, i) => (
                            <li key={i} className="flex items-start gap-3 text-[10px] font-black uppercase tracking-wide text-gray-400">
                               <span className="text-indigo-500">→</span>
                               <span>{b}</span>
                            </li>
                          ))}
                       </ul>
                       <button 
                        onClick={() => handleAction(tier)}
                        className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20"
                       >
                         Odaberi Plan
                       </button>
                    </div>
                  ))}
                </div>

                {/* Featured Video Area */}
                <div className="bg-white/5 rounded-[3.5rem] p-8 md:p-16 border border-white/10 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
                   <div className="flex flex-col lg:flex-row gap-12 items-center relative z-10">
                      <div className="lg:w-1/2 aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl relative border border-white/10">
                         <img src="https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=800&q=80" className="w-full h-full object-cover opacity-60" alt="" />
                         <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group cursor-pointer hover:scale-110 transition-all">
                               <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-2"></div>
                            </div>
                         </div>
                      </div>
                      <div className="lg:w-1/2 space-y-6">
                         <div className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest inline-block">Najnovije</div>
                         <h3 className="text-3xl font-black uppercase tracking-tighter leading-tight">Šta on/ona zapravo misli? <br/><span className="text-indigo-400">Puna Analiza</span></h3>
                         <p className="text-gray-400 text-sm font-medium leading-relaxed italic">"U ovom videu raskrinkavamo sve aspekte koji su previše osetljivi za javno prikazivanje."</p>
                         <div className="flex gap-4 pt-4">
                            <button onClick={() => handleAction(extendedVideos[0])} className="bg-white text-black px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-white/10">Gledaj Odmah ($9.99)</button>
                            <div className="text-[9px] font-black uppercase tracking-widest text-gray-500 flex flex-col justify-center">
                               <span>Dostupno besplatno</span>
                               <span className="text-indigo-400">uz Premium</span>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'SHORTS' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {[1,2,3,4,5,6,7,8].map(i => (
                  <div key={i} className="aspect-[9/16] bg-white/5 rounded-3xl overflow-hidden relative group cursor-pointer border border-white/5">
                    <img src={`https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&q=80&sig=${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60" alt="" />
                    <div className="absolute bottom-4 left-4 right-4">
                       <p className="text-[10px] font-black uppercase tracking-tight text-white line-clamp-2">Tarot Savet dana #{i}: Ne odustaj od...</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'EXTENDED' && (
              <div className="space-y-12">
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                       <h2 className="text-3xl font-black uppercase tracking-tighter">Produžena Tumačenja</h2>
                       <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mt-2">Kupi pojedinačno ili otključaj sve kroz pretplatu</p>
                    </div>
                    <div className="bg-indigo-600/10 border border-indigo-600/30 px-6 py-4 rounded-2xl">
                       <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest leading-relaxed">
                         🎁 POSEBNO: Svaki kupljeni video ($9.99) uključuje Early Bird beneficije na 30 dana!
                       </p>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {extendedVideos.map(video => (
                      <div key={video.id} className="bg-white/5 rounded-[3rem] overflow-hidden border border-white/10 group shadow-2xl">
                         <div className="relative aspect-video">
                            <img src={video.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-70" alt="" />
                            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                               <button onClick={() => handleAction(video)} className="bg-white text-black px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl">Otključaj Sadržaj 🔓</button>
                            </div>
                            <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">45:00</div>
                         </div>
                         <div className="p-10">
                            <h3 className="text-xl font-black uppercase tracking-tight mb-4">{video.name}</h3>
                            <p className="text-[11px] font-medium text-gray-500 leading-relaxed mb-10 italic">"{video.description}"</p>
                            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                               <div className="flex flex-col">
                                  <span className="text-2xl font-black text-white tracking-tighter">${video.price}</span>
                                  <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Uključuje Early Bird status</span>
                               </div>
                               <button onClick={() => handleAction(video)} className="bg-white/10 text-white px-8 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-white hover:text-black transition-all border border-white/10">Kupi Video</button>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            )}

            {activeTab === 'PRIVATNO' && (
              <div className="space-y-12">
                 <div className="bg-white/5 rounded-[4rem] overflow-hidden border border-white/10 flex flex-col md:flex-row min-h-[500px]">
                    <div className="md:w-1/2 relative grayscale-[0.5] hover:grayscale-0 transition-all duration-700">
                       <img src="https://images.unsplash.com/photo-1576669801775-ffed63192b48?w=1000&q=80" className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="p-12 md:p-20 md:w-1/2 flex flex-col justify-center bg-gradient-to-br from-indigo-900/10 to-transparent">
                       <div className="inline-flex bg-white/10 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-white/10">Uživo Video Poziv</div>
                       <h3 className="text-4xl font-black uppercase tracking-tighter mb-6 leading-none">Tarot Tumačenje<br/><span className="text-indigo-400">Personalizovano</span></h3>
                       
                       <div className="space-y-8">
                          <div className="flex gap-3 p-2 bg-black/40 rounded-[2rem] border border-white/10 shadow-inner">
                             {[20, 30, 45].map(d => (
                               <button 
                                key={d} 
                                onClick={() => setTarotDuration(d as any)} 
                                className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${tarotDuration === d ? 'bg-white text-black shadow-xl' : 'text-gray-500'}`}
                               >
                                  {d} MIN
                               </button>
                             ))}
                          </div>
                          <div className="flex items-center justify-between px-2">
                             <div className="text-5xl font-black text-white tracking-tighter">${tarotPrices[tarotDuration as keyof typeof tarotPrices]}</div>
                             <button onClick={() => handleAction({name: 'Tarot Tumačenje Uživo', price: tarotPrices[tarotDuration as keyof typeof tarotPrices]})} className="bg-indigo-600 text-white px-12 py-5 rounded-[1.75rem] font-black text-[12px] uppercase tracking-widest shadow-2xl shadow-indigo-600/20 hover:scale-105 transition-all">Zakaži</button>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {otherProducts.filter(p => p.type !== 'EXTENDED_VIDEO').map(product => (
                      <div key={product.id} className="bg-white/5 rounded-[3.5rem] p-10 border border-white/10 group hover:border-indigo-500/50 transition-all">
                         <div className="aspect-video rounded-[2.5rem] overflow-hidden mb-8 border border-white/10">
                            <img src={product.imageUrl} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000" alt="" />
                         </div>
                         <h4 className="text-2xl font-black uppercase tracking-tight mb-4">{product.name}</h4>
                         <p className="text-[11px] font-medium text-gray-500 leading-relaxed mb-8 italic line-clamp-2">"{product.description}"</p>
                         <div className="flex items-center justify-between pt-6 border-t border-white/5">
                            <span className="text-3xl font-black text-indigo-400 tracking-tighter">${product.price}</span>
                            <button onClick={() => handleAction(product)} className="bg-white text-black px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">Naruči</button>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
