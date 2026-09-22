# Fase 4.2d — Sobre, instituição, etiquetas, provas internas e fim de "Design → Código": relatório técnico

Nada foi commitado nem enviado. Não entraram cores, fontes nem dependências novas.

## Colisões resolvidas antes de implementar

| Colisão | Decisão do Francisco |
|---|---|
| O botão de informação devia seguir "o padrão do aviso de arranque a frio", mas esse balão "?" saiu na Fase 4 (hoje o aviso é um parágrafo) e nunca funcionou por teclado | Um botão "?" novo e acessível |
| O `aria-label` do botão não vinha no enunciado | "Mais informação" / "More information", registado no canónico |
| As provas "Portfolio" (JavaScript, HTML5/CSS3, Astro) não têm case study nem linha, e a regra não lhes dá destino | Ficam para o GitHub: a única exceção |
| Os rótulos das provas são nomes de repositório, e alguns não coincidem com o projeto ("TI" leva ao Hotel) | Mantêm-se os nomes dos repositórios |

## Ficheiros alterados

O diff contra o HEAD (`9810f88`) acumula cinco fases por commitar. A coluna "Nesta
fase" é a diferença para o diff do fim da 4.2c; é aproximada, porque o `numstat`
não se subtrai exatamente.

| Ficheiro | Acumulado (+/−) | Nesta fase (≈ +/−) | O que mudou nesta fase |
|---|---|---|---|
| `content/texto-canonico.json` | 416 / 113 | +94 / −35 | Hero e meta descrição; sai `about-p3`; sai `projects-design-heading`; entra `a11y-more-info`; contextos do DAE, AINET e Hotel; provas com destino; `retirado.fase-4.2d`; fonte |
| `src/styles/global.css` | 271 / 187 | +60 / −18 | Etiqueta por baixo do título, botão "?" e balão, `scroll-margin-top` nas linhas; sai a sub-secção |
| `src/components/ProjectRow.astro` | 45 / 9 | +35 / −8 | `id="projeto-<slug>"`, etiqueta num bloco por baixo, botão "?" e balão, sem `nivel` (tudo `h3`) |
| `src/scripts/main.js` | 58 / 45 | +32 / −0 | Abrir e fechar os botões "?" |
| `scripts/check-texto.mjs` | 82 / 36 | +23 / −2 | Provas internas, etiqueta por baixo do título, botão "?" |
| `src/components/Projects.astro` | 11 / 68 | +2 / −20 | Uma só lista; sai o filtro por `group` e a sub-secção |
| `src/components/Skills.astro` | 27 / 15 | +13 / −6 | Destino interno das provas |
| `src/data/skills.json` | 17 / 17 | +13 / −13 | Cada prova diz o destino |
| `src/content.config.ts` | 9 / 4 | +4 / −3 | Sai `group`, entra `nota` |
| `src/components/About.astro` | 7 / 19 | (reescrito) | Dois parágrafos |
| `src/components/Seo.astro` | 2 / 1 | +2 / −1 | `alumniOf` |
| `src/content/projects/dae.json`, `ainet.json`, `hotel-inteligente.json` | | +2 / −2 cada | Contexto |
| `src/content/projects/mr-pizza.json`, `diane-arbus.json` | 5 / 1 cada | +1 / −1 cada | `group` → `nota` |
| `src/i18n/pt.json`, `en.json` | 9 / 15 cada | −1 cada | Saem 2 chaves, entra 1; 2 valores trocados |
| `CLAUDE.md`, `ESTADO-ATUAL.md` | reescritos | | Secção 7 |

## Chaves de i18n

O i18n passou de 54 para **53 chaves**.

- **Removidas (2):**
  - `about-p3`: o terceiro parágrafo do Sobre;
  - `projects-design-heading`: o cabeçalho da sub-secção.
- **Criada (1):** `a11y-more-info` ("Mais informação" / "More information").
- **Valor alterado (2):** `hero-paragraph` e `meta-description`, com a instituição
  nova.
- **Mantida com outro uso:** `projects-design-text` é agora o texto do botão "?".

O texto que saiu ficou em `retirado.fase-4.2d` no canónico, com o motivo.

## Mapa completo das provas

Há 33 provas por língua. **30 são internas e 3 externas**: as "Portfolio", a exceção
aprovada. Os rótulos são os nomes dos repositórios.

| Competência | Rótulo | PT | EN |
|---|---|---|---|
| TypeScript | Licas | `/projetos/licas/` | `/en/projects/licas/` |
| TypeScript | MR.PIZZA | `/#projeto-mr-pizza` | `/en/#projeto-mr-pizza` |
| TypeScript | Catalogo-Diane-Arbus | `/#projeto-diane-arbus` | `/en/#projeto-diane-arbus` |
| JavaScript | 3D-Analyzer | `/projetos/3d-analyzer/` | `/en/projects/3d-analyzer/` |
| JavaScript | Portfolio | https://github.com/francisco-pereira-dev/Portfolio | idem |
| JavaScript | TI | `/projetos/hotel-inteligente/` | `/en/projects/hotel-inteligente/` |
| C++ | 3D-Analyzer | `/projetos/3d-analyzer/` | `/en/projects/3d-analyzer/` |
| C++ | CadflowBankSystem | `/projetos/cadflow-bank-system/` | `/en/projects/cadflow-bank-system/` |
| Java | DAE | `/projetos/dae/` | `/en/projects/dae/` |
| PHP | Ainet2425 | `/projetos/ainet/` | `/en/projects/ainet/` |
| PHP | TI | `/projetos/hotel-inteligente/` | `/en/projects/hotel-inteligente/` |
| HTML5, CSS3 | Portfolio | GitHub | GitHub |
| HTML5, CSS3 | MR.PIZZA | `/#projeto-mr-pizza` | `/en/#projeto-mr-pizza` |
| HTML5, CSS3 | Catalogo-Diane-Arbus | `/#projeto-diane-arbus` | `/en/#projeto-diane-arbus` |
| React | Licas | `/projetos/licas/` | `/en/projects/licas/` |
| React | MR.PIZZA | `/#projeto-mr-pizza` | `/en/#projeto-mr-pizza` |
| React | Catalogo-Diane-Arbus | `/#projeto-diane-arbus` | `/en/#projeto-diane-arbus` |
| Vue 3 | 3D-Analyzer | `/projetos/3d-analyzer/` | `/en/projects/3d-analyzer/` |
| Astro | Portfolio | GitHub | GitHub |
| Laravel | Ainet2425 | `/projetos/ainet/` | `/en/projects/ainet/` |
| Three.js / WebGL | 3D-Analyzer | `/projetos/3d-analyzer/` | `/en/projects/3d-analyzer/` |
| MFC | CadflowBankSystem | `/projetos/cadflow-bank-system/` | `/en/projects/cadflow-bank-system/` |
| PostgreSQL / Supabase | Licas | `/projetos/licas/` | `/en/projects/licas/` |
| MySQL | Ainet2425 | `/projetos/ainet/` | `/en/projects/ainet/` |
| REST APIs | DAE | `/projetos/dae/` | `/en/projects/dae/` |
| REST APIs | Ainet2425 | `/projetos/ainet/` | `/en/projects/ainet/` |
| REST APIs | TI | `/projetos/hotel-inteligente/` | `/en/projects/hotel-inteligente/` |
| Docker | DAE | `/projetos/dae/` | `/en/projects/dae/` |
| Vite | Licas | `/projetos/licas/` | `/en/projects/licas/` |
| Vite | Ainet2425 | `/projetos/ainet/` | `/en/projects/ainet/` |
| Vite | DAE | `/projetos/dae/` | `/en/projects/dae/` |
| Git | todos / all | `/#projects` | `/en/#projects` |
| OutSystems | PAP | `/projetos/gest/` | `/en/projects/gest/` |

**Como ficou nos dados:** cada prova em `skills.json` (e no canónico) diz o destino:

- `{ "repo": "TI", "caseStudy": "hotel-inteligente" }`;
- `{ "repo": "MR.PIZZA", "projeto": "mr-pizza" }`;
- `{ "allRepos": true }`;
- `{ "repo": "Portfolio" }`.

O script que os gerou confirmou que cada `caseStudy` tem mesmo case study e que cada
`projeto` não tem.

**Âncoras:** as 7 âncoras por língua (`#projeto-mr-pizza`, `#projeto-diane-arbus` e
`#projects`) existem na página de destino, e as páginas de case study existem no
`dist`.

## O que saiu do schema

- **O campo `group`** (`z.enum(['main', 'design']).default('main')`) saiu:
  - do schema;
  - dos dados do Mr. Pizza e do Diane Arbus;
  - do `Projects.astro`, onde filtrava as duas listas;
  - do `ProjectRow.astro`, através do `nivel`, que punha `h4` na sub-secção.
- **Entrou o campo `nota`:** `z.enum(['projects-design-text']).optional()`, a chave de
  i18n do texto do botão "?". Serve outra coisa: não agrupa nem separa projetos, só
  diz que a linha tem um botão de informação e qual o texto.

## CSS e marcação que saíram

- **CSS:** `.projects-subsection`, `.projects-subsection-heading` e
  `.projects-subsection-text`.
- **Marcação:**
  - o `<div class="projects-subsection">`, com o `h3` e o parágrafo;
  - a segunda lista de projetos;
  - o terceiro parágrafo do Sobre.

## Etiqueta por baixo do título e botão "?"

- **`.project-head`** passou a coluna: primeiro o `h3`, e por baixo um
  `<div class="project-meta">` com a etiqueta e, quando há `nota`, o botão "?".
  O alinhamento é à esquerda.
- **O botão:**
  - é um `<button type="button" class="info-btn">` com `aria-label` traduzido,
    `aria-expanded` e `aria-controls="nota-<slug>"`;
  - o alvo tem 44×44px, e o círculo desenhado 24px (`--sp-6`), com contorno
    `--text-secondary`;
  - uma margem negativa de `--sp-3` em cima e em baixo evita que o alvo alargue a
    linha da etiqueta;
  - tem `z-index: 2`, acima da área clicável da linha: o clique abre o balão e não a
    modal.
- **O balão:**
  - é um `<p id="nota-<slug>" class="info-balao" hidden>`, dentro da linha, por baixo
    da etiqueta;
  - fica no fluxo e não a flutuar, para nunca sair do ecrã;
  - fundo `--surface-color`, contorno `--border-color` e texto `--text-secondary` a
    `--fs-small`.
- **Comportamento** (`main.js`):
  - clique, Enter ou Espaço (nativos do `<button>`) alternam o balão;
  - só um fica aberto de cada vez;
  - Escape fecha e devolve o foco ao botão;
  - um clique fora fecha.

## Critérios de aceitação

| # | Critério | Resultado |
|---|---|---|
| 1 | Build sem avisos | ✅ exit 0, 0 avisos, 16 páginas |
| 2 | `check:i18n` | ✅ 53 chaves de cada lado |
| 3 | `check:texto` | ✅ **910 verificações, zero divergências**, zero texto fora do canónico. Passou a cobrir o destino das provas, a etiqueta por baixo do título e o botão "?" |
| 4 | Zero "Politécnico" e "Polytechnic" no site gerado | ⚠️ **Zero no HTML, CSS, JS, XML e JSON-LD** das 16 páginas, onde o `alumniOf` é "Universidade de Leiria e Oeste". **Mas o `CV.pdf` servido pelo site ainda diz "Instituto Politécnico de Leiria"** e "Politécnico de Leiria". Não o alterei: é o teu documento e não é texto do canónico. Ver a lista abaixo |
| 5 | Sobre com dois parágrafos | ✅ PT e EN |
| 6 | Etiquetas por baixo do título | ✅ **No HTML:** as 9 linhas por língua têm a etiqueta num `<div class="project-meta">` logo a seguir ao `</h3>`. **No browser:** 54 medições (9 × 3 larguras × 2 línguas), com a etiqueta abaixo do título e alinhada à esquerda com ele |
| 7 | Provas a apontar para fora | ⚠️ **3 por língua, as "Portfolio"**: a exceção aprovada. As outras 30 são internas. Ver o mapa acima |
| 8 | Âncoras vivas | ✅ as 30 provas internas por língua existem; as 7 com âncora têm o id no destino |
| 9 | "Design → Código" só no botão | ✅ **No corpo da página:** nenhum cabeçalho, nenhuma sub-secção. **O parágrafo:** existe 2 vezes por língua, e só dentro dos balões do Mr. Pizza e do Diane Arbus. "Design → Código" é agora só a etiqueta desses dois |
| 10 | 9 projetos, mesmo espaço entre linhas | ✅ 1 lista, 9 linhas, o mesmo padding em todas. O espaço entre o conteúdo de linhas seguidas é 49px a 1440 e 900px e 33px a 375px, **igual entre todas as linhas**, incluindo antes do Mr. Pizza |
| 11 | Botão "?" | ✅ Em PT e EN e a 1440, 900 e 375px: é um `button`, recebe o foco (`tabIndex` 0) e tem 44×44px. O `aria-label` é "Mais informação" / "More information". Abre ao clicar, fecha com Escape (e o foco volta ao botão), com clique fora e com o segundo clique. O clique no centro do botão acerta nele, e não na modal |
| 12 | "Equipa de" só nas etiquetas | ✅ Uma vez por projeto, na etiqueta. Aparece na lista e no cabeçalho da página de case study, que mostram a mesma etiqueta. Nenhum contexto fala da equipa (em EN, "Team of" igual) |
| 13 | Contraste ≥4,5:1, sem exceções | ✅ **2352 textos**, 16 páginas, dois temas, modais e balões abertos: **nenhum abaixo de 4,5:1**. As três piores, no tema claro: "O que correu mal" 5,02:1; o ponto final do nome e o roxo das provas e das etiquetas 5,45:1. O texto do balão fica a 7,58:1 (claro) e 9,85:1 (escuro) |
| 14 | Sem scroll horizontal | ✅ 48 medições, com os balões abertos |
| 15 | Zero erros de consola | ✅ 16 páginas |
| 16 | Nenhum ficheiro acima de 500 KB | ✅ 41 ficheiros, 1 403,6 KB; o maior é o `CV.pdf`, com 380 KB |
| 17 | Documentação atualizada | ✅ `CLAUDE.md` e `ESTADO-ATUAL.md` reescritos |

### "Politécnico" e "Polytechnic" fora do HTML

Procurei em todos os ficheiros do repositório, versionados ou não, fora de `dist` e
`node_modules`.

| Ficheiro | Ocorrências | O que é |
|---|---:|---|
| `public/assets/docs/CV.pdf` (servido pelo site) | 2 | "Instituto Politécnico de Leiria" e "Politécnico de Leiria", no conteúdo do CV |
| `content/texto-canonico.json` | 11 | Texto antigo guardado em `retirado.fase-4.2a` e `retirado.fase-4.2d`, com o motivo. É o registo histórico e fica como era |
| `FASE-4.2a-tecnico.md` | 1 | Relatório antigo |
| `CLAUDE.md` | 1 | "o antigo Instituto Politécnico de Leiria", a explicar a mudança de nome |

Troquei um comentário que eu próprio tinha escrito em `Seo.astro` com o nome antigo.

## Decisões que tomei sozinho

1. **Campo `nota` em vez de `group`:** o botão "?" precisa de saber em que linhas
   aparece. É um enum com a chave do texto, e não um grupo.
2. **Ids estáveis:**
   - `projeto-<slug>` nas linhas;
   - `nota-<slug>` nos balões.

   São iguais nas duas línguas, porque o slug não muda.
3. **`scroll-margin-top: --sp-24` nas linhas:** a linha a que uma prova leva para
   abaixo da navbar fixa, em vez de ficar escondida por ela.
4. **O balão fica dentro da linha e não a flutuar:** assim nunca sai do ecrã a 375px e
   não tapa as linhas de baixo.
5. **O alvo de toque do "?" tem 44px**, mas o círculo desenhado tem 24px, e a margem
   negativa impede que o botão torne a linha da etiqueta mais alta.
6. **"todos" leva a `/#projects`** (ou `/en/#projects`), a secção inteira.
7. **O `alumniOf` continua escrito diretamente no `Seo.astro`**, e não no canónico,
   como antes: não é texto visível.
8. **As linhas deixaram de ter `h4`:** sem sub-secção, todos os títulos são `h3`.

## Por fazer ou por decidir

- **O `CV.pdf` ainda tem o nome antigo da instituição.** É o único sítio do site com
  "Politécnico".
- **Os rótulos das provas** são os nomes dos repositórios, e alguns não dizem o nome
  do projeto a que levam: "TI" (Hotel Inteligente), "PAP" (Gest), "Ainet2425" (AINET).
- **As provas "Portfolio"** continuam a levar ao GitHub.
- **Não houve verificação visual por imagem:** o painel do browser corre escondido, e
  tudo foi medido por script.
- **O site publicado continua na Fase 4 intermédia.** As fases 4 a 4.2d estão por
  commitar.

