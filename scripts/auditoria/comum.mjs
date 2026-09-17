/**
 * Peças comuns às auditorias (npm run audit:a11y e npm run audit:teclado).
 *
 * As auditorias correm sobre o dist/ já gerado: primeiro `npm run build`. Se não
 * houver um servidor a responder na porta, arrancam o `astro preview` e param-no
 * no fim. Usam o Playwright e o axe, que são só dependências de desenvolvimento e
 * nunca chegam ao dist/.
 *
 * O Chromium do Playwright fica dentro de node_modules (PLAYWRIGHT_BROWSERS_PATH=0).
 * Se faltar: `PLAYWRIGHT_BROWSERS_PATH=0 npx playwright install chromium`.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const PORTA = Number(process.env.AUDIT_PORT || 4329);
/** Endereço do servidor; servidor() confirma-o ou muda-o para o que já estiver a correr. */
export let BASE = `http://localhost:${PORTA}`;
export const TAGS_AXE = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

// Capturas só com --capturas, para node_modules/.cache/auditoria (fora do git).
export const CAPTURAS = process.argv.includes('--capturas') ? path.join(RAIZ, 'node_modules', '.cache', 'auditoria') : null;
if (CAPTURAS) fs.mkdirSync(CAPTURAS, { recursive: true });

/** As 16 páginas, lidas do sitemap gerado (as duas línguas). */
export function paginas() {
  const sitemap = path.join(RAIZ, 'dist', 'sitemap-0.xml');
  if (!fs.existsSync(sitemap)) {
    console.error('✗ não há dist/: corre primeiro npm run build');
    process.exit(1);
  }
  return fs.readFileSync(sitemap, 'utf8').match(/<loc>[^<]+/g).map((l) => new URL(l.slice(5)).pathname);
}

/** Playwright e axe, carregados depois de fixar onde está o Chromium. */
export async function carregarFerramentas() {
  process.env.PLAYWRIGHT_BROWSERS_PATH ??= '0';
  const { chromium } = await import('playwright');
  const { default: AxeBuilder } = await import('@axe-core/playwright');
  return { chromium, AxeBuilder };
}

const responde = async () => {
  try {
    return (await fetch(BASE + '/', { signal: AbortSignal.timeout(2000) })).ok;
  } catch {
    return false;
  }
};

const astroPreview = (...args) => spawnSync(process.execPath, [path.join(RAIZ, 'node_modules', 'astro', 'bin', 'astro.mjs'), 'preview', ...args], { cwd: RAIZ, encoding: 'utf8' });

/**
 * Garante um servidor do dist/ e aponta BASE para ele. O Astro 7 só mantém um
 * servidor de pré-visualização de cada vez, em segundo plano: se já houver um,
 * usa-se esse e fica a correr; senão arranca-se um e para-se no fim.
 * Devolve a função que o para.
 */
export async function servidor() {
  const existente = `${astroPreview('status').stdout}`.match(/running at (http:\/\/[^\s"]+?)(?:\s|"|\(|$)/);
  if (existente) {
    BASE = existente[1].replace(/\/$/, '');
    if (await responde()) return async () => {};
  }
  BASE = `http://localhost:${PORTA}`;
  astroPreview('--background', '--port', String(PORTA));
  for (let i = 0; i < 60 && !(await responde()); i++) await new Promise((r) => setTimeout(r, 500));
  if (!(await responde())) {
    console.error(`✗ o astro preview não respondeu em ${BASE}`);
    process.exit(1);
  }
  return async () => { astroPreview('stop'); };
}

/** Contagem de falhas e mensagens. */
export function relatorio() {
  let falhas = 0;
  return {
    falha: (m) => { falhas++; console.log('  ✗ ' + m); },
    ok: (m) => console.log('  ✓ ' + m),
    get falhas() { return falhas; },
  };
}

/** Contexto com o tema escolhido guardado, como se o visitante o tivesse escolhido. */
export async function contextoComTema(browser, tema, opcoes = {}) {
  const ctx = await browser.newContext({ colorScheme: tema, ...opcoes });
  await ctx.addInitScript((t) => { try { localStorage.setItem('theme', t); } catch { /* bloqueado */ } }, tema);
  return ctx;
}

/** Mostra de imediato o conteúdo que só aparece com o scroll (animação de entrada). */
export const revelarTudo = (page) => page.evaluate(() => document.querySelectorAll('.reveal').forEach((e) => e.classList.add('is-visible')));

/**
 * Contraste de todo o texto visível, compondo os fundos semitransparentes dos
 * antepassados. Corre no browser (page.evaluate). Devolve um item por elemento.
 */
export function medirContrasteNoBrowser() {
  const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p[3] ?? 1 }; };
  const sobre = (f, b) => ({ r: f.r * f.a + b.r * (1 - f.a), g: f.g * f.a + b.g * (1 - f.a), b: f.b * f.a + b.b * (1 - f.a), a: 1 });
  const lum = (c) => { const k = [c.r, c.g, c.b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * k[0] + 0.7152 * k[1] + 0.0722 * k[2]; };
  const razao = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const fundo = (el) => {
    const camadas = [];
    for (let e = el; e; e = e.parentElement) { const c = parse(getComputedStyle(e).backgroundColor); if (c && c.a > 0) { camadas.push(c); if (c.a >= 1) break; } }
    let base = { r: 255, g: 255, b: 255, a: 1 };
    for (let i = camadas.length - 1; i >= 0; i--) base = sobre(camadas[i], base);
    return base;
  };
  const res = [];
  const vistos = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n; (n = walker.nextNode());) {
    if (!n.textContent.trim()) continue;
    const el = n.parentElement;
    if (vistos.has(el)) continue;
    vistos.add(el);
    if (el.closest('script,style,[aria-hidden="true"],[inert]')) continue;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height || r.bottom < 0) continue; // fora da página (ex.: link de saltar sem foco)
    let op = 1, oculto = false;
    for (let e = el; e; e = e.parentElement) { const s = getComputedStyle(e); op *= Number(s.opacity); if (s.visibility === 'hidden' || s.display === 'none') oculto = true; }
    if (oculto || op < 0.99) continue;
    const s = getComputedStyle(el);
    const base = fundo(el);
    const px = parseFloat(s.fontSize), peso = Number(s.fontWeight);
    res.push({
      texto: n.textContent.trim().slice(0, 40),
      elemento: el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className ? '.' + el.className.split(' ')[0] : ''),
      razao: Math.round(razao(sobre(parse(s.color), base), base) * 100) / 100,
      minimo: px >= 24 || (px >= 18.66 && peso >= 700) ? 3 : 4.5,
    });
  }
  return res;
}
