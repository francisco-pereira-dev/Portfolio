# Fase 15 — relatório técnico

Data: 2026-09-22. Suavizar o fade de abertura do menu overlay. Uma só alteração, num só
ficheiro. **Publicado com autorização expressa do Francisco**, dada no enunciado do
fecho da fase.

---

## 1. O que já existia

**Há um só menu, e não é só de telemóvel.** O botão de três traços está no
`src/components/Navbar.astro` e o painel no `src/components/OverlayMenu.astro`, ambos
usados nas 18 páginas, incluindo as duas do CV. **Nenhuma media query esconde o botão**:
ele aparece também a 1440px, e o `audit:teclado` testa-o nessa largura. A única outra
navegação é a versão sem JavaScript (`NavSemJs.astro`), que é uma lista de links, sem
botão e sem animação. Mexer no fade mexe no menu em todos os tamanhos de ecrã.

**Abre por classe.** O `src/scripts/main.js` põe `active` no menu e no botão, atualiza o
`aria-expanded`, trava o scroll do corpo e marca como `inert` tudo o que fica por trás,
menos o cabeçalho onde está o botão que o fecha.

**Já existia um fade, completo e simétrico**, e não um deslizamento: `.overlay-menu` a
`opacity: 0` com `visibility: hidden`, e `transition: opacity 0.4s ease, visibility 0s
linear 0.4s`; a regra `.active` com o mesmo, e o atraso da visibilidade a zero.

Dois factos medidos no browser antes de decidir seja o que for:

1. **A duração está acoplada à acessibilidade.** O atraso de 0,4s na `visibility` existe
   para os links saírem da ordem de tabulação só quando o fade acaba (decisão da fase
   5). Medido: a visibilidade passava a `hidden` aos 401 ms do clique de fecho. Mudar a
   duração sem mudar o atraso deixa os links tabuláveis depois de o menu desaparecer, ou
   corta o fade a meio.
2. **O conteúdo do menu não anima na abertura.** A `.overlay-content` tem a classe
   `reveal` (0,8s, com `translateY`), mas o observador dá-lhe `is-visible` no
   carregamento da página, por trás do menu invisível. Confirmei que já está revelada e
   sem transformação com o menu fechado. Na abertura há só o fade do painel.

**O `prefers-reduced-motion` não cobria o menu.** O bloco só tinha o `scroll-behavior` e
a seta de voltar ao topo.

---

## 2. A pergunta, e a decisão

O enunciado dava a medida (150–200 ms, `ease-out`) para o caso de **não** existir fade.
Existindo um de 400 ms, "torná-lo mais suave" podia ir em direções opostas, e a regra da
fase mandava parar e perguntar. Apresentei três hipóteses, todas com o efeito já medido:

| Hipótese | Duração | Curva | Consequência |
|---|---|---|---|
| **A (escolhida)** | 0,4s | `ease-out` | não toca no atraso da visibilidade nem no timing de mais nada |
| B | 0,2s | `ease-out` | mais lesto, não mais suave; obriga a baixar o atraso para 0,2s |
| C | 0,55s | `cubic-bezier(0.33, 0, 0.2, 1)` | o mais gradual; meio segundo até o menu estar utilizável |

O Francisco escolheu a **A**.

---

## 3. O que mudou

Um ficheiro, `src/styles/global.css`, com três regras tocadas e 21 linhas acrescentadas
(quase todas comentário):

- `.overlay-menu` e `.overlay-menu.active`: `opacity 0.4s ease` → `opacity 0.4s
  ease-out`. **A duração e o atraso da `visibility` ficaram como estavam.**
- o bloco `@media (prefers-reduced-motion: reduce)` passou a incluir `.overlay-menu` e
  `.overlay-menu.active` com `transition: none`.
- o comentário no CSS diz porquê, com as percentagens medidas, e avisa que a duração e o
  atraso da visibilidade andam sempre juntos.

**Não se tocou em mais nada:** nem no botão de três traços (que tem a sua própria
transição de fundo, da fase 5), nem na revelação de 0,8s do conteúdo, nem no JavaScript,
nem em texto do site.

---

## 4. As medições

**A curva, na abertura** (opacidade medida a cada frame, a 375px):

| Momento | 100 ms | 200 ms | 300 ms | 400 ms |
|---|---|---|---|---|
| Antes (`ease`) | 0,41 | 0,76 | 0,94 | 1,00 |
| Depois (`ease-out`) | 0,32 | 0,64 | 0,88 | 1,00 |

Com `ease` o menu chegava a 76% aos 200 ms e o resto do percurso quase não se via; com
`ease-out` o crescimento é regular e trava no fim.

**O fecho** continua simétrico: a visibilidade passa a `hidden` aos 400 ms do clique.

**Com `prefers-reduced-motion: reduce`:**

| | Transição computada | Opacidade a 1 | `visibility: hidden` |
|---|---|---:|---:|
| Sem preferência | `opacity 0.4s ease-out, visibility 0s linear 0.4s` | 411 ms | 400 ms |
| Movimento reduzido | `none` | 0 ms | 3 ms |

Sem movimento, a visibilidade deixa de esperar pelos 400 ms: os links entram e saem da
ordem de tabulação no instante certo.

---

## 5. A prova byte a byte

O estado anterior foi reconstruído a partir do blob do commit publicado, com a versão
nova guardada à parte e reposta a seguir.

| Verificação | Resultado |
|---|---|
| As 18 páginas | mudam **só na linha 72**, o `href` do CSS partilhado, cujo nome leva um hash do conteúdo (o mesmo efeito da fase 14); confirmado página a página |
| O CSS partilhado | 22 029 B → 22 082 B (+53 B); as **únicas** regras diferentes são as duas do menu e o bloco de movimento reduzido |
| Os outros 27 ficheiros do `dist` | byte a byte iguais: os dois PDF, as 8 fontes, as imagens, o sitemap, o favicon e o CSS do CV |
| As 4 capturas do menu aberto (mobile e desktop × 2 temas) | **byte a byte iguais** antes e depois: o menu aberto é idêntico ao pixel, e só mudou o percurso até lá |

**A bateria de verificação**, pela ordem do projeto:

| Verificação | Resultado |
|---|---|
| `npm run build` | exit 0, zero avisos, 18 páginas |
| `check:i18n` | OK |
| `check:texto` | 1026 verificações, zero divergências |
| `npm run cv` | dois PDF de uma página, 8,9 mm de folga, os SHA-256 de sempre |
| `npm run build` (de novo) | exit 0, 18 páginas |
| `audit:a11y` | **zero falhas**: 0 violações axe, contraste mínimo 5,70:1 e 5,02:1 |
| `audit:teclado` | **zero falhas** |
| `npm run mapa` e `--verificar` | 102 ficheiros = 102 linhas, em dia |

A auditoria de acessibilidade abre o menu e corre o axe com ele aberto, nos dois temas,
e por isso cobre o estado que esta fase tocou. Não houve regressão.

---

## 6. A publicação

O commit leva a alteração ao CSS e a documentação desta fase. O último commit, só de
documentação, fecha a fase com o hash publicado e a hora da Action; o resultado da Action
desse commit está na resposta final da sessão, porque este relatório vai dentro dele.

## Decisões que tomei sozinho

1. **Perguntar com três hipóteses medidas**, em vez de propor uma só, porque o enunciado
   tinha sido escrito para o caso de não existir fade nenhum.
2. **O `prefers-reduced-motion` só para o menu**, e não para o botão de três traços nem
   para a revelação de 0,8s: o enunciado mandava não tocar em mais nada. Ficam de fora, e
   é matéria para outra fase.
3. **A razão da curva escrita no CSS**, com as percentagens, e o aviso do acoplamento
   entre a duração e o atraso da visibilidade.

