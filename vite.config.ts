
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // loadEnv učitava iz .env i iz sistemskog environment-a (Vercel)
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // Određujemo finalne vrednosti, dajući prednost VITE_ prefiksu ali dopuštajući i obične nazive
  const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL || '';
  const supabaseKey = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY || '';
  const apiKey = env.API_KEY || env.VITE_API_KEY || '';

  return {
    plugins: [react()],
    define: {
      // Direktna zamena za klijentski kod. 
      // Ovo pretvara npr. import.meta.env.VITE_SUPABASE_URL u "https://vaš-url.supabase.co" u finalnom fajlu.
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabaseKey),
      'process.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabaseKey),
      'process.env.API_KEY': JSON.stringify(apiKey),
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      chunkSizeWarningLimit: 1000,
    },
    server: {
      port: 3000
    }
  };
});
