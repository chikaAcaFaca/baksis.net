
import React, { useState, useEffect } from 'react';
// Fix: Use namespace import for react-router-dom to resolve missing exported member errors
import * as ReactRouterDOM from 'react-router-dom';
const { NavLink, useLocation, Link } = ReactRouterDOM as any;

import { AuthModal } from './AuthModal';
import { MOCK_FOLLOWER, EXALTED_VENUS } from '../constants';
import { supabase } from '../supabaseClient';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Provera sesije i slušanje promena
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) handleSession(session);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        handleSession(session);
      } else {
        clearAuth();
      }
    });

    getSession();
    return () => subscription.unsubscribe();
  }, [location]);

  const handleSession = (session: any) => {
    setIsLoggedIn(true);
    setUser(session.user);
    
    // Uloga se može čuvati u user_metadata prilikom OAuth prijave
    // ili se može setovati ručno u Supabase dashboardu
    const role = localStorage.getItem('baksis_user_role') || 'FOLLOWER';
    setUserRole(role);
    
    localStorage.setItem('baksis_logged_in', 'true');
    localStorage.setItem('baksis_user_data', JSON.stringify(session.user));
  };

  const clearAuth = () => {
    setIsLoggedIn(false);
    setUser(null);
    setUserRole(null);
    localStorage.removeItem('baksis_logged_in');
    localStorage.removeItem('baksis_user_role');
    localStorage.removeItem('baksis_user_data');
    localStorage.removeItem('yt_studio_connected');
    localStorage.removeItem('google_cal_connected');
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
        onSuccess={() => {}} 
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
              <div className="flex items-center gap-6">
                <div className="hidden md:block text-right">
                  <div className="text-[9px] font-black uppercase tracking-widest text-gray-400">{userRole === 'CREATOR' ? 'Kreator' : 'Pratilac'}</div>
                  <div className="text-[10px] font-black text-gray-900 uppercase">{user?.user_metadata?.full_name || user?.email}</div>
                </div>
                <div className="flex items-center gap-4">
                  <Link to={userRole === 'CREATOR' ? '/studio' : '/'} className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-indigo-50 shadow-sm hover:border-indigo-600 transition-all">
                     <img src={user?.user_metadata?.avatar_url || MOCK_FOLLOWER.avatar} className="w-full h-full object-cover" alt="Profile" />
                  </Link>
                  <button onClick={handleLogout} className="text-gray-300 hover:text-red-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setIsAuthModalOpen(true)} className="bg-gray-950 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-indigo-600 transition-all">
                Prijavi se
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow pt-16 relative w-full">
        {children}
      </main>
      
      {/* Mobile Nav remains mostly same but uses dynamic profile link */}
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
          <Link 
            to={isLoggedIn ? (userRole === 'CREATOR' ? '/studio' : `/profile/marko`) : `/profile/exalted-venus`} 
            className={`flex flex-col items-center gap-1.5 w-1/5 transition-all ${location.pathname.includes('profile') ? 'text-indigo-600' : 'text-gray-300'}`}
          >
            <div className={`w-7 h-7 rounded-xl overflow-hidden border-2 transition-all ${location.pathname.includes('profile') ? 'border-indigo-600' : 'border-gray-100'}`}>
                <img src={user?.user_metadata?.avatar_url || EXALTED_VENUS.avatar} className="w-full h-full object-cover" alt="User" />
            </div>
            <span className="text-[7px] uppercase font-black tracking-[0.2em]">Profil</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};
