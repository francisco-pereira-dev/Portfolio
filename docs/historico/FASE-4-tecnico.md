# Fase 4 — Direção editorial: relatório técnico

Implementa a direção editorial: escalas de tipografia e de espaçamento como
tokens, hero reestruturado, projetos em lista em vez de cartões, modais só nos
três projetos sem case study, páginas de case study refinadas, competências e
contactos como informação, e revisão a 375px. Nenhuma palavra do site mudou:
o `check:texto` passa com zero divergências e zero texto fora do canónico.

## ⚠️ Estado do repositório — ler primeiro

Durante a tarefa foram feitos commits e push **fora desta sessão**. Não fiz
nenhum commit nem nenhum push.

| Hora (UTC+1) | Commit | O que é |
|---|---|---|
| 16:04 | `e636a1e` / `740a9ec` | "Phase 4: projects list, UI & content changes": o meu trabalho no estado em que estava nesse momento |
| 16:08 | `21d0811` | apaga os relatórios `FASE-*`, `MIGRACAO-*` e `ICONES.md` |
| 16:09 | `88b375e` | merge com a `origin/main` |
| 16:09 | `9810f88` | "Delete .mds" |

- A `main` local está igual à `origin/main`. As três Actions correram com sucesso, por
  isso **o site publicado mostra a Fase 4 no estado das 16:04**: a lista e as 3
  modais, mas com o `case-study.css` antigo, a imagem ainda nas modais do Mr.
  Pizza e do Diane Arbus, e o "×" com contraste de 3,98:1.
- O histórico tem as fases 3.3 a 3-publicação duas vezes, com hashes diferentes
  (`949a93b` e `4cc7081`, por exemplo): um rebase local foi fundido com a
  `origin/main` que já os tinha.
- O resto do trabalho está **por commitar** na árvore de trabalho, em 5 ficheiros:
  `content/texto-canonico.json`, `scripts/check-texto.mjs`,
  `src/components/ProjectModal.astro`, `src/styles/case-study.css` e
  `src/styles/global.css`.
- As contagens abaixo são feitas contra o `ee02531`, o último commit antes da
  Fase 4. Para as medir, extraí o `ee02531` com `git archive` para
  `node_modules/.cache` e fiz o build dele. Não mexi no git.

## Colisões resolvidas antes de implementar

| Colisão | Decisão do Francisco |
|---|---|
| O `#8B5CF6` como texto dá 3,45–4,23:1 em todos os fundos; o âmbar `#F59E0B` dá 2,15:1 no tema claro; o critério 10 pede 4,5:1 | Tons só para texto, com tokens novos: `--accent-text` (`#A78BFA` escuro, `#7C3AED` claro) e `--warning-text` (`#F59E0B` escuro, `#B45309` claro). Os 17 custom properties ficam iguais |
| Nenhuma cor de texto chega a 4,5:1 sobre o botão `#8B5CF6` | Exceção reportada: "Ver projetos" fica a branco sobre `#8B5CF6`, a 4,23:1 |
| Sem modal, os 6 projetos com case study perdiam as features, a demonstração, o repositório e a nota de arranque a frio | Links e nota passam para o cabeçalho da página de case study; as features desses 6 deixam de aparecer |
| "Ler case study" / "Repositório →" contra "Ver case study" / "Ver Repositório" do canónico; texto do "Copiar email" em falta | Ficam os rótulos atuais. "Copiar email" / "Copy email" e "Email copiado" / "Email copied" entram no canónico |

## Ficheiros alterados (contra o `ee02531`)

| Ficheiro | + | − |
|---|---:|---:|
| `src/styles/global.css` | 681 | 695 |
| `src/styles/case-study.css` | 116 | 48 |
| `scripts/check-texto.mjs` | 120 | 45 |
| `src/components/ProjectRow.astro` (novo) | 80 | 0 |
| `src/scripts/main.js` | 60 | 45 |
| `src/components/Projects.astro` | 54 | 10 |
| `src/layouts/CaseStudyPage.astro` | 49 | 2 |
| `src/components/Contacts.astro` | 37 | 46 |
| `content/texto-canonico.json` | 26 | 12 |
| `src/components/Hero.astro` | 18 | 37 |
| `src/components/About.astro` | 17 | 2 |
| `src/components/ProjectModal.astro` | 7 | 27 |
| `src/layouts/PortfolioPage.astro` | 7 | 2 |
| `src/components/Skills.astro` | 5 | 2 |
| `src/content.config.ts` | 2 | 2 (só comentário) |
| `src/i18n/pt.json`, `src/i18n/en.json` | 2 + 2 | 1 + 1 |
| `src/components/ProjectCard.astro` (apagado) | 0 | 46 |
| `src/components/ProjectImage.astro` (apagado) | 0 | 63 |

O `global.css` foi reescrito quase todo. Os blocos `@font-face` e os 17 custom
properties ficaram iguais byte a byte.

## Escalas

As três escalas estão declaradas em `:root` com os valores do enunciado: 9
tamanhos, 4 alturas de linha e 10 espaçamentos. Acrescentei dois tokens de
medida, que não são de tamanho de letra nem de espaçamento: `--measure: 37.5rem`,
a coluna de leitura da 3.3, e `--touch: 44px`, a altura mínima de um alvo de toque.

| | `ee02531` | Agora |
|---|---:|---:|
| Declarações de `font-size` e espaçamento (`margin*`, `padding*`, `gap`) com valor ad-hoc | **132** (107 no `global.css`, 25 no `case-study.css`) | **0** |
| Declarações que usam as escalas | 6 | 147 |

**Nenhum valor ficou fora da escala.** Não foi precisa nenhuma exceção ótica.

Nas propriedades que não são tamanho de letra nem espaçamento ficaram valores
literais, por não caberem nas escalas:

- `letter-spacing`: −0.02em, −0.01em, 0.04em e 0.08em;
- larguras e alturas: avatar a 8rem, coluna do número a 3rem, 44px, ponto verde a 8px;
- raios e espessuras de linha;
- `text-underline-offset`.

No telemóvel (≤768px), `--fs-display` desce para 2.75rem e `--fs-h1` para 2rem,
os dois dentro da própria escala. O corpo fica em 1.03125rem, 16,5px.

## Regra das modais: o que saiu

As modais passaram de **9 para 3**: CadflowBankSystem, Mr. Pizza e Catálogo Diane Arbus.

| Linguagem | Eliminado |
|---|---|
| HTML gerado | O markup das modais em `index.html` desceu de **13 727 para 3 508 bytes**. A página inteira desceu de 46,8 para 36,7 KB (PT). O HTML sai numa linha só, por isso a medida é em bytes |
| Markup (Astro) | `ProjectModal.astro` desceu de 84 para 64 linhas: saíram o balão "?", o botão de case study e a imagem. `ProjectCard.astro` foi apagado (46 linhas), e com ele o botão "Ver Mais" e o botão de case study do cartão. `ProjectImage.astro` foi apagado (63 linhas) |
| CSS | 107 linhas em 12 blocos: `.modal-info-btn` e o balão (7 blocos), `.btn-view-more` (2), `.modal-img` (2) e `.btn-modal-case` (1) |
| JavaScript | 18 linhas: o bloco dos balões (15) e a limpeza dos balões no `closeModal` (3). Saiu também a cascata das competências (21 linhas; ver "Decisões") |

A gestão de foco, o Escape e o clique fora continuam intactos nas 3 que ficam,
e foram testados. O `closeModal` ganhou uma guarda: sem modal aberta, sai logo.
Antes, o Escape numa página de case study dava um `TypeError` na consola, por não
haver fundo de modal.

## CSS por secção

- **Base:** o corpo passa a `--fs-body` / `--lh-body`. Tem um contorno de foco
  visível em tudo o que se ativa pelo teclado. Todas as secções ficam alinhadas à
  esquerda, separadas por espaço e uma régua de 1px, sem fundos.
- **Navbar:** o menu, o idioma e o tema passam a alvos de 44px. Saíram os efeitos de
  escala no hover. O separador `|` passa de `--border-color` (1,3:1) a `--text-secondary`.
- **Hero:**
  - o badge é só um ponto verde e texto a `--fs-meta`, sem caixa;
  - o h1 fica a `--fs-display`, peso 600, −0.02em, máximo 16ch, com o ponto final
    a roxo em `::after`;
  - o subtítulo fica a `--fs-h3`;
  - o parágrafo fica a `--fs-lead`, `--text-secondary`, com máximo de 62ch;
  - só "Ver projetos" é preenchido; o CV e "Falar comigo" são `.text-link`, com
    sublinhado fino e `--sp-8` entre eles;
  - o avatar saiu do hero.
- **Sobre:** o avatar a 128px ao lado do texto, que fica na coluna de leitura. No
  telemóvel o avatar passa a 96px, por cima do texto.
- **Competências:** quatro listas em duas colunas, sem cartões, ícones nem animação.
  O nome da tecnologia fica a `--fs-small`, e as provas a `--fs-meta` como links
  sublinhados.
- **Projetos:**
  - o destaque do Licas ocupa a largura toda, sem caixa nem imagem, com o título a `--fs-h2`;
  - as linhas usam uma grelha `num | cabeçalho | ação`: o número a `--fs-meta`, o
    título a `--fs-h3` com a etiqueta, a descrição com máximo de 76ch e a stack a
    `--fs-meta`;
  - o separador é de 1px, e o hover é um fundo a 5% de roxo com a ação a mudar de cor.
- **Case study:**
  - o título fica a `--fs-h1` e a frase de abertura a `--fs-lead`, na cor principal;
  - o screenshot aparece depois dela, com legenda a `--fs-meta`;
  - os títulos de secção são maiúsculas a `--fs-micro`, 0.08em, a roxo;
  - cada decisão tem uma barra de 2px a roxo translúcido e título a `--fs-h3`;
  - "O que correu mal" vai numa caixa `--surface-color`, com o rótulo a âmbar.
- **Contactos:** uma lista de três linhas com rótulo e valor. O email tem ao lado o
  botão "Copiar email" e uma região `aria-live` para a confirmação.
- **Modais:** o "×" passa às cores do tema. Sem a imagem por baixo, o branco sobre
  preto a 50% ficava a 3,98:1 no tema claro.

## Decisões que tomei sozinho

1. **Subtítulo do hero.** O enunciado fala do h1 e do "parágrafo de contexto", mas o
   hero tem dois textos. Pus o `hero-subtitle` a `--fs-h3` na cor principal, e o
   `hero-paragraph` a `--fs-lead` como parágrafo de contexto.
2. **O ponto final roxo** usa `--accent-text` e não o `#8B5CF6`, para cumprir os
   4,5:1 (5,45:1 no claro, 6,56:1 no escuro). É CSS, e o h1 continua a ser
   "Francisco Pereira".
3. **As etiquetas** são a tagline de cada projeto, inteira, numa só etiqueta. Não
   existe texto aprovado para estados como "ao vivo" ou "sem demo". DAE, AINET e
   Hotel Inteligente não têm tagline, por isso não têm etiqueta.
4. **O número** é o `order` do projeto, com dois dígitos: 02 a 09, porque o 01 é o
   Licas, em destaque. É decorativo (`aria-hidden`), porque o leitor de ecrã já
   anuncia a posição na lista.
5. **O destaque** é o primeiro projeto por ordem, sem ser da sub-secção de design.
   Hoje é o Licas.
6. **A linha inteira é clicável.** O link do case study, ou o botão que abre a
   modal, estende-se por cima da linha. Nos três sem case study, o título é o botão
   da modal e o "Ver Repositório →" fica por cima dele.
7. **"Ver Mais" saiu.** O enunciado dá o repositório como ação desses três, e com
   isso o rótulo deixou de aparecer. Ficou registado no canónico em `retirado`.
8. **As modais deixaram de ter imagem**, por causa do critério 4: nenhuma imagem de
   projeto na página inicial. Por isso o `imageAlt` do Mr. Pizza e do Diane Arbus
   deixa de aparecer. Está registado no canónico.
9. **A legenda do screenshot** é o `imageAlt`, porque não havia outro texto
   aprovado. Fica com `aria-hidden`, para não ser lida duas vezes.
10. **As decisões técnicas** perderam o número a roxo, que a barra substitui. A
    lista continua um `<ol>`.
11. **Links no case study:** "Ver Projeto", "Ver Repositório" e o rótulo inerte "Em
    desenvolvimento" do Licas vão depois das tecnologias. A nota de arranque a frio
    aparece como parágrafo e já não é um balão.
12. **Cascata das competências:** o §6 manda tirá-la e o §8 diz que os observers de
    animação não mudam. Segui o §6, por ser específico: saiu só esse observer. O
    `.reveal`, o scrollspy, o seletor de idioma e o guarda das fontes ficaram.
13. **O `case-study.css`** passou do breakpoint de 600px para o de 768px, para ficar
    com os dois breakpoints do site. O corpo dos case studies desceu de 17 para
    16,5px (`--fs-body`). Medi outra vez: a média vai de 61,9 a 65,9 caracteres por
    linha e o máximo é 75, dentro dos 60-75.
14. **O `check:texto`** foi adaptado à estrutura nova sem afrouxar nada:
    - o texto de cada projeto é procurado no seu bloco da lista e, nos que não têm
      case study, na modal;
    - passou a verificar que a página inicial só tem o avatar como imagem;
    - passou a verificar que só os 3 projetos sem case study têm modal;
    - passou a verificar a ação de cada linha;
    - nas páginas de case study, passou a verificar o screenshot e a sua posição,
      os links e a nota de arranque a frio.

## Critérios de aceitação

| # | Critério | Resultado |
|---|---|---|
| 1 | Build sem avisos | ✅ exit 0, 0 avisos, 14 páginas |
| 2 | `check:i18n` | ✅ 59 chaves de cada lado |
| 3 | `check:texto`, zero divergências | ✅ 858 verificações, zero divergências, zero texto fora do canónico. Sabotei o `dist` em 4 sítios: um rótulo de ação, uma imagem na lista, a figura do Gest e o "Copy email". Deu 5 divergências (a figura dispara 2 verificações), e depois do rebuild voltou a zero |
| 4 | Zero imagens de projeto na página inicial | ✅ PT e EN: a única `<img>` é o avatar |
| 5 | Exatamente 3 modais | ✅ cadflow-bank-system, mr-pizza, diane-arbus, nas duas línguas |
| 6 | 6 ligam à página sem modal; 3 abrem modal sem página | ✅ um a um, nas duas línguas. No browser, as 3 modais abrem, fecham com Escape e com clique fora, e devolvem o foco |
| 7 | Screenshot nos 4; nada nos 2 | ✅ DAE 39,7 KB, AINET 34,1 KB, Hotel 48,8 KB e Gest 55,9 KB, em WebP. Licas e 3D Analyzer sem imagem, figura nem recurso |
| 8 | Sem scroll horizontal | ✅ 42 medições: 14 páginas a 1440, 900 e 375px |
| 9 | Alvos de toque ≥44px a 375px | ✅ 318 alvos, nenhum abaixo de 44px. Os menores têm exatamente 44px: menu, idioma, tema, ícones sociais, links de prova ("PAP", com 24×44), ações das linhas |
| 10 | Contraste ≥4,5:1 | ✅ com a exceção aprovada. 2224 textos medidos, nos dois temas e nas 14 páginas, com modais e menu. As três piores: **"Ver projetos" 4,23:1** (a exceção, nos dois temas), **"O que correu mal" 5,02:1** (âmbar, claro) e **roxo de texto 5,45:1** (claro) |
| 11 | "Copiar email" copia e confirma | ✅ O clique real mostrou "Email copiado" e limpou-o aos 2 s. No painel escondido a Clipboard API foi recusada, e o recurso (`execCommand('copy')`) devolveu `true`. O texto copiado, `franciscojrp1004@gmail.com`, foi confirmado com a API instrumentada |
| 12 | Temas em todas as páginas | ✅ por medição: sem a exceção, o mínimo é 6,56:1 no escuro e 5,02:1 no claro. Ver "Por fazer" sobre a verificação visual |
| 13 | Zero erros de consola | ✅ 14 páginas. Também sem erros depois de abrir modais, trocar o tema, usar o menu e carregar em Escape |
| 14 | Nenhum ficheiro >500 KB; peso total | ✅ o maior é o `CV.pdf` (380 KB). **1 538,6 KB em 43 ficheiros**, contra 1 834,3 KB em 51 no `ee02531` (−16%) |

## Por fazer

- **Verificação visual por imagem.** O painel do browser correu escondido: não
  desenha e as capturas saem vazias. Tudo acima foi medido por script. Falta olhar
  para o site.
- **Leitura da área de transferência.** O browser recusa a leitura
  (`NotAllowedError`). A cópia foi confirmada pelo caminho do código e pelo
  resultado do `execCommand`.
- **O "×" das modais não tem nome acessível.** Já era assim antes e ficou igual,
  porque acrescentar um `aria-label` é texto novo.
- **A legenda dos screenshots repete o título** do projeto. Uma legenda útil
  precisa de texto aprovado.
- **Site publicado.** Mostra o estado intermédio das 16:04; ver a primeira secção.
  Publicar ou não o resto é decisão tua.
