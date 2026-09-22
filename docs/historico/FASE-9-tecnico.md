# Fase 9 — relatório técnico

Data: 2026-09-18. O CV passa a ser uma página do site, `/cv/` e `/en/cv/`, e o PDF de
cada língua é gerado a partir dela por `npm run cv`. **Sem commit, sem push e sem
`git add`:** o HEAD continua em `4f13bec`.

---

## Antes de começar: as quatro perguntas

Parei antes de escrever código, porque quatro coisas colidiam com o que existe ou
obrigavam a adivinhar. As respostas foram todas as recomendadas:

| Pergunta | Resposta |
|---|---|
| O enunciado não dá o título da página (`<title>`, `og:title`) | **"CV — Francisco Pereira"**, nas duas línguas. A descrição é o resumo, cortado como a frase de abertura dos case studies |
| O `site.json` não tem o endereço do site, só o GitHub e o LinkedIn | Lido do `site` do **`astro.config.mjs`**, sem duplicar o domínio |
| A pasta `Claude outputs/` (tua, fora do git, com o protótipo `cv-preview.html`) | **Excluída do mapa**, sem lhe tocar |
| Dois erros no texto aprovado (ver abaixo) | **Copiar literal** |

Os dois erros, que ficam como estão até decidires:

1. O resumo diz "Cada projeto abaixo está documentado em franciscopereira.dev, com as
   decisões técnicas e o que correu mal", e o **Portfolio**, que está na lista, não tem
   case study.
2. "Mais seis projetos, com o contexto e as decisões de cada um": dois desses seis, o
   **Mr. Pizza** e o **Diane Arbus**, não têm case study.

E um reparo menor: o cargo em inglês é "Full-stack Developer" e o hero diz
"Full-stack developer".

---

## 1. O texto no canónico, e a prova de que os dados batem

**Como entrou.** Copiei o texto do enunciado para um ficheiro temporário, tal e qual, e
um script temporário (`node_modules/.cache/`, já apagado):

1. **Confirmou que cada valor é uma fatia literal do enunciado**, na língua certa. As
   linhas que o enunciado parte a meio de uma frase (a ~88 colunas) foram juntas com um
   espaço.
2. **Partiu cada linha nas suas partes, cortando só o " — "** que as separa — como o
   " · " do rodapé e das tecnologias na extração original. Por exemplo, "Licas —
   plataforma…" dá `titulo` e `descricao`, e "React · … · Vite — cliente real, 2026 – em
   curso" dá `tech` e `quando`. O " · " dentro de uma parte é texto e fica. **Prova de
   que só o " — " saiu:** o script voltou a juntar as partes e confirmou que cada linha
   reconstruída está no enunciado, nas duas línguas.
3. Escreveu no canónico:
   - a secção **`cv`**, antes do `retirado`, com o texto de tudo o que o enunciado
     lista, em `{pt, en}`. O nome, que o enunciado dá uma vez, é igual nas duas línguas;
   - **`interface.cv`**: os seis títulos de secção, "Descarregar PDF" / "Download PDF" e
     o título da página, "CV — Francisco Pereira";
   - o **`hero-btn-cv`** passou a "Ver CV" / "View CV", com `_origem: "fase-9"`;
   - **`retirado["fase-9"]["hero-btn-cv"]`**: o rótulo antigo, "Descarregar CV" /
     "Download CV", com o motivo;
   - **`_sobre.fontes["fase-9"]`**.
4. Gerou os dados: `src/data/cv.json` (a secção `cv` sem as notas), as 8 chaves `cv-*`
   e o `hero-btn-cv` no `pt.json` e no `en.json`, e o `cvPathEn` no `site.json`, ao lado
   do `cvPath`.

**Como confirmei que batem** (e voltei a confirmar no fim):

| Verificação | Resultado |
|---|---|
| `src/data/cv.json` = canónico `cv` sem as notas | ✓ igual |
| `pt.json` / `en.json`: as chaves novas = `interface.cv` | ✓ 8 de cada lado |
| Das 55 chaves antigas de cada lado, quais mudaram | ✓ só o `hero-btn-cv` |
| Canónico, tirando as adições da fase 9 e repondo o rótulo antigo | ✓ igual ao do commit, com a mesma ordem de chaves |
| `site.json` | ✓ só entrou o `cvPathEn` |
| `src/content/projects/` e `src/data/skills.json` | ✓ diff vazio contra o commit |

As únicas linhas antigas que aparecem como "removidas" no diff do texto aprovado são as
duas do `hero-btn-cv`. As outras três (`fontes["fase-5.2"]` e os dois `a11y-close`)
voltam iguais na linha seguinte, só com uma vírgula a mais, porque passaram a não ser a
última chave.

---

## 2. As páginas

`src/pages/cv.astro` e `src/pages/en/cv.astro` chamam `src/layouts/CvPage.astro`, como
os case studies chamam o `CaseStudyPage.astro`. As rotas vivem em `src/lib/cv.ts`.

- **O BaseLayout, a navbar, o menu, a navegação sem JavaScript, o rodapé e o seletor de
  idioma**, como em qualquer outra página. O seletor leva a `/en/cv/` e a `/cv/`, e o
  sitemap liga as duas línguas sozinho, pelo prefixo (não foi preciso tocar no
  `astro.config.mjs`).
- **SEO próprio:** o título; a descrição (o resumo, cortado a 155 caracteres pela mesma
  função `resumir` dos case studies); `canonical`; e `hreflang` para as duas línguas. A
  imagem de partilha é a geral, e não há JSON-LD.
- **Um só `h1`, o nome.** O ponto final a roxo é CSS (`::after`), como no hero, para o
  `h1` ser exatamente o texto do canónico.
- **As secções** são `<section>` com `<h2>`, pela ordem pedida, com ids iguais nas duas
  línguas. Os itens são listas, e as competências são um `<dl>`.
- **A fotografia** é o `avatar.jpg`, com as mesmas opções do hero: o Astro reaproveita
  o ficheiro que já gerava (`avatar.CsZFE6D4_Z1hufz1.webp`), e o `dist/` não ganhou
  nenhuma imagem.
- **Os três links**, numa linha própria à largura toda, por baixo do nome e da foto, com
  uma régua fina por cima. O texto é o próprio endereço, sem protocolo nem barra final.
- **O botão "Descarregar PDF"**, no topo, com `download`, aponta para o PDF da mesma
  língua; o caminho vem do `site.json`.

**No ecrã** tudo usa os tokens e segue o tema. As medidas que não são tokens estão
comentadas no CSS como medidas de desenho:

- a coluna tem 48rem, a largura em que a linha dos três links cabe inteira;
- a fotografia tem 128px, como os 200px do hero.

Os acentos a roxo são só os quatro pedidos:

- o ponto do nome, a `--accent-text`;
- o cargo, a `--accent-text`;
- os títulos de secção, a `--accent-text`;
- a barra do resumo, a `--accent-color`, porque não é texto.

**A grelha das competências** usa `grid-template-columns: max-content minmax(0, 1fr)`: a
coluna do rótulo tem a largura do mais comprido, e o espaço até ao valor é sempre o
`column-gap`. **Medido:**

| Caso | "Frameworks e bibliotecas" / "Frameworks and libraries" |
|---|---|
| Escuro e claro, 1440px | a 24px do valor |
| Escuro e claro, 375px | por cima do valor (uma coluna) |
| Escuro e claro, impressão | a 18,7px do valor (14pt) |

**No telemóvel** a foto sobe para cima do nome, e a localidade, o email e os links
passam a uma linha cada. As regras de telemóvel são só `screen`: a folha A4 tem 688px
úteis e, sem isso, a impressão apanhava-as.

---

## 3. O CSS de impressão

Está no fim do `src/styles/cv.css`, num bloco `@media print` que vale para as duas
páginas.

- **`@page { size: A4; margin: 1.15cm 1.4cm; }`**.
- **Sempre em branco:** os tokens são redefinidos com `!important` para o conjunto
  claro de `html.light-mode`, com o fundo a `#FFFFFF` e o roxo (`--accent-color` e
  `--accent-text`) a `#7C3AED`. O `html` e o `body` levam `background: #fff !important`.
  As transições e animações são desligadas, para a troca de tema não passar por cores
  intermédias.
- **Escondidos:** o link de saltar, a navbar (com o botão do tema), o menu, a navegação
  sem JavaScript, o rodapé, a seta de voltar ao topo e o "Descarregar PDF".
- **`break-inside: avoid` e `page-break-inside: avoid`** em cada secção e em cada item.
- **Nenhum `::after` com o URL:** os links já estão escritos por extenso. Na impressão
  perdem o sublinhado e ficam numa linha só.

**A colisão com o CLAUDE.md, e como ficou.** O CLAUDE.md diz que nada fica fora das
escalas `--fs-*` e `--sp-*`, e as medidas de impressão são em pt. Ficaram todas **só
dentro do bloco `@media print`**, sem nenhum token novo. O bloco abre com um comentário
a explicar porquê: a diferença entre uma e duas páginas são milímetros, e um degrau das
escalas de ecrã é grosso demais para isso. O CLAUDE.md passou a registar a exceção.

**As medidas finais** são as que deste, e não precisei de ajustar nenhuma:

| O quê | Medida |
|---|---|
| corpo | 9,6pt / 1,4 |
| nome (`h1`) | 18pt / 1,15 |
| cargo | 10pt |
| linha pessoal | 8,8pt / 1,45 |
| fotografia | 70pt |
| linha dos links | 8,3pt |
| resumo | 9pt / 1,45, barra de 1,5pt, 9pt de recuo |
| títulos de secção | 7,8pt, espaçamento de 0,14em, régua de 0,75pt |
| título de item | 9,6pt |
| meta (tecnologias e datas) | 8,4pt / 1,45 |
| linha de item (a da experiência) | 8,9pt |
| competências | 8,9pt / 1,45, 3pt × 14pt entre células |
| idiomas e interesses | 8,9pt |
| "Mais seis projetos…" | 8,5pt, a do protótipo (o enunciado não a media) |
| entre secções | 8pt (10pt a seguir ao resumo) |
| entre itens | 5pt |

**Sobra na folha:** 36,3 mm em português e 41,0 mm em inglês.

---

## 4. O `npm run cv` e as três guardas

`scripts/gerar-cv.mjs` reaproveita o `comum.mjs` das auditorias:

- arranca o `astro preview` se não houver nenhum a responder, e pára-o no fim;
- usa o mesmo Playwright e o mesmo Chromium.

Para cada língua:

1. abre a página **no tema escuro, de propósito**, com o tema guardado como um
   visitante o guardaria;
2. confirma que o `<html>` tem mesmo `dark-mode`;
3. `emulateMedia({ media: 'print' })`, espera pelas fontes (400, 500 e 600) e pela
   imagem;
4. `page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true })`.

Escreve no `public/assets/docs/CV.pdf`, no mesmo caminho e substituído, e no
`public/assets/docs/CV-en.pdf`, que é novo. **Se qualquer guarda falhar, em qualquer
língua, não escreve nenhum dos dois**, e os que lá estão ficam como estavam.

**Ler o PDF sem bibliotecas.** Não acrescentei nenhuma. O script traz um leitor mínimo:

- percorre os objetos do PDF e descomprime os fluxos com o `zlib` do Node;
- lê o CMap `ToUnicode` de cada fonte;
- interpreta os operadores de texto (`Tj`, `TJ`, `Tm`, `Td`…) e o `ActualText`, para o
  caso de haver ligaduras.

Serve os PDF do Chromium. Não conhece fluxos de objetos, encriptação nem outros
filtros, e nesses casos dá erro em vez de texto errado. A opção `--texto` mostra o que
leu.

**As três guardas, com a prova de cada uma.** Para cada guarda sabotei uma cópia do
`dist/` de propósito e corri o script: saiu com código 1 e os PDF de `public/` ficaram
com o mesmo MD5. No fim, o `dist/` foi reposto.

| Guarda | Hoje | A sabotagem | O que o comando disse |
|---|---|---|---|
| **1. Uma página** | ✓ 1 página em cada | 40pt entre secções, em PT | `GUARDA 1: o PDF tem 2 páginas; tem de ter exatamente 1. O conteúdo passa a folha em 30,7 mm.` |
| **2. Texto extraível** | ✓ 1778 caracteres (PT) e 1740 (EN), em 3 fontes Poppins | a página impressa trocada por uma imagem dela própria, em PT | `GUARDA 2: o texto não é extraível: 0 caracteres (mínimo 1586), 0 fonte(s)`, e a guarda 3 listou as 52 strings em falta |
| **3. Igual ao canónico** | ✓ 52 strings por língua, pela ordem, e nada a mais | EN: "Gym and boxing." e "Trainee"; PT: uma frase a mais | as quatro divergências do EN e a do PT, todas listadas, com o texto do canónico e o do PDF |

A **guarda 3** compara sem espaços em branco. O PDF não guarda as quebras de linha como
texto, e uma frase partida em duas linhas não é uma divergência. Todos os outros
caracteres têm de estar lá, pela ordem. Entre duas strings só podem aparecer os
separadores que a página desenha: o ponto do nome, "·" e "—". Os títulos comparam-se em
maiúsculas, porque o CSS os põe assim. O email e os três links vêm do `site.json` e do
`astro.config.mjs`, e são verificados da mesma maneira.

**O fundo branco** também é verificado, de duas formas, e é a quarta coisa que faz o
comando falhar:

- antes de gerar, o `html` e o `body` têm de estar a branco na impressão, com o tema
  escuro ativo;
- no PDF, a folha e todos os retângulos grandes têm de ser `#FFFFFF`.

A sabotagem (fundo `#0F172A` na impressão) foi apanhada pelas duas. **Hoje:** as cores
do texto no PDF são `#0F172A`, `#475569` e `#7C3AED`. Vi os dois PDF: brancos.

---

## 5. O que mudou nas verificações

| Verificação | Antes | Agora |
|---|---|---|
| `check:texto` | 926 verificações | **1016** (508 + 508), zero divergências |
| `check:i18n` | 55 chaves de cada lado | **63** de cada lado |
| `audit:a11y` | 16 páginas | **18 páginas**, e um bloco novo para o CV |
| `audit:teclado` | 16 páginas | **18 páginas**, e o "Ver CV" e o "Descarregar PDF" |

**No `check:texto`**, o ponto 7 é novo e verifica, nas duas línguas:

- o botão "Ver CV" do hero: leva a `/cv/` ou `/en/cv/`, sem `download` nem `target`;
- as seis etiquetas de SEO e o `hreflang`;
- o `h1` único;
- o cargo, a localidade e o email, a fotografia com o seu `alt`, e os três links com o
  destino de cada um;
- o resumo;
- o botão de descarregar, e que o PDF existe no `dist/`;
- as secções pela ordem, e cada item parte a parte;
- no fim, a sequência inteira do `<main>`: nenhum texto a mais, nenhum fora de ordem.

O ponto 1 deixou de procurar os textos de `interface.cv` na página inicial. **Prova:**
sabotei sete coisas numa cópia do `dist/`:

- o hero a voltar ao PDF com `download`;
- o PDF da outra língua no botão;
- duas secções trocadas;
- um valor das competências trocado;
- uma frase a mais;
- o `og:title`;
- um texto em inglês.

O check falhou com 8 divergências. O texto trocado conta duas vezes: no item e na
sequência do `<main>`.

**No `check:i18n`**, as chaves novas entram na paridade.

**No `audit:a11y`:**

- as duas páginas novas passam pelos mesmos testes das outras;
- o bloco novo do CV mede a grelha das competências e, na impressão, confirma o fundo
  branco, os elementos escondidos e um contraste mínimo de 5,70:1;
- sem JavaScript, o "Descarregar PDF" tem de responder 200 com um PDF.

Na primeira corrida, a auditoria apanhou um problema real, e eu corrigi-o. No
telemóvel, eu escondia com `display: none` o "·" entre a localidade e o email, e a regra
"sem JavaScript, todo o texto do `<main>` é visível" apanhou-o. O separador passou a ser
CSS, como nos links.

**No `audit:teclado`:**

- o "Descarregar PDF" recebe o foco, tem contorno e aponta para o PDF certo, que
  responde 200;
- o "Ver CV" do hero leva, com Enter, ao CV da mesma língua.

**No `build`, a guarda da TTF continua:** construí com a configuração do projeto, mas
com o `publicDir` e o `outDir` em `node_modules/.cache/` e uma TTF lá dentro. O build
falhou com "Ficheiros de fonte de build chegaram ao dist: dist/Poppins-Regular.ttf".
O código de saída foi 127, que é o que o Astro 7 devolve nesse caso. O `public/` e o
`dist/` verdadeiros não foram tocados.

---

## 6. O mapa (`npm run mapa`)

`scripts/gerar-estrutura.mjs` conta o disco e reescreve o `docs/ESTRUTURA.md`:

- **refaz** a lista de ficheiros de cada pasta, os tamanhos, os totais, os três resumos
  e a lista do que fica de fora;
- **guarda as descrições**, que se escrevem à mão no próprio mapa: a introdução de cada
  pasta e as quatro colunas de cada ficheiro. O mapa é a fonte das suas descrições, e
  por isso deixou de haver scripts temporários;
- **um ficheiro novo** entra com as colunas "⚠ por descrever", e o comando sai com
  código 1 até alguém as escrever. Foi assim que os 9 ficheiros novos desta fase
  apareceram, e descrevi-os;
- **`--verificar`** não escreve nada e diz se o mapa é exatamente o que o comando
  escreveria.

**Exclui** `node_modules/`, `dist/`, `.astro/`, `.git/`, `docs/historico/` e `Claude
outputs/`. O `docs/historico/` descreve-se numa linha, mas **nem se lista nem se conta**
no mapa. Numa primeira versão contava-o ("hoje 23 ficheiros"), e isso voltava a
desatualizar o mapa a cada relatório escrito — precisamente o que se queria acabar.

**Resultado:** **102 ficheiros no disco = 102 linhas no mapa**, e o `--verificar` diz que
está em dia.

Nesta fase também corrigi no mapa coisas que já estavam mal:

- a linha do `site.json` listava como utilizadores o `BaseLayout.astro`, o
  `caseStudy.ts` e o `seo.ts`, que não o importam;
- o `Hero.astro` deixou de o usar nesta fase;
- a do `caseStudy.ts` tinha a mesma imprecisão;
- a linha do `FASE-8-resumo.md` tinha o tamanho estragado ("1,1 KB1,2 KB"), por uma edição
  minha na fase 8. Saiu com a exclusão do `docs/historico/`.

A ordem das pastas mudou um pouco (`src/pages` antes de `src/pages/en`, e `src` depois de
`src/content/projects`), porque agora é alfabética de forma explícita.

---

## 7. A regra da não repetição: o que o CV repete

Procurei, com Node, sequências de 5 ou mais palavras do CV que aparecem noutros textos
do site. Há **23 pares**. **Não corrigi nenhum**, como manda a regra: o CV é, por
natureza, um resumo do resto. Os principais:

- **O resumo do CV e o Sobre:** "Comecei a programar no 10.º ano" está nos dois.
- **Licas:** "plataforma de encomendas online para uma pastelaria artesanal" também é a
  frase da linha do projeto.
- **CadflowBankSystem:** "Desafio técnico proposto por uma empresa" está na frase da
  linha, e "em cerca de um mês" no contexto do case study. É a frase que a fase 4
  reduziu de quatro sítios para um, e o CV volta a pô-la num segundo.
- **3D Analyzer:** "motor de cálculo em C++ nativo" está na frase da linha e no
  contexto.
- **Experiência na ITGlee:** "Loja online de informática com gestão de armazém" é a
  frase da linha do **Gest**, e "Prova de Aptidão Profissional" está no contexto do case
  study dele.
- **"Universidade de Leiria e Oeste"** está no hero e na meta description.

---

## 8. Verificação final

| # | Verificação | Resultado |
|---:|---|---|
| 1 | `npm run build` | ✅ exit 0, zero avisos, 18 páginas |
| 2 | `npm run check:i18n` | ✅ 63 chaves de cada lado |
| 3 | `npm run check:texto` | ✅ 926 → **1016** verificações, zero divergências |
| 4 | `audit:a11y` e `audit:teclado` | ✅ zero falhas, 18 páginas × 2 temas; contraste mínimo 5,02:1 (claro) e 5,70:1 (escuro) |
| 5 | `npm run cv` | ✅ exit 0; dois PDF de 1 página, texto extraível e igual ao canónico |
| 6 | PDF gerado do tema escuro | ✅ branco (verificado pelo script e visto) |
| 7 | `npm run og` | ✅ as 9 imagens iguais, byte a byte, às do commit |
| 8 | "Frameworks e bibliotecas" | ✅ 24px do valor nos dois temas, 18,7px na impressão |
| 9 | O hero e a página | ✅ `/cv/` e `/en/cv/`; botão de descarregar para o PDF da língua |
| 10 | Texto antigo do site | ✅ só mudou o `hero-btn-cv` (secção 1) |
| 11 | `git log -1` | ✅ `4f13bec`, nada commitado nem enviado |
| 12 | `git status` | ✅ nenhuma linha de *deleted*; o `CV.pdf` aparece como modificado |
| 13 | Disco = mapa | ✅ 102 = 102, e o `--verificar` passa |
| 14 | `node_modules/.cache/` | ✅ sem nada meu no fim |

**O que não verifiquei, ou fica a saber:**

- **O site no ar não foi tocado nem verificado.** Nada foi publicado.
- **Cada `npm run cv` produz bytes diferentes**, mesmo com o mesmo texto: o PDF leva a
  data de criação (`/CreationDate`). Não isolei se há mais alguma diferença. Correr o
  comando sem mudar nada deixa os dois PDF como modificados no git.
- **Os PDF pesam cerca de 211 KB cada** (o antigo tinha 380 KB). Quase tudo é a
  fotografia: o Chromium embute-a a 400px, sem compressão com perdas. Ficou assim para
  usar o mesmo ficheiro do hero, como pedido.
- **Os PDF novos só chegam ao `dist/` no build seguinte** ao `npm run cv`. No CI não há
  problema, porque os PDF são versionados em `public/`.

---

## 9. Decisões que tomei sozinho

1. **O texto do CV partido nas partes de cada linha**, cortando só o " — ". O nome e o
   texto alternativo da foto entram na secção `cv`, mesmo iguais a textos que já
   existiam, porque o enunciado os dava como texto do CV.
2. **A divisão entre i18n e dados:** os títulos de secção, o botão e o título da página
   ficam no i18n (`cv-*`); o resto do texto fica em `src/data/cv.json`.
3. **O link do site no CV inglês leva a `/en/`.** O texto continua
   "franciscopereira.dev".
4. **O email em texto simples**, sem `mailto:`, como no protótipo.
5. **"Descarregar PDF" é um botão preenchido** (`btn-primary`), o mesmo de "Ver
   projetos". Fica o segundo botão preenchido do site.
6. **As medidas de desenho do ecrã:** a coluna de 48rem, a fotografia de 128px, e no
   telemóvel a foto por cima e os links um por linha.
7. **As regras de telemóvel do CV só para `screen`**, para a impressão não as apanhar.
8. **"Mais seis projetos…" a 8,5pt na impressão**, a medida do protótipo.
9. **O `npm run cv` é tudo ou nada:** se uma língua falhar, não escreve nenhuma. Também
   verifica o fundo branco (a quarta coisa que o faz falhar), mede a folga em mm e tem
   a opção `--texto`.
10. **O leitor de PDF escrito dentro do script**, em vez de uma biblioteca.
11. **O `check:texto` lê o domínio do `public/CNAME`**, para não importar configuração do
    site, como já fazia com as rotas.
12. **O mapa como fonte das próprias descrições**, com o "por descrever" a fazer falhar,
    o `--verificar`, e o `docs/historico/` sem contagem.
13. **Atualizei o `README.md`**, que dizia 16 páginas e não conhecia o CV nem os dois
    comandos novos. O enunciado só pedia o `CLAUDE.md` e o `ESTADO-ATUAL.md`.
14. **Corrigi no mapa** os utilizadores errados do `site.json`, do `caseStudy.ts` e do
    `i18n/index.ts`.
15. **Não fiz `git add`** de nada desta fase: não foi pedido. O `CLAUDE.md` e o
    `ESTADO-ATUAL.md` dizem-no.

