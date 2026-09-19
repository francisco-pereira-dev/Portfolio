# CLAUDE.md — portefólio de Francisco Pereira

Lido automaticamente no início de cada sessão. Se é a primeira vez que vês este
projeto, lê isto até ao fim antes de mexer em qualquer coisa. O detalhe do
estado atual está em [docs/ESTADO-ATUAL.md](docs/ESTADO-ATUAL.md).

## PROJETO

- **O que é:** o portefólio pessoal do Francisco Pereira, finalista de Engenharia
  Informática na Universidade de Leiria e Oeste (o antigo Instituto Politécnico de
  Leiria).
- **Onde está publicado:** https://franciscopereira.dev
- **Objetivo:** mostrar trabalho real, com **texto cuidado e verificável**. Cada
  afirmação do site tem prova: as competências ligam ao projeto que as demonstra, e os
  case studies contam o que correu bem e o que correu mal. É por isso que existe o texto
  canónico, e é por isso que o site **não usa linguagem de procura de emprego** (ver
  "Decisões"): a regra de conteúdo mantém-se.
- **Conteúdo:**
  - página inicial nas duas línguas: hero, Sobre, Competências com links de prova,
    Projetos e Contactos;
  - **7 páginas de case study** por língua;
  - **o CV como página** (fase 9), em `/cv/` e `/en/cv/`, com o PDF de cada língua gerado
    a partir dela;
  - **18 páginas** no total.

**Stack real** (versões instaladas):

- **Astro 7.2.10**, saída estática, com TypeScript e CSS simples, sem framework de UI.
- **@astrojs/sitemap 3.7.4.**
- **opentype.js 2.0.0** e **sharp 0.35.4**, os dois como `devDependencies`. Só servem o
  `npm run og`, o gerador das imagens de partilha, e nunca chegam ao `dist`. O `sharp`
  chega na prática com o Astro, mas está declarado à mesma: sem isso, o dia em que o
  Astro deixasse de o trazer partia o `npm run og` sem aviso.
- **playwright 1.63.0** e **@axe-core/playwright 4.13.0** (dev), para auditar a
  acessibilidade, tirar capturas e gerar os PDF do CV (`npm run cv`). Nunca chegam ao `dist`. O Chromium (cerca de
  707 MB) instala-se dentro de `node_modules` com `PLAYWRIGHT_BROWSERS_PATH=0`.
- **Node 24**, que é o do build local e da Action. O Astro 7 exige pelo menos 22.12.
- **i18n em rotas reais** (`astro.config.mjs`, `prefixDefaultLocale: false`):
  - PT na raiz: `/`, `/projetos/<slug>/` e `/cv/`;
  - EN em `/en/`: `/en/`, `/en/projects/<slug>/` e `/en/cv/`.
- **GitHub Pages por Actions** (`.github/workflows/deploy.yml`): cada push para a
  `main` corre três jobs em cadeia — `verificar` → `build` → `deploy`. O `verificar`
  faz o seu próprio `npm ci`, `npm run build`, `check:i18n` e `check:texto`; se algum
  falhar, o `build` (que depende dele) nunca arranca e **nada chega ao ar**. Só depois é
  que o `withastro/action@v3` constrói e o `actions/deploy-pages@v4` publica. As
  auditorias de acessibilidade **não** correm no CI: os 707 MB do Chromium tornavam cada
  publicação lenta e frágil, e por isso correm à mão.
- **Domínio próprio** pelo ficheiro `public/CNAME` (`franciscopereira.dev`),
  copiado para o `dist/` em cada build.

## ESTRUTURA

```
content/texto-canonico.json   ← FONTE DE VERDADE de todo o texto visível (ver abaixo)
src/
  content.config.ts           schema Zod da collection "projects" (inclui o caseStudy)
  content/projects/*.json     os 9 projetos: título, etiqueta (tagline), resumo, descrição,
                              features, tech, links, estado, imagem, nota, e o caseStudy
  i18n/pt.json, en.json       textos de interface (botões, títulos, aria-labels…)
  i18n/index.ts               tipos, t(), localeHref, otherLang
  data/skills.json            os 4 grupos de competências e as provas de cada tecnologia
  data/site.json              nome, email, URLs do GitHub e LinkedIn, caminhos dos dois PDF
                              do CV (cvPath e cvPathEn)
  data/cv.json                o texto do CV nas duas línguas (gerado da secção cv do canónico)
  pages/                      index.astro, en/index.astro, cv.astro, en/cv.astro,
                              projetos/[slug].astro, en/projects/[slug].astro
  layouts/BaseLayout.astro    <head>, script inline do tema, SEO, seta de voltar ao topo
  layouts/PortfolioPage.astro página inicial (as duas línguas) e as 2 modais
  layouts/CaseStudyPage.astro página de case study
  layouts/CvPage.astro        a página do CV (as duas línguas)
  components/                 Hero, About, Skills, Projects, ProjectRow, ProjectModal,
                              Contacts, SectionHeading, Navbar, OverlayMenu, NavSemJs,
                              Footer, Seo, Icon
  lib/caseStudy.ts            rotas dos case studies e caminho das imagens de partilha
  lib/seo.ts                  tipo das props de SEO por página
  lib/cv.ts                   rotas do CV e caminho do PDF de cada língua
  scripts/main.js             comportamento: menu, tema, modais, reveal, scrollspy,
                              seletor de idioma, voltar ao topo, botões "?"
  styles/global.css           tokens (cores, escalas) e estilos do site
  styles/case-study.css       estilos só das páginas de case study
  styles/cv.css               estilos só do CV, com o bloco de impressão (o PDF)
  icons/*.svg                 ícones inline (Icon.astro): só github-original e
                              linkedin-plain; os outros 13 saíram na fase 5.3
assets/images/                screenshots dos projetos e avatar (otimizados pelo Astro)
public/                       CNAME, fontes WOFF2, assets/docs/CV.pdf e CV-en.pdf (gerados
                              pelo npm run cv), favicon, robots.txt, og-image.png e
                              og/<slug>-<pt|en>.jpg
scripts/                      check-i18n.mjs, check-texto.mjs, gerar-og.mjs, gerar-cv.mjs
                              (npm run cv) e gerar-estrutura.mjs (npm run mapa)
scripts/auditoria/            acessibilidade.mjs, teclado.mjs e comum.mjs (npm run audit:*;
                              o comum.mjs serve também o gerar-cv.mjs)
scripts/fontes/               TTF da Poppins, só para o gerar-og (nunca para o site)
astro.config.mjs              i18n, sitemap e três integrações próprias (guardas do build)
docs/ESTADO-ATUAL.md          retrato detalhado do estado do projeto
docs/ESTRUTURA.md             mapa de todos os ficheiros: o que é, quem o usa, o que parte sem
                              ele. Refeito pelo npm run mapa (ver "Comandos")
docs/LICENCAS.md              atribuição dos ícones do Devicon (MIT)
docs/historico/               os relatórios de cada fase e o inventário de 2026-09-18 (fora
                              do mapa)
```

- **Os projetos** estão em `src/content/projects/`, validados por `src/content.config.ts`.
- **Os textos de interface** estão em `src/i18n/`.
- **As competências** estão em `src/data/skills.json`.
- **O texto canónico** está em `content/texto-canonico.json`.
- `dist/`, `.astro/` e `node_modules/` são gerados e não se versionam.

## A REGRA MAIS IMPORTANTE: O TEXTO CANÓNICO

**`content/texto-canonico.json` é a fonte de verdade de todo o texto visível do site**:

- os textos de interface;
- as competências e as provas;
- os projetos, com os case studies;
- o SEO e os `aria-label`.

**O texto não se escreve diretamente** nos componentes, na collection nem no i18n.
Uma mudança de texto entra primeiro no canónico, copiada literalmente do enunciado
em que o Francisco a aprovou, com a fonte registada em `_sobre.fontes`. Depois
passa para os ficheiros de dados (`src/i18n/*.json`, `src/content/projects/*.json`,
`src/data/skills.json`, `src/data/cv.json`). O texto substituído não se apaga: vai para
`retirado.<fase>`, com o motivo.

Não existe um script de geração versionado. A passagem do canónico para os dados
foi feita em cada fase com um script temporário, que confirmava que o resultado
era idêntico ao canónico e depois era apagado. Quem garante que as duas pontas
batem é o `check:texto`.

**`npm run check:texto`**:

- compara o canónico com o HTML gerado em `dist/`, string a string, nas duas línguas;
- a comparação é posicional: cada texto tem de estar no seu sítio, seja um projeto
  na sua linha, um cabeçalho de secção, uma secção de case study ou uma secção do CV
  pela ordem certa;
- lista **todas** as divergências e **falha** (sai com código 1) se houver pelo menos uma;
- mostra à parte o texto de i18n que não está no canónico, sem falhar por isso.

**Porque é que isto existe:** cada frase do site foi escrita e aprovada com cuidado
pelo Francisco. Não pode ser "melhorada", resumida, traduzida de outra maneira nem
corrigida por engano. Se achares que um texto tem um erro, **diz-lho**. Não o
corrijas.

**A única exceção é o JSON-LD.** O `alumniOf` ("Universidade de Leiria e Oeste") está
escrito diretamente em `Seo.astro`, porque não é texto visível.

**No CV, o email e os três links não são texto do canónico:** são dados. O email e os
endereços do GitHub e do LinkedIn vêm do `site.json`, o do site vem do `site` do
`astro.config.mjs`, e o texto visível de cada link é o próprio endereço, sem o
protocolo nem a barra final.

### Regra de não repetição

**Nenhum facto aparece em dois sítios do site.** Cada sítio tem o seu dono:

| Sítio | Dono de |
|---|---|
| Hero | quem é o Francisco |
| Sobre | o percurso; não descreve projetos |
| Competências | tecnologias, com prova |
| Linha de projeto | o que o projeto é, numa frase (`resumo`), e a etiqueta |
| Case study | tudo o resto |

A distinção que ficou assente:

- **Resumo e detalhe não são repetição.** A frase da linha diz o que o projeto é, e o
  case study conta-o por extenso.
- **O mesmo facto escrito duas vezes, de maneiras diferentes, é repetição.** Exemplos
  que já foram corrigidos:
  - a descrição da modal começava com a frase da linha;
  - "desafio técnico proposto por uma empresa" aparecia quatro vezes;
  - o tamanho da equipa estava na etiqueta e no contexto.

No fim de cada tarefa de texto procuram-se repetições entre secções e reportam-se.
Não se corrigem sem o Francisco decidir.

**Exceção: o CV (`/cv` e `/en/cv`) está fora desta regra** (decisão do Francisco, fase
10).

- **Porquê:** um CV lê-se sozinho, fora do contexto do site. Quem o abre não leu as
  linhas dos projetos nem os case studies, e obrigá-lo a não repetir o site tornava-o
  pior.
- **As repetições entre o CV e o resto do site são esperadas e não se corrigem.** Na
  fase 9 contaram-se 23 (por exemplo, "Desafio técnico proposto por uma empresa" está na
  linha do CadflowBankSystem e no CV), e ficaram por decisão, não por esquecimento. A
  lista está no `docs/ESTADO-ATUAL.md`.
- **A regra continua a valer, inteira, dentro do CV:** um facto não aparece duas vezes
  na mesma página do CV. É isso que se procura no fim de uma tarefa de texto no CV.

Outras secções do canónico:

- `caseStudies.com` e `caseStudies.sem`: quem tem página;
- `caseStudies._fase4…`: o que deixou de aparecer em cada fase;
- `cv` e `interface.cv` (fase 9): o texto do CV. Cada linha do enunciado está
  partida nas suas partes, sem o " — " que as separa; a página e o PDF voltam a pô-lo;
- `retirado`: texto aprovado que já não aparece, com o motivo. O texto antigo fica
  como era, incluindo o nome antigo da instituição.

## COMANDOS

| Comando | O que faz |
|---|---|
| `npm run dev` (ou `npm start`) | Servidor de desenvolvimento em http://localhost:4321. O Astro 7 destaca-o do terminal; pára-se com `npx astro dev stop`. Pode parar sozinho entre sessões; confirma com `curl localhost:4321` antes de testar |
| `npm run build` | Build estático para `dist/`. Falha se: o schema Zod não validar um projeto; faltar um screenshot referido nos dados; uma TTF/OTF/EOT chegar ao `dist`; faltar a imagem de partilha de um case study com screenshot |
| `npm run preview` | Serve o `dist/` localmente |
| `npm run check:i18n` | Paridade de chaves entre `pt.json` e `en.json`, valores vazios ou `TODO:`, e texto de projeto infiltrado no i18n |
| `npm run check:texto` | Canónico contra o `dist/` (ver acima). Corre depois do build |
| `npm run og` | Regenera `public/og-image.png` e `public/og/<slug>-<pt\|en>.jpg`. Corre quando mudar o título de um projeto, o screenshot ou quem tem case study |
| `npm run cv` | Gera `public/assets/docs/CV.pdf` e `CV-en.pdf` a partir das páginas `/cv/` e `/en/cv/`, no tema escuro de propósito (a impressão tem de sair branca). Corre depois do build e quando mudar o texto do CV. **Três guardas**, e sai com código 1 sem escrever nenhum PDF se uma falhar: **1 página** exatamente (diz quantas tem e quantos mm faltam); **texto extraível** (não é imagem); **o texto do canónico**, na língua certa e pela ordem, listando todas as divergências. Os PDF são reproduzíveis: o mesmo texto dá os mesmos bytes (as datas da geração são apagadas), e o comando escreve o SHA-256 de cada um. Os PDF novos só chegam ao `dist/` no build seguinte |
| `npm run mapa` | Refaz o `docs/ESTRUTURA.md` a partir do disco (lista, tamanhos, totais, resumos). Ver "Regras de trabalho". `npm run mapa -- --verificar` só confirma que está em dia |
| `npm run audit:a11y` | Auditoria de acessibilidade das 18 páginas: axe, estrutura, contraste, o site sem JavaScript, e a grelha e a impressão do CV. Corre depois do build; arranca o `astro preview` sozinho se for preciso |
| `npm run audit:teclado` | Navegação por teclado nas 18 páginas, nos dois temas: contorno de foco, ordem, menu, modais, "?", seta, idioma, link de saltar, "Ver CV" e "Descarregar PDF" |
| `npm run astro` | A CLI do Astro |

**Antes de dar qualquer trabalho por terminado, têm de passar os três, por esta
ordem:** `npm run build`, `npm run check:i18n` e `npm run check:texto`.

## DECISÕES JÁ TOMADAS — não reabrir sem o Francisco pedir

### Estrutura e conteúdo

- **Astro com i18n em rotas reais**, e não troca de idioma em JavaScript: cada língua é HTML estático indexável, com hreflang.
- **Texto canónico como fonte única**: o texto aprovado não deriva nem se reescreve.
- **9 projetos, por esta ordem exata e numa só lista:** licas, dae, ainet, 3d-analyzer, cadflow-bank-system, hotel-inteligente, gest, mr-pizza, diane-arbus. O canónico fixa a ordem em `projetos.ordem`. **Não há grupos nem sub-secções:** a sub-secção "Design → Código" acabou, e o campo `group` saiu do schema.
- **7 com página de case study** (licas, dae, ainet, 3d-analyzer, cadflow-bank-system, hotel-inteligente, gest) **e 2 sem** (mr-pizza, diane-arbus): decisão registada em `caseStudies`.
- **Os 2 sem case study têm modal e os 7 com case study não têm**: um só caminho por projeto. A modal mostra título, features e links, **sem descrição**, porque a frase da linha já é a descrição.
- **Cada linha de projeto** mostra:
  - o número;
  - o título e, **por baixo, numa linha própria**, a etiqueta;
  - a frase (`resumo`), a stack e a ação.

  Tem o id `projeto-<slug>`, igual nas duas línguas. A `description` longa continua nos dados, mas não aparece no site.
- **Etiquetas:**
  - DAE e AINET: "Projeto universitário · Equipa de 4";
  - Hotel: "Projeto universitário · Equipa de 2";
  - Gest: "Secundário · 2021";
  - Licas: "Cliente real";
  - 3D Analyzer: "Projeto pessoal · C++ e WebGL";
  - Cadflow: "C++ · Desktop";
  - Mr. Pizza e Diane Arbus: "Design → Código".

  O tamanho da equipa vive só na etiqueta.
- **Botão "?" de informação (campo `nota`):** o Mr. Pizza e o Diane Arbus têm, ao lado da etiqueta, um botão que abre o texto `projects-design-text` por baixo. Tem `aria-label` "Mais informação" / "More information", funciona pelo teclado e fecha com Escape ou com clique fora.
- **Os case studies têm estrutura fixa:** a frase de abertura (`umaFrase`) e as secções contexto, problema, minhaParte, decisoes, correuMal, resultado e fariaDiferente, sempre por esta ordem. O schema é `.strict()`.
- **"A minha parte" (`minhaParte`) só existe em projetos de equipa:** dae, ainet e hotel-inteligente.
- **As páginas de case study são só texto, sem imagens.** Os screenshots servem apenas as imagens de partilha (`og:image`).
- **O Sobre tem dois parágrafos**, com o percurso.
- **Os contactos não têm texto de introdução:** o título, a régua e os três cartões.
- **Não há linguagem de procura de emprego:** nada de disponibilidade, "emprego", "available", "hiring" ou "full-time role", nem no texto, nem nas meta descrições, nem no JSON-LD. A exceção é texto técnico legítimo, como "a disponibilidade que o cliente vê", no Gest.
- **Instituição:** "Universidade de Leiria e Oeste", em PT e em EN, sem tradução.
- **Rótulos atuais:**
  - "Ver mais" / "Read more" leva ao case study;
  - "Ver Repositório" / "View Repository";
  - "Ver Projeto" / "View Project";
  - o do Licas diz "Ainda não publicado" / "Not yet published", e é um `span`, nunca um `<a>`;
  - "Ver CV" / "View CV", no hero, leva à página do CV na mesma língua (fase 9).
- **Provas das competências, internas.** Desde a Fase 5, os rótulos são os **nomes dos
  projetos** (Licas, DAE, AINET, 3D Analyzer, CadflowBankSystem, Hotel Inteligente /
  Smart Hotel, Gest, Mr. Pizza, Diane Arbus, Portfolio, todos / all), guardados em
  `rotulo: {pt, en}`.
  - **Desde a Fase 5.2, todas levam à linha do projeto** na secção Projetos da página
    inicial, na mesma língua (`/#projeto-<slug>`), com ou sem case study. Nos dados, o
    campo é `projeto`.
  - "todos" (Git): `/#projects`.
  - **Única exceção:** "Portfolio" (JavaScript, HTML5/CSS3, Astro) continua no GitHub, porque o repositório deste site não tem página nem linha.
  - O case study abre-se pelo "Ver mais" da linha, e não por uma prova.
- **Imagens de partilha:** uma por projeto com screenshot e por língua, a 1200×630, compostas e não esticadas. Os que não têm screenshot usam a geral.

### Design

- **Direção editorial**: projetos em lista, sem miniaturas nem destaques na página inicial, porque o valor está no texto. O Licas é a linha 01, igual às outras.
- **Um só fundo em todo o site** (`--bg-color`), nos dois temas, sem faixas de outro tom. A separação entre secções vem do espaço e do cabeçalho.
- **Alinhamento:**
  - **centrados:** o hero, com a foto de 200px (150px no telemóvel) por cima do nome; os cabeçalhos de secção; os cartões de contacto;
  - **à esquerda, sem exceção:** as linhas de projeto, os parágrafos do Sobre e todo o corpo dos case studies. Texto corrido centrado é difícil de ler, porque o olho perde o início de cada linha.
- **Cabeçalhos de secção** (`SectionHeading.astro`): só o título e uma régua de 48×2px a roxo, **sem número**.
- **Ritmo vertical:**
  - as secções têm `--sp-24` em cima e `--sp-16` em baixo (no telemóvel, `--sp-16` e `--sp-12`);
  - todas as linhas de projeto têm o mesmo espaço entre si;
  - na grelha das linhas, a coluna da ação tem 13rem fixos, e no telemóvel o número tem `--sp-8`.
- **Contactos:** cartões com ícone a roxo num círculo da cor da página, com contorno de 1px. **Três colunas de largura igual** (fase 5.2): em flex, o cartão do email era mais largo e o conjunto dos ícones ficava 9,6px à direita do eixo do título. Quando as três não cabem, empilham numa coluna.
- **Rodapé simples:** o mesmo fundo, uma régua fina por cima, `--sp-8` em cima e em baixo, numa linha no computador.
- **Seta de voltar ao topo:**
  - é um botão de 44px com preenchimento `--surface-color` e contorno `--text-secondary`;
  - aparece depois do hero (nos case studies, depois de uma altura de ecrã);
  - fica a `--sp-16` do fundo, e a 192px (`--sp-32` + `--sp-16`) no telemóvel, para nunca tapar o rodapé;
  - tem `aria-label` "Voltar ao topo" / "Back to top" e respeita `prefers-reduced-motion`.
- **Escalas de tipografia e espaçamento como tokens** (`--fs-*`, `--lh-*`, `--sp-*` em `global.css`). Nada fica fora da escala, a não ser uma medida ótica ou de desenho comentada no CSS — **e as medidas de impressão do CV**, em pt, que são um sistema à parte e vivem só dentro do `@media print` do `cv.css` (fase 9; o comentário no CSS diz porquê). Não se fazem tokens para elas.
- **Acento roxo `#8B5CF6`, Poppins auto-alojada, e dois temas** com fallback a `prefers-color-scheme`, aplicados antes da primeira pintura. Os 17 custom properties de cor não mudam de valor. O `--footer-bg` continua definido, mas já não é usado.
- **Cor do texto:** o texto a roxo e a âmbar usa `--accent-text` e `--warning-text`, porque o `#8B5CF6` como texto fica abaixo de 4,5:1.
- **O botão principal "Ver projetos" tem fundo `#7C3AED`**, o roxo mais escuro da família, com texto branco a 5,70:1. O "Descarregar PDF" do CV é o mesmo botão. **Não há exceções de contraste:** todo o texto está a 4,5:1 ou mais, nos dois temas.
- **Zero dependências de terceiros no HTML gerado**, sem Google Fonts nem CDNs: privacidade, desempenho, e nada que parta de fora.
- **Os TTF ficam só em `scripts/fontes/`**, e a integração `garantirQueAsTTFnaoSaem` faz o build falhar se chegarem ao `dist`: são material de build, e o site serve WOFF2.

### Acessibilidade (Fase 5)

- **Marcos:** a navbar é `<header>`, o menu overlay é `<nav>`, e cada página tem `<main id="conteudo" tabindex="-1">` e `<footer>`. Há um só `h1` por página, sem saltos de nível.
- **Link de saltar** "Saltar para o conteúdo" / "Skip to content": é o primeiro elemento do `body` e aparece só com foco.
- **Menu e modais:**
  - com um deles aberto, o resto do `body` fica `inert`, em vez de uma armadilha de foco em JavaScript;
  - Escape fecha e devolve o foco a quem abriu;
  - o menu fechado tem `visibility: hidden`;
  - o botão do menu tem `aria-expanded` e `aria-controls`;
  - o scrollspy marca `aria-current`.
- **O "×" das modais** chama-se "Fechar" / "Close" (`a11y-close`).
- **Foco:** `:focus-visible` com `2px solid var(--accent-text)`, afastado `--sp-1`. Nunca se anima o `outline`, e por isso não há `transition: all` em elementos focáveis.
- **Links:** os que só se distinguiam pela cor são sublinhados (rodapé, "Voltar aos projetos", provas, ações do hero). Os botões não.
- **Ícones e emojis decorativos** levam `aria-hidden="true"`, e os SVG também `focusable="false"`.
- **Seletor de idioma:** o nome lido em voz diz o destino — "Mudar para inglês" / "Switch to Portuguese" — e cada código visível tem o seu `lang` (`PT` com `lang="pt"`, `EN` com `lang="en"`), para ser lido com a pronúncia certa. O texto visível continua "PT | EN".
- **Texto alternativo da foto:** "Fotografia de Francisco Pereira" / "Photograph of Francisco Pereira".
- **Resultado das auditorias:** zero violações axe nas 18 páginas × 2 temas, também com o menu, a modal e o balão abertos. Todo o texto está a 4,5:1 ou mais, e o contorno de foco a 5,13:1 ou mais. O que ficou pendente está no `ESTADO-ATUAL.md`.

### O CV (fase 9)

- **É uma página do site**, `/cv/` e `/en/cv/`, com o BaseLayout, a navbar, o rodapé e
  o seletor de idioma, e `hreflang` entre as duas. Um só `h1`, o nome. Uma coluna,
  sem tabelas, sem imagens além da fotografia (o mesmo `avatar.jpg` do hero, e o mesmo
  ficheiro gerado).
- **A ordem (fase 12):** cabeçalho → resumo → **Competências → Experiência → Projetos**
  → Educação → Idiomas → Interesses. Cada secção é uma `<section>` com `<h2>`. As
  competências vêm logo a seguir ao resumo porque são o bloco que os sistemas de
  triagem cruzam com o anúncio, e onde um recrutador olha primeiro quando a experiência
  é curta.
- **Trabalho pago vai para a Experiência, e não para os Projetos** (fase 12). O Licas é
  trabalho para um cliente: nos Projetos ficava ao lado de um projeto pessoal, e a
  Experiência parecia só um estágio de 2021.
- **A Experiência leva pontos; os Projetos ficam em linha corrida, de propósito.** Cada
  entrada da experiência tem o título, a stack e a data, e pontos que **começam por um
  verbo no passado** ("Construí", "Apliquei"; "Built", "Enforced"), incluindo uma linha
  de decisão técnica. É o teste dos primeiros 10 segundos: quem varre um CV lê as
  primeiras palavras de cada linha, e a começar por substantivos lê nomes de coisas e
  não vê o que ele fez. Um ponto novo tem de começar por um verbo.
- **SEO próprio:** o título é "CV — Francisco Pereira" nas duas línguas; a descrição é
  o resumo, cortado como a frase de abertura dos case studies.
- **Acentos a roxo, só quatro:** o ponto final do nome, o cargo, os títulos de secção e
  a barra do resumo. O texto a roxo usa `--accent-text`.
- **Os três links** vão numa linha própria, à largura toda, por baixo do nome e da
  fotografia, com uma régua fina por cima — nunca ao lado da fotografia.
- **As competências são uma grelha de duas colunas** (`display: grid`, a do rótulo com
  `max-content`), e não um rótulo com `min-width`: assim "Frameworks e bibliotecas"
  nunca encosta ao valor. O `audit:a11y` mede-o nos dois temas e em impressão.
- **O PDF sai sempre em branco**, seja qual for o tema: o `@media print` redefine os
  tokens para o conjunto claro, com fundo branco e o roxo a `#7C3AED`, e esconde a
  navegação, o menu, o rodapé, os botões do tema e de voltar ao topo, o link de saltar
  e o "Descarregar PDF". `@page` A4, com margens de 1,15cm e 1,4cm.
- **Os PDF não se editam à mão:** geram-se com `npm run cv`. O `CV.pdf` fica no caminho
  de sempre, para os links antigos continuarem a funcionar. **São reproduzíveis**
  (fase 10): o mesmo texto dá sempre os mesmos bytes, e o git só os vê mudados quando o
  CV muda.
- **Se o CV deixar de caber numa página**, o `npm run cv` falha e diz quantos
  milímetros faltam, e os PDF que lá estão ficam como estavam. Corta-se texto (por
  decisão do Francisco) ou apertam-se as medidas de impressão; nunca se aceita um PDF
  com duas páginas. **Hoje sobram 8,9 mm** no fundo da folha, em PT e em EN (eram 36,3
  e 41,0 mm antes da fase 12): dá para cerca de duas linhas de texto, não mais.

### O SITE FUNCIONA SEM JAVASCRIPT (fase 5.1)

O conteúdo é visível por omissão. **O estado inicial escondido da animação de entrada
só existe quando há JavaScript:** o script do `<head>` põe a classe `js` no `<html>`
antes da primeira pintura, e só `html.js .reveal` começa invisível. Sem JavaScript
não há classe nenhuma no `<html>`, e por isso:

- **o tema segue o sistema** (`prefers-color-scheme`); o bloco do tema claro em
  `@media` repete os valores de `html.light-mode`, e o `npm run audit:a11y` compara
  os dois — **mudam-se sempre juntos**;
- **a navegação aparece no cabeçalho** (componente `NavSemJs`, "topo"), porque os
  links de secção só existem dentro do menu overlay. Abaixo de 1180px não cabem numa
  linha e aparece a outra cópia, antes do rodapé ("fundo"). Com JavaScript, nenhuma
  das duas aparece;
- **o texto do botão "?" fica aberto**, por baixo da etiqueta;
- **escondem-se os controlos que não funcionam:** o botão do menu, a troca de tema e
  o próprio "?" (a seta de voltar ao topo já só aparecia por script).

**O que se perde sem JavaScript, e é aceitável:** o menu overlay, a troca manual de
tema, a seta de voltar ao topo, e as modais do Mr. Pizza e do Diane Arbus — as três
características de cada um e o link do Figma só existem lá dentro. A linha continua a
mostrar título, frase, stack e o link do repositório. Nada mais fica escondido.

## REGRAS DE TRABALHO

- **Nunca fazer commit nem push.** As alterações ficam por commitar para o
  Francisco ver o diff.
- **Nunca alterar texto do site** sem o Francisco pedir explicitamente. Texto novo
  que uma tarefa precise e que o enunciado não dê (por exemplo, um `aria-label`)
  pergunta-se antes.
- **Só ler, escrever e executar dentro desta pasta.** Nunca tocar noutro
  repositório, na configuração de outro projeto (por exemplo, um `.claude/launch.json`
  alheio) nem num servidor de outro projeto.
  - O servidor arranca com `npm run dev` nesta pasta.
  - Se o painel de pré-visualização não conseguir apontar para aqui, usa-se o
    servidor diretamente e diz-se ao Francisco. Nunca se contorna.
  - Se precisares de algo fora desta pasta, pára e pergunta.
- **Os ficheiros temporários vão para `node_modules/.cache/`**, que está no
  gitignore, e são apagados no fim. Nunca para `/tmp` nem para fora do projeto.
- **No fim de cada tarefa escrevem-se dois relatórios:**
  - um técnico e detalhado;
  - um resumo curto, em português simples e sem termos técnicos.
- **O mapa (`docs/ESTRUTURA.md`) regenera-se com `npm run mapa`**, no fim de cada
  fase, depois de mexer em ficheiros ou na documentação. O comando conta o disco e
  refaz a lista, os tamanhos, os totais e os resumos; as descrições escrevem-se à mão
  no próprio mapa, e um ficheiro novo faz o comando falhar até ser descrito.
  **Exclui** `node_modules/`, `dist/`, `.astro/`, `.git/`, `docs/historico/` (os
  relatórios são um registo, e escrever um não desatualiza o mapa) e `Claude outputs/`
  (material de trabalho do Francisco, fora do git). `npm run mapa -- --verificar` diz
  se o mapa está em dia sem escrever nada. Corre-se **depois do último build**: o mapa diz
  quantos ficheiros tem o `dist/`, e por isso a ordem é `build` → `cv` → `build` → `mapa`.
- **Nunca adicionar bibliotecas nem dependências externas** sem o Francisco aprovar.
- **Se uma instrução colidir com o que já existe**, e não der para cumprir as duas,
  pára e explica a colisão. Não escolhas sozinho.
- **Reporta com fidelidade:**
  - o que falhou, com a mensagem de erro;
  - o que não foi verificado;
  - as decisões que tomaste sozinho.
- **Procuras de texto com acentos** fazem-se com Node, e não com `git grep`: o
  `git grep` não encontra "Politécnico" com `Polit.cnico`.
- **Limites conhecidos do ambiente de teste:**
  - o painel do browser da app corre escondido: as capturas saem vazias, o scroll
    suave não avança e as transições CSS não progridem. **Para ver o site, usa-se o
    Playwright do projeto** contra `npm run preview`, com `reducedMotion: 'reduce'`,
    e olha-se para as capturas. As capturas tiradas logo depois do `load` apanham o
    conteúdo `.reveal` ainda invisível: espera-se cerca de 1 segundo;
  - **o axe não corre na versão sem JavaScript:** ele próprio precisa de executar
    JavaScript dentro da página e fica à espera para sempre (bloqueou a auditoria duas
    vezes). Sem JavaScript medem-se a estrutura, o que está visível e o contraste;
  - `elementFromPoint` só funciona dentro da zona visível do iframe: traz-se o
    elemento para a vista antes de testar o que está por cima;
  - cada chamada de JavaScript no browser tem um limite de 45s: medições pesadas
    fazem-se em blocos de poucas páginas;
  - se o servidor cair, um separador que tentou navegar pode ficar inutilizado ou
    guardar erros antigos na consola: usa-se um separador novo;
  - **o `audit:a11y` rebentou uma vez com um timeout do próprio teste** (fase 11, a
    2026-09-18 perto das 23h UTC): no bloco sem JavaScript, no tema escuro a 375px, ao
    seguir um link da navegação, o `page.waitForURL` esperou 30 s e desistiu, sem
    dizer o URL. Não se reproduziu em quatro corridas seguidas, três delas com uma sonda
    que registava cada navegação, a consola, os pedidos falhados e as respostas de erro:
    zero de tudo. **É uma falha intermitente da auditoria, não do site.** Se voltar, guarda-se o
    diagnóstico antes de repetir — o URL, se o servidor de preview responde a um pedido
    simples, a consola da página e o tempo até desistir — e diz-se ao Francisco.

## CONFIDENCIALIDADE

O **Licas** é projeto de um cliente real. Nunca podem aparecer no site, no
repositório, em comentários nem em commits:

- identificadores de projeto Supabase;
- chaves ou secrets;
- nomes de tabelas, funções ou RPCs;
- números de migração;
- emails, com exceção do `franciscojrp1004@gmail.com` do próprio Francisco;
- dados de clientes;
- o nome do negócio;
- a localidade.

O repositório do Licas está fora do âmbito: não se lê para "confirmar" nada.

## ESTADO ATUAL (2026-09-19)

- **Fases concluídas:**
  - 2.x: a migração para Astro;
  - 3: o texto, o canónico e os case studies;
  - 4: a direção editorial;
  - 4.2a: o conteúdo e as regras de estrutura;
  - 4.2b: design e texto;
  - 4.2c: ajustes visuais;
  - 4.2d: o Sobre, a instituição, as etiquetas, as provas internas e o fim de "Design → Código";
  - 5: rótulos das provas com os nomes dos projetos, acessibilidade, limpeza e verificação final;
  - 5.1: o site sem JavaScript, o seletor de idioma, o texto alternativo da foto e os comandos `npm run audit:*`;
  - 5.2: contactos em três colunas iguais, e as provas a levarem à linha do projeto;
  - 5.3: apagados os 13 ícones sem uso, a classe `.btn-outline` e a variável `--footer-bg`;
  - 6: as verificações no CI a bloquear o deploy e o `sharp` declarado;
  - 7: a pasta `docs/`, o mapa `docs/ESTRUTURA.md` e a limpeza ao código;
  - 8: a prova da limpeza refeita, as contagens do mapa e o inventário passado a histórico;
  - 9: o CV como página (`/cv` e `/en/cv`), os dois PDF gerados pelo `npm run cv`, o
    botão "Ver CV" no hero e o mapa gerado pelo `npm run mapa`;
  - 10: duas afirmações falsas do CV corrigidas, o CV fora da regra de não repetição e
    os PDF reproduzíveis;
  - 11: o lock do git, a pasta `Claude outputs/` no `.gitignore`, a medição do peso dos
    PDF, e os seis commits das fases 6 a 11, publicados;
  - 12: o CV reestruturado — o Licas passou para a Experiência, as competências para
    cima, e a experiência em pontos;
  - 13: a verificação ao vivo do `cb5e0dd`, "Suportei" → "Acomodei", a decisão da
    fotografia dos PDF, os relatórios da fase 11 e a publicação das fases 12 e 13.

  Cada uma tem os relatórios `docs/historico/FASE-*-tecnico.md` e `docs/historico/FASE-*-resumo.md`.
  Os da fase 11 foram escritos na fase 13, porque o push dela foi bloqueado pelas
  permissões da sessão e feito pelo Francisco à mão.
- **Publicado:** o site em franciscopereira.dev corresponde ao commit **`207ed69`**
  ("Replace an anglicism in the CV, add the Phase 11 reports, update the docs"),
  precedido de `1a55793` (o CV reestruturado, fase 12). Os dois commits e o push foram
  feitos **numa sessão do Claude, com autorização expressa do Francisco** (2026-09-19 às
  01:00, hora de Lisboa) — desta vez o push passou. A Action correu verde, pela ordem
  certa: `Verificar` das 00:00:52 às 00:01:05 UTC, `Build` das 00:01:08 às 00:01:25 e
  `Deploy` das 00:01:28 às 00:01:46. **Verificado contra o site ao vivo a seguir:** as 18
  páginas a 200; 44 ficheiros byte a byte iguais a um build limpo do `207ed69` (o
  `robots.txt` é o objeto do git); o `check:texto` do commit a passar contra o HTML ao
  vivo (1026 verificações); 114 pedidos, zero erros; "Ver CV" e "Descarregar PDF" certos
  nas duas línguas; certificado válido até 2026-10-27. O commit seguinte, só de
  documentação, fecha a fase 13 e não muda o site.
- **Publicação anterior:** o commit **`cb5e0dd`**
  ("Ignore Claude outputs/ and refresh the structure map"), o último de seis, um por
  fase, das fases 6 a 11: `288142d`, `2b157e5`, `55b1368`, `f82d8e9`, `51c045d` e
  `cb5e0dd`. Leva tudo até à fase 11, incluindo o CV. **Os seis commits foram feitos
  numa sessão do Claude, com autorização expressa do Francisco** (2026-09-19 às 00:10,
  hora de Lisboa); **o push foi o Francisco que o fez**, porque as permissões da sessão
  o bloquearam. A Action correu verde, e pela ordem certa: `Verificar` das 23:16:50 às
  23:17:02 UTC de 2026-09-18, `Build` até às 23:17:24 e `Deploy` até às 23:17:39. A
  `main` está alinhada com a `origin/main`. **Verificado contra o site ao vivo a 2026-09-19** (fase 13): HTTPS com certificado
  Let's Encrypt válido até 2026-10-27; as 18 páginas a 200; o HTML, o CSS, as fontes, as
  imagens e os dois PDF byte a byte iguais a um build limpo do `cb5e0dd` (44 ficheiros;
  o `robots.txt` é o objeto do git, byte a byte); o `check:texto` do commit a passar
  contra o HTML ao vivo (1016 verificações, zero divergências); 114 pedidos nas 18
  páginas, zero erros; o "Ver CV" e o "Descarregar PDF" a funcionar nas duas línguas;
  sitemap com 18 páginas.
  Antes disto, `4f13bec` (2026-09-17), feito pelo Francisco fora das sessões.
- **Por commitar:** nada. O commit e o push só acontecem **depois de o Francisco dizer
  "podes publicar"**.
- **Decisões já tomadas sobre a limpeza** (o inventário está no `docs/historico/LIMPEZA-PROPOSTA.md`):
  os relatórios ficam em `docs/historico/`; as duas imagens dormentes ficam, porque a poda já
  as tira do `dist` e removê-las obrigava a mexer no `imageAlt`, que é texto canónico; o
  `CLAUDE.md` e o `ESTADO-ATUAL.md` passam a ser versionados; e as verificações passam a
  correr no CI, com as auditorias a ficarem manuais.
- **Por fazer** (detalhe na secção "Por fazer" do `docs/ESTADO-ATUAL.md`):
  - o texto aprovado que ninguém mostra (o `description` dos 9 projetos e as
    `features` dos 7 com case study), que só sai por decisão do Francisco.
- **Limpeza ao código (2026-09-18):** saíram o prop `class` do `Icon.astro` e a
  constante `LANGS` do `i18n/index.ts` — seis linhas, as únicas mortas que havia. O
  CSS, o `main.js` e o `package.json` não tinham nada morto. O texto aprovado que
  ninguém mostra ficou em lista, porque **texto sai por decisão do Francisco e nunca
  por limpeza**.
- **Decidido, e por isso fora dos pendentes:** não haverá testes com leitores de ecrã
  reais, e os commits duplicados do histórico ficam como estão — reescrevê-los exigiria
  um force-push num repositório já publicado.

  **Por decisão do Francisco, o contorno de foco do botão "?" fica como está**, mesmo
  encostando às letras do título por cima.
