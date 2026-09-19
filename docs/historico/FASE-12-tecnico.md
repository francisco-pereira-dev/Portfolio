# Fase 12 — relatório técnico

Data: 2026-09-19. O CV reestruturado: o Licas passa para a Experiência, as competências
sobem e a experiência passa a pontos. **Sem commit e sem push.** O HEAD continua em
`cb5e0dd`, que está publicado.

---

## 1. O que entrou e o que saiu do canónico

Um script temporário fez o seguinte:

1. Confirmou que cada valor novo é uma fatia literal do enunciado. Cada ponto tem de
   ser um item "• …" inteiro, e os títulos e as linhas de data e stack, reconstruídos a
   partir das partes, têm de estar no enunciado.
2. Confirmou que os projetos e a experiência de antes eram os esperados.
3. Só depois escreveu.

**Entrou**, na secção `cv`, a nova `experiencia`, com duas entradas por esta ordem:

| Entrada | Título (`funcao` — `empresa`) | Data (`quando`) | Stack (`tech`) | Pontos |
|---|---|---|---|---:|
| 1 | Developer — Licas, projeto de cliente / client project | 2026 – em curso / ongoing | React · TypeScript · Supabase · PostgreSQL · Vite | 3 |
| 2 | Estagiário / Intern — ITGlee, Figueira da Foz | jan. – mai. 2021 / Jan – May 2021 | OutSystems | 1 |

Os pontos começam todos por um verbo no passado: **Construí, Suportei, Apliquei,
Desenvolvi**; em inglês, **Built, Supported, Enforced, Developed**. Entraram também a
fonte `_sobre.fontes["fase-12"]` e as notas `_origem` e `_separadores` da secção `cv`
atualizadas.

**Saiu**, para `retirado["fase-12"]`, cada registo com o motivo:

- `cv.projetos[0] (Licas)`: a entrada inteira (título, descrição, stack e "cliente real,
  2026 – em curso"). Trabalho pago vai para a Experiência.
- `cv.experiencia[0].papel`: "Programador de aplicações · OutSystems" / "Application
  developer · OutSystems". É linguagem de formulário, e o cargo já está no título; o
  OutSystems passou para a linha da stack.
- `cv.experiencia[0].descricao`: a frase antiga do estágio, que deu lugar ao ponto
  "Desenvolvi…" / "Developed…".

**Os Projetos ficam com três, sem uma letra mudada:** CadflowBankSystem, 3D Analyzer e
Portfolio, em linha corrida.

**Prova de que os dados batem:**

- o `src/data/cv.json` regenerado é igual à secção `cv` do canónico, sem as notas;
- as Competências, a Educação, os Idiomas, os Interesses, o resumo e a linha "Mais seis
  projetos" estão iguais a antes;
- fora do CV, a interface, os projetos, as competências e os case studies do canónico
  estão iguais;
- repondo o CV antigo e tirando as adições, o canónico é igual ao de antes da fase.

As linhas que o diff mostra como removidas são todas do CV. A única exceção é a fonte
`fase-10`, que ganhou uma vírgula.

**Confidencialidade:** o nome "Licas" já é público e aparece. O nome do negócio e a
localidade não aparecem em lado nenhum; "Figueira da Foz" é da ITGlee e da morada do
Francisco, como antes.

---

## 2. A ordem nova e como o `check:texto` a verifica

A página segue esta ordem, nas duas línguas:

> Cabeçalho → Resumo → **Competências → Experiência → Projetos** → Educação → Idiomas →
> Interesses

No `CvPage.astro`, os blocos das secções mudaram de lugar, sem mudar o conteúdo. A
Experiência passou a ter:

- o título;
- uma linha "stack — data", no mesmo formato dos Projetos;
- os pontos numa lista (`<ul class="cv-pontos">`).

No `cv.css`, os pontos ganharam estilo de ecrã (tokens, com o marcador na cor
secundária) e medidas de impressão:

- **8,9pt de letra**, a medida da linha de item que substituem;
- **2pt antes da lista**;
- **1pt entre pontos**;
- **11pt de recuo**.

Nenhuma medida que já existia foi apertada.

**O `check:texto`** (o ponto 7), nas duas línguas:

- exige os ids das secções pela ordem nova e o título de cada uma;
- confere a Experiência entrada a entrada: o título, a linha "stack — data", e os pontos
  um a um, pela ordem, com a quantidade exata;
- no fim, confere a sequência inteira do `<main>`.

**De 1016 para 1026 verificações** (513 + 513):

- **os Projetos perdem 2 por língua**: um item a menos;
- **a Experiência ganha 7 por língua**: uma entrada a mais, as duas contagens de pontos
  e os quatro pontos;
- **dá +5 por língua, +10 no total.**

**Prova:** sabotei cópias do `dist/`. O check falhou com 7 divergências, e o `dist/` foi
reposto:
- PT: a ordem antiga (Projetos antes da Experiência) e dois pontos trocados de lugar;
- EN: um ponto reescrito e um ponto a mais no estágio.

O **`npm run cv`** também passou a comparar o PDF pela ordem nova. Conta agora 55 strings
por língua, com os pontos um a um, e aceita o marcador "•" como separador.

---

## 3. A revisão ortográfica

**Não encontrei nenhum erro de ortografia nem de acentuação**, em nenhuma das duas
línguas. Li todo o texto do CV à mão: a secção `cv`, os títulos das secções, o botão e o
título da página.

- **Português:** segue o Acordo Ortográfico ("arquitetura", "inspetor"), com as formas
  de Portugal ("cupões", "atómico") e os meses abreviados em minúscula ("jan.", "mai.",
  "set.").
- **Inglês:** é britânico ("catalogue"), coerente com o `en_GB` do site.

Uma verificação mecânica (espaços duplos, espaço antes de pontuação, aspas retas,
palavras repetidas e uma lista de formas sem acento) só deu falsos positivos da minha
lista: "Fotografia", "Apliquei" e "materna" não levam acento.

**Uma nota que não é erro, e em que não mexi:** "Suportei dois fluxos de compra" usa
"suportar" no sentido do inglês *support*, habitual em informática mas um anglicismo em
português de Portugal. Se quiseres outra palavra, é decisão tua.

---

## 4. As folgas dos PDF

| | Antes (fase 10) | Agora |
|---|---:|---:|
| PT | 36,3 mm | **8,9 mm** |
| EN | 41,0 mm | **8,9 mm** |

Os dois cabem numa página, com texto extraível e as 55 strings do canónico. Agora dão a
mesma folga, porque as duas línguas partem as linhas no mesmo sítio. **8,9 mm são cerca
de duas linhas de texto**: um terceiro ponto comprido, ou uma entrada nova, já não cabe
sem cortar texto ou apertar medidas.

**SHA-256:**

- `CV.pdf`: `55a43ae3ce3d375a4a6c8e165fb1140fc5b81b02b3905d9a3fbfe1a0d0b34048`
- `CV-en.pdf`: `9a2d65a0966d7a3e846ebe045e93ebea802869d4ea4e33d0599e466be65200c7`

Duas corridas seguidas deram exatamente estas somas.

---

## 5. A conta dos seis projetos

O site tem 9 projetos: Licas, DAE, AINET, 3D Analyzer, CadflowBankSystem, Hotel
Inteligente, Gest, Mr. Pizza e Catálogo Digital (Diane Arbus).

O CV nomeia 3 deles:

- o **Licas**, na Experiência;
- o **CadflowBankSystem**, nos Projetos;
- o **3D Analyzer**, nos Projetos.

O **Portfolio** está nos Projetos do CV mas não é um dos 9, por isso não conta.

**9 − 3 = 6**: DAE, AINET, Hotel Inteligente, Gest, Mr. Pizza e Diane Arbus. A linha "Mais
seis projetos em franciscopereira.dev" continua certa.

**O Licas aparece uma só vez em cada página do CV** ("Licas, projeto de cliente" /
"Licas, client project"), e zero vezes em atributos. **Dentro do CV não há nenhuma
repetição** de 5 ou mais palavras seguidas. Entre o CV e o resto do site passaram de 23
para 31 pares, porque os pontos do Licas contam factos do case study dele. Estão fora da
regra, pela exceção da fase 10.

---

## 6. Verificação final

| Verificação | Resultado |
|---|---|
| `npm run build` | ✅ exit 0, zero avisos, 18 páginas |
| `npm run check:i18n` | ✅ 63 chaves de cada lado |
| `npm run check:texto` | ✅ 1016 → **1026**, zero divergências |
| `npm run cv` | ✅ dois PDF de uma página, 8,9 mm de folga cada; SHA-256 acima |
| `audit:a11y` e `audit:teclado` | ✅ zero falhas, 18 páginas × 2 temas |
| `npm run mapa -- --verificar` | ✅ sem discrepâncias (102 = 102) — depois de o regenerar uma segunda vez (ver a nota abaixo) |
| A ordem das secções | ✅ a da Tarefa 1, nas duas línguas (lida no `dist/`) |
| Os pontos começam por um verbo | ✅ os 4 em cada língua |
| O Licas uma só vez | ✅ em cada página do CV |
| "Mais seis projetos" | ✅ 9 − 3 = 6 |
| `retirado["fase-12"]` | ✅ três registos, cada um com o motivo |
| Texto do site fora do CV | ✅ o diff do i18n, dos projetos, das competências, dos componentes e das outras páginas está vazio |
| `git log -1` | ✅ `cb5e0dd`, nada commitado nem enviado |
| `node_modules/.cache/` | ✅ vazia |

**Uma nota sobre o mapa.** Na primeira regeneração (Tarefa 6), o `dist/` ainda tinha os
PDF antigos. O build final trouxe os novos, e o `--verificar` do fim acusou diferenças,
porque o Resumo 1 do mapa diz quantos ficheiros e KB tem o `dist/` do último build.
Regenerei-o sobre o `dist/` final e o `--verificar` passou. É um limite do mapa, que já
existia: depende do último build. **A ordem certa é `build` → `cv` → `build` → `mapa`.**

---

## 7. Fora do enunciado, que tive de pôr em dia

**A documentação ainda dizia que o publicado era `4f13bec`** e que as fases 6 a 10
estavam por commitar. Na fase 11, o push foi bloqueado pelas permissões da sessão e
feito pelo Francisco, e a sessão acabou antes da Tarefa 7 (fechar os documentos). Nesta
fase:

- **li o resultado da Action** (só leitura, com o `gh`). O `cb5e0dd` foi publicado a
  2026-09-18 às 23:17 UTC, com `Verificar` → `Build` → `Deploy`, os três verdes e pela
  ordem certa;
- **escrevi o estado real no `CLAUDE.md` e no `docs/ESTADO-ATUAL.md`**: os seis commits,
  quem fez o quê, a Action, e que **a verificação contra o site ao vivo ainda não foi
  feita**;
- **registei o incidente do timeout do `audit:a11y`** que pediste na fase 11: nos limites
  conhecidos do ambiente de teste, no `CLAUDE.md`, e na secção das auditorias, no
  `ESTADO-ATUAL.md`;
- **deixei registado o que falta da fase 11**: os relatórios `FASE-11-*.md` e a
  verificação contra o site ao vivo, e a proposta de trocar a fotografia do PDF por
  JPEG, por decidir.

## Decisões que tomei sozinho

1. **A linha de baixo de cada entrada é "stack — data"**, no mesmo formato dos Projetos.
   O enunciado listava a data antes da stack.
2. **O marcador dos pontos fica na cor secundária**, para o que se lê primeiro ser o
   verbo.
3. **As medidas de impressão dos pontos** (8,9pt, 2pt, 1pt e 11pt de recuo) são novas,
   mas reaproveitam as da linha de item.
4. **A classe `.cv-item-linha` ficou no CSS**, sem uso. Esta fase não deixava apagar
   nada.
5. **O `retirado` ficou em três registos**, com o Licas inteiro num só.
6. **O estado da publicação na documentação**, descrito na secção 7.
