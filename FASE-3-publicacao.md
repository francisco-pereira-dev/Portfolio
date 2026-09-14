# Fase 3 — Publicação: três correções, imagens de partilha e deploy

Fecha e publica a Fase 3. Três afirmações dos case studies foram corrigidas, os
quatro case studies com screenshot passaram a ter uma imagem de partilha
própria, e os 12 commits locais foram enviados. O site em franciscopereira.dev
serve agora as 14 páginas.

## Correções de texto

Cada texto entrou primeiro em `content/texto-canonico.json`, com a fonte
`publicacao-2026-09-14`. Os JSON dos projetos foram gerados a partir dele, e um
script confirmou que o `caseStudy` de cada um ficou idêntico ao do canónico.
Nenhum outro texto mudou.

| Onde | Antes | Depois |
|---|---|---|
| AINET · `resultado` PT | Aplicação funcional, com demonstração publicada, entregue dentro do prazo. | Aplicação funcional, com demonstração publicada. |
| AINET · `resultado` EN | A working application, with a published demo, delivered on time. | A working application, with a published demo. |
| 3D Analyzer · decisão 4, título | Leitura em streaming, com memória constante / Streaming parsing, with constant memory | Leitura de STL em streaming, com memória constante / Streaming STL parsing, with constant memory |
| 3D Analyzer · decisão 4, texto | O ficheiro é percorrido triângulo a triângulo… | Os ficheiros STL são percorridos triângulo a triângulo… (PT e EN, como no enunciado) |
| 3D Analyzer · `correuMal` ¶1 | …Numa esfera, o erro é de quase metade, sempre a mais. / …For a sphere the error is nearly half, always on the high side. | …Numa esfera, a caixa dá quase o dobro do volume real. / …For a sphere, the box gives nearly twice the real volume. |

Os outros três parágrafos do `correuMal` ficaram iguais. O `check:texto`
compara-os, parágrafo a parágrafo, com o canónico.

**Prova de que o `check:texto` cobre as três correções:** repus no `dist` o texto
antigo em três sítios:

- o `resultado` PT do AINET;
- o título EN da decisão 4;
- o ¶1 PT do `correuMal`.

Deu 3 divergências, as três esperadas, e depois do rebuild voltou a zero.

## Imagens de partilha

O `scripts/gerar-og.mjs` (`npm run og`) continua a gerar a `og-image.png` geral,
que ficou igual byte a byte. Passou também a gerar uma imagem por língua para
cada projeto com case study e screenshot:

- o fundo, o gradiente, o brilho e a barra de acento da imagem geral;
- o título do projeto em contornos Poppins, pelo mesmo método;
- o screenshot à direita, encaixado com `fit: 'inside'` numa caixa de 580×450,
  sem nunca ampliar, com cantos arredondados, moldura fina e sombra;
- `franciscopereira.dev` com a régua, na mesma posição da imagem geral.

| Ficheiro | Dimensões | Tamanho |
|---|---|---:|
| `public/og/dae-pt.jpg` | 1200×630 | 63,9 KB |
| `public/og/dae-en.jpg` | 1200×630 | 64,3 KB |
| `public/og/ainet-pt.jpg` | 1200×630 | 64,5 KB |
| `public/og/ainet-en.jpg` | 1200×630 | 63,7 KB |
| `public/og/gest-pt.jpg` | 1200×630 | 65,5 KB |
| `public/og/gest-en.jpg` | 1200×630 | 66,7 KB |
| `public/og/hotel-inteligente-pt.jpg` | 1200×630 | 70,5 KB |
| `public/og/hotel-inteligente-en.jpg` | 1200×630 | 66,2 KB |

São uma por língua porque o título muda: "Hotel Inteligente - Plataforma IoT"
em PT e "Smart Hotel - IoT Platform" em EN. O nome é `og/<slug>-<pt|en>.jpg`,
definido em `ogImagemCaseStudy()` (`src/lib/caseStudy.ts`) e repetido no gerador.
Saem em JPEG com qualidade 88 e croma 4:4:4, para o texto a cor de acento não
esborratar.

**Duas decisões que deves saber:**

- **O título aparece partido no " - ".** O nome vai em destaque ("DAE") e o
  resto por baixo, a cor de acento ("Arquitetura Full-Stack & IA"), como o nome
  e o papel na imagem geral. O hífen separador não é desenhado. As palavras são
  exatamente as do título. Em EN, o "& AI" do DAE cai para a segunda linha.
- **Mr. Pizza e Diane Arbus têm screenshot, mas não têm imagem.** Não têm página
  de case study, por isso uma imagem para eles não era usada por nenhuma página.

**Ligação às páginas.** O `CaseStudyPage.astro` deixou de usar o `getImage`, que
era o que ampliava de 1024 para 1200. Um projeto com screenshot aponta agora o
`og:image` e o `twitter:image` para a sua imagem, com as dimensões verdadeiras
(1200×630). Se a imagem não existir, o build falha com `falta public/og/… —
corre npm run og`, em vez de publicar um `og:image` partido. Licas e 3D Analyzer
continuam com a `og-image.png`. O `og:image:alt` é o `imageAlt` do projeto, como
antes.

**O gerador mede o que desenha.** Compara os pixéis do fundo com os da imagem
composta. Os pixéis que o screenshot mudou têm de ocupar exatamente o retângulo
previsto, e a proporção tem de bater com a do original. Se não baterem, o
gerador falha. Isto resolve a nota da 3.3-final sobre a ampliação de 1024 para 1200.

## Verificação antes do push

| # | Critério | Resultado |
|---|---|---|
| 1 | `npm run build` | ✅ exit 0, 14 páginas |
| 2 | `npm run check:i18n` | ✅ OK |
| 3 | `npm run check:texto` cobre as três correções | ✅ 886 verificações, zero divergências; testado por sabotagem (3/3) |
| 4 | Zero "entregue dentro do prazo", "delivered on time", "quase metade", "nearly half" | ✅ 0 / 0 / 0 / 0 ficheiros |
| 5 | Zero "O ficheiro é percorrido triângulo a triângulo" | ✅ 0 |
| 6 | Imagens com 1200×630 e abaixo de 300 KB | ✅ as 8 da tabela acima; a maior tem 70,5 KB; as do `dist` são iguais byte a byte às de `public/` |
| 7 | Cada página aponta para a imagem certa | ✅ ver abaixo |
| 8 | Screenshot sem distorção | ✅ ver abaixo |
| 9 | Nenhum ficheiro do `dist` acima de 500 KB | ✅ 51 ficheiros; o maior é o `CV.pdf`, com 380 KB |
| 10 | Zero links partidos | ✅ 14 páginas, 248 `href`/`src` internos (43 distintos), 84 com âncora; nenhum partido e nenhuma âncora morta |

**Critério 7, lido do HTML gerado.** O `og:image` e o `twitter:image` são iguais
em todas as páginas, com `og:image:width`/`height` a 1200/630:

| Página | Imagem |
|---|---|
| `/`, `/en/` | `/og-image.png` |
| `/projetos/licas/`, `/en/projects/licas/` | `/og-image.png` |
| `/projetos/3d-analyzer/`, `/en/projects/3d-analyzer/` | `/og-image.png` |
| `/projetos/dae/`, `/en/projects/dae/` | `/og/dae-pt.jpg`, `/og/dae-en.jpg` |
| `/projetos/ainet/`, `/en/projects/ainet/` | `/og/ainet-pt.jpg`, `/og/ainet-en.jpg` |
| `/projetos/gest/`, `/en/projects/gest/` | `/og/gest-pt.jpg`, `/og/gest-en.jpg` |
| `/projetos/hotel-inteligente/`, `/en/projects/hotel-inteligente/` | `/og/hotel-inteligente-pt.jpg`, `/og/hotel-inteligente-en.jpg` |

**Critério 8, medido duas vezes:**

1. **No gerador, antes de codificar.** Os pixéis mudados pelo screenshot ocupam
   exatamente o retângulo previsto.
2. **No JPEG publicado, de forma independente.** Fixei a largura em 580 e
   procurei, entre 8 px abaixo e 8 px acima da altura proporcional, a altura em
   que o original redimensionado mais se parece com o que está na imagem. Se o
   screenshot estivesse esticado, o melhor encaixe cairia noutra altura.

| Projeto | Original | Encaixado | Proporção | Desvio | Erro médio no melhor / no pior encaixe |
|---|---|---|---|---:|---|
| DAE | 1024×572 (1,7902) | 580×324 | 1,7901 | 0,00% | 2,73 / 8,34 |
| AINET | 1024×572 (1,7902) | 580×324 | 1,7901 | 0,00% | 2,71 / 6,25 |
| Gest | 1024×572 (1,7902) | 580×324 | 1,7901 | 0,00% | 2,63 / 7,31 |
| Hotel Inteligente | 1400×788 (1,7766) | 580×326 | 1,7791 | 0,14% | 2,97 / 7,45 |

Nas oito imagens, o melhor encaixe é a altura proporcional. Os 0,14% do Hotel
vêm do arredondamento ao píxel: a altura exata seria 326,4 px.

## Publicação

Com os 10 critérios verdes, o push enviou os 12 commits: `3310680..f28fb62`.
Antes do push, a `origin/main` não tinha nada que não estivesse cá.

## Verificação depois do deploy

| # | Verificação | Resultado |
|---|---|---|
| 1 | Action | ✅ Deploy to GitHub Pages, run 34842761576: Build e Deploy com `success` |
| 2 | As 14 páginas | ✅ todas 200, e o HTML publicado é igual byte a byte ao `dist` local |
| 3 | Case study do Licas | ✅ `/projetos/licas/` e `/en/projects/licas/` com `h1`, `umaFrase`, 7/7 secções e 4/4 decisões |
| 4 | Links externos, com User-Agent de browser | ✅ zero 404; ver abaixo |
| 5 | Sitemap publicado | ✅ 14 páginas, as mesmas 14 do `dist` |
| 6 | Domínio | ✅ ver abaixo |
| 7 | Browser, nas duas línguas | ✅ ver abaixo, com uma limitação do ambiente |

Nas páginas publicadas também confirmei:

- os 8 textos corrigidos estão presentes;
- as 5 frases antigas não aparecem em nenhuma das 14 páginas;
- as 9 imagens de partilha respondem 200 com o tipo certo, iguais byte a byte às locais.

**Links externos.** São 20 distintos:

- os 14 do GitHub e os 2 do Figma responderam 200;
- o LinkedIn respondeu 999, o bloqueio anti-scraping já conhecido;
- as três demonstrações no Render (AINET, DAE e Hotel Inteligente) responderam
  503 no primeiro pedido.

O 503 era o arranque a frio do plano gratuito, que o site já assinala com
`coldStart`. Repeti os pedidos um minuto depois e as três responderam 200 à primeira.

**Domínio:**

- o `/CNAME` publicado responde `franciscopereira.dev`;
- `francisco-pereira-dev.github.io/Portfolio/` e `http://franciscopereira.dev/`
  redirecionam com 301 para `https://franciscopereira.dev/`;
- o certificado é da Let's Encrypt (YR1) para `franciscopereira.dev` e
  `www.franciscopereira.dev`, válido de 29/07/2026 a 27/10/2026, e o `openssl`
  verifica-o sem erros;
- não toquei nas definições do GitHub Pages.

**Browser, em franciscopereira.dev, nas duas línguas:**

- **Modais:** as 9 abrem com "Ver Mais" / "Read more", cada uma com o seu
  projeto, e fecham com Escape ou com o ×. Nas duas línguas os 6 case studies
  têm botão, com o destino da língua certa.
- **Tema:** alterna nos dois sentidos e fica guardado (`light` / `dark`). O
  fundo muda de `rgb(15,23,42)` para `rgb(248,250,252)` e volta.
- **Menu:** abre, mostra as quatro secções com o rótulo da língua e fecha ao
  seguir um link. O link leva a secção ao topo, a 0 px.
- **Idioma:** PT → EN → PT, levando a âncora. No case study do DAE, leva à
  mesma página na outra língua, com os títulos das secções traduzidos e o
  `og:image` dessa língua.
- **Página inicial ↔ case study:** o botão do cartão abre o case study; os dois
  links de volta vão para `/#projects` ou `/en/#projects`.
- **Consola:** zero mensagens, e zero erros, em todas as páginas visitadas:
  `/`, `/en/`, `/projetos/dae/`, `/en/projects/dae/` e `/projetos/gest/`.

**Limitação do ambiente de teste.** O painel do browser correu escondido
(`visibilityState: hidden`, zero frames de animação), e o site usa
`scroll-behavior: smooth`. Assim, o scroll suave não avança e as primeiras
medições deram a página parada no topo.

- **Menu:** testei-o desligando o scroll suave só nesse separador, e cada link
  levou a secção ao topo exato.
- **Link de volta do case study:** não o consegui medir. Muda de página, e a
  página nova carrega com o scroll suave outra vez. Está verificado que o
  `href` é `/#projects` e que o `id="projects"` existe no destino, mas não vi a
  página a descer até lá.

## Commits desta fase

1. `949a93b` Corrigir três afirmações nos case studies do AINET e do 3D Analyzer
2. `f28fb62` Gerar imagens de partilha próprias para os case studies com screenshot
3. este relatório
