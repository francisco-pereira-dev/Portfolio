#!/usr/bin/env node
/**
 * npm run audit:a11y — auditoria de acessibilidade das 18 páginas (as duas línguas):
 * as iniciais, os 7 case studies e o CV, lidas do sitemap.
 *
 * Corre depois de `npm run build`. Sai com código 1 se houver alguma falha.
 *
 * 1. Com JavaScript, nos dois temas:
 *    - axe (WCAG 2.0/2.1/2.2 A e AA, e best-practice): zero violações;
 *    - estrutura: um h1, sem saltos de nível, os marcos header/nav/main/footer,
 *      lang do documento, link de saltar, SVG decorativos escondidos, imagens com
 *      alt, e o seletor de idioma com nome e um lang em cada código;
 *    - contraste de todo o texto visível (4,5:1; 3:1 no texto grande), também com
 *      o menu, o balão "?" e a modal abertos nas páginas iniciais;
 *    - zero erros de consola.
 * 2. Sem JavaScript, nos dois temas do sistema, a 1440, 900 e 375px:
 *    - todo o texto do <main> e do rodapé está visível e dentro da largura;
 *    - o tema é o do sistema, e o claro tem os mesmos valores de html.light-mode;
 *    - a navegação sem JavaScript aparece no cabeçalho (> 1180px) ou antes do
 *      rodapé, sem sobreposições, e os links levam às secções;
 *    - o idioma, "Voltar aos projetos", "Ver mais", o link de saltar e o
 *      "Descarregar PDF" do CV funcionam;
 *    - sem scroll horizontal e contraste do texto (o axe não corre sem
 *      JavaScript na página: fica à espera para sempre).
 * 3. O CV (fase 9), nos dois temas, a 1440px, a 375px e em impressão:
 *    - o rótulo mais comprido das competências ("Frameworks e bibliotecas") não
 *      encosta ao valor: 8px ou mais entre os dois, ou o rótulo por cima;
 *    - na impressão, o fundo é branco, os elementos do ecrã estão escondidos e o
 *      texto tem contraste de 4,5:1 ou mais.
 *
 * Opções: --capturas guarda capturas em node_modules/.cache/auditoria.
 */
import path from 'node:path';
import {
  BASE, CAPTURAS, TAGS_AXE, carregarFerramentas, contextoComTema, medirContrasteNoBrowser,
  paginas, relatorio, revelarTudo, servidor,
} from './comum.mjs';

const CORTE_NAV_SEM_JS = 1180; // igual ao @media de .nav-sem-js-topo em global.css
const { chromium, AxeBuilder } = await carregarFerramentas();
const urls = paginas();
const parar = await servidor();
const r = relatorio();
const browser = await chromium.launch();
const inicial = (u) => u === '/' || u === '/en/';

const axe = async (page, onde) => {
  const res = await new AxeBuilder({ page }).withTags(TAGS_AXE).analyze();
  for (const v of res.violations) r.falha(`${onde}: axe ${v.id} [${v.impact}] ${v.help} — ${v.nodes.map((n) => n.target.join(' ')).slice(0, 4).join(' ; ')}`);
  return res.violations.length;
};

const contraste = async (page, onde) => {
  const itens = await page.evaluate(medirContrasteNoBrowser);
  const baixos = itens.filter((i) => i.razao < i.minimo);
  for (const b of baixos) r.falha(`${onde}: contraste ${b.razao}:1 (mínimo ${b.minimo}) em ${b.elemento} "${b.texto}"`);
  return { textos: itens.length, minimo: Math.min(...itens.map((i) => i.razao)) };
};

const estrutura = () => {
  const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter((h) => !h.closest('[hidden]'));
  const niveis = hs.map((h) => +h.tagName[1]);
  const saltos = [];
  niveis.forEach((n, i) => { if (i && n > niveis[i - 1] + 1) saltos.push(`${hs[i - 1].tagName}→${hs[i].tagName}`); });
  const idioma = document.getElementById('lang-toggle');
  return {
    lang: document.documentElement.lang,
    h1: document.querySelectorAll('h1').length,
    primeiroNivel: niveis[0],
    saltos,
    marcos: {
      header: document.querySelectorAll('header:not(main header):not(article header):not(section header)').length,
      nav: document.querySelectorAll('nav').length,
      main: document.querySelectorAll('main').length,
      footer: document.querySelectorAll('footer:not(main footer):not(article footer)').length,
    },
    semAlt: [...document.querySelectorAll('img')].filter((i) => i.getAttribute('alt') === null).length,
    svgsExpostos: [...document.querySelectorAll('svg')].filter((s) => !s.closest('[aria-hidden="true"]') && !s.getAttribute('role')).length,
    skip: !!document.querySelector('body > a.skip-link[href="#conteudo"]') && !!document.getElementById('conteudo'),
    idioma: idioma && {
      nome: idioma.getAttribute('aria-label'),
      codigos: [...idioma.querySelectorAll('span[lang]')].map((s) => `${s.textContent.trim()}:${s.lang}`).join(' '),
    },
  };
};

// ---------------------------------------------------------------- 1. Com JavaScript
console.log('== Com JavaScript (1440px, dois temas)');
for (const tema of ['dark', 'light']) {
  const ctx = await contextoComTema(browser, tema, { viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const consola = [];
  page.on('console', (m) => { if (m.type() === 'error') consola.push(m.text()); });
  page.on('pageerror', (e) => consola.push(String(e)));
  let violacoes = 0, textos = 0, minimo = Infinity;
  for (const u of urls) {
    const onde = `${tema} ${u}`;
    consola.length = 0;
    await page.goto(BASE + u, { waitUntil: 'load' });
    await page.addStyleTag({ content: '*,*::before,*::after{transition:none!important;animation:none!important}' });
    await revelarTudo(page);
    violacoes += await axe(page, onde);
    const e = await page.evaluate(estrutura);
    const en = u.startsWith('/en/');
    if (e.h1 !== 1 || e.primeiroNivel !== 1) r.falha(`${onde}: ${e.h1} h1, primeiro título h${e.primeiroNivel}`);
    if (e.saltos.length) r.falha(`${onde}: saltos de nível ${e.saltos.join(', ')}`);
    for (const [m, n] of Object.entries(e.marcos)) if (n < 1) r.falha(`${onde}: sem marco ${m}`);
    if (e.lang !== (en ? 'en' : 'pt-PT')) r.falha(`${onde}: lang="${e.lang}"`);
    if (!e.skip) r.falha(`${onde}: sem link de saltar para #conteudo`);
    if (e.semAlt) r.falha(`${onde}: ${e.semAlt} imagem(ns) sem alt`);
    if (e.svgsExpostos) r.falha(`${onde}: ${e.svgsExpostos} SVG sem aria-hidden`);
    if (!e.idioma || e.idioma.nome !== (en ? 'Switch to Portuguese' : 'Mudar para inglês') || e.idioma.codigos !== 'PT:pt EN:en') r.falha(`${onde}: seletor de idioma ${JSON.stringify(e.idioma)}`);
    const c = await contraste(page, onde);
    textos += c.textos; minimo = Math.min(minimo, c.minimo);
    if (inicial(u)) {
      // Estados abertos: menu, balão "?" e modal.
      await page.click('#hamburger-btn');
      const cm = await contraste(page, `${onde} menu aberto`);
      await page.keyboard.press('Escape');
      await page.focus('#projeto-mr-pizza .info-btn');
      await page.keyboard.press('Enter');
      const cb = await contraste(page, `${onde} balão aberto`);
      await page.keyboard.press('Escape');
      await page.focus('#projeto-mr-pizza .project-open');
      await page.keyboard.press('Enter');
      const cmo = await contraste(page, `${onde} modal aberta`);
      await page.keyboard.press('Escape');
      minimo = Math.min(minimo, cm.minimo, cb.minimo, cmo.minimo);
    }
    if (CAPTURAS) await page.screenshot({ path: path.join(CAPTURAS, `a11y-${tema}${u.replace(/\//g, '_')}.jpg`), quality: 70 });
    if (consola.length) r.falha(`${onde}: consola: ${consola.join(' | ')}`);
  }
  console.log(`  ${tema}: ${urls.length} páginas, ${violacoes} violações axe, ${textos} textos, contraste mínimo ${minimo}:1`);
  await ctx.close();
}

// ---------------------------------------------------------------- 2. Sem JavaScript
const inspecionarSemJs = () => {
  const visivel = (el) => {
    for (let e = el; e; e = e.parentElement) {
      const s = getComputedStyle(e);
      if (s.display === 'none' || s.visibility === 'hidden' || Number(s.opacity) < 0.99) return false;
    }
    return true;
  };
  const res = { escondidos: [], cortados: [], sobrepostos: [], textos: 0 };
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n; (n = walker.nextNode());) {
    if (!n.textContent.trim()) continue;
    const el = n.parentElement;
    // O botão "?" é um controlo, escondido de propósito sem JavaScript; o texto dele fica aberto.
    if (!el.closest('main, footer') || el.closest('.info-btn')) continue;
    res.textos++;
    const rect = el.getBoundingClientRect();
    const nome = `${el.className || el.tagName} "${n.textContent.trim().slice(0, 40)}"`;
    if (!visivel(el) || !rect.width || !rect.height) res.escondidos.push(nome);
    else if (rect.left < -1 || rect.right > document.documentElement.clientWidth + 1) res.cortados.push(nome);
  }
  const blocos = [...document.querySelectorAll('.navbar .nav-sem-js-topo ul, .navbar .nav-center span, .navbar .lang-switch')]
    .filter(visivel).map((e) => ({ nome: e.className || e.tagName, r: e.getBoundingClientRect() }));
  for (let i = 0; i < blocos.length; i++) for (let j = i + 1; j < blocos.length; j++) {
    const a = blocos[i].r, b = blocos[j].r;
    if (a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom) res.sobrepostos.push(`${blocos[i].nome} × ${blocos[j].nome}`);
  }
  const estado = (sel) => { const e = document.querySelector(sel); return e ? (visivel(e) ? 'visível' : 'escondido') : '—'; };
  res.controlos = {
    'botão do menu': estado('#hamburger-btn'), 'menu overlay': estado('#overlay-menu'), 'troca de tema': estado('#theme-toggle'),
    'botão "?"': estado('.info-btn'), 'texto do "?"': estado('.info-balao'), modal: estado('.modal'), seta: estado('#back-to-top'),
    'navegação no cabeçalho': estado('.nav-sem-js-topo'), 'navegação antes do rodapé': estado('.nav-sem-js-fundo'), idioma: estado('#lang-toggle'),
  };
  res.umaNavVisivel = [...document.querySelectorAll('.nav-sem-js')].filter(visivel).length === 1;
  res.fundo = getComputedStyle(document.body).backgroundColor;
  res.js = document.documentElement.classList.contains('js');
  res.scroll = document.documentElement.scrollWidth > document.documentElement.clientWidth;
  return res;
};

console.log('\n== Sem JavaScript (tema do sistema, 1440/900/375px)');
const controlos = {};
for (const tema of ['dark', 'light']) for (const largura of [1440, 900, 375]) {
  const ctx = await browser.newContext({ viewport: { width: largura, height: 900 }, colorScheme: tema, javaScriptEnabled: false, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const consola = [];
  page.on('console', (m) => { if (m.type() === 'error') consola.push(m.text()); });
  let textos = 0, minimo = Infinity;
  const fundoEsperado = tema === 'dark' ? 'rgb(15, 23, 42)' : 'rgb(248, 250, 252)';
  const navNoTopo = largura > CORTE_NAV_SEM_JS;
  for (const u of urls) {
    const onde = `sem JS ${tema} ${largura}px ${u}`;
    await page.goto(BASE + u, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const x = await page.evaluate(inspecionarSemJs);
    textos += x.textos;
    if (x.js) r.falha(`${onde}: a classe js existe sem JavaScript`);
    if (x.fundo !== fundoEsperado) r.falha(`${onde}: fundo ${x.fundo}, esperado ${fundoEsperado}`);
    if (x.escondidos.length) r.falha(`${onde}: ${x.escondidos.length} texto(s) escondido(s): ${x.escondidos.slice(0, 4).join(' | ')}`);
    if (x.cortados.length) r.falha(`${onde}: texto cortado: ${x.cortados.slice(0, 4).join(' | ')}`);
    if (x.sobrepostos.length) r.falha(`${onde}: cabeçalho sobreposto: ${x.sobrepostos.join(', ')}`);
    if (x.scroll) r.falha(`${onde}: scroll horizontal`);
    const navCerta = x.umaNavVisivel && (navNoTopo ? x.controlos['navegação no cabeçalho'] === 'visível' : x.controlos['navegação antes do rodapé'] === 'visível');
    if (!navCerta) r.falha(`${onde}: navegação sem JavaScript no sítio errado`);
    controlos[`${inicial(u) ? 'página inicial' : u.endsWith('/cv/') ? 'CV' : 'case study'}, ${navNoTopo ? 'largo' : 'estreito'}`] = x.controlos;
    // Sem axe: o axe corre dentro da página, e com o JavaScript desligado nunca
    // arranca (fica à espera para sempre). Aqui medem-se a estrutura, o que está
    // visível e o contraste; o axe faz o resto com JavaScript, acima.
    if (largura !== 900) {
      const c = await contraste(page, onde);
      minimo = Math.min(minimo, c.minimo);
    }
    if (CAPTURAS) await page.screenshot({ path: path.join(CAPTURAS, `semjs-${tema}-${largura}${u.replace(/\//g, '_')}.png`), fullPage: true });
  }
  if (consola.length) r.falha(`sem JS ${tema} ${largura}px: consola: ${consola.join(' | ')}`);
  console.log(`  ${tema} ${largura}px: ${urls.length} páginas, ${textos} textos visíveis${largura !== 900 ? `, contraste mínimo ${minimo}:1` : ''}`);

  // Navegação por links, sem JavaScript.
  if (largura !== 900) {
    const sel = navNoTopo ? '.nav-sem-js-topo a' : '.nav-sem-js-fundo a';
    const outraLingua = { '/': '/en/', '/en/': '/', '/projetos/dae/': '/en/projects/dae/', '/en/projects/dae/': '/projetos/dae/', '/cv/': '/en/cv/', '/en/cv/': '/cv/' };
    for (const casa of Object.keys(outraLingua)) {
      const onde = `sem JS ${tema} ${largura}px ${casa}`;
      for (let i = 0; i < 4; i++) {
        await page.goto(BASE + casa, { waitUntil: 'load' });
        await Promise.all([page.waitForURL((url) => url.hash.length > 1), page.click(`${sel} >> nth=${i}`)]);
        await page.waitForTimeout(300);
        const chegou = await page.evaluate(() => { const a = document.getElementById(location.hash.slice(1)); if (!a) return false; const b = a.getBoundingClientRect(); return b.top < innerHeight && b.bottom > 0; });
        if (!chegou) r.falha(`${onde}: o link ${i + 1} da navegação não leva à secção`);
      }
      await page.goto(BASE + casa, { waitUntil: 'load' });
      await Promise.all([page.waitForNavigation(), page.click('#lang-toggle')]);
      if (new URL(page.url()).pathname !== outraLingua[casa]) r.falha(`${onde}: o idioma levou a ${page.url()}`);
      await page.goto(BASE + casa, { waitUntil: 'load' });
      if (inicial(casa)) {
        await page.keyboard.press('Tab');
        const primeiro = await page.evaluate(() => document.activeElement.className);
        if (primeiro !== 'skip-link') r.falha(`${onde}: o 1.º Tab foi para "${primeiro}"`);
        await Promise.all([page.waitForNavigation(), page.click('#projeto-dae .project-case-link')]);
        if (!new URL(page.url()).pathname.includes('/dae/')) r.falha(`${onde}: "Ver mais" levou a ${page.url()}`);
      } else if (casa.endsWith('/cv/')) {
        // Sem JavaScript o PDF descarrega-se na mesma: é um link com download.
        const pdf = await page.evaluate(() => { const a = document.querySelector('.cv-download'); return a?.hasAttribute('download') ? a.getAttribute('href') : null; });
        const resposta = pdf ? await page.request.head(BASE + pdf) : null;
        if (!resposta || resposta.status() !== 200 || !resposta.headers()['content-type']?.includes('pdf')) r.falha(`${onde}: "Descarregar PDF" ${pdf ?? '(sem link com download)'} → ${resposta ? resposta.status() : '—'}`);
      } else {
        await Promise.all([page.waitForNavigation(), page.click('.case-back')]);
        if (new URL(page.url()).hash !== '#projects') r.falha(`${onde}: "Voltar aos projetos" levou a ${page.url()}`);
      }
    }
  }
  await ctx.close();
}

// ---------------------------------------------------------------- 3. O CV
// A grelha das competências: com um rótulo de min-width, "Frameworks e bibliotecas"
// transbordava e encostava ao valor. Mede-se o texto do rótulo (e não a caixa, que
// pode ser mais estreita do que ele) até ao início do valor. E a impressão, que tem
// de ser branca seja qual for o tema, sem nada do ecrã.
console.log('\n== CV: grelha das competências e impressão (dois temas; 1440px, 375px e impressão)');
const paginasCv = urls.filter((u) => u.endsWith('/cv/'));
const medirGrelha = () => [...document.querySelectorAll('.cv-competencias dt')].map((dt) => {
  const intervalo = document.createRange();
  intervalo.selectNodeContents(dt);
  const t = intervalo.getBoundingClientRect(), d = dt.nextElementSibling.getBoundingClientRect();
  const mesmaLinha = t.top < d.bottom && d.top < t.bottom;
  return { rotulo: dt.textContent.trim(), espaco: mesmaLinha ? Math.round((d.left - t.right) * 10) / 10 : null, porCima: t.bottom <= d.top + 1 };
});
const ESCONDIDOS_NA_IMPRESSAO = ['.skip-link', '.navbar', '.overlay-menu', '.theme-switch', '.nav-sem-js', '.site-footer', '.back-to-top', '.cv-acoes'];
for (const tema of ['dark', 'light']) for (const [largura, media] of [[1440, 'screen'], [375, 'screen'], [688, 'print']]) {
  const ctx = await contextoComTema(browser, tema, { viewport: { width: largura, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const espacos = [];
  let minimo = Infinity;
  for (const u of paginasCv) {
    const onde = `CV ${tema} ${media === 'print' ? 'impressão' : `${largura}px`} ${u}`;
    await page.goto(BASE + u, { waitUntil: 'load' });
    await page.emulateMedia({ media });
    await page.evaluate(() => document.fonts.ready);
    for (const g of await page.evaluate(medirGrelha)) {
      if (g.espaco === null ? !g.porCima : g.espaco < 8) r.falha(`${onde}: "${g.rotulo}" encosta ao valor (${g.espaco === null ? 'sobreposto' : `${g.espaco}px`})`);
      if (/^Frameworks/.test(g.rotulo)) espacos.push(g.espaco === null ? 'por cima do valor' : `a ${g.espaco}px do valor`);
    }
    if (media === 'print') {
      const p = await page.evaluate((sels) => ({
        fundo: [getComputedStyle(document.documentElement).backgroundColor, getComputedStyle(document.body).backgroundColor],
        visiveis: sels.filter((s) => [...document.querySelectorAll(s)].some((e) => getComputedStyle(e).display !== 'none')),
      }), ESCONDIDOS_NA_IMPRESSAO);
      if (!p.fundo.every((c) => c === 'rgb(255, 255, 255)')) r.falha(`${onde}: o fundo da impressão é ${p.fundo.join(' / ')}`);
      if (p.visiveis.length) r.falha(`${onde}: aparecem na impressão: ${p.visiveis.join(', ')}`);
      minimo = Math.min(minimo, (await contraste(page, onde)).minimo);
    }
  }
  console.log(`  ${tema} ${media === 'print' ? 'impressão' : `${largura}px`}: "Frameworks…" ${[...new Set(espacos)].join(' / ')}${media === 'print' ? `; fundo branco, contraste mínimo ${minimo}:1` : ''}`);
  await ctx.close();
}

// O tema claro sem JavaScript repete os valores de html.light-mode: têm de ser iguais.
const variaveis = ['--bg-color', '--surface-color', '--surface-hover', '--text-primary', '--text-secondary', '--border-color', '--shadow-glow', '--modal-bg', '--nav-bg', '--nav-color', '--overlay-bg', '--overlay-text', '--overlay-border', '--accent-text', '--warning-text'];
const lerVariaveis = async (js) => {
  const ctx = await browser.newContext({ colorScheme: 'light', javaScriptEnabled: js });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'load' });
  const v = await page.evaluate((vs) => Object.fromEntries(vs.map((k) => [k, getComputedStyle(document.documentElement).getPropertyValue(k).trim()])), variaveis);
  await ctx.close();
  return v;
};
const [semJs, comJs] = [await lerVariaveis(false), await lerVariaveis(true)];
const diferentes = variaveis.filter((k) => semJs[k] !== comJs[k]);
if (diferentes.length) r.falha(`o tema claro sem JavaScript difere de html.light-mode em ${diferentes.join(', ')}`);
else console.log(`  tema claro sem JavaScript = html.light-mode (${variaveis.length} variáveis)`);

console.log('\n  O que fica sem JavaScript:');
for (const [k, v] of Object.entries(controlos)) console.log(`    ${k}: ${Object.entries(v).map(([a, b]) => `${a} ${b}`).join(' · ')}`);

await browser.close();
await parar();
console.log(r.falhas ? `\n✗ audit:a11y: ${r.falhas} falha(s)` : '\n✓ audit:a11y: zero falhas');
process.exit(r.falhas ? 1 : 0);
