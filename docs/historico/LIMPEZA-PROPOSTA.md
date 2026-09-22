# Proposta de limpeza do repositório

> **Registo datado de 2026-09-18, mantido como história.** O inventário vivo do projeto
> é o [docs/ESTRUTURA.md](../ESTRUTURA.md), que é mais completo e acompanha o estado
> atual. As decisões que saíram desta análise estão no
> [docs/ESTADO-ATUAL.md](../ESTADO-ATUAL.md).

Data: 2026-09-18. **Tarefa só de leitura: não foi apagado, movido nem renomeado nada.**
O único ficheiro criado é este. Não houve commit nem push.

## Antes de mais: o estado do repositório mudou

O enunciado dizia que o HEAD ficaria em `9810f88`. **Já não está aí.** Entre a Fase 5.3
e esta tarefa, o trabalho das fases 4 a 5.3 foi commitado e publicado fora da sessão:

- HEAD: `4f13bec` — "Add accessibility audits & accessibility updates";
- a `main` está alinhada com a `origin/main` (já foi para o GitHub);
- esse commit inclui os 13 ícones apagados na Fase 5.3;
- ficam **18 ficheiros por versionar**, todos `.md`: o `CLAUDE.md`, o `ESTADO-ATUAL.md`
  e os 16 relatórios de fase.

Não mexi em nada disto. O inventário abaixo é do que está versionado hoje.

## Números

| | |
|---|---:|
| Ficheiros versionados (`git ls-files`) | **89** |
| Peso total versionado | **3 382 133 B (3,2 MB)** |
| Ficheiros por versionar (`.md`) | 18 (175 733 B) |
| Candidatos a remoção segura (Lista A) | **0** |
| A decidir por ti (Lista B) | 16 ficheiros, 124 979 B (122,0 KB) |
| Não remover (Lista C) | 89 versionados + 2 documentos |

## Método

Para cada um dos 89 ficheiros versionados, três pesquisas cumulativas em **todos** os
outros ficheiros de texto do repositório (incluindo `.github/`, `package.json`,
`astro.config.mjs`, `.md` e comentários):

1. **nome completo** (`avatar.jpg`);
2. **nome sem extensão** (`avatar`), com fronteiras de palavra, para apanhar
   concatenações;
3. **caminho/slug** (`assets/images/avatar.jpg`, `hotel-inteligente`).

E depois, obrigatoriamente, a **verificação de referência dinâmica**: procurar nomes
construídos em tempo de execução. Foram encontrados quatro mecanismos, e todos mudam o
veredito de ficheiros que as três pesquisas dariam como órfãos:

| Mecanismo | Onde | O que torna vivo |
|---|---|---|
| `import.meta.glob('../icons/*.svg')` | `src/components/Icon.astro` | os SVG de `src/icons/`, nomeados por `<Icon name="…">` |
| `/og/${slug}-${lang}.jpg` | `src/lib/caseStudy.ts` | as 8 imagens de `public/og/`, que não aparecem escritas em lado nenhum |
| `getCollection('projects')` | as duas rotas `[slug].astro` | os 9 JSON de `src/content/projects/` |
| Rotas por ficheiro | `src/pages/` | as 4 páginas, que ninguém importa |

**Três ficheiros seriam apagados por engano** por uma análise que parasse nas pesquisas
literais: `src/content/projects/dae.json`, `src/lib/seo.ts` (importado como
`import type { PaginaSeo }`) e as rotas `[slug].astro`. As 8 imagens `public/og/*.jpg`
seriam apagadas pelo mesmo motivo.

## 1. Tabela principal — os 89 ficheiros versionados

| Ficheiro | Tamanho | Referenciado por | Classificação | Risco se for removido |
|---|---:|---|---|---|
| `.gitattributes` | 68 B | o Git (normalização de fins de linha) | vivo | fins de linha misturados entre Windows e a Action |
| `.github/workflows/deploy.yml` | 1,2 KB | o GitHub Actions, a cada push para a main | vivo · crítico | o site deixa de ser publicado |
| `.gitignore` | 255 B | o Git | vivo | node_modules/ e dist/ passariam a entrar em cada commit |
| `README.md` | 3,8 KB | quem abre o repositório | vivo · crítico | o projeto fica sem porta de entrada |
| `assets/images/ainet.jpg` | 87,1 KB | `image` em src/content/projects/ainet.json → imagem de partilha do case study | vivo | o `npm run og` falha e a partilha do AINET perde a imagem |
| `assets/images/avatar.jpg` | 49,2 KB | src/components/Hero.astro; é a fotografia do hero | vivo | a página inicial fica sem fotografia |
| `assets/images/dae.jpg` | 88,1 KB | `image` em src/content/projects/dae.json → imagem de partilha do case study | vivo | o `npm run og` falha e a partilha do DAE perde a imagem |
| `assets/images/dianearbus.webp` | 283,6 KB | `image` em src/content/projects/diane-arbus.json: validada no build, nunca desenhada e podada do dist/ | dormente | o build falha já hoje: `verificarImagensDosProjetos` exige o ficheiro que os dados nomeiam |
| `assets/images/logo-gest.jpg` | 97,8 KB | `image` em src/content/projects/gest.json → imagem de partilha do case study | vivo | o `npm run og` falha e a partilha do Gest perde a imagem |
| `assets/images/mrpizza.webp` | 550,3 KB | `image` em src/content/projects/mr-pizza.json: validada no build, nunca desenhada (o projeto não tem case study nem a lista mostra imagens) e podada do dist/ | dormente | o build falha já hoje: `verificarImagensDosProjetos` exige o ficheiro que os dados nomeiam |
| `assets/images/ti.webp` | 110,6 KB | `image` em src/content/projects/hotel-inteligente.json → imagem de partilha | vivo | o `npm run og` falha e a partilha do Hotel perde a imagem |
| `astro.config.mjs` | 6,4 KB | o build (i18n, sitemap e as três guardas) | vivo · crítico | o build perde as rotas, o sitemap e as guardas |
| `content/texto-canonico.json` | 120,1 KB | scripts/check-texto.mjs; é a fonte de verdade de todo o texto | vivo · crítico | perde-se a referência de todo o texto aprovado e o check:texto deixa de ter contra o que comparar |
| `package-lock.json` | 148,9 KB | npm ci, incluindo o da Action | vivo · crítico | o build deixa de ser reprodutível |
| `package.json` | 732 B | npm (scripts e dependências) | vivo · crítico | não há projeto |
| `public/CNAME` | 20 B | o GitHub Pages, copiado para o dist/ em cada build | vivo · crítico | o domínio franciscopereira.dev morre no próximo deploy |
| `public/assets/docs/CV.pdf` | 380,2 KB | `cvPath` em src/data/site.json, ligado no hero | vivo · crítico | o botão "Descarregar CV" dá 404 |
| `public/assets/icons/favicon.ico` | 15,0 KB | src/layouts/BaseLayout.astro | vivo | o separador do browser fica sem ícone |
| `public/fonts/poppins-400-latin-ext.woff2` | 5,5 KB | `@font-face` em src/styles/global.css (`url('/fonts/…')`), com preload no BaseLayout para o peso 400 | vivo | o site perde esse peso ou subconjunto da Poppins e cai na fonte de recurso |
| `public/fonts/poppins-400-latin.woff2` | 7,7 KB | `@font-face` em src/styles/global.css (`url('/fonts/…')`), com preload no BaseLayout para o peso 400 | vivo | o site perde esse peso ou subconjunto da Poppins e cai na fonte de recurso |
| `public/fonts/poppins-500-latin-ext.woff2` | 5,4 KB | `@font-face` em src/styles/global.css (`url('/fonts/…')`), com preload no BaseLayout para o peso 400 | vivo | o site perde esse peso ou subconjunto da Poppins e cai na fonte de recurso |
| `public/fonts/poppins-500-latin.woff2` | 7,6 KB | `@font-face` em src/styles/global.css (`url('/fonts/…')`), com preload no BaseLayout para o peso 400 | vivo | o site perde esse peso ou subconjunto da Poppins e cai na fonte de recurso |
| `public/fonts/poppins-600-latin-ext.woff2` | 5,4 KB | `@font-face` em src/styles/global.css (`url('/fonts/…')`), com preload no BaseLayout para o peso 400 | vivo | o site perde esse peso ou subconjunto da Poppins e cai na fonte de recurso |
| `public/fonts/poppins-600-latin.woff2` | 7,8 KB | `@font-face` em src/styles/global.css (`url('/fonts/…')`), com preload no BaseLayout para o peso 400 | vivo | o site perde esse peso ou subconjunto da Poppins e cai na fonte de recurso |
| `public/fonts/poppins-700-latin-ext.woff2` | 5,3 KB | `@font-face` em src/styles/global.css (`url('/fonts/…')`), com preload no BaseLayout para o peso 400 | vivo | o site perde esse peso ou subconjunto da Poppins e cai na fonte de recurso |
| `public/fonts/poppins-700-latin.woff2` | 7,6 KB | `@font-face` em src/styles/global.css (`url('/fonts/…')`), com preload no BaseLayout para o peso 400 | vivo | o site perde esse peso ou subconjunto da Poppins e cai na fonte de recurso |
| `public/og-image.png` | 45,7 KB | src/components/Seo.astro (og:image geral) e scripts/gerar-og.mjs | vivo | as partilhas da página inicial ficam sem imagem |
| `public/og/ainet-en.jpg` | 63,7 KB | construída por `ogImagemCaseStudy('ainet', lang)` em src/lib/caseStudy.ts e usada no `og:image` da página do case study | vivo | a partilha dessa página fica sem imagem própria |
| `public/og/ainet-pt.jpg` | 64,5 KB | construída por `ogImagemCaseStudy('ainet', lang)` em src/lib/caseStudy.ts e usada no `og:image` da página do case study | vivo | a partilha dessa página fica sem imagem própria |
| `public/og/dae-en.jpg` | 64,3 KB | construída por `ogImagemCaseStudy('dae', lang)` em src/lib/caseStudy.ts e usada no `og:image` da página do case study | vivo | a partilha dessa página fica sem imagem própria |
| `public/og/dae-pt.jpg` | 63,9 KB | construída por `ogImagemCaseStudy('dae', lang)` em src/lib/caseStudy.ts e usada no `og:image` da página do case study | vivo | a partilha dessa página fica sem imagem própria |
| `public/og/gest-en.jpg` | 66,7 KB | construída por `ogImagemCaseStudy('gest', lang)` em src/lib/caseStudy.ts e usada no `og:image` da página do case study | vivo | a partilha dessa página fica sem imagem própria |
| `public/og/gest-pt.jpg` | 65,5 KB | construída por `ogImagemCaseStudy('gest', lang)` em src/lib/caseStudy.ts e usada no `og:image` da página do case study | vivo | a partilha dessa página fica sem imagem própria |
| `public/og/hotel-inteligente-en.jpg` | 66,2 KB | construída por `ogImagemCaseStudy('hotel-inteligente', lang)` em src/lib/caseStudy.ts e usada no `og:image` da página do case study | vivo | a partilha dessa página fica sem imagem própria |
| `public/og/hotel-inteligente-pt.jpg` | 70,5 KB | construída por `ogImagemCaseStudy('hotel-inteligente', lang)` em src/lib/caseStudy.ts e usada no `og:image` da página do case study | vivo | a partilha dessa página fica sem imagem própria |
| `public/robots.txt` | 84 B | os motores de busca (servido em /robots.txt); aponta para o sitemap | vivo | os motores perdem o apontador para o sitemap |
| `scripts/auditoria/acessibilidade.mjs` | 15,3 KB | `npm run audit:a11y` | vivo · crítico | perde-se a auditoria de acessibilidade |
| `scripts/auditoria/comum.mjs` | 6,5 KB | os dois scripts de auditoria | vivo · crítico | as duas auditorias deixam de arrancar |
| `scripts/auditoria/teclado.mjs` | 13,3 KB | `npm run audit:teclado` | vivo · crítico | perde-se a auditoria de teclado |
| `scripts/check-i18n.mjs` | 3,0 KB | `npm run check:i18n` | vivo · crítico | perde-se a rede que apanha chaves em falta entre PT e EN |
| `scripts/check-texto.mjs` | 29,5 KB | `npm run check:texto` | vivo · crítico | perde-se a rede que garante que o site diz o texto aprovado |
| `scripts/fontes/Poppins-Bold.ttf` | 152,3 KB | scripts/gerar-og.mjs (`fonte('Poppins-Bold.ttf')`) | vivo | o `npm run og` deixa de conseguir desenhar o texto das imagens de partilha |
| `scripts/fontes/Poppins-Regular.ttf` | 156,6 KB | scripts/gerar-og.mjs (`fonte('Poppins-Regular.ttf')`) | vivo | o `npm run og` deixa de conseguir desenhar o texto das imagens de partilha |
| `scripts/fontes/Poppins-SemiBold.ttf` | 153,6 KB | scripts/gerar-og.mjs (`fonte('Poppins-SemiBold.ttf')`) | vivo | o `npm run og` deixa de conseguir desenhar o texto das imagens de partilha |
| `scripts/gerar-og.mjs` | 13,1 KB | `npm run og` | vivo · crítico | não há como regenerar as imagens de partilha |
| `src/components/About.astro` | 539 B | src/layouts/PortfolioPage.astro, content/texto-canonico.json, src/i18n/en.json | vivo | quem o importa deixa de compilar |
| `src/components/Contacts.astro` | 2,0 KB | src/layouts/PortfolioPage.astro, content/texto-canonico.json, src/i18n/en.json | vivo | quem o importa deixa de compilar |
| `src/components/Footer.astro` | 895 B | src/layouts/CaseStudyPage.astro, src/layouts/PortfolioPage.astro | vivo | quem o importa deixa de compilar |
| `src/components/Hero.astro` | 1,5 KB | src/layouts/PortfolioPage.astro | vivo | quem o importa deixa de compilar |
| `src/components/Icon.astro` | 1,5 KB | src/components/Contacts.astro, src/components/OverlayMenu.astro | vivo | quem o importa deixa de compilar |
| `src/components/NavSemJs.astro` | 1,1 KB | src/components/Navbar.astro, src/layouts/CaseStudyPage.astro, src/layouts/PortfolioPage.astro | vivo | quem o importa deixa de compilar |
| `src/components/Navbar.astro` | 2,0 KB | src/layouts/CaseStudyPage.astro, src/layouts/PortfolioPage.astro | vivo | quem o importa deixa de compilar |
| `src/components/OverlayMenu.astro` | 2,1 KB | src/layouts/CaseStudyPage.astro, src/layouts/PortfolioPage.astro | vivo | quem o importa deixa de compilar |
| `src/components/ProjectModal.astro` | 2,4 KB | src/layouts/PortfolioPage.astro | vivo | quem o importa deixa de compilar |
| `src/components/ProjectRow.astro` | 3,3 KB | src/components/Projects.astro | vivo | quem o importa deixa de compilar |
| `src/components/Projects.astro` | 1,0 KB | src/layouts/PortfolioPage.astro, content/texto-canonico.json, src/i18n/en.json | vivo | quem o importa deixa de compilar |
| `src/components/SectionHeading.astro` | 436 B | src/components/About.astro, src/components/Contacts.astro, src/components/Projects.astro, src/components/Skills.astro | vivo | quem o importa deixa de compilar |
| `src/components/Seo.astro` | 4,1 KB | src/layouts/BaseLayout.astro | vivo | quem o importa deixa de compilar |
| `src/components/Skills.astro` | 3,2 KB | src/layouts/PortfolioPage.astro, content/texto-canonico.json, src/i18n/en.json | vivo | quem o importa deixa de compilar |
| `src/content.config.ts` | 4,2 KB | o Astro (schema Zod da collection) | vivo · crítico | os projetos deixam de ser validados |
| `src/content/projects/3d-analyzer.json` | 12,6 KB | `getCollection('projects')` (carregamento por pasta); e 2 referências literais | vivo | o projeto 3d-analyzer desaparece da lista e a sua página de case study deixa de existir |
| `src/content/projects/ainet.json` | 9,3 KB | `getCollection('projects')` (carregamento por pasta); e 2 referências literais | vivo | o projeto ainet desaparece da lista e a sua página de case study deixa de existir |
| `src/content/projects/cadflow-bank-system.json` | 8,0 KB | `getCollection('projects')` (carregamento por pasta); e 2 referências literais | vivo | o projeto cadflow-bank-system desaparece da lista e a sua página de case study deixa de existir |
| `src/content/projects/dae.json` | 11,4 KB | `getCollection('projects')` (carregamento por pasta); sem referência literal, por ser carregado pela pasta | vivo | o projeto dae desaparece da lista e a sua página de case study deixa de existir |
| `src/content/projects/diane-arbus.json` | 2,3 KB | `getCollection('projects')` (carregamento por pasta); e 2 referências literais | vivo | o projeto diane-arbus desaparece da lista |
| `src/content/projects/gest.json` | 8,8 KB | `getCollection('projects')` (carregamento por pasta); e 6 referências literais | vivo | o projeto gest desaparece da lista e a sua página de case study deixa de existir |
| `src/content/projects/hotel-inteligente.json` | 10,2 KB | `getCollection('projects')` (carregamento por pasta); e 2 referências literais | vivo | o projeto hotel-inteligente desaparece da lista e a sua página de case study deixa de existir |
| `src/content/projects/licas.json` | 10,8 KB | `getCollection('projects')` (carregamento por pasta); e 2 referências literais | vivo | o projeto licas desaparece da lista e a sua página de case study deixa de existir |
| `src/content/projects/mr-pizza.json` | 2,1 KB | `getCollection('projects')` (carregamento por pasta); e 2 referências literais | vivo | o projeto mr-pizza desaparece da lista |
| `src/data/site.json` | 454 B | 20 ficheiros, entre componentes, layouts e scripts | vivo | nome, email, URLs e caminho do CV desaparecem |
| `src/data/skills.json` | 3,9 KB | src/components/Skills.astro e scripts/check-texto.mjs | vivo | a secção Competências fica vazia |
| `src/i18n/en.json` | 3,1 KB | src/i18n/index.ts, check-i18n e check-texto | vivo | a versão inglesa fica sem interface |
| `src/i18n/index.ts` | 811 B | todos os componentes e layouts | vivo | o site perde `t()`, `localeHref` e os tipos |
| `src/i18n/pt.json` | 3,2 KB | src/i18n/index.ts, check-i18n e check-texto | vivo | metade do texto de interface desaparece |
| `src/icons/github-original.svg` | 1,8 KB | `<Icon name="github-original">` em Contacts.astro e OverlayMenu.astro | vivo | o ícone do GitHub desaparece dos contactos e do menu |
| `src/icons/linkedin-plain.svg` | 459 B | `<Icon name="linkedin-plain">` em Contacts.astro e OverlayMenu.astro | vivo | o ícone do LinkedIn desaparece dos contactos e do menu |
| `src/layouts/BaseLayout.astro` | 4,3 KB | src/layouts/CaseStudyPage.astro, src/layouts/PortfolioPage.astro | vivo | quem o importa deixa de compilar |
| `src/layouts/CaseStudyPage.astro` | 6,0 KB | src/pages/en/projects/[slug].astro, src/pages/projetos/[slug].astro | vivo | quem o importa deixa de compilar |
| `src/layouts/PortfolioPage.astro` | 2,0 KB | src/pages/en/index.astro, src/pages/index.astro | vivo | quem o importa deixa de compilar |
| `src/lib/caseStudy.ts` | 1,3 KB | 18 ficheiros (rotas, layouts, componentes e scripts) | vivo | as rotas dos case studies e o caminho das imagens de partilha deixam de existir |
| `src/lib/seo.ts` | 611 B | Seo.astro, BaseLayout.astro e CaseStudyPage.astro (`import type { PaginaSeo }`) | vivo | o SEO por página perde os tipos |
| `src/pages/en/index.astro` | 124 B | o Astro, por rotas de ficheiro | vivo · crítico | as páginas que gera deixam de existir |
| `src/pages/en/projects/[slug].astro` | 540 B | o Astro, por rotas de ficheiro | vivo · crítico | as páginas que gera deixam de existir |
| `src/pages/index.astro` | 158 B | o Astro, por rotas de ficheiro | vivo · crítico | as páginas que gera deixam de existir |
| `src/pages/projetos/[slug].astro` | 534 B | o Astro, por rotas de ficheiro | vivo · crítico | as páginas que gera deixam de existir |
| `src/scripts/main.js` | 10,4 KB | BaseLayout.astro; é todo o comportamento do site | vivo | menu, tema, modais, "?" e seta deixam de funcionar |
| `src/styles/case-study.css` | 4,0 KB | src/layouts/CaseStudyPage.astro | vivo | as páginas de case study ficam sem estilos |
| `src/styles/global.css` | 43,3 KB | src/layouts/BaseLayout.astro | vivo · crítico | o site fica sem estilos |
| `tsconfig.json` | 114 B | o TypeScript e o editor | vivo | perdem-se os tipos e o `strict` do Astro |

## 2. Lista A — remoção segura

**Vazia. Nenhum ficheiro versionado está morto.**

Isto não é acaso: a Fase 5.3 já tirou o que estava morto (13 ícones SVG, a classe
`.btn-outline` e a variável `--footer-bg`), e esse trabalho já está commitado. Depois
disso, cada um dos 89 ficheiros tem um consumidor identificável — código, dados,
ferramenta de build, ou o próprio GitHub.

## 3. Lista B — remoção provável, à tua decisão

Os **16 relatórios de fase**, que hoje nem sequer estão versionados:

| Ficheiro | Tamanho |
|---|---:|
| `historico/FASE-4-resumo.md` | 2,0 KB |
| `historico/FASE-4-tecnico.md` | 14,6 KB |
| `historico/FASE-4.2a-resumo.md` | 1,6 KB |
| `historico/FASE-4.2a-tecnico.md` | 14,3 KB |
| `historico/FASE-4.2b-resumo.md` | 1,6 KB |
| `historico/FASE-4.2b-tecnico.md` | 15,0 KB |
| `historico/FASE-4.2c-resumo.md` | 1,3 KB |
| `historico/FASE-4.2c-tecnico.md` | 12,3 KB |
| `historico/FASE-4.2d-resumo.md` | 1,1 KB |
| `historico/FASE-4.2d-tecnico.md` | 13,7 KB |
| `historico/FASE-5-resumo.md` | 1,8 KB |
| `historico/FASE-5-tecnico.md` | 19,6 KB |
| `historico/FASE-5.2-resumo.md` | 1,3 KB |
| `historico/FASE-5.2-tecnico.md` | 10,3 KB |
| `historico/FASE-5.3-resumo.md` | 1,6 KB |
| `historico/FASE-5.3-tecnico.md` | 10,0 KB |
| **Total** | **122,0 KB** |

**Referências, verificadas como o enunciado exige:**

- o `CLAUDE.md` refere-os em conjunto, sem nomear nenhum: *"Cada uma tem os relatórios
  `FASE-*-tecnico.md` e `FASE-*-resumo.md`"* (linha 361);
- o `ESTADO-ATUAL.md` refere-os duas vezes: na tabela do que está por commitar
  (linha 243) e, **por nome**, o `historico/FASE-4.2a-tecnico.md` (linha 347), como o sítio onde
  ficou uma menção ao nome antigo da instituição;
- vários relatórios citam-se uns aos outros;
- **precedente que interessa:** foi um relatório — o `historico/FASE-5-tecnico.md` — que na Fase
  5.3 nomeou os 13 ícones a apagar. Foi preciso perguntar-te antes de apagar, porque a
  regra dizia que qualquer menção bloqueava. Apagar os relatórios apaga esse tipo de
  rasto.

**A favor de apagar:** não são código, ninguém os lê fora destas sessões, e já os
apagaste duas vezes no passado (`21d0811` e `9810f88`). O `ESTADO-ATUAL.md` guarda o
essencial de cada fase.

**Contra:** são o registo de porquê cada decisão foi tomada — a justificação de
texto, de design e de acessibilidade que o `ESTADO-ATUAL.md` só resume. Uma vez fora do
disco, e nunca tendo estado no git, desaparecem de vez. E o `ESTADO-ATUAL.md` remete
explicitamente para um deles.

**Terceira via, se quiseres o meio-termo:** versioná-los (ficam no histórico, sem ocupar
a raiz do dia-a-dia) ou movê-los para uma pasta `historico/`. Qualquer das duas é uma
tarefa à parte, e não a faço sem ordem tua.

## 4. Lista C — não remover

### Críticos (confirmados um a um)

| Ficheiro | Confirmação |
|---|---|
| `public/CNAME` | Existe, com `franciscopereira.dev`. É copiado para o `dist/` em cada build. Sem ele, o domínio personalizado morre no próximo deploy |
| `content/texto-canonico.json` | 120,1 KB, fonte única de todo o texto visível; o `check:texto` compara-o com o HTML gerado |
| `scripts/check-texto.mjs` | Rede de segurança: 914 verificações, falha o trabalho se o site disser algo diferente do aprovado |
| `scripts/check-i18n.mjs` | Rede de segurança: paridade de chaves entre PT e EN |
| `scripts/auditoria/acessibilidade.mjs`, `teclado.mjs`, `comum.mjs` | Rede de segurança: as duas auditorias de acessibilidade, chamadas por `npm run audit:*` |
| `scripts/gerar-og.mjs` | Gera as imagens de partilha. Depende das 3 TTF de `scripts/fontes/` e das 4 imagens de projeto com case study |
| `.github/workflows/deploy.yml` | O deploy. Invoca `withastro/action@v3` e `actions/deploy-pages@v4`; ambos são externos e nada mais no repositório é preciso para os alcançar |
| `CLAUDE.md` | Contexto de trabalho de cada sessão (não versionado — ver "o que encontrei") |
| `ESTADO-ATUAL.md` | Retrato detalhado do estado (não versionado — ver "o que encontrei") |
| `README.md` | Porta de entrada do repositório |
| `public/assets/docs/CV.pdf` | Servido em `/assets/docs/CV.pdf` e ligado no hero. **Não lhe toquei** |

### Dormentes — não são candidatos, por definição

| O quê | Porque é dormente |
|---|---|
| `assets/images/mrpizza.webp` (550,3 KB) | O campo `image` do Mr. Pizza nomeia-o. Hoje não é desenhado em lado nenhum — o projeto não tem case study, e a lista de projetos não mostra imagens — e a integração `podar-assets-nao-referenciados` retira-o do `dist/`. Mas o build **exige** o ficheiro que os dados nomeiam, e ele volta a ser desenhado no dia em que o projeto ganhe case study ou a lista passe a ter miniaturas |
| `assets/images/dianearbus.webp` (283,6 KB) | O mesmo, para o Diane Arbus |
| `.modal-note` e `.btn-modal-disabled` (`global.css`) | Não aparecem no HTML de hoje, mas o `ProjectModal.astro` gera-as se um projeto com modal passar a ter `coldStart` ou `status: in-development`. É o precedente da Fase 5.3, e mantém-se |

**Nota sobre as duas imagens:** juntas são **833,9 KB, o maior ganho possível de espaço
neste repositório** — mais do que tudo o resto junto. Não as ponho na Lista A nem na B
porque não estão mortas: para saírem, tinham de sair primeiro os campos `image` e
`imageAlt` dos dois JSON, o que é uma alteração de conteúdo e não uma limpeza de
ficheiros. Se quiseres, é uma decisão à parte: "os dois projetos sem case study deixam
de ter screenshot nos dados".

### Vivos, sem nada a decidir

Os restantes 76 ficheiros da tabela: componentes, layouts, rotas, dados, i18n, estilos,
fontes WOFF2 servidas pelo site, TTF de build, imagens de partilha, e os ficheiros de
configuração (`package.json`, `package-lock.json`, `tsconfig.json`, `astro.config.mjs`,
`.gitignore`, `.gitattributes`).

## 5. Espaço libertado

| | Ficheiros | Espaço |
|---|---:|---:|
| **Lista A** (remoção segura) | 0 | **0 B** |
| **Lista A + B** (com os relatórios, se decidires) | 16 | **124 979 B (122,0 KB)** |
| *(referência)* se um dia saírem também as duas imagens dormentes | +2 | +853 872 B (833,9 KB) |

Em percentagem: a Lista B tira 122 KB de ficheiros que nem estão versionados — **0 % do
repositório versionado**. As duas imagens dormentes valem **25 % dos 3,2 MB** versionados.

## 6. O que encontrei e não toquei

1. **O `sharp` é importado sem estar declarado.** O `scripts/gerar-og.mjs` faz
   `import sharp from 'sharp'`, mas o `sharp` não está no `package.json`: hoje funciona
   porque vem com o Astro. No dia em que o Astro deixar de o trazer, o `npm run og`
   parte sem aviso. As restantes dependências estão todas em uso:
   `astro` e `@astrojs/sitemap` (runtime), `opentype.js` (gerar-og), `playwright` e
   `@axe-core/playwright` (auditorias).
2. **A Action publica sem rede de segurança.** O `deploy.yml` corre só o build da
   `withastro/action@v3`. Nem o `check:i18n`, nem o `check:texto`, nem as auditorias
   correm no CI: se alguém publicar sem os correr à mão, ninguém dá por nada.
3. **O `CLAUDE.md` e o `ESTADO-ATUAL.md` não estão versionados.** São a memória do
   projeto e existem só no teu disco: um formatar e desaparecem. Não estão no
   `.gitignore`; só nunca foram adicionados.
4. **O `ESTADO-ATUAL.md` ficou desatualizado com o commit `4f13bec`.** A secção 4 ainda
   diz "O HEAD é `9810f88`" e lista como "por commitar" o que já está commitado e
   publicado. A secção 5 também não regista este commit novo.
5. **A poda de assets é silenciosa.** A integração `podar-assets-nao-referenciados`
   apaga do `dist/` o que nada referencia — é o que esconde, em cada build, que as duas
   `.webp` não servem para nada no site.
6. **Nenhuma regra de CSS morta.** Depois da Fase 5.3, as únicas classes sem uso no HTML
   gerado são as duas dormentes, e não há variáveis `--*` definidas sem uso.

## 7. O que precisas de decidir

1. **Os 16 relatórios de fase** (Lista B): apagar, versionar, ou mover para `historico/`?
2. **As duas imagens dormentes** (833,9 KB): os dois projetos sem case study continuam a
   ter screenshot nos dados, ou tiram-se os campos e os ficheiros?
3. **Versionar o `CLAUDE.md` e o `ESTADO-ATUAL.md`**, para deixarem de existir só no teu
   disco?
4. **Pôr as verificações no CI**, para a Action não publicar sem elas?

Nenhuma destas é uma limpeza de ficheiros mortos: são decisões tuas. A Lista A, que é a
única que eu poderia propor sem margem para dúvida, está vazia.

