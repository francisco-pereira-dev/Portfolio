# Migração 2.2 — Extração de conteúdo para dados

Tarefa: tirar todo o conteúdo de `index.html` e `js/script.js` e passá-lo a estruturas de dados
tipadas. Sem componentes, sem páginas finais. Os ficheiros legados não foram tocados.

## O problema resolvido

O sistema antigo estava invertido em relação ao Astro: o **português não existia como dados**.
Vivia como conteúdo literal dentro do HTML, marcado com `data-translate`, e o dicionário PT era
construído **em runtime** raspando o DOM (`js/script.js` L284-289). O inglês vivia num objeto JS,
`translations.en` (L223-278). O Astro renderiza no build, onde não existe DOM para raspar.

O PT foi extraído do HTML por script, elemento a elemento, e cruzado com `translations.en`.
Resultado do cruzamento: **52 chaves de cada lado, zero discrepâncias nos dois sentidos**.
As 10 chaves repetidas no HTML (até 6 ocorrências cada) tinham todas valores idênticos.

## Ficheiros criados

```
src/i18n/pt.json                     30 chaves de interface (PT)
src/i18n/en.json                     30 chaves de interface (EN)
src/data/site.json                   dados neutros de língua (email, URLs sociais, CV)
src/data/skills.json                 16 competências (nome + ícone)
src/content.config.ts                collection "projects" com schema Zod
src/content/projects/*.json          6 projetos
scripts/check-i18n.mjs               verificação de paridade (npm run check:i18n)
MIGRACAO-2.2.md                      este relatório
```

Alterados: `package.json` (script `check:i18n`), `src/pages/index.astro` e
`src/pages/en/index.astro` (deixaram de ter texto escrito no ficheiro — ver critério 5).

## Destino das 52 chaves originais

21 chaves de interface ficaram em `src/i18n/`. 31 chaves de conteúdo de projeto passaram para a
content collection, onde deixam de ser chaves soltas e passam a campos de uma entrada por projeto.

| Chave | Secção | PT | EN | Destino |
|---|---|---|---|---|
| `overlay-about` | Menu overlay | sim | sim | `src/i18n/` |
| `overlay-skills` | Menu overlay | sim | sim | `src/i18n/` |
| `overlay-projects` | Menu overlay | sim | sim | `src/i18n/` |
| `overlay-contacts` | Menu overlay | sim | sim | `src/i18n/` |
| `hero-title` | Hero | sim | sim | `src/i18n/` |
| `hero-subtitle` | Hero | sim | sim | `src/i18n/` |
| `hero-btn-cv` | Hero | sim | sim | `src/i18n/` |
| `hero-btn-contact` | Hero | sim | sim | `src/i18n/` |
| `about-heading` | Sobre mim | sim | sim | `src/i18n/` |
| `about-text` | Sobre mim | sim | sim | `src/i18n/` |
| `skills-heading` | Competências | sim | sim | `src/i18n/` |
| `projects-heading` | Projetos (secção) | sim | sim | `src/i18n/` |
| `project-btn-view-more` | Projetos (secção) | sim | sim | `src/i18n/` |
| `contacts-heading` | Contactos | sim | sim | `src/i18n/` |
| `contact-title-email` | Contactos | sim | sim | `src/i18n/` |
| `contact-title-linkedin` | Contactos | sim | sim | `src/i18n/` |
| `contact-title-github` | Contactos | sim | sim | `src/i18n/` |
| `footer-text` | Rodapé | sim | sim | `src/i18n/` |
| `modal-btn-project` | Modal (ações) | sim | sim | `src/i18n/` |
| `modal-btn-repo` | Modal (ações) | sim | sim | `src/i18n/` |
| `modal-tooltip-note` | Modal (aviso cold start) | sim | sim | `src/i18n/` |
| `modal-desc-ainet` | Projeto (modal, descrição) | sim | sim | `projects` (collection) |
| `modal-desc-dae` | Projeto (modal, descrição) | sim | sim | `projects` (collection) |
| `modal-desc-dianearbus` | Projeto (modal, descrição) | sim | sim | `projects` (collection) |
| `modal-desc-gest` | Projeto (modal, descrição) | sim | sim | `projects` (collection) |
| `modal-desc-mrpizza` | Projeto (modal, descrição) | sim | sim | `projects` (collection) |
| `modal-desc-ti` | Projeto (modal, descrição) | sim | sim | `projects` (collection) |
| `modal-feat-ainet-1` | Projeto (modal, features) | sim | sim | `projects` (collection) |
| `modal-feat-ainet-2` | Projeto (modal, features) | sim | sim | `projects` (collection) |
| `modal-feat-ainet-3` | Projeto (modal, features) | sim | sim | `projects` (collection) |
| `modal-feat-dae-1` | Projeto (modal, features) | sim | sim | `projects` (collection) |
| `modal-feat-dae-2` | Projeto (modal, features) | sim | sim | `projects` (collection) |
| `modal-feat-dae-3` | Projeto (modal, features) | sim | sim | `projects` (collection) |
| `modal-feat-dianearbus-1` | Projeto (modal, features) | sim | sim | `projects` (collection) |
| `modal-feat-dianearbus-2` | Projeto (modal, features) | sim | sim | `projects` (collection) |
| `modal-feat-dianearbus-3` | Projeto (modal, features) | sim | sim | `projects` (collection) |
| `modal-feat-gest-1` | Projeto (modal, features) | sim | sim | `projects` (collection) |
| `modal-feat-gest-2` | Projeto (modal, features) | sim | sim | `projects` (collection) |
| `modal-feat-gest-3` | Projeto (modal, features) | sim | sim | `projects` (collection) |
| `modal-feat-mrpizza-1` | Projeto (modal, features) | sim | sim | `projects` (collection) |
| `modal-feat-mrpizza-2` | Projeto (modal, features) | sim | sim | `projects` (collection) |
| `modal-feat-mrpizza-3` | Projeto (modal, features) | sim | sim | `projects` (collection) |
| `modal-feat-ti-1` | Projeto (modal, features) | sim | sim | `projects` (collection) |
| `modal-feat-ti-2` | Projeto (modal, features) | sim | sim | `projects` (collection) |
| `modal-feat-ti-3` | Projeto (modal, features) | sim | sim | `projects` (collection) |
| `modal-feat-ti-4` | Projeto (modal, features) | sim | sim | `projects` (collection) |
| `project-title-ainet` | Projeto (cartão + modal) | sim | sim | `projects` (collection) |
| `project-title-dae` | Projeto (cartão + modal) | sim | sim | `projects` (collection) |
| `project-title-dianearbus` | Projeto (cartão + modal) | sim | sim | `projects` (collection) |
| `project-title-gest` | Projeto (cartão + modal) | sim | sim | `projects` (collection) |
| `project-title-mrpizza` | Projeto (cartão + modal) | sim | sim | `projects` (collection) |
| `project-title-ti` | Projeto (cartão + modal) | sim | sim | `projects` (collection) |

## Chaves novas (9)

Nenhuma destas existia no sistema `data-translate`. Todas correspondem a texto que já é visível
hoje mas estava escrito à mão no HTML ou no JS.

| Chave | PT | EN |
|---|---|---|
| `meta-title` | Francisco Pereira \| Portfolio | Francisco Pereira \| Portfolio |
| `meta-description` | Portfólio de Francisco Pereira, estudante de Engenharia Informática focado em criar experiências web de alto desempenho. | Portfolio of Francisco Pereira, a Computer Engineering student focused on building high-performance web experiences. |
| `nav-brand` | Portfolio | Portfolio |
| `a11y-menu-toggle` | Alternar Menu | Toggle Menu |
| `a11y-theme-toggle` | Alternar Modo Escuro/Claro | Toggle Dark/Light Mode |
| `a11y-lang-toggle` | Alterar idioma / Switch language | Alterar idioma / Switch language |
| `a11y-social-linkedin` | LinkedIn | LinkedIn |
| `a11y-social-github` | GitHub | GitHub |
| `a11y-social-email` | E-mail | E-mail |

## Decisões ao abrigo da autonomia

| Decisão | Justificação |
|---|---|
| Chaves planas em kebab-case, iguais às do `data-translate` | Mantém o rasto 1:1 com o `index.html` legado; qualquer chave é procurável no ficheiro original |
| `src/i18n/` só com strings de interface | Requisito da tarefa; o `check:i18n` tem um guarda-costas que falha se texto de projeto lá voltar a entrar |
| Conteúdo de projeto como `{ pt, en }` dentro de cada entrada | Mantém as duas línguas lado a lado e torna impossível uma ficar para trás sem o Zod dar erro |
| Ficheiros da collection em JSON, não Markdown | O conteúdo é estruturado (título, features, tech, URLs), não prosa longa; nenhum campo é corpo de artigo |
| Nome de ficheiro = slug (`hotel-inteligente.json`) | O `glob` loader deriva o id do nome do ficheiro; assim id e slug coincidem |
| `order` explícito 1-6 | Preserva a ordem exata dos cartões no `index.html`, que não é alfabética |
| `tagline` opcional no schema | **O `index.html` não tem tagline para nenhum projeto.** O campo fica previsto para quando fornecer o texto, mas não inventei nenhum |
| `status` derivado da presença de demo | `live` para os 5 com botão "Ver Projeto", `no-demo` para o Gest que só tem repositório. `in-development` fica no enum, sem nenhum projeto a usá-lo hoje |
| `image` (local) **ou** `imageRemote` (URLs), nunca ambos | 4 projetos usam ficheiros em `assets/images/`, 2 fazem hotlink ao Unsplash. Um `superRefine` garante exatamente um dos dois |
| `imageRemote` guarda `card` e `modal` separados | Os URLs do Unsplash diferem no parâmetro de largura (`w=600` no cartão, `w=1200` na modal); juntá-los perdia dados |
| `superRefine` extra: `no-demo` sem `demoUrl`, `live` com `demoUrl` | O estado deixa de poder contradizer os dados; testado a quebrar de propósito |
| `imageAlt.en` = título EN do projeto | No HTML o `alt` PT é exatamente o título PT; apliquei a mesma regra ao EN usando o título EN que já existia. Não inventei texto |
| Aviso de cold start numa única chave `modal-tooltip-note` | Estava repetido 3x inline no HTML, com texto idêntico nas 3. Os projetos ficam marcados com `coldStart: true` |
| `meta-title` igual em PT e EN | O `<title>` nunca foi traduzido (não tem `data-translate`). Criei a chave nas duas línguas com o valor atual em vez de inventar uma versão inglesa |
| Email e handles em `src/data/site.json`, fora do i18n | Não são strings traduzíveis; um endereço de email não tem língua. Mantém os ficheiros de i18n puramente linguísticos |
| Skills em `src/data/skills.json` | 16 nomes que nunca foram traduzidos (são nomes próprios) mais a classe do ícone; são dados, não interface |
| `a11y-*` extraídas para i18n | Sem isto, a tarefa seguinte teria de escrever `aria-label` à mão nos componentes, o que viola o critério 5 |
| Comentários de código em português mantidos nos `.astro` | São documentação para quem lê o código, não texto que chegue ao utilizador; o verificador do critério 5 analisa texto do template e valores de atributos |

## Correção de texto

Uma só, a autorizada. `index.html` L377, feature PT do Diane Arbus:

- antes: `Galeria interativa de fotografias and autorretratos.`
- depois: `Galeria interativa de fotografias e autorretratos.`

Verificado por script que nenhum outro texto PT foi alterado: as 62 strings de projeto
(6 títulos, 6 descrições, 19 features, nas duas línguas) batem certo com a origem.

## As 22 tech badges

18 rótulos distintos em 22 ocorrências. Nomes próprios de tecnologia mantêm-se; só se traduziu
o que é rótulo genérico.

| PT | EN | Classificação | Ocorrências | Projetos |
|---|---|---|---|---|
| `Laravel` | `Laravel` | mantida | 1 | ainet |
| `PHP` | `PHP` | mantida | 1 | ainet |
| `MVC` | `MVC` | mantida | 1 | ainet |
| `MySQL` | `MySQL` | mantida | 1 | ainet |
| `Vite` | `Vite` | mantida | 2 | ainet, dae |
| `Docker` | `Docker` | mantida | 1 | dae |
| `LLaMA 3 (IA)` | `LLaMA 3 (AI)` | **traduzida** | 1 | dae |
| `Full-Stack` | `Full-Stack` | mantida | 1 | dae |
| `HTML` | `HTML` | mantida | 2 | diane-arbus, mr-pizza |
| `CSS` | `CSS` | mantida | 2 | diane-arbus, mr-pizza |
| `Figma` | `Figma` | mantida | 2 | diane-arbus, mr-pizza |
| `OutSystems` | `OutSystems` | mantida | 1 | gest |
| `Base de Dados` | `Database` | **traduzida** | 1 | gest |
| `PHP (Vanilla)` | `PHP (Vanilla)` | mantida | 1 | hotel-inteligente |
| `IoT` | `IoT` | mantida | 1 | hotel-inteligente |
| `AJAX` | `AJAX` | mantida | 1 | hotel-inteligente |
| `Hardware` | `Hardware` | mantida | 1 | hotel-inteligente |
| `JavaScript` | `JavaScript` | mantida | 1 | mr-pizza |

**Traduzidas: 2 de 18.**

- `Base de Dados` -> `Database` — rótulo genérico, era a badge que ficava em português no modo EN.
- `LLaMA 3 (IA)` -> `LLaMA 3 (AI)` — o nome do modelo mantém-se; só o descritor entre parênteses
  muda, porque `IA` é a sigla portuguesa de `AI`.

**Mantidas: 16 de 18** — HTML, CSS, JavaScript, Figma, OutSystems, Laravel, PHP, MVC, MySQL,
Vite, Docker, Full-Stack, PHP (Vanilla), IoT, AJAX, Hardware. Todas são nomes próprios, siglas
técnicas ou palavras iguais nas duas línguas.

## Chaves marcadas TODO

**Nenhuma.** As 52 chaves tinham valor nas duas línguas, por isso não houve nenhum caso em que
fosse preciso inventar texto visível.

O único campo sem dados de origem é o `tagline`, que não existe para nenhum projeto no
`index.html`. Ficou opcional no schema em vez de marcado TODO, porque não é uma chave de
tradução em falta — é um campo que o site nunca teve.

## Encontrado no HTML/JS e não previsto no prompt

1. **Nenhum projeto tem tagline.** O schema pedia o campo; a origem não tem os dados. Ficou opcional.
2. **6 `aria-label` fora do sistema de tradução.** Dois têm par PT/EN escrito à mão dentro do
   `setLanguage` (`js/script.js` L348 e L352); os outros quatro estão só no HTML e nunca mudam de
   língua. Extraí os 6 para chaves `a11y-*`.
3. **O `aria-label` do seletor de idioma é bilingue numa única string:** `Alterar idioma / Switch
   language`. Mantido verbatim nas duas línguas — corrigir isto seria reescrever texto.
4. **A meta description estava duplicada.** `index.html` L7 e `js/script.js` L338 têm a versão PT
   byte a byte igual. Confirmado por comparação; agora existe uma só vez.
5. **`Portfolio` no centro da navbar** (`index.html` L59) não tinha `data-translate`. Virou `nav-brand`.
6. **16 skill cards nunca traduzidos**, 14 com ícone devicon e 2 com ícone de texto (`{API}` para
   REST APIs e `OS` para OutSystems). Extraídos para `src/data/skills.json` com a classe do ícone.
7. **`&` literal por escapar** em `footer-text` (`HTML, CSS & JavaScript`) e no título do DAE
   (`DAE - Arquitetura Full-Stack & IA`). Como dados em JSON é indiferente, e o Astro escapa-o
   corretamente ao renderizar — o que hoje não acontece.
8. **`modal-btn-project` aparece 5 vezes, não 6.** O Gest não tem demo. É o que sustenta o
   `status: "no-demo"`.
9. **Os dois projetos do Unsplash têm dois URLs cada**, diferentes só na largura. Ambos preservados.
10. **O helper `image()` resolve caminhos fora de `src/`.** As 4 imagens locais são referenciadas
    como `../../../assets/images/...` e o Astro processou-as sem problema (confirmado em
    `.astro/content-assets.mjs`). A tarefa seguinte pode usar `<Image>` sem mexer em `assets/`.
11. **O Astro 7 guarda a cache da collection em `.astro/collections/`**, não no `data-store.json`
    das versões anteriores. Já está coberto pelo `.gitignore`.

## Critérios de aceitação

| # | Critério | Resultado |
|---|---|---|
| 1 | `npm run build` passa; Zod valida a collection | Passa, exit 0. Validação provada a quebrar entradas de propósito: enum inválido e `superRefine` foram ambos rejeitados |
| 2 | `npm run check:i18n` passa, diferença nos dois sentidos | Passa, exit 0. 30 chaves de cada lado, zero divergências |
| 3 | 6 projetos com texto verbatim | Passa. 62 strings comparadas com `index.html`/`script.js`, 0 divergências |
| 4 | Nenhuma string de projeto no i18n | Passa. Verificado por valor e por prefixo de chave |
| 5 | Zero strings PT/EN nos `.astro` | Passa. 3 ficheiros analisados, sem texto solto no template nem prosa em atributos |
| 6 | `MIGRACAO-2.2.md` completo | Este ficheiro |
