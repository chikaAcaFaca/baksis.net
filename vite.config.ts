
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Učitavamo env varijable na osnovu moda (development/production)
  // Koristimo process.cwd() jer Vite očekuje putanju do root-a projekta
  // Fix: Cast process to any to resolve 'cwd' property error on type 'Process' in this environment
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Eksplicitno mapiramo varijable na process.env kako bi bile dostupne u klijentskom kodu
      'process.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
    },
    server: {
      port: 3000
    }
  };
});
