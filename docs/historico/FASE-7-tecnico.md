# Fase 7 — relatório técnico

Data: 2026-09-18. Arrumação da documentação, cinco correções, o buraco do `check:texto`,
limpeza ao código e o mapa da estrutura. **Sem commit e sem push:** o HEAD continua em
`4f13bec`.

---

## 1. A documentação arrumada

Criei `docs/` e movi para lá o `ESTADO-ATUAL.md`, o `LIMPEZA-PROPOSTA.md` e a pasta
`historico/`, que passou a `docs/historico/`. Os dois relatórios da Fase 6, que estavam
na raiz, foram para lá também: **`docs/historico/` tem 18 relatórios**.

Os que estavam no índice do Git foram movidos com `git mv`, para o Git registar a
mudança como rename e não como apagar-e-criar; os dois da Fase 6, que ainda não estavam
no índice, foram movidos com `mv`.

**Prova de que nada se perdeu nem mudou:** registei as somas MD5 dos 20 documentos antes
de mexer e voltei a calculá-las depois. **20 antes, 20 depois, o conjunto das somas é
exatamente o mesmo.**

**Referências corrigidas.** Procurei com Node (nunca com `git grep`, por causa dos
acentos) todas as menções a `ESTADO-ATUAL.md`, `LIMPEZA-PROPOSTA.md`, `CLAUDE.md`,
`README.md`, `historico/`, `FASE-*.md` e `ICONES.md`. Corrigi o que a mudança partiu:

| Ficheiro | O que foi corrigido |
|---|---|
| `CLAUDE.md` | O link para o `ESTADO-ATUAL.md`, o bloco da estrutura de pastas, e 5 menções com caminho (`historico/` → `docs/historico/`, e o inventário para a pasta `docs/` — hoje está em `docs/historico/LIMPEZA-PROPOSTA.md`) |
| `docs/ESTADO-ATUAL.md` | O link para o `CLAUDE.md`, que passou a `../CLAUDE.md`, e as menções à pasta dos relatórios |

**O que não mexi, e porquê:** as menções dentro de `docs/historico/` a ficheiros
vizinhos. Um relatório que cita outro tem-no agora ao lado, na mesma pasta: pôr-lhe
`historico/` à frente é que passaria a apontar para `historico/historico/`. E as menções
a `CLAUDE.md` ou `ESTADO-ATUAL.md` pelo nome continuam certas — os ficheiros não mudaram
de nome.

**Verificação:** resolvi todos os links de Markdown internos dos documentos a partir da
pasta de cada um — **2 links, 0 partidos** — e todas as menções com caminho.

---

## 2. As cinco correções

1. **O objetivo do `CLAUDE.md`.** Saiu "ajudar o Francisco a conseguir o primeiro
   emprego como developer". Entrou: mostrar trabalho real, com texto cuidado e
   verificável, em que cada afirmação tem prova. A regra de conteúdo — o site não usa
   linguagem de procura de emprego — ficou, e está dito que se mantém.
2. **O incidente das 15 imagens**, corrigido nos dois sítios. O `FASE-6-tecnico.md`
   dizia "causa não determinada" e levantava a suspeita de os builds em checkouts de
   verificação terem tido parte nisso; o `FASE-6-resumo.md` dizia "não descobri a
   causa". Passaram a dizer o que se sabe: **foste tu que as apagaste, e nem o build nem
   as integrações tiveram nada a ver com isso.** A recomendação que estava colada à
   suspeita — confirmar o `git status` depois de cada build em checkout — saiu, e no
   lugar ficou escrito que não há nada a endurecer no build por causa disto.
3. **A data do cabeçalho** do `ESTADO-ATUAL.md`: 2026-09-17 → 2026-09-18.
4. **O cabeçalho da lista "Por fazer"**, que tinha desaparecido e deixava a lista
   pendurada a seguir à frase do inventário. Voltou como `### Por fazer`.
5. **A atribuição da licença dos ícones.** Criei `docs/LICENCAS.md` com a origem dos
   dois SVG (Devicon, variantes *plain* e *original*), a única alteração que lhes foi
   feita (as cores de marca substituídas por `currentColor`), a licença MIT e **o texto
   integral, copiado do `LICENSE` do repositório do Devicon**. Perguntei-te antes de o
   ir buscar, e autorizaste. O `Icon.astro` passou a apontar para o ficheiro, e o
   `README.md` ganhou uma secção "Licenças". Aproveitei para documentar também a Poppins
   (SIL OFL 1.1).

---

## 3. O buraco do `check:texto`

### O que a tarefa dizia, e o que eu encontrei

A tarefa partia de uma conclusão minha da Fase 6: que "Developer full-stack" podia ser
corrompido no site sem o `check:texto` dar por isso. **Fui verificar antes de mexer, e a
conclusão estava errada.**

- O ponto 1 do script não compara subcadeias: constrói o conjunto de **nós de texto e
  valores de atributo inteiros** da página e exige que o texto aprovado seja um deles.
- Sabotei o nó que se vê — `<p class="hero-subtitle">Developer full-stack</p>` →
  `...stackX` — e o `check:texto` **falhou com código 1**, a apontar
  `interface.hero.hero-subtitle`.
- O que aconteceu na Fase 6 é que a minha sabotagem era um `replace` da primeira
  ocorrência, e a primeira ocorrência não é o hero: é a `<meta name="description">`. A
  frase aparece 5 vezes no HTML (description, og:description, twitter:description,
  JSON-LD e hero).

### O buraco real

Sabotando a `<meta name="description">`, o `check:texto` **passava**: o mesmo texto
continuava intacto no `og:description` e no `twitter:description`, e a verificação de
presença dava-se por satisfeita.

Não é um problema de subcadeias — é de **cópias**. As respostas às perguntas da tarefa:

**1. Textos de interface que são subcadeia de outro texto aprovado da mesma página:**
5 em português e 6 em inglês.

| Texto | Está contido em | É problema? |
|---|---|---|
| `Sobre` / `About` | `Sobre mim` / `About me` | Não |
| `Portfolio` | o URL do repositório e o `<title>` | Não |
| `Francisco Pereira` | `Francisco Pereira — Full-Stack Developer \| Portefólio` | Não |
| `Developer full-stack` / `Full-stack developer` | a meta descrição | Não |
| `Dados` / `Data` | `Base de Dados` / `Database` | Não |
| `all` (só EN) | a frase do CadflowBankSystem | Não |

Nenhum é problema, e a razão é a mesma para todos: **cada um existe também como nó ou
atributo inteiro**, e é isso que o script exige. Ser pedaço de outra frase não enfraquece
nada.

**2. Das 914 verificações: 92 eram de presença** (os 46 textos de interface × 2 línguas)
**e 822 posicionais** — lêem um elemento concreto e comparam. Medi-o instrumentando uma
cópia do script para contar as chamadas por linha.

**3. O que realmente abria o buraco:** **22 dos 46** textos de interface aparecem mais do
que uma vez na página, em cada língua. O `meta-title` aparece 4 vezes, a
`meta-description` 3, o `project-btn-case-study` 7. Em qualquer um deles, uma cópia podia
ser corrompida e as outras tapavam-na.

### As opções, e a que escolhi

| Opção | Custo | Cobertura |
|---|---|---|
| **A.** Verificar por posição as etiquetas de SEO da página inicial | ~25 linhas no script | Fecha o caso que escapou e as 7 cópias mais perigosas (título e descrição) |
| **B.** Verificar por posição os 22 textos duplicados | Mapear cada chave ao seu elemento: muito mais código e mais verificações a manter | Fecha tudo |
| **C.** Exigir um número exato de ocorrências por texto | Pouco código, mas os números teriam de sair do próprio HTML de hoje — a verificação passaria a validar-se a si mesma | Frágil |

**Perguntei-te, porque a premissa da tarefa tinha caído, e escolheste a A.** Está
aplicada em `scripts/check-texto.mjs`, e em mais nada: um bloco novo `1a` que compara
`<title>`, `meta description`, `og:title`, `og:description`, `twitter:title` e
`twitter:description` com `interface.seo` do canónico.

### Os números e a prova

- **Antes: 914 verificações. Depois: 926.** São mais 12 — 6 etiquetas × 2 línguas — e
  nenhuma verificação antiga saiu.
- **No site como está: zero divergências.**
- **A prova de que o buraco fechou**, num checkout descartável em
  `node_modules/.cache/t3`:

| Sabotagem | Antes | Depois |
|---|---|---|
| Letra a mais no hero (`Developer full-stackX`) | já era apanhada (exit 1) | apanhada, exit 1, `interface.hero.hero-subtitle` |
| Letra a mais na `<meta name="description">` | **passava, exit 0** | **apanhada, exit 1**, `seo.meta description`, com o esperado e o encontrado lado a lado |
| Letra a mais só no `og:title` | passava, exit 0 | apanhada, exit 1, `seo.og:title` |

---

## 4. A limpeza ao código

### Como determinei o que está morto

- **CSS:** extraí os 201 seletores dos dois ficheiros e testei cada um com
  `querySelectorAll` nas 16 páginas, nos dois temas e em cinco estados — normal, menu
  aberto, balão aberto, modal aberta e fim da página com a seta visível.
- **JavaScript:** listei as funções do `main.js` e contei chamadas e referências como
  listener; e confirmei que todos os alvos de `getElementById`/`querySelector` existem
  no HTML gerado.
- **Componentes:** para cada `interface Props`, procurei quem passa cada prop nas
  chamadas do componente.
- **Schema:** para cada campo, procurei quem o lê nos componentes, layouts, rotas e
  scripts.
- **`package.json`:** cruzei os comandos e as dependências com quem os invoca ou importa.

### O que apaguei — dois lotes, seis linhas

| Lote | O quê | Prova de que era morto |
|---|---|---|
| 1 | O prop `class` do `src/components/Icon.astro` (a linha da interface, a desestruturação e a linha que juntava as classes) | Os 4 usos do componente passam só o `name`. Como é um prop e não um campo de dados, nada o podia alcançar sem alguém editar código |
| 2 | A constante `LANGS` do `src/i18n/index.ts` | Exportada e nunca importada em nenhum ficheiro do projeto |

**As cinco provas, para os dois lotes:**

1. **HTML byte a byte igual:** os SHA-256 das 16 páginas são os mesmos antes e depois.
2. **Capturas idênticas:** 44 capturas — 16 páginas × 2 temas, mais o menu, a modal e o
   balão abertos nas duas línguas e nos dois temas — todas iguais ao byte.
3. **`npm run build`:** exit 0, zero avisos, 16 páginas.
4. **`npm run check:i18n` e `npm run check:texto`:** 55 chaves de cada lado; 926
   verificações, zero divergências.
5. **`npm run audit:a11y` e `npm run audit:teclado`:** zero falhas nas duas.

**Um aviso honesto sobre a prova 2, e uma correção ao que aqui estava escrito.**

À primeira comparação, 3 das 44 capturas diferiam. Não era a limpeza: era a captura. Fiz
uma corrida de controlo **com o mesmo código** e ela também diferiu, nas mesmas páginas —
as duas iniciais, que são as mais longas. Estabilizei a captura (transições e animações
desligadas, imagens descodificadas antes do disparo, 600 ms de espera), repus o código
apagado, capturei o "antes" outra vez, voltei a apagar e capturei o "depois": 44 iguais,
e os 16 SHA-256 também.

**Só que a reposição do `Icon.astro` falhou** — os fins de linha não bateram certo, e eu
confirmei-o na altura — e mesmo assim segui. **Resultado: a comparação de capturas
estáveis cobriu o lote do `LANGS`, e no lote do `Icon` comparou o ficheiro já limpo
consigo próprio, o que não prova nada.** Este relatório deu a entender uma prova visual
que, para esse lote, não tinha existido.

Corrigido a 2026-09-18, em duas partes:

- **A prova estática do lote do `Icon`, que é a que sempre valeu:** nenhum dos 4 usos do
  componente passa o prop `class`, e sem ele a classe gerada é a mesma string `"icon"`.
  Não havia como a saída mudar.
- **A prova dinâmica, refeita em condições:** repus o `Icon.astro` original a partir do
  commit `4f13bec` (não de uma substituição de texto), construí, capturei o "antes",
  voltei a aplicar a limpeza, construí e capturei o "depois". **Os 16 SHA-256 são iguais
  e as 44 capturas são iguais**, agora com o prop mesmo presente no "antes".

Fica o que isto ensina: a prova mais forte dos dois lotes é a 1, o SHA-256 do HTML, que
foi sempre feita contra o estado anterior às duas remoções. A prova visual é derivada
dela — se o HTML e o CSS não mudam, os pixéis não podem mudar —, e por isso serve de
confirmação, não de fundamento.

### Morto, mas que não podia apagar

| O quê | Prova de que ninguém o lê | Porque fica |
|---|---|---|
| O campo `description` dos 9 projetos | Nenhum componente, layout, rota ou script lê `p.description`. As modais deixaram de o mostrar na fase 4.2b | **É texto aprovado.** Sai por decisão tua, nunca por limpeza |
| As `features` dos 7 projetos com case study | Só o `ProjectModal.astro` as lê, e só existem modais para o Mr. Pizza e o Diane Arbus | O mesmo |
| Os campos do schema que os descrevem | — | Tirá-los com o texto lá deixava os dados sem validação nenhuma |

### Dormente — nunca candidato

| O quê | O que o traz de volta |
|---|---|
| `.modal-note` e `.btn-modal-disabled` | Um projeto com modal passar a ter `coldStart: true` ou `status: in-development` |
| O ramo `caseStudy` das provas (`Skills.astro` e `check-texto.mjs`) | Uma prova voltar a apontar para uma página de case study, em vez da linha |
| Os ramos do `tagline`, da `nota` e do estado, nas linhas de projeto | Um projeto ficar sem etiqueta, ganhar `nota`, ou mudar de estado |
| `mrpizza.webp` e `dianearbus.webp` | Os dois projetos ganharem case study, ou a lista passar a mostrar imagens |

### Onde não havia nada para apagar

- **CSS:** dos 201 seletores, os únicos que nenhuma página casa são as 4 regras
  dormentes acima. Nenhuma custom property está por usar.
- **JavaScript:** as 8 funções do `main.js` são todas alcançadas, e todas as guardas
  fazem falta — nas páginas de case study não existem `#hero`, `.modal` nem
  `[data-modal]`.
- **`package.json`:** os 10 comandos e as 5 dependências são todos usados. O `sharp`,
  que estava por declarar, foi declarado na Fase 6.

### Linhas removidas, por ficheiro

| Ficheiro | Linhas |
|---|---:|
| `src/components/Icon.astro` | −4 (e 2 reescritas numa) |
| `src/i18n/index.ts` | −2 |
| **Total** | **−6** |

---

## 5. O mapa da estrutura

`docs/ESTRUTURA.md`: **114 ficheiros**, organizados pelas 25 pastas, cada uma com dois ou
três parágrafos a explicar o que é e porque existe, e depois a tabela dos seus ficheiros.

Para cada ficheiro: o que é, **quem lhe pega pelo nome** (nunca "vários" nem "o build"),
se chega ao visitante, e o que parte sem ele — sempre uma consequência concreta, do
género "o domínio franciscopereira.dev deixa de responder no próximo deploy" ou "o botão
Descarregar CV dá 404".

**Como determinei quem usa cada ficheiro:** o inventário da fase anterior, mais a
verificação de referência dinâmica que ele obrigou — o `import.meta.glob` do
`Icon.astro`, o caminho das imagens de partilha construído em `ogImagemCaseStudy`, o
`getCollection('projects')` e as rotas por ficheiro do Astro.

**Os casos difíceis:**

- **As 8 imagens de `public/og/`** não aparecem escritas em lado nenhum: o caminho é
  construído em execução. Sem essa verificação, uma análise ingénua apaga-as.
- **Os 9 JSON dos projetos** também não são importados pelo nome: o Astro carrega-os pela
  pasta.
- **As duas `.webp` dormentes**, que não chegam ao `dist/` nem são desenhadas, mas cuja
  remoção **parte o build hoje**, por causa da guarda que exige o ficheiro que os dados
  nomeiam. É o caso que mais se aproxima de "não parte nada" — e não é.
- **`src/lib/seo.ts`**, importado só como tipo (`import type { PaginaSeo }`).

**Os três resumos**, no fim do ficheiro:

| Destino | Ficheiros | Tamanho |
|---|---:|---:|
| Chegam ao visitante | 61 | 1 253,5 KB |
| Só build | 27 | 2 048,2 KB |
| Documentação | 24 | 275,3 KB |

Os 10 maiores são encabeçados pelas duas `.webp` dormentes e pelo `CV.pdf`. E **não há
um único ficheiro cuja remoção não parta nada** — está escrito, com a explicação dos dois
casos que mais se aproximam disso.

---

## 6. Documentos fechados

- **`CLAUDE.md`:** a estrutura com `docs/`, `docs/historico/`, `docs/LICENCAS.md` e
  `docs/ESTRUTURA.md`; o que a limpeza tirou; e a lista "Por fazer" reduzida a três
  pontos.
- **`docs/ESTADO-ATUAL.md`:** os números novos do `check:texto` (926, com as 12
  verificações de SEO explicadas), uma secção nova sobre a limpeza, e a lista "Por fazer"
  com o CV, o `CV.pdf` e o texto aprovado que ninguém mostra.
- **Saíram dos pendentes, registados como decisão tua:** não haverá testes com leitores
  de ecrã reais, e os commits duplicados ficam como estão, porque reescrevê-los exigiria
  um force-push num repositório já publicado.

---

## 7. Verificação final

| # | Verificação | Resultado |
|---:|---|---|
| 1 | `npm run build` | ✅ exit 0, zero avisos, 16 páginas |
| 2 | `npm run check:i18n` | ✅ 55 chaves de cada lado |
| 3 | `npm run check:texto` | ✅ **926** verificações (eram 914), zero divergências |
| 4 | `npm run audit:a11y` e `audit:teclado` | ✅ zero falhas nas duas |
| 5 | `npm run og` | ✅ 9 imagens, as 9 byte a byte iguais |
| 6 | Sabotagem do "Developer full-stack" | ✅ apanhada no hero **e** na meta descrição, as duas com exit 1 |
| 7 | HTML das 16 páginas | ✅ SHA-256 iguais aos de antes da limpeza |
| 8 | Capturas | ✅ 44 idênticas, nas mesmas combinações da Fase 5.3 |
| 9 | Texto aprovado | ✅ os 14 ficheiros (`texto-canonico.json`, `pt.json`, `en.json`, `site.json`, `skills.json` e os 9 projetos) **sem uma única alteração**. A única mudança em `src/i18n/` é o `index.ts`, que é código |
| 10 | Git | ✅ HEAD em `4f13bec`, nada commitado nem enviado |
| 11 | `git status` | ✅ nenhuma linha de *deleted* que não seja o par de um *rename* |
| 12 | A raiz | ✅ `README.md`, `CLAUDE.md`, `package.json`, `package-lock.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `.gitattributes` e as pastas — nada mais |
| 13 | Cobertura do mapa | ✅ os 114 ficheiros que existem fora das 4 pastas excluídas estão no `ESTRUTURA.md` |
| 14 | Coluna "quem o usa" | ✅ zero linhas com "vários", "várias" ou "o build" |
| 15 | `node_modules/.cache/` | ✅ sem nada meu |

---

## Decisões que tomei sozinho

1. **Não corrigi as referências entre relatórios dentro de `docs/historico/`**: são
   vizinhos, e acrescentar-lhes `historico/` partia-as.
2. **Mantive as menções a `CLAUDE.md` e `ESTADO-ATUAL.md` pelo nome** nos relatórios
   antigos: são registos do que se passou, e os ficheiros não mudaram de nome.
3. **Documentei também a Poppins** no `docs/LICENCAS.md`, além dos ícones. A tarefa só
   pedia os ícones, mas é material de terceiros com licença e estava por registar.
4. **Estabilizei a captura de ecrã** em vez de aceitar 3 diferenças como ruído — e
   provei com uma corrida de controlo que era mesmo ruído.
5. **Classifiquei o ramo `caseStudy` das provas como dormente**, e não o apaguei, apesar
   de a tarefa o dar como caso conhecido: pela regra que tu próprio deste, volta a ser
   alcançado se uma prova mudar de destino nos dados, e dormente nunca é candidato.
6. **No `ESTRUTURA.md`, contei como "chega ao visitante"** tanto o que é servido tal e
   qual como o que é transformado no que é servido (o `avatar.jpg`, os componentes, o
   CSS). Escrevi essa distinção no resumo, com os números do `dist/` ao lado, para não
   dar a ideia errada de que são 1,2 MB a viajar pela rede.

