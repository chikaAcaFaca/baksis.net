
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  const getVar = (key: string) => env[key] || (process.env as any)[key] || '';

  // Pokušavamo da nađemo Supabase URL i Key bez obzira na prefiks
  const supabaseUrl = getVar('VITE_SUPABASE_URL') || getVar('NEXT_PUBLIC_SUPABASE_URL') || getVar('SUPABASE_URL');
  const supabaseKey = getVar('VITE_SUPABASE_ANON_KEY') || getVar('NEXT_PUBLIC_SUPABASE_ANON_KEY') || getVar('SUPABASE_ANON_KEY');
  const apiKey = getVar('API_KEY');

  console.log(`[Build] Provera okruženja: URL=${supabaseUrl ? 'OK' : 'NEDOSTAJE'}`);

  return {
    plugins: [react()],
    define: {
      // Koristimo JSON.stringify samo ako vrednost postoji, inače 'null'
      'import.meta.env.VITE_SUPABASE_URL': supabaseUrl ? JSON.stringify(supabaseUrl) : 'null',
      'import.meta.env.VITE_SUPABASE_ANON_KEY': supabaseKey ? JSON.stringify(supabaseKey) : 'null',
      'process.env.VITE_SUPABASE_URL': supabaseUrl ? JSON.stringify(supabaseUrl) : 'null',
      'process.env.VITE_SUPABASE_ANON_KEY': supabaseKey ? JSON.stringify(supabaseKey) : 'null',
      'process.env.API_KEY': apiKey ? JSON.stringify(apiKey) : 'null',
    },
    build: {
      outDir: 'dist',
      sourcemap: false
    }
  };
});
