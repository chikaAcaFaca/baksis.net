
import { createClient } from '@supabase/supabase-js';

/**
 * Pomoćna funkcija koja pokušava da izvuče varijablu iz svih mogućih mesta 
 * gde je Vite/Vercel mogu sakriti.
 */
const getVar = (key: string): string | undefined => {
  // 1. Vite standard (import.meta.env)
  try {
    const meta = import.meta as any;
    if (meta?.env?.[key]) return meta.env[key];
  } catch (e) {}

  // 2. Standardni process.env (koji Vite define-uje u vite.config.ts)
  try {
    if (typeof process !== 'undefined' && process.env?.[key]) {
      return process.env[key];
    }
  } catch (e) {}

  // 3. Provera direktno na window objektu (za svaki slučaj)
  try {
    if (typeof window !== 'undefined' && (window as any).process?.env?.[key]) {
      return (window as any).process.env[key];
    }
  } catch (e) {}

  return undefined;
};

const supabaseUrl = getVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getVar('VITE_SUPABASE_ANON_KEY');

// Logovanje grešaka sa jasnim uputstvom
if (typeof window !== 'undefined') {
  if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
    console.warn("⚠️ bakšis.net: VITE_SUPABASE_URL nije detektovan. Proveri da li si uradio REDEPLOY na Vercelu nakon dodavanja varijabli.");
  }
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key', 
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storageKey: 'baksis-auth-token',
      storage: window.localStorage,
      flowType: 'pkce'
    }
  }
);
