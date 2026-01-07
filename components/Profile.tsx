
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  EXALTED_VENUS, MOCK_FOLLOWER, EXALTED_VENUS_PRODUCTS, 
} from '../constants';
import { User, DigitalProduct } from '../types';
import { PaymentModal } from './PaymentModal';
import { AuthModal } from './AuthModal';

export const Profile: React.FC = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'TIERS' | 'DIGITAL' | 'POSTS'>('TIERS');
  const [paymentModal, setPaymentModal] = useState<{ isOpen: boolean; product: DigitalProduct; priceOverride?: number } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Specific Tarot duration selection
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

  return (
    <div className="bg-[#fcfdfe] min-h-screen pb-32">
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onSuccess={() => setIsLoggedIn(true)} />
      
      {paymentModal && (
        <PaymentModal 
          isOpen={paymentModal.isOpen} 
          onClose={() => setPaymentModal(null)} 
          itemName={`${paymentModal.product.name}${paymentModal.priceOverride ? ` (${tarotDuration} min)` : ''}`} 
          price={paymentModal.priceOverride || paymentModal.product.price} 
          onSuccess={() => {}} 
          isInternal={user.isInternalProject}
        />
      )}

      {/* Dynamic Banner */}
      <div className="h-80 md:h-[480px] w-full relative overflow-hidden">
        <img src={user.banner} className="w-full h-full object-cover" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#fcfdfe] via-transparent to-black/20"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-40 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] shadow-2xl p-8 border border-white/50 sticky top-24">
              <div className="relative inline-block mx-auto mb-6 left-1/2 -translate-x-1/2">
                <img src={user.avatar} className="w-40 h-40 rounded-[2.8rem] border-8 border-white shadow-2xl object-cover" alt="" />
                <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-2.5 rounded-2xl shadow-lg border-4 border-white animate-pulse">✓</div>
              </div>
              
              <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter text-center mb-1">{user.displayName}</h1>
              <p className="text-indigo-600 font-black text-[10px] uppercase tracking-widest text-center mb-6">@{user.username}</p>
              
              <div className="flex justify-center gap-6 mb-8 border-y border-gray-50 py-6">
                 <div className="text-center">
                    <div className="text-lg font-black text-gray-900">15.6K</div>
                    <div className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Pratioci</div>
                 </div>
              </div>

              <button onClick={() => navigate('/chat')} className="w-full bg-gray-950 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-600 transition-all">
                Pošalji Poruku
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-8">
            <div className="bg-white/50 backdrop-blur-md rounded-[2.5rem] p-2 shadow-xl border border-white flex overflow-x-auto scrollbar-hide">
              {[
                { id: 'TIERS', label: 'Pretplate & Rani Pristup', icon: '💎' },
                { id: 'DIGITAL', label: 'Usluge & Konsultacije', icon: '🔮' }, 
                { id: 'POSTS', label: 'Ekskluzivna Videa', icon: '🎬' }
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-3 px-8 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-gray-400 hover:text-gray-900'}`}>
                  <span className="text-lg">{tab.icon}</span> {tab.label}
                </button>
              ))}
            </div>

            <div className="min-h-[500px]">
              {activeTab === 'TIERS' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {user.subscriptionTiers?.map(tier => (
                    <div key={tier.id} className="bg-white rounded-[3rem] p-10 border-4 border-gray-50 shadow-2xl relative overflow-hidden group hover:border-indigo-600 transition-all duration-500">
                       <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{tier.name}</div>
                       <div className="text-4xl font-black text-gray-900 mb-8 tracking-tighter">€{tier.price}<span className="text-sm text-gray-300">/mes</span></div>
                       <ul className="space-y-4 mb-10">
                          {tier.benefits.map((b, i) => (
                            <li key={i} className="flex items-start gap-3 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                               <span className="text-indigo-600">✦</span> {b}
                            </li>
                          ))}
                       </ul>
                       <button onClick={() => handleAction(tier)} className="w-full bg-gray-950 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest group-hover:bg-indigo-600 transition-all">
                          Pridruži se
                       </button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'DIGITAL' && (
                <div className="space-y-6">
                   {/* Tarot Selection Specialist Block */}
                   <div className="bg-white rounded-[3.5rem] overflow-hidden shadow-2xl border border-gray-50 flex flex-col md:flex-row">
                      <div className="md:w-1/3 aspect-square md:aspect-auto">
                         <img src="https://images.unsplash.com/photo-1576669801775-ffed63192b48?w=800&q=80" className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="p-10 flex-1 flex flex-col justify-between">
                         <div>
                            <div className="inline-flex bg-purple-50 text-purple-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest mb-4">Video Poziv Uživo</div>
                            <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Tarot Tumačenje Uživo</h3>
                            <p className="text-gray-500 text-[11px] font-medium leading-relaxed mb-8">RAZGOVARAMO UŽIVO videopozivom da možete gledati karte (ili običnim po preferenciji) na temu koja vas interesuje.</p>
                         </div>
                         
                         <div className="space-y-6">
                            <div className="flex gap-2 p-1 bg-gray-50 rounded-2xl border border-gray-100">
                               {[20, 30, 45].map(d => (
                                 <button key={d} onClick={() => setTarotDuration(d as any)} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tarotDuration === d ? 'bg-white text-indigo-600 shadow-md border border-gray-100' : 'text-gray-400'}`}>
                                    {d} MIN
                                 </button>
                               ))}
                            </div>
                            <div className="flex items-center justify-between">
                               <div className="text-3xl font-black text-gray-900 tracking-tighter">€{tarotPrices[tarotDuration]}</div>
                               <button onClick={() => handleAction({name: 'Tarot Tumačenje', price: tarotPrices[tarotDuration]})} className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100 hover:scale-105 transition-all">REZERVIŠI TERMIN</button>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Other Products Grid */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {EXALTED_VENUS_PRODUCTS.filter(p => p.type !== 'TAROT_READING').map(product => (
                        <div key={product.id} className="bg-white rounded-[3rem] p-8 border border-gray-50 shadow-xl group hover:border-indigo-100 transition-all">
                           <div className="aspect-video rounded-3xl overflow-hidden mb-6">
                              <img src={product.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                           </div>
                           <h4 className="text-lg font-black uppercase tracking-tight text-gray-900 mb-2">{product.name}</h4>
                           <p className="text-[10px] font-medium text-gray-400 leading-relaxed mb-6 line-clamp-2">{product.description}</p>
                           <div className="flex items-center justify-between">
                              <span className="text-2xl font-black text-indigo-600">€{product.price}</span>
                              <button onClick={() => handleAction(product)} className="bg-gray-950 text-white px-8 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest">NARUČI</button>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {activeTab === 'POSTS' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {[
                     { id: '1', title: 'TRANZIT JUPITERA: Detaljna Analiza', thumb: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80', isExtended: true, isLocked: true },
                     { id: '2', title: 'MLAD MESEC U VODOLIJI: Šta nas čeka?', thumb: 'https://images.unsplash.com/photo-1532667449560-72a95c8d381b?w=600&q=80', isExtended: false, isLocked: true }
                   ].map(v => (
                     <div key={v.id} className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-gray-50 relative group">
                        <img src={v.thumb} className="w-full aspect-video object-cover" alt="" />
                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-8 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <div className="text-[10px] font-black uppercase text-white tracking-[0.3em] mb-4">
                              {v.isExtended ? 'PRODUŽENI VIDEO (9.99€)' : 'RANI PRISTUP (4.99€)'}
                           </div>
                           <button onClick={() => handleAction({name: v.title, price: v.isExtended ? 9.99 : 4.99})} className="bg-white text-gray-950 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl">
                              OTKLJUČAJ SAD 🔐
                           </button>
                        </div>
                        <div className="p-8">
                           <div className="flex items-center gap-2 mb-2">
                              {v.isExtended && <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest">Premium+</span>}
                              <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest">Early Access</span>
                           </div>
                           <h3 className="text-sm font-black uppercase tracking-tight text-gray-900">{v.title}</h3>
                        </div>
                     </div>
                   ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
