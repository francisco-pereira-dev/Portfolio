#!/usr/bin/env node
/**
 * Gera public/og-image.png — a imagem que aparece quando o link do site é
 * partilhado no LinkedIn, no WhatsApp ou noutro sítio qualquer.
 *
 * Corre com: npm run og
 *
 * Porque é que o texto vai em contornos e não em <text>:
 * o sharp desenha SVG através do librsvg, que resolve tipos de letra pelo
 * sistema. A Poppins não está instalada nesta máquina nem estará no runner do
 * GitHub Actions, e o FONTCONFIG_PATH não a apanha — medi, e o resultado era
 * indistinguível do sans-serif por omissão. Converter as três linhas em paths
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

const margem = 90;
const nome = compor(bold, 'Francisco Pereira');
const papel = compor(semibold, 'Full-Stack Developer');
const dominio = compor(regular, 'franciscopereira.dev');

const TAM_DOMINIO = 28;
const larguraDominio = (dominio.avanco * TAM_DOMINIO) / dominio.unidades;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${LARGURA}" height="${ALTURA}" viewBox="0 0 ${LARGURA} ${ALTURA}">
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

  ${linha(nome, margem, 300, 86, COR.textoPrincipal)}
  ${linha(papel, margem, 375, 40, COR.acento)}

  <!-- Régua fina a separar o domínio do resto. -->
  <rect x="${margem}" y="490" width="${Math.round(larguraDominio)}" height="1" fill="${COR.textoSecundario}" opacity="0.3"/>
  ${linha(dominio, margem, 540, TAM_DOMINIO, COR.textoSecundario)}
</svg>`;

const destino = path.join(raiz, 'public', 'og-image.png');
fs.mkdirSync(path.dirname(destino), { recursive: true });

const png = await sharp(Buffer.from(svg))
  .png({ compressionLevel: 9, effort: 10, palette: true })
  .toBuffer();

fs.writeFileSync(destino, png);

const meta = await sharp(png).metadata();
console.log(
  `og-image.png: ${meta.width}x${meta.height}, ${(png.length / 1024).toFixed(1)} KB -> ${path.relative(raiz, destino).split(path.sep).join('/')}`
);

if (meta.width !== LARGURA || meta.height !== ALTURA) {
  throw new Error(`dimensões erradas: ${meta.width}x${meta.height}`);
}
if (png.length > 300 * 1024) {
  throw new Error(`acima de 300 KB: ${(png.length / 1024).toFixed(1)} KB`);
}
