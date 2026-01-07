
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
  const [activeTab, setActiveTab] = useState<'LIVE' | 'DIGITAL' | 'POSTS' | 'FAQ'>('DIGITAL');
  const [paymentModal, setPaymentModal] = useState<{ isOpen: boolean; product: DigitalProduct } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [ownedProductIds, setOwnedProductIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const loggedInStatus = localStorage.getItem('baksis_logged_in') === 'true';
      setIsLoggedIn(loggedInStatus);
      
      // Učitaj kupljene proizvode
      const savedOwned = localStorage.getItem('baksis_owned_products');
      if (savedOwned) {
        setOwnedProductIds(JSON.parse(savedOwned));
      }

      window.scrollTo(0, 0);
      document.title = `${username} | bakšis.net`;
    } catch (e) {}
  }, [username]);

  // Case-insensitive provera korisnika
  const normalizedUsername = username?.toLowerCase();
  const user: User = normalizedUsername === MOCK_FOLLOWER.username.toLowerCase() ? MOCK_FOLLOWER : EXALTED_VENUS;
  
  const isOwned = (productId: string) => ownedProductIds.includes(productId);

  const handleAction = (product: DigitalProduct) => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }

    if (isOwned(product.id)) {
      if (product.type === 'EBOOK' && product.externalLink) {
        window.open(product.externalLink, '_blank');
      } else {
        // Logika za ostale tipove fajlova
        alert("Pristup odobren! Sadržaj je u vašoj riznici.");
      }
      return;
    }

    // Ako nije kupljeno, otvori modal za plaćanje
    setPaymentModal({ isOpen: true, product });
  };

  const handlePaymentSuccess = (productId: string) => {
    const updatedOwned = [...ownedProductIds, productId];
    setOwnedProductIds(updatedOwned);
    try {
      localStorage.setItem('baksis_owned_products', JSON.stringify(updatedOwned));
    } catch (e) {}
  };

  const digitalGoods = EXALTED_VENUS_PRODUCTS.filter(p => ['EBOOK', 'SERVICE', 'FILE_DOWNLOAD'].includes(p.type));
  const liveServices = EXALTED_VENUS_PRODUCTS.filter(p => ['CONSULTATION', 'TAROT_READING'].includes(p.type));

  const mockLockedPosts = [
    { id: 1, title: 'Ritual za Pun Mesec', date: 'Juče', type: 'IMAGE', img: 'https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4c5?w=600&q=50' },
    { id: 2, title: 'Predviđanje za Lavove', date: 'Pre 3 dana', type: 'VIDEO', img: 'https://images.unsplash.com/photo-1515940175183-6798529cb860?w=600&q=50' }
  ];

  return (
    <div className="bg-[#fcfdfe] min-h-screen pb-32">
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onSuccess={() => setIsLoggedIn(true)} />
      
      {paymentModal && (
        <PaymentModal 
          isOpen={paymentModal.isOpen} 
          onClose={() => setPaymentModal(null)} 
          itemName={paymentModal.product.name} 
          price={paymentModal.product.price} 
          onSuccess={() => handlePaymentSuccess(paymentModal.product.id)} 
          isInternal={user.isInternalProject}
        />
      )}

      {/* Hero Header */}
      <div className="h-72 md:h-96 w-full bg-indigo-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#fcfdfe] to-transparent"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-32 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar: Profile Card */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white rounded-[3rem] shadow-2xl p-8 border border-gray-100 sticky top-24">
              <div className="relative inline-block mx-auto mb-6 left-1/2 -translate-x-1/2">
                <img src={user.avatar} className="w-36 h-36 rounded-[2.5rem] border-8 border-white shadow-xl object-cover" alt="" />
                {user.isVerified && (
                  <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-2xl shadow-lg border-4 border-white">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.25.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
                  </div>
                )}
              </div>
              
              <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter text-center mb-1">{user.displayName}</h1>
              <p className="text-indigo-600 font-black text-[10px] uppercase tracking-widest text-center mb-8">@{user.username}</p>
              
              <div className="flex justify-center gap-6 mb-8 border-y border-gray-50 py-6">
                 <div className="text-center">
                    <div className="text-lg font-black text-gray-900">{user.stats.followersCount.toLocaleString()}</div>
                    <div className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Pratioci</div>
                 </div>
                 <div className="w-px bg-gray-100"></div>
                 <div className="text-center">
                    <div className="text-lg font-black text-gray-900">24</div>
                    <div className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Fajlova</div>
                 </div>
              </div>

              <p className="text-gray-500 text-xs font-medium leading-relaxed mb-8 text-center italic">
                "{user.bio}"
              </p>

              <button onClick={() => navigate('/chat')} className="w-full bg-gray-950 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-600 transition-all mb-4">
                Pošalji Poruku
              </button>

              <div className="bg-emerald-50 text-emerald-700 p-4 rounded-2xl border border-emerald-100 flex items-center gap-3">
                 <span className="text-xl">💎</span>
                 <div className="text-[9px] font-black uppercase leading-tight">
                    Podrška: 95% zarade ide direktno kreatoru na Payoneer
                 </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 space-y-8">
            
            {/* Tabs Navigation */}
            <div className="bg-white rounded-[2rem] p-2 shadow-xl border border-gray-100 flex overflow-x-auto scrollbar-hide">
              {[
                { id: 'DIGITAL', label: 'Riznica Sadržaja', icon: '💎' },
                { id: 'LIVE', label: 'Konsultacije', icon: '🎙️' }, 
                { id: 'POSTS', label: 'Objave', icon: '📱' },
                { id: 'FAQ', label: 'Plaćanje', icon: '💳' }
              ].map(tab => (
                <button 
                  key={tab.id} 
                  onClick={() => setActiveTab(tab.id as any)} 
                  className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}
                >
                  <span className="text-base">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[500px]">
              {activeTab === 'DIGITAL' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {digitalGoods.map(product => {
                    const owned = isOwned(product.id);
                    return (
                      <div key={product.id} className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-lg group hover:shadow-2xl transition-all duration-500">
                        <div className="aspect-video relative overflow-hidden">
                           <img src={product.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                           <div className="absolute bottom-4 left-6">
                              <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/30">
                                {product.type === 'EBOOK' ? 'Digitalna Knjiga' : 'Digitalni Resurs'}
                              </span>
                           </div>
                        </div>
                        <div className="p-8">
                          <h3 className="font-black text-sm uppercase tracking-tight text-gray-900 mb-2">{product.name}</h3>
                          <p className="text-[10px] text-gray-400 font-bold uppercase mb-6 leading-relaxed line-clamp-2">
                             {product.description}
                          </p>
                          <div className="flex items-center justify-between gap-4">
                             <div className="text-2xl font-black text-indigo-600 tracking-tighter">
                               {owned ? 'Otključano' : `€${product.price}`}
                             </div>
                             <button 
                               onClick={() => handleAction(product)} 
                               className={`px-6 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center gap-2 ${
                                 owned 
                                   ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                                   : 'bg-gray-950 text-white hover:bg-indigo-600'
                               }`}
                             >
                                {owned ? (
                                  product.type === 'EBOOK' ? (
                                    <>
                                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                      Preuzmi PDF
                                    </>
                                  ) : 'Pristupi'
                                ) : 'Otključaj Sef'}
                             </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'POSTS' && (
                <div className="space-y-8">
                  {mockLockedPosts.map(post => {
                    // Za demo koristimo isti product ID da simuliramo VIP pristup
                    const vipOwned = isOwned(EXALTED_VENUS_PRODUCTS[2].id);
                    return (
                      <div key={post.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-xl relative group">
                         <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                               <img src={user.avatar} className="w-10 h-10 rounded-xl" alt="" />
                               <div>
                                  <div className="font-black text-xs uppercase text-gray-900">{user.displayName}</div>
                                  <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{post.date}</div>
                               </div>
                            </div>
                            <span className="text-xl">{vipOwned ? '🔓' : '🔒'}</span>
                         </div>
                         <div className="aspect-video relative overflow-hidden">
                            <img src={post.img} className={`w-full h-full object-cover transition-all duration-700 ${vipOwned ? 'blur-0' : 'blur-2xl opacity-40 grayscale scale-110'}`} alt="" />
                            {!vipOwned && (
                              <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center bg-gray-950/20 backdrop-blur-sm">
                                 <h4 className="text-white font-black uppercase text-lg tracking-tighter mb-4">{post.title}</h4>
                                 <p className="text-white/80 text-[10px] font-black uppercase tracking-widest mb-8">Ova objava je rezervisana za VIP članove</p>
                                 <button 
                                   onClick={() => handleAction(EXALTED_VENUS_PRODUCTS[2])}
                                   className="bg-white text-gray-950 px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-indigo-600 hover:text-white transition-all"
                                 >
                                   Postani VIP za €15
                                 </button>
                              </div>
                            )}
                         </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'LIVE' && (
                <div className="grid grid-cols-1 gap-6">
                  {liveServices.map(service => (
                    <div key={service.id} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl flex flex-col md:flex-row items-center gap-8">
                       <div className="w-24 h-24 bg-indigo-50 rounded-[2rem] flex items-center justify-center text-4xl shadow-inner shrink-0">
                          {service.type === 'TAROT_READING' ? '🔮' : '🗣️'}
                       </div>
                       <div className="flex-1 text-center md:text-left">
                          <h3 className="font-black text-base uppercase tracking-tight mb-2">{service.name}</h3>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-wide leading-relaxed">{service.description}</p>
                       </div>
                       <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
                          <div className="text-3xl font-black text-gray-900 tracking-tighter">€{service.price}</div>
                          <button onClick={() => handleAction(service)} className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg">
                            Zakaži Termin
                          </button>
                       </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'FAQ' && (
                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl space-y-10">
                   <div>
                      <h2 className="text-lg font-black uppercase tracking-tight mb-6">Transparentno Plaćanje</h2>
                      <p className="text-gray-500 text-sm font-medium leading-relaxed mb-8">
                        Svaka transakcija na bakšis.net je osigurana Payoneer protokolom. Kreator dobija 95% vrednosti direktno na svoj nalog.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4">
                           <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">🅿️</div>
                           <div>
                             <div className="text-[9px] font-black uppercase text-gray-400 mb-0.5">Metod Isplate</div>
                             <div className="text-xs font-black text-indigo-600">ISKLJUČIVO PAYONEER</div>
                           </div>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4">
                           <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">⚡</div>
                           <div>
                             <div className="text-[9px] font-black uppercase text-gray-400 mb-0.5">Vreme Obrade</div>
                             <div className="text-xs font-black text-emerald-600">24H / REAL-TIME</div>
                           </div>
                        </div>
                      </div>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
