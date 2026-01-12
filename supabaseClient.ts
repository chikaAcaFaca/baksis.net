
import { createClient } from '@supabase/supabase-js';

// Koristimo process.env jer je to standard u ovom okruženju, 
// a definisali smo ga u vite.config.ts radi sigurnosti.
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl && typeof window !== 'undefined') {
  console.error("⚠️ KRITIČNO: VITE_SUPABASE_URL nije pronađen! Proveri Vercel Dashboard -> Settings -> Environment Variables. Varijable MORAJU početi sa VITE_ prefixom.");
}

export const supabase = createClient(
  supabaseUrl || 'https://missing-url.supabase.co', 
  supabaseAnonKey || 'missing-key', 
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
