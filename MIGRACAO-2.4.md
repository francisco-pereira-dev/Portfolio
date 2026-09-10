# Migração 2.4 — Devicon, imagens, fontes e limpeza do legado

Última fase da migração. O site fica sem ficheiros legados, sem pedidos a terceiros e sem os
11,7 MB de fontes de ícones.

## Resumo

| | Antes (fase 2.3) | Depois |
|---|---:|---:|
| **`dist/` total** | **11,53 MB** (16 ficheiros) | **1,04 MB** (27 ficheiros) |
| Ficheiros acima de 500 KB | 4 | 0 |
| Maior ficheiro | `devicon.svg`, 6591,3 KB | `CV.pdf`, 380,2 KB |
| Pedidos a terceiros | Google Fonts + Unsplash | nenhum |

Redução de **91%**. Os números do "antes" foram medidos a sério: construí o commit `5de5366`
num worktree separado em vez de os estimar.

## Tarefa 1 — Devicon substituído por SVG inline

O `css/devicon.css` definia 1491 classes de ícone. O site usava 15. Custo: 126,6 KB de CSS mais
11,7 MB de fontes (`devicon.svg` 6591,3 KB, `.eot` / `.woff` / `.ttf` 1464 KB cada), sem WOFF2 e
com `font-display: block`.

Agora são 15 ficheiros SVG em `src/icons/`, **17,9 KB no total**, embutidos no HTML pelo
componente `Icon.astro`. Atribuição em [ICONES.md](ICONES.md) (Devicon, MIT).

### Os 15 ícones mapeados

| Classe antiga | Ficheiro | Onde é usado |
|---|---|---|
| `devicon-html5-plain` | `html5-plain.svg` | skill HTML5 |
| `devicon-css3-plain` | `css3-plain.svg` | skill CSS3 |
| `devicon-javascript-plain` | `javascript-plain.svg` | skill JavaScript |
| `devicon-typescript-plain` | `typescript-plain.svg` | skill TypeScript |
| `devicon-tailwindcss-original` | `tailwindcss-original.svg` | skill Tailwind CSS |
| `devicon-nodejs-plain` | `nodejs-plain.svg` | skill Node.js |
| `devicon-php-plain` | `php-plain.svg` | skill PHP |
| `devicon-mysql-plain` | `mysql-plain.svg` | skill MySQL |
| `devicon-docker-plain` | `docker-plain.svg` | skill Docker |
| `devicon-python-plain` | `python-plain.svg` | skill Python |
| `devicon-csharp-plain` | `csharp-plain.svg` | skill C# |
| `devicon-java-plain` | `java-plain.svg` | skill Java |
| `devicon-linux-plain` | `linux-plain.svg` | skill Linux |
| `devicon-github-original` | `github-original.svg` | skill Git/GitHub + social + contactos |
| `devicon-linkedin-plain` | `linkedin-plain.svg` | social + contactos |

São 14 nas competências mais o LinkedIn, que só aparece no menu e nos contactos.

Os dois ícones de texto, `{API}` (REST APIs) e `OS` (OutSystems), **continuam a ser texto**: são
`<div class="skill-icon text-icon">`, e o componente `Skills.astro` ramifica pelo campo `kind` do
`skills.json`. Não foram forçados a SVG.

### Cor: a fonte era monocromática

Um glifo de fonte herda a propriedade `color`. Os SVGs oficiais do Devicon trazem a cor de marca
fixa (`fill="#E44D26"` no HTML5, `#181616"` no GitHub, etc.). Deixá-los assim mudava o aspeto do
site: os ícones passariam de cinzento-escuro a coloridos. Substituí todos os `fill` por
`fill="currentColor"`, que reproduz exatamente o comportamento antigo. É a única alteração feita
aos ficheiros originais, e está registada no `ICONES.md`.

### Adaptação do CSS

As três regras que posicionam ícones assumiam texto: `font-size` e `color`. Em vez de as
reescrever, acrescentei uma regra que faz o SVG obedecer-lhes na mesma:

```css
.icon { width: 1em; height: 1em; fill: currentColor; }
```

Com `width: 1em`, o tamanho continua a vir do `font-size` do contexto — `.skill-icon` (3,5rem),
`.contact-icon-circle` (2,5rem), `.overlay-social-icon` (1,8rem) — sem mudar um único valor.

Acrescentei ainda `.overlay-social-icon .icon { stroke: none; }`. A regra existente
`.overlay-social-icon svg { stroke: currentColor }` foi escrita para o ícone de email, que é
desenhado a traço; aplicada a um ícone preenchido, engrossava-o.

### Medição antes/depois

Medido no mesmo browser, com transições desligadas, nos dois temas:

| Elemento | Antes (fonte) | Depois (SVG) |
|---|---|---|
| 14 ícones de skill | `56x56` | `56x56` |
| cor em tema claro | `rgb(15, 23, 42)` | `rgb(15, 23, 42)` |
| cor em tema escuro | `rgb(248, 250, 252)` | `rgb(248, 250, 252)` |
| REST APIs (texto) | `63.7x56` | `63.7x56` |
| OutSystems (texto) | `33.6x56` | `33.6x56` |
| 3 ícones sociais | `28.8x28.8` | `28.8x28.8` |
| cor social, claro / escuro | `rgb(71,85,105)` / `rgb(203,213,225)` | iguais |
| contactos (LinkedIn, GitHub) | `40x40`, `rgb(139,92,246)` | iguais |
| contacto (email, inalterado) | `36x36` | `36x36` |
| `.skill-card` | `130x164` | `130x164` |
| altura da página | `11661` | `11661` |

Zero diferenças. Confirmei também que os 18 SVGs têm desenho real: `getBBox()` devolve caixas de
~120×120 unidades num `viewBox` de 128×128, nenhuma vazia.

### Nota sobre o `mysql-plain.svg`

O `raw.githubusercontent.com` devolve **404** para `icons/mysql/mysql-plain.svg` no ramo
principal: o Devicon reorganizou os ícones do MySQL e esse nome já lá não existe. Fui buscá-lo ao
pacote npm `devicon@2`, a mesma família de versão do `devicon.css` que estava no repositório. É o
ficheiro com o nome exato, **não um ícone parecido escolhido por mim**.

## Tarefa 2 — Imagens

### Origem

| Ficheiro | Antes | Depois | Formato |
|---|---:|---:|---|
| `ti.png` → `ti.webp` | 1693,8 KB (1672×941) | **110,6 KB** (1400×788) | PNG → WebP q90 |
| `logo-gest.jpg` | 97,8 KB (1024×572) | inalterado | JPEG |
| `dae.jpg` | 88,1 KB (1024×572) | inalterado | JPEG |
| `ainet.jpg` | 87,1 KB (1024×572) | inalterado | JPEG |
| `avatar.jpg` | 49,2 KB (615×623) | inalterado | JPEG |

O `ti.png` desceu **93,5%**. 1400px é a maior largura que o site chega a pedir (a modal), por isso
não havia nada a ganhar em guardar 1672. Os outros já estavam abaixo dos 100 KB e ficaram como
estavam.

### Saída

Todas as imagens locais passam pelo `<Image>` do Astro, com `width` explícito e saída em WebP.
O `ProjectImage.astro` calcula a largura sem nunca ampliar a origem:

```js
const LARGURA_ALVO = { card: 900, modal: 1400 };
const largura = Math.min(LARGURA_ALVO[variant], project.image.width);
```

13 ficheiros gerados, **505,5 KB no total**, o maior com 69,4 KB:

| Variante | Largura | Tamanho |
|---|---:|---:|
| `ti` modal | 1400×788 | 69,4 KB |
| `logo-gest` modal | 1024×572 | 55,9 KB |
| `dianearbus` modal | 1400×782 | 51,0 KB |
| `mrpizza` modal | 1400×782 | 44,2 KB |
| `logo-gest` cartão | 900×503 | 43,0 KB |
| `dae` modal | 1024×572 | 39,7 KB |
| `ainet` modal | 1024×572 | 34,1 KB |
| `ti` cartão | 900×507 | 33,9 KB |
| `dae` cartão | 900×503 | 32,8 KB |
| `dianearbus` cartão | 900×503 | 31,2 KB |
| `ainet` cartão | 900×503 | 27,1 KB |
| `mrpizza` cartão | 900×503 | 25,3 KB |
| `avatar` | 615×623 | 17,9 KB |

Fiquei-me pelo WebP e não gerei AVIF: as poupanças adicionais aqui seriam de poucos KB sobre
ficheiros que já estão nas dezenas, e o AVIF custa bastante mais tempo de build.

### Atributos

As 26 `<img>` das duas páginas têm agora `width`, `height` e `alt`. Antes, as duas do Unsplash não
tinham dimensões — daí o deslocamento de layout ao carregar.

- **24 com `loading="lazy"`** — cartões e modais. As modais não tinham; ganharam-no.
- **2 com `loading="eager"` e `fetchpriority="high"`** — o avatar do hero nas duas línguas. Estava
  com `lazy`, que o `<Image>` põe por omissão, e é conteúdo acima da dobra.

### Descoberta: 2,52 MB de peso morto

O Astro emite sempre o **original** de cada imagem da content collection para `dist/_astro/`,
mesmo quando só as variantes otimizadas são usadas. Verifiquei: `ti.CQ5vA7aF.png` (1693 KB) e
companhia tinham **zero referências** em qualquer HTML, CSS ou JS gerado.

Acrescentei ao `astro.config.mjs` uma integração `podarAssetsNaoReferenciados` que, no
`astro:build:done`, apaga de `_astro/` o que não aparece em nenhum ficheiro de texto do `dist`.
A verificação é literal — só se apaga o que não é mencionado em lado nenhum. No último build
completo removeu **6 ficheiros, 2,52 MB**.

Sem isto, o critério "nenhum ficheiro acima de 500 KB" era impossível de cumprir sem encolher
artificialmente as origens.

### Sobre o `sharp`

Funciona. O primeiro teste deu erro, mas era do meu código: `require('sharp/package.json')` está
bloqueado pelo campo `exports` do pacote. O `require('sharp')` carrega bem e processou as 13
imagens sem problemas.

## Tarefa 3 — As duas imagens do Unsplash

- `imageRemote` **removido do schema**, com o `superRefine` que obrigava a escolher entre os dois
  modelos. Deixou de haver dois modelos de imagem: todos os projetos têm `image` local.
- As entradas apontam para `assets/images/mrpizza.png` e `assets/images/dianearbus.png`.
- Os ficheiros **não existem**, e por isso **o build falha**. É o comportamento pedido.

O Astro sozinho pára na primeira imagem que falta e só nomeia essa. Acrescentei a integração
`verificarImagensDosProjetos`, que corre no `astro:config:setup` e lista todas de uma vez:

```
Faltam 2 imagem(ns) de projeto:

  - diane-arbus: falta assets/images/dianearbus.png   (referido em src/content/projects/diane-arbus.json)
  - mr-pizza: falta assets/images/mrpizza.png   (referido em src/content/projects/mr-pizza.json)

Coloca o(s) ficheiro(s) em assets/images/ com esse nome exato e volta a correr o build.
As fotografias de stock do Unsplash foram removidas: cada projeto precisa de um screenshot real.
```

Nenhum placeholder ficou no repositório e não há URLs do Unsplash em lado nenhum.

**Como medi os critérios com o build a falhar:** criei os dois ficheiros temporariamente, a partir
de imagens de projeto existentes redimensionadas para 1400px, corri o build completo, tirei todas
as medições, e apaguei-os. Está tudo registado neste documento; o repositório ficou sem eles.

## Tarefa 4 — Poppins auto-alojada

Antes: `<link>` para `fonts.googleapis.com` com dois `preconnect`, a pedir os pesos
`300;400;500;600;700`.

Verifiquei quais são realmente usados antes de decidir:

| Peso | Usos | Onde |
|---|---:|---|
| 400 | 2 | corpo de texto, `.modal-features` |
| 500 | 5 | `.lang-switch`, `.skill-name`, `.tech-badge`, `.btn-view-more`, `.btn-modal` |
| 600 | 5 | `.nav-center`, `.overlay-link`, `.btn`, `.section-heading`, `.project-title` |
| 700 | 4 + `bold` | `.main-title`, `.contact-title`, `.lang-switch .active-lang`, `.modal-info-btn` |
| **300** | **0** | **não é usado em lado nenhum — saiu** |

Ficaram 4 pesos nos subsets `latin` e `latin-ext`, 8 ficheiros WOFF2, **52,3 KB no total**. O
subset `devanagari` que o Google serve ficou de fora: o site é PT/EN.

- `font-display: swap`, em vez do `block` que a fonte de ícones usava.
- `<link rel="preload">` para `poppins-400-latin.woff2` — o peso do corpo de texto, o mais usado.
- Zero pedidos a terceiros e zero ligações a domínios externos no arranque.

## Tarefa 5 — Limpeza

Apagado:

| Caminho | Peso | Porquê |
|---|---:|---|
| `index.html` | 32 KB | fonte da migração, já consumida |
| `js/` | 24 KB | idem — portado para `src/scripts/main.js` |
| `css/styles.css` | 21 KB | idem — em `src/styles/global.css` |
| `css/devicon.css` + 4 fontes | 11,7 MB | substituído por SVG inline |
| `public/css/devicon.*` | 11,7 MB | as cópias feitas na 2.3 |
| `assets/docs/`, `assets/icons/` | 395 KB | duplicados; a cópia única vive em `public/` |
| `assets/images/ti.png` | 1,7 MB | substituído por `ti.webp` |

Mantido, como pedido: **`assets/images/`**, que é a origem das imagens da collection.

Cópia única confirmada:

- `dist/assets/docs/CV.pdf` — 389 345 bytes, assinatura `%PDF-`, servido de `public/`, no mesmo
  caminho `/assets/docs/CV.pdf` de sempre. Os links externos continuam a funcionar.
- `dist/assets/icons/favicon.ico` — 15 406 bytes, também só em `public/`.
- `dist/CNAME` — 20 bytes, conteúdo exato `franciscopereira.dev`.

## Critérios de aceitação

| # | Critério | Resultado |
|---|---|---|
| 1 | `npm run build` passa | **Falha de propósito** — faltam os 2 screenshots (tarefa 3). Com os ficheiros presentes, passa com exit 0 |
| 2 | Nenhum ficheiro em `dist/` acima de 500 KB | Passa. Maior: `CV.pdf` 380,2 KB |
| 3 | Zero pedidos a terceiros | Passa. Sem `fonts.googleapis`, `fonts.gstatic`, `images.unsplash` ou `cdn.jsdelivr` em `dist/` |
| 4 | Todas as `<img>` com `width` e `height` | Passa. 26 de 26, e todas com `alt` |
| 5 | Ícones no mesmo tamanho e cor, nos dois temas | Passa. Medido, tabela acima |
| 6 | `dist/CNAME` correto | Passa |
| 7 | `dist/assets/docs/CV.pdf` existe e abre | Passa |
| 8 | `npm run check:i18n` | Passa, 31 chaves de cada lado |
| 9 | Paridade visual a 1440 / 900 / 375 | Passa. Zero diferenças contra a 2.3 |
| 10 | Peso total de `dist/` | 11,53 MB → **1,04 MB** |

### 10 maiores ficheiros em `dist/`

```
   380.2 KB  assets/docs/CV.pdf
    69.4 KB  _astro/ti.BEW46T5m_1DqzCT.webp
    55.9 KB  _astro/logo-gest.C2NOGThI_1uSgHm.webp
    51.0 KB  _astro/dianearbus.BhdJ7Uv4_Z2tqF94.webp
    46.1 KB  index.html
    45.7 KB  en/index.html
    44.2 KB  _astro/mrpizza.B29ty1YZ_wXDXj.webp
    43.0 KB  _astro/logo-gest.C2NOGThI_Z1rb5TD.webp
    39.7 KB  _astro/dae.CnpnmSfR_1HGXvU.webp
    34.1 KB  _astro/ainet.CPS4pQ18_yOVar.webp
```

O HTML cresceu de ~25 KB para ~46 KB por página, porque os SVGs dos ícones passaram a estar
embutidos. É a troca certa: poupa 126,6 KB de CSS, 11,7 MB de fontes e dois pedidos de rede.

### Paridade visual (critério 9)

Mesmo método da 2.3: os dois builds servidos em paralelo — o commit `5de5366` num worktree
separado, o atual em `dist/` — animações desligadas, tema forçado a claro, e comparação de
`getBoundingClientRect` mais estilos computados.

| Largura | Elementos medidos | Diferenças | Altura da página |
|---|---:|---:|---|
| 1440×900 | 30 | 0 | 4405 = 4405 |
| 900×800 | 19 | 0 | 4557 = 4557 |
| 375×812 | 19 | 0 | 7797 = 7797 |

Sem scroll horizontal a 375px em nenhum dos dois.

## O que falta

Colocar em `assets/images/`:

- `mrpizza.png`
- `dianearbus.png`

Sugestão: no máximo 1400px de largura, que é a maior que o site pede. A poda de assets impede que
o original vá para o `dist` mesmo que seja pesado, mas um PNG grande fica na mesma no repositório
e no histórico do git.
