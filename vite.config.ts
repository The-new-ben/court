// vite.config.ts
// (זה קובץ ההגדרות של Vite — יושב בשורש הפרויקט ומגדיר איך לבנות את האתר)

import path from 'path';                                   // (ניהול נתיבים בקבצים)
import { defineConfig, loadEnv } from 'vite';              // (defineConfig=עטיפה להגדרות; loadEnv=טעינת משתני סביבה)
import react from '@vitejs/plugin-react';                  // (תוסף React ל-Vite)

export default defineConfig(({ mode }) => {
  // טוען משתני סביבה לפי מצב (development/production) (loadEnv קורא מקבצי .env*)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],                                    // (מפעיל תמיכה ב-React)
    optimizeDeps: { exclude: ['lucide-react'] },           // (מדלג על פרה-באנדל של הספרייה הזו אם עושה בעיות)
    define: {                                              // (מזריק משתנים לקוד צד-לקוח בזמן build)
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY ?? ''),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY ?? '')
      // הערה: כל מה שמוגדר כאן נחשף לדפדפן. אל תשים פה סודות אמיתיים. (משתנים רגישים => פונקציה בשרת)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),                 // (מאפשר import מ-'@/...' במקום נתיבים ארוכים)
      },
    },
    build: { outDir: 'dist' }                              // (תיקיית פלט שה-Netlify מגיש)
  };
});
