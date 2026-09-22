import type { Lang } from '../i18n';

/**
 * Onde vive a página de case study de um projeto, em cada língua.
 * O astro.config.mjs repete estes dois padrões para ligar as línguas no sitemap,
 * e o scripts/check-texto.mjs repete-os para verificar o dist sem importar código do site.
 */
export const caseStudyHref = (slug: string, lang: Lang): string =>
  lang === 'pt' ? `/projetos/${slug}/` : `/en/projects/${slug}/`;

/**
 * A imagem de partilha de um case study com screenshot, em public/.
 * Gerada pelo scripts/gerar-og.mjs (npm run og), que repete este padrão.
 */
export const ogImagemCaseStudy = (slug: string, lang: Lang): string => `/og/${slug}-${lang}.jpg`;

/** Um campo com vários parágrafos separa-os por uma linha em branco. */
export const paragrafos = (texto: string): string[] =>
  texto
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

/**
 * Meta description: o texto inteiro, se couber em `max` caracteres; senão, corta
 * na última palavra inteira e acaba em reticências, sem nunca passar de `max`.
 */
export function resumir(texto: string, max = 155): string {
  if (texto.length <= max) return texto;
  const corte = texto.slice(0, max - 1);
  const espaco = corte.lastIndexOf(' ');
  return (espaco > 0 ? corte.slice(0, espaco) : corte).replace(/[\s,;:.—–-]+$/, '') + '…';
}

