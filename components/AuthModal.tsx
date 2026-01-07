
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { slugify } from '../constants';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'CREATOR' | 'FOLLOWER'>('FOLLOWER');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string; isDbError?: boolean } | null>(null);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const baseUsername = slugify(email.split('@')[0]);
      const uniqueSuffix = Math.random().toString(36).substring(2, 6);
      const uniqueUsername = `${baseUsername}_${uniqueSuffix}`;

      // Supabase Auth SignUp sa metapodacima
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password: `BaksisSecret123!${uniqueSuffix}`,
        options: {
          data: {
            username: uniqueUsername,
            full_name: email.split('@')[0],
            display_name: email.split('@')[0],
            role: role,
            phone_number: phone,
            avatar_url: `https://i.pravatar.cc/150?u=${uniqueUsername}`,
            is_verified: false
          }
        }
      });

      if (authError) {
        // Specifična provera za grešku baze podataka
        const isDbError = authError.message.toLowerCase().includes('database error') || 
                          authError.message.toLowerCase().includes('saving new user');
        
        setError({ 
          message: isDbError 
            ? "Greška u bazi: Verovatno nedostaje trigger ili 'profiles' tabela. Proveri SQL Editor u Supabase-u." 
            : authError.message,
          isDbError 
        });
        setIsLoading(false);
        return;
      }

      if (data.user) {
        onSuccess({ email, phone, role });
        if (role === 'CREATOR') {
          navigate('/studio');
        }
      }
    } catch (err: any) {
      setError({ message: "Neočekivana sistemska greška. Pokušajte ponovo." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-lg">
      <div className="bg-white rounded-[3rem] w-full max-w-md p-10 md:p-14 shadow-2xl border border-gray-100 relative">
        <button 
          onClick={onClose} 
          className="absolute top-8 right-8 text-gray-300 hover:text-gray-950 transition-colors text-xl font-bold"
        >
          ✕
        </button>

        <div className="text-center mb-10">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-gray-900 mb-2">Pridruži se</h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Izaberi svoju ulogu na platformi</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100 mb-8">
            <button
              type="button"
              onClick={() => setRole('FOLLOWER')}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${role === 'FOLLOWER' ? 'bg-white text-indigo-600 shadow-sm border border-gray-100' : 'text-gray-400'}`}
            >
              Pratilac
            </button>
            <button
              type="button"
              onClick={() => setRole('CREATOR')}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${role === 'CREATOR' ? 'bg-white text-indigo-600 shadow-sm border border-gray-100' : 'text-gray-400'}`}
            >
              Kreator
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 block ml-2">Email Adresa</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ime@primer.com"
                className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl px-6 py-4 text-sm font-bold transition-all outline-none"
              />
            </div>

            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 block ml-2">Broj Telefona</label>
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+381 6..."
                className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl px-6 py-4 text-sm font-bold transition-all outline-none"
              />
            </div>
          </div>

          {error && (
            <div className={`p-4 rounded-2xl text-[10px] font-bold uppercase leading-relaxed ${error.isDbError ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
              <div className="flex gap-2">
                <span className="text-base">{error.isDbError ? '⚠️' : '❌'}</span>
                <div>{error.message}</div>
              </div>
            </div>
          )}

          <button
            disabled={isLoading}
            type="submit"
            className="w-full bg-gray-950 text-white py-5 rounded-[1.75rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-600 active:scale-95 transition-all disabled:opacity-50"
          >
            {isLoading ? 'Obrada...' : 'Pokreni Avanturu'}
          </button>

          <p className="text-[8px] text-gray-400 font-medium text-center uppercase tracking-widest leading-loose">
            Klikom na dugme prihvatate uslove korišćenja<br/>
            platforme bakšis.net i nknet consulting doo.
          </p>
        </form>
      </div>
    </div>
  );
};
