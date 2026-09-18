# Fase 5.2 — relatório técnico

Data: 2026-09-17. Duas correções pedidas depois de veres o site. Sem commit e sem push.

> **Nota de contexto:** a Fase 5.1 ficou a meio. Estão feitas as tarefas 1 a 4 (sem
> JavaScript, seletor de idioma, texto alternativo da foto e comandos de auditoria).
> Faltam a 5 (apagar os 13 ícones e as três regras de CSS), a 6 (documentação) e a 7
> (verificação), e os relatórios `FASE-5.1-*.md`. Esta fase não apagou nada, como
> mandaste.

---

## 1. A secção de contactos não estava centrada

### O que causava o desalinhamento

Os três cartões estavam numa linha flex com `justify-content: center`. Em flex, cada
cartão fica com a largura do seu conteúdo:

| Cartão | Largura antes |
|---|---:|
| E-mail (`franciscojrp1004@gmail.com`) | 240px |
| Linkedin (`@francisco-pereira-dev`) | 201px |
| Github (`@francisco-pereira-dev`) | 201px |

O conjunto (240 + 201 + 201 e dois espaços de 48px) ficava centrado **como bloco**: a
caixa toda estava no eixo. Mas, como o primeiro cartão é 39px mais largo que os outros
dois, o conteúdo dentro dele — o círculo do ícone, o título e o endereço, todos
centrados no seu cartão — ficava deslocado para a esquerda, e o desenho que se vê
(os três círculos) ficava **9,6px à direita** do eixo do título. É metade da
diferença de largura (39 ÷ 4), e é isso que se nota a olho.

### A correção

`src/styles/global.css`, secção "CONTACTOS":

- `.contacts-row` passou de `flex` a `grid` com `grid-template-columns: repeat(3, 1fr)`
  e `width: fit-content; margin: 0 auto`. Numa grelha dimensionada pelo conteúdo, as
  colunas `1fr` ficam todas com a largura da mais larga: as três passam a 240px, e o
  conjunto fica simétrico e centrado no eixo do `<main>`.
- O espaço entre colunas passou de `--sp-12` (48px) a `--sp-8` (32px), para as três
  colunas iguais caberem a 900px: 3 × 240 + 2 × 32 = 784px, dentro dos 804px de
  conteúdo. Em altura, quando empilham, mantém-se o `--sp-12` de antes.
- `.contacts-section` ganhou `container-type: inline-size` e, com
  `@container (max-width: 50rem)`, os cartões passam a uma só coluna quando as três
  não cabem — o mesmo que já acontecia no telemóvel.

### Medições (centro horizontal, em px)

**Antes:**

| Largura | Língua | Contentor | Título | Régua | Caixa dos cartões | Conjunto visível (ícones) |
|---:|---|---:|---:|---:|---:|---:|
| 1440 | PT | 720 | 720 | 720 | 720 | **729,6** |
| 1440 | EN | 720 | 720 | 720 | 720 | **729,6** |
| 900 | PT | 450 | 450 | 450 | 450 | **459,6** |
| 900 | EN | 450 | 450 | 450 | 450 | **459,6** |
| 375 | PT | 187,5 | 187,5 | 187,5 | 187,5 | 187,5 |
| 375 | EN | 187,5 | 187,5 | 187,5 | 187,5 | 187,5 |

**Depois:** nas seis combinações, contentor, título, régua, caixa dos cartões e
conjunto dos ícones coincidem — 720, 450 e 187,5. Desvio máximo: 0px. As larguras dos
cartões são 240/240/240. O mesmo resultado com o JavaScript desligado.

### Larguras intermédias

Varri de 320 a 1440px, de 16 em 16px: em nenhuma largura a grelha transborda o
contentor ou sai do eixo. As três colunas aparecem acima dos ~1008px (e também entre
897 e 900px, onde o espaço lateral do `<main>` é menor); abaixo disso, os cartões
empilham numa coluna centrada. Antes, entre ~901 e ~1007px, quebravam em 2 + 1, que é
assimétrico; agora empilham.

---

## 2. Destino das provas das competências

### O que mudou

Antes, uma prova de um projeto **com** case study abria a página do case study, e uma
prova de um projeto **sem** case study levava à linha na página inicial. Agora todas
levam à linha do projeto, na mesma página e na mesma língua.

- **Canónico primeiro:** em `content/texto-canonico.json`, as 23 provas que tinham
  `"caseStudy": "<slug>"` passaram a `"projeto": "<slug>"`. O rótulo não mudou, e
  nenhum texto do site foi tocado. A origem ficou registada em
  `_sobre.fontes['fase-5.2']`.
- **`src/data/skills.json`** foi atualizado com a mesma troca e comparado com o
  canónico: são iguais.
- **`src/components/Skills.astro`** e **`scripts/check-texto.mjs`** já tratavam o
  campo `projeto`; só levaram comentários novos. O ramo do `caseStudy` fica no código,
  sem uso — não apaguei nada.
- As páginas de case study continuam a existir e a ser alcançáveis pelo "Ver mais" de
  cada linha.

### Mapa completo das provas (33 por língua)

| Competência | Provas → destino (PT) | Provas → destino (EN) |
|---|---|---|
| TypeScript | Licas → `/#projeto-licas` · Mr. Pizza → `/#projeto-mr-pizza` · Diane Arbus → `/#projeto-diane-arbus` | os mesmos, com `/en/` |
| JavaScript | 3D Analyzer → `/#projeto-3d-analyzer` · **Portfolio → GitHub** · Hotel Inteligente → `/#projeto-hotel-inteligente` | 3D Analyzer · **Portfolio → GitHub** · **Smart Hotel** → `/en/#projeto-hotel-inteligente` |
| C++ | 3D Analyzer → `/#projeto-3d-analyzer` · CadflowBankSystem → `/#projeto-cadflow-bank-system` | os mesmos, com `/en/` |
| Java | DAE → `/#projeto-dae` | `/en/#projeto-dae` |
| PHP | AINET → `/#projeto-ainet` · Hotel Inteligente → `/#projeto-hotel-inteligente` | AINET · Smart Hotel, com `/en/` |
| HTML5, CSS3 | **Portfolio → GitHub** · Mr. Pizza → `/#projeto-mr-pizza` · Diane Arbus → `/#projeto-diane-arbus` | os mesmos, com `/en/` |
| React | Licas → `/#projeto-licas` · Mr. Pizza → `/#projeto-mr-pizza` · Diane Arbus → `/#projeto-diane-arbus` | os mesmos, com `/en/` |
| Vue 3 | 3D Analyzer → `/#projeto-3d-analyzer` | `/en/#projeto-3d-analyzer` |
| Astro | **Portfolio → GitHub** | **Portfolio → GitHub** |
| Laravel | AINET → `/#projeto-ainet` | `/en/#projeto-ainet` |
| Three.js / WebGL | 3D Analyzer → `/#projeto-3d-analyzer` | `/en/#projeto-3d-analyzer` |
| MFC | CadflowBankSystem → `/#projeto-cadflow-bank-system` | `/en/#projeto-cadflow-bank-system` |
| PostgreSQL / Supabase | Licas → `/#projeto-licas` | `/en/#projeto-licas` |
| MySQL | AINET → `/#projeto-ainet` | `/en/#projeto-ainet` |
| REST APIs | DAE · AINET · Hotel Inteligente → as três linhas | os mesmos, com `/en/` e Smart Hotel |
| Docker | DAE → `/#projeto-dae` | `/en/#projeto-dae` |
| Vite | Licas · AINET · DAE → as três linhas | os mesmos, com `/en/` |
| Git | todos → `/#projects` | all → `/en/#projects` |
| OutSystems | Gest → `/#projeto-gest` | `/en/#projeto-gest` |

**30 provas internas e 3 externas** por língua. As 3 externas são as do "Portfolio",
que continuam no GitHub porque o repositório deste site não tem linha na lista.

### Âncoras e posição de chegada

Segui as 33 provas com um clique real, nas duas línguas, a 1440 e 375px, com e sem
JavaScript (132 percursos):

- nenhuma âncora morta: todas as `#projeto-<slug>` e a `#projects` existem na página;
- nenhuma prova sai da página em que está;
- ao chegar, a linha fica sempre **96px** do topo (72px no telemóvel, para o título da
  secção), abaixo da barra do topo, que ocupa 68px.

Pelo caminho apareceram dois defeitos reais, os dois corrigidos:

1. **A linha ficava 2px por baixo da barra, com JavaScript.** A linha que ainda não
   apareceu está 30px mais abaixo (é o `translateY` da animação de entrada). O browser
   alinha a posição do momento do salto; quando a animação acaba, a linha sobe 30px e
   passa a ficar tapada. Correção: enquanto a linha não apareceu, a margem de
   ancoragem soma esses 30px (`html.js .project-row.reveal:not(.is-visible)`).
2. **O título "Projetos" ficava 4px por baixo da barra, no telemóvel.** Aí o espaço
   acima das secções são 64px e a barra tem 68px. Correção: `scroll-margin-top` de 8px
   nas quatro secções da página inicial, só abaixo de 768px. Também melhora os links
   do menu, que tinham o mesmo problema.

---

## Verificação final

| # | Verificação | Resultado |
|---:|---|---|
| 1 | `npm run build` | ✅ exit 0, zero avisos, 16 páginas, 41 ficheiros, 1 460 400 bytes |
| 2 | `npm run check:i18n` e `npm run check:texto` | ✅ 55 chaves; 914 verificações, zero divergências |
| 3 | `npm run audit:a11y` | ✅ zero falhas: zero violações axe nas 16 páginas × 2 temas, contraste mínimo 5,70 (escuro) e 5,02 (claro), e o site sem JavaScript nas 3 larguras |
| 4 | `npm run audit:teclado` | ✅ zero falhas nas 16 páginas × 2 temas |
| 5 | Centros dos contactos | ✅ coincidem nas 3 larguras × 2 línguas, com e sem JavaScript |
| 6 | Provas | ✅ 33 por língua, todas com destino válido, zero âncoras mortas |
| 7 | Scroll horizontal | ✅ nenhum, em 16 páginas × 1440/900/375 × 2 temas |
| 8 | Consola | ✅ zero erros e zero avisos nas mesmas 96 cargas |
| 9 | Sem JavaScript | ✅ nada regrediu: todo o texto visível, tema do sistema, navegação e provas a funcionar |

---

## Decisões que tomei sozinho

1. **Grelha de largura igual às três colunas** (`fit-content` + `1fr`), em vez de fixar
   uma largura em px. Se um dos textos mudar, as colunas continuam iguais sozinhas.
2. **Espaço entre colunas de 48px para 32px**, para as três caberem a 900px. É um
   degrau da escala, e em altura mantém-se o 48px.
3. **Abaixo de 50rem de conteúdo, os cartões empilham numa coluna.** Entre ~901 e
   ~1007px, onde antes quebravam em 2 + 1, passam a empilhar: é simétrico, e o 2 + 1
   nunca esteve centrado de verdade.
4. **`container-type: inline-size` na secção de contactos**, para a decisão depender da
   largura do conteúdo e não da janela.
5. **Margem de ancoragem maior enquanto a linha não apareceu** (+30px), em vez de
   desligar a animação ou mudar a barra do topo.
6. **`scroll-margin-top` de 8px nas secções, no telemóvel**, que também muda onde os
   links do menu aterram — para melhor.
7. **O ramo `caseStudy` fica no código** de `Skills.astro` e do `check:texto`, sem uso.
   Não apaguei nada, e se um dia quiseres voltar atrás basta mudar os dados.
8. **Na auditoria de acessibilidade, o axe deixou de correr na parte sem JavaScript.**
   O axe corre dentro da página; com o JavaScript desligado, ficava à espera para
   sempre — foi isso que bloqueou a auditoria durante horas, duas vezes. Sem
   JavaScript medem-se a estrutura, o que está visível e o contraste.

## Por atualizar

- O `CLAUDE.md` e o `ESTADO-ATUAL.md` ainda dizem que as provas de um projeto com case
  study abrem a página do case study. Fica para a Tarefa 6 da Fase 5.1, que é a que
  trata da documentação, para não escrever a mesma secção duas vezes.
