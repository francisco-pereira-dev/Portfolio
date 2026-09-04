# Migração 2.3 — Componentes e páginas finais

Objetivo: o site em Astro visualmente indistinguível do atual, com o comportamento todo
a funcionar. Sem redesenho. `index.html`, `css/`, `js/` e `assets/` na raiz não foram tocados.

## Componentes criados

| Ficheiro | Recebe | Responsabilidade |
|---|---|---|
| `layouts/BaseLayout.astro` | `title`, `description`, `lang?` | Casca do documento: doctype, `<html lang>`, `<head>`, os dois `<script is:inline>` e o import do CSS global |
| `layouts/PortfolioPage.astro` | `lang` | Monta a página inteira para uma língua. Carrega `ui` e a collection uma só vez; as duas páginas são invocações desta |
| `components/Navbar.astro` | `ui`, `lang` | Hambúrguer, marca central, seletor de idioma (link) e alternador de tema |
| `components/OverlayMenu.astro` | `ui` | Menu de ecrã inteiro: 4 ligações de secção + 3 ícones sociais (lê `site.json`) |
| `components/Hero.astro` | `ui` | Título, subtítulo, botões de CV e contacto, avatar via `<Image>` |
| `components/About.astro` | `ui` | Cabeçalho e parágrafo da biografia |
| `components/Skills.astro` | `ui` | Grelha das 16 competências a partir de `skills.json`; distingue ícone devicon de ícone de texto |
| `components/Projects.astro` | `projects`, `lang`, `ui` | Secção e grelha; delega cada cartão |
| `components/ProjectCard.astro` | `project`, `lang`, `ui` | Cartão: imagem, título, badges de stack, botão "Ver Mais" com `data-modal` |
| `components/ProjectModal.astro` | `project`, `lang`, `ui` | Modal: `role="dialog"`, `aria-modal`, `aria-labelledby`, botão de cold start condicional |
| `components/ProjectImage.astro` | `project`, `variant`, `alt`, `class?`, `loading?` | **O único sítio que sabe da diferença entre `image` e `imageRemote`** |
| `components/Contacts.astro` | `ui` | Três cartões de contacto (lê `site.json`) |
| `components/Footer.astro` | `ui` | Rodapé |
| `scripts/main.js` | — | Todo o comportamento cliente (217 linhas) |
| `i18n/index.ts` | — | Mapa de traduções, tipos `Lang`/`Ui`/`Localized`, `localeHref`, `otherLang`, `t()` |

As páginas ficaram com 6 linhas cada: importam `PortfolioPage` e passam `lang`.

## Quirks mode → standards mode

Confirmado empiricamente: `document.compatMode` é `BackCompat` no site legado e `CSS1Compat`
no novo.

### O que foi verificado, e o que realmente aconteceu

**1. Descenso da linha de base nas imagens — o problema previsto NÃO se materializou.**

Apliquei `display: block` a `.project-thumb img`, `.modal-img` e `.avatar-img`. Depois medi
com e sem o fix, no mesmo browser e na mesma página:

| Elemento | Com `display: block` | Sem (a voltar a `inline`) |
|---|---|---|
| `.avatar-img` | `813,310,360,360` | `813,310,360,360` |
| `.avatar-container` | `803,300,380,380` | `803,300,380,380` |
| `.project-thumb` | `248,2522,450,200` | `248,2522,450,200` |
| `.project-thumb img` | `248,2522,450,200` | `248,2522,450,200` |
| `scrollHeight` | 4405 | 4405 |

Zero diferença. A razão: a lacuna da linha de base só desloca layout quando é a imagem a
determinar a altura do contentor. Aqui as três imagens têm altura explícita (`height: 100%`
ou fixa) dentro de contentores de altura fixa (`.project-thumb` 200px com `overflow: hidden`,
`.avatar-container` 380px), por isso o espaço do descenso é absorvido ou cortado. A
`.modal-img` é ainda um item de flex (`.modal-content` é `flex-direction: column`), o que já
a blockifica independentemente da declaração.

**Mantive o fix** por ser inócuo e defensivo — se algum destes contentores passar a altura
automática numa fase futura, o problema apareceria. Mas fica o registo de que, hoje, não
corrige nada visível.

**2. `100vh` — sem diferença.** `.hero-section` (`min-height: 100vh`), `.overlay-content`
(`min-height: 100vh`) e `.overlay-menu` (`height: 100vh`) mediram exatamente igual nos dois
sites nas três larguras: 900px de altura a 1440×900, 800px a 900×800, 812px a 375×812.

**3. Diferença real encontrada — o seletor de idioma.** Não é de quirks mode: vem de o
elemento ter passado de `<button>` para `<a>`. O `<button>` recebe `line-height: normal` do
UA stylesheet; o `<a>` herda o `line-height: 1.6` do `body`.

- Antes do fix: legado `1265,26,66,27`, novo `1265,24,66,29` — 2px mais alto.
- Acrescentei `line-height: normal` e `text-decoration: none` a `.lang-switch`.
- Depois do fix: `1265,26,66,27` nos dois. Idêntico.

**4. Diferença cosmética sem efeito, deixada como está.** O `<button>` tinha
`text-align: center` do UA; o `<a>` herda `start`. Como `.lang-switch` é `display: flex` e os
três `<span>` são dimensionados ao conteúdo, o `text-align` não tem efeito — a caixa mede
igual (`757,22,66,27` nos dois, a 900px). Não acrescentei declaração para isto.

**5. Ordem de carregamento do CSS invertida.** No legado, `styles.css` vem antes de
`devicon.css`. O Astro injeta o CSS empacotado no fim do `<head>`, por isso o `devicon.css`
passou a vir primeiro. As duas folhas não disputam nenhuma propriedade (o devicon define
`font-family` com `!important`, `line-height`, `font-style`; o `global.css` define
`font-size` e `color` no `.skill-icon`), e a medição confirma: `.skill-icon` dá
`56px/400/56px` nos dois sites.

### Como comparei

Não comparei capturas de ecrã a olho — a escala do painel torna isso pouco fiável. Levantei
os dois sites em simultâneo (legado num servidor estático em `:5050`, o build do Astro em
`:4321`) e, em cada um, injetei `*{transition:none!important;animation:none!important}`,
forcei `.is-visible` em todos os `.reveal` e `.skill-card`, e li `getBoundingClientRect` mais
estilos computados de dezenas de seletores. Sem desligar as animações os números apanham
estados intermédios da transição de 0.8s e do `float` infinito do avatar.

| Largura | Elementos medidos | Diferenças |
|---|---|---|
| 1440×900 | 35 | 1 (`.lang-switch`, corrigida) |
| 900×800 | 23 | 0 |
| 375×812 | 23 | 0 |
| 375×812, modal aberta | 12 | 0 |

Alturas totais de página idênticas: 4405 / 4557 / 7797 px. Sem scroll horizontal em nenhum
dos dois a 375px. A modal a 375px bate certo até nos `z-index` (3000 e 2999), o que confirma
que remover as declarações duplicadas não mudou nada.

## Decisão sobre `lang-pt` / `lang-en`

**Mantidas no markup, com o `active-lang` aplicado no build.**

Eram usadas exclusivamente como seletores em `js/script.js` L358-359, para mover a classe
`active-lang` quando a língua mudava em runtime. Com o seletor a passar a link de navegação,
a língua ativa é conhecida no build, por isso `active-lang` é agora renderizado estaticamente
(`class:list` com `lang === 'pt'`).

Mantive as duas classes porque: identificam qual `<span>` é qual língua, preservam a paridade
de DOM com o site atual, e servem de gancho para CSS ou testes futuros. Removê-las não trazia
nada e alterava o markup. O código JS que as manipulava foi apagado.

## `image` vs `imageRemote`

Resolvido num único componente, `components/ProjectImage.astro`, que os outros dois usam:

```astro
<ProjectImage project={p} variant="card"  alt={...} loading="lazy" />   <!-- ProjectCard -->
<ProjectImage project={p} variant="modal" alt={...} class="modal-img" /> <!-- ProjectModal -->
```

Dentro dele, um único ramo decide:

- `project.image` presente (4 projetos) → `<Image>` do `astro:assets`, com otimização. O
  helper `image()` do schema resolve `../../../assets/images/*` sem que `assets/` seja tocado.
- `project.imageRemote` presente (Mr. Pizza e Diane Arbus) → `<img>` simples com
  `imageRemote[variant]`, que escolhe o URL `w=600` para o cartão e `w=1200` para a modal.

O `superRefine` do schema garante que existe exatamente um dos dois campos, por isso os
componentes que consomem nunca precisam de saber qual é o caso.

Efeito colateral do pipeline: as 5 imagens locais passam a WebP no build
(`ti.png` 1693 kB → 90 kB, avatar 49 kB → 17 kB). O aspeto é o mesmo — todas são recortadas
por `object-fit: cover` — mas é uma mudança de formato face ao site atual.

## Código apagado do `script.js`

| Removido | Linhas na origem | Porquê |
|---|---|---|
| `translations` (objeto com 52 chaves EN) | 223-278 | O conteúdo passou a vir do build. As strings vivem em `src/i18n/` e na collection |
| `ptTranslations` + os dois ciclos que raspavam o DOM | 281-297 | Já não é preciso reconstruir o dicionário PT a partir do HTML: o PT é dados desde a 2.2 |
| `setLanguage()` | 303-371 | Substituída por duas páginas estáticas. Não foi adaptada, foi eliminada |
| Listener de clique do `#lang-toggle` | 374-381 | O seletor é um `<a href>`; a navegação é do browser |
| Arranque `savedLang` / `localStorage.language` | 384-387 | A língua é o URL, não estado do cliente |
| Mutação da `meta[name=description]` | 333-340 | Renderizada no build, por língua |
| Mutação dos `aria-label` do hambúrguer e do tema | 346-353 | Renderizados no build, a partir das chaves `a11y-*` |
| Troca da classe `active-lang` | 356-367 | Renderizada no build |
| Aplicação do tema guardado no arranque | 64-71 | **Movida**, não apagada: passou para o `<script is:inline>` do `<head>` |

Mantido e portado sem alterações de lógica: menu overlay, alternância de tema por clique,
sistema de modais com restauro de foco, os três `IntersectionObserver`, tooltips e scrollspy.
O bloco de deteção de recarregamento (L14-19) ficou `is:inline` no `<head>` para preservar o
momento de execução — corria fora do `DOMContentLoaded`.

Acrescentado: 11 linhas que mantêm a âncora da secção no link de idioma, para trocar de língua
não perder o sítio onde o visitante estava.

## Flash de tema

O site legado tinha `<body class="light-mode">` fixo no HTML e só aplicava o tema guardado
dentro do `DOMContentLoaded`, com o script no fim do `<body>`: quem tivesse `dark` guardado
via a página em claro durante uns instantes.

A classe passou de `<body>` para `<html>` — é a única forma de um script no `<head>` a poder
aplicar, porque nesse momento o `<body>` ainda não existe. Isso obrigou a mudar 5 seletores
(`body.light-mode` → `html.light-mode` e as 4 regras dos ícones sol/lua). **Os 17 custom
properties e os 14 overrides mantêm valores exatamente iguais** — mudou o prefixo do seletor,
não o conteúdo.

Verificado: com `theme=dark` guardado, o `<html>` chega com `dark-mode` e um `MutationObserver`
não regista **nenhuma** alteração à classe depois da carga. O script está no `<head>` (posição
1489, `</head>` em 2314 no ficheiro servido), logo corre antes de o `<body>` ser parseado.

Acrescentei também o fallback a `prefers-color-scheme` que não existia: um visitante novo com
o sistema em escuro recebia sempre o tema claro. Agora recebe escuro. **Isto é uma mudança de
comportamento visível** — foi pedida explicitamente, mas convém saber que o primeiro
carregamento para visitantes novos pode agora ser escuro.

Sem JavaScript o comportamento não mudou: o `<html>` é servido com `class="light-mode"`, tal
como o `<body>` legado.

## Ficheiros estáticos duplicados em `public/` — a limpar na 2.4

Como `css/` e `assets/` na raiz não podem ser tocados nesta fase mas o site precisa deles em
runtime, copiei para `public/`:

```
public/css/devicon.css + .eot .ttf .woff .svg   11,7 MB
public/assets/icons/favicon.ico                   15 kB
public/assets/docs/CV.pdf                        380 kB
```

São cópias, não movimentos: os originais continuam intactos. **Na 2.4, ao remover os ficheiros
legados da raiz, estas cópias passam a ser as únicas** — não as apagues por engano. O avatar e
as 4 imagens de projeto não precisaram de cópia: são importadas por `src/` e passam pelo
pipeline do Astro.

## Critérios de aceitação

| # | Critério | Resultado |
|---|---|---|
| 1 | `npm run build` sem avisos | Passa, exit 0 |
| 2 | Paridade visual a 1440/900/375 | Passa. 1 diferença encontrada e corrigida; ver secção "Como comparei" |
| 3 | Menu overlay abre, fecha, bloqueia scroll | Passa (abre, fecha no hambúrguer, fecha ao clicar num link, `overflow: hidden` no body) |
| 4 | Tema alterna, persiste, sem flash | Passa; zero mutações à classe após a carga |
| 5 | 6 modais: abrir, X / Escape / fora, restauro de foco | Passa nas 6, todas as vias |
| 6 | Idioma navega e preserva âncora | Passa: `/#projects` → `/en/#projects`, volta a `/#projects` |
| 7 | Scrollspy destaca a secção certa | Passa (ver nota abaixo) |
| 8 | Animações disparam uma vez cada | Passa (ver nota abaixo) |
| 9 | Zero erros de consola nas duas línguas | Passa |
| 10 | `dist/en/index.html` com inglês estático | Passa: "Hello, I am Francisco Pereira" está no HTML; zero ocorrências de `translations` ou `setLanguage` |
| 11 | `npm run check:i18n` | Passa, 31 chaves de cada lado |

### Nota sobre os critérios 7 e 8

O `IntersectionObserver` não dispara em documentos com `visibilityState: "hidden"`, e tanto o
painel de browser da ferramenta como o separador do Chrome ficaram em segundo plano — no site
legado também. Scroll programático nesse estado não gera frames, por isso nenhum dos dois
sites reagia.

Validei-os de forma determinística: intercetei o construtor `IntersectionObserver`, voltei a
disparar o `DOMContentLoaded` para o `main.js` se registar através da minha versão, e invoquei
os callbacks reais com entradas sintéticas. Resultados:

- **3 observers**, com exatamente as opções da origem: reveal (`rootMargin: '0px'`,
  `threshold: 0.1`, 17 elementos), skills (`threshold: 0.1`, o `#skills-grid-container`) e
  scrollspy (`rootMargin: '-40% 0px -40% 0px'`, `threshold: 0`, as 5 secções).
- **Scrollspy**: com `#about` a intersectar, `active-link` fica só em `#about`; idem para
  skills, projects e contacts. Com `#hero` (que não tem link no menu), fica sem nenhum ativo —
  o mesmo que o original faz.
- **Reveal**: escalonamento confirmado — a 0 ms nenhum visível, a 120 ms os dois primeiros
  (0 ms e 100 ms), a 270 ms os três. `unobserve` chamado para os 3 logo na primeira passagem,
  por isso cada elemento revela uma vez só. Entradas com `isIntersecting: false` são ignoradas.
  Repetir o callback não duplica a classe.
- **Skills**: cascata até 16/16 e `unobserve` do contentor.

No painel visível chegou a confirmar-se o disparo real: 3 dos 17 `.reveal` (exatamente os que
estão acima da dobra) ganharam `is-visible` sozinhos ao carregar.
