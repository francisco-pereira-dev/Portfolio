#!/usr/bin/env node
/**
 * npm run mapa — refaz o docs/ESTRUTURA.md a partir do disco.
 *
 * O mapa envelhecia sempre da mesma maneira: era gerado, e logo a seguir escreviam-se
 * os relatórios da fase, que já não entravam. Agora é refeito por este script, que
 * conta o disco de cada vez que corre.
 *
 * O que o script faz, e o que fica à mão:
 *   - refaz a lista de ficheiros de cada pasta, os tamanhos, os totais, os três
 *     resumos e a lista do que fica de fora;
 *   - guarda as descrições, que se escrevem à mão no próprio ESTRUTURA.md: a
 *     introdução de cada pasta e as quatro colunas de texto de cada ficheiro. O mapa
 *     é a fonte das suas descrições;
 *   - um ficheiro novo entra com as colunas "⚠ por descrever", e o comando sai com
 *     código 1 até alguém as escrever. Uma linha de um ficheiro que já não existe sai
 *     do mapa, e o script diz qual.
 *
 * Exclusões (EXCLUIDAS, abaixo): node_modules/, dist/, .astro/, .git/, docs/historico/
 * e "Claude outputs/". O docs/historico/ descreve-se numa linha, mas não se lista nem se
 * conta no mapa: os relatórios são um registo, não fazem parte da arquitetura, e escrever
 * um não pode desatualizar o mapa. O terminal diz quantos são.
 *
 * Opções: --verificar não escreve nada; sai com código 1 se o mapa não for
 * exatamente o que o script geraria agora (um ficheiro a mais ou a menos, um tamanho
 * mudado).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MAPA = 'docs/ESTRUTURA.md';
const VERIFICAR = process.argv.includes('--verificar');
const POR_DESCREVER = '⚠ por descrever';
const DESTINOS = ['SIM', 'NÃO — só build', 'NÃO — documentação'];

/** O que o mapa não lista, e porquê. */
const EXCLUIDAS = [
  { pasta: 'node_modules', texto: 'as dependências instaladas pelo `npm ci`. Regeneram-se a partir do `package-lock.json` e nunca entram no repositório.' },
  { pasta: 'dist', texto: 'o site construído, que o `npm run build` refaz do zero de cada vez. É o que o GitHub Pages publica.' },
  { pasta: '.astro', texto: 'a cache do Astro (tipos gerados e conteúdo indexado). Regenera-se sozinha.' },
  { pasta: '.git', texto: 'o histórico do repositório, gerido pelo Git.' },
  {
    pasta: 'docs/historico',
    texto: 'os relatórios de cada fase, um técnico e um resumo por fase, e o inventário de limpeza de 2026-09-18. São o registo do que se fez e porquê, e não fazem parte da arquitetura: listá-los seria uma linha por relatório a dizer "um relatório de fase". Nem sequer se contam aqui, para escrever um relatório não desatualizar o mapa (o `npm run mapa` diz quantos são). Estão versionados, e o `docs/ESTADO-ATUAL.md` resume o que deles ficou decidido.',
  },
  { pasta: 'Claude outputs', texto: 'maquetes que a aplicação do Claude guarda aqui quando se trabalha noutro chat. Estão no `.gitignore` e não fazem parte do projeto.' },
];

// ---------------------------------------------------------------- o disco

const posix = (p) => p.split(path.sep).join('/');
const excluida = (rel) => EXCLUIDAS.find((e) => rel === e.pasta || rel.startsWith(e.pasta + '/'));
const contagemExcluida = Object.fromEntries(EXCLUIDAS.map((e) => [e.pasta, 0]));
const ficheiros = [];
(function anda(dir) {
  for (const e of fs.readdirSync(path.join(RAIZ, dir), { withFileTypes: true })) {
    const rel = posix(path.join(dir, e.name));
    const fora = excluida(rel);
    if (fora) {
      if (fora.pasta === 'docs/historico' && fs.existsSync(path.join(RAIZ, rel))) contagemExcluida[fora.pasta] += contar(rel);
      continue;
    }
    if (e.isDirectory()) anda(rel);
    else ficheiros.push(rel);
  }
})('');
function contar(rel) {
  const p = path.join(RAIZ, rel);
  if (!fs.statSync(p).isDirectory()) return 1;
  return fs.readdirSync(p).reduce((n, f) => n + contar(posix(path.join(rel, f))), 0);
}
// A ordem do mapa: alfabética, sem distinguir maiúsculas; cada pasta aparece onde
// aparece o seu primeiro ficheiro.
ficheiros.sort((a, b) => a.localeCompare(b, 'pt', { sensitivity: 'base' }));
const pastaDe = (f) => (f.includes('/') ? f.slice(0, f.lastIndexOf('/')) : '(raiz)');
const tamanho = (f) => fs.statSync(path.join(RAIZ, f)).size;

// ---------------------------------------------------------------- o mapa atual

const lido = fs.existsSync(path.join(RAIZ, MAPA)) ? fs.readFileSync(path.join(RAIZ, MAPA), 'utf8') : '';
const CRLF = lido.includes('\r\n');

/** As descrições do mapa atual: a introdução de cada pasta e as colunas de cada ficheiro. */
function lerDescricoes(md) {
  const secoes = new Map();
  let atual = null;
  for (const linha of md.replace(/\r\n/g, '\n').split('\n')) {
    const h = linha.match(/^## (.+)$/);
    if (h) {
      atual = h[1].startsWith('Resumo') ? null : { intro: [], linhas: new Map() };
      if (atual) secoes.set(h[1].trim(), atual);
      continue;
    }
    if (!atual || /^\| Caminho \|/.test(linha) || /^\|---/.test(linha)) continue;
    const r = linha.match(/^\| `([^`]+)` \([^)]*\) \| (.*) \|$/);
    if (r) {
      const c = r[2].split(' | ');
      if (c.length !== 4) throw new Error(`${MAPA}: a linha de ${r[1]} não tem as quatro colunas de texto`);
      atual.linhas.set(r[1], { oque: c[0], quem: c[1], chega: c[2], parte: c[3] });
      continue;
    }
    atual.intro.push(linha);
  }
  for (const s of secoes.values()) {
    while (s.intro.length && !s.intro[0].trim()) s.intro.shift();
    while (s.intro.length && !s.intro.at(-1).trim()) s.intro.pop();
  }
  return secoes;
}
const descricoes = lerDescricoes(lido);

// ---------------------------------------------------------------- o mapa novo

const kb = (b) => (b < 1024 ? `${b} B` : `${(b / 1024).toFixed(1).replace('.', ',')} KB`);
const kbTotal = (b) => `${(b / 1024).toFixed(1).replace('.', ',')} KB`;
const milhares = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

function gerar(tamanhos) {
  const porPasta = new Map();
  for (const f of ficheiros) {
    const p = pastaDe(f);
    if (!porPasta.has(p)) porPasta.set(p, []);
    porPasta.get(p).push(f);
  }
  const linhas = [];
  const semDescricao = [];
  const destinoInvalido = [];
  const total = ficheiros.reduce((n, f) => n + tamanhos[f], 0);

  const out = [];
  out.push('# Estrutura do projeto', '');
  out.push('Todos os ficheiros do projeto, com o que são, quem lhes pega e o que parte se');
  out.push('desaparecerem.', '');
  out.push('**Como se mantém:** o `npm run mapa` (`scripts/gerar-estrutura.mjs`) conta o disco e');
  out.push('refaz a lista de ficheiros, os tamanhos, os totais, os resumos e a lista do que fica');
  out.push('de fora. As descrições escrevem-se à mão aqui mesmo — a introdução de cada pasta e as');
  out.push('quatro colunas de texto de cada ficheiro —, e o gerador guarda-as. Um ficheiro novo');
  out.push(`entra com as colunas "${POR_DESCREVER}", e o comando falha até alguém as escrever;`);
  out.push('`npm run mapa -- --verificar` diz se o mapa está em dia, sem escrever nada.', '');
  out.push('**O que fica de fora, e porquê:**', '');
  for (const e of EXCLUIDAS) out.push(`- \`${e.pasta}/\` — ${e.texto}`);
  out.push('', `**Total: ${ficheiros.length} ficheiros, ${kbTotal(total)}.**`, '');

  for (const [pasta, fs_] of porPasta) {
    const d = descricoes.get(pasta);
    out.push(`## ${pasta}`, '');
    if (d?.intro.length) out.push(...d.intro, '');
    else { out.push(`${POR_DESCREVER}: a introdução desta pasta.`, ''); semDescricao.push(`${pasta}/ (introdução)`); }
    out.push('| Caminho | O que é | Quem o usa | Chega ao visitante? | O que parte sem ele |');
    out.push('|---|---|---|---|---|');
    for (const f of fs_) {
      const l = d?.linhas.get(f) ?? { oque: POR_DESCREVER, quem: POR_DESCREVER, chega: POR_DESCREVER, parte: POR_DESCREVER };
      if (Object.values(l).includes(POR_DESCREVER)) semDescricao.push(f);
      else if (!DESTINOS.includes(l.chega)) destinoInvalido.push(`${f}: "${l.chega}"`);
      linhas.push({ f, ...l, bytes: tamanhos[f] });
      out.push(`| \`${f}\` (${kb(tamanhos[f])}) | ${l.oque} | ${l.quem} | ${l.chega} | ${l.parte} |`);
    }
    out.push('');
  }

  // Resumo 1 — por destino.
  const grupo = (chega) => linhas.filter((l) => l.chega === chega);
  const soma = (ls) => ls.reduce((n, l) => n + l.bytes, 0);
  const [sim, build, docs] = DESTINOS.map(grupo);
  out.push('## Resumo 1 — por destino', '');
  out.push('| Destino | Ficheiros | Tamanho |', '|---|---:|---:|');
  out.push(`| **Chegam ao visitante** (servidos a quem abre o site, ou transformados no que é servido) | ${sim.length} | ${kbTotal(soma(sim))} |`);
  out.push(`| **Só build** (ferramentas, configuração, dados de origem) | ${build.length} | ${kbTotal(soma(build))} |`);
  out.push(`| **Documentação** | ${docs.length} | ${kbTotal(soma(docs))} |`);
  const outros = linhas.length - sim.length - build.length - docs.length;
  if (outros) out.push(`| **${POR_DESCREVER}** | ${outros} | ${kbTotal(total - soma(sim) - soma(build) - soma(docs))} |`);
  out.push(`| **Total** | ${linhas.length} | ${kbTotal(total)} |`, '');
  const dist = path.join(RAIZ, 'dist');
  let frase = '';
  if (fs.existsSync(dist)) {
    const noDist = [];
    (function anda(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) anda(p); else noDist.push(fs.statSync(p).size); } })(dist);
    frase = ` O \`dist/\` do último build tem ${noDist.length} ficheiros e ${milhares(noDist.reduce((a, b) => a + b, 0) / 1024)} KB, e uma visita à página inicial pede cinco ficheiros: o HTML, o CSS, a fonte 400, o avatar e o favicon.`;
  }
  out.push(`Atenção a uma diferença que os números escondem: os ${sim.length} ficheiros que "chegam ao visitante" pesam ${kbTotal(soma(sim))} **no repositório**, não na ligação de quem abre o site.${frase}`, '');

  // Resumo 2 — os 10 maiores.
  const maiores = [...linhas].sort((a, b) => b.bytes - a.bytes).slice(0, 10);
  out.push('## Resumo 2 — os 10 maiores', '');
  out.push('| Ficheiro | Tamanho | Chega ao visitante? |', '|---|---:|---|');
  for (const l of maiores) out.push(`| \`${l.f}\` | ${kbTotal(l.bytes)} | ${l.chega} |`);
  const pct = Math.round((soma(maiores.slice(0, 3)) / total) * 100);
  const servidos = maiores.filter((l) => l.chega === 'SIM').map((l) => `\`${l.f.split('/').pop()}\``);
  const lista = servidos.join(', ').replace(/, ([^,]*)$/, ' e $1');
  const chegam = servidos.length === 0 ? 'nenhum chega ao visitante' : servidos.length === 1 ? `só o ${lista} chega ao visitante` : `chegam ao visitante ${lista}`;
  out.push('', `Os três primeiros valem ${pct}% do repositório. Dos dez, ${chegam}.`);
  const webp = maiores.filter((l) => /(mrpizza|dianearbus)\.webp$/.test(l.f));
  if (webp.length) out.push(`${webp.length === 2 ? 'As duas `.webp`' : `O \`${webp[0].f.split('/').pop()}\``} da lista não ${webp.length === 2 ? 'chegam' : 'chega'} a ser desenhad${webp.length === 2 ? 'as' : 'o'} em lado nenhum do site.`);
  out.push('');

  // Resumo 3 — ficheiros que não partem nada.
  out.push('## Resumo 3 — ficheiros que não partem nada', '');
  const semConsequencia = linhas.filter((l) => !l.parte.trim() || /^não parte nada/i.test(l.parte));
  const porDescrever = linhas.filter((l) => l.parte === POR_DESCREVER);
  if (semConsequencia.length) out.push(`**${semConsequencia.length}:** ${semConsequencia.map((l) => `\`${l.f}\``).join(', ')}.`, '');
  else if (porDescrever.length) out.push(`**Por saber:** ${porDescrever.length} ficheiro(s) ainda estão por descrever.`, '');
  else {
    out.push(`**Nenhum.** Os ${linhas.length} ficheiros têm todos uma consequência concreta se`);
    out.push('desaparecerem, e está escrita na última coluna de cada tabela.', '');
  }
  if (webp.length === 2 || ficheiros.some((f) => /(mrpizza|dianearbus)\.webp$/.test(f))) {
    out.push('Os dois casos que mais se aproximam de "não parte nada" são o `assets/images/mrpizza.webp`');
    out.push('e o `assets/images/dianearbus.webp`: não são desenhados em nenhuma página, e nem sequer');
    out.push('chegam ao `dist/`. Mas apagá-los **parte o build hoje**, porque a guarda');
    out.push('`verificarImagensDosProjetos` exige o ficheiro que o campo `image` dos dados nomeia. Não');
    out.push('são código morto: são código adormecido, à espera de uma decisão sobre os dados.');
  }
  const texto = out.join('\n').replace(/\n{3,}/g, '\n\n').replace(/\n*$/, '\n');
  return { texto: CRLF || !lido ? texto.replace(/\n/g, '\r\n') : texto, semDescricao, destinoInvalido, linhas: linhas.length };
}

// O mapa conta o seu próprio tamanho: gera-se até o tamanho escrito ser o do ficheiro.
const tamanhos = Object.fromEntries(ficheiros.map((f) => [f, tamanho(f)]));
let resultado;
for (let i = 0; i < 10; i++) {
  resultado = gerar(tamanhos);
  const proprio = Buffer.byteLength(resultado.texto);
  if (tamanhos[MAPA] === proprio) break;
  tamanhos[MAPA] = proprio;
}

// ---------------------------------------------------------------- relatório

const saem = [...descricoes.values()].flatMap((s) => [...s.linhas.keys()]).filter((f) => !ficheiros.includes(f));
const saemExcluidos = saem.filter((f) => excluida(f));
const saemApagados = saem.filter((f) => !excluida(f));
console.log(`npm run mapa — ${MAPA}`);
console.log(`  ficheiros no disco, fora das exclusões: ${ficheiros.length}`);
console.log(`  linhas no mapa: ${resultado.linhas}`);
console.log(`  fora do mapa: ${EXCLUIDAS.map((e) => `${e.pasta}/`).join(', ')} (docs/historico/: ${contagemExcluida['docs/historico']} ficheiros)`);
if (saemExcluidos.length) console.log(`  linhas que saem por estarem numa pasta excluída: ${saemExcluidos.length} (${[...new Set(saemExcluidos.map((f) => excluida(f).pasta + '/'))].join(', ')})`);
if (saemApagados.length) console.log(`  linhas que saem porque o ficheiro já não existe: ${saemApagados.join(', ')}`);

let falhou = false;
if (VERIFICAR) {
  const igual = resultado.texto.replace(/\r\n/g, '\n') === lido.replace(/\r\n/g, '\n');
  if (!igual) {
    falhou = true;
    const noMapa = [...descricoes.values()].flatMap((s) => [...s.linhas.keys()]);
    const faltam = ficheiros.filter((f) => !noMapa.includes(f));
    console.error(`\n✗ o mapa não está em dia${faltam.length ? ` — ficheiros sem linha: ${faltam.join(', ')}` : ''}${saem.length ? ` — linhas a mais: ${saem.join(', ')}` : ''}${!faltam.length && !saem.length ? ' — mudaram tamanhos ou totais' : ''}. Corre npm run mapa.`);
  } else console.log('\n✓ o mapa está em dia: é exatamente o que o npm run mapa escreveria agora');
} else {
  fs.writeFileSync(path.join(RAIZ, MAPA), resultado.texto);
  console.log(`\n✓ escrito ${MAPA} (${kb(tamanhos[MAPA])})`);
}
if (resultado.semDescricao.length) {
  falhou = true;
  console.error(`\n✗ ${resultado.semDescricao.length} por descrever — escreve as colunas no ${MAPA} e volta a correr:`);
  for (const f of resultado.semDescricao) console.error(`    ${f}`);
}
if (resultado.destinoInvalido.length) {
  falhou = true;
  console.error(`\n✗ "Chega ao visitante?" tem de ser ${DESTINOS.map((d) => `"${d}"`).join(', ')}:`);
  for (const f of resultado.destinoInvalido) console.error(`    ${f}`);
}
process.exit(falhou ? 1 : 0);

