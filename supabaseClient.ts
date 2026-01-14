
import { createClient } from '@supabase/supabase-js';

// Koristimo standardne Vite klijentske putanje. 
// Vite će tokom build-a ove varijable zameniti stvarnim stringovima definisanim u vite.config.ts.
// Fix: Use process.env instead of import.meta.env to avoid TypeScript errors regarding ImportMeta types
const supabaseUrl = (process.env as any).VITE_SUPABASE_URL;
const supabaseAnonKey = (process.env as any).VITE_SUPABASE_ANON_KEY;

// Dijagnostika za lakše rešavanje problema na Vercelu
if (!supabaseUrl || supabaseUrl === '') {
  if (typeof window !== 'undefined') {
    console.error("⚠️ KRITIČNO: VITE_SUPABASE_URL nije pronađen!");
    console.warn("DIJAGNOSTIKA ZA VERCEL:");
    console.info("1. Idi na Vercel Dashboard -> Settings -> Environment Variables.");
    console.info("2. Proveri da li su uneti: VITE_SUPABASE_URL i VITE_SUPABASE_ANON_KEY.");
    console.info("3. Ako si ih nazvao SUPABASE_URL (bez VITE_), naš novi config će ih sada prepoznati.");
    console.info("4. VEOMA VAŽNO: Nakon dodavanja varijabli na Vercel, MORAŠ uraditi: Deployments -> Redeploy.");
  }
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
