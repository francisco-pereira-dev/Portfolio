#!/usr/bin/env node
/**
 * Compara content/texto-canonico.json com o HTML gerado em dist/, nas duas línguas.
 *
 * O canónico é o texto tal como foi aprovado nos enunciados. Os ficheiros de
 * dados (i18n, collection, skills.json) derivam dele e o dist deriva dos dados,
 * por isso comparar as duas pontas apanha um desvio em qualquer elo da cadeia.
 *
 * A comparação é exata e, sempre que possível, posicional:
 *   - cada texto de interface tem de ser um nó de texto ou um valor de atributo
 *     inteiro — "Dados" não passa por aparecer a meio de outra frase;
 *   - o texto de cada projeto é procurado dentro do cartão e da modal desse
 *     projeto, não em qualquer sítio da página;
 *   - cada competência é verificada no seu grupo, pela ordem, com as provas
 *     e os links que a acompanham.
 *
 * O texto que nenhum enunciado definiu fica em _fora_do_canonico e é listado
 * como não coberto, para a lacuna ficar à vista em vez de passar em silêncio.
 *
 * Corre depois do build. Sai com código 1 se houver divergências.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ler = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

const CANONICO = 'content/texto-canonico.json';
const PAGINAS = { pt: 'dist/index.html', en: 'dist/en/index.html' };
const GITHUB = 'https://github.com/francisco-pereira-dev';

for (const f of [CANONICO, ...Object.values(PAGINAS)]) {
  if (!fs.existsSync(path.join(root, f))) {
    console.error(`✗ ficheiro em falta: ${f}${f.startsWith('dist') ? ' — corre npm run build primeiro' : ''}`);
    process.exit(1);
  }
}
const canon = JSON.parse(ler(CANONICO));

// --- HTML -> texto ---------------------------------------------------------

const ENTIDADES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', copy: '©', times: '×' };
const decode = (s) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTIDADES[n] ?? m);
const norm = (s) => decode(s).replace(/\s+/g, ' ').trim();
const semScripts = (html) => html.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, '');

/** Nós de texto, pela ordem do documento. */
const textos = (html) => semScripts(html).split(/<[^>]*>/).map(norm).filter(Boolean);
/** Valores de atributo: content, alt, aria-label, ... */
const atributos = (html) => [...semScripts(html).matchAll(/\s[a-zA-Z:_-]+="([^"]*)"/g)].map((m) => norm(m[1]));
/** Texto do primeiro elemento que case com `re` (grupo 1), sem tags internas. */
const um = (frag, re) => {
  const m = frag.match(re);
  return m ? norm(m[1].replace(/<[^>]*>/g, '')) : null;
};
const todos = (frag, re) => [...frag.matchAll(re)].map((m) => norm(m[1].replace(/<[^>]*>/g, '')));
const fmtLista = (l) => (l.length ? l.map((s) => JSON.stringify(s)).join(', ') : '(nada)');

// --- verificação -----------------------------------------------------------

const divergencias = [];
const contagem = { pt: 0, en: 0 };
const exigir = (ok, lang, chave, esperado, encontrado) => {
  contagem[lang]++;
  if (!ok) divergencias.push({ lang, chave, esperado, encontrado });
};

for (const [lang, ficheiro] of Object.entries(PAGINAS)) {
  const html = ler(ficheiro);
  const nos = new Set([...textos(html), ...atributos(html)]);

  // 1. Textos de interface: cada um tem de existir como nó ou atributo inteiro.
  for (const [secao, chaves] of Object.entries(canon.interface)) {
    for (const [chave, valor] of Object.entries(chaves)) {
      if (chave.startsWith('_') || valor[lang] === undefined) continue;
      exigir(nos.has(valor[lang]), lang, `interface.${secao}.${chave}`, valor[lang], 'não aparece como texto nem como atributo inteiro');
    }
  }

  // 2. Rodapé: a linha composta, segmento a segmento, com o ano gerado no build.
  const linhaRodape = canon.interface.rodape?._linha?.[lang];
  if (linhaRodape) {
    const footer = (html.match(/<footer\b[\s\S]*?<\/footer>/) || [''])[0];
    const achado = textos(footer);
    const esperado = linhaRodape.split(' · ').flatMap((s, i) => (i ? ['·', s] : [s]));
    const ano = new RegExp('^' + esperado[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\d{4}/, '\\d{4}') + '$');
    const ok = achado.length === esperado.length && ano.test(achado[0]) && esperado.slice(1).every((s, i) => achado[i + 1] === s);
    exigir(ok, lang, 'interface.rodape._linha', linhaRodape, achado.join(' '));
  }

  // 3. Competências: grupo a grupo, pela ordem, com provas e links.
  const secSkills = (html.match(/<section id="skills"[\s\S]*?<\/section>/) || [''])[0];
  const cartoes = secSkills.split('<div class="skill-card').slice(1);
  const rotuloTodos = canon.interface.competencias?.['skills-proof-all']?.[lang];
  const grupos = [...new Set(canon.competencias.itens.map((i) => i.grupo))];
  grupos.forEach((grupo, gi) => {
    const cartao = cartoes[gi] ?? '';
    const titulo = canon.interface.competencias?.[`skills-group-${grupo}`]?.[lang];
    if (titulo) {
      const t = um(cartao, /<h3 class="skill-group-title">([\s\S]*?)<\/h3>/);
      exigir(t === titulo, lang, `competencias.${grupo} (título na posição ${gi + 1})`, titulo, t ?? '(grupo em falta)');
    }
    const esperados = canon.competencias.itens.filter((i) => i.grupo === grupo);
    const linhas = cartao.split('<li class="skill-row"').slice(1);
    const nomes = linhas.map((l) => um(l, /<span class="skill-tech">([\s\S]*?)<\/span>/) ?? '');
    exigir(
      JSON.stringify(nomes) === JSON.stringify(esperados.map((i) => i.name)),
      lang, `competencias.${grupo} (nomes e ordem)`, fmtLista(esperados.map((i) => i.name)), fmtLista(nomes),
    );
    for (const item of esperados) {
      const li = linhas[nomes.indexOf(item.name)];
      if (li === undefined) continue; // já reportado acima
      const provas = [...li.matchAll(/<(a|span) class="proof-(link|private)"(?: href="([^"]*)")?[^>]*>([\s\S]*?)<\/\1>/g)]
        .map((m) => ({ tipo: m[2], href: m[3] ? decode(m[3]) : null, rotulo: norm(m[4]) }));
      const esperadas = item.proofs.map((p) =>
        p.allRepos ? { tipo: 'link', href: GITHUB, rotulo: rotuloTodos }
        : p.private ? { tipo: 'private', href: null, rotulo: p.repo }
        : { tipo: 'link', href: `${GITHUB}/${p.repo}`, rotulo: p.repo });
      const fmt = (l) => l.map((p) => (p.tipo === 'private' ? `${p.rotulo} (sem link)` : `${p.rotulo ?? '*'} -> ${p.href}`)).join(' · ') || '(nada)';
      const ok = provas.length === esperadas.length
        && esperadas.every((e, k) => provas[k].tipo === e.tipo && provas[k].href === e.href && (e.rotulo === undefined || provas[k].rotulo === e.rotulo));
      exigir(ok, lang, `competencias.${item.name} (provas)`, fmt(esperadas), fmt(provas));
    }
  });
  const textoSkills = textos(secSkills);
  for (const r of canon.competencias.removidas) {
    const onde = textoSkills.filter((t) => t.includes(r));
    exigir(onde.length === 0, lang, `competencias: "${r}" continua fora`, 'ausente', fmtLista(onde));
  }

  // 4. Projetos: ordem, e o texto de cada um dentro do seu cartão e da sua modal.
  const ordemDist = [...html.matchAll(/data-modal="modal-([^"]+)"/g)].map((m) => m[1]);
  exigir(
    JSON.stringify(ordemDist) === JSON.stringify(canon.projetos.ordem.slugs),
    lang, 'projetos.ordem', canon.projetos.ordem.slugs.join(', '), ordemDist.join(', '),
  );
  for (const [slug, p] of Object.entries(canon.projetos)) {
    if (slug === 'ordem') continue;
    const iBotao = html.indexOf(`data-modal="modal-${slug}"`);
    const iCartao = iBotao < 0 ? -1 : html.lastIndexOf('<div class="project-card', iBotao);
    const cartao = iCartao < 0 ? '' : html.slice(iCartao, iBotao);
    const iModal = html.indexOf(`<div class="modal" id="modal-${slug}"`);
    const fimModal = iModal < 0 ? -1 : html.indexOf('<div class="modal" id="modal-', iModal + 1);
    const modal = iModal < 0 ? '' : html.slice(iModal, fimModal < 0 ? undefined : fimModal);
    const c = `projetos.${slug}`;

    if (p.title) {
      exigir(um(cartao, /<h3 class="project-title">([\s\S]*?)<\/h3>/) === p.title[lang], lang, `${c}.title (cartão)`, p.title[lang], um(cartao, /<h3 class="project-title">([\s\S]*?)<\/h3>/) ?? '(cartão em falta)');
      exigir(um(modal, /<h3 class="modal-title"[^>]*>([\s\S]*?)<\/h3>/) === p.title[lang], lang, `${c}.title (modal)`, p.title[lang], um(modal, /<h3 class="modal-title"[^>]*>([\s\S]*?)<\/h3>/) ?? '(modal em falta)');
    }
    if (p.tagline) {
      const t = um(cartao, /<p class="project-tagline">([\s\S]*?)<\/p>/);
      exigir(t === p.tagline[lang], lang, `${c}.tagline`, p.tagline[lang], t ?? '(sem tagline)');
    }
    if (p.tech) {
      const t = todos(cartao, /<span class="tech-badge">([\s\S]*?)<\/span>/g);
      exigir(JSON.stringify(t) === JSON.stringify(p.tech), lang, `${c}.tech`, fmtLista(p.tech), fmtLista(t));
    }
    if (p.description) {
      const t = um(modal, /<p class="modal-desc">([\s\S]*?)<\/p>/);
      exigir(t === p.description[lang], lang, `${c}.description`, p.description[lang], t ?? '(sem descrição)');
    }
    if (p.features) {
      const ul = um.call(null, modal, /<ul class="modal-features">([\s\S]*?)<\/ul>/) === null ? '' : modal.match(/<ul class="modal-features">([\s\S]*?)<\/ul>/)[1];
      const t = todos(ul, /<li>([\s\S]*?)<\/li>/g);
      exigir(t.length === p.features.length, lang, `${c}.features (quantidade)`, String(p.features.length), String(t.length));
      p.features.forEach((f, i) => exigir(t[i] === f[lang], lang, `${c}.features[${i}]`, f[lang], t[i] ?? '(em falta)'));
    }
    // Botões da modal: só quando o enunciado fixou os dois URLs.
    if (p.repoUrl !== undefined && p.demoUrl !== undefined) {
      const hrefs = [...modal.matchAll(/<a href="([^"]*)"[^>]*class="btn-modal"/g)].map((m) => decode(m[1]));
      const esperado = [p.demoUrl, p.repoUrl].filter(Boolean);
      exigir(JSON.stringify(hrefs) === JSON.stringify(esperado), lang, `${c} (links da modal)`, fmtLista(esperado), fmtLista(hrefs));
    }
    if (p.status === 'in-development') {
      const rotulo = canon.interface.projetos['project-status-in-development'][lang];
      const t = um(modal, /<span class="btn-modal btn-modal-disabled"[^>]*>([\s\S]*?)<\/span>/);
      exigir(t === rotulo, lang, `${c} (estado em desenvolvimento)`, rotulo, t ?? '(sem rótulo inerte)');
    }
  }
}

// --- relatório -------------------------------------------------------------

const fora = canon._fora_do_canonico ?? { interface: [], projetos: {} };
const foraProj = Object.entries(fora.projetos);
console.log(`check:texto — ${CANONICO} vs dist/`);
console.log(`  pt: ${contagem.pt} verificações em ${PAGINAS.pt}`);
console.log(`  en: ${contagem.en} verificações em ${PAGINAS.en}`);
console.log('');
console.log(`Não coberto pelo canónico (informativo, não falha): ${fora.interface.length} chave(s) de i18n e campos de ${foraProj.length} projeto(s)`);
console.log(`  i18n: ${fora.interface.join(', ')}`);
for (const [slug, campos] of foraProj) console.log(`  ${slug}: ${campos.join(', ')}`);
console.log('');

if (divergencias.length) {
  console.error(`✗ ${divergencias.length} divergência(s):`);
  for (const d of divergencias) {
    console.error(`\n  [${d.lang}] ${d.chave}`);
    console.error(`    canónico : ${d.esperado}`);
    console.error(`    dist     : ${d.encontrado}`);
  }
  console.error('\ncheck:texto FALHOU');
  process.exit(1);
}
console.log(`✓ ${contagem.pt + contagem.en} verificações, zero divergências`);
console.log('\ncheck:texto OK');
