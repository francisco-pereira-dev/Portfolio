// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Domínio próprio servido pelo GitHub Pages (ficheiro public/CNAME).
  site: 'https://franciscopereira.dev',
  base: '/',

  i18n: {
    defaultLocale: 'pt',
    locales: ['pt', 'en'],
    routing: {
      // PT fica na raiz (/), EN em /en/.
      prefixDefaultLocale: false,
    },
  },
});
