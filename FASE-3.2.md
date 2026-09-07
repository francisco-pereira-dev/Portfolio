# Fase 3.2 — Projetos: três novos, reordenação e correções

Três projetos acrescentados, os nove reordenados, descrições imprecisas
substituídas, estados de botão implementados e um bloco de recurso para os
projetos ainda sem screenshot.

## ⚠️ Um problema que não é meu para resolver

**O repositório `TI` já não existe.** Devolve 404 no HEAD, no GET e na API do
GitHub, e não aparece na lista de repositórios públicos da conta — que hoje tem
nove: `3D-Analyzer`, `Ainet2425`, `CadflowBankSystem`, `Catalogo-Diane-Arbus`,
`DAE`, `MR.PIZZA`, `PAP`, `Portfolio` e `francisco-pereira-dev`.

Na fase 3.1, há poucas horas, este mesmo URL devolvia 200. Foi apagado ou
tornado privado entretanto.

São **4 links partidos por página**:

| Onde | URL |
|---|---|
| Competências → JavaScript | `github.com/francisco-pereira-dev/TI` |
| Competências → PHP | `github.com/francisco-pereira-dev/TI` |
| Competências → REST APIs | `github.com/francisco-pereira-dev/TI` |
| Projeto Hotel Inteligente → repositório | `github.com/francisco-pereira-dev/TI.git` |

Não lhes toquei. Nada disto estava no âmbito desta tarefa, e a decisão é tua:
voltar a tornar o repositório público, ou dizeres-me o que pôr no lugar. É o
único motivo pelo qual o critério 6 falha.

## Os 9 projetos, pela ordem final

| # | Projeto | Estado | Botão de demo | Botão de repositório | Imagem |
|---:|---|---|---|---|---|
| 1 | Licas | `in-development` | **inerte** — "Em desenvolvimento" | **nenhum** (repo privado) | falta |
| 2 | DAE | `live` | Ver Projeto | Ver Repositório | tem |
| 3 | AINET | `live` | Ver Projeto | Ver Repositório | tem |
| 4 | 3D Analyzer | `no-demo` | nenhum | Ver Repositório | falta |
| 5 | CadflowBankSystem | `no-demo` | nenhum | Ver Repositório | falta |
| 6 | Hotel Inteligente | `live` | Ver Projeto | Ver Repositório (**404**, ver acima) | tem |
| 7 | Gest | `no-demo` | nenhum | Ver Repositório | tem |
| — | *separador* | | | | |
| 8 | Mr. Pizza | `live` | Ver Projeto | Ver Repositório | tem |
| 9 | Catálogo Diane Arbus | `live` | Ver Projeto | Ver Repositório | tem |

Os avisos de arranque a frio continuam nos três que os tinham: AINET, DAE e
Hotel Inteligente.

### Estados dos botões

- **`live`** — `<a>` normal para a demo, mais o repositório.
- **`in-development`** — `<span class="btn-modal btn-modal-disabled"
  aria-disabled="true">`, com opacidade 0.55, `cursor: not-allowed` e o hover
  neutralizado. Não é `<a>` nem tem `href`. Verificado no HTML gerado: a modal
  do Licas tem **zero** elementos `<a>`.
- **`no-demo`** — não há botão de demonstração, só o do repositório.
- **Sem `repoUrl`** — não há botão de repositório. O Licas é privado; um link
  daria 404.

O schema passou a rejeitar `in-development` com `demoUrl`, pela mesma lógica que
já rejeitava `no-demo` com `demoUrl`.

## Imagens em falta

Três projetos ainda não têm screenshot:

- **Licas** — `licas.png` ou `.webp`
- **3D Analyzer** — `3d-analyzer.png`
- **CadflowBankSystem** — `cadflow-bank-system.png`

O build **não falha** por causa disto: `image` passou a opcional no schema. Mas
a validação não enfraqueceu — acrescentei duas regras no `superRefine`:
`image` sem `imageAlt` é erro, e `imageAlt` sem `image` também. Uma imagem sem
texto alternativo é um defeito de acessibilidade; um alt sem imagem é lixo.

A integração que faz o build falhar quando falta um ficheiro referenciado
continua ativa e não precisou de mudança: já ignorava entradas sem campo `image`.

**Nota sobre o Gest:** não toquei nas imagens deste projeto. O produto foi
construído na ITGlee e é propriedade deles.

## O bloco de recurso

Ocupa **exatamente a mesma caixa** que uma imagem real teria, para a grelha não
se mexer quando as fotografias chegarem. Medido: 450×200 a 1440px, 395×200 a
900px, 309×200 a 375px — idêntico aos `.project-thumb` dos projetos com imagem.
Dentro da modal herda a altura do `.modal-img`, incluindo a redução para 200px
abaixo dos 768px.

Composição:

- Fundo com as cores do site: um `radial-gradient` com o `--shadow-glow` roxo
  sobre um `linear-gradient` entre `--surface-hover` e `--surface-color`. É o
  mesmo vocabulário visual da imagem OG.
- **Iniciais** grandes na cor de acento, derivadas do nome curto do projeto — a
  parte antes do travessão, até duas palavras: `Licas` → **L**,
  `3D Analyzer` → **3A**, `CadflowBankSystem` → **C**.
- **Tecnologias** por baixo, em texto secundário, separadas por `·`.

Para leitores de ecrã é um `role="img"` com `aria-label` igual ao título do
projeto; as iniciais e a lista de tecnologias vão `aria-hidden`, para não serem
lidas duas vezes.

**Uma redundância que deixo assinalada:** no cartão, as tecnologias aparecem
duas vezes — no bloco de recurso e nas badges logo abaixo. O enunciado pedia as
tecnologias no bloco, por isso mantive-as, mas é visível. Na modal não há
redundância, porque a modal não tem badges. Se preferires, tiro-as do bloco.

## Sub-secção Design → Código

Modelei-a como dados e não como uma lista fixa no template: o schema ganhou
`group: 'main' | 'design'`, com `main` por omissão, e os dois projetos de
tradução de design estão marcados como `design`. O componente filtra por esse
campo. Acrescentar ou tirar um projeto da sub-secção passa a ser uma linha de
JSON.

Visualmente, é separada por uma régua horizontal e 4rem de espaço, com o
cabeçalho e a nota centrados, antes da grelha dos dois cartões.

## Chaves de i18n novas (3)

| Chave | PT | EN |
|---|---|---|
| `projects-design-heading` | Design → Código | Design → Code |
| `projects-design-text` | Dois exercícios de tradução… | Two translation exercises… |
| `project-status-in-development` | Em desenvolvimento | In development |

De 46 para **49 chaves** em cada língua.

## Correções de conteúdo

- **Gest** — tagline nova a juntar estágio e PAP; descrição substituída.
  Features mantidas.
- **Mr. Pizza** — a descrição dizia que a plataforma tinha sido "desenvolvida
  para a cadeia Mr. Pizza", o que não era verdade. Substituída. As tags passaram
  de `HTML/CSS/JavaScript/Figma` para `React/TypeScript/Figma`, que é o que o
  repositório tem.
- **Catálogo Diane Arbus** — descrição substituída; tags de `HTML/CSS/Figma`
  para `React/TypeScript/Figma`.

Ambas as descrições novas dizem explicitamente que o protótipo inicial foi
gerado com Figma Make.

## Critérios de aceitação

| # | Critério | Resultado |
|---|---|---|
| 1 | `npm run build` passa, Zod valida as 9 entradas | ✅ exit 0, 9 entradas validadas |
| 2 | `npm run check:i18n` | ✅ 49 chaves de cada lado |
| 3 | Os 9 projetos pela ordem exata, nas duas línguas | ✅ verificado nos dois HTML gerados |
| 4 | Texto exatamente o do enunciado | ✅ **58/58 strings**, comparação automática, zero divergências |
| 5 | Licas sem `<a>` para demo ou repositório | ✅ **zero** `<a>` na modal e no cartão |
| 6 | Zero links 404 | ❌ **falha** — 4 links para o repositório `TI`, que já não existe. Ver secção no topo |
| 7 | Sem "desenvolvida para a cadeia Mr. Pizza" | ✅ zero ocorrências, nas duas línguas |
| 8 | Recurso de imagem sem partir a grelha | ✅ 450×200 / 395×200 / 309×200, igual aos thumbs reais |
| 9 | Sem scroll horizontal | ✅ zero elementos a transbordar nas três larguras |
| 10 | Nenhum ficheiro acima de 500 KB | ✅ `dist/` com 1,06 MB em 31 ficheiros |

### Sobre o critério 6

Testei os 22 links externos distintos. Três deram erro sem estarem partidos:

| URL | Código | Explicação |
|---|---|---|
| `linkedin.com/in/francisco-pereira-dev/` | **999** | Código anti-scraping do LinkedIn. Mantém-se 999 mesmo com User-Agent de browser; o link funciona |
| Figma Make — Mr. Pizza | **404 → 200** | O Figma bloqueia agentes não-browser. Com User-Agent de Chrome devolve 200 e 763 KB de HTML |
| Figma Make — Diane Arbus | **404 → 200** | Idem, 765 KB |

Os restantes 19 devolveram 200, **exceto os dois URLs do `TI`**, que são um 404
genuíno.
