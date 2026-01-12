
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
    
    // Koristimo standardnije verzije scope-ova koje su lakše za pronalaženje u listi
    const scopes = role === 'CREATOR' 
      ? 'openid email profile https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/calendar.readonly' 
      : 'openid email profile';

    try {
      // Čuvamo ulogu u localStorage pre nego što nas Google redirektuje
      localStorage.setItem('baksis_user_role', role);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          scopes: scopes,
          redirectTo: window.location.origin + '/studio'
        }
      });

      if (error) {
        if (error.message.includes("provider is not enabled")) {
          alert("Greška: Google Auth nije omogućen u Supabase dashboard-u (Authentication -> Providers).");
        } else {
          throw error;
        }
      }
    } catch (error: any) {
      console.error('OAuth Error:', error.message);
      alert(`Greška pri prijavi: ${error.message}`);
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
            Odaberi svoju ulogu na bakšis.net
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

          <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
             <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 leading-relaxed text-center">
               {role === 'CREATOR' 
                ? "🚀 KAO KREATOR: Povezaćemo tvoj YouTube kanal i kalendar kako bi automatizovali prodaju i zakazivanje." 
                : "Uživaj u sadržaju i podrži omiljene kreatore direktno bez velikih provizija."}
             </p>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-4 bg-gray-900 text-white py-6 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_HiRes_Logo.png" className="w-5 h-5 object-contain invert" alt="" />
                <span>Poveži se sa Google-om</span>
              </>
            )}
          </button>
        </div>
        
        <div className="mt-12 text-center text-[8px] font-bold text-gray-300 uppercase tracking-widest leading-relaxed">
          Google OAuth 2.0 integracija. Vaši podaci su sigurni.
        </div>
      </div>
    </div>
  );
};
