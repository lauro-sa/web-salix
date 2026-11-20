// ============================================================
// Configuración de Astro — salixweb.com
// ============================================================
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://salixweb.com',

  // Comprimir el output para producción
  compressHTML: true,

  // Integraciones
  // Las propuestas de rediseño no se indexan (llevan `noindex`): tampoco van al mapa del sitio.
  integrations: [sitemap({ filter: (pagina) => !pagina.includes('/propuestas/') })],

  // Configuración de Vite (bundler interno)
  vite: {
    build: {
      // Dividir chunks grandes para mejor performance
      rollupOptions: {
        output: {
          // Una función, no un objeto: desde Astro 7 (Vite con rolldown) la forma de
          // objeto ya no se acepta y el build falla («manualChunks is not a function»).
          manualChunks(id) {
            if (id.includes('/src/scripts/particulas.js') || id.includes('/src/scripts/morphing.js')) return 'animaciones';
          }
        }
      }
    }
  }
});
