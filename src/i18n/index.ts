import pt from './pt.json';
import en from './en.json';

export const translations = { pt, en } as const;

export type Lang = keyof typeof translations;
export type Ui = (typeof translations)[Lang];

/** Texto de um campo bilingue da content collection. */
export interface Localized {
  pt: string;
  en: string;
}

/** URL da raiz de cada língua. O PT vive em /, o EN em /en/. */
export const localeHref: Record<Lang, string> = {
  pt: '/',
  en: '/en/',
};

/** A outra língua — o seletor do cabeçalho é um link para aqui. */
export const otherLang = (lang: Lang): Lang => (lang === 'pt' ? 'en' : 'pt');

/** Escolhe a variante certa de um campo bilingue. */
export const t = (value: Localized, lang: Lang): string => value[lang];
