
import { createClient } from '@supabase/supabase-js';

// Ove vrednosti su tvoji javni ključevi
const supabaseUrl = 'https://gpmyadrmtckuydqwrwqb.supabase.co';
const supabaseAnonKey = 'sb_publishable_OuKdx3Md2ZQq8IyE3QwV8w_81A2RTe-';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase konfiguracija nedostaje!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
