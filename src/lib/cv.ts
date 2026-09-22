import site from '../data/site.json';
import { localeHref, type Lang } from '../i18n';

/**
 * Onde vive a página do CV em cada língua: /cv/ e /en/cv/.
 * O scripts/check-texto.mjs e o scripts/gerar-cv.mjs repetem este padrão.
 */
export const cvHref = (lang: Lang): string => `${localeHref[lang]}cv/`;

/** O PDF do CV em cada língua, gerado pelo npm run cv. O caminho vem do site.json. */
export const cvPdfHref = (lang: Lang): string => `/${lang === 'pt' ? site.cvPath : site.cvPathEn}`;

