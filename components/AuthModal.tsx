
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EXALTED_VENUS } from '../constants';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
}

export const AuthModal = ({ isOpen, onClose, onSuccess }: AuthModalProps) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('REGISTER');
  const [role, setRole] = useState<'CREATOR' | 'FOLLOWER'>('FOLLOWER');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGoogleAuth = () => {
    setIsLoading(true);
    // Simulacija zvaničnog Google OAuth flow-a
    setTimeout(() => {
      const userData = {
        email: role === 'CREATOR' ? 'jecaman86@gmail.com' : 'korisnik@gmail.com',
        displayName: role === 'CREATOR' ? 'Exalted Venus Tarot' : 'Marko J.',
        role: role,
        googleId: 'google_12345'
      };
      
      localStorage.setItem('baksis_logged_in', 'true');
      localStorage.setItem('baksis_user_role', role);
      localStorage.setItem('baksis_user_data', JSON.stringify(userData));
      
      setIsLoading(false);
      onSuccess(userData);
      onClose();
      
      if (role === 'CREATOR') {
        navigate('/studio');
      } else {
        navigate('/');
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-gray-950/90 backdrop-blur-xl">
      <div className="bg-white rounded-[3.5rem] w-full max-w-md p-12 shadow-2xl border border-white/10 relative overflow-hidden">
        {/* Dekorativni elementi */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>
        
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-300 hover:text-gray-950 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="text-center mb-12 relative z-10">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-gray-900 mb-2">
            {mode === 'REGISTER' ? 'Pridruži se' : 'Dobrodošli nazad'}
          </h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            {role === 'CREATOR' ? 'Poveži svoj YT Studio i počni sa zaradom' : 'Podrži omiljene kreatore na Balkanu'}
          </p>
        </div>

        <div className="space-y-8 relative z-10">
          {mode === 'REGISTER' && (
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
          )}

          <div className="space-y-4">
            <button
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-4 bg-white border-2 border-gray-100 text-gray-900 py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:border-indigo-600 transition-all shadow-sm group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_HiRes_Logo.png" className="w-5 h-5 object-contain" alt="" />
                  <span>Nastavi putem Google-a</span>
                </>
              )}
            </button>
            
            <div className="flex items-center gap-4 py-2">
              <div className="h-px flex-1 bg-gray-100"></div>
              <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">ili emailom</span>
              <div className="h-px flex-1 bg-gray-100"></div>
            </div>

            <input
              type="email"
              placeholder="Email adresa"
              className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl px-6 py-4 text-sm font-bold outline-none text-gray-900 transition-all"
            />
          </div>

          <button
            disabled={isLoading}
            className="w-full bg-gray-950 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl hover:bg-indigo-600 transition-all disabled:opacity-50"
          >
            {mode === 'REGISTER' ? 'Registruj se' : 'Prijavi se'}
          </button>

          <div className="text-center pt-4">
            <button 
              onClick={() => setMode(mode === 'REGISTER' ? 'LOGIN' : 'REGISTER')}
              className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              {mode === 'REGISTER' ? 'Već imaš nalog? Prijavi se' : 'Nemaš nalog? Kreiraj profil'}
            </button>
          </div>
        </div>
        
        <div className="mt-12 text-center text-[8px] font-bold text-gray-300 uppercase tracking-widest leading-relaxed px-4">
          Prijavom na Bakšis.net prihvatate uslove korišćenja i omogućavate pristup YouTube i Calendar podacima ukoliko ste kreator.
        </div>
      </div>
    </div>
  );
};
