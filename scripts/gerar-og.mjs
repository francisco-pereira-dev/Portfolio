#!/usr/bin/env node
/**
 * Gera as imagens que aparecem quando um link do site é partilhado no LinkedIn,
 * no WhatsApp ou noutro sítio qualquer:
 *
 * - public/og-image.png — a geral, da página inicial e dos case studies sem
 *   screenshot;
 * - public/og/<slug>-<pt|en>.jpg — uma por língua para cada projeto com case
 *   study e screenshot: o título do projeto e o screenshot encaixado, sem o
 *   esticar. O caminho é o de ogImagemCaseStudy() em src/lib/caseStudy.ts.
 *
 * Corre com: npm run og
 *
 * Porque é que o texto vai em contornos e não em <text>:
 * o sharp desenha SVG através do librsvg, que resolve tipos de letra pelo
 * sistema. A Poppins não está instalada nesta máquina nem estará no runner do
 * GitHub Actions, e o FONTCONFIG_PATH não a apanha — medi, e o resultado era
 * indistinguível do sans-serif por omissão. Converter as linhas em paths
 * com a fonte real torna o SVG autossuficiente: sai sempre igual, em qualquer
 * máquina, sem depender de fontes instaladas.
 *
 * As TTF em scripts/fontes/ são as oficiais do Google Fonts (SIL Open Font
 * License 1.1) e existem só para este script — o site serve WOFF2 de public/fonts/.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import opentype from 'opentype.js';
import sharp from 'sharp';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const LARGURA = 1200;
const ALTURA = 630;
const MAX_BYTES = 300 * 1024;

// Cores retiradas de src/styles/global.css (tema escuro).
const COR = {
  fundo: '#0F172A',
  superficie: '#1E293B',
  acento: '#8B5CF6',
  textoPrincipal: '#F8FAFC',
  textoSecundario: '#CBD5E1',
};

const fonte = (ficheiro) => {
  const buf = fs.readFileSync(path.join(raiz, 'scripts', 'fontes', ficheiro));
  return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
};

const bold = fonte('Poppins-Bold.ttf');
const semibold = fonte('Poppins-SemiBold.ttf');
const regular = fonte('Poppins-Regular.ttf');

/**
 * Compõe o texto glifo a glifo, em unidades da fonte, e devolve o `d` mais a
 * largura de avanço.
 *
 * Não uso o `font.getPath(texto, ...)` porque o opentype.js emite coordenadas
 * NaN nalgumas combinações de fonte e tamanho — a 28px o domínio saía com 4, a
 * 40px com nenhuma. Uma única coordenada inválida faz o librsvg parar de
 * desenhar a meio da linha, e o texto aparecia cortado. Glifo a glifo isso não
 * acontece, e o kerning é aplicado à mão.
 */
function compor(f, conteudo) {
  const glifos = f.stringToGlyphs(conteudo);
  const partes = [];
  let x = 0;
  for (let i = 0; i < glifos.length; i++) {
    const g = glifos[i];
    if (i > 0) x += f.getKerningValue(glifos[i - 1], g) || 0;
    const d = g.getPath(x, 0, f.unitsPerEm).toPathData(2);
    if (d) partes.push(d);
    x += g.advanceWidth;
  }
  const d = partes.join(' ');
  if (d.includes('NaN')) throw new Error(`coordenada NaN em ${JSON.stringify(conteudo)}`);
  return { d, avanco: x, unidades: f.unitsPerEm };
}

/** Envolve um `d` em unidades da fonte num <g> posicionado e escalado. */
function linha({ d, unidades }, x, y, tamanho, cor) {
  const s = tamanho / unidades;
  return `<g transform="translate(${x} ${y}) scale(${s.toFixed(6)})"><path d="${d}" fill="${cor}"/></g>`;
}

/** Largura, em px, de um texto a um dado tamanho. */
const largura = (f, texto, tamanho) => (compor(f, texto).avanco * tamanho) / f.unitsPerEm;

/** Quebra um texto em linhas de no máximo `max` px, palavra a palavra. */
function quebrar(f, texto, tamanho, max) {
  const linhas = [];
  for (const palavra of texto.split(' ')) {
    const ultima = linhas[linhas.length - 1];
    if (ultima !== undefined && largura(f, `${ultima} ${palavra}`, tamanho) <= max) {
      linhas[linhas.length - 1] = `${ultima} ${palavra}`;
    } else {
      linhas.push(palavra);
    }
  }
  return linhas;
}

/**
 * O maior tamanho, a descer a partir de `inicial`, a que o texto cabe em
 * `maxLinhas` linhas sem nenhuma palavra passar de `max` px.
 */
function ajustar(f, texto, inicial, minimo, max, maxLinhas) {
  for (let tamanho = inicial; tamanho >= minimo; tamanho -= 2) {
    const linhas = quebrar(f, texto, tamanho, max);
    if (linhas.length <= maxLinhas && linhas.every((l) => largura(f, l, tamanho) <= max)) {
      return { tamanho, linhas };
    }
  }
  throw new Error(`${JSON.stringify(texto)} não cabe em ${maxLinhas} linhas de ${max}px`);
}

const margem = 90;
const dominio = compor(regular, 'franciscopereira.dev');
const TAM_DOMINIO = 28;
const larguraDominio = (dominio.avanco * TAM_DOMINIO) / dominio.unidades;

/** O fundo comum a todas as imagens, com o conteúdo por cima. */
const svgComFundo = (conteudo) => `<svg xmlns="http://www.w3.org/2000/svg" width="${LARGURA}" height="${ALTURA}" viewBox="0 0 ${LARGURA} ${ALTURA}">
  <defs>
    <linearGradient id="fundo" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${COR.fundo}"/>
      <stop offset="100%" stop-color="${COR.superficie}"/>
    </linearGradient>
    <radialGradient id="brilho" cx="0.85" cy="0.2" r="0.6">
      <stop offset="0%" stop-color="${COR.acento}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${COR.acento}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${LARGURA}" height="${ALTURA}" fill="url(#fundo)"/>
  <rect width="${LARGURA}" height="${ALTURA}" fill="url(#brilho)"/>

  <!-- Barra de acento à esquerda, a ecoar a borda dos cartões do site. -->
  <rect x="0" y="0" width="10" height="${ALTURA}" fill="${COR.acento}"/>

  ${conteudo}

  <!-- Régua fina a separar o domínio do resto. -->
  <rect x="${margem}" y="490" width="${Math.round(larguraDominio)}" height="1" fill="${COR.textoSecundario}" opacity="0.3"/>
  ${linha(dominio, margem, 540, TAM_DOMINIO, COR.textoSecundario)}
</svg>`;

const relativo = (f) => path.relative(raiz, f).split(path.sep).join('/');

function gravar(destino, buffer, meta) {
  if (meta.width !== LARGURA || meta.height !== ALTURA) {
    throw new Error(`${relativo(destino)}: dimensões erradas: ${meta.width}x${meta.height}`);
  }
  if (buffer.length > MAX_BYTES) {
    throw new Error(`${relativo(destino)}: acima de 300 KB: ${(buffer.length / 1024).toFixed(1)} KB`);
  }
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, buffer);
}

// ── A imagem geral ──────────────────────────────────────────────────────────

{
  const nome = compor(bold, 'Francisco Pereira');
  const papel = compor(semibold, 'Full-Stack Developer');
  const svg = svgComFundo(`${linha(nome, margem, 300, 86, COR.textoPrincipal)}
  ${linha(papel, margem, 375, 40, COR.acento)}`);

  const destino = path.join(raiz, 'public', 'og-image.png');
  const png = await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9, effort: 10, palette: true })
    .toBuffer();
  const meta = await sharp(png).metadata();
  gravar(destino, png, meta);
  console.log(`${relativo(destino)}: ${meta.width}x${meta.height}, ${(png.length / 1024).toFixed(1)} KB`);
}

// ── Uma por projeto com case study e screenshot ─────────────────────────────

// Coluna do texto à esquerda, screenshot à direita. A caixa é o espaço máximo
// do screenshot, que encaixa lá dentro sem ser esticado nem cortado.
const COLUNA = { x: margem, largura: 410 };
const CAIXA = { x: 550, y: 90, largura: 580, altura: 450 };
const RAIO = 10;

// "DAE - Arquitetura Full-Stack & IA": o nome em destaque e o resto por baixo,
// como o nome e o papel na imagem geral.
function partirTitulo(titulo) {
  const i = titulo.indexOf(' - ');
  return i === -1 ? [titulo, ''] : [titulo.slice(0, i), titulo.slice(i + 3)];
}

function blocoTitulo(titulo) {
  const [nome, resto] = partirTitulo(titulo);
  const n = ajustar(bold, nome, 64, 40, COLUNA.largura, 2);
  const r = resto ? ajustar(semibold, resto, 34, 24, COLUNA.largura, 3) : { tamanho: 0, linhas: [] };
  const alturaN = n.tamanho * 1.15;
  const alturaR = r.tamanho * 1.35;
  const intervalo = resto ? 14 : 0;
  const total = n.linhas.length * alturaN + intervalo + r.linhas.length * alturaR;

  // Centrado na área acima da régua do domínio.
  let y = (70 + 450) / 2 - total / 2;
  const partes = [];
  for (const l of n.linhas) {
    y += alturaN;
    partes.push(linha(compor(bold, l), COLUNA.x, Math.round(y - n.tamanho * 0.3), n.tamanho, COR.textoPrincipal));
  }
  y += intervalo;
  for (const l of r.linhas) {
    y += alturaR;
    partes.push(linha(compor(semibold, l), COLUNA.x, Math.round(y - r.tamanho * 0.45), r.tamanho, COR.acento));
  }
  return partes.join('\n  ');
}

/** Caixa envolvente dos pixéis que diferem entre duas imagens raw do mesmo tamanho. */
function diferenca(a, b, canais) {
  let x0 = Infinity, y0 = Infinity, x1 = -1, y1 = -1;
  for (let y = 0; y < ALTURA; y++) {
    for (let x = 0; x < LARGURA; x++) {
      const i = (y * LARGURA + x) * canais;
      for (let c = 0; c < canais; c++) {
        if (a[i + c] !== b[i + c]) {
          if (x < x0) x0 = x;
          if (x > x1) x1 = x;
          if (y < y0) y0 = y;
          if (y > y1) y1 = y;
          break;
        }
      }
    }
  }
  return { x: x0, y: y0, largura: x1 - x0 + 1, altura: y1 - y0 + 1 };
}

const pastaProjetos = path.join(raiz, 'src', 'content', 'projects');
const projetos = fs
  .readdirSync(pastaProjetos)
  .filter((f) => f.endsWith('.json'))
  .map((f) => ({ ficheiro: path.join(pastaProjetos, f), dados: JSON.parse(fs.readFileSync(path.join(pastaProjetos, f), 'utf8')) }))
  .filter(({ dados }) => dados.caseStudy && dados.image)
  .sort((a, b) => a.dados.order - b.dados.order);

for (const { ficheiro, dados } of projetos) {
  const origem = path.resolve(path.dirname(ficheiro), dados.image);
  const original = await sharp(origem).metadata();

  // fit: 'inside' é o contain: cabe inteiro na caixa, com as proporções do
  // original. Nunca amplia um screenshot mais pequeno do que a caixa.
  const encaixado = await sharp(origem)
    .resize({ width: CAIXA.largura, height: CAIXA.altura, fit: 'inside', withoutEnlargement: true })
    .toBuffer({ resolveWithObject: true });
  const w = encaixado.info.width;
  const h = encaixado.info.height;
  const x = CAIXA.x + Math.round((CAIXA.largura - w) / 2);
  const y = CAIXA.y + Math.round((CAIXA.altura - h) / 2);

  const mascara = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${RAIO}" fill="#fff"/></svg>`
  );
  const screenshot = await sharp(encaixado.data)
    .ensureAlpha()
    .composite([{ input: mascara, blend: 'dest-in' }])
    .png()
    .toBuffer();

  // Moldura fina e sombra, desenhadas no fundo, por baixo do screenshot.
  const moldura = `<defs><filter id="sombra" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="14"/></filter></defs>
  <rect x="${x}" y="${y + 10}" width="${w}" height="${h}" rx="${RAIO}" fill="#000" opacity="0.45" filter="url(#sombra)"/>
  <rect x="${x - 1}" y="${y - 1}" width="${w + 2}" height="${h + 2}" rx="${RAIO + 1}" fill="${COR.textoSecundario}" opacity="0.25"/>`;

  for (const lang of ['pt', 'en']) {
    const svg = svgComFundo(`${moldura}\n  ${blocoTitulo(dados.title[lang])}`);
    const fundo = await sharp(Buffer.from(svg)).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const canais = fundo.info.channels;
    const composto = await sharp(fundo.data, { raw: fundo.info })
      .composite([{ input: screenshot, left: x, top: y }])
      .removeAlpha()
      .raw()
      .toBuffer();

    // Medir o que foi desenhado: os pixéis que o screenshot mudou têm de ocupar
    // exatamente o retângulo previsto, com as proporções do original.
    const medido = diferenca(fundo.data, composto, canais);
    if (medido.x !== x || medido.y !== y || medido.largura !== w || medido.altura !== h) {
      throw new Error(`${dados.slug}: screenshot medido em ${JSON.stringify(medido)}, previsto ${w}x${h} em ${x},${y}`);
    }
    const desvio = Math.abs(w / h - original.width / original.height) / (original.width / original.height);
    if (desvio > 0.005) throw new Error(`${dados.slug}: proporção desviada ${(desvio * 100).toFixed(2)}%`);

    const jpg = await sharp(composto, { raw: { width: LARGURA, height: ALTURA, channels: canais } })
      .jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: '4:4:4' })
      .toBuffer();
    const meta = await sharp(jpg).metadata();
    const destino = path.join(raiz, 'public', 'og', `${dados.slug}-${lang}.jpg`);
    gravar(destino, jpg, meta);
    console.log(
      `${relativo(destino)}: ${meta.width}x${meta.height}, ${(jpg.length / 1024).toFixed(1)} KB; ` +
        `screenshot ${original.width}x${original.height} (${(original.width / original.height).toFixed(4)}) ` +
        `-> ${medido.largura}x${medido.altura} (${(medido.largura / medido.altura).toFixed(4)}) em ${x},${y}`
    );
  }
}

