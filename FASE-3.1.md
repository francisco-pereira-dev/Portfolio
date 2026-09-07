# Fase 3.1 — Textos de interface e camada de SEO

Substituição de todo o texto de interface e construção da camada de SEO, que não
existia. A content collection dos projetos não foi tocada.

## Chaves de i18n

De 31 para **46 chaves** em cada língua. Paridade PT/EN verificada.

### Novas (17)

| Chave | Para quê |
|---|---|
| `hero-badge` | Badge de disponibilidade |
| `hero-paragraph` | Parágrafo do hero, abaixo do subtítulo |
| `hero-btn-projects` | CTA primário |
| `about-p1` … `about-p5` | Os 5 parágrafos do Sobre, um por chave |
| `skills-group-languages` | Título do grupo Linguagens |
| `skills-group-frameworks` | Título do grupo Frameworks e bibliotecas |
| `skills-group-data` | Título do grupo Dados |
| `skills-group-tools` | Título do grupo Ferramentas e plataformas |
| `skills-proof-all` | Rótulo da prova do Git — ver decisão abaixo |
| `contacts-text` | Parágrafo dos contactos |
| `footer-github` | Rótulo do link GitHub no rodapé |
| `footer-linkedin` | Rótulo do link LinkedIn no rodapé |
| `footer-source` | "Código deste site" / "Source code" |

### Removidas (2)

| Chave | Porquê |
|---|---|
| `about-text` | O Sobre passou de um parágrafo para cinco |
| `footer-text` | Continha a afirmação falsa "Desenvolvido com HTML, CSS & JavaScript"; o rodapé passou a ser estruturado |

### Alteradas (6)

`hero-title`, `hero-subtitle`, `hero-btn-contact`, `contacts-heading`, `meta-title`,
`meta-description`. Os valores são exatamente os do enunciado.

### Inalteradas

`overlay-*`, `about-heading`, `skills-heading`, `projects-heading`,
`project-btn-view-more`, `contact-title-*`, `modal-*`, `nav-brand`, `a11y-*`.

## Competências: como e porquê

Quatro cartões, um por grupo, numa grelha que dá **2×2 no desktop e uma coluna no
telemóvel**. Dentro de cada cartão, uma linha por tecnologia: o nome em cima, os
links de prova por baixo, como chips.

A alternativa era uma tabela, mas com 19 tecnologias e até três provas cada, uma
tabela obrigava a scroll horizontal no telemóvel. Os cartões agrupados reaproveitam
o `.skill-card` que já existia — incluindo a borda de acento e a animação em
cascata do `IntersectionObserver`, que continuou a funcionar sem tocar no
JavaScript, porque mantive o `id="skills-grid-container"` e a classe `.skill-card`.

**O link de prova é o conteúdo da secção, não decoração.** Cada chip é um `<a>`
visível para `github.com/francisco-pereira-dev/<repo>`, aberto em separador novo.
Nada em tooltip.

Os ícones devicon saíram das competências. A secção deixou de ser uma lista de
logótipos e passou a ser uma lista de provas, e não havia ícone para MFC, REST
APIs ou OutSystems — metade das entradas ficaria coxa. Os SVG continuam em
`src/icons/` e são usados nos contactos e no menu; são dados de build e não vão
para o `dist`.

### Duas decisões que tomei

**`Git -> todos`.** "todos" não é um repositório. Renderizei-o como link para o
perfil do GitHub, que é onde estão todos, com o rótulo na chave `skills-proof-all`
("todos" / "all"). A alternativa era texto sem link, mas o critério pede prova
clicável.

**`HTML5, CSS3` ficou como uma entrada só.** É assim que está escrito no
enunciado, com as três provas partilhadas. Separá-las em duas entradas seria eu a
alterar o texto.

**O Licas aparece como texto simples**, sem link e sem afordância de clique —
fundo transparente em vez do roxo dos links. Não acrescentei "(privado)" nem nada
que o explique, porque seria texto inventado.

## Imagem OG

`public/og-image.png`, **1200×630, 45,7 KB**. Gerada por `npm run og`
(`scripts/gerar-og.mjs`), que fica no repositório para regenerares.

Conteúdo: "Francisco Pereira" a 86px em Poppins Bold, "Full-Stack Developer" a
40px em SemiBold sobre o roxo de acento, e "franciscopereira.dev" a 28px em
Regular, separado por uma régua fina. Fundo em gradiente `#0F172A` → `#1E293B`
com um brilho roxo no canto superior direito, e a barra de acento à esquerda que
ecoa a borda dos cartões do site.

### O que correu mal, e como ficou resolvido

**A Poppins não estava disponível para o renderizador.** O sharp desenha SVG
através do librsvg, que resolve tipos de letra pelo sistema. Medi: um `<text
font-family="Poppins">` produzia exatamente os mesmos pixeis que `sans-serif`
(6363 pixeis de texto, mesma largura) — ou seja, caía no fallback em silêncio.
Tentei apontar o `FONTCONFIG_PATH` para uma pasta com as TTF; não pegou.

**Solução: o texto vai em contornos vetoriais.** O script lê as TTF oficiais em
`scripts/fontes/` com o `opentype.js` e converte cada linha em `<path>`. O SVG
fica autossuficiente e sai igual em qualquer máquina, incluindo o runner do
GitHub Actions.

**Segundo problema: o opentype.js emitia coordenadas `NaN`.** O
`font.getPath(texto, ...)` produzia uma coordenada inválida a meio, e o librsvg
pára de desenhar quando encontra uma — a primeira imagem saiu com "Francis",
"Full-" e "fran" cortados. O bug depende do tamanho: o domínio a 28px dava 4 NaN,
a 40px nenhum. Nenhum glifo isolado tinha o problema. Passei a compor glifo a
glifo, aplicando o kerning à mão, e o script rejeita o resultado se ainda assim
aparecer um `NaN`.

**Caminho seguido: contornos vetoriais.** Das duas saídas possíveis — converter
o texto em paths, ou desistir e usar uma sans-serif do sistema — a primeira
funcionou, por isso a imagem sai na tipografia exata do site. Não foi preciso o
recurso.

### As TTF são material de build

As três TTF (~460 KB) vivem em **`scripts/fontes/`** e existem só para o script
da imagem OG. Não estão em `public/`, não vão para o `dist` e o site não as
referencia: o que é servido são as WOFF2 subsetadas de `public/fonts/`, com 52,3
KB no total.

Como o `scripts/` está fora do `publicDir`, o Astro nunca lhes toca. Isso deixa
de ser verdade se alguém as mover para `public/`, e o resultado seriam 460 KB
servidos a ninguém sem nada avisar — por isso o `astro.config.mjs` tem uma
integração, `garantir-que-as-ttf-nao-saem`, que corre no `astro:build:done`,
varre o `dist` à procura de `.ttf`, `.otf` e `.eot`, e **falha o build** nomeando
o ficheiro. Testado a plantar uma TTF em `public/fonts/`: o build parou com a
mensagem certa.

## Meta tags por página

Idênticas nas duas páginas, exceto onde indicado.

### Ambas as páginas

| Tag | PT | EN |
|---|---|---|
| `<title>` | Francisco Pereira — Full-Stack Developer \| Portefólio | Francisco Pereira — Full-Stack Developer \| Portfolio |
| `meta[name=description]` | a do enunciado | a do enunciado |
| `link[rel=canonical]` | `https://franciscopereira.dev/` | `https://franciscopereira.dev/en/` |
| `link[hreflang=pt-PT]` | `https://franciscopereira.dev/` | igual |
| `link[hreflang=en]` | `https://franciscopereira.dev/en/` | igual |
| `link[hreflang=x-default]` | `https://franciscopereira.dev/` | igual |
| `og:type` | `website` | `website` |
| `og:site_name` | `Francisco Pereira` | `Francisco Pereira` |
| `og:title` | = title | = title |
| `og:description` | = description | = description |
| `og:url` | `https://franciscopereira.dev/` | `https://franciscopereira.dev/en/` |
| `og:image` | `https://franciscopereira.dev/og-image.png` | igual |
| `og:image:width` | `1200` | `1200` |
| `og:image:height` | `630` | `630` |
| `og:image:alt` | = title | = title |
| `og:locale` | `pt_PT` | `en_GB` |
| `og:locale:alternate` | `en_GB` | `pt_PT` |
| `twitter:card` | `summary_large_image` | igual |
| `twitter:title` | = title | = title |
| `twitter:description` | = description | = description |
| `twitter:image` | = og:image | = og:image |
| `theme-color` (light) | `#F8FAFC` | igual |
| `theme-color` (dark) | `#0F172A` | igual |

Contagem: **11 `og:*`, 4 `twitter:*`, 1 canonical, 3 hreflang, 2 theme-color** em
cada página.

### Só na página PT

`<script type="application/ld+json">` com um `Person`: `name`, `jobTitle`,
`description`, `url`, `image`, `email`, `alumniOf` (Instituto Politécnico de
Leiria, como `CollegeOrUniversity`), `knowsAbout` (as 19 tecnologias),
`sameAs` (GitHub e LinkedIn) e `nationality` (`Country`, PT).

O `knowsAbout` é gerado a partir do `skills.json`, a mesma fonte da secção de
competências, para as duas listas não divergirem.

## sitemap e robots

`@astrojs/sitemap` com a opção `i18n`, o que gera `sitemap-index.xml` e
`sitemap-0.xml` com as duas URLs ligadas por `xhtml:link rel="alternate"`.
`public/robots.txt` permite tudo e aponta para o índice do sitemap.

## Outras alterações

- **`<html lang>` passou de `pt` a `pt-PT`** na página portuguesa, para bater
  certo com o `hreflang="pt-PT"`. Estavam a dizer coisas diferentes.
- **Os CTAs partiam o texto a meio.** Com três botões a coluna do hero ficou
  apertada e saía "Ver / projetos", "Descarregar / CV". Acrescentei
  `white-space: nowrap` ao `.btn` e `flex-wrap: wrap` ao `.hero-buttons`: os
  botões mantêm-se inteiros e o terciário desce de linha quando não cabe, o que
  aliás exprime a hierarquia pedida. A 900px cabem os três na mesma linha.
- **A grelha de competências transbordava no telemóvel.** Com
  `minmax(400px, 1fr)`, o cartão ficava com 400px dentro de um contentor de
  311px. Corrigido com `minmax(min(400px, 100%), 1fr)`.

## Critérios de aceitação

| # | Critério | Resultado |
|---|---|---|
| 1 | `npm run build` | Passa, exit 0 |
| 2 | `npm run check:i18n` | Passa, 46 chaves de cada lado |
| 3 | Texto exatamente igual ao enunciado | Passa. **46/46 strings**, comparação automática contra fonte canónica, zero divergências |
| 4 | Sem "Desenvolvido com HTML" / "Built with HTML" | Passa, zero ocorrências |
| 5 | Sem C#, Python, Node.js, Tailwind, Linux nas competências | Passa, zero. Também zero no documento inteiro |
| 6 | Cada competência com prova, sem 404 | Passa. 19 tecnologias, 29 links, 4 entradas Licas sem link, **10 URLs distintos todos a 200** |
| 7 | `og-image.png` 1200×630 < 300 KB | Passa, 45,7 KB |
| 8 | og, twitter, canonical, hreflang, theme-color nas duas páginas | Passa, listadas acima |
| 9 | `sitemap-index.xml` e `robots.txt` com as duas línguas | Passa |
| 10 | JSON-LD válido | Passa, `JSON.parse` OK, 12/12 campos exigidos |
| 11 | Nenhum ficheiro acima de 500 KB | Passa. `dist/` com 1,04 MB em 31 ficheiros. **Zero `.ttf`/`.otf`/`.eot` no output** e zero referências a `.ttf`; as fontes servidas são as 8 WOFF2. Protegido por integração que falha o build se alguma lá chegar |
| 12 | Layout a 1440/900/375 sem scroll horizontal | Passa. Zero elementos a transbordar nas três larguras; dois problemas encontrados e corrigidos, descritos acima |

### Nota sobre um aviso de consola

Aparece um aviso de que a `poppins-400-latin.woff2` foi pré-carregada mas "não
usada". É falso positivo: o ficheiro é pedido **uma só vez**, pelo próprio
preload (`initiatorType: "link"`), e o `document.fonts` mostra o peso 400 como
`loaded`. Se o preload fosse desperdiçado haveria dois pedidos ao mesmo ficheiro.
O aviso vem do painel de browser estar oculto e o sinal de utilização chegar
fora da janela de tempo da heurística.
