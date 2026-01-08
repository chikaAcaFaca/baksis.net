
import React, { useState } from 'react';
import { MOCK_TRANSACTIONS, OPERATOR_NAME, ALL_USERS, AI_COST_PER_MINUTE } from '../constants';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'FINANCE' | 'USERS' | 'CREATORS' | 'SYSTEM'>('FINANCE');
  const [searchTerm, setSearchTerm] = useState('');

  const totalVolume = MOCK_TRANSACTIONS.reduce((acc, tx) => acc + tx.amount, 0);
  const totalFees = MOCK_TRANSACTIONS.reduce((acc, tx) => acc + tx.fee, 0);
  
  // Kalkulacija AI troškova na osnovu svih korisnika (simulacija)
  const totalMinutesProcessed = ALL_USERS.reduce((acc, u) => acc + (u.stats.growthMinutesUsed || 0), 0);
  const totalAiCost = totalMinutesProcessed * AI_COST_PER_MINUTE;

  const filteredUsers = ALL_USERS.filter(u => 
    u.displayName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#f8f9fb] min-h-screen pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">Admin Panel</h1>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">{OPERATOR_NAME} • Nadzor Platforme</p>
        </div>
        
        <div className="flex bg-white p-1.5 rounded-2xl shadow-xl border border-gray-100 overflow-x-auto max-w-full">
           {(['FINANCE', 'USERS', 'CREATORS', 'SYSTEM'] as const).map(tab => (
             <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-gray-950 text-white shadow-lg' : 'text-gray-400 hover:text-gray-950'}`}
             >
               {tab === 'FINANCE' ? 'Finansije' : tab === 'USERS' ? 'Korisnici' : tab === 'CREATORS' ? 'Kreatori' : 'Sistem'}
             </button>
           ))}
        </div>
      </div>

      {activeTab === 'FINANCE' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl">
              <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-4">Ukupan Promet</h3>
              <div className="text-4xl font-black text-gray-900 tracking-tighter">€{totalVolume.toFixed(2)}</div>
            </div>
            <div className="bg-gray-950 p-10 rounded-[3rem] shadow-2xl text-white">
              <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4">Zarada nknet (5%)</h3>
              <div className="text-4xl font-black tracking-tighter text-indigo-400">€{totalFees.toFixed(2)}</div>
            </div>
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full -mr-16 -mt-16 blur-2xl"></div>
               <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-4">AI Operativni Trošak</h3>
               <div className="text-4xl font-black text-red-500 tracking-tighter">${totalAiCost.toFixed(4)}</div>
               <p className="text-[8px] font-bold text-gray-300 mt-4 uppercase">Na osnovu {totalMinutesProcessed} minuta analize</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'USERS' && (
        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden">
          <div className="p-10 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="font-black text-sm uppercase tracking-widest text-gray-900">Svi Korisnici</h2>
            <input 
              type="text" 
              placeholder="Pretraži..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-xs font-bold w-full md:w-64"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                  <th className="px-10 py-4">Korisnik</th>
                  <th className="px-10 py-4">Uloga</th>
                  <th className="px-10 py-4">AI Minute</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-10 py-6 flex items-center gap-4">
                       <img src={user.avatar} className="w-10 h-10 rounded-xl object-cover" alt="" />
                       <div>
                          <div className="font-black text-gray-900 uppercase tracking-tight">{user.displayName}</div>
                          <div className="text-[10px] text-gray-400 uppercase">@{user.username}</div>
                       </div>
                    </td>
                    <td className="px-10 py-6">
                       <span className="px-4 py-1.5 rounded-full font-black uppercase text-[8px] tracking-widest bg-gray-100 text-gray-600">
                         {user.role}
                       </span>
                    </td>
                    <td className="px-10 py-6 font-black text-gray-900">
                      {user.stats.growthMinutesUsed} / 100
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'SYSTEM' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-xl">
              <h3 className="font-black text-xs uppercase mb-8 tracking-widest text-gray-400">Model: Gemini 3 Flash</h3>
              <div className="space-y-4">
                 <div className="flex justify-between text-[10px] font-black uppercase">
                    <span>Input Tokeni ($0.075 / 1M)</span>
                    <span className="text-emerald-500">AKTIVNO</span>
                 </div>
                 <div className="flex justify-between text-[10px] font-black uppercase">
                    <span>Prosečan Trošak / Minuti</span>
                    <span className="text-indigo-600">${AI_COST_PER_MINUTE}</span>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
