import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // (loadEnv טוען משתני סביבה מ-.env ומ-Environment של Netlify)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    optimizeDeps: { exclude: ['lucide-react'] },
    // שים לב: כל מה שמוגדר כאן נחשף לדפדפן (אל תשים סודות אמיתיים)
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY ?? ''),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY ?? '')
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.')
      }
    },
    build: { outDir: 'dist' }
  };
});
