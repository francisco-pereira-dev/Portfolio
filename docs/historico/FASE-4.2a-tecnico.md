# Fase 4.2a — Conteúdo e regras de estrutura: relatório técnico

O que esta fase fez:

- saiu a linguagem de procura de emprego;
- o hero, o Sobre e os contactos foram reescritos;
- cada projeto passou a ter uma frase na lista;
- os case studies do DAE, do Gest e do Licas foram corrigidos;
- entrou o case study do CadflowBankSystem;
- as páginas de case study ficaram sem imagens;
- "A minha parte" passou a existir só nos projetos de equipa;
- mudaram os rótulos "Ver mais" e "Ainda não publicado";
- as provas do Licas nas competências passaram a apontar para o case study;
- as meta descrições foram reescritas.

Todo o texto novo entrou primeiro em `content/texto-canonico.json` e foi gerado a
partir dele para o i18n, os 9 projetos e as competências. Cada ficheiro gerado foi
confirmado igual ao canónico.

Nada foi commitado nem enviado.

## Colisões

| Colisão | Decisão do Francisco |
|---|---|
| "A foto mantém-se, no topo, junto ao nome", quando a Fase 4 a tinha levado para o Sobre e esta tarefa não mexe em design | Mover já para o hero |
| "Volta ao email visível e às redes, como estava antes": a lista da Fase 4 ou os cartões com ícones de antes dela | Os cartões com ícones de antes |
| A frase curta a substituir a descrição repetia-se dentro das modais do Mr. Pizza e do Diane Arbus | Campo novo só para a linha (`resumo`); a descrição longa fica só nas 2 modais |
| A etiqueta do Licas diz "Cliente real · Em desenvolvimento" e contradiz "Ainda não publicado" | Deixar e reportar |

Duas inconsistências do enunciado, resolvidas pelos números reais:

- **Páginas:** o critério 10 fala em 15, mas o case study novo acrescenta 2 (PT e
  EN). São 16, como diz o critério 11.
- **Modais:** a secção 5 fala em "3 modais que continuam a existir". Com o
  CadflowBankSystem a ter página, ficam 2, como diz o critério 6.

## Ficheiros alterados

Contra o HEAD `9810f88`. **Atenção:** cinco destes ficheiros ainda levam o fim da
Fase 4, que continua por commitar: `content/texto-canonico.json`,
`scripts/check-texto.mjs`, `src/components/ProjectModal.astro`,
`src/styles/case-study.css` e `src/styles/global.css`. O que é só desta fase está
na coluna "Nesta fase".

| Ficheiro | + | − | Nesta fase |
|---|---:|---:|---|
| `content/texto-canonico.json` | 231 | 66 | Todo o texto novo, 9 frases, case study do Cadflow e o registo `retirado.fase-4.2a` |
| `scripts/check-texto.mjs` | 34 | 34 | Frase na lista, "A minha parte" opcional, páginas sem imagens, provas para o case study |
| `src/styles/global.css` | 58 | 116 | Foto no hero, cartões de contacto; saem o badge, o layout do Sobre com foto, as provas privadas, a lista de contactos e o "Copiar email" |
| `src/styles/case-study.css` | 96 | 48 | Sai o estilo da figura |
| `src/scripts/main.js` | 3 | 48 | Sai o "Copiar email" |
| `src/components/Contacts.astro` | 49 | 34 | Cartões com ícones de antes da Fase 4 |
| `src/layouts/CaseStudyPage.astro` | 6 | 21 | Sai a figura; as secções sem campo não aparecem |
| `src/components/About.astro` | 5 | 18 | 3 parágrafos, sem foto |
| `src/components/Hero.astro` | 15 | 5 | Sai o badge, entra a foto |
| `src/components/Skills.astro` | 12 | 8 | Provas do Licas com link para o case study; recebe a língua |
| `src/components/ProjectModal.astro` | 1 | 15 | (só Fase 4) |
| `src/content.config.ts` | 5 | 1 | `minhaParte` opcional; `resumo` obrigatório |
| `src/components/ProjectRow.astro` · `Projects.astro` · `PortfolioPage.astro` | 2+1+1 | 1+1+1 | A linha e o destaque mostram o `resumo`; as competências recebem a língua |
| `src/i18n/pt.json` · `en.json` | 8+8 | 13+13 | Ver abaixo |
| `src/data/skills.json` | 4 | 4 | 4 provas do Licas com link para o case study |
| `src/content/projects/cadflow-bank-system.json` | 63 | 1 | `resumo` e case study novo |
| `licas.json` · `gest.json` · `3d-analyzer.json` · `dae.json` | 8·6·4·6 | 8·6·4·2 | `resumo` e correções do case study |
| `ainet.json` · `hotel-inteligente.json` · `mr-pizza.json` · `diane-arbus.json` | 4 cada | 0 | `resumo` |

## Chaves de i18n

O i18n passou de 59 para 54 chaves de cada lado.

- **Criadas:** nenhuma.
- **Removidas (5):**
  - `hero-badge`;
  - `about-p4` e `about-p5`;
  - `contact-btn-copy-email` e `contact-copy-done`.
- **Valor alterado (8):**
  - `hero-subtitle` e `hero-paragraph`;
  - `about-p2` e `about-p3`;
  - `contacts-text`;
  - `project-btn-case-study`, agora "Ver mais" / "Read more";
  - `project-status-in-development`, agora "Ainda não publicado" / "Not yet published";
  - `meta-description`.
- **Iguais ao enunciado, sem mudança:** `about-p1`, `contacts-heading` e os três CTAs
  do hero.

O texto que saiu ficou registado no canónico em `retirado.fase-4.2a`, com o motivo
de cada um: são 20 entradas, das 13 de interface às de case study.

## Schema (`src/content.config.ts`)

- `caseStudy.minhaParte` passou de obrigatório a **opcional**. Sem o campo, a
  secção não é gerada. Existe só em `dae`, `ainet` e `hotel-inteligente`.
- **Campo novo `resumo`** (PT/EN, obrigatório): a frase da linha na lista de
  projetos. A `description` continua obrigatória nos dados e só aparece nas modais
  dos 2 projetos sem case study.
- O `.strict()` do `caseStudy` mantém-se.

## Repetições entre secções

Procurei-as automaticamente: sequências de 6 palavras em comum entre donos
diferentes, na mesma língua. Depois li os resultados. Tirando as falsas
coincidências de estilo, ficam estas repetições de facto:

1. **Frase da linha e descrição da modal, no Mr. Pizza e no Diane Arbus.** A
   descrição longa começa com a mesma frase da linha, palavra por palavra (em EN
   difere só uma vírgula), e continua ("O protótipo inicial foi gerado com Figma
   Make…"). Quem abre a modal lê a mesma frase duas vezes.
2. **O estágio na ITGlee aparece em quatro sítios:**
   - no Sobre ("estagiei na ITGlee");
   - na etiqueta do Gest ("Estágio ITGlee · Prova de Aptidão Profissional");
   - na frase do Gest na lista ("começada durante o estágio na ITGlee e continuada
     como Prova de Aptidão Profissional");
   - no contexto do case study do Gest ("Estágio curricular na ITGlee… Prova de
     Aptidão Profissional").

   A etiqueta e a frase da lista dizem a mesma coisa lado a lado.
3. **A frase da lista repete o case study em quase todos:**
   - **3D Analyzer:** "motor de cálculo em C++ nativo" também está no contexto.
   - **AINET:** "gestão de sócios de uma associação e loja online… três níveis de
     acesso" também está na `umaFrase`.
   - **CadflowBankSystem:** "desafio técnico proposto por uma empresa" está na
     etiqueta, na frase da lista, na `umaFrase` e no contexto.
   - **Gest:** "loja online de informática com gestão de armazém" também está na
     `umaFrase`.
   - **DAE:** "aplicação empresarial… modelo de inteligência artificial a correr na
     própria máquina" também está na `umaFrase`.
4. **Dentro do mesmo case study:**
   - **Gest:** "até ao dia da apresentação" está na `umaFrase` e no contexto.
   - **CadflowBankSystem:** "desafio técnico proposto por uma empresa" está na
     `umaFrase` e no contexto.
   - **DAE:** o contexto diz "Acabei por assumir a maior parte do desenvolvimento" e
     "A minha parte" diz "A minha parte era o frontend. Acabei por fazer e corrigir
     também grande parte do backend". É o mesmo facto dito duas vezes, com ênfases
     que quase se contradizem.
5. **O hero e a meta descrição** partilham "finalista de Engenharia Informática no
   Politécnico de Leiria". A meta não é visível na página; reporto por completude.
6. **Repetições estruturais, não de facto:**
   - o título e a etiqueta de cada projeto aparecem na linha e no cabeçalho do
     case study;
   - a nota de arranque a frio repete-se nos três projetos alojados no Render,
     porque é uma nota por projeto.

Não corrigi nada, porque todo o texto é final.

## Afirmações sobre a ITGlee e sobre "problema de uma empresa"

Procurei "ITGlee", "empresa", "company" e "business" em todo o texto visível e nas
meta descrições das 16 páginas.

- **No site, a sugerir que o projeto foi feito numa empresa ou para ela:** a
  `umaFrase` do Gest.
  - PT: "Uma loja online de informática com gestão de armazém, **construída numa
    empresa** durante o estágio e continuada até ao dia da apresentação."
  - EN: "An online computer-hardware store with warehouse management, **built inside
    a company** during my internship and carried on until the day I presented it."

  Aparece em três sítios da página do Gest, nas duas línguas: o texto de abertura, a
  meta description e a `og:description`.
- **Nos dados, mas não no site:** a `description` longa do Gest diz "construída em
  OutSystems durante o estágio na ITGlee e depois alargada como Prova de Aptidão
  Profissional". Tem o mesmo tom, mas é mais neutra.
- **Já não está no site:** o antigo `about-p2` dizia "Foi o primeiro código meu a
  resolver o problema de uma empresa a sério". Saiu com o Sobre novo e ficou em
  `retirado.fase-4.2a`.

As restantes ocorrências de "empresa" são legítimas:

- o CadflowBankSystem é um desafio proposto por uma empresa;
- no DAE, "aplicação empresarial" é o tipo de aplicação;
- o AINET tem "Business logic outside the controllers".

## Critérios de aceitação

| # | Critério | Resultado |
|---|---|---|
| 1 | Build sem avisos | ✅ exit 0, 0 avisos, 16 páginas |
| 2 | `check:i18n` | ✅ 54 chaves de cada lado |
| 3 | `check:texto` cobre o texto novo | ✅ **880 verificações, zero divergências**, zero texto fora do canónico. Sabotei o `dist` em 5 sítios: a frase do 3D Analyzer, uma secção "A minha parte" no Licas, uma prova do Licas sem link, uma imagem no case study do Cadflow e o rótulo "Not yet published". Deu 6 divergências, porque o rótulo dispara 2 verificações, e depois do rebuild voltou a zero |
| 4 | Texto do enunciado contra o HTML | ✅ **89 strings, 0 divergências**. Usei uma cópia à parte do enunciado, escrita independentemente do script que gerou o canónico. Cada string foi procurada como nó de texto inteiro na página certa; as meta descrições foram comparadas no `meta`, no `og` e no JSON-LD |
| 5 | Sem linguagem de procura de emprego | ✅ "disponível", "emprego", "available", "hiring" e "full-time role": 0 ocorrências em 20 ficheiros de texto do `dist`, incluindo o JSON-LD. **Uma ocorrência legítima** de "disponibilidade", numa decisão técnica do Gest: "o stock que o gestor vê e a disponibilidade que o cliente vê" |
| 6 | 7 com case study, 2 sem, 2 modais | ✅ nas duas línguas: 7 páginas, 7 links de case study, 2 modais (mr-pizza, diane-arbus) e 2 botões de modal. O CadflowBankSystem tem página e não tem modal |
| 7 | Sem imagens nos case studies | ✅ 0 `<img>`, `<picture>` ou `<figure>` nas 14 páginas. O `og:image` continua o do projeto: DAE, AINET, Gest e Hotel com a sua imagem; Licas, 3D Analyzer e Cadflow com a geral |
| 8 | `minhaParte` só em dae, ainet e hotel-inteligente | ✅ o mesmo nos dados, no canónico e nas páginas PT e EN |
| 9 | Provas com destino válido | ✅ 66 links de prova, 12 destinos: os 10 do GitHub respondem **200**; `/projetos/licas/` e `/en/projects/licas/` existem no `dist`. Nenhuma prova ficou sem link |
| 10 | Zero links partidos | ✅ 16 páginas, 250 `href`/`src` internos, 96 com âncora, nenhum partido |
| 11 | Sitemap com 16 páginas | ✅ 16 |
| 12 | Sem scroll horizontal | ✅ 48 medições (16 páginas × 1440, 900 e 375px) |
| 13 | Nenhum ficheiro acima de 500 KB | ✅ 41 ficheiros, 1 376,8 KB; o maior é o `CV.pdf`, com 380 KB |

Verifiquei também no browser: zero erros de consola na página inicial e no case
study novo. Na página inicial a foto está no hero, com 128px, por cima do nome, e
os três cartões de contacto têm círculos de 80px.

## Decisões que tomei sozinho

1. **O nome do campo novo é `resumo`.** Fica ao lado de `description` nos dados e no
   canónico.
2. **A foto fica por cima do nome, e não ao lado.** Usa o tamanho que tinha no Sobre
   (128px, 96px no telemóvel) e o espaço de baixo que era do badge (`--sp-6`). A
   posição fina fica para a tarefa de design.
3. **Cartões de contacto:**
   - o markup é igual ao de antes da Fase 4;
   - a fila fica **alinhada à esquerda**, como o título e o texto da secção, quando
     antes era centrada;
   - os tamanhos passaram às escalas: título a `--fs-h3`, valor a `--fs-body`,
     espaços `--sp-16`, `--sp-6` e `--sp-2`;
   - o ícone ficou a 2.5rem **fora da escala**, comentado como medida ótica;
   - voltou o efeito de hover de antes (sobe 8px e o círculo passa a roxo).
4. **Provas do Licas:**
   - apontam para `/projetos/licas/` e `/en/projects/licas/`, com barra final, que
     são as rotas reais do site (o enunciado escreve sem barra);
   - abrem no mesmo separador, por serem páginas do próprio site;
   - o rótulo continua "Licas".
5. **O estado do Licas nos dados continua `in-development`.** Mudou só o texto do
   rótulo.
6. **Removi o código que deixou de ter uso:**
   - o CSS do badge, das provas privadas, da lista de contactos e da figura dos case
     studies;
   - o JavaScript do "Copiar email";
   - o ramo das provas privadas em `Skills.astro`.

   O `check:texto` continua a saber verificar provas privadas, caso voltem.
7. **O texto substituído vai para `retirado.fase-4.2a`** no canónico, com o motivo,
   e não é apagado.
8. **A `og:image` do CadflowBankSystem** é a geral, porque não tem screenshot. Não
   corri o `npm run og`: as imagens de partilha não mudaram.

## Por fazer ou por decidir

- **A frase de abertura do Gest** diz "construída numa empresa" e "built inside a
  company" (ver acima).
- **A etiqueta do Licas**, "Cliente real · Em desenvolvimento", contradiz "Ainda não
  publicado".
- **A frase e a etiqueta repetem-se** entre a lista, as modais e os case studies
  (ver "Repetições").
- **O `CLAUDE.md` e o `ESTADO-ATUAL.md` estão desatualizados.** Ainda dizem:
  - 6 case studies e 3 modais;
  - a foto no Sobre;
  - o "Copiar email";
  - screenshots nos case studies;
  - os rótulos "Ver case study" e "Em desenvolvimento";
  - 14 páginas.

  Não os alterei, porque a tarefa não o pedia.
- **O resultado do CadflowBankSystem** diz "Entregue dentro do prazo". Na publicação
  da Fase 3 saiu uma afirmação igual do AINET, por não estar confirmada. Aqui é
  texto final teu; anoto só por coerência.
- **Verificação visual por imagem:** o painel do browser continua escondido, por
  isso tudo foi medido por script.
