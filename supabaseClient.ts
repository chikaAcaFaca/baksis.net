
import { createClient } from '@supabase/supabase-js';

// Koristimo import.meta.env za Vite ili fallback na window.process
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || (window as any).process?.env?.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || (window as any).process?.env?.SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'baksis-auth-token',
    storage: window.localStorage,
    flowType: 'pkce' // Moderniji i sigurniji flow
  }
});
