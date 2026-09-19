# Estrutura do projeto

Todos os ficheiros do projeto, com o que são, quem lhes pega e o que parte se
desaparecerem.

**Como se mantém:** o `npm run mapa` (`scripts/gerar-estrutura.mjs`) conta o disco e
refaz a lista de ficheiros, os tamanhos, os totais, os resumos e a lista do que fica
de fora. As descrições escrevem-se à mão aqui mesmo — a introdução de cada pasta e as
quatro colunas de texto de cada ficheiro —, e o gerador guarda-as. Um ficheiro novo
entra com as colunas "⚠ por descrever", e o comando falha até alguém as escrever;
`npm run mapa -- --verificar` diz se o mapa está em dia, sem escrever nada.

**O que fica de fora, e porquê:**

- `node_modules/` — as dependências instaladas pelo `npm ci`. Regeneram-se a partir do `package-lock.json` e nunca entram no repositório.
- `dist/` — o site construído, que o `npm run build` refaz do zero de cada vez. É o que o GitHub Pages publica.
- `.astro/` — a cache do Astro (tipos gerados e conteúdo indexado). Regenera-se sozinha.
- `.git/` — o histórico do repositório, gerido pelo Git.
- `docs/historico/` — os relatórios de cada fase, um técnico e um resumo por fase, e o inventário de limpeza de 2026-09-18. São o registo do que se fez e porquê, e não fazem parte da arquitetura: listá-los seria uma linha por relatório a dizer "um relatório de fase". Nem sequer se contam aqui, para escrever um relatório não desatualizar o mapa (o `npm run mapa` diz quantos são). Estão versionados, e o `docs/ESTADO-ATUAL.md` resume o que deles ficou decidido.
- `Claude outputs/` — maquetes que a aplicação do Claude guarda aqui quando se trabalha noutro chat. Estão no `.gitignore` e não fazem parte do projeto.

**Total: 102 ficheiros, 3584,0 KB.**

## (raiz)

A raiz tem oito ficheiros e mais nada: quatro de configuração, dois de dependências e
dois documentos. Tudo o resto vive numa pasta.

É de propósito. Quem abre o repositório no GitHub vê primeiro o `README.md`, e quem
vem trabalhar no projeto vê o `CLAUDE.md` — o contrato que diz que o texto do site não
se reescreve. Os relatórios de fase e o retrato do estado estão em `docs/`, porque são
história e contexto, não são a porta de entrada.

Nenhum destes ficheiros é servido a quem visita o site, com uma exceção indireta: o
`astro.config.mjs` decide o que o `dist/` leva.

| Caminho | O que é | Quem o usa | Chega ao visitante? | O que parte sem ele |
|---|---|---|---|---|
| `.gitattributes` (68 B) | Diz ao Git que normalize os fins de linha dos ficheiros de texto. | o Git, em cada `add` e `checkout` | NÃO — só build | Ficheiros de texto passam a ir para o repositório com os fins de linha do Windows, e cada máquina vê o ficheiro inteiro como alterado. |
| `.gitignore` (431 B) | Lista o que nunca entra no repositório: `node_modules/`, `dist/`, `.astro/`, `.env*`, caches, logs e a pasta `Claude outputs/`. | o Git, em cada `add` e `status` | NÃO — só build | O `npm install` seguinte mete 200 MB de `node_modules` e o `dist/` inteiro no próximo commit. |
| `astro.config.mjs` (6,4 KB) | Configuração do Astro: o domínio, as duas línguas em rotas reais, o sitemap e três guardas próprias do build. | o `npm run build` e o `npm run preview` | NÃO — só build | O site perde as rotas `/en/`, o sitemap e o `og:url` absoluto; as três guardas deixam de correr e uma imagem de projeto em falta passa a ser descoberta só no site publicado. |
| `CLAUDE.md` (36,4 KB) | O contrato de trabalho do projeto: a regra do texto canónico, as decisões já tomadas, os comandos e o estado. | quem trabalha no projeto, incluindo o Claude no início de cada sessão | NÃO — documentação | Uma sessão nova começa sem saber que o texto não se reescreve, e o texto aprovado corre risco de ser "melhorado". |
| `package-lock.json` (149,0 KB) | Fixa a versão exata de cada dependência, incluindo as transitivas. | o `npm ci`, aqui e no job `verificar` da Action | NÃO — só build | O `npm ci` recusa-se a correr e a Action falha logo no primeiro passo; o build deixa de ser reprodutível. |
| `package.json` (845 B) | Nome do projeto, os 12 comandos `npm run` e as dependências. | o npm, a Action e todos os comandos do projeto | NÃO — só build | Não há projeto: nenhum comando corre. |
| `README.md` (4,4 KB) | A porta de entrada do repositório: o que é o site, a stack, como correr e como verificar. | quem abre o repositório no GitHub | NÃO — documentação | Quem chega ao repositório não sabe o que é aquilo nem como o pôr a correr. |
| `tsconfig.json` (114 B) | Estende o `astro/tsconfigs/strict` e liga o modo estrito do TypeScript. | o editor e o `astro check`/`astro build` | NÃO — só build | Perdem-se os tipos: um `t(texto, lang)` com a língua errada deixa de ser apanhado enquanto se escreve. |

## .github/workflows

A automação da publicação. É aqui que está a garantia de que uma verificação falhada
impede o site de ir ao ar: o workflow tem três jobs em cadeia — `verificar`, `build` e
`deploy` — e cada um só arranca se o anterior passar.

O job `verificar` faz o seu próprio `npm ci` e `npm run build`, e só depois corre o
`check:i18n` e o `check:texto`. Se um deles sair com erro, o `build` é saltado e o
`deploy` também: o site fica na versão anterior em vez de ser substituído por uma com
texto errado.

As auditorias de acessibilidade ficam fora do CI de propósito — precisam do Chromium,
que são 707 MB, e tornariam cada publicação lenta e sujeita a falhas intermitentes.

| Caminho | O que é | Quem o usa | Chega ao visitante? | O que parte sem ele |
|---|---|---|---|---|
| `.github/workflows/deploy.yml` (2,3 KB) | O workflow de publicação: `verificar` → `build` → `deploy`. | o GitHub Actions, a cada push para a `main` | NÃO — só build | O site deixa de ser publicado: um push para a `main` não faz nada, e o que está no ar congela na versão anterior. |

## assets/images

As imagens de origem, otimizadas pelo Astro ou lidas pelo gerador de imagens de
partilha. **Nenhuma destas chega ao visitante tal como está aqui**: a do hero é
convertida e renomeada pelo Astro, e as dos projetos servem apenas para compor as
imagens de `public/og/`.

Duas delas — `mrpizza.webp` e `dianearbus.webp`, juntas 834 KB — não são desenhadas em
lado nenhum do site: os dois projetos não têm case study e a lista de projetos não
mostra imagens. Ficam porque os dados as nomeiam e o build exige o ficheiro que os
dados nomeiam; tirá-las obrigava a mexer no `imageAlt`, que é texto aprovado.

A guarda `podar-assets-nao-referenciados` do `astro.config.mjs` garante que nenhuma
delas é servida por engano: o que ninguém referencia é retirado do `dist/` em cada
build.

| Caminho | O que é | Quem o usa | Chega ao visitante? | O que parte sem ele |
|---|---|---|---|---|
| `assets/images/ainet.jpg` (87,1 KB) | Screenshot do AINET, usado só para compor a imagem de partilha. | `src/content/projects/ainet.json` (campo `image`) e o `npm run og` | NÃO — só build | O build falha na guarda `verificarImagensDosProjetos`, que exige o ficheiro que os dados nomeiam. |
| `assets/images/avatar.jpg` (49,2 KB) | A fotografia do hero e do CV. | `src/components/Hero.astro` e `src/layouts/CvPage.astro`, pelo pipeline de imagem do Astro (as duas usam o mesmo ficheiro gerado) | SIM | O build falha no `Hero.astro` e no `CvPage.astro`, que importam este ficheiro pelo caminho. |
| `assets/images/dae.jpg` (88,1 KB) | Screenshot do DAE, para a imagem de partilha. | `src/content/projects/dae.json` (campo `image`) e o `npm run og` | NÃO — só build | O build falha na guarda `verificarImagensDosProjetos`. |
| `assets/images/dianearbus.webp` (283,6 KB) | Screenshot do Diane Arbus, na mesma situação do Mr. Pizza. | `src/content/projects/diane-arbus.json` (campo `image`) | NÃO — só build | O build falha na guarda `verificarImagensDosProjetos`, pelo mesmo motivo. |
| `assets/images/logo-gest.jpg` (97,8 KB) | Imagem do Gest, para a imagem de partilha. | `src/content/projects/gest.json` (campo `image`) e o `npm run og` | NÃO — só build | O build falha na guarda `verificarImagensDosProjetos`. |
| `assets/images/mrpizza.webp` (550,3 KB) | Screenshot do Mr. Pizza. Hoje não é desenhado em lado nenhum: o projeto não tem case study e a lista não mostra imagens. | `src/content/projects/mr-pizza.json` (campo `image`) | NÃO — só build | O build falha na guarda `verificarImagensDosProjetos`, porque os dados continuam a nomear o ficheiro. Para sair, teria de sair primeiro o campo `image` — e o `imageAlt` é texto aprovado. |
| `assets/images/ti.webp` (110,6 KB) | Screenshot do Hotel Inteligente, para a imagem de partilha. | `src/content/projects/hotel-inteligente.json` (campo `image`) e o `npm run og` | NÃO — só build | O build falha na guarda `verificarImagensDosProjetos`. |

## content

Uma pasta com um ficheiro só, e é o mais importante do projeto.

O `texto-canonico.json` é a fonte de verdade de **todo** o texto visível do site, nas
duas línguas: interface, projetos, case studies, SEO e `aria-label`. O texto não se
escreve nos componentes nem nos dados — entra aqui primeiro, copiado do enunciado em
que foi aprovado, e só depois passa para `src/i18n/`, `src/content/projects/` e `src/data/`.

Guarda também o que foi retirado, em `retirado.<fase>`, com o motivo. É o que permite
saber porque é que uma frase deixou de estar no site.

| Caminho | O que é | Quem o usa | Chega ao visitante? | O que parte sem ele |
|---|---|---|---|---|
| `content/texto-canonico.json` (134,3 KB) | A fonte de verdade de todo o texto visível do site, nas duas línguas, com o histórico do que foi retirado e porquê. | `scripts/check-texto.mjs`, `scripts/gerar-cv.mjs` e quem escreve texto novo | NÃO — só build | Deixa de haver como saber se o site diz o texto aprovado: o `npm run check:texto` e o `npm run cv` falham por falta de ficheiro, e a garantia de que nenhuma frase foi "melhorada" desaparece. |

## docs

A documentação viva: o estado detalhado do projeto, as licenças do material de
terceiros e este mapa. O inventário de limpeza, que era o quarto ficheiro desta pasta,
passou a `docs/historico/` a 2026-09-18 — é um registo datado, e quem inventaria o
projeto hoje é este mapa. A subpasta `docs/historico/`, com os relatórios de cada fase,
fica fora do mapa (ver o topo).

Nada aqui é servido ao visitante. Estes ficheiros existem para quem trabalha no
projeto — e, no caso do `LICENCAS.md`, para cumprir a licença MIT dos ícones, que
obriga a distribuir a atribuição com o material.

| Caminho | O que é | Quem o usa | Chega ao visitante? | O que parte sem ele |
|---|---|---|---|---|
| `docs/ESTADO-ATUAL.md` (44,7 KB) | O retrato detalhado do projeto: projetos, provas, verificações, o que está publicado e o que falta. | quem trabalha no projeto, e o `CLAUDE.md`, que lhe aponta | NÃO — documentação | Perde-se o estado: o que está no ar, o que cada verificação cobre e as decisões tomadas. |
| `docs/ESTRUTURA.md` (47,5 KB) | Este mapa: todos os ficheiros do projeto, fora das exclusões do topo, com o que são, quem os usa e o que parte sem eles. Refeito pelo `npm run mapa`. | quem precise de perceber o projeto sem o ler todo, e o `npm run mapa`, que o lê e reescreve | NÃO — documentação | Perde-se o mapa, e com ele as descrições que o `npm run mapa` guarda; descobrir quem usa cada ficheiro volta a ser trabalho de pesquisa. |
| `docs/LICENCAS.md` (2,6 KB) | A atribuição do material de terceiros: os dois ícones do Devicon (MIT) e a Poppins (SIL OFL). | quem precise de saber de onde veio o material; o `Icon.astro` e o `README.md` apontam para aqui | NÃO — documentação | O repositório volta a distribuir os ícones do Devicon sem a atribuição que a licença MIT exige. |

## public/assets/docs

Dois ficheiros: o CV em PDF, um por língua, servidos em `/assets/docs/CV.pdf` e
`/assets/docs/CV-en.pdf`.

Não se editam à mão: são gerados pelo `npm run cv` a partir das páginas `/cv/` e
`/en/cv/`, e o comando só os escreve se cada um tiver exatamente uma página, texto
extraível e o texto do canónico. Os PDF novos só chegam ao `dist/` no build seguinte.

| Caminho | O que é | Quem o usa | Chega ao visitante? | O que parte sem ele |
|---|---|---|---|---|
| `public/assets/docs/CV-en.pdf` (212,0 KB) | O CV em PDF, em inglês: uma folha A4, gerada pelo `npm run cv` a partir da página `/en/cv/`. | `src/data/site.json` (campo `cvPathEn`), ligado no botão "Download PDF" da página `/en/cv/` | SIM | O botão "Download PDF" da página `/en/cv/` dá 404, e o `check:texto` e o `audit:teclado` falham. |
| `public/assets/docs/CV.pdf` (212,8 KB) | O CV em PDF, em português: uma folha A4, gerada pelo `npm run cv` a partir da página `/cv/`. O caminho é o de sempre, para os links antigos continuarem a funcionar. | `src/data/site.json` (campo `cvPath`), ligado no botão "Descarregar PDF" da página `/cv/` | SIM | O botão "Descarregar PDF" da página `/cv/` dá 404, tal como qualquer link antigo para `/assets/docs/CV.pdf`; o `check:texto` e o `audit:teclado` falham. |

## public/assets/icons

Um ficheiro: o ícone do separador do browser.

| Caminho | O que é | Quem o usa | Chega ao visitante? | O que parte sem ele |
|---|---|---|---|---|
| `public/assets/icons/favicon.ico` (15,0 KB) | O ícone do separador do browser. | `src/layouts/BaseLayout.astro` | SIM | O separador do browser fica com o ícone genérico, e o pedido a `/assets/icons/favicon.ico` passa a dar 404. |

## public

O que é copiado tal e qual para o `dist/`, sem passar por nenhum processamento.

É a pasta mais perigosa de mexer: o `CNAME` é o que mantém o domínio próprio a
funcionar, e basta ele desaparecer para o site voltar ao endereço do GitHub no deploy
seguinte.

| Caminho | O que é | Quem o usa | Chega ao visitante? | O que parte sem ele |
|---|---|---|---|---|
| `public/CNAME` (20 B) | O domínio próprio, copiado tal e qual para o `dist/` em cada build. | o GitHub Pages, ao servir o site | SIM | O domínio franciscopereira.dev deixa de responder no próximo deploy: o site passa a estar só em francisco-pereira-dev.github.io. |
| `public/og-image.png` (45,7 KB) | A imagem de partilha geral: a que aparece quando se parte um link da página inicial ou de um case study sem screenshot. | `src/components/Seo.astro` (`og:image` por omissão) e o `npm run og`, que a gera | SIM | Partilhar o site no LinkedIn ou no WhatsApp passa a mostrar um cartão sem imagem. |
| `public/robots.txt` (84 B) | Diz aos motores de busca que podem indexar tudo e onde está o sitemap. | os motores de busca, em `/robots.txt` | SIM | O Google perde o apontador para o sitemap e passa a descobrir as 18 páginas só por links. |

## public/fonts

A Poppins auto-alojada, em WOFF2: quatro pesos × dois subconjuntos.

Estão aqui, e não no Google Fonts, por três razões: não há pedidos a terceiros nem
ligação a dois domínios, o visitante não é rastreado, e o site não fica dependente de
um serviço externo estar de pé.

Só o peso 400 latin tem `preload`, por ser o do corpo de texto; os outros são pedidos
pelo browser quando o `unicode-range` do `@font-face` diz que fazem falta.

| Caminho | O que é | Quem o usa | Chega ao visitante? | O que parte sem ele |
|---|---|---|---|---|
| `public/fonts/poppins-400-latin-ext.woff2` (5,5 KB) | Um peso da Poppins, no subconjunto latin-ext (acentos raros e símbolos). | `@font-face` em `src/styles/global.css` | SIM | O texto a 400 com acentos fora do latin básico passa a ser desenhado pela fonte de recurso do sistema, e o site muda de aspeto. |
| `public/fonts/poppins-400-latin.woff2` (7,7 KB) | Um peso da Poppins, no subconjunto latin. | `@font-face` em `src/styles/global.css`, com `preload` em `BaseLayout.astro` | SIM | O texto a 400 passa a ser desenhado pela fonte de recurso do sistema, e o site muda de aspeto. |
| `public/fonts/poppins-500-latin-ext.woff2` (5,4 KB) | Um peso da Poppins, no subconjunto latin-ext (acentos raros e símbolos). | `@font-face` em `src/styles/global.css` | SIM | O texto a 500 com acentos fora do latin básico passa a ser desenhado pela fonte de recurso do sistema, e o site muda de aspeto. |
| `public/fonts/poppins-500-latin.woff2` (7,6 KB) | Um peso da Poppins, no subconjunto latin. | `@font-face` em `src/styles/global.css` | SIM | O texto a 500 passa a ser desenhado pela fonte de recurso do sistema, e o site muda de aspeto. |
| `public/fonts/poppins-600-latin-ext.woff2` (5,4 KB) | Um peso da Poppins, no subconjunto latin-ext (acentos raros e símbolos). | `@font-face` em `src/styles/global.css` | SIM | O texto a 600 com acentos fora do latin básico passa a ser desenhado pela fonte de recurso do sistema, e o site muda de aspeto. |
| `public/fonts/poppins-600-latin.woff2` (7,8 KB) | Um peso da Poppins, no subconjunto latin. | `@font-face` em `src/styles/global.css` | SIM | O texto a 600 passa a ser desenhado pela fonte de recurso do sistema, e o site muda de aspeto. |
| `public/fonts/poppins-700-latin-ext.woff2` (5,3 KB) | Um peso da Poppins, no subconjunto latin-ext (acentos raros e símbolos). | `@font-face` em `src/styles/global.css` | SIM | O texto a 700 com acentos fora do latin básico passa a ser desenhado pela fonte de recurso do sistema, e o site muda de aspeto. |
| `public/fonts/poppins-700-latin.woff2` (7,6 KB) | Um peso da Poppins, no subconjunto latin. | `@font-face` em `src/styles/global.css` | SIM | O texto a 700 passa a ser desenhado pela fonte de recurso do sistema, e o site muda de aspeto. |

## public/og

As oito imagens de partilha dos case studies que têm screenshot: uma por língua, a
1200×630.

São geradas pelo `npm run og` e o caminho de cada uma é construído em execução, em
`ogImagemCaseStudy(slug, lang)` — não aparecem escritas em lado nenhum do código. Os
case studies sem screenshot usam a imagem geral, `public/og-image.png`.

| Caminho | O que é | Quem o usa | Chega ao visitante? | O que parte sem ele |
|---|---|---|---|---|
| `public/og/ainet-en.jpg` (63,7 KB) | Imagem de partilha de um case study, a 1200×630. | `ogImagemCaseStudy('ainet', 'en')` em `src/lib/caseStudy.ts`, usada no `og:image` dessa página | SIM | Partilhar o case study do ainet em inglês passa a mostrar a imagem geral do site em vez da imagem própria. |
| `public/og/ainet-pt.jpg` (64,5 KB) | Imagem de partilha de um case study, a 1200×630. | `ogImagemCaseStudy('ainet', 'pt')` em `src/lib/caseStudy.ts`, usada no `og:image` dessa página | SIM | Partilhar o case study do ainet em português passa a mostrar a imagem geral do site em vez da imagem própria. |
| `public/og/dae-en.jpg` (64,3 KB) | Imagem de partilha de um case study, a 1200×630. | `ogImagemCaseStudy('dae', 'en')` em `src/lib/caseStudy.ts`, usada no `og:image` dessa página | SIM | Partilhar o case study do dae em inglês passa a mostrar a imagem geral do site em vez da imagem própria. |
| `public/og/dae-pt.jpg` (63,9 KB) | Imagem de partilha de um case study, a 1200×630. | `ogImagemCaseStudy('dae', 'pt')` em `src/lib/caseStudy.ts`, usada no `og:image` dessa página | SIM | Partilhar o case study do dae em português passa a mostrar a imagem geral do site em vez da imagem própria. |
| `public/og/gest-en.jpg` (66,7 KB) | Imagem de partilha de um case study, a 1200×630. | `ogImagemCaseStudy('gest', 'en')` em `src/lib/caseStudy.ts`, usada no `og:image` dessa página | SIM | Partilhar o case study do gest em inglês passa a mostrar a imagem geral do site em vez da imagem própria. |
| `public/og/gest-pt.jpg` (65,5 KB) | Imagem de partilha de um case study, a 1200×630. | `ogImagemCaseStudy('gest', 'pt')` em `src/lib/caseStudy.ts`, usada no `og:image` dessa página | SIM | Partilhar o case study do gest em português passa a mostrar a imagem geral do site em vez da imagem própria. |
| `public/og/hotel-inteligente-en.jpg` (66,2 KB) | Imagem de partilha de um case study, a 1200×630. | `ogImagemCaseStudy('hotel-inteligente', 'en')` em `src/lib/caseStudy.ts`, usada no `og:image` dessa página | SIM | Partilhar o case study do hotel-inteligente em inglês passa a mostrar a imagem geral do site em vez da imagem própria. |
| `public/og/hotel-inteligente-pt.jpg` (70,5 KB) | Imagem de partilha de um case study, a 1200×630. | `ogImagemCaseStudy('hotel-inteligente', 'pt')` em `src/lib/caseStudy.ts`, usada no `og:image` dessa página | SIM | Partilhar o case study do hotel-inteligente em português passa a mostrar a imagem geral do site em vez da imagem própria. |

## scripts/auditoria

As duas auditorias de acessibilidade, versionadas desde a Fase 5.1 — antes disso eram
scripts descartáveis, e uma auditoria que não se pode repetir estraga-se na alteração
seguinte sem ninguém reparar.

Correm sobre o `dist/` e arrancam o servidor de pré-visualização sozinhas. Ficam
sempre fora do CI, por causa dos 707 MB do Chromium.

| Caminho | O que é | Quem o usa | Chega ao visitante? | O que parte sem ele |
|---|---|---|---|---|
| `scripts/auditoria/acessibilidade.mjs` (19,3 KB) | A auditoria de acessibilidade: axe, estrutura, contraste e o site sem JavaScript, nas 18 páginas, mais a grelha das competências e a impressão do CV. | o `npm run audit:a11y` | NÃO — só build | Deixa de haver como saber se uma alteração de CSS partiu o contraste ou a estrutura das 18 páginas, ou se o CV deixou de imprimir em branco. |
| `scripts/auditoria/comum.mjs` (6,5 KB) | As peças comuns às duas auditorias e ao gerador do CV: arranca o servidor, carrega o Playwright e mede contraste. | `scripts/auditoria/acessibilidade.mjs`, `teclado.mjs` e `scripts/gerar-cv.mjs` | NÃO — só build | As duas auditorias e o `npm run cv` deixam de arrancar: falham no import. |
| `scripts/auditoria/teclado.mjs` (15,1 KB) | A auditoria de teclado: percursos com Tab, contorno de foco, menu, modais, "?", atalhos e os dois botões do CV ("Ver CV" e "Descarregar PDF"). | o `npm run audit:teclado` | NÃO — só build | Deixa de haver como saber se o site continua a poder ser usado só com o teclado. |

## scripts

As ferramentas do projeto, nenhuma delas servida ao visitante.

Duas são redes de segurança que correm no CI e impedem uma publicação errada: o
`check-i18n.mjs` e o `check-texto.mjs`. As outras três geram ficheiros e correm à mão:
o `gerar-og.mjs` faz as imagens de partilha, o `gerar-cv.mjs` os dois PDF do CV, e o
`gerar-estrutura.mjs` este mapa.

| Caminho | O que é | Quem o usa | Chega ao visitante? | O que parte sem ele |
|---|---|---|---|---|
| `scripts/check-i18n.mjs` (3,0 KB) | Compara as chaves de `pt.json` e `en.json`, e apanha valores vazios ou por traduzir. | o `npm run check:i18n`, à mão e no job `verificar` da Action | NÃO — só build | Uma chave só em português deixa de ser apanhada, e a versão inglesa vai ao ar com um botão sem texto. |
| `scripts/check-texto.mjs` (43,2 KB) | Compara o texto canónico com o HTML gerado, string a string: 1026 verificações nas duas línguas, incluindo as duas páginas do CV (a ordem das secções e os pontos da experiência). | o `npm run check:texto`, à mão e no job `verificar` da Action | NÃO — só build | Deixa de haver como saber se o site diz o texto aprovado; uma frase trocada por engano passa a chegar ao ar sem aviso. |
| `scripts/gerar-cv.mjs` (25,7 KB) | Gera os dois PDF do CV a partir das páginas `/cv/` e `/en/cv/`, no tema escuro de propósito, com três guardas: uma página, texto extraível e o texto do canónico. Apaga as datas da geração, para o mesmo texto dar sempre os mesmos bytes. Traz um leitor de PDF mínimo, sem bibliotecas. | o `npm run cv`, à mão, depois do build | NÃO — só build | Não há como regenerar os PDF quando o texto do CV mudar, e deixa de haver prova de que o PDF cabe numa página e diz o texto aprovado. |
| `scripts/gerar-estrutura.mjs` (15,0 KB) | Refaz este mapa a partir do disco — a lista de ficheiros, os tamanhos, os totais e os resumos —, guardando as descrições escritas à mão. | o `npm run mapa` | NÃO — só build | O mapa volta a envelhecer: cada ficheiro novo tem de ser acrescentado e contado à mão, e foi assim que ficou desatualizado três fases seguidas. |
| `scripts/gerar-og.mjs` (13,1 KB) | Compõe as 9 imagens de partilha a 1200×630, desenhando o texto glifo a glifo. | o `npm run og` | NÃO — só build | Não há como regenerar as imagens de partilha depois de mudar o título de um projeto ou o screenshot. |

## scripts/fontes

As três TTF da Poppins que o gerador de imagens de partilha lê para desenhar texto
glifo a glifo.

São material de build e nunca são servidas: o site usa as WOFF2 de `public/fonts/`. A
guarda `garantir-que-as-ttf-nao-saem` faz o build falhar se alguma delas chegar ao
`dist/`.

| Caminho | O que é | Quem o usa | Chega ao visitante? | O que parte sem ele |
|---|---|---|---|---|
| `scripts/fontes/Poppins-Bold.ttf` (152,3 KB) | A Poppins bold, em TTF, para os títulos das imagens de partilha. | `scripts/gerar-og.mjs` | NÃO — só build | O `npm run og` falha ao desenhar o título de cada imagem. |
| `scripts/fontes/Poppins-Regular.ttf` (156,6 KB) | A Poppins regular, em TTF, só para o gerador de imagens. | `scripts/gerar-og.mjs` (`fonte('Poppins-Regular.ttf')`) | NÃO — só build | O `npm run og` falha: o domínio no rodapé das imagens de partilha deixa de poder ser desenhado. |
| `scripts/fontes/Poppins-SemiBold.ttf` (153,6 KB) | A Poppins semibold, em TTF, para o nome nas imagens de partilha. | `scripts/gerar-og.mjs` | NÃO — só build | O `npm run og` falha ao desenhar o nome. |

## src/components

Os catorze blocos que montam as páginas. Nenhum tem estado próprio nem lógica de
dados: recebem o que precisam por props e desenham HTML.

A divisão segue o que se vê no site — hero, sobre, competências, projetos, contactos,
rodapé — mais quatro peças de serviço: o `Icon.astro`, que embute os SVG; o
`SectionHeading.astro`, que desenha o título e a régua de cada secção; o `Seo.astro`,
que trata do `<head>`; e o `NavSemJs.astro`, que existe só para quem não tem
JavaScript.

| Caminho | O que é | Quem o usa | Chega ao visitante? | O que parte sem ele |
|---|---|---|---|---|
| `src/components/About.astro` (539 B) | A secção "Sobre mim": o cabeçalho e os dois parágrafos. | `src/layouts/PortfolioPage.astro` | SIM | A secção Sobre desaparece da página inicial, e o link "Sobre" do menu passa a não levar a lado nenhum. |
| `src/components/Contacts.astro` (2,0 KB) | A secção de contactos: três cartões iguais, com ícone, título e endereço. | `src/layouts/PortfolioPage.astro` | SIM | Deixa de haver como contactar o Francisco a partir do site. |
| `src/components/Footer.astro` (895 B) | O rodapé: o ano gerado no build e os três links. | `PortfolioPage.astro`, `CaseStudyPage.astro` e `CvPage.astro` | SIM | As 18 páginas ficam sem rodapé. |
| `src/components/Hero.astro` (1,5 KB) | O hero: a fotografia, o nome, a frase e as três ações — uma delas, "Ver CV", leva à página do CV. | `src/layouts/PortfolioPage.astro` | SIM | A primeira coisa que se vê no site desaparece, incluindo o botão do CV. |
| `src/components/Icon.astro` (1,5 KB) | Lê o SVG pedido de `src/icons/` e embute-o no HTML, já escondido dos leitores de ecrã. | `Contacts.astro` e `OverlayMenu.astro` | SIM | O build falha nos dois componentes que o chamam; sem ele, os ícones teriam de voltar a ser ficheiros pedidos ao servidor. |
| `src/components/Navbar.astro` (2,0 KB) | A barra do topo: o botão do menu, a marca, o seletor de idioma e o botão do tema. | `PortfolioPage.astro`, `CaseStudyPage.astro` e `CvPage.astro` | SIM | As 18 páginas ficam sem barra do topo: sem menu, sem troca de língua e sem troca de tema. |
| `src/components/NavSemJs.astro` (1,1 KB) | Os links de navegação para quem não tem JavaScript, no cabeçalho ou antes do rodapé. | `Navbar.astro`, `PortfolioPage.astro`, `CaseStudyPage.astro` e `CvPage.astro` | SIM | Quem desliga o JavaScript fica sem navegação nenhuma: os links de secção só existem dentro do menu, que precisa do script. |
| `src/components/OverlayMenu.astro` (2,1 KB) | O menu de ecrã inteiro, com os quatro links de secção e os ícones sociais. | `PortfolioPage.astro`, `CaseStudyPage.astro` e `CvPage.astro` | SIM | O botão do menu passa a abrir nada, e a navegação por secções desaparece para quem tem JavaScript. |
| `src/components/ProjectModal.astro` (2,4 KB) | A janela dos 2 projetos sem case study: título, características e links. | `src/layouts/PortfolioPage.astro` | SIM | O Mr. Pizza e o Diane Arbus ficam sem sítio nenhum onde mostrar as características e o link do Figma. |
| `src/components/ProjectRow.astro` (3,3 KB) | Uma linha da lista de projetos: número, título, etiqueta, frase, stack e ação. | `src/components/Projects.astro` | SIM | A lista de projetos fica vazia: desaparecem os 9 projetos da página inicial. |
| `src/components/Projects.astro` (1,0 KB) | A secção Projetos: o cabeçalho e a lista das 9 linhas, pela ordem fixada. | `src/layouts/PortfolioPage.astro` | SIM | A secção Projetos desaparece, e com ela o caminho para os 14 case studies. |
| `src/components/SectionHeading.astro` (436 B) | O cabeçalho de secção: o título e a régua roxa. | `About.astro`, `Contacts.astro`, `Projects.astro` e `Skills.astro` | SIM | As quatro secções da página inicial ficam sem título e sem régua. |
| `src/components/Seo.astro` (4,1 KB) | As etiquetas de `<head>`: título, descrição, canónico, hreflang, Open Graph, Twitter e o JSON-LD. | `BaseLayout.astro`, com o SEO próprio que `CaseStudyPage.astro` e `CvPage.astro` lhe passam | SIM | O site deixa de ter título e descrição nos resultados de pesquisa, e partilhar um link passa a mostrar um cartão vazio. |
| `src/components/Skills.astro` (3,2 KB) | A secção Competências: 4 grupos, 19 tecnologias e as 33 provas com link. | `src/layouts/PortfolioPage.astro` | SIM | Desaparece a secção que liga cada tecnologia ao projeto que a prova. |

## src

O código do site. O ficheiro solto é o schema: é ele que valida os 9 projetos e que
faz o build falhar quando um deles está mal.

| Caminho | O que é | Quem o usa | Chega ao visitante? | O que parte sem ele |
|---|---|---|---|---|
| `src/content.config.ts` (4,2 KB) | O schema Zod da collection dos projetos: o que cada JSON tem de ter, e o que não pode ter. | o Astro, ao carregar `src/content/projects/` | NÃO — só build | Os 9 projetos deixam de ser validados: um projeto `live` sem demo, ou uma imagem sem `alt`, passa a chegar ao site em vez de partir o build. |

## src/content/projects

Os 9 projetos, um ficheiro por projeto, validados pelo schema de `src/content.config.ts`.

Cada um traz o texto nas duas línguas e, nos 7 que têm, o case study inteiro — as sete
secções pela ordem fixa. É texto aprovado: entra aqui vindo do canónico e não se
reescreve.

O Astro carrega-os pela pasta, com `getCollection('projects')`: nenhum deles é
importado pelo nome em lado nenhum.

| Caminho | O que é | Quem o usa | Chega ao visitante? | O que parte sem ele |
|---|---|---|---|---|
| `src/content/projects/3d-analyzer.json` (12,6 KB) | Os dados de um projeto: título, etiqueta, frase, tecnologias, links, estado e, se tiver, o case study inteiro. | `getCollection('projects')` nas duas rotas `[slug].astro` e em `PortfolioPage.astro` | SIM | O projeto 3d-analyzer desaparece da lista de projetos, e as suas duas páginas de case study deixam de existir. |
| `src/content/projects/ainet.json` (9,3 KB) | Os dados de um projeto: título, etiqueta, frase, tecnologias, links, estado e, se tiver, o case study inteiro. | `getCollection('projects')` nas duas rotas `[slug].astro` e em `PortfolioPage.astro` | SIM | O projeto ainet desaparece da lista de projetos, e as suas duas páginas de case study deixam de existir. |
| `src/content/projects/cadflow-bank-system.json` (8,0 KB) | Os dados de um projeto: título, etiqueta, frase, tecnologias, links, estado e, se tiver, o case study inteiro. | `getCollection('projects')` nas duas rotas `[slug].astro` e em `PortfolioPage.astro` | SIM | O projeto cadflow-bank-system desaparece da lista de projetos, e as suas duas páginas de case study deixam de existir. |
| `src/content/projects/dae.json` (11,4 KB) | Os dados de um projeto: título, etiqueta, frase, tecnologias, links, estado e, se tiver, o case study inteiro. | `getCollection('projects')` nas duas rotas `[slug].astro` e em `PortfolioPage.astro` | SIM | O projeto dae desaparece da lista de projetos, e as suas duas páginas de case study deixam de existir. |
| `src/content/projects/diane-arbus.json` (2,3 KB) | Os dados de um projeto: título, etiqueta, frase, tecnologias, links, estado e, se tiver, o case study inteiro. | `getCollection('projects')` nas duas rotas `[slug].astro` e em `PortfolioPage.astro` | SIM | O projeto diane-arbus desaparece da lista de projetos. |
| `src/content/projects/gest.json` (8,8 KB) | Os dados de um projeto: título, etiqueta, frase, tecnologias, links, estado e, se tiver, o case study inteiro. | `getCollection('projects')` nas duas rotas `[slug].astro` e em `PortfolioPage.astro` | SIM | O projeto gest desaparece da lista de projetos, e as suas duas páginas de case study deixam de existir. |
| `src/content/projects/hotel-inteligente.json` (10,2 KB) | Os dados de um projeto: título, etiqueta, frase, tecnologias, links, estado e, se tiver, o case study inteiro. | `getCollection('projects')` nas duas rotas `[slug].astro` e em `PortfolioPage.astro` | SIM | O projeto hotel-inteligente desaparece da lista de projetos, e as suas duas páginas de case study deixam de existir. |
| `src/content/projects/licas.json` (10,8 KB) | Os dados de um projeto: título, etiqueta, frase, tecnologias, links, estado e, se tiver, o case study inteiro. | `getCollection('projects')` nas duas rotas `[slug].astro` e em `PortfolioPage.astro` | SIM | O projeto licas desaparece da lista de projetos, e as suas duas páginas de case study deixam de existir. |
| `src/content/projects/mr-pizza.json` (2,1 KB) | Os dados de um projeto: título, etiqueta, frase, tecnologias, links, estado e, se tiver, o case study inteiro. | `getCollection('projects')` nas duas rotas `[slug].astro` e em `PortfolioPage.astro` | SIM | O projeto mr-pizza desaparece da lista de projetos. |

## src/data

Três ficheiros de dados que não são conteúdo de projeto: os contactos e caminhos do
site, as competências com as provas, e o texto do CV.

O `skills.json` e o `cv.json` são gerados a partir do canónico. O `skills.json`
decide o que a secção Competências mostra: 19 tecnologias em 4 grupos, cada uma com as
provas e o destino de cada prova.

| Caminho | O que é | Quem o usa | Chega ao visitante? | O que parte sem ele |
|---|---|---|---|---|
| `src/data/cv.json` (7,5 KB) | O texto do CV nas duas línguas: nome, cargo, resumo, projetos, experiência, educação, competências, idiomas e interesses. Gerado a partir da secção `cv` do canónico. | `src/layouts/CvPage.astro` | SIM | O build falha no import e as duas páginas do CV deixam de existir — e com elas os PDF, que o `npm run cv` gera a partir delas. |
| `src/data/site.json` (494 B) | O nome, o email, os endereços do GitHub e do LinkedIn, e os caminhos dos dois PDF do CV (`cvPath` e `cvPathEn`). | `Contacts.astro`, `Footer.astro`, `OverlayMenu.astro`, `Seo.astro`, `Skills.astro`, `CaseStudyPage.astro`, `CvPage.astro`, `src/lib/cv.ts`, `scripts/check-texto.mjs`, `scripts/gerar-cv.mjs` e `scripts/auditoria/teclado.mjs` | SIM | O build falha: desaparecem os contactos, os links do rodapé e os caminhos dos PDF do CV. |
| `src/data/skills.json` (3,9 KB) | As 19 tecnologias em 4 grupos, cada uma com as provas e o destino de cada prova. | `src/components/Skills.astro` e `scripts/check-texto.mjs` | SIM | A secção Competências fica vazia e o build falha no import. |

## src/i18n

Os textos de interface nas duas línguas e as funções que escolhem a variante certa.

Os dois JSON têm de ter exatamente as mesmas chaves — 63 de cada lado — e é o
`npm run check:i18n` que o garante. Uma chave só em português seria um botão sem texto
na versão inglesa.

| Caminho | O que é | Quem o usa | Chega ao visitante? | O que parte sem ele |
|---|---|---|---|---|
| `src/i18n/en.json` (3,4 KB) | Os mesmos 63 textos em inglês. | `src/i18n/index.ts`, `scripts/check-i18n.mjs` e `scripts/check-texto.mjs` | SIM | A versão inglesa fica sem interface, e o build falha no import. |
| `src/i18n/index.ts` (765 B) | Os tipos das línguas e as funções `t()`, `localeHref` e `otherLang`. | 16 componentes e layouts, `src/lib/caseStudy.ts` e `src/lib/cv.ts` | NÃO — só build | O build falha em todos os componentes: não há como escolher a variante certa de um texto bilingue. |
| `src/i18n/pt.json` (3,5 KB) | Os 63 textos de interface em português: botões, títulos de secção e `aria-label`. | `src/i18n/index.ts`, `scripts/check-i18n.mjs` e `scripts/check-texto.mjs` | SIM | A versão portuguesa fica sem interface: botões e títulos desaparecem, e o build falha no import. |

## src/icons

Os dois únicos ícones do projeto, do Devicon, com as cores de marca substituídas por
`currentColor` para herdarem a cor do texto.

Eram quinze até à Fase 5.3, quando os treze que ninguém usava foram apagados. São
embutidos no HTML pelo `Icon.astro`, e por isso não custam um pedido ao servidor.

A atribuição e o texto da licença MIT estão em `docs/LICENCAS.md`.

| Caminho | O que é | Quem o usa | Chega ao visitante? | O que parte sem ele |
|---|---|---|---|---|
| `src/icons/github-original.svg` (1,8 KB) | O ícone do GitHub, do Devicon (MIT — ver `docs/LICENCAS.md`). | `src/components/Icon.astro`, chamado por `Contacts.astro` e `OverlayMenu.astro` | SIM | O build falha com "não existe src/icons/github-original.svg": o `Icon.astro` recusa um nome que não encontra. |
| `src/icons/linkedin-plain.svg` (459 B) | O ícone do LinkedIn, do Devicon (MIT — ver `docs/LICENCAS.md`). | `src/components/Icon.astro`, chamado por `Contacts.astro` e `OverlayMenu.astro` | SIM | O build falha com "não existe src/icons/linkedin-plain.svg". |

## src/layouts

As quatro cascas: a do documento, a da página inicial, a das páginas de case study e a
do CV.

O `BaseLayout.astro` é o único sítio onde está o `<head>`, o script que aplica o tema
antes da primeira pintura e o link de saltar para o conteúdo. Os outros três montam o
corpo de cada tipo de página.

| Caminho | O que é | Quem o usa | Chega ao visitante? | O que parte sem ele |
|---|---|---|---|---|
| `src/layouts/BaseLayout.astro` (4,3 KB) | A casca de todas as páginas: `<head>`, o script do tema, o link de saltar, o SEO e a seta de voltar ao topo. | `PortfolioPage.astro`, `CaseStudyPage.astro` e `CvPage.astro` | SIM | O build falha nas 18 páginas: não há `<html>`, nem tema, nem SEO. |
| `src/layouts/CaseStudyPage.astro` (6,0 KB) | Monta uma página de case study: as secções pela ordem fixa, os links e o SEO próprio. | as duas rotas `[slug].astro` | SIM | As 14 páginas de case study ficam vazias. |
| `src/layouts/CvPage.astro` (8,0 KB) | Monta a página do CV numa língua: o nome, a linha pessoal e a fotografia, os três links, o resumo e as seis secções, com SEO próprio e o botão de descarregar o PDF. | `src/pages/cv.astro` e `src/pages/en/cv.astro` | SIM | As duas páginas do CV ficam vazias, e o `npm run cv` deixa de ter de onde gerar os PDF. |
| `src/layouts/PortfolioPage.astro` (2,0 KB) | Monta a página inicial inteira, numa língua: hero, Sobre, Competências, Projetos, Contactos e as 2 modais. | `src/pages/index.astro` e `src/pages/en/index.astro` | SIM | As duas páginas iniciais ficam vazias. |

## src/lib

Três ficheiros pequenos de apoio: as rotas dos case studies, as do CV e o tipo das props
de SEO.

O `caseStudy.ts` é o sítio único onde se decide que um case study vive em
`/projetos/<slug>/` em português e em `/en/projects/<slug>/` em inglês — e onde se
constrói o caminho da imagem de partilha.

| Caminho | O que é | Quem o usa | Chega ao visitante? | O que parte sem ele |
|---|---|---|---|---|
| `src/lib/caseStudy.ts` (1,3 KB) | As rotas dos case studies, o caminho das imagens de partilha e dois ajudantes de texto (um deles, `resumir`, faz também a meta description do CV). | `ProjectRow.astro`, `Skills.astro`, `CaseStudyPage.astro` e `CvPage.astro` (o `check-texto.mjs`, o `gerar-og.mjs` e o `astro.config.mjs` repetem os padrões, sem o importar) | NÃO — só build | O build falha: as 14 páginas de case study não sabem em que endereço vivem. |
| `src/lib/cv.ts` (495 B) | As rotas do CV (`/cv/` e `/en/cv/`) e o caminho do PDF de cada língua, lido do `site.json`. | `src/components/Hero.astro` e `src/layouts/CvPage.astro` (o `check-texto.mjs` e o `gerar-cv.mjs` repetem os padrões, sem o importar) | NÃO — só build | O build falha: o botão "Ver CV" do hero e a página do CV não sabem para onde apontar. |
| `src/lib/seo.ts` (611 B) | O tipo das props de SEO por página. | `Seo.astro`, `BaseLayout.astro`, `CaseStudyPage.astro` e `CvPage.astro` | NÃO — só build | O build falha nos quatro ficheiros que importam o tipo. |

## src/pages

As rotas em português: a página inicial, o CV e, na subpasta, as 7 páginas de case study.

| Caminho | O que é | Quem o usa | Chega ao visitante? | O que parte sem ele |
|---|---|---|---|---|
| `src/pages/cv.astro` (103 B) | A rota `/cv/`: o CV em português. | o Astro, por rotas de ficheiro | SIM | A página `/cv/` deixa de existir: o "Ver CV" do hero passa a dar 404, e o `npm run cv` falha por não a encontrar. |
| `src/pages/index.astro` (158 B) | A rota `/`: a página inicial em português. | o Astro, por rotas de ficheiro | SIM | A página inicial em português deixa de existir: franciscopereira.dev passa a dar 404. |

## src/pages/en

As mesmas rotas em inglês, sob `/en/`. A estrutura é igual à portuguesa, de propósito:
cada língua é HTML estático indexável, com `hreflang`, e não uma troca em JavaScript.

| Caminho | O que é | Quem o usa | Chega ao visitante? | O que parte sem ele |
|---|---|---|---|---|
| `src/pages/en/cv.astro` (109 B) | A rota `/en/cv/`: o CV em inglês. | o Astro, por rotas de ficheiro | SIM | A página `/en/cv/` deixa de existir: o "View CV" do hero inglês passa a dar 404, e o `npm run cv` falha por não a encontrar. |
| `src/pages/en/index.astro` (124 B) | A rota `/en/`: a página inicial em inglês. | o Astro, por rotas de ficheiro | SIM | A página inicial em inglês deixa de existir, e o seletor de idioma passa a levar a um 404. |

## src/pages/en/projects

A rota dinâmica que gera as 7 páginas de case study em inglês.

| Caminho | O que é | Quem o usa | Chega ao visitante? | O que parte sem ele |
|---|---|---|---|---|
| `src/pages/en/projects/[slug].astro` (540 B) | As 7 rotas `/en/projects/<slug>/`. | o Astro, por rotas de ficheiro, com `getStaticPaths` | SIM | Os 7 case studies em inglês deixam de existir, e os "Read more" passam a dar 404. |

## src/pages/projetos

A rota dinâmica que gera as 7 páginas de case study em português.

| Caminho | O que é | Quem o usa | Chega ao visitante? | O que parte sem ele |
|---|---|---|---|---|
| `src/pages/projetos/[slug].astro` (534 B) | As 7 rotas `/projetos/<slug>/`. | o Astro, por rotas de ficheiro, com `getStaticPaths` | SIM | Os 7 case studies em português deixam de existir, e os botões "Ver mais" passam a dar 404. |

## src/scripts

Um ficheiro: todo o comportamento do site.

São 271 linhas sem dependências nenhumas, carregadas em todas as páginas. Fazem o menu,
o tema, as modais, os botões "?", a animação de entrada, o scrollspy, o seletor de
idioma e a seta de voltar ao topo — e todas as partes têm guardas, porque nas páginas de
case study metade dos elementos não existe.

| Caminho | O que é | Quem o usa | Chega ao visitante? | O que parte sem ele |
|---|---|---|---|---|
| `src/scripts/main.js` (10,4 KB) | Todo o comportamento do site: menu, tema, modais, botões "?", animação de entrada, scrollspy, seletor de idioma e seta de voltar ao topo. | `src/layouts/BaseLayout.astro` | SIM | O site fica como se não houvesse JavaScript: sem menu, sem troca de tema, sem modais e sem seta — o conteúdo continua todo visível, mas os controlos desaparecem. |

## src/styles

Três ficheiros de CSS, escritos à mão, sem framework.

O `global.css` tem os tokens — as cores dos dois temas, a escala de texto e a de espaço
— e os estilos de tudo o que não é case study nem CV. O `case-study.css` só é carregado
nas 14 páginas de case study, e o `cv.css` só nas duas do CV.

| Caminho | O que é | Quem o usa | Chega ao visitante? | O que parte sem ele |
|---|---|---|---|---|
| `src/styles/case-study.css` (4,0 KB) | Os estilos só das 14 páginas de case study: a coluna de leitura, as secções e a caixa do "o que correu mal". | `src/layouts/CaseStudyPage.astro` | SIM | As páginas de case study perdem a largura de leitura e passam a texto a toda a largura do ecrã. |
| `src/styles/cv.css` (11,9 KB) | Os estilos só das duas páginas do CV: no ecrã, com os tokens e os dois temas; e o bloco de impressão, com as medidas em pt que põem o CV numa folha A4 sempre branca. | `src/layouts/CvPage.astro` | SIM | A página do CV perde a coluna, a grelha das competências e os acentos, e o PDF passa a sair com a navegação, o rodapé, as cores do tema e mais de uma página — que o `npm run cv` recusa. |
| `src/styles/global.css` (43,3 KB) | Os tokens (cores, escalas de texto e de espaço) e os estilos de tudo o que não é case study nem CV. | `src/layouts/BaseLayout.astro` e `src/styles/case-study.css` | SIM | O site fica sem estilos: texto preto sobre branco, sem grelha, sem temas. |

## Resumo 1 — por destino

| Destino | Ficheiros | Tamanho |
|---|---:|---:|
| **Chegam ao visitante** (servidos a quem abre o site, ou transformados no que é servido) | 67 | 1326,5 KB |
| **Só build** (ferramentas, configuração, dados de origem) | 30 | 2121,7 KB |
| **Documentação** | 5 | 135,7 KB |
| **Total** | 102 | 3584,0 KB |

Atenção a uma diferença que os números escondem: os 67 ficheiros que "chegam ao visitante" pesam 1326,5 KB **no repositório**, não na ligação de quem abre o site. O `dist/` do último build tem 45 ficheiros e 1 515 KB, e uma visita à página inicial pede cinco ficheiros: o HTML, o CSS, a fonte 400, o avatar e o favicon.

## Resumo 2 — os 10 maiores

| Ficheiro | Tamanho | Chega ao visitante? |
|---|---:|---|
| `assets/images/mrpizza.webp` | 550,3 KB | NÃO — só build |
| `assets/images/dianearbus.webp` | 283,6 KB | NÃO — só build |
| `public/assets/docs/CV.pdf` | 212,8 KB | SIM |
| `public/assets/docs/CV-en.pdf` | 212,0 KB | SIM |
| `scripts/fontes/Poppins-Regular.ttf` | 156,6 KB | NÃO — só build |
| `scripts/fontes/Poppins-SemiBold.ttf` | 153,6 KB | NÃO — só build |
| `scripts/fontes/Poppins-Bold.ttf` | 152,3 KB | NÃO — só build |
| `package-lock.json` | 149,0 KB | NÃO — só build |
| `content/texto-canonico.json` | 134,3 KB | NÃO — só build |
| `assets/images/ti.webp` | 110,6 KB | NÃO — só build |

Os três primeiros valem 29% do repositório. Dos dez, chegam ao visitante `CV.pdf` e `CV-en.pdf`.
As duas `.webp` da lista não chegam a ser desenhadas em lado nenhum do site.

## Resumo 3 — ficheiros que não partem nada

**Nenhum.** Os 102 ficheiros têm todos uma consequência concreta se
desaparecerem, e está escrita na última coluna de cada tabela.

Os dois casos que mais se aproximam de "não parte nada" são o `assets/images/mrpizza.webp`
e o `assets/images/dianearbus.webp`: não são desenhados em nenhuma página, e nem sequer
chegam ao `dist/`. Mas apagá-los **parte o build hoje**, porque a guarda
`verificarImagensDosProjetos` exige o ficheiro que o campo `image` dos dados nomeia. Não
são código morto: são código adormecido, à espera de uma decisão sobre os dados.
