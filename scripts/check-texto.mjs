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
 *   - o texto de cada projeto é procurado dentro do bloco desse projeto na
 *     lista (destaque ou linha) e, nos que não têm case study, na sua modal —
 *     não em qualquer sítio da página;
 *   - cada competência é verificada no seu grupo, pela ordem, com as provas
 *     e os links que a acompanham;
 *   - cada case study é verificado na sua própria página, secção a secção e
 *     parágrafo a parágrafo, com o título de cada secção, os links de volta, o
 *     title e a meta description; os projetos sem case study não podem ter nem
 *     página nem botão;
 *   - o CV (fase 9) é verificado na sua página, nas duas línguas: o SEO, o nome, o
 *     bloco pessoal, os links, cada secção e cada item parte a parte, e no fim o
 *     <main> inteiro pela ordem, sem nenhum texto a mais; e o botão do hero tem de
 *     levar a essa página, na mesma língua.
 *
 * O texto sem aprovação é listado como não coberto, para a lacuna ficar à vista
 * em vez de passar em silêncio. A cobertura do i18n é calculada aqui: uma chave
 * nova sem texto aprovado aparece sozinha.
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
/** O domínio do site, lido do public/CNAME: o check não importa código nem configuração do site. */
const SITE = `https://${ler('public/CNAME').trim()}`;
const siteJson = JSON.parse(ler('src/data/site.json'));
/** Onde vive o CV. Repete src/lib/cv.ts de propósito. */
const rotaCvDe = (lang) => (lang === 'pt' ? '/cv/' : '/en/cv/');

for (const f of [CANONICO, ...Object.values(PAGINAS)]) {
  if (!fs.existsSync(path.join(root, f))) {
    console.error(`✗ ficheiro em falta: ${f}${f.startsWith('dist') ? ' — corre npm run build primeiro' : ''}`);
    process.exit(1);
  }
}
const canon = JSON.parse(ler(CANONICO));

// --- HTML -> texto ---------------------------------------------------------

const ENTIDADES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', copy: '©', times: '×' };
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
/** Links de um fragmento, com href, classes e texto. */
const ancoras = (frag) =>
  [...frag.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].map((m) => ({
    href: decode((m[1].match(/\bhref="([^"]*)"/) || ['', ''])[1]),
    classes: (m[1].match(/\bclass="([^"]*)"/) || ['', ''])[1].split(/\s+/),
    texto: norm(m[2].replace(/<[^>]*>/g, '')),
  }));

// --- case studies ------------------------------------------------------------

/** Onde vive cada página. Repete src/lib/caseStudy.ts de propósito: o check não importa código do site. */
const rotaCase = (slug, lang) => (lang === 'pt' ? `/projetos/${slug}/` : `/en/projects/${slug}/`);
/** Ordem fixa das secções: o id na página, o campo no caseStudy e a chave do título. */
const CASE_SECOES = [
  { id: 'contexto', campo: 'contexto', titulo: 'case-heading-context' },
  { id: 'problema', campo: 'problema', titulo: 'case-heading-problem' },
  { id: 'minha-parte', campo: 'minhaParte', titulo: 'case-heading-my-part' },
  { id: 'decisoes', campo: 'decisoes', titulo: 'case-heading-decisions' },
  { id: 'correu-mal', campo: 'correuMal', titulo: 'case-heading-went-wrong' },
  { id: 'resultado', campo: 'resultado', titulo: 'case-heading-outcome' },
  { id: 'faria-diferente', campo: 'fariaDiferente', titulo: 'case-heading-differently' },
];
/** Um campo com vários parágrafos separa-os por uma linha em branco. */
const paragrafos = (s) => s.split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean);
/** A meta description é a umaFrase inteira, ou cortada numa palavra inteira e com reticências, até 155 caracteres. */
const resumoValido = (d, frase) => {
  if (d.length > 155) return false;
  if (d === frase) return true;
  if (!d.endsWith('…')) return false;
  const base = d.slice(0, -1);
  return base.length > 0 && frase.startsWith(base) && !/[\p{L}\p{N}]/u.test(frase[base.length] ?? '');
};

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
    // Os textos da página de case study só existem nessa página: verificam-se lá, no ponto 5.
    // Os do CV (fase 9), na página do CV, no ponto 7.
    if (secao === 'caseStudy' || secao === 'cv') continue;
    for (const [chave, valor] of Object.entries(chaves)) {
      if (chave.startsWith('_') || valor[lang] === undefined) continue;
      exigir(nos.has(valor[lang]), lang, `interface.${secao}.${chave}`, valor[lang], 'não aparece como texto nem como atributo inteiro');
    }
  }

  // 1a. SEO da página inicial, etiqueta a etiqueta.
  //
  //     O ponto 1 exige que cada texto de interface exista algures na página, como nó
  //     ou atributo inteiro. Isso chega para o texto que aparece uma vez, mas não para
  //     o que aparece repetido: o título vem 4 vezes (title, og:title, twitter:title e
  //     o cartão de partilha) e a descrição 3 (description, og:description,
  //     twitter:description). Corrompida uma cópia, as outras tapavam-na e o ponto 1
  //     continuava a passar — foi assim que uma sabotagem da meta descrição escapou na
  //     fase 6. Aqui compara-se etiqueta a etiqueta, e cada cópia responde por si.
  const seoTitulo = canon.interface.seo['meta-title'][lang];
  const seoDescricao = canon.interface.seo['meta-description'][lang];
  const etiqueta = (re) => {
    const m = html.match(re);
    return m ? norm(m[1]) : null;
  };
  [
    ['<title>', seoTitulo, /<title>([\s\S]*?)<\/title>/],
    ['meta description', seoDescricao, /<meta name="description" content="([^"]*)"/],
    ['og:title', seoTitulo, /<meta property="og:title" content="([^"]*)"/],
    ['og:description', seoDescricao, /<meta property="og:description" content="([^"]*)"/],
    ['twitter:title', seoTitulo, /<meta name="twitter:title" content="([^"]*)"/],
    ['twitter:description', seoDescricao, /<meta name="twitter:description" content="([^"]*)"/],
  ].forEach(([nome, esperado, re]) => {
    const achado = etiqueta(re);
    exigir(achado === esperado, lang, `seo.${nome}`, esperado, achado ?? '(a etiqueta não existe)');
  });

  // 1b. Cabeçalhos de secção: o título e a régua, sem mais nada (fase 4.2c: saiu
  //     a linha com o número e o nome da secção).
  const textoI = Object.assign({}, ...Object.values(canon.interface));
  [['about', 'about-heading'], ['skills', 'skills-heading'], ['projects', 'projects-heading'], ['contacts', 'contacts-heading']]
    .forEach(([id, titulo]) => {
      const sec = (html.match(new RegExp(`<section id="${id}"[\\s\\S]*?</section>`)) || [''])[0];
      const cab = (sec.match(/<header class="section-header[^"]*">([\s\S]*?)<\/header>/) || ['', ''])[1];
      const h2 = um(cab, /<h2 class="section-heading">([\s\S]*?)<\/h2>/);
      const regua = cab.includes('class="section-rule"');
      const outros = textos(cab).filter((t) => t !== h2);
      exigir(
        h2 === textoI[titulo]?.[lang] && regua && outros.length === 0,
        lang, `cabeçalho da secção ${id}`, `${textoI[titulo]?.[lang]} + régua`,
        `${h2 ?? '(sem título)'}${regua ? ' + régua' : ' (sem régua)'}${outros.length ? ` + ${fmtLista(outros)}` : ''}`,
      );
    });

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
  const cartoes = secSkills.split('<div class="skill-group"').slice(1);
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
        // Fase 4.2d: as provas apontam para dentro do site. "todos" leva à secção de
        // projetos; um projeto com case study, à página; sem case study, à linha.
        // Fase 5.2: nos dados, todas as provas de projeto são "projeto" (a linha).
        p.allRepos ? { tipo: 'link', href: `${lang === 'pt' ? '/' : '/en/'}#projects`, rotulo: rotuloTodos }
        // Fase 5: o rótulo é o nome do projeto, por língua (campo "rotulo").
        : p.caseStudy ? { tipo: 'link', href: rotaCase(p.caseStudy, lang), rotulo: p.rotulo?.[lang] ?? null }
        : p.projeto ? { tipo: 'link', href: `${lang === 'pt' ? '/' : '/en/'}#projeto-${p.projeto}`, rotulo: p.rotulo?.[lang] ?? null }
        : p.private ? { tipo: 'private', href: null, rotulo: p.rotulo?.[lang] ?? p.repo }
        : { tipo: 'link', href: `${GITHUB}/${p.repo}`, rotulo: p.rotulo?.[lang] ?? null });
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

  // 4. Projetos (fase 4: lista, sem cartões). A ordem, e o texto de cada projeto
  //    no seu bloco — o destaque ou a linha — e, nos que não têm case study, na modal.
  const ordemDist = [...html.matchAll(/data-project="([^"]+)"/g)].map((m) => m[1]);
  exigir(
    JSON.stringify(ordemDist) === JSON.stringify(canon.projetos.ordem.slugs),
    lang, 'projetos.ordem', canon.projetos.ordem.slugs.join(', '), ordemDist.join(', '),
  );
  // A página inicial não mostra imagens de projetos, nem na lista nem nas modais:
  // a única imagem é o avatar, na secção Sobre. Os screenshots vivem nas páginas
  // de case study e nas imagens de partilha.
  const imgsHome = semScripts(html).match(/<img\b[^>]*>/g) || [];
  const altAvatar = canon.interface.acessibilidade['a11y-avatar-alt'][lang];
  exigir(
    imgsHome.length === 1 && imgsHome[0].includes(`alt="${altAvatar}"`),
    lang, 'página inicial (só o avatar, sem imagens de projetos)', `1 imagem, alt "${altAvatar}"`, `${imgsHome.length} imagem(ns)`,
  );
  // Só os projetos sem case study têm modal.
  const semCase = canon.projetos.ordem.slugs.filter((s) => !canon.projetos[s]?.caseStudy);
  const modaisDist = [...html.matchAll(/<div class="modal" id="modal-([^"]+)"/g)].map((m) => m[1]);
  exigir(JSON.stringify(modaisDist) === JSON.stringify(semCase), lang, 'modais (só os projetos sem case study)', semCase.join(', '), modaisDist.join(', ') || '(nenhuma)');

  const rotuloCase = canon.interface.projetos['project-btn-case-study'][lang];
  const rotuloRepo = canon.interface.projetos['modal-btn-repo'][lang];
  const rotuloDemo = canon.interface.projetos['modal-btn-project'][lang];
  const rotuloDev = canon.interface.projetos['project-status-in-development'][lang];
  /** Texto de um link de ação, sem a seta decorativa. */
  const semSeta = (s) => s.replace(/\s*→$/, '');
  const fmtLinks = (l) => l.map((a) => `${a.texto} -> ${a.href}`).join(' | ') || '(nenhum)';

  for (const [slug, p] of Object.entries(canon.projetos)) {
    if (slug === 'ordem') continue;
    const iAttr = html.indexOf(`data-project="${slug}"`);
    const iBloco = iAttr < 0 ? -1 : html.lastIndexOf('<', iAttr);
    // O bloco acaba onde começa o seguinte, ou no fim da secção de projetos.
    const iSeguinte = iAttr < 0 ? -1 : html.indexOf('data-project="', iAttr + 1);
    const fimBloco = iSeguinte > 0 ? html.lastIndexOf('<', iSeguinte) : html.indexOf('</section>', iAttr);
    const bloco = iBloco < 0 ? '' : html.slice(iBloco, fimBloco);
    const iModal = html.indexOf(`<div class="modal" id="modal-${slug}"`);
    const fimModal = iModal < 0 ? -1 : html.indexOf('<div class="modal" id="modal-', iModal + 1);
    const modal = iModal < 0 ? '' : html.slice(iModal, fimModal < 0 ? undefined : fimModal);
    const c = `projetos.${slug}`;
    const cs = p.caseStudy;

    // Cada campo só é verificado nas línguas que o canónico fixa.
    if (p.title?.[lang] !== undefined) {
      const tb = um(bloco, /<h[34] class="project-title">([\s\S]*?)<\/h[34]>/);
      exigir(tb === p.title[lang], lang, `${c}.title (lista)`, p.title[lang], tb ?? '(bloco em falta)');
      if (!cs) {
        const tm = um(modal, /<h3 class="modal-title"[^>]*>([\s\S]*?)<\/h3>/);
        exigir(tm === p.title[lang], lang, `${c}.title (modal)`, p.title[lang], tm ?? '(modal em falta)');
      }
    }
    if (p.tagline?.[lang] !== undefined) {
      // Fase 4.2d: a etiqueta fica por baixo do título, na sua própria linha.
      const meta = (bloco.match(/<\/h[34]>\s*<div class="project-meta">([\s\S]*?)<\/div>/) || ['', ''])[1];
      const t = um(meta, /<span class="project-tagline">([\s\S]*?)<\/span>/);
      exigir(t === p.tagline[lang], lang, `${c}.tagline`, p.tagline[lang], t ?? '(sem tagline)');
    }
    // Fase 4.2d: botão "?" com o texto da nota, só nos projetos que a têm nos dados.
    {
      const nota = JSON.parse(ler(`src/content/projects/${slug}.json`)).nota;
      const botoes = bloco.match(/<button type="button" class="info-btn"[^>]*>/g) || [];
      if (nota) {
        const b = botoes[0] ?? '';
        const aria = decode((b.match(/aria-label="([^"]*)"/) || ['', ''])[1]);
        const balao = um(bloco, new RegExp(`<p id="nota-${slug}" class="info-balao"[^>]*>([\\s\\S]*?)</p>`));
        const esperadoAria = textoI['a11y-more-info']?.[lang];
        exigir(
          botoes.length === 1 && aria === esperadoAria && b.includes(`aria-controls="nota-${slug}"`) && b.includes('aria-expanded="false"') && balao === textoI[nota]?.[lang],
          lang, `${c} (botão de informação)`, `"?" [${esperadoAria}] -> ${textoI[nota]?.[lang]}`, `${botoes.length} botão(ões), aria "${aria}", texto ${balao ?? '(em falta)'}`,
        );
      } else {
        exigir(botoes.length === 0, lang, `${c} (sem botão de informação)`, 'nenhum', `${botoes.length} botão(ões)`);
      }
    }
    // tech: lista comum às duas línguas, ou { pt: [...], en: [...] } quando diferem.
    const tech = Array.isArray(p.tech) ? p.tech : p.tech?.[lang];
    if (tech) {
      const t = todos(bloco, /<li class="project-tech">([\s\S]*?)<\/li>/g);
      exigir(JSON.stringify(t) === JSON.stringify(tech), lang, `${c}.tech`, fmtLista(tech), fmtLista(t));
    }
    // O imageAlt só aparece nas páginas de case study (ponto 5): a página inicial
    // não mostra imagens de projetos, nem na lista nem nas modais.
    // Fase 4.2a: a lista mostra uma frase por projeto (resumo). A descrição longa
    // só aparece na modal dos projetos sem case study.
    {
      const t = um(bloco, /<p class="project-desc">([\s\S]*?)<\/p>/);
      exigir(
        p.resumo?.[lang] !== undefined && t === p.resumo[lang],
        lang, `${c}.resumo (lista)`, p.resumo?.[lang] ?? '(sem resumo no canónico)', t ?? '(sem frase)',
      );
    }
    // Fase 4.2b: a modal não tem descrição. A frase da linha é a descrição, e
    // repeti-la na modal seria o mesmo texto duas vezes.
    if (!cs) {
      const comDescricao = modal.includes('class="modal-desc"');
      const semVirgulas = (s) => s.replace(/,/g, '');
      const repete = p.resumo?.[lang] !== undefined && textos(modal).some((t) => semVirgulas(t).includes(semVirgulas(p.resumo[lang])));
      exigir(
        modal !== '' && !comDescricao && !repete,
        lang, `${c} (modal sem descrição nem a frase da linha)`, 'sem descrição',
        modal === '' ? '(modal em falta)' : `${comDescricao ? 'com descrição' : 'sem descrição'}${repete ? ', repete a frase da linha' : ''}`,
      );
    }
    // As features só aparecem na modal. Os projetos com case study já não a têm,
    // e as features deles ficam no canónico sem aparecer (caseStudies._fase4).
    if (p.features && !cs) {
      const ul = (modal.match(/<ul class="modal-features">([\s\S]*?)<\/ul>/) || ['', ''])[1];
      const t = todos(ul, /<li>([\s\S]*?)<\/li>/g);
      exigir(t.length === p.features.length, lang, `${c}.features (quantidade)`, String(p.features.length), String(t.length));
      p.features.forEach((f, i) => exigir(t[i] === f[lang], lang, `${c}.features[${i}]`, f[lang], t[i] ?? '(em falta)'));
    }
    // Botões da modal: só quando o enunciado fixou os dois URLs.
    if (!cs && p.repoUrl !== undefined && p.demoUrl !== undefined) {
      const hrefs = [...modal.matchAll(/<a href="([^"]*)"[^>]*class="btn-modal"/g)].map((m) => decode(m[1]));
      const esperado = [p.demoUrl, p.repoUrl].filter(Boolean);
      exigir(JSON.stringify(hrefs) === JSON.stringify(esperado), lang, `${c} (links da modal)`, fmtLista(esperado), fmtLista(hrefs));
    }
    if (p.status === 'in-development') {
      const t = um(bloco, /<span class="project-status-disabled"[^>]*>([\s\S]*?)<\/span>/);
      exigir(t === rotuloDev, lang, `${c} (estado em desenvolvimento)`, rotuloDev, t ?? '(sem rótulo inerte)');
    }

    // 5. A ação da linha: o case study, com página própria — ou a modal e o
    //    repositório, sem página.
    const hrefCase = rotaCase(slug, lang);
    const ficheiroCase = path.join(root, 'dist', hrefCase, 'index.html');
    const acoesCase = ancoras(bloco).filter((a) => a.classes.includes('project-case-link'));
    const gatilhos = bloco.match(/data-modal="[^"]*"/g) || [];
    if (!cs) {
      exigir(acoesCase.length === 0, lang, `${c} (sem case study: sem link)`, 'nenhum link de case study', fmtLinks(acoesCase));
      exigir(
        gatilhos.length === 1 && gatilhos[0] === `data-modal="modal-${slug}"` && modal !== '',
        lang, `${c} (sem case study: abre a modal)`, `data-modal="modal-${slug}" e a modal`, `${gatilhos.join(' ') || '(sem botão)'}${modal ? '' : ', sem modal'}`,
      );
      const repo = ancoras(bloco).filter((a) => a.classes.includes('project-repo-link'));
      const hrefRepo = p.repoUrl ?? repo[0]?.href;
      exigir(
        repo.length === 1 && repo[0].href === hrefRepo && hrefRepo?.startsWith(GITHUB) && semSeta(repo[0].texto) === rotuloRepo,
        lang, `${c} (ação: repositório)`, `${rotuloRepo} -> ${p.repoUrl ?? `${GITHUB}/…`}`, fmtLinks(repo),
      );
      exigir(!fs.existsSync(ficheiroCase), lang, `${c} (sem case study: sem página)`, 'sem página', `existe dist${hrefCase}index.html`);
      continue;
    }
    exigir(modal === '' && gatilhos.length === 0, lang, `${c} (com case study: sem modal)`, 'sem modal nem botão de modal', `${modal ? 'modal presente, ' : ''}${gatilhos.length} botão(ões)`);
    exigir(
      acoesCase.length === 1 && acoesCase[0].href === hrefCase && semSeta(acoesCase[0].texto) === rotuloCase,
      lang, `${c} (ação: case study)`, `${rotuloCase} -> ${hrefCase}`, fmtLinks(acoesCase),
    );
    if (!fs.existsSync(ficheiroCase)) {
      exigir(false, lang, `${c}.caseStudy (página)`, `dist${hrefCase}index.html`, '(não existe)');
      continue;
    }
    const pag = fs.readFileSync(ficheiroCase, 'utf8');
    const cc = `${c}.caseStudy`;
    const rotulos = canon.interface.caseStudy ?? {};
    const tituloEsperado = `${p.title[lang]} — Francisco Pereira`;
    const tituloPag = um(pag, /<title>([\s\S]*?)<\/title>/);
    exigir(tituloPag === tituloEsperado, lang, `${cc} (title)`, tituloEsperado, tituloPag ?? '(sem title)');
    const desc = norm((pag.match(/<meta name="description" content="([^"]*)"/) || ['', ''])[1]);
    exigir(resumoValido(desc, cs.umaFrase[lang]), lang, `${cc} (meta description)`, 'a umaFrase, inteira ou cortada numa palavra, até 155 caracteres', `${desc} (${desc.length} caracteres)`);
    const h1 = um(pag, /<h1 class="case-title">([\s\S]*?)<\/h1>/);
    exigir(h1 === p.title[lang], lang, `${cc} (h1)`, p.title[lang], h1 ?? '(sem h1)');
    const lede = um(pag, /<p class="case-lede">([\s\S]*?)<\/p>/);
    exigir(lede === cs.umaFrase[lang], lang, `${cc}.umaFrase`, cs.umaFrase[lang], lede ?? '(em falta)');

    // Fase 4.2a: as páginas de case study são só texto — nenhuma imagem, nenhuma
    // figura. O screenshot continua a servir a imagem de partilha (og:image).
    const imgsPag = pag.match(/<img\b[^>]*>/g) || [];
    exigir(
      imgsPag.length === 0 && !pag.includes('<figure'),
      lang, `${cc} (sem imagens na página)`, 'nenhuma imagem nem figura', `${imgsPag.length} imagem(ns)${pag.includes('<figure') ? ', com figura' : ''}`,
    );

    // Links que saíram da modal: demonstração e repositório, com os rótulos de
    // sempre — a lista exata quando o enunciado fixou os dois URLs.
    const blocoLinks = (pag.match(/<div class="case-links">([\s\S]*?)<\/div>/) || ['', ''])[1];
    const links = ancoras(blocoLinks);
    if (p.repoUrl !== undefined && p.demoUrl !== undefined) {
      const esperado = [p.demoUrl && `${rotuloDemo} -> ${p.demoUrl}`, p.repoUrl && `${rotuloRepo} -> ${p.repoUrl}`].filter(Boolean);
      const achado = links.map((a) => `${a.texto} -> ${a.href}`);
      exigir(JSON.stringify(achado) === JSON.stringify(esperado), lang, `${cc} (links)`, fmtLista(esperado), fmtLista(achado));
    } else {
      exigir(links.length > 0 && links.every((a) => a.texto === rotuloDemo || a.texto === rotuloRepo), lang, `${cc} (links)`, `${rotuloDemo} e/ou ${rotuloRepo}`, fmtLinks(links));
    }
    if (p.status === 'in-development') {
      const t = um(pag, /<span class="case-status"[^>]*>([\s\S]*?)<\/span>/);
      exigir(t === rotuloDev, lang, `${cc} (estado em desenvolvimento)`, rotuloDev, t ?? '(sem rótulo inerte)');
    }
    // A nota de arranque a frio aparece nos projetos marcados com coldStart nos dados.
    const frio = JSON.parse(ler(`src/content/projects/${slug}.json`)).coldStart === true;
    const rotuloFrio = rotulos['modal-tooltip-note']?.[lang];
    const notas = todos(pag, /<p class="case-note">([\s\S]*?)<\/p>/g);
    exigir(
      frio ? notas.length === 1 && notas[0] === rotuloFrio : notas.length === 0,
      lang, `${cc} (nota de arranque a frio)`, frio ? rotuloFrio : '(nenhuma)', fmtLista(notas),
    );
    const voltarRotulo = rotulos['case-back']?.[lang];
    if (voltarRotulo !== undefined) {
      const voltar = ancoras(pag).filter((a) => a.classes.includes('case-back'));
      const destino = `${lang === 'pt' ? '/' : '/en/'}#projects`;
      exigir(
        voltar.length === 2 && voltar.every((a) => a.href === destino && a.texto.replace(/^←\s*/, '') === voltarRotulo),
        lang, `${cc} (links de volta, topo e fim)`, `2 × ${voltarRotulo} -> ${destino}`, voltar.map((a) => `${a.texto} -> ${a.href}`).join(' | ') || '(nenhum)',
      );
    }
    const ids = [...pag.matchAll(/<section id="([^"]+)" class="case-section"/g)].map((m) => m[1]);
    // "A minha parte" é opcional (só projetos de equipa): sem o campo, a secção não existe.
    const secoesEsperadas = CASE_SECOES.filter((s) => cs[s.campo] !== undefined);
    const idsEsperados = secoesEsperadas.map((s) => s.id);
    exigir(JSON.stringify(ids) === JSON.stringify(idsEsperados), lang, `${cc} (secções e ordem)`, idsEsperados.join(', '), ids.join(', ') || '(nenhuma)');
    const cmpParagrafos = (chave, texto, frag) => {
      const esperado = paragrafos(texto);
      const achado = todos(frag, /<p>([\s\S]*?)<\/p>/g);
      exigir(achado.length === esperado.length, lang, `${chave} (parágrafos)`, String(esperado.length), String(achado.length));
      esperado.forEach((e, i) => exigir(achado[i] === e, lang, `${chave} ¶${i + 1}`, e, achado[i] ?? '(em falta)'));
    };
    for (const { id, campo, titulo } of secoesEsperadas) {
      const sec = (pag.match(new RegExp(`<section id="${id}" class="case-section"[\\s\\S]*?</section>`)) || [''])[0];
      const tituloSec = rotulos[titulo]?.[lang];
      if (tituloSec !== undefined) {
        const h2 = um(sec, /<h2[^>]*>([\s\S]*?)<\/h2>/);
        exigir(h2 === tituloSec, lang, `${cc} (título da secção ${id})`, tituloSec, h2 ?? '(sem título)');
      }
      if (campo !== 'decisoes') {
        cmpParagrafos(`${cc}.${campo}`, cs[campo][lang], sec);
        continue;
      }
      const itens = sec.split('<li class="case-decision"').slice(1);
      exigir(itens.length === cs.decisoes.length, lang, `${cc}.decisoes (quantidade)`, String(cs.decisoes.length), String(itens.length));
      cs.decisoes.forEach((d, i) => {
        const li = itens[i] ?? '';
        const h3 = um(li, /<h3>([\s\S]*?)<\/h3>/);
        exigir(h3 === d.titulo[lang], lang, `${cc}.decisoes[${i}].titulo`, d.titulo[lang], h3 ?? '(em falta)');
        cmpParagrafos(`${cc}.decisoes[${i}].texto`, d.texto[lang], li);
      });
    }
  }

  // 6. Nem páginas de case study a mais, nem a menos.
  const pastaCase = path.join(root, 'dist', lang === 'pt' ? 'projetos' : 'en/projects');
  const geradas = fs.existsSync(pastaCase) ? fs.readdirSync(pastaCase).sort() : [];
  const comCase = canon.projetos.ordem.slugs.filter((s) => canon.projetos[s]?.caseStudy).sort();
  exigir(JSON.stringify(geradas) === JSON.stringify(comCase), lang, 'case studies (páginas geradas)', comCase.join(', ') || '(nenhuma)', geradas.join(', ') || '(nenhuma)');
  // A decisão sobre quem tem case study está registada no canónico; o texto e as páginas têm de bater com ela.
  if (canon.caseStudies) {
    const decididos = [...canon.caseStudies.com].sort();
    exigir(JSON.stringify(comCase) === JSON.stringify(decididos), lang, 'case studies (decisão registada: com página)', decididos.join(', '), comCase.join(', ') || '(nenhum)');
    const semMasComTexto = canon.caseStudies.sem.filter((s) => canon.projetos[s]?.caseStudy || geradas.includes(s));
    exigir(semMasComTexto.length === 0, lang, 'case studies (decisão registada: sem página)', `${canon.caseStudies.sem.join(', ')} sem case study`, semMasComTexto.join(', ') || '(nenhum)');
  }

  // 7. O CV (fase 9): o botão do hero e a página /cv/ (ou /en/cv/), secção a secção,
  //    item a item, e no fim a sequência inteira do <main> — nada a mais e nada fora
  //    de ordem. Os títulos e o botão vêm de interface.cv; o resto, da secção cv.
  {
    const rotaCv = rotaCvDe(lang);
    const rotuloHero = canon.interface.hero['hero-btn-cv'][lang];
    const heroBotoes = (html.match(/<div class="hero-buttons">([\s\S]*?)<\/div>/) || ['', ''])[1];
    const paraCv = [...heroBotoes.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].filter((m) => norm(m[2].replace(/<[^>]*>/g, '')) === rotuloHero);
    const attrs = paraCv[0]?.[1] ?? '';
    exigir(
      paraCv.length === 1 && decode((attrs.match(/\bhref="([^"]*)"/) || ['', ''])[1]) === rotaCv && !/\sdownload\b/.test(attrs) && !/\starget=/.test(attrs),
      lang, 'hero: botão do CV', `${rotuloHero} -> ${rotaCv}, sem download`, paraCv.length ? `${rotuloHero} [${attrs.trim()}]` : '(não existe)',
    );

    const ficheiroCv = path.join(root, 'dist', rotaCv, 'index.html');
    if (!fs.existsSync(ficheiroCv)) {
      exigir(false, lang, 'cv (página)', `dist${rotaCv}index.html`, '(não existe)');
    } else {
      const pag = fs.readFileSync(ficheiroCv, 'utf8');
      const cv = canon.cv;
      const ui = canon.interface.cv;
      const L = (o) => o[lang];
      const SEP = ['·', '—'];

      // SEO, etiqueta a etiqueta, e as duas línguas ligadas por hreflang.
      const tituloCv = L(ui['cv-meta-title']);
      const etiquetaCv = (re) => { const m = pag.match(re); return m ? norm(m[1]) : null; };
      [['<title>', /<title>([\s\S]*?)<\/title>/], ['og:title', /<meta property="og:title" content="([^"]*)"/], ['twitter:title', /<meta name="twitter:title" content="([^"]*)"/]]
        .forEach(([nome, re]) => { const a = etiquetaCv(re); exigir(a === tituloCv, lang, `cv (${nome})`, tituloCv, a ?? '(a etiqueta não existe)'); });
      [['meta description', /<meta name="description" content="([^"]*)"/], ['og:description', /<meta property="og:description" content="([^"]*)"/], ['twitter:description', /<meta name="twitter:description" content="([^"]*)"/]]
        .forEach(([nome, re]) => { const a = etiquetaCv(re) ?? ''; exigir(resumoValido(a, L(cv.resumo)), lang, `cv (${nome})`, 'o resumo, inteiro ou cortado numa palavra, até 155 caracteres', `${a} (${a.length} caracteres)`); });
      const alternativas = [...pag.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => `${m[1]} ${m[2]}`);
      const altEsperadas = [`pt-PT ${SITE}/cv/`, `en ${SITE}/en/cv/`, `x-default ${SITE}/cv/`];
      exigir(JSON.stringify(alternativas) === JSON.stringify(altEsperadas), lang, 'cv (hreflang)', altEsperadas.join(' | '), alternativas.join(' | ') || '(nenhuma)');

      const main = (pag.match(/<main\b[\s\S]*?<\/main>/) || [''])[0];

      // Um só h1, e é o nome.
      const h1s = todos(pag, /<h1[^>]*>([\s\S]*?)<\/h1>/g);
      exigir(h1s.length === 1 && h1s[0] === L(cv.nome), lang, 'cv.nome (o único h1)', L(cv.nome), fmtLista(h1s));

      // O bloco do nome: cargo, a linha pessoal e a fotografia, a única imagem da página.
      const topo = (main.match(/<header class="cv-topo">([\s\S]*?)<\/header>/) || ['', ''])[1];
      const cargo = um(topo, /<p class="cv-cargo">([\s\S]*?)<\/p>/);
      exigir(cargo === L(cv.cargo), lang, 'cv.cargo', L(cv.cargo), cargo ?? '(em falta)');
      const pessoal = textos((topo.match(/<p class="cv-pessoal">([\s\S]*?)<\/p>/) || ['', ''])[1]);
      const pessoalEsperado = [L(cv.localidade), siteJson.email];
      exigir(JSON.stringify(pessoal) === JSON.stringify(pessoalEsperado), lang, 'cv.localidade e o email', pessoalEsperado.join(' '), pessoal.join(' ') || '(em falta)');
      const imgs = semScripts(pag).match(/<img\b[^>]*>/g) || [];
      exigir(
        imgs.length === 1 && topo.includes(imgs[0]) && decode((imgs[0].match(/\balt="([^"]*)"/) || ['', ''])[1]) === L(cv.fotoAlt),
        lang, 'cv.fotoAlt (a única imagem, no bloco do nome)', `1 imagem, alt "${L(cv.fotoAlt)}"`, `${imgs.length} imagem(ns)${imgs[0] ? `, ${imgs[0].match(/\balt="[^"]*"/)?.[0] ?? 'sem alt'}` : ''}`,
      );

      // Os três links, por extenso, numa linha própria.
      const links = ancoras((main.match(/<ul class="cv-links">([\s\S]*?)<\/ul>/) || ['', ''])[1]).map((a) => `${a.texto} -> ${a.href}`);
      const porExtenso = (u) => u.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
      const linksEsperados = [`${porExtenso(SITE)} -> ${SITE}${lang === 'pt' ? '/' : '/en/'}`, `${porExtenso(siteJson.githubUrl)} -> ${siteJson.githubUrl}`, `${porExtenso(siteJson.linkedinUrl)} -> ${siteJson.linkedinUrl}`];
      exigir(JSON.stringify(links) === JSON.stringify(linksEsperados), lang, 'cv (os três links)', linksEsperados.join(' | '), links.join(' | ') || '(nenhum)');

      const resumo = um(main, /<p class="cv-resumo">([\s\S]*?)<\/p>/);
      exigir(resumo === L(cv.resumo), lang, 'cv.resumo', L(cv.resumo), resumo ?? '(em falta)');

      // O botão de descarregar: o PDF da mesma língua, que tem de existir no dist.
      const pdf = `/${lang === 'pt' ? siteJson.cvPath : siteJson.cvPathEn}`;
      const botoes = ancoras(main).filter((a) => a.classes.includes('cv-download'));
      const comDownload = /<a class="[^"]*cv-download[^"]*"[^>]*\sdownload\b/.test(main);
      exigir(
        botoes.length === 1 && botoes[0].texto === L(ui['cv-btn-download']) && botoes[0].href === pdf && comDownload && fs.existsSync(path.join(root, 'dist', pdf)),
        lang, 'cv (botão de descarregar)', `${L(ui['cv-btn-download'])} -> ${pdf} (download, e o ficheiro existe no dist)`,
        botoes.map((a) => `${a.texto} -> ${a.href}`).join(' | ') + (comDownload ? '' : ', sem download') + (fs.existsSync(path.join(root, 'dist', pdf)) ? '' : `, falta dist${pdf}`) || '(nenhum)',
      );

      // As secções, pela ordem, cada uma com o seu título.
      const CV_SECOES = [
        ['projetos', 'cv-heading-projects'], ['experiencia', 'cv-heading-experience'], ['educacao', 'cv-heading-education'],
        ['competencias', 'cv-heading-skills'], ['idiomas', 'cv-heading-languages'], ['interesses', 'cv-heading-interests'],
      ];
      const idsCv = [...main.matchAll(/<section id="([^"]+)" class="cv-secao"/g)].map((m) => m[1]);
      exigir(JSON.stringify(idsCv) === JSON.stringify(CV_SECOES.map(([id]) => id)), lang, 'cv (secções e ordem)', CV_SECOES.map(([id]) => id).join(', '), idsCv.join(', ') || '(nenhuma)');
      const secCv = {};
      for (const [id, chave] of CV_SECOES) {
        secCv[id] = (main.match(new RegExp(`<section id="${id}" class="cv-secao"[\\s\\S]*?</section>`)) || [''])[0];
        const h2 = um(secCv[id], /<h2[^>]*>([\s\S]*?)<\/h2>/);
        exigir(h2 === L(ui[chave]), lang, `interface.cv.${chave}`, L(ui[chave]), h2 ?? '(sem título)');
      }

      // Cada item, parte a parte: o título e a linha de baixo, com o "—" entre as partes.
      const itens = (id) => secCv[id].split('<li class="cv-item"').slice(1);
      const partes = (item, classe) => textos((item.match(new RegExp(`<p class="${classe}">([\\s\\S]*?)</p>`)) || ['', ''])[1]);
      const cmpItens = (id, lista, campos) => {
        const achados = itens(id);
        exigir(achados.length === lista.length, lang, `cv.${id} (quantidade)`, String(lista.length), String(achados.length));
        lista.forEach((x, i) => {
          for (const [classe, chaves] of campos) {
            const esperado = chaves.flatMap((k, j) => (j ? ['—', L(x[k])] : [L(x[k])]));
            const achado = partes(achados[i] ?? '', classe);
            exigir(JSON.stringify(achado) === JSON.stringify(esperado), lang, `cv.${id}[${i}].${chaves.join(' + ')}`, esperado.join(' '), achado.join(' ') || '(em falta)');
          }
        });
      };
      cmpItens('projetos', cv.projetos, [['cv-item-titulo', ['titulo', 'descricao']], ['cv-item-meta', ['tech', 'quando']]]);
      const mais = um(secCv.projetos, /<p class="cv-mais">([\s\S]*?)<\/p>/);
      exigir(mais === L(cv.projetosMais), lang, 'cv.projetosMais', L(cv.projetosMais), mais ?? '(em falta)');
      cmpItens('experiencia', cv.experiencia, [['cv-item-titulo', ['funcao', 'empresa']], ['cv-item-meta', ['papel', 'quando']], ['cv-item-linha', ['descricao']]]);
      cmpItens('educacao', cv.educacao, [['cv-item-titulo', ['curso']], ['cv-item-meta', ['escola', 'quando']]]);

      // Competências: rótulo e valor, par a par, numa grelha (dl).
      const dts = todos(secCv.competencias, /<dt>([\s\S]*?)<\/dt>/g);
      const dds = todos(secCv.competencias, /<dd>([\s\S]*?)<\/dd>/g);
      const pares = dts.map((d, i) => `${d} — ${dds[i] ?? '(sem valor)'}`);
      const paresEsperados = cv.competencias.map((c) => `${L(c.rotulo)} — ${L(c.valor)}`);
      exigir(JSON.stringify(pares) === JSON.stringify(paresEsperados) && dds.length === dts.length, lang, 'cv.competencias (rótulos, valores e ordem)', fmtLista(paresEsperados), fmtLista(pares));
      for (const id of ['idiomas', 'interesses']) {
        const t = um(secCv[id], /<p class="cv-simples">([\s\S]*?)<\/p>/);
        exigir(t === L(cv[id]), lang, `cv.${id}`, L(cv[id]), t ?? '(em falta)');
      }

      // No fim, o <main> inteiro, pela ordem: nenhum texto a mais, nenhum fora do sítio.
      const sequencia = textos(main).filter((t) => !SEP.includes(t));
      const sequenciaEsperada = [
        L(ui['cv-btn-download']), L(cv.nome), L(cv.cargo), L(cv.localidade), siteJson.email,
        ...linksEsperados.map((l) => l.split(' -> ')[0]), L(cv.resumo),
        L(ui['cv-heading-projects']), ...cv.projetos.flatMap((p) => [p.titulo, p.descricao, p.tech, p.quando].map(L)), L(cv.projetosMais),
        L(ui['cv-heading-experience']), ...cv.experiencia.flatMap((e) => [e.funcao, e.empresa, e.papel, e.quando, e.descricao].map(L)),
        L(ui['cv-heading-education']), ...cv.educacao.flatMap((e) => [e.curso, e.escola, e.quando].map(L)),
        L(ui['cv-heading-skills']), ...cv.competencias.flatMap((c) => [c.rotulo, c.valor].map(L)),
        L(ui['cv-heading-languages']), L(cv.idiomas), L(ui['cv-heading-interests']), L(cv.interesses),
      ];
      const primeira = sequenciaEsperada.findIndex((e, i) => sequencia[i] !== e);
      exigir(
        primeira < 0 && sequencia.length === sequenciaEsperada.length,
        lang, `cv (o <main> inteiro: ${sequenciaEsperada.length} textos, pela ordem, e nada a mais)`,
        primeira < 0 ? `${sequenciaEsperada.length} textos` : `na posição ${primeira + 1}: ${sequenciaEsperada[primeira]}`,
        primeira < 0 ? `${sequencia.length} textos${sequencia.length > sequenciaEsperada.length ? `, a mais: ${fmtLista(sequencia.slice(sequenciaEsperada.length))}` : ''}` : sequencia[primeira] ?? '(acabou antes)',
      );
    }
  }
}

// --- relatório -------------------------------------------------------------

const fora = canon._fora_do_canonico ?? { interface: [], projetos: {} };
const foraProj = Object.entries(fora.projetos);
const cobertas = {};
for (const sec of Object.values(canon.interface)) for (const [k, v] of Object.entries(sec)) if (!k.startsWith('_')) cobertas[k] = v;
const foraI18n = Object.keys(JSON.parse(ler('src/i18n/pt.json'))).flatMap((k) => {
  const f = ['pt', 'en'].filter((l) => cobertas[k]?.[l] === undefined);
  return f.length === 2 ? [k] : f.length === 1 ? [`${k} [${f[0]}]`] : [];
});
const casesVerificados = canon.projetos.ordem.slugs.filter((s) => canon.projetos[s]?.caseStudy);

console.log(`check:texto — ${CANONICO} vs dist/`);
console.log(`  pt: ${contagem.pt} verificações (página inicial, case studies e CV)`);
console.log(`  en: ${contagem.en} verificações (página inicial, case studies e CV)`);
console.log(`  case studies: ${casesVerificados.join(', ') || '(nenhum)'}`);
console.log('');
console.log(`Não coberto pelo canónico (informativo, não falha): ${foraI18n.length} chave(s) de i18n e campos de ${foraProj.length} projeto(s)`);
console.log(`  i18n: ${foraI18n.join(', ') || '(nenhuma)'}`);
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
