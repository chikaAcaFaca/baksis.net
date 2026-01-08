
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

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // Definišemo dozvole koje su nam potrebne od Google-a
      // Za kreatore tražimo pristup YouTube-u i Kalendaru
      const scopes = role === 'CREATOR' 
        ? 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/calendar.events.readonly' 
        : 'email profile';

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          scopes: scopes,
          redirectTo: window.location.origin
        }
      });

      if (error) throw error;
      
      // Napomena: Supabase će redirektovati korisnika na Google.
      // Nakon povratka, sesija će biti automatski uhvaćena u Layout.tsx
    } catch (error: any) {
      console.error('Greška pri prijavi:', error.message);
      alert('Došlo je do greške pri povezivanju sa Google-om.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-gray-950/90 backdrop-blur-xl">
      <div className="bg-white rounded-[3.5rem] w-full max-w-md p-12 shadow-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>
        
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-300 hover:text-gray-950 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="text-center mb-10 relative z-10">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-gray-900 mb-2">Prijavi se</h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Pristupi bakšis.net platformi putem svog Google naloga
          </p>
        </div>

        <div className="space-y-8 relative z-10">
          <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
            <button
              onClick={() => setRole('FOLLOWER')}
              className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${role === 'FOLLOWER' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >Pratilac</button>
            <button
              onClick={() => setRole('CREATOR')}
              className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${role === 'CREATOR' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >Kreator</button>
          </div>

          <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
            <p className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest leading-relaxed text-center">
              {role === 'CREATOR' 
                ? "💡 KREATOR MODE: Prijavom ćete povezati svoj YouTube kanal i Google kalendar direktno sa bakšis.net profilom." 
                : "Uživaj u ekskluzivnom sadržaju i podrži omiljene kreatore direktno."}
            </p>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-4 bg-gray-900 text-white py-6 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl group disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_HiRes_Logo.png" className="w-5 h-5 object-contain invert" alt="" />
                <span>Nastavi sa Google nalogom</span>
              </>
            )}
          </button>
        </div>
        
        <div className="mt-12 text-center text-[8px] font-bold text-gray-300 uppercase tracking-widest leading-relaxed">
          Zvanična Google OAuth integracija. Vaši podaci su sigurni i procesuirani u skladu sa Google API pravilima.
        </div>
      </div>
    </div>
  );
};
