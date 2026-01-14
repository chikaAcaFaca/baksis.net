
import { createClient } from '@supabase/supabase-js';

/**
 * Proverava da li je string validan HTTP/HTTPS URL.
 */
const isValidUrl = (url: string): boolean => {
  try {
    return url.startsWith('http://') || url.startsWith('https://');
  } catch {
    return false;
  }
};

/**
 * Ekstremno robustan hvatač varijabli.
 */
const getSafeEnvVar = (name: string): string => {
  const altName = name.startsWith('VITE_') ? name.replace('VITE_', 'NEXT_PUBLIC_') : name;
  
  const search = (key: string): string | null => {
    // 1. Provera import.meta.env (Vite build-time injection)
    try {
      const val = (import.meta as any).env[key];
      if (val && typeof val === 'string' && val.length > 5 && !val.includes('import.meta')) {
        return val;
      }
    } catch {}

    // 2. Provera process.env (Vercel runtime/build)
    try {
      const val = (process as any).env[key];
      if (val && typeof val === 'string' && val.length > 5 && !val.includes('process.env')) {
        return val;
      }
    } catch {}

    // 3. Provera window.process.env (Polyfill)
    try {
      const val = (window as any).process?.env?.[key];
      if (val && typeof val === 'string' && val.length > 5 && !val.includes('import.meta')) {
        return val;
      }
    } catch {}

    return null;
  };

  return search(name) || search(altName) || '';
};

// Dobavljanje i validacija
const rawUrl = getSafeEnvVar('VITE_SUPABASE_URL');
const rawKey = getSafeEnvVar('VITE_SUPABASE_ANON_KEY');

// Ako URL nije validan, koristimo direktan fallback na tvoj ID projekta iz logova
const FINAL_URL = isValidUrl(rawUrl) ? rawUrl : 'https://kxqwilvhayavadaolbde.supabase.co';
const FINAL_KEY = (rawKey && rawKey.length > 20) ? rawKey : ''; // Ključ ostavljamo prazan ako je sumnjiv da bi bacio jasniji error kasnije

if (!isValidUrl(rawUrl)) {
  console.warn("⚠️ BAKŠIS: VITE_SUPABASE_URL nije validan ili nedostaje. Koristim fallback URL.");
}

export const supabase = createClient(
  FINAL_URL,
  FINAL_KEY || 'missing-key', 
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storageKey: 'baksis-auth-token',
      flowType: 'pkce'
    }
  }
);
