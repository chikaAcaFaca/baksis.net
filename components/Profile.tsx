
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
  const [paymentModal, setPaymentModal] = useState<{ isOpen: boolean; product: DigitalProduct; priceOverride?: number; extraData?: any } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [syncedData, setSyncedData] = useState<any>(null);
  
  // States za Privatno Čitanje
  const [tarotDuration, setTarotDuration] = useState<20 | 30 | 45>(20);
  const tarotPrices = { 20: 65, 30: 75, 45: 85 };
  
  const [bookingDate, setBookingDate] = useState<string>('');
  const [bookingTime, setBookingTime] = useState<string>('');
  
  // Forma za Natalne podatke
  const [natalData, setNatalData] = useState({
    name: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    lastBirthdayLocation: ''
  });

  const availableSlots = ['10:00', '11:00', '13:00', '14:00', '16:00', '17:00'];
  const busySlots = ['12:00', '15:00', '18:00'];

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

    // Provera da li su uneti podaci za Natalnu kartu
    if ((product.id === 'p-natal-annual' || product.id === 'p-synastry') && !natalData.name) {
      alert("Molimo popunite podatke za rođenje pre zakazivanja.");
      return;
    }

    if (!bookingDate || !bookingTime) {
      alert("Molimo izaberite termin u kalendaru.");
      return;
    }

    setPaymentModal({ 
      isOpen: true, 
      product, 
      priceOverride: price,
      extraData: { ...natalData, bookingDate, bookingTime }
    });
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
          itemName={`${paymentModal.product.name}${paymentModal.priceOverride && tarotPrices[tarotDuration as keyof typeof tarotPrices] === paymentModal.priceOverride ? ` (${tarotDuration} min)` : ''} - ${paymentModal.extraData?.bookingDate} @ ${paymentModal.extraData?.bookingTime}`} 
          price={paymentModal.priceOverride || paymentModal.product.price} 
          onSuccess={() => {
            // Simulacija slanja u Creator Chat
            console.log("Notifikacija poslata Kreatoru:", paymentModal.extraData);
          }} 
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
                    <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-lg border border-indigo-500/20 uppercase tracking-widest font-black text-[9px]">Google Calendar Sync Active 📅</span>
                 </div>
                 <p className="text-sm font-medium text-gray-400 max-w-2xl leading-relaxed italic line-clamp-2 md:line-clamp-none">
                    {syncedData?.bio || user.bio}
                 </p>
              </div>
          </div>

          <div className="flex border-b border-white/10 overflow-x-auto scrollbar-hide">
            {['HOME', 'VIDEOS', 'SHORTS', 'EXTENDED', 'PRIVATNO'].map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab as any)} 
                className={`px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-white'}`}
              >
                {tab === 'PRIVATNO' ? 'Privatno Čitanje' : tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-white"></div>}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === 'HOME' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {user.subscriptionTiers?.map((tier) => (
                  <div key={tier.id} className="bg-gray-900/40 backdrop-blur-md border border-white/5 rounded-[3rem] p-10 hover:border-indigo-500/50 transition-all group">
                     <h3 className="text-xl font-black uppercase tracking-tight mb-2 group-hover:text-indigo-400 transition-colors">{tier.name}</h3>
                     <div className="text-4xl font-black text-white mb-8 tracking-tighter">${tier.price}</div>
                     <ul className="space-y-4 mb-10 text-[9px] font-black text-gray-500 uppercase tracking-widest leading-relaxed">
                        {tier.benefits.map((b, i) => <li key={i} className="flex gap-2"><span>→</span> {b}</li>)}
                     </ul>
                     <button onClick={() => setPaymentModal({ isOpen: true, product: { ...tier, type: 'SUBSCRIPTION' } as any })} className="w-full bg-white text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest group-hover:bg-indigo-600 group-hover:text-white transition-all">Odaberi Plan</button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'PRIVATNO' && (
              <div className="space-y-16">
                 {/* Google Calendar Simulator */}
                 <div className="bg-gray-950/50 rounded-[4rem] border border-white/5 p-8 md:p-16 relative overflow-hidden">
                    <div className="max-w-4xl mx-auto space-y-12">
                       <div className="text-center">
                          <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Zakazivanje Termina</h2>
                          <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Podaci o slobodnim terminima dolaze direktno sa Google Calendar-a kreatora</p>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                          <div className="space-y-8">
                             <div className="bg-black/40 p-6 rounded-3xl border border-white/5">
                                <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 block mb-4">1. Izaberi Datum</label>
                                <input 
                                  type="date" 
                                  value={bookingDate}
                                  onChange={(e) => setBookingDate(e.target.value)}
                                  className="w-full bg-transparent text-white font-black text-lg outline-none uppercase"
                                />
                             </div>

                             <div className="bg-black/40 p-6 rounded-3xl border border-white/5">
                                <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 block mb-4">2. Slobodni Termini</label>
                                <div className="grid grid-cols-3 gap-3">
                                   {availableSlots.map(slot => (
                                     <button 
                                      key={slot} 
                                      onClick={() => setBookingTime(slot)}
                                      className={`py-3 rounded-xl text-[10px] font-black transition-all border ${bookingTime === slot ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-white/10 text-gray-400 hover:text-white hover:border-white/30'}`}
                                     >
                                       {slot}
                                     </button>
                                   ))}
                                   {busySlots.map(slot => (
                                     <button key={slot} disabled className="py-3 rounded-xl text-[10px] font-black border border-white/5 text-gray-700 bg-white/5 opacity-50 cursor-not-allowed">
                                       ZAUZETO
                                     </button>
                                   ))}
                                </div>
                             </div>
                          </div>

                          <div className="bg-indigo-600/5 p-10 rounded-[3rem] border border-indigo-600/10 flex flex-col justify-center">
                             <h4 className="text-xl font-black uppercase tracking-tighter mb-6">Napomena o Terminima</h4>
                             <p className="text-xs text-gray-400 leading-relaxed italic mb-8">
                                "Čim obavite uplatu, termin se automatski potvrđuje. Creator će vas kontaktirati putem bakšis.net četa ili WhatsApp-a radi potvrde detalja."
                             </p>
                             <div className="flex items-center gap-4 p-4 bg-black/40 rounded-2xl border border-white/5">
                                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Bezbedno zakazivanje</span>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Products Grid */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Tarot Interactive Card */}
                    <div className="bg-gray-900/40 rounded-[4rem] overflow-hidden border border-white/5 flex flex-col md:flex-row min-h-[500px] shadow-2xl">
                        <div className="md:w-1/2 relative overflow-hidden group">
                           <img src="https://images.unsplash.com/photo-1576669801775-ffed63192b48?w=800&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[10s]" alt="" />
                           <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                        </div>
                        <div className="p-10 md:w-1/2 flex flex-col justify-center">
                           <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 leading-none">Tarot Uživo<br/><span className="text-indigo-500">Video Poziv</span></h3>
                           <div className="flex gap-2 p-1.5 bg-black/40 rounded-2xl border border-white/5 mb-8">
                              {[20, 30, 45].map(d => (
                                <button 
                                  key={d} 
                                  onClick={() => setTarotDuration(d as any)} 
                                  className={`flex-1 py-3 rounded-xl text-[9px] font-black transition-all ${tarotDuration === d ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                                >
                                  {d} MIN
                                </button>
                              ))}
                           </div>
                           <div className="flex items-center justify-between">
                              <div className="text-4xl font-black text-white tracking-tighter">€{tarotPrices[tarotDuration as keyof typeof tarotPrices]}</div>
                              <button 
                                onClick={() => handleAction({ id: 'p-tarot-session', name: 'Tarot Tumačenje Uživo' }, tarotPrices[tarotDuration as keyof typeof tarotPrices])} 
                                className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all"
                              >
                                Zakaži
                              </button>
                           </div>
                        </div>
                    </div>

                    {/* Natalna / Sinastrija Cards with Data Form */}
                    <div className="bg-gray-900/40 rounded-[4rem] p-10 border border-white/5 space-y-8">
                       <h3 className="text-2xl font-black uppercase tracking-tighter text-gray-200">Podaci za Natalnu Kartu</h3>
                       <div className="grid grid-cols-2 gap-4">
                          <input type="text" placeholder="Ime i Prezime" value={natalData.name} onChange={e => setNatalData({...natalData, name: e.target.value})} className="col-span-2 bg-black/20 border border-white/5 px-6 py-4 rounded-2xl text-xs outline-none focus:border-indigo-500" />
                          <input type="text" placeholder="Datum rođenja" value={natalData.birthDate} onChange={e => setNatalData({...natalData, birthDate: e.target.value})} className="bg-black/20 border border-white/5 px-6 py-4 rounded-2xl text-xs outline-none" />
                          <input type="text" placeholder="Tačno vreme rođenja" value={natalData.birthTime} onChange={e => setNatalData({...natalData, birthTime: e.target.value})} className="bg-black/20 border border-white/5 px-6 py-4 rounded-2xl text-xs outline-none" />
                          <input type="text" placeholder="Mesto rođenja" value={natalData.birthPlace} onChange={e => setNatalData({...natalData, birthPlace: e.target.value})} className="col-span-2 bg-black/20 border border-white/5 px-6 py-4 rounded-2xl text-xs outline-none" />
                          <input type="text" placeholder="Gde ste proveli poslednji rođendan?" value={natalData.lastBirthdayLocation} onChange={e => setNatalData({...natalData, lastBirthdayLocation: e.target.value})} className="col-span-2 bg-black/20 border border-white/5 px-6 py-4 rounded-2xl text-xs outline-none" />
                       </div>
                       
                       <div className="grid grid-cols-1 gap-4 pt-4 border-t border-white/5">
                          {privateProducts.filter(p => p.id !== 'p-tarot-session').map(product => (
                            <div key={product.id} className="flex items-center justify-between p-6 bg-white/5 rounded-3xl hover:bg-white/10 transition-all border border-white/5">
                               <div className="flex flex-col">
                                  <span className="text-xs font-black uppercase tracking-tight">{product.name}</span>
                                  <span className="text-[14px] font-black text-indigo-400">€{product.price}</span>
                               </div>
                               <button onClick={() => handleAction(product)} className="bg-white text-black px-8 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-xl">Kupi</button>
                            </div>
                          ))}
                       </div>
                    </div>
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
