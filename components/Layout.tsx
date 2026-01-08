
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { AuthModal } from './AuthModal';
import { MOCK_FOLLOWER, EXALTED_VENUS } from '../constants';
import { supabase } from '../supabaseClient';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    // 1. Provera trenutne sesije prilikom učitavanja
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        updateLocalAuthState(session);
      }
    };

    // 2. Slušanje promena u auth stanju (login/logout/token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        updateLocalAuthState(session);
      } else {
        clearLocalAuthState();
      }
    });

    checkUser();
    return () => subscription.unsubscribe();
  }, [location]);

  const updateLocalAuthState = (session: any) => {
    setIsLoggedIn(true);
    // U realnoj aplikaciji, role bi vukli iz 'profiles' tabele u Supabase
    // Za demo, pretpostavljamo da je kreator ako ima specifične dozvole u sesiji
    const isCreator = session.user?.app_metadata?.role === 'CREATOR' || localStorage.getItem('baksis_user_role') === 'CREATOR';
    const role = isCreator ? 'CREATOR' : 'FOLLOWER';
    
    setUserRole(role);
    localStorage.setItem('baksis_logged_in', 'true');
    localStorage.setItem('baksis_user_role', role);
    localStorage.setItem('baksis_user_data', JSON.stringify(session.user));
  };

  const clearLocalAuthState = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    localStorage.removeItem('baksis_logged_in');
    localStorage.removeItem('baksis_user_role');
    localStorage.removeItem('baksis_user_data');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfdfe]">
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={() => {}} // Sesijom upravlja onAuthStateChange
      />

      <header className="fixed top-0 left-0 right-0 z-[100] bg-white/90 backdrop-blur-xl border-b border-gray-100 h-16 flex items-center shadow-sm">
        <div className="max-w-6xl mx-auto px-6 w-full flex items-center justify-between">
          <Link to="/" className="text-xl font-black tracking-tighter text-indigo-600 flex items-center gap-1">
            <span className="bg-indigo-600 text-white px-2 py-0.5 rounded-lg font-black">B</span>
            bakšis<span className="text-gray-900">.net</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/search" className={({ isActive }) => `text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-900'}`}>Istraži</NavLink>
            <NavLink to="/studio" className={({ isActive }) => `text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-900'}`}>Studio</NavLink>
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <Link to={userRole === 'CREATOR' ? '/studio' : `/profile/marko`} className="w-9 h-9 rounded-xl overflow-hidden border-2 border-indigo-50 shadow-sm hover:border-indigo-600 transition-all">
                   <img src={MOCK_FOLLOWER.avatar} className="w-full h-full object-cover" alt="Profile" />
                </Link>
                <button onClick={handleLogout} className="text-[9px] font-black uppercase tracking-[0.2em] text-red-400 hover:text-red-600">Izlaz</button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button onClick={() => setIsAuthModalOpen(true)} className="bg-gray-950 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-indigo-600 transition-all">
                  Prijavi se
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow pt-16 relative w-full">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-xl border-t border-gray-100 lg:hidden h-20 shadow-[0_-8px_30px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center h-full px-4 max-w-lg mx-auto">
          <NavLink to="/" className={({ isActive }) => `flex flex-col items-center gap-1.5 w-1/5 transition-all ${isActive ? 'text-indigo-600 scale-110' : 'text-gray-300'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            <span className="text-[7px] uppercase font-black tracking-[0.2em]">Home</span>
          </NavLink>
          <NavLink to="/search" className={({ isActive }) => `flex flex-col items-center gap-1.5 w-1/5 transition-all ${isActive ? 'text-indigo-600 scale-110' : 'text-gray-300'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <span className="text-[7px] uppercase font-black tracking-[0.2em]">Istraži</span>
          </NavLink>
          <NavLink to="/studio" className={({ isActive }) => `flex flex-col items-center gap-1.5 w-1/5 transition-all ${isActive ? 'text-indigo-600 scale-110' : 'text-gray-300'}`}>
            <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 shadow-inner">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
            </div>
            <span className="text-[7px] uppercase font-black tracking-[0.2em]">Studio</span>
          </NavLink>
          <NavLink to="/chat" className={({ isActive }) => `flex flex-col items-center gap-1.5 w-1/5 transition-all ${isActive ? 'text-indigo-600 scale-110' : 'text-gray-300'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            <span className="text-[7px] uppercase font-black tracking-[0.2em]">Čet</span>
          </NavLink>
          <NavLink 
            to={isLoggedIn ? (userRole === 'CREATOR' ? '/studio' : `/profile/marko`) : `/profile/exalted-venus`} 
            className={({ isActive }) => `flex flex-col items-center gap-1.5 w-1/5 transition-all ${isActive ? 'text-indigo-600 scale-110' : 'text-gray-300'}`}
          >
            {({ isActive }) => (
              <>
                <div className={`w-7 h-7 rounded-xl overflow-hidden border-2 transition-all ${isActive ? 'border-indigo-600' : 'border-gray-100'}`}>
                    <img src={isLoggedIn ? MOCK_FOLLOWER.avatar : EXALTED_VENUS.avatar} className="w-full h-full object-cover" alt="User" />
                </div>
                <span className="text-[7px] uppercase font-black tracking-[0.2em]">Profil</span>
              </>
            )}
          </NavLink>
        </div>
      </nav>
    </div>
  );
};
