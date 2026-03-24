// ============================================================
// Configuración de Astro — salixweb.com
// ============================================================
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://salixweb.com',

  // Comprimir el output para producción
  compressHTML: true,

  // Configuración de Vite (bundler interno)
  vite: {
    build: {
      // Dividir chunks grandes para mejor performance
      rollupOptions: {
        output: {
          manualChunks: {
            'animaciones': ['./src/scripts/particulas.js', './src/scripts/morphing.js'],
          }
        }
      }
    }
  }
});
