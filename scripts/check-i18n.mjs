#!/usr/bin/env node
/**
 * Verifica a paridade entre src/i18n/pt.json e src/i18n/en.json.
 *
 * O site legado construía o dicionário PT em runtime a partir do DOM, por isso
 * nunca houve forma de detetar uma chave em falta antes de ela aparecer no ecrã.
 * Este script fecha essa lacuna no build.
 *
 * Sai com código 1 se houver diferenças.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const load = (loc) => {
  const file = path.join(root, 'src', 'i18n', `${loc}.json`);
  if (!fs.existsSync(file)) {
    console.error(`✗ ficheiro em falta: src/i18n/${loc}.json`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(file, 'utf8'));
};

const pt = load('pt');
const en = load('en');

const ptKeys = Object.keys(pt).sort();
const enKeys = Object.keys(en).sort();

const faltaEm = (a, b) => a.filter((k) => !b.includes(k));
const soPT = faltaEm(ptKeys, enKeys);
const soEN = faltaEm(enKeys, ptKeys);

// Valores vazios ou por preencher.
const vazias = [];
const todos = [...new Set([...ptKeys, ...enKeys])].sort();
for (const k of todos) {
  for (const [loc, dict] of [['pt', pt], ['en', en]]) {
    const v = dict[k];
    if (typeof v !== 'string' || v.trim() === '') vazias.push(`${loc}:${k} (vazia ou não é string)`);
    else if (v.startsWith('TODO:')) vazias.push(`${loc}:${k} (por traduzir — ${v})`);
  }
}

// Guarda-costas: texto de projeto não pode voltar a entrar nos ficheiros de interface.
const PREFIXOS_DE_PROJETO = ['project-title-', 'modal-desc-', 'modal-feat-'];
const fugas = todos.filter((k) => PREFIXOS_DE_PROJETO.some((p) => k.startsWith(p)));

console.log(`pt.json: ${ptKeys.length} chaves`);
console.log(`en.json: ${enKeys.length} chaves`);

let falhou = false;

if (soPT.length) {
  falhou = true;
  console.error(`\n✗ ${soPT.length} chave(s) em pt.json sem contraparte em en.json:`);
  soPT.forEach((k) => console.error(`    ${k}`));
} else {
  console.log('✓ todas as chaves de pt.json existem em en.json');
}

if (soEN.length) {
  falhou = true;
  console.error(`\n✗ ${soEN.length} chave(s) em en.json sem contraparte em pt.json:`);
  soEN.forEach((k) => console.error(`    ${k}`));
} else {
  console.log('✓ todas as chaves de en.json existem em pt.json');
}

if (vazias.length) {
  falhou = true;
  console.error(`\n✗ ${vazias.length} valor(es) vazio(s) ou por traduzir:`);
  vazias.forEach((v) => console.error(`    ${v}`));
} else {
  console.log('✓ nenhum valor vazio nem marcado TODO');
}

if (fugas.length) {
  falhou = true;
  console.error(`\n✗ ${fugas.length} chave(s) de conteúdo de projeto nos ficheiros de interface:`);
  fugas.forEach((k) => console.error(`    ${k} — pertence à collection "projects"`));
} else {
  console.log('✓ nenhum texto de projeto nos ficheiros de interface');
}

if (falhou) {
  console.error('\ncheck:i18n FALHOU');
  process.exit(1);
}
console.log('\ncheck:i18n OK');

