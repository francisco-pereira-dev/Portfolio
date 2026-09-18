# Fase 4.2b — Correções de texto e design: relatório técnico

Nesta fase entraram:

- **nove correções de texto** (Parte 1);
- **a passada de design** (Parte 2):
  - hero, cabeçalhos, introduções e contactos centrados;
  - cabeçalhos de secção numerados;
  - fundos alternados;
  - um degrau a menos de espaçamento vertical;
  - uma seta de voltar ao topo;
- **a documentação atualizada** (Parte 3).

Nada foi commitado nem enviado. Não entraram cores, fontes nem dependências novas.
Os 17 custom properties de cor e as escalas ficaram com os mesmos valores.

## Colisões resolvidas antes de implementar

| Colisão | Decisão do Francisco |
|---|---|
| No tema claro, `--bg-color` (`#F8FAFC`) e `--surface-color` (`#FFFFFF`) diferem 1,04:1: a alternância quase não se vê, e não há outra variável clara bem mais escura | Como pedido, e reportado |
| Um botão fixo passa por cima do texto durante o scroll; a 375px a margem é de 24px e o botão tem 44px | "Não tapar" quer dizer: parado no fim da página, nunca sobre texto nem links |
| O `aria-label` da seta tem de ser traduzido, mas o enunciado não dá o texto | "Voltar ao topo" / "Back to top", registado no canónico |

## Parte 1 — correções de texto

Cada texto entrou primeiro em `content/texto-canonico.json`, com a fonte
`fase-4.2b`, e foi gerado para os dados. Cada ficheiro gerado foi confirmado igual
ao canónico. O texto substituído ficou em `retirado.fase-4.2b`, com o motivo.

| # | Onde | Novo (PT) |
|---|---|---|
| 1.1 | Gest · `umaFrase` | Uma loja online de informática com gestão de armazém, construída em OutSystems e apresentada como Prova de Aptidão Profissional. |
| 1.2 | Gest · `resumo` | Loja online de informática com gestão de armazém, construída em OutSystems e apresentada como Prova de Aptidão Profissional do ensino secundário. |
| 1.3 | Gest · etiqueta | Prova de Aptidão Profissional · 2021 |
| 1.4 | DAE · `contexto` | Sai "Acabei por assumir a maior parte do desenvolvimento." |
| 1.5 | Cadflow · etiqueta | C++ · Desktop |
| 1.6 | Cadflow · `contexto` | Resolvido individualmente em cerca de um mês. C++ com MFC, sobre Windows. |
| 1.7 | Cadflow · `resultado` | Entregue, com resposta positiva da empresa. |
| 1.8 | Licas · etiqueta | Cliente real |
| 1.9 | Modais do Mr. Pizza e do Diane Arbus | Sem descrição: ficam as features e os links |

Em inglês, cada texto ficou tal como no enunciado. Entrou também uma chave de
i18n, `a11y-back-to-top`; o i18n passou de 54 para 55 chaves.

**Nota sobre o texto final:** no Gest em inglês, a frase da linha (1.2) e a
`umaFrase` (1.1) são exatamente a mesma frase. Em português, "Prova de Aptidão
Profissional" aparece na etiqueta, na frase da linha, na `umaFrase` e no contexto.
Não mexi, porque o texto é final. Fica para decidires.

## Ficheiros alterados

O diff contra o HEAD (`9810f88`) acumula três fases por commitar: o fim da Fase 4,
a 4.2a e esta. A coluna "Nesta fase" é a diferença entre o diff de agora e o do fim
da 4.2a. É aproximada, porque o `numstat` não se subtrai exatamente.

| Ficheiro | Acumulado (+/−) | Nesta fase (≈ +/−) | O que mudou nesta fase |
|---|---|---|---|
| `src/styles/global.css` | 201 / 136 | +143 / −20 | Cabeçalhos, fundos, alinhamentos, ritmo, seta, espaço do rodapé; sai `.modal-desc` |
| `content/texto-canonico.json` | 289 / 76 | +58 / −10 | As 8 correções, `a11y-back-to-top`, `retirado.fase-4.2b`, fonte e nota `_fase4.2b` |
| `scripts/check-texto.mjs` | 63 / 34 | +29 / −0 | Cabeçalhos de secção; modais sem descrição nem a frase da linha |
| `src/components/SectionHeading.astro` (novo) | 27 / 0 | +27 / −0 | Cabeçalho de secção numerado |
| `src/scripts/main.js` | 26 / 46 | +23 / −0 | Seta de voltar ao topo |
| `src/layouts/BaseLayout.astro` | 19 / 0 | +19 / −0 | Botão da seta |
| `src/components/About.astro`, `Skills.astro`, `Projects.astro`, `Contacts.astro` | | +2 / −1 cada | `h2` substituído pelo `SectionHeading` |
| `src/components/ProjectModal.astro` | 3 / 16 | +2 / −1 | Sem descrição |
| `src/content/projects/gest.json` · `licas.json` · `dae.json` · `cadflow-bank-system.json` | | +4/−4 · +2/−2 · +2/−2 · +2/−2 | Textos da Parte 1 |
| `src/i18n/pt.json`, `en.json` | 10 / 14 cada | +2 / −1 cada | `a11y-back-to-top` |
| `CLAUDE.md`, `ESTADO-ATUAL.md` | reescritos | | Parte 3 |

## Parte 2 — CSS por secção

**Cabeçalhos de secção** (`.section-header` e `SectionHeading.astro`):

- a coluna é centrada, com `margin-bottom: --sp-8` (antes `--sp-12`, no `h2`);
- a linha de cima, `.section-eyebrow`, é `--fs-micro`, peso 600, 0.08em, maiúsculas,
  a `--text-secondary`;
- o número, `.section-num`, é `--accent-text`;
- o título continua `--fs-h2`;
- a régua, `.section-rule`, tem 48×2px, `--accent-color` e `--sp-4` por cima.

A marcação é um `<header>` com "01 — Sobre", o `<h2>` e a régua. A linha de cima
tem `aria-hidden`.

**Fundos e secções:**

- saiu a régua `border-top` entre secções;
- Sobre e Projetos têm `--surface-color`, e Competências e Contactos `--bg-color`;
- o hero é transparente sobre o `body`, que é `--bg-color`;
- a cor vai de bordo a bordo com `box-shadow: 0 0 0 100vmax <cor>` e
  `clip-path: inset(0 -100vmax)`: a sombra estende a cor para os lados e o
  `clip-path` corta-a em cima e em baixo;
- uma sombra não conta para o scroll, por isso não há scroll horizontal;
- o espaço interno passou de `--sp-24` para `--sp-16`, e no telemóvel de `--sp-16`
  para `--sp-12`.

**Hero:**

- centrado por inteiro: `text-align: center`, e o conteúdo em coluna com
  `align-items: center`;
- espaço de `--sp-32`/`--sp-16` para `--sp-24`/`--sp-12`, também no telemóvel;
- espaço interno, um degrau abaixo:

  | Elemento | Antes | Depois |
  |---|---|---|
  | foto | `--sp-6` | `--sp-4` |
  | nome | `--sp-8` | `--sp-6` |
  | subtítulo | `--sp-6` | `--sp-4` |
  | parágrafo | `--sp-12` | `--sp-8` |

- as ações ficam centradas, com o mesmo `--sp-8` entre elas.

**Sobre:** a coluna de leitura (`--measure`) fica centrada com `margin: 0 auto`, e
o texto dentro dela fica à esquerda.

**Projetos:**

- o destaque passou de `--sp-16` para `--sp-12` em baixo;
- as linhas passaram de `--sp-8` para `--sp-6` em cima e em baixo, e de `--sp-6`
  para `--sp-4` no telemóvel;
- a sub-secção "Design → Código" passou de `--sp-16` para `--sp-12` em cima, com o
  título e a introdução centrados e a introdução de `--sp-8` para `--sp-6` em baixo;
- as linhas continuam à esquerda.

**Contactos:**

- a introdução fica centrada, e passou de `--sp-12` para `--sp-8` em baixo;
- os cartões ficam centrados (`justify-content: center`), e o espaço entre eles
  passou de `--sp-16` para `--sp-12`.

**Rodapé:** tem `--sp-24` em baixo, reservado para a seta, e mantém a régua de cima.

**Modais:** saiu a regra `.modal-desc`, que deixou de ter uso.

**Case studies:** nada mudou. Não são secções da página inicial, e a largura de
leitura tinha de ficar igual.

## A seta de voltar ao topo

**Marcação** (`BaseLayout.astro`, em todas as páginas):

```html
<button type="button" id="back-to-top" class="back-to-top" aria-label="Voltar ao topo">
  <svg viewBox="0 0 24 24" … aria-hidden="true" focusable="false">…seta para cima…</svg>
</button>
```

**CSS:**

- `position: fixed` a `--sp-6` do canto inferior direito, com `--touch` (44px) de lado;
- redonda, com fundo `--surface-color`, contorno de 1px `--border-color` e seta de
  20px a `--text-primary`;
- `z-index: 1400`, abaixo do menu overlay (1500) e das modais (2999);
- escondida com `opacity: 0` e `visibility: hidden`, que a tira da ordem de
  tabulação;
- a opacidade transita em 0,3s, e a `visibility` só muda no fim da transição;
- com `prefers-reduced-motion: reduce`, não há transição e o `scroll-behavior` do
  site passa a `auto`.

**JavaScript** (`main.js`):

- no `scroll` (passivo) e no `resize`, a classe `is-visible` liga-se quando o
  `scrollY` passa o fim do hero;
- nas páginas sem hero, o limite é uma altura de ecrã;
- no clique, o site volta ao topo com `behavior: 'smooth'`, ou `'auto'` com
  movimento reduzido;
- depois do clique o foco passa ao botão do menu, para não se perder quando a seta
  desaparece.

**Não tapar conteúdo:** o botão fica a 68px do fundo do ecrã (24 + 44), e o rodapé
reserva 96px em baixo.

## Critérios de aceitação

| # | Critério | Resultado |
|---|---|---|
| 1 | Build sem avisos | ✅ exit 0, 0 avisos, 16 páginas |
| 2 | `check:i18n` | ✅ 55 chaves de cada lado |
| 3 | `check:texto` cobre a Parte 1 | ✅ **890 verificações, zero divergências**, zero texto fora do canónico. Passou a verificar os cabeçalhos e as modais sem descrição |
| 4 | Comparação string a string da Parte 1 | ✅ **24 strings e as 2 modais nas duas línguas, 0 divergências**. Usei uma cópia à parte do enunciado, e cada string foi procurada como nó de texto inteiro na página certa |
| 5 | Zero "construída numa empresa" e "built inside a company" | ✅ 0 e 0, em texto, atributos e JSON-LD das 16 páginas |
| 6 | "ITGlee" em exatamente dois sítios por língua | ✅ PT: Sobre e contexto do Gest; EN: About e contexto do Gest. Confirmado dentro da secção certa |
| 7 | "desafio técnico proposto por uma empresa" no máximo 2 por língua | ✅ 1 em PT e 1 em EN ("technical challenge set by a company"), na frase da linha |
| 8 | As modais não contêm a frase da linha | ✅ Mr. Pizza e Diane Arbus, nas duas línguas: sem descrição nem frase; 3 features e 2 links cada |
| 9 | Cabeçalhos centrados, numerados e com régua | ✅ No HTML, os 4 por língua são o primeiro elemento da secção, com número, nome, título e régua. No browser, 24 medições: `text-align: center`, régua 48×2 com desvio de 0px do centro, número a roxo e nome a cinzento |
| 10 | Fundos alternados, nos dois temas | ✅ Pela ordem pedida, nos dois temas, de bordo a bordo e sem régua. Medido com as transições desligadas |
| 11 | À esquerda: linhas, Sobre, corpo dos case studies | ✅ 48 medições (16 páginas × 3 larguras): nenhum texto dessas zonas fora da esquerda |
| 12 | Cartões de contacto centrados | ✅ `justify-content: center` e desvio de 0px do centro da secção, nas duas línguas e nas três larguras |
| 13 | Seta | ✅ Ver abaixo |
| 14 | Contraste ≥4,5:1 | ✅ com a exceção aprovada. 2372 textos, 16 páginas, dois temas, modais abertas. Ver abaixo |
| 15 | Sem scroll horizontal | ✅ 48 medições, nenhuma com scroll |
| 16 | Zero erros de consola | ✅ 16 páginas, num separador limpo, também depois de usar modal, Escape, seta, tema e menu |
| 17 | Nenhum ficheiro acima de 500 KB | ✅ 41 ficheiros, 1 391,9 KB; o maior é o `CV.pdf`, com 380 KB |
| 18 | `CLAUDE.md` e `ESTADO-ATUAL.md` atualizados | ✅ ver "Parte 3" |

**Seta, 48 medições (16 páginas × 1440, 900 e 375px):**

- no topo está escondida;
- 20px antes do fim do hero continua escondida, e 20px depois fica visível;
- recebe o foco pelo teclado e tem sempre 44×44px;
- o `aria-label` é "Voltar ao topo" em PT e "Back to top" em EN;
- **parada no fim da página, não fica sobre nenhum texto nem link**, em nenhuma
  das 48 medições;
- o clique pede `scrollTo({ top: 0, behavior: 'smooth' })` e passa o foco ao botão
  do menu;
- de volta ao topo, a classe sai e, sem a transição, a seta fica `hidden` e sai da
  ordem de tabulação.

Nas primeiras medições a seta ainda contava como visível no topo. Era o atraso de
0,3s da transição, que não progride no painel escondido; desligada a transição, o
estado é o certo.

**Contraste, as três piores combinações:**

1. **"Ver projetos", 4,23:1** nos dois temas: a exceção aprovada.
2. **"O que correu mal", âmbar no tema claro, 5,02:1.**
3. **Roxo de texto sobre os fundos alternados no tema escuro, 5,38:1:** os números
   "01" e "03" dos cabeçalhos do Sobre e dos Projetos, e a etiqueta "Cliente real".

Mínimo por tema, sem a exceção: 5,38:1 no escuro e 5,02:1 no claro.

## Parte 3 — documentação

**`CLAUDE.md`:**

- 7 case studies e 2 modais sem descrição;
- a foto no hero;
- os rótulos atuais;
- a ausência de linguagem de procura de emprego;
- "A minha parte" só em projetos de equipa;
- **a regra de não repetição, com a distinção assente:** resumo e detalhe não são
  repetição; o mesmo facto escrito duas vezes é;
- as decisões de design desta fase;
- os limites do ambiente de teste que apareceram: painel escondido, limite de 45s
  por chamada, servidor que pára, separador inutilizado.

**`ESTADO-ATUAL.md`:**

- a tabela dos 9 projetos com página, modal, "A minha parte", screenshot e imagem de
  partilha;
- a página inicial de cima para baixo;
- as verificações com os números de hoje;
- os ficheiros por commitar das três fases;
- os commits feitos fora das sessões;
- o que falta;
- as decisões por rever.

## Decisões que tomei sozinho

1. **O nome da secção no cabeçalho é o rótulo do menu** ("Sobre", "Competências",
   "Projetos", "Contactos"). É texto já aprovado, e "01 — SOBRE" bate com o
   enunciado. A linha fica `aria-hidden`, porque o leitor de ecrã já lê o título.
2. **Fundos de bordo a bordo com sombra e `clip-path`**, em vez de mudar o HTML ou a
   largura do `main`.
3. **Onde desci o ritmo:** tudo desceu exatamente um degrau na escala (ver
   "Parte 2").
   - **Não mexi nos case studies:** a tarefa fala das secções da página inicial e
     manda manter a largura de leitura.
   - **O hero continua a ocupar um ecrã de altura:** só o espaço de cima e de baixo
     desceu.
4. **A coluna do Sobre fica centrada**, para ficar alinhada com o cabeçalho centrado.
   O texto continua à esquerda.
5. **O título e a introdução da sub-secção "Design → Código" ficam centrados**, como
   os das secções. As linhas por baixo ficam à esquerda.
6. **O conteúdo das Competências não mudou de alinhamento.** Não estava em nenhuma
   das duas listas: os títulos dos grupos e as listas ficam à esquerda.
7. **A seta também existe nos case studies**, a partir de uma altura de ecrã, porque
   não há hero.
8. **Depois do clique, o foco passa ao botão do menu.** Sem isso, o foco perdia-se
   quando a seta desaparece.
9. **Com `prefers-reduced-motion`, o `scroll-behavior` do site inteiro passa a
   `auto`.** Afeta também as âncoras do menu, e não só a seta.
10. **O rodapé mantém a sua régua de cima**, porque não é uma secção, e ganhou
    `--sp-24` de espaço em baixo para a seta.
11. **A seta usa `--surface-color`**, como pedido. Nas secções com esse fundo (Sobre,
    Projetos) distingue-se só pelo contorno.

## Por fazer ou por decidir

- **Tema claro:** a alternância de fundos quase não se vê (1,04:1). Aceite para
  decidir depois de ver.
- **Repetições que ficaram:** a frase da linha e a `umaFrase` do Gest em inglês são
  iguais, e "Prova de Aptidão Profissional" aparece 4 vezes no Gest em português.
- **A seta nas secções `--surface-color`** confunde-se com o fundo.
- **O "×" das modais continua sem nome acessível.**
- **Não houve verificação visual por imagem:** o painel do browser corre escondido,
  e tudo foi medido por script.
- **O site publicado continua na Fase 4 intermédia.** As fases 4, 4.2a e 4.2b estão
  por commitar.
