
import React, { useState, useEffect } from 'react';
import { MOCK_CREATORS } from '../constants';
// Fix: Use namespace import for react-router-dom to resolve missing exported member errors
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;

export const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Svi');

  useEffect(() => {
    document.title = "Istraži | bakšis.net";
  }, []);

  const categories = ['Svi', 'Astrologija', 'Fitnes', 'Edukacija', 'Art', 'Biznis'];

  const filteredCreators = MOCK_CREATORS.filter(creator => {
    const matchesSearch = creator.displayName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#fcfdfe] pb-40">
      
      {/* Search Hero Area */}
      <div className="bg-gray-950 pt-20 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
           <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
             PRONAĐI SVOJU<br/><span className="text-indigo-50">INSPIRACIJU.</span>
           </h1>
           
           <div className="relative group max-w-2xl mx-auto">
             <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-[2.5rem] blur opacity-25 group-focus-within:opacity-100 transition duration-500"></div>
             <input 
              type="text" 
              placeholder="Pretraži po imenu ili veštini..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border-none rounded-[2rem] px-8 py-6 text-sm font-bold shadow-2xl focus:ring-0 relative z-10 text-gray-900 placeholder:text-gray-300"
             />
             <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 text-indigo-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             </div>
           </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-10 relative z-20">
        
        {/* Categories Scroller */}
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-8 px-2">
           {categories.map(cat => (
             <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-10 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest whitespace-nowrap shadow-xl transition-all ${activeCategory === cat ? 'bg-indigo-600 text-white translate-y-[-4px]' : 'bg-white text-gray-400 hover:text-gray-900'}`}
             >
               {cat}
             </button>
           ))}
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCreators.map(creator => (
            <Link 
              key={creator.id} 
              to={`/profile/${creator.username}`} 
              className="bg-white rounded-[3rem] p-8 shadow-xl border border-gray-100 group hover:shadow-2xl hover:border-indigo-100 transition-all duration-500 flex flex-col items-center text-center"
            >
              <div className="relative mb-6">
                <div className="absolute -inset-2 bg-gradient-to-tr from-indigo-500 to-emerald-500 rounded-[2rem] opacity-0 group-hover:opacity-20 transition-opacity"></div>
                <img src={creator.avatar} className="w-28 h-28 rounded-[2rem] object-cover shadow-lg border-4 border-white relative z-10" alt="" />
                {creator.isVerified && (
                  <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-1.5 rounded-xl border-4 border-white shadow-lg z-20">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.25.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
                  </div>
                )}
              </div>
              
              <h3 className="font-black text-lg text-gray-900 uppercase tracking-tight mb-1 group-hover:text-indigo-600 transition-colors">{creator.displayName}</h3>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-6">@{creator.username}</p>
              
              <p className="text-xs text-gray-500 font-medium leading-relaxed mb-8 line-clamp-2 italic px-4">
                "{creator.bio}"
              </p>

              <div className="flex gap-4 w-full">
                 <div className="flex-1 bg-gray-50 rounded-2xl py-3 border border-gray-100">
                    <div className="text-[10px] font-black uppercase text-gray-400 mb-0.5 tracking-widest">Pratioci</div>
                    <div className="text-sm font-black text-gray-900">{creator.stats.followersCount.toLocaleString()}</div>
                 </div>
                 <div className="flex-1 bg-gray-50 rounded-2xl py-3 border border-gray-100">
                    <div className="text-[10px] font-black uppercase text-gray-400 mb-0.5 tracking-widest">Usluge</div>
                    <div className="text-sm font-black text-indigo-600">5</div>
                 </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredCreators.length === 0 && (
          <div className="text-center py-24">
             <div className="text-6xl mb-6 opacity-20">🔍</div>
             <p className="text-gray-400 font-black uppercase tracking-widest">Nema rezultata. Pokušaj drugu reč!</p>
          </div>
        )}
      </div>
    </div>
  );
};
