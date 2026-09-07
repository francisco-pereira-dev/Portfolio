// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * Falha o build, cedo e de uma vez, se faltar alguma imagem de projeto.
 *
 * Sem isto o Astro pára na primeira que falta e só nomeia essa. As fotografias
 * de stock do Unsplash foram removidas de propósito: cada projeto tem de ter um
 * screenshot real, e o build tem de o exigir em vez de o disfarçar.
 */
function verificarImagensDosProjetos() {
  return {
    name: 'verificar-imagens-dos-projetos',
    hooks: {
      'astro:config:setup': () => {
        const dir = path.resolve('./src/content/projects');
        if (!fs.existsSync(dir)) return;

        const faltam = [];
        for (const ficheiro of fs.readdirSync(dir).filter((n) => n.endsWith('.json'))) {
          const entrada = JSON.parse(fs.readFileSync(path.join(dir, ficheiro), 'utf8'));
          if (!entrada.image) continue;
          const alvo = path.resolve(dir, entrada.image);
          if (!fs.existsSync(alvo)) {
            const relativo = path.relative(process.cwd(), alvo).split(path.sep).join('/');
            faltam.push(
              `  - ${entrada.slug}: falta ${relativo}   (referido em src/content/projects/${ficheiro})`
            );
          }
        }

        if (faltam.length > 0) {
          throw new Error(
            `\nFalta${faltam.length > 1 ? 'm' : ''} ${faltam.length} imagem(ns) de projeto:\n\n` +
              faltam.join('\n') +
              `\n\nColoca o(s) ficheiro(s) em assets/images/ com esse nome exato e volta a correr o build.\n` +
              `As fotografias de stock do Unsplash foram removidas: cada projeto precisa de um screenshot real.\n`
          );
        }
      },
    },
  };
}

/**
 * Remove de dist/_astro/ os ficheiros que ninguém referencia.
 *
 * O Astro emite sempre o original de cada imagem da content collection, mesmo
 * quando só as variantes otimizadas do <Image> são usadas. Sem isto, o dist leva
 * megabytes de originais que nenhuma página pede. A verificação é literal: só se
 * apaga o que não aparece em nenhum HTML, CSS ou JS gerado.
 */
function podarAssetsNaoReferenciados() {
  return {
    name: 'podar-assets-nao-referenciados',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const raiz = new URL('./', dir).pathname.replace(/^\/([A-Za-z]:)/, '$1');
        const pastaAssets = path.join(raiz, '_astro');
        if (!fs.existsSync(pastaAssets)) return;

        // Junta tudo o que pode conter referências.
        const textos = [];
        (function anda(d) {
          for (const e of fs.readdirSync(d, { withFileTypes: true })) {
            const f = path.join(d, e.name);
            if (e.isDirectory()) anda(f);
            else if (/\.(html|css|js|mjs|json|xml|txt)$/i.test(e.name)) {
              textos.push(fs.readFileSync(f, 'utf8'));
            }
          }
        })(raiz);
        const blob = textos.join('\n');

        let apagados = 0;
        let bytes = 0;
        for (const nome of fs.readdirSync(pastaAssets)) {
          if (blob.includes(nome)) continue;
          const alvo = path.join(pastaAssets, nome);
          bytes += fs.statSync(alvo).size;
          fs.unlinkSync(alvo);
          apagados++;
        }

        if (apagados > 0) {
          logger.info(
            `removidos ${apagados} originais nao referenciados (${(bytes / 1024 / 1024).toFixed(2)} MB)`
          );
        }
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  // Domínio próprio servido pelo GitHub Pages (ficheiro public/CNAME).
  site: 'https://franciscopereira.dev',
  base: '/',

  integrations: [
    verificarImagensDosProjetos(),
    // Gera sitemap-index.xml e sitemap-0.xml com as duas linguas ligadas por
    // xhtml:link, para os motores saberem que sao a mesma pagina em idiomas diferentes.
    sitemap({
      i18n: {
        defaultLocale: 'pt',
        locales: {
          pt: 'pt-PT',
          en: 'en',
        },
      },
    }),
    podarAssetsNaoReferenciados(),
  ],

  i18n: {
    defaultLocale: 'pt',
    locales: ['pt', 'en'],
    routing: {
      // PT fica na raiz (/), EN em /en/.
      prefixDefaultLocale: false,
    },
  },
});
