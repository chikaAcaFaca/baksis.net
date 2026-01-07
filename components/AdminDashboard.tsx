
import React, { useState } from 'react';
import { MOCK_TRANSACTIONS, OPERATOR_NAME, ALL_USERS } from '../constants';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'FINANCE' | 'USERS' | 'CREATORS' | 'RAFFLES'>('FINANCE');
  const [searchTerm, setSearchTerm] = useState('');

  const totalVolume = MOCK_TRANSACTIONS.reduce((acc, tx) => acc + tx.amount, 0);
  const totalFees = MOCK_TRANSACTIONS.reduce((acc, tx) => acc + tx.fee, 0);
  
  const filteredUsers = ALL_USERS.filter(u => 
    u.displayName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const creatorsOnly = ALL_USERS.filter(u => 
    u.role === 'CREATOR' && (
      u.displayName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#f8f9fb] min-h-screen pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">Admin Panel</h1>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">{OPERATOR_NAME} • Nadzor Platforme</p>
        </div>
        
        <div className="flex bg-white p-1.5 rounded-2xl shadow-xl border border-gray-100 overflow-x-auto max-w-full">
           {(['FINANCE', 'USERS', 'CREATORS', 'RAFFLES'] as const).map(tab => (
             <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 md:px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-gray-950 text-white shadow-lg' : 'text-gray-400 hover:text-gray-950'}`}
             >
               {tab === 'FINANCE' ? 'Finansije' : tab === 'USERS' ? 'Korisnici' : tab === 'CREATORS' ? 'Kreatori' : 'Tombole'}
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
              <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4">Zarada nknet</h3>
              <div className="text-4xl font-black tracking-tighter text-indigo-400">€{totalFees.toFixed(2)}</div>
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
                  <th className="px-10 py-4">Ime / Username</th>
                  <th className="px-10 py-4">Uloga</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-10 py-6 flex items-center gap-4">
                       <img src={user.avatar} className="w-10 h-10 rounded-xl object-cover border border-gray-100 shadow-sm" alt="" />
                       <div>
                          <div className="font-black text-gray-900 uppercase tracking-tight">{user.displayName}</div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">@{user.username}</div>
                       </div>
                    </td>
                    <td className="px-10 py-6">
                       <span className={`px-4 py-1.5 rounded-full font-black uppercase text-[8px] tracking-widest ${user.role === 'CREATOR' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
                         {user.role}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'CREATORS' && (
        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden">
          <div className="p-10 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="font-black text-sm uppercase tracking-widest text-gray-900">Registrovani Kreatori</h2>
            <input 
              type="text" 
              placeholder="Pretraži kreatore..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-xs font-bold w-full md:w-64"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                  <th className="px-10 py-4">Kreator</th>
                  <th className="px-10 py-4">Username</th>
                  <th className="px-10 py-4">Uloga</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {creatorsOnly.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-10 py-6 flex items-center gap-4">
                       <img src={user.avatar} className="w-10 h-10 rounded-xl object-cover border border-gray-100 shadow-sm" alt="" />
                       <div className="font-black text-gray-900 uppercase tracking-tight">{user.displayName}</div>
                    </td>
                    <td className="px-10 py-6">
                       <div className="text-[10px] text-indigo-600 font-black uppercase tracking-widest">@{user.username}</div>
                    </td>
                    <td className="px-10 py-6">
                       <span className="bg-indigo-600 text-white px-4 py-1.5 rounded-full font-black uppercase text-[8px] tracking-widest shadow-sm">
                         {user.role}
                       </span>
                    </td>
                  </tr>
                ))}
                {creatorsOnly.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-10 py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                      Nema pronađenih kreatora.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'RAFFLES' && (
        <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-xl text-center">
          <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Trenutno nema aktivnih tombola za pregled.</p>
        </div>
      )}
    </div>
  );
};
