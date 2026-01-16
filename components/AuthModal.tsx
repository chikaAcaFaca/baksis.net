
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
}

export const AuthModal = ({ isOpen, onClose, onSuccess }: AuthModalProps) => {
  const [role, setRole] = useState<'CREATOR' | 'FOLLOWER'>('FOLLOWER');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    
    // Čuvamo ulogu lokalno
    localStorage.setItem('baksis_user_role', role);

    try {
      // Dobijamo trenutni origin (npr. https://baksis-net.vercel.app)
      let currentOrigin = window.location.origin;
      
      // FIX: Ako smo na localhostu ili čudnom okruženju, osiguravamo da imamo pun protokol
      if (!currentOrigin.startsWith('http')) {
        currentOrigin = `https://${currentOrigin}`;
      }

      // Supabase zahteva puni, apsolutni URL koji je na beloj listi u Dashboard-u
      const redirectTo = `${currentOrigin}/studio`;
      
      console.log("🚀 Auth Inicijalizacija...");
      console.log("📍 Site Origin:", currentOrigin);
      console.log("🔄 Redirecting to (must be in Supabase whitelist):", redirectTo);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) throw error;
      
    } catch (error: any) {
      console.error('Auth Error Details:', error);
      
      let friendlyMessage = error.message;
      if (error.message.includes('redirect_uri_mismatch')) {
        friendlyMessage = "Greška u Google Konzoli: Dodaj callback URL u 'Authorized Redirect URIs'.";
      } else if (error.message.includes('invalid_request')) {
        friendlyMessage = "Putanja nije validna. Proveri 'Site URL' u Supabase Auth podešavanjima.";
      }

      setErrorMessage(friendlyMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-gray-950/90 backdrop-blur-xl">
      <div className="bg-white rounded-[3.5rem] w-full max-w-md p-12 shadow-2xl border border-white/10 relative overflow-hidden">
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-300 hover:text-gray-950 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="text-center mb-10">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-gray-900 mb-2">Prijavi se</h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Izaberi svoj put do zarade</p>
        </div>

        <div className="space-y-8">
          <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
            <button
              onClick={() => { setRole('FOLLOWER'); setErrorMessage(null); }}
              className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${role === 'FOLLOWER' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >Pratilac</button>
            <button
              onClick={() => { setRole('CREATOR'); setErrorMessage(null); }}
              className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${role === 'CREATOR' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >Kreator</button>
          </div>

          {errorMessage && (
            <div className="bg-red-50 border-2 border-red-200 p-6 rounded-3xl animate-shake">
               <div className="flex gap-3 mb-2">
                 <span className="text-xl">⚠️</span>
                 <p className="text-[11px] font-black uppercase text-red-700">Auth Konfiguracija</p>
               </div>
               <p className="text-[10px] font-bold text-red-600 leading-relaxed italic">
                 {errorMessage}
               </p>
               <p className="text-[8px] mt-4 font-black text-gray-400 uppercase">Proveri Site URL u Supabase Dashboardu!</p>
            </div>
          )}

          {!errorMessage && (
            <div className="bg-indigo-50/50 border border-indigo-100 p-6 rounded-2xl mb-4">
               <p className="text-[9px] font-black uppercase text-indigo-700 leading-tight">
                 {role === 'CREATOR' 
                   ? '🚀 KAO KREATOR: Dobijaš pristup Studiju, AI klipovima i direktnim isplatama na Payoneer.' 
                   : '💖 KAO PRATILAC: Možeš podržati omiljene kreatore i otključati ekskluzivni sadržaj.'}
               </p>
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-4 py-6 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-xl ${role === 'CREATOR' ? 'bg-indigo-600 text-white' : 'bg-gray-950 text-white hover:bg-indigo-600 active:scale-95 disabled:opacity-50'}`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_HiRes_Logo.png" className="w-5 h-5 object-contain invert" alt="" />
                <span>Nastavi sa Google-om</span>
              </>
            )}
          </button>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}} />
    </div>
  );
};
