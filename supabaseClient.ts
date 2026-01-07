
import { createClient } from '@supabase/supabase-js';

// Funkcija koja bezbedno čita env promenljive bez obzira na okruženje
const getEnv = (key: string): string => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  if (typeof window !== 'undefined' && (window as any).process?.env?.[key]) {
    return (window as any).process.env[key];
  }
  return '';
};

// Uzimamo vrednosti. Ako ne postoje, stavljamo prazan string.
// Supabase klijent će raditi samo ako su ove vrednosti popunjene u .env ili na Vercelu.
const supabaseUrl = getEnv('SUPABASE_URL');
const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY');

// Inicijalizujemo klijent. Ako ključevi fale, aplikacija će ući u "Demo Mode" 
// (pogledaj AuthModal.tsx logiku koju smo ranije dodali).
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

if (!supabaseUrl || !supabaseAnonKey) {
  console.log("ℹ️ Bakšis.net: Ključevi nisu detektovani. Sistem je u Demo režimu (UI testiranje).");
}
