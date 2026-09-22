# Fase 13 — relatório técnico

Data: 2026-09-19. Fechar o que ficou da fase 11, trocar uma palavra, decidir a
fotografia dos PDF e publicar. **Publicado com autorização expressa do Francisco**, nesta
sessão, só na Tarefa 5.

---

## 1. A verificação contra o site ao vivo — antes e depois

A comparação é sempre contra o commit publicado, e não contra a árvore de trabalho:

1. extraí o commit com `git archive` para `node_modules/.cache/`;
2. fiz lá um build limpo (`npm ci` + `npm run build`);
3. descarreguei do site as páginas e tudo o que elas pedem, com um parâmetro aleatório
   no URL para não ler cópias antigas da CDN;
4. comparei tudo, byte a byte.

| Verificação | Antes: `cb5e0dd` | Depois: `207ed69` |
|---|---|---|
| Domínio e HTTPS | `https://` 200 (GitHub.com), `http://` → 301 | igual |
| Certificado | Let's Encrypt YR1, TLS 1.3, válido de 2026-07-29 a **2026-10-27**, para `franciscopereira.dev` e `www.` | igual |
| As 18 páginas do sitemap | todas 200, incluindo `/cv/` e `/en/cv/` | todas 200 |
| Byte a byte contra o build limpo | 44 ficheiros iguais | 44 ficheiros iguais |
| `check:texto` do commit contra o HTML ao vivo | 1016 verificações, zero divergências | 1026 verificações, zero divergências |
| As 18 páginas num browser | 114 pedidos, zero erros | 114 pedidos, zero erros |
| "Ver CV" / "View CV" | → `/cv/` e `/en/cv/` | igual |
| "Descarregar PDF" / "Download PDF" | 200, `application/pdf`, uma página cada, byte a byte os do commit (215 900 e 215 143 B) | igual (217 950 e 217 074 B) |
| Sitemap | 18 páginas | 18 páginas |

Os 44 ficheiros comparados são:

- as 18 páginas e os 2 ficheiros do sitemap;
- os 2 CSS;
- as 8 fontes;
- a fotografia;
- as 9 imagens de partilha;
- o favicon;
- os 2 PDF.

**O `robots.txt` deu diferente das duas vezes**, e não era erro de produção: o site
serve 80 bytes, e o meu export tinha 84. Eram 4 `\r`: o `core.autocrlf` desta máquina
Windows converte os fins de linha no `git archive`, e o GitHub constrói em Linux. O que
está no ar é, byte a byte, o objeto guardado no git (o mesmo SHA-256).

**Uma nota do `npm ci`:** o npm desta máquina avisou que bloqueou os scripts de
instalação dos pacotes (`allow-scripts`). Os builds limpos passaram na mesma, e a
comparação byte a byte mostra que isso não fez diferença.

---

## 2. A palavra

No segundo ponto do Licas, em português:

> ~~Suportei~~ **Acomodei** dois fluxos de compra na mesma aplicação: catálogo com preço
> fixo, e bolos personalizados que precisam de orçamento antes de haver preço.

Um script temporário fez o seguinte:

1. confirmou que as duas frases são fatias literais do enunciado;
2. confirmou que só muda a primeira palavra;
3. trocou-a no canónico;
4. registou a fonte `fase-13`;
5. guardou a frase antiga em `retirado["fase-13"]`, só em português, com o motivo: um
   anglicismo, do inglês *support*;
6. regenerou o `cv.json`.

**O inglês "Supported" ficou.**

Confirmei que:

- o `cv.json` é igual ao canónico;
- só mudou esse ponto, e só em português;
- sem a fase 13, o canónico é igual ao de antes.

**As folgas não mudaram:** 8,9 mm em PT e em EN. O `check:texto` continua com 1026
verificações e zero divergências. O SHA-256 do PDF português mudou para `4ebefdbc…6b4e`,
e o do inglês ficou igual (`9a2d65a0…00c7`), porque o texto inglês não mudou. É a prova de
que os PDF reproduzíveis só mudam quando muda o texto.

---

## 3. A fotografia

As versões de ensaio foram geradas em `node_modules/.cache/f13/ensaio/` e não entraram
em `public/`. Seguiram o mesmo caminho do `npm run cv`: a página no tema escuro, em
impressão, A4. A versão JPEG não mudou o projeto: durante a geração, o pedido da
fotografia WebP foi respondido com um JPEG a 400px, qualidade 80, feito a partir do
`avatar.jpg` original.

| Ficheiro | Tamanho | A fotografia no PDF |
|---|---:|---|
| `CV-pt-hoje.pdf` | 217 950 B (212,8 KB) | 400×405, FlateDecode, 192 376 B |
| `CV-pt-jpeg.pdf` | **41 131 B (40,2 KB)** | 400×405, DCTDecode, 15 543 B |
| `CV-en-hoje.pdf` | 217 074 B (212,0 KB) | 400×405, FlateDecode, 192 376 B |
| `CV-en-jpeg.pdf` | **40 255 B (39,3 KB)** | 400×405, DCTDecode, 15 543 B |

As versões "hoje" têm exatamente o tamanho dos PDF do `npm run cv`, o que confirma que o
ensaio seguiu o mesmo caminho. Parei, enviei-te os dois PDF portugueses para comparares, e
**decidiste ficar como está**. O `gerar-cv.mjs` não mudou, e a decisão está registada no
`docs/ESTADO-ATUAL.md`.

---

## 4. Os relatórios da fase 11

Escritos em `docs/historico/FASE-11-tecnico.md` e `FASE-11-resumo.md`, só com o que ficou
registado:

- o lock;
- a pasta apagada;
- a medição da fotografia;
- os 57 ficheiros preparados;
- a verificação e o incidente do timeout, com as quatro corridas;
- os seis commits;
- o push bloqueado;
- a Action.

**O que não sei ficou escrito como não sabido:**

- o URL e a hora exata do timeout;
- o estado do servidor nesse momento;
- com que comando e a que horas o Francisco fez o push. Sei só que a Action começou às
  23:16:47 UTC.

---

## 5. A publicação

**Verificação completa antes do commit**, pela ordem build → cv → build → mapa:

| Verificação | Resultado |
|---|---|
| `npm run build` | exit 0, zero avisos, 18 páginas |
| `check:i18n` | 63 chaves de cada lado |
| `check:texto` | 1026 verificações, zero divergências |
| `npm run cv` | dois PDF de uma página, 8,9 mm de folga; `4ebefdbc…` e `9a2d65a0…` |
| `npm run build` (de novo) | exit 0, zero avisos, 18 páginas |
| `audit:a11y` | zero falhas, 18 páginas × 2 temas |
| `audit:teclado` | zero falhas, 18 páginas × 2 temas |
| `npm run mapa` e `--verificar` | 102 = 102, em dia |

**Preparados com `git add -A`: 15 ficheiros.** Nenhum é de `node_modules/`, `dist/` ou
`.astro/`.

**Dois commits, e cada um constrói sozinho.** O canónico e o `cv.json` foram mexidos
nas duas fases:

- no `1a55793` (fase 12) vão no estado em que a fase 12 os deixou, ainda com "Suportei".
  São as cópias exatas que guardei no início desta fase, postas no índice com `git
  hash-object` e `git update-index`, sem mexer na árvore de trabalho;
- o `207ed69` (fase 13) mostra a troca da palavra como diferença.

**Antes do commit, construí à parte a árvore da fase 12:** `npm ci`, build a exit 0,
`check:i18n` OK, `check:texto` com 1026 verificações, e o CV a dizer "Suportei".

**A exceção é o `CV.pdf` português.** No `1a55793` ainda é o anterior: o da fase 12 não
foi guardado, e o de agora já diz "Acomodei". A árvore final (`8bc471c…`) é exatamente a
que estava preparada.

| Commit | Ficheiros |
|---|---|
| `1a55793` — Restructure the CV: paid work under Experience, skills first, bullet points | o canónico e o `cv.json` (estado da fase 12), `CvPage.astro`, `cv.css`, `check-texto.mjs`, `gerar-cv.mjs`, `CV-en.pdf` e os relatórios da fase 12 (9 ficheiros) |
| `207ed69` — Replace an anglicism in the CV, add the Phase 11 reports, update the docs | o canónico e o `cv.json` ("Acomodei"), `CV.pdf`, `CLAUDE.md`, `ESTADO-ATUAL.md`, `ESTRUTURA.md` e os relatórios da fase 11 (8 ficheiros) |

**O push passou** (`cb5e0dd..207ed69`), ao contrário da fase 11.

**A Action** (execução `35407839624`) correu verde. O `Verificar` correu antes do
`Build`:

| Job | Início (UTC) | Fim (UTC) | Passos |
|---|---|---|---|
| Verificar | 00:00:52 | 00:01:05 | checkout, Node 24, dependências, build, "Paridade entre PT e EN", "O site diz o texto aprovado" — todos sucesso |
| Build | 00:01:08 | 00:01:25 | instalar, construir e enviar o site — sucesso |
| Deploy | 00:01:28 | 00:01:46 | "Deploy to GitHub Pages" — sucesso |

Depois disso, a verificação ao vivo (secção 1) confirmou o `207ed69` no ar.

**O último commit, só de documentação**, leva o `CLAUDE.md` e o `ESTADO-ATUAL.md` com a
publicação nova, a lista "Por fazer", o mapa e estes dois relatórios. Não muda o site. O
resultado da Action desse commit não pode estar aqui, porque este relatório vai dentro
dele; está na resposta final da sessão.

## Decisões que tomei sozinho

1. **O canónico e o `cv.json` no estado da fase 12** no commit da fase 12, para os dois
   commits construírem sozinhos, em vez de os pôr todos no da fase 13.
2. **O ensaio da fotografia sem mexer no projeto:** o pedido da imagem foi respondido
   com um JPEG só durante a geração.
3. **`retirado["fase-13"]` só com o português**, porque o inglês não mudou.
4. **Na documentação, "o site no ar corresponde ao `207ed69`"**: o commit seguinte, só
   de documentação, não pode dizer o seu próprio hash, e não muda o site.

