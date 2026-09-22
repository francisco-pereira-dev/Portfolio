# Fase 5 — relatório técnico

Data: 2026-09-17. Estado: **tarefas 1 a 5 concluídas e verificadas**. A Tarefa 6
(commits, push e verificação do deploy) **não foi feita**: espera pelo "podes publicar".
Não houve commit nem push.

As linhas indicadas são as da árvore de trabalho no fim da fase.

---

## Tarefa 1 — rótulos das provas passam a nomes de projeto

**Canónico primeiro.** Em `content/texto-canonico.json`, cada prova de
`competencias.itens[].proofs` ganhou `rotulo: {pt, en}`, com o mapeamento do enunciado:

| Antes (repositório) | Agora PT | Agora EN |
|---|---|---|
| Licas | Licas | Licas |
| DAE | DAE | DAE |
| Ainet2425 | AINET | AINET |
| 3D-Analyzer | 3D Analyzer | 3D Analyzer |
| CadflowBankSystem | CadflowBankSystem | CadflowBankSystem |
| TI | Hotel Inteligente | Smart Hotel |
| PAP | Gest | Gest |
| MR.PIZZA | Mr. Pizza | Mr. Pizza |
| Catalogo-Diane-Arbus | Diane Arbus | Diane Arbus |
| Portfolio | Portfolio (continua no GitHub) | Portfolio |
| todos | todos | all |

- **Os rótulos antigos** ficaram em `retirado['fase-5']` (canónico, linha 1800), com o
  motivo. A fonte ficou em `_sobre.fontes['fase-5']` (linha 19).
- **`src/data/skills.json`** foi regenerado a partir do canónico, com o formato
  compacto de antes (um array `proofs` por linha, CRLF). Formas das provas:
  - `{rotulo, caseStudy}`;
  - `{rotulo, projeto}`;
  - `{allRepos: true}`;
  - `{rotulo, repo: "Portfolio"}`.
- **`src/components/Skills.astro`** (linhas 14, 61, 65 e 74) escreve
  `t(prova.rotulo, lang)`. O "todos" continua a vir de `skills-proof-all`.
- **`scripts/check-texto.mjs`** (linhas 176 a 185) passa a esperar o rótulo da língua
  de cada página.

**Verificação:** o script listou as 33 provas por língua, com rótulo e destino.
Todos os destinos são válidos:

- 30 são internos: a página do case study existe, ou a âncora `#projeto-<slug>` /
  `#projects` existe na página inicial da mesma língua;
- 3 levam ao GitHub do Portfolio, que responde 200.

O mapa completo está no `ESTADO-ATUAL.md`, secção 2. Nas capturas, as provas
aparecem com os nomes novos nas duas línguas ("Hotel Inteligente" em PT, "Smart
Hotel" em EN).

---

## Tarefa 2 — acessibilidade

### Ferramentas

- **`playwright` 1.63.0** e **`@axe-core/playwright` 4.13.0** entraram como
  `devDependencies` (`package.json`). Não há nenhuma dependência de runtime nova.
- **O Chromium do Playwright ocupa 707 MB** em `node_modules/playwright-core/.local-browsers`,
  com `PLAYWRIGHT_BROWSERS_PATH=0`. A estimativa inicial era de cerca de 150 MB, e
  estava errada. Fica fora do git e fora do `dist`.
- Os scripts de auditoria foram temporários, em `node_modules/.cache/` (ver "O que
  falta").

### 2.1 Estrutura

| Problema encontrado (antes) | Onde | Correção |
|---|---|---|
| Sem marco `header` | todas as 16 páginas | `Navbar.astro` linha 20: a raiz passou de `<nav>` a `<header class="navbar">` |
| Menu overlay fora de marcos (axe `region`) | todas | `OverlayMenu.astro` linha 24: a raiz passou a `<nav id="overlay-menu">` |
| SVG do email no menu sem `aria-hidden` | todas | `OverlayMenu.astro` linhas 58 a 60: `aria-hidden="true" focusable="false"` |
| Círculos dos ícones de contacto expostos | 2 páginas iniciais | `Contacts.astro` linhas 25, 51 e 64: `aria-hidden="true"` |
| Emojis do tema lidos em voz | todas | `Navbar.astro` linhas 44 e 45: `aria-hidden="true"` |

- **Já estava certo:**
  - um `h1` por página;
  - sem saltos de nível;
  - `main` e `footer`;
  - `lang="pt-PT"` / `lang="en"` nas 16 páginas;
  - os ícones de `Icon.astro` já eram `aria-hidden`.

### 2.2 Link de saltar

- **`BaseLayout.astro`** linha 86: `<a class="skip-link" href="#conteudo">` é o
  primeiro elemento do `body`. O texto é `a11y-skip-to-content`, que está no canónico.
- **`PortfolioPage.astro`** linha 41 e **`CaseStudyPage.astro`** linha 79:
  `<main id="conteudo" tabindex="-1">`.
- **`global.css`** linhas 222 a 247:
  - `main:focus { outline: none }`, porque o `main` só recebe foco pelo salto;
  - `.skip-link` fixo, fora do ecrã com `translateY(-200%)`, e visível com `:focus`;
  - usa só tokens existentes (`--surface-color`, `--text-primary`, `--text-secondary`,
    `--sp-3`, `--fs-small`).

### 2.3 Teclado

- **Menu** (`main.js` linhas 28 a 51):
  - `definirMenu()` atualiza `aria-expanded` e põe `inert` em todos os filhos do
    `body`, exceto o menu, o header com o botão e os scripts;
  - ao abrir, o foco vai para o primeiro link;
  - Escape fecha e devolve o foco ao botão (linha 138).
- **Menu fechado fora da ordem de Tab** (`global.css` linhas 460 a 471):
  `visibility: hidden`, com a transição da visibilidade atrasada 0,4s para o fade
  continuar a ver-se.
- **Modais** (`main.js` linhas 94 a 116): `inert` no resto da página enquanto estão
  abertas; ao fechar, tira-se o `inert` antes de devolver o foco.
- **Botão do menu** (`global.css` linha 313): a transição passou de `var(--transition)`
  (`all`) a `background-color 0.3s ease`. **Era um defeito real:** o `outline` do foco
  também animava, e durante a animação ficava a 1,18:1 no tema escuro.
- O "?", a seta, o tema, o idioma e os links já funcionavam por teclado: foram só
  testados.

### 2.4 Nomes, idioma e estado

- **O "×" das modais** (`ProjectModal.astro` linhas 25 e 26) tem
  `aria-label={ui['a11y-close']}`, "Fechar" / "Close", como respondeste. O "×" ficou
  dentro de um `span aria-hidden`.
- **Scrollspy** (`main.js` linhas 181 a 187): o link da secção atual leva
  `aria-current="true"`.
- **Botão do menu** (`Navbar.astro` linhas 25 a 27): `aria-expanded` e
  `aria-controls="overlay-menu"`.
- **Chaves novas:** `pt.json` e `en.json` passaram de 53 a 55 chaves
  (`a11y-skip-to-content` e `a11y-close`), primeiro no canónico
  (`interface.acessibilidade`).

### 2.5 Segundo sinal nos links

- **`global.css`** linhas 1128 a 1141: os links do rodapé têm a mesma cor do texto à
  volta e só mudavam no hover. Ficaram sublinhados (1px, afastamento 0,25em).
- **`case-study.css`** linhas 15 a 31: "Voltar aos projetos" só era sublinhado no
  hover. Ficou sublinhado sempre, e o hover muda a cor.
- **Classificação automática** de todos os links do `main` e do `footer`:

| Links | Sinal | Decisão |
|---|---|---|
| Provas, ações do hero, links dos case studies | já eram sublinhados | — |
| Rodapé, "Voltar aos projetos" | só cor, ou nada | **sublinhados** |
| "Ver projetos" | botão preenchido | não se sublinha (botão) |
| "Ver mais →", "Ver Repositório →" nas linhas | mesma cor do texto, com seta, numa coluna própria | não dependem da cor; sem mudança |
| Cartões de contacto | o script marcou-os como "só cor" | **falso positivo**: não estão dentro de texto corrido. São blocos isolados com ícone num círculo, título e endereço, e o critério 1.4.1 é sobre links no meio de texto. Não mudei, porque sublinhar os cartões mexia no design sem ganho |

### 2.6 Auditoria automática

- **Âmbito:** 16 páginas (8 por língua) × 2 temas, com axe (wcag2a, wcag2aa, wcag21a,
  wcag21aa, wcag22aa e best-practice). A estrutura e a consola foram vistas por
  script à parte.
- **Estados abertos**, com a mesma auditoria: menu, balão "?", modal, e o fim da
  página com a seta visível.

**Antes das correções:**

| Violação | Impacto | Elemento | Onde | Resolução |
|---|---|---|---|---|
| `region` | moderate | `#overlay-menu` | 32 combinações página×tema | real: menu passou a `<nav>` |
| `region` | moderate | `.overlay-footer` | 32 combinações página×tema | real: está dentro do `<nav>` |
| (estrutura) sem `header` | — | `nav.navbar` | 32 | real: `<header>` |
| (estrutura) sem link de saltar | — | — | 32 | real: link criado |
| (estrutura) SVG exposto | — | `.overlay-social-icon` (32), `.contact-icon-circle` (4, páginas iniciais) | | real: `aria-hidden` |

**Depois:** zero violações axe em 32 combinações, zero problemas de estrutura e zero
erros de consola. Nos estados abertos também deu zero, em 4 estados × 2 línguas × 2 temas.

**Incompletos do axe e falsos positivos:**

- **92 `color-contrast` incompletos.** O axe não decide quando há sobreposição,
  transparência ou `opacity`. Medi à parte todo o texto visível das 16 páginas × 2
  temas, compondo os fundos semitransparentes, com o menu, o balão e a modal abertos:
  - **zero textos abaixo de 4,5:1** (3:1 para texto grande);
  - mínimo de 5,02:1 no claro (case studies) e 5,70:1 no escuro;
  - ficou nada por medir.
- **Na verificação final, a auditoria de teclado deu 3 e depois 4 violações
  `color-contrast`** no estado "balão aberto". **Eram do teste, não do site:**
  - na primeira corrida, o axe mediu os links do menu no meio do fade de fecho (0,4s);
  - na segunda, mediu a linha do Hotel no meio do fade de entrada `.reveal` (0,8s),
    que começa quando o foco faz scroll até ao Mr. Pizza.

  Juntei esperas de 600ms e 1200ms ao teste, e deu zero. A medição de contraste acima,
  com tudo já visível, confirma-o.

### 2.7 Capturas — o que vi

As capturas foram tiradas com o Playwright a 1280×800 (`node_modules/.cache/capturas/`),
nas duas línguas e nos dois temas. Olhei para elas.

- **Página inicial** (`inicio-*`):
  - a foto redonda, o nome com o ponto roxo e as duas linhas de texto, tudo centrado;
  - "Ver projetos" em roxo preenchido, e "Descarregar CV" e "Falar comigo" sublinhados;
  - no claro, a navbar é branca sobre o fundo cinza muito claro;
  - EN igual, com "View projects", "Download CV" e "Get in touch".
- **Foco em "Ver projetos"** (`foco-botao-*`): o anel roxo claro (escuro) ou roxo
  (claro) aparece à volta do botão, **separado do preenchimento por uma faixa do fundo
  da página**.
  - Vê-se bem nos dois temas.
  - O script dava 2,09 e 1,0 "contra o preenchimento", mas o anel não toca no
    preenchimento: contra o fundo que o rodeia, está a 6,25 e 5,13.
- **Link de saltar** (`skip-*`):
  - no primeiro Tab, aparece no canto superior esquerdo uma caixa com contorno fino,
    "Saltar para o conteúdo" sublinhado e o anel de foco à volta;
  - tapa o botão do menu enquanto tem foco, o que é esperado;
  - a primeira captura saiu com a página vazia por baixo, porque foi tirada logo
    depois do `load`, antes do fade `.reveal`;
  - repeti com 1,2s de espera (`r-skip-*`), e o hero aparece normal por baixo.
- **Menu aberto** (`menu-*`):
  - o "×" num círculo roxo; Sobre, Competências, Projetos e Contactos grandes e
    centrados;
  - "Sobre" tem o contorno de foco retangular à volta;
  - os três ícones sociais em baixo;
  - o conteúdo da página fica muito esbatido por trás, o que já era o design;
  - EN claro: About, Skills, Projects, Contacts.
- **Case study** (`case-*`, `case-foco-*`):
  - "← Voltar aos projetos" a roxo e sublinhado, com o anel de foco à volta quando
    focado;
  - a etiqueta, o título grande, a frase de abertura, as tecnologias, "Ver Projeto" e
    "Ver Repositório" sublinhados, e a nota pequena.
- **Modal** (`modal-pt-light`): caixa branca com "Mr. Pizza - Plataforma E-commerce",
  três pontos e dois botões. O "×" tem o anel de foco circular, e a página por trás
  fica escurecida.
- **Seta** (`seta-foco-en-dark`): no fim da página, a seta tem um anel roxo nítido. O
  rodapé mostra "GitHub · LinkedIn · Source code" sublinhados.
- **Balão "?"** (`r-info-*`):
  - o balão abre por baixo da etiqueta com o texto "Two translation exercises…";
  - o "?" tem o anel de foco;
  - **reparo:** o anel encosta às letras "E-" do título que está por cima. Vê-se bem,
    mas não é bonito. Não mudei, e fica registado como pendente;
  - a primeira captura (`info-*`) apanhou o menu ainda a fechar; repeti.
- **Competências** (`r-skills-*`): as provas sublinhadas finas, na mesma linha da
  tecnologia, com os nomes novos. O sublinhado não prejudica a leitura: é fino, fica
  afastado da letra, e os rótulos são curtos.

---

## Tarefa 3 — limpeza

- **3.1 `README.md`** reescrito em português:
  - o que é e onde está;
  - a stack, com as 2 dependências de runtime;
  - o conteúdo: duas línguas em rotas reais, 9 projetos, 7 case studies, 16 páginas;
  - a organização: o canónico, o schema e as três integrações;
  - como correr, as verificações e a acessibilidade;
  - saiu a secção "Known gaps", que estava errada: o `prefers-reduced-motion` já
    existe.
- **3.2 `docs/`** estava vazia e fora do git, e foi apagada (`rmdir`, que só apaga
  pastas vazias).
- **3.3 Scripts temporários:** não havia nenhum `f42a-`, `f42b-`, `f42c-`, `f42d-`,
  `verif`, `sab` nem `aplicar-` no repositório. Procurei em toda a árvore, fora de
  `node_modules` e `.git`. Os scripts npm ficaram.
- **3.4 `.gitignore`:** já cobria `node_modules/`, `dist/`, `.astro/`, `.env*`,
  `.DS_Store` e `*.log`. Acrescentei:
  - `.cache/`, `.eslintcache`, `*.tsbuildinfo`;
  - `test-results/` e `playwright-report/` (Playwright);
  - `Thumbs.db` (Windows).
- **3.5 Ficheiros sem uso**, listados e **não apagados**:

| Ficheiro / regra | Para que servia | Estado |
|---|---|---|
| `src/icons/csharp-plain.svg`, `css3-plain`, `docker-plain`, `html5-plain`, `java-plain`, `javascript-plain`, `linux-plain`, `mysql-plain`, `nodejs-plain`, `php-plain`, `python-plain`, `tailwindcss-original`, `typescript-plain` (13) | Ícones das competências, retirados na Fase 4 quando as competências passaram a lista de texto com provas | Sem uso. Não chegam ao `dist`, porque são inline e só entram se forem pedidos, mas o `import.meta.glob` lê-os no build |
| `.btn-outline` (`global.css` linha 638) | Botão com contorno do "Descarregar CV" no hero, até à Fase 4 | Sem uso |
| `--footer-bg` (`global.css` linhas 114 e 174) | Fundo próprio do rodapé, antes do fundo único (4.2c) | Sem uso; já estava registado |
| `.modal-note`, `.btn-modal-disabled` (`global.css` linhas 1244 e 1278) | Nota de arranque a frio e botão "em desenvolvimento" na modal | **Adormecidas**: o `ProjectModal.astro` gera-as se um projeto com modal tiver `coldStart` ou estiver `in-development`. Hoje nenhum dos 2 tem |
| Comentário de `Icon.astro` linha 8 | Aponta para `ICONES.md` (licença MIT dos SVG do Devicon) | O ficheiro foi apagado a 2026-09-14 (`21d0811`), e o comentário ficou órfão |

- **Não há componentes, layouts, dados nem imagens sem uso.** Os 7 ficheiros de
  `assets/images/` servem as imagens de partilha e a foto. `mrpizza.webp` e
  `dianearbus.webp` são validados pelo schema, mas não chegam ao `dist`: o
  `podar-assets-nao-referenciados` retira-os.
- **As 4 chaves `skills-group-*`** pareciam sem uso a uma procura literal, mas são lidas
  por chave dinâmica em `Skills.astro` linha 46. Falso positivo.

---

## Tarefa 4 — documentação

- **`CLAUDE.md`:**
  - stack com o Playwright e o axe;
  - rótulos das provas;
  - subsecção "Acessibilidade (Fase 5)" nas decisões;
  - limite do ambiente atualizado: vê-se o site com o Playwright do projeto;
  - estado atual, com "Por fazer".
- **`ESTADO-ATUAL.md`:**
  - secção 2: o mapa das provas com os nomes novos e a forma dos dados;
  - secção 3: os números atuais e a auditoria;
  - secção 4: o diff acumulado;
  - **secção 6 nova:** a acessibilidade feita e a pendente;
  - **secção 7 nova, "Por fazer":** o CV como rota `/cv`, o `CV.pdf` com "Instituto
    Politécnico de Leiria", a publicação, o histórico, os ficheiros sem uso;
  - secção 8: as decisões da Fase 5.

---

## Tarefa 5 — verificação completa

| # | Verificação | Resultado |
|---:|---|---|
| 1 | Build sem avisos | ✅ exit 0, 0 linhas com "warn" ou "error", 16 páginas |
| 2 | `check:i18n` | ✅ 55 chaves de cada lado |
| 3 | `check:texto` | ✅ 914 verificações (457 + 457), zero divergências |
| 4 | Rótulos e destinos das provas | ✅ 33 por língua, todos válidos |
| 5 | Auditoria axe (16 págs × 2 línguas × 2 temas) | ✅ zero violações; também nos 4 estados abertos |
| 6 | Teclado na inicial e num case study | ✅ 53 verificações, zero falhas (depois de corrigir as esperas do teste, ver 2.6) |
| 7 | Link de saltar | ✅ o 1.º Tab mostra-o dentro do ecrã; Enter põe o foco no `main#conteudo` |
| 8 | Um `h1`, sem saltos | ✅ nas 16 páginas |
| 9 | Segundo sinal | ✅ ver 2.5 |
| 10 | Contraste | ✅ texto ≥ 5,02:1; contorno de foco ≥ 5,13:1, nos dois temas |
| 11 | Links partidos | ✅ 58 destinos internos (ficheiro e âncora) e 16 externos com User-Agent de browser. O LinkedIn dá 999 (aceite). Os 3 demos no Render deram 503 na primeira passagem, porque estavam a dormir; na segunda, 200 |
| 12 | Scroll horizontal | ✅ nenhum, em 16 páginas × 1440/900/375 × 2 temas |
| 13 | Consola | ✅ zero erros e zero avisos, nas mesmas 96 cargas |
| 14 | Nenhum ficheiro > 500 KB | ✅ o maior é o `CV.pdf`, com 389 345 bytes. **Peso total: 1 447 443 bytes, contra 1 437 271 antes da fase (+10 172, +0,7%)**, com os mesmos 41 ficheiros |
| 15 | Sitemap com 16 páginas | ✅ 16 `<loc>` |
| 16 | `dist/CNAME` | ✅ `franciscopereira.dev` |
| 17 | `dist/assets/docs/CV.pdf` | ✅ existe, é igual ao de `public/` e não tem alterações no git |
| 18 | Imagens de partilha a 1200×630 | ✅ `og-image.png` e as 8 de `og/`, todas a 1200×630 e referidas pelas páginas certas |
| 19 | Ferramentas de auditoria fora do `dist` | ✅ nenhum ficheiro menciona axe ou playwright |
| 20 | Repositório sem scripts temporários | ✅ `git status` mostra só o que as fases mudaram; os scripts estão em `node_modules/.cache/`, ignorado |

---

## Decisões tomadas sozinho

1. **Marcos:** `<header>` na navbar e `<nav>` no menu overlay. A navbar não tem links de
   secção, e o menu tem.
2. **`inert`** no resto da página com o menu ou uma modal abertos, em vez de uma
   armadilha de foco em JavaScript. É nativo e também esconde o fundo dos leitores de
   ecrã.
3. **`visibility: hidden` atrasada** no menu fechado, para o fade continuar.
4. **`aria-current="true"`** no scrollspy.
5. **Transição do botão do menu** reduzida a `background-color`.
6. **Sublinhado de 1px com afastamento de 0,25em** no rodapé e em "Voltar aos
   projetos", igual ao das provas.
7. **Cartões de contacto e ações das linhas sem sublinhado** (ver 2.5).
8. **Entradas novas no `.gitignore`**, além das pedidas.
9. **A auditoria não ficou versionada.** O enunciado permitia as ferramentas como
   dependência de desenvolvimento, mas não pedia um script novo. Por isso ficaram
   `playwright` e `@axe-core/playwright` no `package.json` sem nenhum script npm que
   os use. Se preferires, removem-se, ou versiona-se a auditoria.
10. **Mais esperas nos testes** (menu 600ms, `.reveal` 1200ms), em vez de desligar o
    fade.
11. **Os scripts temporários ficam em `node_modules/.cache/`** até à verificação do
    deploy (Tarefa 6), que os volta a usar contra o site publicado. Apagam-se no fim.
    O servidor de pré-visualização da porta 4322 foi parado.

## Colisões

Não houve colisões novas. As duas da fase ("Fechar" no "×" e as ferramentas de
captura) foram perguntadas e respondidas antes de avançar.

## O que falta

- **Tarefa 6:** commits por fase, push, a Action e a verificação do deploy. Espera
  pelo "podes publicar".
- **Acessibilidade pendente**, sem alterações, porque é texto ou comportamento não
  pedido:
  - **o `aria-label` do seletor de idioma** é "Alterar idioma / Switch language" nas
    duas línguas:
    - não contém o visível "PT | EN" (WCAG 2.5.3);
    - em EN, metade é lida com a voz errada;
  - **o `alt` da foto**, "Francisco Pereira Avatar": "Avatar" não acrescenta nada;
  - **sem JavaScript, o conteúdo `.reveal` fica invisível;**
  - **o anel de foco do "?"** encosta ao título de cima;
  - **não houve testes com leitores de ecrã reais** nem com teclado no telemóvel.
- **"Por fazer"**, no `ESTADO-ATUAL.md`:
  - o CV como rota `/cv`;
  - o `CV.pdf` ainda diz "Instituto Politécnico de Leiria";
  - os ficheiros sem uso;
  - o comentário órfão do `Icon.astro`;
  - o histórico com commits duplicados.

