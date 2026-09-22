#!/usr/bin/env node
/**
 * npm run audit:teclado — navegação por teclado, com teclas reais, nas 18 páginas
 * (as duas línguas) e nos dois temas.
 *
 * Corre depois de `npm run build`. Sai com código 1 se houver alguma falha.
 *
 * Em cada página, um percurso completo com Tab:
 *   - cada paragem tem contorno de foco (2px ou mais), visível e não tapado pela navbar;
 *   - o contorno tem pelo menos 3:1 contra o fundo à volta;
 *   - a ordem segue a ordem visual (de cima para baixo; as duas colunas das
 *     competências vão grupo a grupo; os elementos fixos não contam).
 * Nas páginas iniciais, cada comportamento com o teclado:
 *   - link de saltar; menu (abre, prende o foco, Escape devolve-o); tema; botão "?";
 *     modal (dialog, foco no "Fechar", Tab fica dentro, Escape devolve o foco);
 *     seta de voltar ao topo; idioma; aria-current no menu; "Ver CV" leva ao CV;
 *   - axe com o menu, o balão, a modal e a seta abertos.
 * Nos case studies: "Voltar aos projetos" com Enter.
 * No CV: "Descarregar PDF" recebe o foco e aponta para o PDF da mesma língua, que existe.
 *
 * Opções: --capturas guarda capturas em node_modules/.cache/auditoria.
 */
import fs from 'node:fs';
import path from 'node:path';
import {
  BASE, CAPTURAS, RAIZ, TAGS_AXE, carregarFerramentas, contextoComTema, paginas, relatorio, revelarTudo, servidor,
} from './comum.mjs';

const site = JSON.parse(fs.readFileSync(path.join(RAIZ, 'src', 'data', 'site.json'), 'utf8'));

const { chromium, AxeBuilder } = await carregarFerramentas();
const urls = paginas();
const parar = await servidor();
const r = relatorio();
const browser = await chromium.launch();

const cap = async (page, nome) => {
  if (CAPTURAS) await page.screenshot({ path: path.join(CAPTURAS, `teclado-${nome}.jpg`), type: 'jpeg', quality: 70 });
};

const axeAqui = async (page, estado) => {
  const res = await new AxeBuilder({ page }).withTags(TAGS_AXE).analyze();
  for (const v of res.violations) r.falha(`axe (${estado}): ${v.id} — ${v.help} — ${v.nodes.map((n) => n.target.join(' ')).slice(0, 4).join(' ; ')}`);
};

// Corre no browser: descreve o elemento focado e mede o contorno.
const infoFoco = () => {
  const a = document.activeElement;
  const cs = getComputedStyle(a);
  const r = a.getBoundingClientRect();
  const rgba = (s) => { const m = s.match(/rgba?\(([^)]+)\)/); if (!m) return [0, 0, 0, 0]; const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p[3] ?? 1]; };
  const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  const L = ([x, y, z]) => 0.2126 * lin(x) + 0.7152 * lin(y) + 0.0722 * lin(z);
  const sobre = (c, b) => [0, 1, 2].map((i) => c[i] * c[3] + b[i] * (1 - c[3]));
  // O contorno fica fora do elemento (outline-offset): mede-se contra o fundo do pai.
  const pilha = [];
  for (let n = a.parentElement; n; n = n.parentElement) pilha.push(rgba(getComputedStyle(n).backgroundColor));
  let fundo = [255, 255, 255];
  for (const k of pilha.reverse()) fundo = sobre(k, fundo);
  const razao = (x, y) => { const p = L(x), q = L(y); return (Math.max(p, q) + 0.05) / (Math.min(p, q) + 0.05); };
  const nav = document.querySelector('.navbar');
  const fundoNav = nav && !a.closest('.navbar') && !a.classList.contains('skip-link') ? nav.getBoundingClientRect().bottom : -Infinity;
  const grupo = a.closest('.skill-group');
  return {
    desc: `${a.tagName.toLowerCase()}${a.id ? '#' + a.id : ''}${typeof a.className === 'string' && a.className ? '.' + a.className.split(' ')[0] : ''} "${(a.getAttribute('aria-label') || a.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 28)}"`,
    body: a === document.body,
    y: Math.round(r.top + scrollY),
    fixo: cs.position === 'fixed',
    grupo: grupo ? [...document.querySelectorAll('.skill-group')].indexOf(grupo) : -1,
    tapado: r.top < fundoNav && r.bottom > 0,
    visivel: r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && r.bottom > 0 && r.top < innerHeight,
    temContorno: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 2,
    contraste: Math.round(razao(sobre(rgba(cs.outlineColor), fundo), fundo) * 100) / 100,
  };
};

async function percorrer(page, url, rotulo) {
  await page.goto(BASE + url, { waitUntil: 'load' });
  await revelarTudo(page);
  const passos = [];
  for (let i = 0; i < 250; i++) {
    await page.keyboard.press('Tab');
    const f = await page.evaluate(infoFoco);
    if (f.body || (passos.length && passos[0].desc === f.desc && passos[0].y === f.y)) break;
    passos.push(f);
  }
  for (const p of passos) {
    if (!p.temContorno) r.falha(`${rotulo}: sem contorno: ${p.desc}`);
    if (!p.visivel) r.falha(`${rotulo}: foco fora do ecrã: ${p.desc}`);
    if (p.tapado) r.falha(`${rotulo}: foco tapado pela navbar: ${p.desc}`);
    if (p.contraste < 3) r.falha(`${rotulo}: contorno a ${p.contraste}:1: ${p.desc}`);
  }
  passos.forEach((p, i) => {
    if (!i) return;
    const a = passos[i - 1];
    const sobe = p.y + 40 < a.y;
    const esperado = p.fixo || a.fixo || a.desc.includes('skip-link') || (p.grupo !== -1 && a.grupo !== -1 && p.grupo !== a.grupo);
    if (sobe && !esperado) r.falha(`${rotulo}: fora da ordem visual: ${a.desc} → ${p.desc}`);
  });
  return { paragens: passos.length, minimo: Math.min(...passos.map((p) => p.contraste)) };
}

for (const tema of ['dark', 'light']) {
  // reducedMotion: sem deslizamento, o elemento focado já está no ecrã quando se mede.
  const ctx = await contextoComTema(browser, tema, { viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const erros = [];
  page.on('pageerror', (e) => erros.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') erros.push(m.text()); });
  console.log(`\n== ${tema}`);

  for (const u of urls) {
    const p = await percorrer(page, u, `${tema} ${u}`);
    console.log(`  ${u}: ${p.paragens} paragens de Tab, contorno mínimo ${p.minimo}:1`);
    if (u.includes('/projet') || u.includes('/projects/')) {
      const casa = u.startsWith('/en/') ? '/en/' : '/';
      await page.goto(BASE + u, { waitUntil: 'load' });
      await page.focus('.case-back');
      await cap(page, `case-foco-${tema}${u.replace(/\//g, '_')}`);
      await Promise.all([page.waitForNavigation(), page.keyboard.press('Enter')]);
      const v = new URL(page.url());
      if (v.pathname !== casa || v.hash !== '#projects') r.falha(`${tema} ${u}: "Voltar aos projetos" levou a ${v.pathname}${v.hash}`);
    }
    if (u.endsWith('/cv/')) {
      // O botão de descarregar: com foco e contorno, e a apontar para o PDF da mesma língua.
      const pdf = '/' + (u.startsWith('/en/') ? site.cvPathEn : site.cvPath);
      await page.goto(BASE + u, { waitUntil: 'load' });
      await page.focus('.cv-download');
      await cap(page, `cv-foco-${tema}${u.replace(/\//g, '_')}`);
      const b = await page.evaluate(() => { const a = document.activeElement; return { cls: a.className, href: a.getAttribute('href'), download: a.hasAttribute('download'), contorno: getComputedStyle(a).outlineStyle !== 'none' }; });
      const resposta = await page.request.head(BASE + b.href);
      if (!b.cls.includes('cv-download') || b.href !== pdf || !b.download || !b.contorno || resposta.status() !== 200 || !resposta.headers()['content-type']?.includes('pdf')) {
        r.falha(`${tema} ${u}: "Descarregar PDF" ${JSON.stringify({ ...b, esperado: pdf, estado: resposta.status() })}`);
      }
    }
  }

  for (const lang of ['pt', 'en']) {
    const home = lang === 'pt' ? '/' : '/en/';
    const onde = `${tema} ${home}`;

    // Link de saltar
    await page.goto(BASE + home, { waitUntil: 'load' });
    await page.keyboard.press('Tab');
    const skip = await page.evaluate(() => { const a = document.activeElement; const b = a.getBoundingClientRect(); return { cls: a.className, dentro: b.top >= 0 && b.left >= 0 && b.bottom <= innerHeight }; });
    await cap(page, `skip-${lang}-${tema}`);
    await page.keyboard.press('Enter');
    const depois = await page.evaluate(() => document.activeElement.id);
    if (skip.cls !== 'skip-link' || !skip.dentro || depois !== 'conteudo') r.falha(`${onde}: link de saltar ${JSON.stringify({ skip, depois })}`);

    // Menu
    await page.goto(BASE + home, { waitUntil: 'load' });
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    const noBotao = await page.evaluate(() => document.activeElement.id);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    const aberto = await page.evaluate(() => ({ ativo: document.getElementById('overlay-menu').classList.contains('active'), expandido: document.getElementById('hamburger-btn').getAttribute('aria-expanded'), foco: document.activeElement.className, inerte: document.querySelector('main').inert }));
    await cap(page, `menu-${lang}-${tema}`);
    await axeAqui(page, `${onde} menu aberto`);
    const tabs = [];
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      tabs.push(await page.evaluate(() => (document.activeElement === document.body ? 'body' : document.activeElement.className || document.activeElement.id)));
    }
    await page.keyboard.press('Escape');
    await page.waitForTimeout(600); // o fade do menu dura 0,4s
    const fechado = await page.evaluate(() => ({ ativo: document.getElementById('overlay-menu').classList.contains('active'), expandido: document.getElementById('hamburger-btn').getAttribute('aria-expanded'), foco: document.activeElement.id, inerte: document.querySelector('main').inert }));
    if (noBotao !== 'hamburger-btn' || !aberto.ativo || aberto.expandido !== 'true' || aberto.foco !== 'overlay-link' || !aberto.inerte
      || fechado.ativo || fechado.expandido !== 'false' || fechado.foco !== 'hamburger-btn' || fechado.inerte || tabs.some((t) => /project|proof|skill|footer|case/.test(t))) {
      r.falha(`${onde}: menu ${JSON.stringify({ noBotao, aberto, tabs, fechado })}`);
    }

    // Tema
    const antes = await page.evaluate(() => document.documentElement.className);
    await page.focus('#theme-toggle');
    await page.keyboard.press('Enter');
    const trocado = await page.evaluate(() => document.documentElement.className);
    await page.keyboard.press('Enter');
    if (antes === trocado) r.falha(`${onde}: o tema não troca com Enter`);

    // Botão "?"
    await page.focus('#projeto-mr-pizza .info-btn');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1200); // as linhas que entram na vista acabam o fade de 0,8s
    const info1 = await page.evaluate(() => ({ exp: document.querySelector('#projeto-mr-pizza .info-btn').getAttribute('aria-expanded'), vis: !document.getElementById('nota-mr-pizza').hidden }));
    await cap(page, `info-${lang}-${tema}`);
    await axeAqui(page, `${onde} balão aberto`);
    await page.keyboard.press('Escape');
    const info2 = await page.evaluate(() => ({ exp: document.querySelector('#projeto-mr-pizza .info-btn').getAttribute('aria-expanded'), foco: document.activeElement.className }));
    await page.keyboard.press(' ');
    const info3 = await page.evaluate(() => document.querySelector('#projeto-mr-pizza .info-btn').getAttribute('aria-expanded'));
    await page.keyboard.press('Escape');
    if (info1.exp !== 'true' || !info1.vis || info2.exp !== 'false' || info2.foco !== 'info-btn' || info3 !== 'true') r.falha(`${onde}: "?" ${JSON.stringify({ info1, info2, info3 })}`);

    // Modal
    await page.focus('#projeto-mr-pizza .project-open');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(150);
    const modal1 = await page.evaluate(() => { const m = document.getElementById('modal-mr-pizza'); return { ativa: m.classList.contains('active'), foco: document.activeElement.className, nome: document.activeElement.getAttribute('aria-label'), role: m.getAttribute('role'), modal: m.getAttribute('aria-modal'), titulo: !!document.getElementById(m.getAttribute('aria-labelledby')) }; });
    await cap(page, `modal-${lang}-${tema}`);
    await axeAqui(page, `${onde} modal aberta`);
    const tabsModal = [];
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('Tab');
      // Depois do último controlo, o Tab passa pela barra do browser (foco no body): não é sair da modal.
      tabsModal.push(await page.evaluate(() => (document.activeElement === document.body ? 'browser' : document.activeElement.closest('.modal') ? 'modal' : 'fora')));
    }
    await page.keyboard.press('Escape');
    const modal2 = await page.evaluate(() => ({ ativa: !!document.querySelector('.modal.active'), foco: document.activeElement.className, inerte: document.querySelector('main').inert }));
    if (!modal1.ativa || modal1.foco !== 'modal-close' || !modal1.nome || modal1.role !== 'dialog' || modal1.modal !== 'true' || !modal1.titulo
      || tabsModal.includes('fora') || modal2.ativa || modal2.foco !== 'project-open' || modal2.inerte) {
      r.falha(`${onde}: modal ${JSON.stringify({ modal1, tabsModal, modal2 })}`);
    }

    // Seta de voltar ao topo
    await page.keyboard.press('End');
    await page.waitForTimeout(700);
    const setaVisivel = await page.evaluate(() => document.getElementById('back-to-top').classList.contains('is-visible'));
    await axeAqui(page, `${onde} fim da página, seta visível`);
    await page.focus('#back-to-top');
    await cap(page, `seta-foco-${lang}-${tema}`);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);
    const seta = await page.evaluate(() => ({ y: Math.round(scrollY), foco: document.activeElement.id }));
    if (!setaVisivel || seta.y !== 0 || seta.foco !== 'hamburger-btn') r.falha(`${onde}: seta ${JSON.stringify({ setaVisivel, seta })}`);

    // Idioma
    await page.focus('#lang-toggle');
    await Promise.all([page.waitForNavigation(), page.keyboard.press('Enter')]);
    const outra = new URL(page.url()).pathname;
    if (outra !== (lang === 'pt' ? '/en/' : '/')) r.falha(`${onde}: o idioma levou a ${outra}`);

    // Ver CV: com Enter, leva à página do CV na mesma língua.
    await page.goto(BASE + home, { waitUntil: 'load' });
    const cvDestino = `${home}cv/`;
    try {
      await page.focus(`.hero-buttons a[href="${cvDestino}"]`);
      await Promise.all([page.waitForNavigation(), page.keyboard.press('Enter')]);
      const chegou = new URL(page.url()).pathname;
      if (chegou !== cvDestino) r.falha(`${onde}: "Ver CV" levou a ${chegou}`);
    } catch (e) {
      r.falha(`${onde}: "Ver CV": não há link para ${cvDestino} no hero (${e.message.split('\n')[0]})`);
    }

    // aria-current no menu, a meio dos projetos
    await page.goto(BASE + home + '#projects', { waitUntil: 'load' });
    await page.waitForTimeout(800);
    const atual = await page.evaluate(() => [...document.querySelectorAll('.overlay-link[aria-current]')].map((a) => a.getAttribute('href')));
    if (atual.length !== 1 || atual[0] !== '#projects') r.falha(`${onde}: aria-current ${JSON.stringify(atual)}`);

    console.log(`  ${home}: saltar, menu, tema, "?", modal, seta, idioma, "Ver CV" e aria-current testados`);
  }

  if (erros.length) r.falha(`${tema}: consola: ${erros.join(' | ')}`);
  await ctx.close();
}

await browser.close();
await parar();
console.log(r.falhas ? `\n✗ audit:teclado: ${r.falhas} falha(s)` : '\n✓ audit:teclado: zero falhas');
process.exit(r.falhas ? 1 : 0);

