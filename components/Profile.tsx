
import React, { useState, useEffect } from 'react';
// Fix: Use namespace import for react-router-dom to resolve missing exported member errors
import * as ReactRouterDOM from 'react-router-dom';
const { useParams } = ReactRouterDOM as any;

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
  
  // Privatno Čitanje state
  const [tarotDuration, setTarotDuration] = useState<20 | 30 | 45>(20);
  const tarotPrices = { 20: 65, 30: 75, 45: 85 };
  
  const [bookingDate, setBookingDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [bookingTime, setBookingTime] = useState<string>('');
  
  const [natalForm, setNatalForm] = useState({
    name: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    birthdayLocation: ''
  });

  const [synastryForm, setSynastryForm] = useState({
    person1: '',
    birth1: '',
    person2: '',
    birth2: ''
  });

  const [audioQuestion, setAudioQuestion] = useState('');

  const availableSlots = ['10:00', '11:00', '13:00', '14:00', '16:00', '17:00'];
  const busySlots = ['12:00', '15:00', '18:00']; // Simulacija zauzetosti iz Google Calendar-a

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
  
  const handleBooking = (product: any, price?: number) => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!bookingTime) {
      alert("Molimo izaberite slobodan termin u kalendaru.");
      return;
    }

    let extraData: any = { bookingDate, bookingTime };
    
    if (product.id === 'p-natal-annual') {
      if (!natalForm.name || !natalForm.birthDate || !natalForm.birthTime || !natalForm.birthPlace) {
        alert("Molimo popunite sve podatke o rođenju."); return;
      }
      extraData = { ...extraData, ...natalForm };
    } else if (product.id === 'p-synastry') {
      if (!synastryForm.person1 || !synastryForm.person2) {
        alert("Molimo popunite podatke za obe osobe."); return;
      }
      extraData = { ...extraData, ...synastryForm };
    } else if (product.id === 'p-audio-response') {
      if (!audioQuestion.trim()) {
        alert("Napišite vaše pitanje za audio odgovor."); return;
      }
      extraData = { ...extraData, question: audioQuestion };
    }

    setPaymentModal({ 
      isOpen: true, 
      product, 
      priceOverride: price,
      extraData
    });
  };

  const extendedVideos = EXALTED_VENUS_PRODUCTS.filter(p => p.type === 'EXTENDED_VIDEO');
  const consultations = EXALTED_VENUS_PRODUCTS.filter(p => p.type === 'CONSULTATION');
  const audioResp = EXALTED_VENUS_PRODUCTS.find(p => p.id === 'p-audio-response');

  return (
    <div className="bg-[#0f0f0f] min-h-screen pb-40 text-white selection:bg-indigo-500">
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onSuccess={() => setIsLoggedIn(true)} />
      
      {paymentModal && (
        <PaymentModal 
          isOpen={paymentModal.isOpen} 
          onClose={() => setPaymentModal(null)} 
          itemName={`${paymentModal.product.name}${paymentModal.priceOverride && tarotPrices[tarotDuration as keyof typeof tarotPrices] === paymentModal.priceOverride ? ` (${tarotDuration} min)` : ''}`} 
          price={paymentModal.priceOverride || paymentModal.product.price} 
          onSuccess={() => {
            // Logika za Chat dojavu i Google Calendar blokiranje
            console.log("Termin rezervisan i dojava poslata Kreatoru.");
          }} 
          isInternal={user.isInternalProject}
        />
      )}

      {/* Banner */}
      <div className="h-48 md:h-[350px] w-full relative overflow-hidden border-b border-white/5">
        <img src={syncedData?.bannerUrl || user.banner} className="w-full h-full object-cover opacity-40 animate-slow-zoom" alt="" />
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
                    <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-lg border border-emerald-500/20">LIVE ZAKAZIVANJE AKTIVNO 📅</span>
                 </div>
                 <p className="text-sm font-medium text-gray-400 max-w-2xl leading-relaxed italic">
                    {syncedData?.bio || user.bio}
                 </p>
              </div>
          </div>

          <div className="flex border-b border-white/10 overflow-x-auto scrollbar-hide">
            {['HOME', 'EXTENDED', 'PRIVATNO'].map(tab => (
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
                     <button onClick={() => setPaymentModal({ isOpen: true, product: { ...tier, type: 'SUBSCRIPTION' } as any })} className="w-full bg-white text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest group-hover:bg-indigo-600 group-hover:text-white transition-all">Pretplati se</button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'EXTENDED' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {extendedVideos.map(video => (
                  <div key={video.id} className="bg-gray-900/40 rounded-[3.5rem] overflow-hidden border border-white/5 group shadow-2xl hover:border-white/10 transition-all">
                     <div className="relative aspect-video">
                        <img src={video.imageUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700" alt="" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                           <button onClick={() => setPaymentModal({ isOpen: true, product: video })} className="bg-white text-black px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl">Otključaj Sadržaj 🔓</button>
                        </div>
                        <div className="absolute top-6 right-6 bg-black/80 px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest border border-white/10">PRODUŽENO</div>
                     </div>
                     <div className="p-10">
                        <h3 className="text-xl font-black uppercase mb-4 tracking-tighter">{video.name}</h3>
                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                           <span className="text-2xl font-black text-white tracking-tighter">${video.price}</span>
                           <button onClick={() => setPaymentModal({ isOpen: true, product: video })} className="bg-white/5 text-white px-8 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-white hover:text-black transition-all">Kupi</button>
                        </div>
                     </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'PRIVATNO' && (
              <div className="space-y-16">
                 {/* Google Calendar Picker Section */}
                 <div className="bg-gray-950/50 rounded-[4rem] border border-white/5 p-8 md:p-16">
                    <div className="max-w-4xl mx-auto space-y-12">
                       <div className="text-center">
                          <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 text-indigo-500">Zakazivanje Termina</h2>
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic leading-relaxed">
                            "Podaci dolaze direktno sa mog Google Calendar-a. Vidite samo slobodne termine za vaše čitanje."
                          </p>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                          <div className="space-y-8">
                             <div>
                                <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 block mb-4">1. Dan (Google Calendar Sync)</label>
                                <input 
                                  type="date" 
                                  value={bookingDate}
                                  onChange={(e) => setBookingDate(e.target.value)}
                                  className="w-full bg-black/40 border border-white/5 px-6 py-4 rounded-2xl text-white font-black outline-none"
                                />
                             </div>
                             <div>
                                <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 block mb-4">2. Vreme (Slobodni Slotovi)</label>
                                <div className="grid grid-cols-3 gap-3">
                                   {availableSlots.map(slot => (
                                     <button 
                                      key={slot} 
                                      onClick={() => setBookingTime(slot)}
                                      className={`py-3 rounded-xl text-[10px] font-black border transition-all ${bookingTime === slot ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl' : 'border-white/10 text-gray-400 hover:border-white/40'}`}
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
                          
                          <div className="flex flex-col justify-center space-y-6 bg-indigo-600/5 p-10 rounded-[3rem] border border-indigo-500/10">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center">
                                   <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"/></svg>
                                </div>
                                <div>
                                   <h4 className="text-sm font-black uppercase tracking-tight">Rezervacija</h4>
                                   <p className="text-[10px] font-bold text-gray-500">{bookingDate} @ {bookingTime || 'Izaberi vreme'}</p>
                                </div>
                             </div>
                             <p className="text-[10px] font-medium text-gray-400 leading-relaxed italic">
                                "Čim legne uplata, termin se blokira u mom kalendaru i dobijam obaveštenje da počnemo sa pripremama."
                             </p>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Tarot Section */}
                    <div className="bg-gray-900/40 rounded-[4rem] p-12 border border-white/5 space-y-8 flex flex-col justify-between">
                       <div>
                          <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">Tarot Uživo 🃏</h3>
                          <p className="text-[11px] font-medium text-gray-500 leading-relaxed mb-10 italic">"Gledate svako otvaranje uživo. Razgovaramo o vašim brigama i tražimo rešenja u kartama."</p>
                          
                          <div className="flex gap-4 p-2 bg-black/40 rounded-[2rem] border border-white/5 mb-10">
                             {[20, 30, 45].map(d => (
                               <button 
                                 key={d} 
                                 onClick={() => setTarotDuration(d as any)} 
                                 className={`flex-1 py-4 rounded-2xl text-[10px] font-black transition-all ${tarotDuration === d ? 'bg-white text-black shadow-xl' : 'text-gray-500 hover:text-white'}`}
                               >
                                 {d} MIN
                               </button>
                             ))}
                          </div>
                       </div>
                       
                       <div className="flex items-center justify-between pt-8 border-t border-white/5">
                          <div className="text-4xl font-black text-white tracking-tighter">€{tarotPrices[tarotDuration as keyof typeof tarotPrices]}</div>
                          <button 
                            onClick={() => handleBooking({id: 'p-tarot-session', name: 'Tarot Tumačenje Uživo'}, tarotPrices[tarotDuration as keyof typeof tarotPrices])}
                            className="bg-indigo-600 text-white px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-600/20"
                          >
                            Zakaži Odmah
                          </button>
                       </div>
                    </div>

                    {/* Natal/Synastry Section */}
                    <div className="bg-gray-900/40 rounded-[4rem] p-12 border border-white/5 space-y-10">
                       <h3 className="text-3xl font-black uppercase tracking-tighter">Astro Konsultacije ✨</h3>
                       
                       <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                             <input type="text" placeholder="Ime i Prezime" value={natalForm.name} onChange={e => setNatalForm({...natalForm, name: e.target.value})} className="col-span-2 bg-black/20 border border-white/5 px-6 py-4 rounded-2xl text-xs outline-none focus:border-indigo-500 transition-all" />
                             <input type="text" placeholder="Datum rođenja" value={natalForm.birthDate} onChange={e => setNatalForm({...natalForm, birthDate: e.target.value})} className="bg-black/20 border border-white/5 px-6 py-4 rounded-2xl text-xs outline-none focus:border-indigo-500 transition-all" />
                             <input type="text" placeholder="Tačno vreme rođenja" value={natalForm.birthTime} onChange={e => setNatalForm({...natalForm, birthTime: e.target.value})} className="bg-black/20 border border-white/5 px-6 py-4 rounded-2xl text-xs outline-none focus:border-indigo-500 transition-all" />
                             <input type="text" placeholder="Mesto rođenja" value={natalForm.birthPlace} onChange={e => setNatalForm({...natalForm, birthPlace: e.target.value})} className="col-span-2 bg-black/20 border border-white/5 px-6 py-4 rounded-2xl text-xs outline-none focus:border-indigo-500 transition-all" />
                             <input type="text" placeholder="Gde ste proveli zadnji rođendan?" value={natalForm.birthdayLocation} onChange={e => setNatalForm({...natalForm, birthdayLocation: e.target.value})} className="col-span-2 bg-black/20 border border-white/5 px-6 py-4 rounded-2xl text-xs outline-none focus:border-indigo-500 transition-all" />
                          </div>
                          <div className="pt-6 grid grid-cols-1 gap-4">
                             {consultations.map(p => (
                               <button 
                                 key={p.id}
                                 onClick={() => handleBooking(p)}
                                 className="w-full flex justify-between items-center bg-white/5 border border-white/5 p-6 rounded-3xl hover:bg-white/10 transition-all group"
                               >
                                  <div className="text-left">
                                     <div className="text-[10px] font-black uppercase text-gray-300 tracking-tight group-hover:text-white">{p.name}</div>
                                     <div className="text-[14px] font-black text-indigo-400 group-hover:text-indigo-300">€{p.price}</div>
                                  </div>
                                  <div className="bg-white text-black px-8 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest">Kupi</div>
                               </button>
                             ))}
                          </div>
                       </div>
                    </div>

                    {/* Audio Response Section */}
                    <div className="bg-gray-950/40 rounded-[4rem] p-12 border border-white/5 lg:col-span-2 space-y-8">
                       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                          <div className="flex-1">
                             <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">Audio Odgovor 🎙️</h3>
                             <p className="text-[11px] font-medium text-gray-500 leading-relaxed italic mb-8">
                               "Brza opcija za konkretna pitanja. Dobijate snimljen audio odgovor direktno u bakšis.net inbox."
                             </p>
                             <textarea 
                               placeholder="Upišite vaše pitanje ovde (npr. 'Da li je on prava osoba za mene?') + jedno gratis pitanje..."
                               value={audioQuestion}
                               onChange={e => setAudioQuestion(e.target.value)}
                               className="w-full bg-black/20 border border-white/5 px-8 py-6 rounded-[2rem] text-sm outline-none focus:border-indigo-500 h-32 resize-none"
                             />
                          </div>
                          <div className="w-full md:w-80 bg-white/5 p-10 rounded-[3rem] border border-white/5 flex flex-col justify-center text-center">
                             <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2">Cena Usluge</div>
                             <div className="text-5xl font-black text-white tracking-tighter mb-8">€{audioResp?.price}</div>
                             <button 
                              onClick={() => handleBooking(audioResp)}
                              className="w-full bg-white text-black py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl"
                             >
                               Pošalji Pitanje
                             </button>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slow-zoom { from { transform: scale(1); } to { transform: scale(1.1); } }
        .animate-slow-zoom { animation: slow-zoom 20s infinite alternate ease-in-out; }
      `}} />
    </div>
  );
};
