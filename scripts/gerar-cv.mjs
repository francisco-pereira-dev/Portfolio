#!/usr/bin/env node
/**
 * npm run cv — gera os dois PDF do CV a partir das páginas /cv/ e /en/cv/.
 *
 * Corre depois de `npm run build`. Arranca o `astro preview` sozinho se não houver
 * nenhum a responder, e pára-o no fim (o mesmo servidor das auditorias, comum.mjs).
 * Usa o Playwright e o Chromium que já estão no projeto.
 *
 * Para cada língua abre a página no tema ESCURO, de propósito: o CSS de impressão
 * (src/styles/cv.css) tem de dar uma folha branca seja qual for o tema. Depois
 * emula a impressão e gera o PDF em A4.
 *
 *   PT → public/assets/docs/CV.pdf      (o caminho de sempre, substituído)
 *   EN → public/assets/docs/CV-en.pdf
 *
 * Três guardas. Se qualquer uma falhar, em qualquer das línguas, o comando sai com
 * código 1 e NÃO escreve nenhum dos dois PDF — os que lá estão ficam como estavam:
 *   1. o PDF tem exatamente 1 página (diz quantas tem, e quanto falta na folha);
 *   2. o texto é extraível: não está vazio nem é uma imagem;
 *   3. o texto do PDF bate com o canónico: cada string do CV, na língua certa, no
 *      seu sítio e pela ordem certa, e nada a mais — lista todas as divergências.
 * E uma verificação do fundo: no PDF, a folha e todos os retângulos grandes são
 * brancos (o texto escuro não conta, é texto).
 *
 * O texto é lido do PDF sem bibliotecas: o leitor mínimo mais abaixo, antes da
 * geração, percorre os objetos, descomprime os fluxos (zlib do Node), lê o CMap ToUnicode de
 * cada fonte e interpreta os operadores de texto. Chega para os PDF do Chromium.
 *
 * Os PDF são reproduzíveis (fase 10): o Chromium grava a hora da geração no
 * dicionário /Info (/CreationDate e /ModDate), e mais nada muda de uma geração para
 * a outra. Essas duas entradas são apagadas antes das guardas (semDatas), e por isso
 * o mesmo texto dá sempre os mesmos bytes — e o git só vê um PDF mudado quando o CV
 * muda. O SHA-256 de cada PDF sai no fim.
 *
 * Os PDF novos só chegam ao dist/ no build seguinte.
 *
 * Opções: --texto mostra o texto extraído de cada PDF.
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { BASE, RAIZ, carregarFerramentas, contextoComTema, servidor } from './auditoria/comum.mjs';

const MOSTRAR_TEXTO = process.argv.includes('--texto');

/** As rotas e os PDF de cada língua. Repete src/lib/cv.ts de propósito: o script não importa código do site. */
const site = JSON.parse(fs.readFileSync(path.join(RAIZ, 'src', 'data', 'site.json'), 'utf8'));
const LINGUAS = {
  pt: { rota: '/cv/', pdf: site.cvPath, locale: 'pt-PT' },
  en: { rota: '/en/cv/', pdf: site.cvPathEn, locale: 'en' },
};

// A folha A4 do @page (1,15cm em cima e em baixo, 1,4cm dos lados), em px CSS.
const PX_POR_MM = 96 / 25.4;
const UTIL = { largura: (210 - 2 * 14) * PX_POR_MM, altura: (297 - 2 * 11.5) * PX_POR_MM };

for (const { rota } of Object.values(LINGUAS)) {
  if (!fs.existsSync(path.join(RAIZ, 'dist', rota, 'index.html'))) {
    console.error(`✗ falta dist${rota}index.html: corre primeiro npm run build`);
    process.exit(1);
  }
}

const canon = JSON.parse(fs.readFileSync(path.join(RAIZ, 'content', 'texto-canonico.json'), 'utf8'));
const { default: config } = await import('../astro.config.mjs');

/** Os links escrevem-se por extenso: o endereço sem o protocolo nem a barra final (como no CvPage.astro). */
const porExtenso = (href) => href.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

/**
 * O que o PDF tem de dizer, pela ordem da página. O texto é o do canónico; o email e
 * os links, que não são texto do canónico, vêm do site.json e do astro.config.mjs.
 * Os títulos de secção estão em maiúsculas no CSS (text-transform), e por isso
 * comparam-se em maiúsculas.
 */
function esperados(lang) {
  const cv = canon.cv;
  const ui = canon.interface.cv;
  const L = (o) => o[lang];
  const titulo = (chave) => ({ onde: `interface.cv.${chave}`, texto: ui[chave][lang].toLocaleUpperCase(LINGUAS[lang].locale) });
  return [
    { onde: 'cv.nome', texto: L(cv.nome) },
    { onde: 'cv.cargo', texto: L(cv.cargo) },
    { onde: 'cv.localidade', texto: L(cv.localidade) },
    { onde: 'site.json email', texto: site.email },
    { onde: 'link do site (astro.config.mjs)', texto: porExtenso(config.site) },
    { onde: 'site.json githubUrl', texto: porExtenso(site.githubUrl) },
    { onde: 'site.json linkedinUrl', texto: porExtenso(site.linkedinUrl) },
    { onde: 'cv.resumo', texto: L(cv.resumo) },
    titulo('cv-heading-projects'),
    ...cv.projetos.flatMap((p, i) => [
      { onde: `cv.projetos[${i}].titulo`, texto: L(p.titulo) },
      { onde: `cv.projetos[${i}].descricao`, texto: L(p.descricao) },
      { onde: `cv.projetos[${i}].tech`, texto: L(p.tech) },
      { onde: `cv.projetos[${i}].quando`, texto: L(p.quando) },
    ]),
    { onde: 'cv.projetosMais', texto: L(cv.projetosMais) },
    titulo('cv-heading-experience'),
    ...cv.experiencia.flatMap((e, i) => ['funcao', 'empresa', 'papel', 'quando', 'descricao'].map((c) => ({ onde: `cv.experiencia[${i}].${c}`, texto: L(e[c]) }))),
    titulo('cv-heading-education'),
    ...cv.educacao.flatMap((e, i) => ['curso', 'escola', 'quando'].map((c) => ({ onde: `cv.educacao[${i}].${c}`, texto: L(e[c]) }))),
    titulo('cv-heading-skills'),
    ...cv.competencias.flatMap((c, i) => ['rotulo', 'valor'].map((k) => ({ onde: `cv.competencias[${i}].${k}`, texto: L(c[k]) }))),
    titulo('cv-heading-languages'),
    { onde: 'cv.idiomas', texto: L(cv.idiomas) },
    titulo('cv-heading-interests'),
    { onde: 'cv.interesses', texto: L(cv.interesses) },
  ];
}

/**
 * Compara sem espaços em branco: o PDF não guarda as quebras de linha como texto,
 * e partir uma frase em duas linhas não é uma divergência. Todos os outros
 * caracteres têm de estar lá, pela ordem. Entre duas strings só podem aparecer os
 * separadores que a página desenha (o ponto do nome, "·" e "—").
 */
const plano = (s) => s.normalize('NFKC').replace(/\s+/g, '');
const SEPARADORES = /^[.·—–]*$/;

function compararComCanonico(texto, lang) {
  const divergencias = [];
  const tudo = plano(texto);
  let cursor = 0;
  const lista = esperados(lang);
  for (const e of lista) {
    const alvo = plano(e.texto);
    const i = tudo.indexOf(alvo, cursor);
    if (i < 0) {
      const noutroSitio = tudo.indexOf(alvo) >= 0;
      divergencias.push(`${e.onde}: ${noutroSitio ? 'está no PDF, mas fora de ordem' : 'não está no PDF'}\n      canónico: ${e.texto}`);
      continue;
    }
    const entre = tudo.slice(cursor, i);
    if (!SEPARADORES.test(entre)) divergencias.push(`texto a mais antes de ${e.onde}:\n      PDF (sem espaços): ${entre.slice(0, 160)}`);
    cursor = i + alvo.length;
  }
  const resto = tudo.slice(cursor);
  if (!SEPARADORES.test(resto)) divergencias.push(`texto a mais no fim do PDF:\n      PDF (sem espaços): ${resto.slice(0, 160)}`);
  return { divergencias, strings: lista.length, caracteresEsperados: lista.reduce((n, e) => n + plano(e.texto).length, 0) };
}

// ---------------------------------------------------------------- leitor de PDF

/**
 * Lê um PDF gerado pelo Chromium: número de páginas, texto de todas as páginas pela
 * ordem em que é desenhado, fontes, cores do texto e retângulos preenchidos.
 * Não é um leitor geral: não conhece fluxos de objetos, encriptação nem filtros
 * além do FlateDecode, e diz-o com um erro em vez de devolver texto errado.
 */
function lerPdf(buf) {
  const s = buf.toString('latin1');
  const objetos = new Map();
  const cabecalho = /(\d+)\s+(\d+)\s+obj\b/g;
  for (let m; (m = cabecalho.exec(s));) {
    const [valor, fim] = lerValor(s, m.index + m[0].length);
    let fluxo = null;
    const aposValor = s.slice(fim).match(/^\s*stream\r?\n/);
    let seguinte = fim;
    if (aposValor) {
      const inicio = fim + aposValor[0].length;
      const comprimento = typeof valor.Length === 'number' ? valor.Length : s.indexOf('endstream', inicio) - inicio;
      fluxo = buf.subarray(inicio, inicio + comprimento);
      seguinte = inicio + comprimento;
    }
    objetos.set(Number(m[1]), { valor, fluxo });
    cabecalho.lastIndex = seguinte;
  }
  if ([...objetos.values()].some((o) => o.valor?.Type?.nome === 'ObjStm')) throw new Error('usa fluxos de objetos, que este leitor não conhece');
  if (s.includes('/Encrypt')) throw new Error('está encriptado');

  const resolver = (v) => (v instanceof Ref ? objetos.get(v.n)?.valor : v);
  const descomprimir = (n) => {
    const o = objetos.get(n);
    const filtro = [o.valor.Filter].flat().filter(Boolean).map((f) => f.nome);
    if (filtro.some((f) => f !== 'FlateDecode')) throw new Error(`filtro ${filtro.join('+')} não suportado`);
    return (filtro.length ? zlib.inflateSync(o.fluxo) : o.fluxo).toString('latin1');
  };

  const paginasObj = [...objetos.values()].filter((o) => o.valor?.Type?.nome === 'Page');
  const raiz = [...objetos.values()].find((o) => o.valor?.Type?.nome === 'Pages' && !o.valor.Parent);
  const contagem = raiz?.valor.Count;
  if (contagem !== undefined && contagem !== paginasObj.length) throw new Error(`a árvore diz ${contagem} páginas e há ${paginasObj.length} objetos de página`);

  const cacheFontes = new Map();
  const fonte = (ref) => {
    if (cacheFontes.has(ref.n)) return cacheFontes.get(ref.n);
    const f = resolver(ref);
    const info = { nome: f.BaseFont?.nome?.replace(/^[A-Z]{6}\+/, '') ?? '?', bytes: f.Subtype?.nome === 'Type0' ? 2 : 1, mapa: new Map() };
    if (f.ToUnicode instanceof Ref) lerCMap(descomprimir(f.ToUnicode.n), info);
    cacheFontes.set(ref.n, info);
    return info;
  };

  let texto = '';
  const nomesFontes = new Set();
  const coresTexto = new Set();
  const preenchimentos = [];

  const interpretar = (conteudo, recursos) => {
    const fontes = resolver(recursos?.Font) ?? {};
    const xobjetos = resolver(recursos?.XObject) ?? {};
    const propriedades = resolver(recursos?.Properties) ?? {};
    let atual = null, cor = '#000000', ultimoY = null, rects = [];
    const textoAtivo = []; // pilha de BDC: uma string com o ActualText, ou null
    const mostrar = (str) => {
      if (!atual || textoAtivo.some((t) => t !== null)) return;
      coresTexto.add(cor);
      for (let i = 0; i + atual.bytes <= str.length; i += atual.bytes) {
        let codigo = 0;
        for (let k = 0; k < atual.bytes; k++) codigo = codigo * 256 + str.charCodeAt(i + k);
        texto += atual.mapa.get(codigo) ?? '�';
      }
    };
    const mudarLinha = (y) => {
      if (ultimoY !== null && Math.abs(y - ultimoY) > 0.5) texto += '\n';
      ultimoY = y;
    };
    const rgb = (r, g, b) => '#' + [r, g, b].map((x) => Math.round(Math.min(1, Math.max(0, x)) * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
    let operandos = [];
    for (const token of tokens(conteudo)) {
      if (!(token instanceof Op)) { operandos.push(token); continue; }
      const o = operandos;
      switch (token.op) {
        case 'Tf': atual = fontes[o[0]?.nome] ? fonte(fontes[o[0].nome]) : null; if (atual) nomesFontes.add(atual.nome); break;
        case 'Tm': mudarLinha(o[5]); break;
        case 'Td': case 'TD': if (o[1]) mudarLinha((ultimoY ?? 0) + o[1]); break;
        case 'T*': texto += '\n'; break;
        case 'Tj': mostrar(o[0]?.bytes ?? ''); break;
        case "'": texto += '\n'; mostrar(o[0]?.bytes ?? ''); break;
        case '"': texto += '\n'; mostrar(o[2]?.bytes ?? ''); break;
        case 'TJ': for (const el of o[0] ?? []) if (el instanceof Texto) mostrar(el.bytes); break;
        // O Chromium abre um bloco BT a cada mudança de cor: a linha só muda quando muda o y.
        case 'BT': break;
        case 'rg': cor = rgb(o[0], o[1], o[2]); break;
        case 'g': cor = rgb(o[0], o[0], o[0]); break;
        case 'k': cor = rgb((1 - o[0]) * (1 - o[3]), (1 - o[1]) * (1 - o[3]), (1 - o[2]) * (1 - o[3])); break;
        case 're': rects.push(Math.abs(o[2] * o[3])); break;
        case 'f': case 'F': case 'f*': case 'B': case 'B*': case 'b': case 'b*':
          for (const area of rects) preenchimentos.push({ cor, area });
          rects = [];
          break;
        case 'n': case 'S': case 's': rects = []; break;
        case 'BMC': textoAtivo.push(null); break;
        case 'BDC': {
          const props = o[1] instanceof Nome ? resolver(propriedades[o[1].nome]) : o[1];
          const actual = props?.ActualText;
          if (actual instanceof Texto) { texto += utf16(actual.bytes); textoAtivo.push(actual.bytes); }
          else textoAtivo.push(null);
          break;
        }
        case 'EMC': textoAtivo.pop(); break;
        case 'Do': {
          const ref = xobjetos[o[0]?.nome];
          const x = resolver(ref);
          if (x?.Subtype?.nome === 'Form') interpretar(descomprimir(ref.n), resolver(x.Resources) ?? recursos);
          break;
        }
      }
      operandos = [];
    }
  };

  for (const p of paginasObj) {
    // /Contents é um fluxo ou uma lista de fluxos (às vezes guardada noutro objeto).
    let conteudos = p.valor.Contents;
    if (conteudos instanceof Ref && Array.isArray(objetos.get(conteudos.n)?.valor)) conteudos = objetos.get(conteudos.n).valor;
    conteudos = [conteudos].flat().filter((c) => c instanceof Ref);
    interpretar(conteudos.map((c) => descomprimir(c.n)).join('\n'), resolver(p.valor.Resources));
  }
  return {
    paginas: paginasObj.length,
    texto: texto.replace(/[ \t]+\n/g, '\n').replace(/\n{2,}/g, '\n').trim(),
    fontes: [...nomesFontes],
    coresTexto: [...coresTexto],
    preenchimentos,
  };
}

/**
 * Tira do PDF as datas da geração, para o mesmo texto dar sempre os mesmos bytes.
 *
 * Lê o trailer, encontra o dicionário /Info e troca as entradas /CreationDate e
 * /ModDate por espaços, com o mesmo número de bytes: um dicionário PDF aceita espaço em
 * branco, e assim nenhuma posição da tabela xref muda. Faz o mesmo às datas de um XMP
 * não comprimido, se houver; um XMP comprimido dá erro, em vez de ficar com a data.
 */
function semDatas(buf) {
  const s = buf.toString('latin1');
  const fim = s.lastIndexOf('trailer');
  if (fim < 0) throw new Error('não tem trailer');
  const [trailer] = lerValor(s, fim + 'trailer'.length);
  const out = Buffer.from(buf);
  const apagar = (inicio, texto) => out.fill(0x20, inicio, inicio + Buffer.byteLength(texto, 'latin1'));
  let apagadas = 0;
  if (trailer.Info instanceof Ref) {
    const cabecalho = [...s.matchAll(new RegExp(`(?:^|\\s)${trailer.Info.n}\\s+0\\s+obj\\b`, 'g'))].at(-1);
    if (!cabecalho) throw new Error(`não encontrei o objeto /Info (${trailer.Info.n} 0 obj)`);
    const inicio = cabecalho.index + cabecalho[0].length;
    const [, final] = lerValor(s, inicio);
    const info = s.slice(inicio, final);
    for (const m of info.matchAll(/\/(?:CreationDate|ModDate)\s*(?:\((?:\\.|[^\\)])*\)|<[0-9A-Fa-f\s]*>)/g)) {
      apagar(inicio + m.index, m[0]);
      apagadas++;
    }
  }
  if (s.includes('/Metadata')) {
    const xmp = [...s.matchAll(/<xmp:(CreateDate|ModifyDate|MetadataDate)>[^<]*<\/xmp:\1>/g)];
    if (!s.includes('xmpmeta')) throw new Error('tem metadados XMP comprimidos, que este passo não sabe limpar');
    for (const m of xmp) { apagar(m.index, m[0]); apagadas++; }
  }
  const depois = out.toString('latin1');
  if (/\/(CreationDate|ModDate)\b|<xmp:(CreateDate|ModifyDate|MetadataDate)>/.test(depois)) throw new Error('ficou uma data no PDF');
  return { buffer: out, apagadas };
}

class Nome { constructor(nome) { this.nome = nome; } }
class Ref { constructor(n) { this.n = n; } }
class Texto { constructor(bytes) { this.bytes = bytes; } }
class Op { constructor(op) { this.op = op; } }

const ESPACOS = ' \t\r\n\f\0';
const DELIMITADORES = '()<>[]{}/%';
const regular = (c) => c !== undefined && !ESPACOS.includes(c) && !DELIMITADORES.includes(c);

function saltarEspacos(s, i) {
  for (;;) {
    while (i < s.length && ESPACOS.includes(s[i])) i++;
    if (s[i] !== '%') return i;
    while (i < s.length && s[i] !== '\n' && s[i] !== '\r') i++;
  }
}

/** Lê um valor PDF a partir de i. Devolve [valor, posição seguinte]; uma palavra solta é um operador. */
function lerValor(s, i) {
  i = saltarEspacos(s, i);
  const c = s[i];
  if (c === '<' && s[i + 1] === '<') {
    const dict = {};
    i += 2;
    for (;;) {
      i = saltarEspacos(s, i);
      if (s[i] === '>' && s[i + 1] === '>') return [dict, i + 2];
      const [chave, j] = lerValor(s, i);
      const [valor, k] = lerValor(s, j);
      dict[chave.nome] = valor;
      i = k;
    }
  }
  if (c === '[') {
    const lista = [];
    i++;
    for (;;) {
      i = saltarEspacos(s, i);
      if (s[i] === ']') return [lista, i + 1];
      const [valor, j] = lerValor(s, i);
      lista.push(valor);
      i = j;
    }
  }
  if (c === '/') {
    let j = i + 1;
    while (regular(s[j])) j++;
    return [new Nome(s.slice(i + 1, j).replace(/#([0-9a-fA-F]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))), j];
  }
  if (c === '<') {
    const j = s.indexOf('>', i);
    const hex = s.slice(i + 1, j).replace(/\s+/g, '');
    return [new Texto(Buffer.from(hex.length % 2 ? hex + '0' : hex, 'hex').toString('latin1')), j + 1];
  }
  if (c === '(') {
    let j = i + 1, nivel = 1, out = '';
    const escapes = { n: '\n', r: '\r', t: '\t', b: '\b', f: '\f' };
    while (j < s.length) {
      const d = s[j];
      if (d === '\\') {
        const e = s[j + 1];
        if (escapes[e]) { out += escapes[e]; j += 2; }
        else if (/[0-7]/.test(e)) { const oct = s.slice(j + 1, j + 4).match(/^[0-7]{1,3}/)[0]; out += String.fromCharCode(parseInt(oct, 8) & 255); j += 1 + oct.length; }
        else if (e === '\r' || e === '\n') { j += 2; if (e === '\r' && s[j] === '\n') j++; }
        else { out += e; j += 2; }
        continue;
      }
      if (d === '(') nivel++;
      if (d === ')' && --nivel === 0) return [new Texto(out), j + 1];
      out += d;
      j++;
    }
    throw new Error('string literal por fechar');
  }
  let j = i;
  while (regular(s[j])) j++;
  if (j === i) throw new Error(`carácter inesperado "${c}" na posição ${i}`);
  const palavra = s.slice(i, j);
  if (/^[+-]?(\d+\.?\d*|\.\d+)$/.test(palavra)) {
    // "n g R" é uma referência a um objeto.
    const ref = s.slice(j).match(/^\s+(\d+)\s+R(?![^\s<>\[\]()/%])/);
    if (ref && /^\d+$/.test(palavra)) return [new Ref(Number(palavra)), j + ref[0].length];
    return [Number(palavra), j];
  }
  if (palavra === 'true' || palavra === 'false') return [palavra === 'true', j];
  if (palavra === 'null') return [null, j];
  return [new Op(palavra), j];
}

/** Os tokens de um fluxo de conteúdo, com as imagens em linha (BI … EI) saltadas. */
function* tokens(s) {
  let i = 0;
  for (;;) {
    i = saltarEspacos(s, i);
    if (i >= s.length) return;
    const [valor, j] = lerValor(s, i);
    i = j;
    if (valor instanceof Op && valor.op === 'BI') {
      const fim = s.indexOf('EI', s.indexOf('ID', i));
      i = fim < 0 ? s.length : fim + 2;
      continue;
    }
    yield valor;
  }
}

/** Texto UTF-16BE (com ou sem BOM), como o de um ToUnicode ou de um ActualText. */
function utf16(bytes) {
  const b = Buffer.from(bytes, 'latin1');
  const corpo = b[0] === 0xfe && b[1] === 0xff ? b.subarray(2) : b;
  const troca = Buffer.from(corpo);
  troca.swap16();
  return troca.toString('utf16le');
}

/** O CMap ToUnicode de uma fonte: bfchar e bfrange (nas duas formas). */
function lerCMap(cmap, info) {
  const espaco = cmap.match(/begincodespacerange\s*<([0-9a-fA-F]+)>/);
  if (espaco) info.bytes = espaco[1].length / 2;
  const hex = (h) => parseInt(h, 16);
  const destino = (h) => utf16(Buffer.from(h, 'hex').toString('latin1'));
  for (const bloco of cmap.matchAll(/beginbfchar([\s\S]*?)endbfchar/g)) {
    for (const m of bloco[1].matchAll(/<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>/g)) info.mapa.set(hex(m[1]), destino(m[2]));
  }
  for (const bloco of cmap.matchAll(/beginbfrange([\s\S]*?)endbfrange/g)) {
    for (const m of bloco[1].matchAll(/<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>\s*(<[0-9a-fA-F]+>|\[[^\]]*\])/g)) {
      const [lo, hi] = [hex(m[1]), hex(m[2])];
      if (m[3].startsWith('[')) {
        [...m[3].matchAll(/<([0-9a-fA-F]+)>/g)].forEach((d, k) => info.mapa.set(lo + k, destino(d[1])));
      } else {
        const base = Buffer.from(m[3].slice(1, -1), 'hex');
        for (let codigo = lo; codigo <= hi; codigo++) {
          const b = Buffer.from(base);
          b.writeUInt16BE(b.readUInt16BE(b.length - 2) + (codigo - lo), b.length - 2);
          info.mapa.set(codigo, utf16(b.toString('latin1')));
        }
      }
    }
  }
}

// ---------------------------------------------------------------- geração

const { chromium } = await carregarFerramentas();
const parar = await servidor();
const browser = await chromium.launch();
const resultados = [];
let falhou = false;

for (const [lang, { rota, pdf: destino }] of Object.entries(LINGUAS)) {
  console.log(`\n== ${lang.toUpperCase()} ${rota} → public/${destino}`);
  const falha = (m) => { falhou = true; console.log(`  ✗ ${m}`); };
  const ok = (m) => console.log(`  ✓ ${m}`);

  // O viewport tem a largura útil da folha, para as medidas abaixo darem as da impressão.
  const ctx = await contextoComTema(browser, 'dark', { viewport: { width: Math.round(UTIL.largura), height: Math.round(UTIL.altura) } });
  const page = await ctx.newPage();
  await page.goto(BASE + rota, { waitUntil: 'load' });
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(async () => {
    await Promise.all(['400', '500', '600'].map((peso) => document.fonts.load(`${peso} 1em Poppins`)));
    await Promise.all([...document.images].map((img) => img.decode().catch(() => {})));
    await document.fonts.ready;
  });

  // O tema escuro está mesmo ativo, e mesmo assim a impressão é branca.
  const estado = await page.evaluate(() => ({
    tema: document.documentElement.classList.contains('dark-mode') ? 'escuro' : document.documentElement.className,
    fundo: [getComputedStyle(document.documentElement).backgroundColor, getComputedStyle(document.body).backgroundColor],
    altura: document.querySelector('.cv')?.getBoundingClientRect().height ?? NaN,
  }));
  if (estado.tema !== 'escuro') falha(`a página devia estar no tema escuro e está em "${estado.tema}"`);
  if (!estado.fundo.every((c) => c === 'rgb(255, 255, 255)')) falha(`com o tema escuro, a impressão não é branca: html e body a ${estado.fundo.join(' e ')}`);
  else ok(`gerado do tema escuro (html.dark-mode), e a impressão tem o html e o body a branco`);
  const folgaMm = (UTIL.altura - estado.altura) / PX_POR_MM;

  const gerado = await page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true });
  await ctx.close();

  // As guardas correm sobre o PDF já sem as datas: o que se verifica é o que se escreve.
  let buffer, leitura;
  try {
    const limpo = semDatas(gerado);
    buffer = limpo.buffer;
    ok(`reproduzível: ${limpo.apagadas} datas da geração apagadas, com o mesmo tamanho (${buffer.length} bytes)`);
    leitura = lerPdf(buffer);
  } catch (e) {
    falha(`o PDF não se deixou ler: ${e.message}`);
    resultados.push({ lang, destino, buffer: null });
    continue;
  }

  // Guarda 1: exatamente uma página.
  if (leitura.paginas !== 1) {
    falha(`GUARDA 1: o PDF tem ${leitura.paginas} páginas; tem de ter exatamente 1. O conteúdo passa a folha em ${(-folgaMm).toFixed(1).replace('.', ',')} mm.`);
  } else {
    ok(`guarda 1: 1 página; sobram ${folgaMm.toFixed(1).replace('.', ',')} mm no fundo da folha`);
  }

  // Guarda 2: há texto a sério, e não uma imagem da página.
  const comparacao = compararComCanonico(leitura.texto, lang);
  const caracteres = plano(leitura.texto).length;
  const minimo = Math.round(comparacao.caracteresEsperados * 0.9);
  if (!leitura.fontes.length || caracteres < minimo) {
    falha(`GUARDA 2: o texto não é extraível: ${caracteres} caracteres (mínimo ${minimo}), ${leitura.fontes.length} fonte(s) — o PDF pode ser uma imagem`);
  } else {
    ok(`guarda 2: texto extraível — ${caracteres} caracteres, em ${leitura.fontes.length} fontes (${leitura.fontes.join(', ')})`);
  }

  // Guarda 3: o texto é o do canónico.
  if (comparacao.divergencias.length) {
    falha(`GUARDA 3: ${comparacao.divergencias.length} divergência(s) entre o PDF e o canónico:`);
    for (const d of comparacao.divergencias) console.log(`    - ${d}`);
  } else {
    ok(`guarda 3: as ${comparacao.strings} strings do canónico estão no PDF, pela ordem, e não há texto a mais`);
  }

  // O fundo: a folha e os retângulos grandes são brancos.
  const maior = Math.max(...leitura.preenchimentos.map((p) => p.area));
  const escuros = leitura.preenchimentos.filter((p) => p.area > maior * 0.01 && p.cor !== '#FFFFFF');
  if (!leitura.preenchimentos.length || escuros.length) {
    falha(`o fundo não é branco: ${escuros.map((p) => `${p.cor} (${(p.area / maior * 100).toFixed(0)}% da folha)`).join(', ') || 'nenhum preenchimento'}`);
  } else {
    ok(`fundo branco: a folha e todos os retângulos grandes são #FFFFFF; cores do texto: ${leitura.coresTexto.join(', ')}`);
  }

  if (MOSTRAR_TEXTO) console.log(`\n--- texto extraído (${lang}) ---\n${leitura.texto}\n---`);
  resultados.push({ lang, destino, buffer, bytes: buffer.length });
}

await browser.close();
await parar();

if (falhou) {
  console.error('\n✗ npm run cv FALHOU: nenhum PDF foi escrito; os que estão em public/assets/docs/ ficaram como estavam.');
  process.exit(1);
}
for (const r of resultados) {
  fs.writeFileSync(path.join(RAIZ, 'public', r.destino), r.buffer);
  console.log(`\n✓ public/${r.destino} (${(r.bytes / 1024).toFixed(1)} KB)\n  SHA-256 ${crypto.createHash('sha256').update(r.buffer).digest('hex')}`);
}
console.log('\nnpm run cv OK. Os PDF novos chegam ao dist/ no próximo npm run build.');
