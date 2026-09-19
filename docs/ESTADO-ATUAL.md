# Estado atual — 2026-09-19

Retrato detalhado do projeto depois da publicação de 2026-09-17, com o que as fases seguintes
acrescentaram — a 9 pôs o CV no site como página, a 11 publicou tudo, e a 12
reestruturou o CV. As regras, as decisões e o mapa
geral estão no [CLAUDE.md](../CLAUDE.md).

## 1. Os 9 projetos

A ordem é a do site e está fixada no canónico em `projetos.ordem`. Os 9 estão numa só
lista. O **estado** é o campo `status` dos dados:

- `live`: tem demonstração pública;
- `no-demo`: não tem demonstração;
- `in-development`: não há nada público para mostrar. No Licas, o rótulo do site é
  "Ainda não publicado".

| # | Slug | Etiqueta (PT) | Estado | Página | Modal | Botão "?" | A minha parte | Screenshot | Imagem de partilha | Arranque a frio | Demonstração | Repositório |
|---:|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 | `licas` | Cliente real | in-development | ✅ | — | — | — | — | geral | — | — | privado |
| 02 | `dae` | Projeto universitário · Equipa de 4 | live | ✅ | — | — | ✅ | `dae.jpg` | `og/dae-*.jpg` | ✅ Render | https://dae-frontend.onrender.com/ | https://github.com/francisco-pereira-dev/DAE.git |
| 03 | `ainet` | Projeto universitário · Equipa de 4 | live | ✅ | — | — | ✅ | `ainet.jpg` | `og/ainet-*.jpg` | ✅ Render | https://ainet2425.onrender.com | https://github.com/francisco-pereira-dev/Ainet2425.git |
| 04 | `3d-analyzer` | Projeto pessoal · C++ e WebGL | no-demo | ✅ | — | — | — | — | geral | — | — | https://github.com/francisco-pereira-dev/3D-Analyzer |
| 05 | `cadflow-bank-system` | C++ · Desktop | no-demo | ✅ | — | — | — | — | geral | — | — | https://github.com/francisco-pereira-dev/CadflowBankSystem |
| 06 | `hotel-inteligente` | Projeto universitário · Equipa de 2 | live | ✅ | — | — | ✅ | `ti.webp` | `og/hotel-inteligente-*.jpg` | ✅ Render | https://ti-xp2g.onrender.com | https://github.com/francisco-pereira-dev/TI.git |
| 07 | `gest` | Secundário · 2021 | no-demo | ✅ | — | — | — | `logo-gest.jpg` | `og/gest-*.jpg` | — | — | https://github.com/francisco-pereira-dev/PAP.git |
| 08 | `mr-pizza` | Design → Código | live | — | ✅ | ✅ `projects-design-text` | — | `mrpizza.webp` (não aparece no site) | geral (sem página) | — | Figma (`figma.com/make/57gTE2…`) | https://github.com/francisco-pereira-dev/MR.PIZZA |
| 09 | `diane-arbus` | Design → Código | live | — | ✅ | ✅ `projects-design-text` | — | `dianearbus.webp` (não aparece no site) | geral (sem página) | — | Figma (`figma.com/make/6iWnse…`) | https://github.com/francisco-pereira-dev/Catalogo-Diane-Arbus |

**Página inicial, de cima para baixo, tudo sobre o mesmo fundo (`--bg-color`):**

1. **Hero**, centrado:
   - a foto (200px; 150px no telemóvel);
   - o nome com o ponto final roxo;
   - "Developer full-stack";
   - "Finalista de Engenharia Informática na Universidade de Leiria e Oeste.";
   - três ações. "Ver projetos" é o único botão preenchido, a `#7C3AED`.
2. **Sobre** ("Sobre mim"): o cabeçalho com a régua, e dois parágrafos à esquerda numa
   coluna centrada.
3. **Competências**: 4 grupos em duas colunas, cada tecnologia com as suas provas
   (ver secção 2).
4. **Projetos**: uma só lista de 9 linhas, todas com o mesmo tratamento e o mesmo
   espaço entre si.
   - Cada linha tem o id `projeto-<slug>`: número, título, etiqueta por baixo, frase,
     stack e ação.
   - Os 7 com case study ligam à página ("Ver mais →").
   - Os 2 sem case study abrem a modal pelo título; a ação é "Ver Repositório →" e
     têm o botão "?".
5. **Contactos** ("Vamos falar"): o cabeçalho e três cartões com ícones (email,
   LinkedIn, GitHub), em **três colunas de largura igual**, centradas no mesmo eixo do
   título (fase 5.2). Não há texto de introdução.
6. **Rodapé** simples, com a régua fina por cima.

**Páginas de case study:**

- a etiqueta, o título, a frase de abertura, as tecnologias, os links e a nota de
  arranque a frio;
- as secções pela ordem fixa;
- sem imagens;
- "A minha parte" só no DAE, no AINET e no Hotel.

**Competências** (`src/data/skills.json`), em 4 grupos: linguagens (6), frameworks e
bibliotecas (6), dados (3), ferramentas e plataformas (4).

## 2. Mapa das provas

Há 33 provas por língua: 30 internas e 3 externas. **Desde a Fase 5, os rótulos são
os nomes dos projetos**, e não os dos repositórios. Em EN, os caminhos levam o prefixo
`/en/` (`/en/projects/<slug>/`, `/en/#projeto-<slug>`, `/en/#projects`), "todos" é
"all" e "Hotel Inteligente" é "Smart Hotel". Os outros rótulos são iguais nas duas
línguas.

**Desde a Fase 5.2, todas as provas levam à linha do projeto** na secção Projetos, e
já não à página do case study. As páginas continuam a abrir pelo "Ver mais" de cada
linha.

| Competência | Provas → destino (PT) |
|---|---|
| TypeScript | Licas → `/#projeto-licas` · Mr. Pizza → `/#projeto-mr-pizza` · Diane Arbus → `/#projeto-diane-arbus` |
| JavaScript | 3D Analyzer → `/#projeto-3d-analyzer` · Portfolio → **GitHub** · Hotel Inteligente → `/#projeto-hotel-inteligente` |
| C++ | 3D Analyzer → `/#projeto-3d-analyzer` · CadflowBankSystem → `/#projeto-cadflow-bank-system` |
| Java | DAE → `/#projeto-dae` |
| PHP | AINET → `/#projeto-ainet` · Hotel Inteligente → `/#projeto-hotel-inteligente` |
| HTML5, CSS3 | Portfolio → **GitHub** · Mr. Pizza → `/#projeto-mr-pizza` · Diane Arbus → `/#projeto-diane-arbus` |
| React | Licas → `/#projeto-licas` · Mr. Pizza → `/#projeto-mr-pizza` · Diane Arbus → `/#projeto-diane-arbus` |
| Vue 3 | 3D Analyzer → `/#projeto-3d-analyzer` |
| Astro | Portfolio → **GitHub** |
| Laravel | AINET → `/#projeto-ainet` |
| Three.js / WebGL | 3D Analyzer → `/#projeto-3d-analyzer` |
| MFC | CadflowBankSystem → `/#projeto-cadflow-bank-system` |
| PostgreSQL / Supabase | Licas → `/#projeto-licas` |
| MySQL | AINET → `/#projeto-ainet` |
| REST APIs | DAE → `/#projeto-dae` · AINET → `/#projeto-ainet` · Hotel Inteligente → `/#projeto-hotel-inteligente` |
| Docker | DAE → `/#projeto-dae` |
| Vite | Licas → `/#projeto-licas` · AINET → `/#projeto-ainet` · DAE → `/#projeto-dae` |
| Git | todos → `/#projects` |
| OutSystems | Gest → `/#projeto-gest` |

Ao seguir uma prova, a linha para 96px abaixo do topo (72px no telemóvel, para o
título da secção), sempre abaixo da barra fixa, que ocupa 68px.

Nos dados (`src/data/skills.json`, gerado do canónico), cada prova tem o rótulo nas
duas línguas e diz o destino:

- `{ "rotulo": {pt, en}, "projeto": "<slug>" }` para a linha na página inicial;
- `{ "allRepos": true }` para "todos", com o rótulo de `skills-proof-all`;
- `{ "rotulo": {pt, en}, "repo": "Portfolio" }`, que fica no GitHub.

O campo `caseStudy` já não é usado por nenhuma prova; o ramo continua no
`Skills.astro` e no `check:texto`, caso um dia se queira voltar atrás. Os rótulos
antigos (nomes dos repositórios) estão em `retirado['fase-5']` no canónico.

## 3. O que cada verificação cobre hoje

### `npm run build` — hoje: exit 0, 0 avisos, 18 páginas, 45 ficheiros, 1 510,4 KB

- **Schema Zod** (`src/content.config.ts`):
  - campos PT/EN não vazios;
  - `resumo` obrigatório;
  - `nota` opcional, com um valor possível: `projects-design-text`;
  - `caseStudy` `.strict()`, com `minhaParte` opcional e pelo menos 1 decisão;
  - `live` exige `demoUrl`;
  - `no-demo` e `in-development` não podem ter `demoUrl`;
  - imagem e `imageAlt` andam sempre juntos.

  Já **não existe `group`**.
- **`verificarImagensDosProjetos`**, **`garantirQueAsTTFnaoSaem`** e
  **`podarAssetsNaoReferenciados`** (`astro.config.mjs`), como antes.
- **`CaseStudyPage.astro`**: falha se um case study com screenshot não tiver a
  imagem de partilha em `public/og/`.

### `npm run check:i18n` — hoje: 63 chaves de cada lado, OK

- Mesmas chaves em `pt.json` e `en.json`.
- Nenhum valor vazio nem começado por `TODO:`.
- Nenhuma chave de texto de projeto nos ficheiros de interface.

### `npm run check:texto` — hoje: **1026 verificações** (513 PT + 513 EN), zero divergências, zero texto fora do canónico

**Página inicial, nas duas línguas:**

- Cada texto de interface existe como nó de texto ou atributo inteiro.
- **Os quatro cabeçalhos de secção:** o título e a régua, sem mais texto.
- A linha do rodapé, com o ano gerado no build.
- **As competências**, grupo a grupo, pela ordem, com o rótulo e **o destino de cada
  prova**: case study, linha, `#projects` ou GitHub.
- A ordem dos 9 projetos.
- A página inicial tem uma única imagem, o avatar.
- Existem exatamente as modais dos 2 projetos sem case study.

**Por projeto:**

- título; **etiqueta no bloco por baixo do título**; tecnologias; a frase (`resumo`);
  o rótulo "Ainda não publicado";
- **o botão "?"** nos projetos com `nota` (`aria-label`, `aria-controls`,
  `aria-expanded` e o texto), e nenhum nos outros;
- **nos 7 com case study:** o link "Ver mais", sem modal;
- **nos 2 sem case study:** o botão da modal, o link "Ver Repositório", a modal sem
  descrição nem a frase da linha, e nenhuma página.

**Em cada página de case study, nas duas línguas:** `title`, meta description, `h1`,
`umaFrase`, nenhuma imagem, links, rótulo do Licas, nota de arranque a frio, links de
volta, e as secções parágrafo a parágrafo.

**No conjunto:** as páginas geradas batem com `caseStudies.com` e `caseStudies.sem`.

**Etiquetas de SEO da página inicial, uma a uma** (12 verificações, acrescentadas a
2026-09-18): `<title>`, `meta description`, `og:title`, `og:description`,
`twitter:title` e `twitter:description`, comparadas com `interface.seo`. Antes, o ponto
1 só exigia que o texto existisse **algures** na página: o título aparece 4 vezes e a
descrição 3, e uma cópia corrompida ficava tapada pelas outras. Agora cada cópia
responde por si.

**O CV, nas duas línguas** (90 verificações na fase 9; 100 desde a fase 12):

- o botão "Ver CV" / "View CV" do hero leva a `/cv/` / `/en/cv/`, sem `download`;
- na página: o `<title>`, o `og:title` e o `twitter:title` ("CV — Francisco Pereira"),
  as três descrições (o resumo, inteiro ou cortado numa palavra) e o `hreflang` das
  duas línguas;
- um só `h1`, que é o nome; o cargo; a localidade e o email; a fotografia, a única
  imagem, com o seu `alt`; os três links por extenso e o destino de cada um; o resumo;
- o botão "Descarregar PDF" / "Download PDF", com `download`, a apontar para o PDF da
  mesma língua, que tem de existir no `dist/`;
- as seis secções pela ordem da fase 12 — Competências, Experiência, Projetos,
  Educação, Idiomas, Interesses —, cada uma com o seu título, e cada item parte a
  parte;
- na Experiência, a linha da stack e da data, e os pontos um a um e pela ordem, com a
  quantidade certa em cada entrada;
- no fim, o `<main>` inteiro, texto a texto e pela ordem: nenhum texto a mais, nenhum
  fora do sítio.

### `npm run og`

Gera 1 imagem geral e 8 de projeto. Mede o screenshot desenhado, e falha se as
dimensões não forem 1200×630 ou se um ficheiro passar dos 300 KB.

### `npm run cv` — hoje: exit 0, dois PDF de uma página, 55 strings do canónico em cada um

Gera `public/assets/docs/CV.pdf` (PT, o caminho de sempre) e `public/assets/docs/CV-en.pdf`
(EN) a partir das páginas `/cv/` e `/en/cv/`. Corre depois do build e arranca o
`astro preview` sozinho, como as auditorias. Abre cada página no **tema escuro, de
propósito**: o CSS de impressão tem de dar uma folha branca seja qual for o tema.

**Três guardas**, e o comando sai com código 1 em qualquer uma, sem escrever nenhum dos
dois PDF:

1. **Uma página, exatamente.** Com duas, diz quantas tem e quantos milímetros faltam.
   **Hoje sobram 8,9 mm** no fundo da folha, em PT e em EN — cerca de duas linhas de
   texto. Antes da fase 12 eram 36,3 mm (PT) e 41,0 mm (EN).
2. **Texto extraível**: 2084 caracteres em PT e 2033 em EN, em três fontes Poppins. Um
   PDF feito de uma imagem dá 0 e falha.
3. **O texto do canónico**, na língua certa: as 55 strings do CV pela ordem, e nada a
   mais (entre elas só podem aparecer os separadores e o marcador "•" dos pontos). Lista
   todas as divergências.

Verifica também o fundo: a folha e todos os retângulos grandes do PDF são brancos. O
texto é lido do PDF sem bibliotecas, com um leitor mínimo dentro do script. Os PDF
novos só chegam ao `dist/` no build seguinte. Com `--texto`, mostra o texto extraído.

**Reproduzível** (fase 10): o Chromium grava a hora da geração no `/CreationDate` e no
`/ModDate` do dicionário `/Info`, e era só isso que mudava de uma geração para a outra
(não há `/ID` no trailer nem metadados XMP). O script apaga essas duas entradas,
trocando-as por espaços com o mesmo número de bytes, antes de correr as guardas. O mesmo
texto dá sempre os mesmos bytes, e o `npm run cv` escreve o SHA-256 de cada PDF. Hoje:
`CV.pdf` `4ebefdbc…6b4e` e `CV-en.pdf` `9a2d65a0…00c7`. Os PDF continuam com a fotografia
sem perdas (cerca de 213 KB cada), por decisão do Francisco na fase 13 (secção 7).

### `npm run mapa` — hoje: 102 ficheiros no disco = 102 linhas no mapa

Refaz o `docs/ESTRUTURA.md` a partir do disco: a lista de ficheiros, os tamanhos, os
totais, os resumos e a lista do que fica de fora. As descrições escrevem-se à mão no
próprio mapa, e o gerador guarda-as; um ficheiro novo entra "por descrever" e o comando
falha até alguém o descrever. Fica de fora o `docs/historico/`, para escrever um
relatório não desatualizar o mapa, e a pasta `Claude outputs/`, que não é do projeto.
`npm run mapa -- --verificar` diz se o mapa está em dia sem escrever nada.

### `npm run audit:a11y` e `npm run audit:teclado` — hoje: zero falhas

Desde a Fase 5.1 a auditoria está versionada em `scripts/auditoria/` e corre por
comando, sobre o `dist/`. Cada uma arranca o `astro preview` sozinha se não houver
nenhum a responder, e para-o no fim. Usam o **Playwright** e o **@axe-core/playwright**,
que são só `devDependencies` e nunca chegam ao `dist`. O Chromium (cerca de 707 MB)
fica em `node_modules/playwright-core/.local-browsers`, com `PLAYWRIGHT_BROWSERS_PATH=0`;
se faltar: `PLAYWRIGHT_BROWSERS_PATH=0 npx playwright install chromium`.

**`npm run audit:a11y`** cobre, com o resultado de hoje:

- **axe** (wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa, best-practice): 18 páginas × 2
  temas, e também com o menu, o balão "?", a modal e a seta abertos. **Zero violações.**
- **Estrutura**: um `h1` por página, sem saltos de nível, os marcos `header`, `nav`,
  `main` e `footer`, o `lang` certo (`pt-PT` / `en`), o link de saltar, e os SVG
  decorativos escondidos.
- **Contraste do texto**, medido à parte, porque o axe deixou 92 casos por decidir:
  zero abaixo de 4,5:1. O mínimo é 5,02 (claro) e 5,70 (escuro).
- **Sem JavaScript**, nos dois temas do sistema e a 1440, 900 e 375px: 1070 textos
  visíveis em cada combinação, o tema do sistema aplicado, a navegação no sítio certo,
  os links a levarem às secções, e o contraste medido. **O axe não corre aqui:**
  precisa de executar JavaScript dentro da página e fica à espera para sempre. Sem
  JavaScript medem-se a estrutura, o que está visível e o contraste.
- **Seletor de idioma:** o nome diz o destino, e cada código tem o seu `lang`.
- **O CV** (fase 9), nos dois temas, a 1440px, a 375px e em impressão: o rótulo
  "Frameworks e bibliotecas" fica a 24px do valor no ecrã, a 18,7px na impressão, e
  passa para cima dele no telemóvel; na impressão, o fundo é branco, os elementos do
  ecrã estão escondidos e o contraste mínimo é 5,70:1. Sem JavaScript, o "Descarregar
  PDF" responde 200 com um PDF.

**`npm run audit:teclado`** percorre as 18 páginas nos dois temas, com teclas reais:
em todas as paragens de Tab (60 na página inicial, 9 a 12 num case study) o contorno de
foco está visível, não fica tapado pela navbar, segue a ordem visual e tem pelo menos
5,13:1 de contraste. Testa ainda o link de saltar, o menu (foco preso e Escape), o
tema, o "?", a modal, a seta, o idioma, o `aria-current`, "Voltar aos projetos", o "Ver
CV" do hero e o "Descarregar PDF" do CV (foco, contorno e o PDF da mesma língua), e
corre o axe com o menu, o balão, a modal e a seta abertos.

As duas aceitam `--capturas`, que guarda imagens em `node_modules/.cache/auditoria`.

**Incidente conhecido do `audit:a11y`** (fase 11, 2026-09-18, perto das 23h UTC): numa
corrida, a auditoria rebentou com um timeout do próprio teste, no bloco sem
JavaScript, no tema escuro a 375px, ao seguir um link da navegação — o
`page.waitForURL` esperou 30 s e desistiu, sem dizer qual URL. Não se reproduziu em
quatro corridas seguidas, três delas com uma sonda de fora a registar cada navegação,
a consola, os pedidos falhados e as respostas de erro: 845 eventos por corrida, zero
erros de qualquer tipo, a maior pausa cerca de 3 s no arranque. **É uma falha
intermitente da auditoria, não do site**, e fica como limite conhecido do ambiente de
teste. Se voltar, guarda-se o diagnóstico antes de repetir: o URL, se o servidor de
preview responde a um pedido simples, a consola da página e o tempo até desistir.

## 4. O que está publicado

**Hoje: `cb5e0dd`**, publicado a 2026-09-18 às 23:17 UTC. São seis commits, um por
fase, feitos numa sessão do Claude com autorização expressa do Francisco (2026-09-19,
00:10 hora de Lisboa). O push foi feito pelo Francisco, porque as permissões da sessão
o bloquearam:

| Commit | Fase | Ficheiros |
|---|---|---:|
| `288142d` | 6 — verificações no CI e o `sharp` | 2 |
| `2b157e5` | 7 — `docs/`, licenças e a limpeza ao código | 21 |
| `55b1368` | 8 — a prova refeita e o inventário para o histórico | 5 |
| `f82d8e9` | 9 — o CV como página | 17 |
| `51c045d` | 10 — as correções ao CV e os PDF reproduzíveis | 9 |
| `cb5e0dd` | 11 — o `.gitignore` e o mapa | 3 |

Cada ficheiro foi no commit da última fase que lhe mexeu, e por isso os commits das
fases 6 e 9 não são coerentes sozinhos (o `package-lock.json` sem o `package.json`; o
`CvPage.astro` sem o `cv.json`). Só a ponta foi construída e publicada.

**A Action correu verde, pela ordem certa:** `Verificar` das 23:16:50 às 23:17:02,
`Build` das 23:17:06 às 23:17:24 e `Deploy` das 23:17:30 às 23:17:39 (UTC). Foi a
primeira vez que o CI novo correu a sério.

**Verificação contra o site ao vivo, a 2026-09-19** (fase 13), contra o `cb5e0dd` e não
contra a árvore de trabalho:

- **Domínio:** `https://franciscopereira.dev/` responde 200 (servidor GitHub.com), e o
  `http://` redireciona com 301. Certificado Let's Encrypt (YR1), TLS 1.3, válido de
  2026-07-29 a **2026-10-27**, para `franciscopereira.dev` e `www.franciscopereira.dev`.
- **As 18 páginas do sitemap respondem 200**, incluindo `/cv/` e `/en/cv/`.
- **Byte a byte:** um build limpo do commit (`git archive` + `npm ci` + `npm run build`,
  em `node_modules/.cache/`) e o site ao vivo são iguais em 44 ficheiros: as 18 páginas,
  o sitemap, os dois CSS, as 8 fontes, a fotografia, as 9 imagens de partilha, o favicon
  e os dois PDF. O `robots.txt` do export tinha 4 bytes a mais (CRLF, do
  `core.autocrlf` do Windows); o que está no ar é byte a byte o objeto do git.
- **`check:texto`** do `cb5e0dd`, com o canónico desse commit, **contra o HTML ao vivo**:
  1016 verificações, zero divergências.
- **Num browser**, as 18 páginas ao vivo: 114 pedidos, **zero erros e zero 404**.
- **"Ver CV"** leva a `/cv/` e **"View CV"** a `/en/cv/`. **"Descarregar PDF"** e
  **"Download PDF"** servem `/assets/docs/CV.pdf` e `CV-en.pdf`: 200,
  `application/pdf`, uma página cada, byte a byte iguais aos do commit.

### O commit anterior, `4f13bec`

**O HEAD é `4f13bec` — "Add accessibility audits & accessibility updates", de
2026-09-17 às 22:14:52 (UTC+1) — e a `main` está alinhada com a `origin/main`.** O
commit e o push foram feitos pelo Francisco, à mão e de propósito, fora das sessões do
Claude: 54 ficheiros, +2568 −825.

Está publicado, e verificado contra o site ao vivo (ver secção 4.1). O que o commit
levou, por ficheiro, acumulando nove fases — o fim da Fase 4, a 4.2a, a 4.2b, a 4.2c, a
4.2d, a 5, a 5.1, a 5.2 e a 5.3:

| Ficheiro | + | − | O que mudou (acumulado) |
|---|---:|---:|---|
| `content/texto-canonico.json` | 565 | 125 | Todo o texto das fases 4.2a a 5.2 (na 5: rótulos das provas, "Saltar para o conteúdo", "Fechar"; na 5.1: nome do seletor de idioma e alt da foto; na 5.2: as provas passam a apontar para a linha), os registos `retirado` e as fontes |
| `src/styles/global.css` | 448 | 199 | Tokens de texto e botão principal; foto; cabeçalhos; fundo único; linhas de projeto; contactos; rodapé; seta. Fase 5: link de saltar, menu fechado com `visibility: hidden`, links do rodapé sublinhados, transição do botão do menu. Fase 5.1: `html.js` na animação de entrada, tema do sistema sem JavaScript, estilos da navegação sem JavaScript. Fase 5.2: contactos em três colunas iguais e as duas margens de ancoragem. Fase 5.3: saem `.btn-outline` e `--footer-bg` |
| `src/styles/case-study.css` | 101 | 51 | Escalas da Fase 4; sem figura. Fase 5: "Voltar aos projetos" sublinhado |
| `scripts/check-texto.mjs` | 85 | 38 | Cobre a estrutura atual. Fase 5: rótulos das provas por língua |
| `src/content/projects/*.json` (9) | | | `resumo` em todos; etiquetas; case studies corrigidos e o do Cadflow; `nota` no Mr. Pizza e no Diane Arbus; sem `group` |
| `src/data/skills.json` | 18 | 18 | Provas internas; Fase 5: `rotulo` com os nomes dos projetos; Fase 5.2: `caseStudy` passa a `projeto` em 23 provas |
| `src/scripts/main.js` | 95 | 57 | Sai o "Copiar email"; entram a seta e os botões "?". Fase 5: `aria-expanded` e `inert` no menu, `inert` nas modais, `aria-current` no scrollspy, Escape fecha o menu |
| `src/components/ProjectRow.astro` | 45 | 9 | id, etiqueta por baixo, botão "?", rótulo inerte, frase |
| `src/components/Projects.astro` | 11 | 68 | Uma só lista, sem destaque nem sub-secção |
| `src/components/Skills.astro` | 32 | 16 | Provas internas, cabeçalho; Fase 5: rótulo por língua; Fase 5.2: comentário do destino novo |
| `src/components/Contacts.astro` | 51 | 36 | Cartões com ícones, sem introdução; Fase 5: círculos `aria-hidden` |
| `src/components/About.astro` | 7 | 19 | Dois parágrafos, cabeçalho |
| `src/components/Hero.astro` | 15 | 5 | Foto |
| `src/components/Navbar.astro` | 13 | 5 | Fase 5: marco `<header>`, `aria-expanded`/`aria-controls`, emojis `aria-hidden` |
| `src/components/OverlayMenu.astro` | 6 | 2 | Fase 5: marco `<nav>`, SVG do email escondido |
| `src/components/ProjectModal.astro` | 6 | 17 | Sem imagem nem descrição; Fase 5: "×" com nome "Fechar" |
| `src/components/SectionHeading.astro` (novo) | 18 | 0 | Título e régua |
| `src/components/NavSemJs.astro` (novo) | 40 | 0 | Fase 5.1: navegação para quem não tem JavaScript |
| `src/components/Icon.astro` | 1 | 1 | Fase 5.3: o comentário deixa de apontar para o `ICONES.md` |
| `src/icons/*.svg` (13 apagados) | 0 | 13 ficheiros | Fase 5.3: ícones das competências, sem uso desde a Fase 4 |
| `scripts/auditoria/` (novo) | 3 ficheiros | | Fase 5.1: `acessibilidade.mjs`, `teclado.mjs` e `comum.mjs` |
| `src/components/Seo.astro` | 2 | 1 | `alumniOf`: Universidade de Leiria e Oeste |
| `src/layouts/BaseLayout.astro` | 31 | 1 | Seta de voltar ao topo; Fase 5: link de saltar; Fase 5.1: classe `js` no `<head>` e `<html>` sem classe de tema |
| `src/layouts/CaseStudyPage.astro` | 8 | 22 | Sem figura; secções opcionais; Fase 5: `main#conteudo` |
| `src/layouts/PortfolioPage.astro` | 3 | 2 | Competências com língua; Fase 5: `main#conteudo` |
| `src/content.config.ts` | 9 | 4 | `resumo`, `minhaParte` opcional, `nota`, sem `group` |
| `src/i18n/pt.json`, `en.json` | 11+11 | 15+15 | 55 chaves |
| `package.json`, `package-lock.json` | 6+55 | 2+1 | Fase 5: `playwright` e `@axe-core/playwright` como `devDependencies`; Fase 5.1: comandos `audit:a11y` e `audit:teclado` |
| `README.md` | 67 | 40 | Fase 5: reescrito em português |
| `.gitignore` | 8 | 0 | Fase 5: caches e resultados de ferramentas |
| `CLAUDE.md`, `ESTADO-ATUAL.md` (novos) | | | Contexto para as sessões seguintes |
| `historico/FASE-4-*.md`, `historico/FASE-4.2a-*.md` a `historico/FASE-5.3-*.md` (novos) | | | Relatórios |

A pasta vazia `docs/` foi apagada na Fase 5 (nunca esteve no git). Na Fase 5.3 foram
apagados 13 ficheiros de `src/icons/`, e mais nada. Tudo isto entrou no `4f13bec`.

### 4.1 Verificação do que está no ar (2026-09-18)

O commit foi publicado sem as verificações terem corrido antes. Correram depois, contra
o site:

- **HTTPS e domínio:** `franciscopereira.dev` responde 200, servido pelo GitHub, com
  certificado Let's Encrypt válido até 2026-10-27. O `CNAME` sobreviveu ao deploy.
- **As 16 páginas** respondem 200.
- **O HTML publicado é byte a byte igual** ao de um build limpo de `4f13bec`
  (`npm ci` + `npm run build` num checkout do commit). As 16 páginas e o sitemap batem
  certo.
- **`check:texto` contra o HTML ao vivo:** 914 verificações, zero divergências (eram 914 nessa data; passaram a 926 com as etiquetas de SEO a mais, e a 1016 na fase 9, com o CV).
  `check:i18n`: OK.
- **Zero 404:** os 5 recursos que as páginas pedem existem, e nenhuma página menciona os
  13 ícones apagados.
- **Ficheiros servidos:** CNAME, robots.txt, sitemap (16 páginas), CV.pdf, favicon, as 8
  imagens de `og/` e as 8 fontes WOFF2 — todos 200, com o mesmo tamanho dos locais.

### 4.2 Por commitar neste momento

**As fases 12 e 13:** o CV reestruturado e "Acomodei" no canónico e no
`src/data/cv.json`, o `CvPage.astro` e o `cv.css`, os dois PDF regenerados, o
`check-texto.mjs` e o `gerar-cv.mjs` com a ordem nova e os pontos, a documentação, e os
relatórios das fases 11, 12 e 13. A fase 13 tem autorização expressa para os publicar.

Tudo o que vem a seguir nesta secção foi para os commits das fases 6 a 11, e já está
publicado; fica como registo.

O `deploy.yml` (verificações no CI), o `package.json` e o `package-lock.json` (o
`sharp` declarado), a pasta `docs/` — que leva o `docs/ESTADO-ATUAL.md`, o
`docs/historico/LIMPEZA-PROPOSTA.md`, o `docs/ESTRUTURA.md`, o `docs/LICENCAS.md` e os
relatórios em `docs/historico/` — e o `CLAUDE.md`.

**Da fase 9 (o CV), também por commitar:** as páginas `/cv` e `/en/cv`
(`src/pages/cv.astro`, `src/pages/en/cv.astro`, `src/layouts/CvPage.astro`,
`src/lib/cv.ts`, `src/styles/cv.css`, `src/data/cv.json`); o texto no canónico e no
i18n; o `cvPathEn` no `site.json`; o botão do hero (`Hero.astro`,
`PortfolioPage.astro`); os dois PDF (`CV.pdf` substituído no mesmo caminho e
`CV-en.pdf` novo); os scripts `gerar-cv.mjs` e `gerar-estrutura.mjs`, com os comandos
`cv` e `mapa` no `package.json`; as verificações alargadas (`check-texto.mjs` e as
duas auditorias); e a documentação. Nada disto foi preparado com `git add`.

**Da fase 10, também por commitar e sem `git add`:** as quatro frases do CV no
canónico e no `src/data/cv.json`, os dois PDF regenerados, os PDF reproduzíveis no
`scripts/gerar-cv.mjs`, e a exceção à regra de não repetição no `CLAUDE.md`.

## 5. Commits e pushes feitos fora das sessões

As sessões do Claude não fazem commits nem pushes. Estes foram feitos fora delas.

**Na tarde de 2026-09-14** (autor Francisco Pereira, hora UTC+1):

| Hora | Hash | Mensagem | Nota |
|---|---|---|---|
| 16:04:51 | `e636a1e` | Phase 4: projects list, UI & content changes | Versão no remoto, filha de `ee02531`. A Action correu com sucesso às 16:04:58 e publicou-a |
| 16:04:51 | `740a9ec` | Phase 4: projects list, UI & content changes | A mesma alteração, reaplicada localmente por rebase sobre `e8c73ac` |
| 16:08:57 | `21d0811` | Remove phase & migration docs and ICONES.md | Apaga FASE-3.x, FASE-3-publicacao, MIGRACAO-2.x e ICONES.md |
| 16:09:01 | `88b375e` | Merge branch 'main' of …/Portfolio | Funde o ramo local com a `origin/main` |
| 16:09:28 | `9810f88` | Delete .mds | Apaga outra vez os relatórios. Action com sucesso às 16:09:35; **esteve publicado até 2026-09-17** |

**Consequências:**

- **O site publicado esteve na Fase 4 intermédia até 2026-09-17**, sem nada das fases 4.2a a 4.2d. O `4f13bec` fechou essa lacuna.
- **O histórico tem commits duplicados.** Depois do merge, a `main` contém duas
  cópias de cada commit das fases 3.3 a 3-publicação, com hashes diferentes.
  - **Do lado remoto:** `75a83fd` a `ee02531`.
  - **Do lado local:** `1d73f3a` a `e8c73ac`.
- **Os relatórios das fases 2.2 a 3 já não estão na árvore.** Continuam no histórico.

**Em 2026-09-17, às 22:14:52** (autor Francisco Pereira, UTC+1):

| Hora | Hash | Mensagem | Nota |
|---|---|---|---|
| 22:14:52 | `4f13bec` | Add accessibility audits & accessibility updates | 54 ficheiros, +2568 −825: o fim da Fase 4 e as fases 4.2a a 5.3. Decisão do Francisco, tomada de propósito fora das sessões. Publicado com sucesso; é o que está no ar |

**Consequência:** o site publicado **deixou de estar na Fase 4 intermédia** e passou a
ter tudo até à Fase 5.3, incluindo a acessibilidade, o site sem JavaScript e as provas a
apontarem para a linha do projeto.

Os commits duplicados de 2026-09-14 não foram corrigidos: mexer no histórico é decisão
do Francisco.

**Em 2026-09-19, às 00:10** (autor Francisco Pereira, UTC+1): os seis commits das fases
6 a 11 (secção 4), **feitos numa sessão do Claude, com autorização expressa do
Francisco** — ao contrário dos anteriores, feitos por ele à mão. O push foi dele.

## 6. Acessibilidade

### Feito nas fases 5, 5.1 e 5.2

- **Link "Saltar para o conteúdo" / "Skip to content"**: é o primeiro elemento do
  `body`, fica fora do ecrã até receber foco, e leva ao `main#conteudo`
  (`tabindex="-1"`).
- **Marcos:** a navbar é `<header>`, o menu overlay é `<nav>`, e cada página tem
  `<main>` e `<footer>`.
- **Menu:** o botão tem `aria-expanded` e `aria-controls`. Com o menu aberto, o foco
  vai para o primeiro link, o resto da página fica `inert`, e Escape fecha e devolve o
  foco ao botão. Fechado, o menu tem `visibility: hidden` e sai da ordem de tabulação.
  O link da secção atual leva `aria-current`.
- **Modais:** `role="dialog"`, `aria-modal` e título. O "×" chama-se "Fechar" /
  "Close". Com a modal aberta, o resto da página fica `inert`, e ao fechar o foco volta
  ao título que a abriu.
- **Decorativos escondidos:** os emojis do tema, os círculos dos contactos e o SVG do
  email no menu.
- **Segundo sinal nos links que só se distinguiam pela cor:** sublinhado nos links do
  rodapé e em "Voltar aos projetos". As provas das competências e as ações do hero já
  eram sublinhadas. Os botões não levam sublinhado.
- **Indicador de foco:** `2px solid var(--accent-text)`, afastado `--sp-1`, com
  contraste de pelo menos 5,13:1 nos dois temas. No botão preenchido "Ver projetos",
  o contorno fica sobre o fundo da página, e não sobre o roxo.
- **Seletor de idioma (5.1):** o nome lido em voz diz o destino ("Mudar para inglês" /
  "Switch to Portuguese") e cada código visível tem o seu `lang`.
- **Texto alternativo da foto (5.1):** "Fotografia de Francisco Pereira" / "Photograph
  of Francisco Pereira".
- **O site funciona sem JavaScript (5.1):** o conteúdo é visível por omissão, o tema
  segue o sistema, e os links de navegação aparecem no cabeçalho (ou antes do rodapé,
  abaixo de 1180px). O texto do "?" fica aberto, e os controlos que dependem do script
  desaparecem. O detalhe está no `CLAUDE.md`.
- **Contactos em três colunas iguais (5.2)**, centrados no eixo do título.
- **Resultados:** zero violações axe, zero texto abaixo de 4,5:1 e zero erros de
  consola (ver secção 3).

### Pendente de acessibilidade

- **Não há testes com leitores de ecrã reais** (NVDA, VoiceOver, TalkBack) nem com
  teclado num telemóvel: **decisão do Francisco, não é um pendente.** O que dá para
  medir por script está medido e verde.
- **As auditorias não correm na Action:** existem como comandos, mas o deploy não as
  usa.
- **O axe não cobre a versão sem JavaScript** (ver secção 3).
- **Sem JavaScript perdem-se** o menu overlay, a troca manual de tema, a seta de voltar
  ao topo e as modais do Mr. Pizza e do Diane Arbus — as três características de cada
  um e o link do Figma só existem dentro da modal. A linha continua a mostrar título,
  frase, stack e o link do repositório, e nada mais fica escondido.

**Decidido pelo Francisco (5.3): o contorno de foco do botão "?" fica como está**,
mesmo encostando às letras do título do projeto que está por cima.

## 7. Por fazer

**Decisões já tomadas sobre o inventário de limpeza** (2026-09-18), que fecham esse
ponto:

1. **Os relatórios ficam**, versionados em `docs/historico/`.
2. **As duas imagens dormentes ficam** (`mrpizza.webp`, `dianearbus.webp`): a poda já as
   tira do `dist/`, não pesam nada para quem visita o site, e removê-las obrigava a mexer
   no `imageAlt`, que é texto canónico.
3. **O `CLAUDE.md` e o `ESTADO-ATUAL.md` passam a ser versionados.**
4. **As verificações passam a correr no CI e a bloquear o deploy**; as auditorias de
   acessibilidade ficam manuais, por causa dos 707 MB do Chromium.

O inventário completo está no `docs/historico/LIMPEZA-PROPOSTA.md`.

### A limpeza ao código de 2026-09-18

Cinco frentes analisadas — CSS, JavaScript, componentes e layouts, schema e
`package.json` — com a distinção de sempre: **morto** (nada o alcança), **dormente**
(volta se um campo dos dados mudar) e **vivo**.

**Apagado, com o HTML das 16 páginas byte a byte igual e as 44 capturas idênticas:**

| O quê | Onde | Porque era morto |
|---|---|---|
| O prop `class` | `src/components/Icon.astro` (4 linhas) | Os 4 usos do componente — 2 no `Contacts.astro`, 2 no `OverlayMenu.astro` — passam só o `name`. Nada o podia alcançar sem alguém editar código |
| A constante `LANGS` | `src/i18n/index.ts` (2 linhas) | Exportada e nunca importada, em nenhum ficheiro do projeto |

**Morto mas intocável, porque tem texto aprovado por trás** (fica à espera de decisão):
o campo `description` dos 9 projetos, que nenhuma página lê desde a fase 4.2b, e as
`features` dos 7 projetos com case study, que só aparecem nas modais dos outros 2. O
campo do schema que os descreve tem de ficar enquanto o texto ficar.

**Dormente, e por isso nunca candidato:** as classes `.modal-note` e
`.btn-modal-disabled` (voltam se um projeto com modal passar a ter `coldStart` ou
`status: in-development`); o ramo `caseStudy` das provas no `Skills.astro` e no
`check-texto.mjs` (volta se uma prova voltar a apontar para uma página de case study);
os ramos do `tagline`, da `nota` e do estado nas linhas de projeto; e as duas imagens
`mrpizza.webp` e `dianearbus.webp`.

**Sem nada a apagar:** o CSS — dos 201 seletores, nenhum deixa de casar com alguma
página, nos dois temas e com o menu, a modal e o balão abertos, tirando as quatro regras
dormentes; o JavaScript — as 8 funções do `main.js` são todas alcançadas, e as guardas
existem porque nas páginas de case study metade dos elementos não existe; e o
`package.json` — os 10 comandos e as 5 dependências são todos usados.

### Por fazer

- **Texto aprovado que ninguém mostra** — a limpeza de 2026-09-18 encontrou-o e **não
  lhe tocou**, porque sai por decisão do Francisco e nunca por limpeza:
  - o campo `description` dos 9 projetos: descrições longas que nenhuma página lê desde
    que as modais deixaram de as mostrar (fase 4.2b);
  - as `features` dos 7 projetos com case study: só as do Mr. Pizza e do Diane Arbus
    aparecem, na modal;
  - o campo do schema que descreve cada um tem de ficar enquanto o texto ficar: tirá-lo
    com o texto lá deixava os dados sem validação.
- **Menções ao nome antigo da instituição que ficam fora do site:**
  - o texto antigo guardado em `retirado` no canónico;
  - o relatório `docs/historico/FASE-4.2a-tecnico.md`.

**Decisões do Francisco, que já não são pendentes:**

- **A fotografia dos PDF fica sem perdas** (fase 13). A proposta era passá-la a JPEG de
  qualidade 80, à mesma resolução (400×405 px): cada PDF passaria de cerca de 213 KB
  para cerca de 40 KB. O Francisco comparou os dois PDF de ensaio e decidiu ficar como
  está. O `gerar-cv.mjs` não muda.

- **Os commits duplicados do histórico ficam como estão** (secção 5): reescrevê-los
  exigiria um force-push num repositório já publicado.
- **Não haverá testes com leitores de ecrã reais.**
- **As duas imagens dormentes ficam** (`mrpizza.webp`, `dianearbus.webp`).
- **As classes `.modal-note` e `.btn-modal-disabled` ficam:** são dormentes, não mortas.
- **A forma do CV** (fase 12): a ordem é cabeçalho → resumo → Competências → Experiência
  → Projetos → Educação → Idiomas → Interesses; **trabalho pago vai para a Experiência**,
  e não para os Projetos (o Licas passou para lá); **a Experiência leva pontos que
  começam por um verbo no passado**, com uma linha de decisão técnica, e **os Projetos
  ficam em linha corrida**, de propósito. A razão está no `CLAUDE.md`. A linha "Mais
  seis projetos" continua certa: dos 9 projetos do site, o CV nomeia 3 (Licas,
  CadflowBankSystem e 3D Analyzer), e o Portfolio não é um dos 9.
- **O CV está fora da regra de não repetição** (fase 10; a regra e a razão estão no
  `CLAUDE.md`). Na fase 9 contaram-se **23 repetições entre o CV e o resto do site**, e
  **ficaram por decisão, não por esquecimento**. Continuam 23 depois da fase 10 (as
  quatro frases mudadas não estavam entre elas). São pares de 5 ou mais palavras
  seguidas, na mesma língua:
  - o resumo do CV e o primeiro parágrafo do Sobre: "Comecei a programar no 10.º ano";
  - Licas, CadflowBankSystem e 3D Analyzer: a descrição no CV repete a frase da linha do
    projeto e, no CadflowBankSystem e no 3D Analyzer, o contexto do case study
    ("Desafio técnico proposto por uma empresa", "em cerca de um mês", "motor de
    cálculo em C++ nativo");
  - a experiência na ITGlee: "Loja online de informática com gestão de armazém" é a
    frase da linha do Gest, e "Prova de Aptidão Profissional" está no contexto dele;
  - "Universidade de Leiria e Oeste", no hero e na meta description.

  Seis dos 23 pares são com o campo `description`, que nenhuma página mostra. **Dentro
  do CV, onde a regra continua a valer, há zero.**

  **Depois da fase 12 são 31**, também por decisão: os pontos do Licas contam factos
  que estão no case study dele (os dois fluxos de compra, as regras de acesso na base
  de dados, a verificação que dois pedidos simultâneos contornam), e o ponto do estágio
  repete a frase da linha do Gest. Dentro do CV continua a haver zero, e o Licas
  aparece num só sítio de cada página. O endereço franciscopereira.dev
  aparece quatro vezes no CV — nos links, no resumo, na descrição do Portfolio e na
  linha "Mais seis projetos" —, mas em quatro factos diferentes.

## 8. Decisões tomadas sozinho, ainda por rever

As justificações estão nos relatórios de cada fase.

- **Fase 4:**
  - ponto final roxo a `--accent-text`;
  - linha inteira clicável;
  - número decorativo;
  - nota de arranque a frio como parágrafo;
  - `closeModal` com guarda;
  - contornos de foco;
  - separadores a `--text-secondary`.
- **Fase 4.2a:**
  - campo `resumo`;
  - cartões de contacto passados às escalas (ícone a 2.5rem, medida ótica);
  - provas do Licas com a rota com barra final;
  - `status` do Licas mantido.
- **Fase 4.2b:**
  - seta também nos case studies;
  - foco no menu depois do clique na seta;
  - `prefers-reduced-motion` desliga o deslizamento em todo o site;
  - coluna do Sobre centrada, com o texto à esquerda;
  - competências com o alinhamento de antes.
- **Fase 4.2c:**
  - espaço entre secções +25% (a escala não tem +20%);
  - foto pedida a 400px;
  - colunas fixas nas linhas de projeto (13rem na ação, `--sp-8` no número no
    telemóvel);
  - seta a `--sp-16` e 192px;
  - `#7C3AED` escrito diretamente no CSS.
- **Fase 4.2d:**
  - campo `nota` em vez de `group`, para marcar os projetos com botão "?";
  - ids `projeto-<slug>` e `nota-<slug>`;
  - `scroll-margin-top` nas linhas, para não ficarem debaixo da navbar;
  - balão do "?" dentro da linha, e não a flutuar;
  - "todos" leva a `#projects`;
  - `alumniOf` escrito no `Seo.astro`, e não no canónico.
- **Fase 5:**
  - o `<header>` é a navbar e o `<nav>` é o menu overlay, e não o contrário;
  - o menu fechado usa `visibility: hidden` com transição atrasada, para sair da
    ordem de tabulação sem cortar o fade;
  - `inert` no resto da página com o menu ou uma modal abertos, em vez de uma
    armadilha de foco em JavaScript;
  - `aria-current="true"` no scrollspy, em vez de `"location"`;
  - o link de saltar é escondido com `transform`, e não com `clip`;
  - a transição do botão do menu passou de `all` a `background-color`, porque o
    contorno de foco aparecia animado e ficava a 1,18:1 durante a animação;
  - sublinhado de 1px com afastamento de 0,25em nos links do rodapé e em "Voltar aos
    projetos";
  - "Hotel Inteligente" em PT e "Smart Hotel" em EN são os únicos rótulos de prova
    diferentes entre línguas, como no mapeamento dado;
  - `.gitignore` com `.cache/`, `.eslintcache`, `*.tsbuildinfo`, `test-results/`,
    `playwright-report/` e `Thumbs.db`;
  - a auditoria não ficou como script versionado (mudou na 5.1).
- **Fase 5.1:**
  - a classe `js` no `<html>`, posta pelo script do `<head>`, como marca de que há
    JavaScript;
  - o bloco do tema claro repetido dentro de `prefers-color-scheme`, com o
    `audit:a11y` a comparar os dois;
  - a navegação sem JavaScript em duas cópias (cabeçalho e antes do rodapé), com o
    corte aos 1180px, medido em português;
  - esconder, sem JavaScript, os controlos que não funcionam.
- **Fase 5.2:**
  - contactos numa grelha de três colunas `1fr` com `width: fit-content`, e o espaço
    entre colunas de 48px para 32px;
  - abaixo de 50rem de conteúdo, os cartões empilham numa coluna;
  - margem de ancoragem maior (+30px) enquanto a linha ainda não apareceu;
  - `scroll-margin-top` de 8px nas secções, no telemóvel;
  - o ramo `caseStudy` fica no código, sem uso.
- **Fase 5.3:**
  - no `Icon.astro`, o comentário passou a dizer só "licença MIT", sem apontar para o
    `ICONES.md`, que já não existe;
  - o comentário histórico do rodapé, que menciona o antigo `--footer-bg`, ficou como
    está: explica porque é que o rodapé deixou de ter fundo próprio.
- **Fase 9 (o CV):**
  - o texto do CV no canónico partido nas partes de cada linha, cortando só o " — "
    que as separa; o texto de cada parte fica literal;
  - o texto alternativo da foto e o nome entram na secção `cv`, mesmo sendo iguais a
    textos que já existiam;
  - os títulos das secções, o botão e o título da página no i18n (`cv-*`); o resto do
    texto em `src/data/cv.json`;
  - o link do site no PDF inglês leva a `/en/`; o texto continua "franciscopereira.dev";
  - o email em texto simples, sem `mailto:`, como no protótipo;
  - "Descarregar PDF" é um botão preenchido (`btn-primary`), o segundo do site;
  - a coluna do CV com 48rem no ecrã, para a linha dos três links caber inteira;
  - a fotografia a 128px no ecrã, e com o mesmo ficheiro gerado do hero;
  - as regras de telemóvel do CV só para `screen`: impressa, a folha tem 688px úteis e
    apanhava-as;
  - a linha "Mais seis projetos…" a 8,5pt na impressão (o protótipo; o enunciado não a
    media);
  - o `npm run cv` não escreve nenhum PDF se uma língua falhar, e verifica também o
    fundo branco;
  - o mapa não lista nem conta o `docs/historico/`, e exclui a pasta `Claude outputs/`.
- **Fase 10:**
  - as datas do PDF apagadas (trocadas por espaços, com o mesmo tamanho), e não fixadas
    numa data inventada;
  - um PDF com metadados XMP comprimidos faz o `npm run cv` falhar, em vez de ficar
    com a data (o Chromium não os escreve hoje);
  - o texto antigo em `retirado['fase-10']`, em dois pares: a última frase do resumo e
    a linha "Mais seis projetos".
- **Fase 12:**
  - a linha de baixo de cada entrada da Experiência é "stack — data", como nos
    Projetos (o enunciado dava a data antes da stack);
  - os pontos numa lista com o marcador na cor secundária, para o primeiro que se lê ser
    o verbo;
  - as medidas de impressão dos pontos: 8,9pt (as da linha de item que substituem),
    2pt antes da lista, 1pt entre pontos e 11pt de recuo. Não se apertou nenhuma medida
    que já existia;
  - a classe `.cv-item-linha` deixou de ser usada e ficou no CSS (a fase não deixava
    apagar nada);
  - o texto que saiu em `retirado['fase-12']`, em três registos: o Licas inteiro, o
    rótulo "Programador de aplicações · OutSystems" e a frase antiga do estágio.
- **Fase 13:**
  - "Suportei" em `retirado['fase-13']` com a frase inteira, só em português (o inglês
    não mudou);
  - o PDF de ensaio com JPEG foi feito sem mexer no projeto: o pedido da fotografia foi
    respondido com um JPEG durante a geração, e os ficheiros ficaram só na cache;
  - a verificação ao vivo comparou contra um build limpo do commit publicado, feito numa
    cópia extraída com `git archive` em `node_modules/.cache/`.
