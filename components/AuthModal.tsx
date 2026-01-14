
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
    
    // Čuvamo ulogu lokalno pre nego što odemo na Google
    localStorage.setItem('baksis_user_role', role);

    try {
      const currentOrigin = window.location.origin;
      const redirectTo = `${currentOrigin}/studio`;
      
      console.log("🚀 Pokretanje Google prijave...");
      console.log("📍 Redirect URL koji šaljemo:", redirectTo);
      console.info("💡 Napomena: Ovaj URL mora biti u 'Redirect URLs' listi u Supabase Auth postavkama.");

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
      console.error('Google Auth Error:', error.message);
      setErrorMessage(`Greška: ${error.message}. Proverite konzolu browsera za detalje.`);
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
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Poveži svoj Google nalog</p>
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
            <div className="bg-red-50 border border-red-100 p-4 rounded-2xl">
               <p className="text-[10px] font-black uppercase tracking-tight text-red-600 leading-relaxed text-center">
                 {errorMessage}
               </p>
            </div>
          )}

          <div className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-2xl mb-4">
             <p className="text-[9px] font-black uppercase text-emerald-700 leading-tight">
               💡 VAŽNO: Bićete preusmereni na Google. Ako ste Kreator, odobrite YouTube i Calendar dozvole.
             </p>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-4 py-6 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-xl ${role === 'CREATOR' ? 'bg-indigo-600 text-white' : 'bg-gray-950 text-white'}`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_HiRes_Logo.png" className="w-5 h-5 object-contain invert" alt="" />
                <span>Nastavi kao {role === 'CREATOR' ? 'Kreator' : 'Pratilac'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
