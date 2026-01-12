
import { EXALTED_VENUS, APP_FEE_PERCENTAGE } from '../constants';
// Fix: Use namespace import for react-router-dom to resolve missing exported member errors
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;

import React, { useEffect, useState } from 'react';

export const Feed: React.FC = () => {
  const [calcAmount, setCalcAmount] = useState<number>(1000);
  
  useEffect(() => {
    document.title = "bakšis.net | Prava zarada za kreatore";
    window.scrollTo(0, 0);
  }, []);

  const baksisProfit = calcAmount * 0.95;
  const competitorProfit = calcAmount * 0.80;
  const difference = baksisProfit - competitorProfit;

  return (
    <div className="bg-white w-full overflow-hidden">
      {/* Hero Section */}
      <section className="bg-gray-950 py-20 md:py-32 px-6 text-center relative overflow-hidden min-h-[70vh] flex items-center justify-center">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500 rounded-full blur-[120px]"></div>
           <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-500 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-5xl mx-auto space-y-10 relative z-10">
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 text-indigo-300 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md animate-fade-in">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
            Ekskluzivno za Balkan
          </div>
          
          <h1 className="text-4xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9] md:leading-[0.85]">
            NE DAJ <span className="text-indigo-500 underline decoration-indigo-800">SVOJE</span><br/>
            PROCENTE.
          </h1>
          
          <p className="text-gray-400 text-sm md:text-base font-medium max-w-xl mx-auto leading-relaxed px-4">
            Dok drugi uzimaju 20-30%, mi uzimamo samo <span className="text-white font-bold">{APP_FEE_PERCENTAGE}%</span>. 
            Bakšis ide direktno onome ko ga je zaslužio.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center pt-8 px-6">
            <Link to="/search" className="bg-indigo-600 text-white px-12 py-5 rounded-[2rem] font-black text-[12px] uppercase tracking-[0.2em] shadow-2xl shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all text-center">
              Istraži Kreatore
            </Link>
            <Link to="/studio" className="bg-white text-gray-950 px-12 py-5 rounded-[2rem] font-black text-[12px] uppercase tracking-[0.2em] hover:bg-gray-100 active:scale-95 transition-all text-center">
              Započni Zaradu
            </Link>
          </div>
        </div>
      </section>

      {/* Profit Calculator Section */}
      <section className="max-w-5xl mx-auto px-6 py-24">
         <div className="text-center mb-16">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 text-gray-900">Izračunaj svoju slobodu</h2>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Koliko gubiš na drugim platformama?</p>
         </div>

         <div className="bg-white rounded-[3rem] md:rounded-[4rem] p-8 md:p-16 shadow-2xl border border-gray-100 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8">
               <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-6">Tvoja mesečna prodaja (€)</label>
                  <input 
                    type="range" 
                    min="100" 
                    max="10000" 
                    step="100"
                    value={calcAmount}
                    onChange={(e) => setCalcAmount(Number(e.target.value))}
                    className="w-full h-3 bg-gray-100 rounded-full appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between mt-6 text-xl font-black text-gray-900">
                    <span className="text-gray-300">€100</span>
                    <span className="text-4xl text-indigo-600 tracking-tighter">€{calcAmount.toLocaleString()}</span>
                    <span className="text-gray-300">€10k+</span>
                  </div>
               </div>
               
               <div className="p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100">
                  <div className="text-[10px] font-black uppercase text-emerald-600 tracking-widest mb-2">Dodatna zarada kod nas</div>
                  <div className="text-4xl font-black text-emerald-700 tracking-tighter">+ €{difference.toLocaleString()}</div>
                  <p className="text-[9px] font-bold text-emerald-600 mt-2">Svakog meseca, samo zbog niže provizije.</p>
               </div>
            </div>

            <div className="space-y-6">
               <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Konkurencija (80%)</span>
                  <span className="text-lg font-black text-gray-400">€{competitorProfit.toLocaleString()}</span>
               </div>
               <div className="flex items-center justify-between p-8 bg-indigo-600 rounded-[2rem] shadow-xl shadow-indigo-200">
                  <span className="text-[10px] font-black uppercase text-white tracking-widest">bakšis.net (95%)</span>
                  <span className="text-2xl font-black text-white">€{baksisProfit.toLocaleString()}</span>
               </div>
            </div>
         </div>
      </section>

      {/* Featured Creator Section */}
      <section className="max-w-6xl mx-auto px-6 py-12 mb-20">
        <div className="flex justify-between items-end mb-12">
           <h2 className="text-4xl font-black uppercase tracking-tighter">Top<br/><span className="text-indigo-600">Kreatori</span></h2>
           <Link to="/search" className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b-2 border-gray-100 pb-1 hover:text-indigo-600 hover:border-indigo-600 transition-all">Vidi Sve</Link>
        </div>

        <div className="bg-white rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-2xl border border-gray-100 flex flex-col lg:flex-row min-h-[500px]">
          <div className="lg:w-1/2 h-80 lg:h-auto bg-gray-100 relative group">
            <img 
              src="https://images.unsplash.com/photo-1515940175183-6798529cb860?w=1200&q=80" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
              alt="Exalted Venus" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-10 left-10 text-white">
               <div className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">Aktuelni Favorit</div>
               <div className="text-2xl font-black uppercase tracking-tight">{EXALTED_VENUS.displayName}</div>
            </div>
          </div>
          <div className="lg:w-1/2 p-12 md:p-20 flex flex-col justify-center bg-white">
            <p className="text-gray-500 text-lg md:text-xl font-medium italic mb-12 leading-relaxed">
              "Konačno platforma koja razume Balkan. Isplate na Payoneer bez suvišnih pitanja i provizija koja mi dozvoljava da reinvestiram u svoju opremu."
            </p>
            <div className="space-y-4">
               {/* POPRAVLJEN LINK */}
               <Link to={`/profile/${EXALTED_VENUS.username}`} className="w-full bg-gray-950 text-white py-6 rounded-[2rem] text-center text-[12px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-600 active:scale-95 transition-all inline-block">
                 Poseti Riznicu
               </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="h-32"></div>
    </div>
  );
};
