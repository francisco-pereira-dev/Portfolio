# Fase 3.3 — Fecho: quatro case studies, uma descrição corrigida e a largura de leitura

Fecha a Fase 3. Seis dos nove projetos têm agora página de case study, todas no
molde da 3.3a e sem alterações ao molde. A descrição do Hotel Inteligente deixou
de afirmar uma decisão de arquitetura que não existiu, e a coluna de leitura
ficou em 37,5rem.

## ⚠️ Correção a uma medição da 3.3b

Na 3.3b reportei linhas com **76** caracteres na página inglesa do 3D Analyzer.
Esse número estava errado por um. A medição contava também o espaço onde a linha
quebra, que fica no fim da linha e não se vê. Contando só os caracteres visíveis,
essa linha tinha 75, dentro do limite.

As medições desta fase contam apenas os caracteres visíveis. Com o método
corrigido, os **37,5rem cumprem o critério**, com um máximo de exatamente 75 e
sem margem. Com 37rem, o máximo seria 74. Deixei os 37,5rem, porque foi o valor
decidido.

## Os 9 projetos

| # | Projeto | Case study | Rotas |
|---:|---|---|---|
| 1 | Licas | ✅ (3.3a) | `/projetos/licas/` · `/en/projects/licas/` |
| 2 | DAE | ✅ **novo** | `/projetos/dae/` · `/en/projects/dae/` |
| 3 | AINET | ✅ **novo** | `/projetos/ainet/` · `/en/projects/ainet/` |
| 4 | 3D Analyzer | ✅ (3.3b) | `/projetos/3d-analyzer/` · `/en/projects/3d-analyzer/` |
| 5 | CadflowBankSystem | — cartão e modal | — |
| 6 | Hotel Inteligente | ✅ **novo** | `/projetos/hotel-inteligente/` · `/en/projects/hotel-inteligente/` |
| 7 | Gest | ✅ **novo** | `/projetos/gest/` · `/en/projects/gest/` |
| 8 | Mr. Pizza | — cartão e modal | — |
| 9 | Catálogo Diane Arbus | — cartão e modal | — |

A decisão de quais projetos têm case study ficou registada no canónico, em
`caseStudies.com` e `caseStudies.sem`. O `check:texto` exige que o texto e as
páginas geradas batam com ela.

Verificado projeto a projeto, nas duas línguas: os 6 com case study têm página,
botão no cartão e botão na modal; os 3 sem case study não têm nenhum dos três.

## Case studies novos

| Projeto | Strings (PT + EN) | Decisões | Parágrafos no `correuMal` |
|---|---:|---:|---:|
| DAE | 30 | 4 | 3 |
| AINET | 26 | 3 | 3 |
| Gest | 26 | 3 | 3 |
| Hotel Inteligente | 26 | 3 | 4 |

O Gest tem 2 parágrafos no `problema`; o Hotel Inteligente tem 2 no
`fariaDiferente`. Cada texto entrou primeiro no canónico e o JSON do projeto foi
gerado a partir dele. Um script confirmou em cada um que o `caseStudy` gerado é
idêntico ao do canónico.

## Correção da descrição do Hotel Inteligente

| | Antes | Depois |
|---|---|---|
| PT | Plataforma web de Internet of Things (IoT) focada na monitorização de sensores e hardware (Arduino/ESP32). Diferencia-se por arquitetar uma API "Flat-File" em PHP puro, sem recurso a bases de dados SQL, garantindo uma comunicação leve, segura e resiliente com dispositivos físicos. | Plataforma web de monitorização de sensores e hardware (Arduino/ESP32), construída em PHP puro, sem framework e sem base de dados: as leituras dos sensores são guardadas em ficheiros. Foi o primeiro projeto da licenciatura, feito com as ferramentas que tínhamos na altura — PHP, HTML, CSS e JavaScript. |
| EN | Web platform for the Internet of Things (IoT) focused on monitoring sensors and hardware (Arduino/ESP32). It differentiates itself by architecting a 'Flat-File' API in pure PHP, without using SQL databases, ensuring lightweight, secure, and resilient communication with physical devices. | A web platform for monitoring sensors and hardware (Arduino/ESP32), built in plain PHP with no framework and no database: sensor readings are stored in files. It was the first project of my degree, built with the tools we had at the time — PHP, HTML, CSS and JavaScript. |

Os outros 11 campos do projeto ficaram iguais: slug, order, title, features, tech,
repoUrl, demoUrl, status, coldStart, image e imageAlt. Em todo o `dist/` há zero
ocorrências de "Flat-File", "garantindo uma comunicação leve" e
"ensuring lightweight".

## Largura de leitura

A coluna passou de 38rem para **37,5rem (600 px)**. Medi a 1440 px, carácter a
carácter, só os caracteres visíveis e só as linhas cheias (sem a última linha de
cada parágrafo):

| Página | Média PT | Máx. PT | Média EN | Máx. EN |
|---|---:|---:|---:|---:|
| Licas | 62,2 | 68 | 65,0 | 72 |
| 3D Analyzer | 62,1 | 70 | 65,9 | **75** |
| DAE | 61,9 | 70 | 65,8 | **75** |
| AINET | 64,2 | 71 | 65,3 | 71 |
| Gest | 63,4 | 68 | 65,7 | 72 |
| Hotel Inteligente | 62,8 | 69 | 65,4 | 71 |

Todas as médias ficam entre 60 e 75, e o máximo global é 75. Não há scroll
horizontal nem elementos a transbordar em 1440, 900 e 375 px, nas 12 páginas de
case study e nas duas páginas iniciais.

## SEO das oito páginas novas

Todas têm title, description, canonical, hreflang (pt-PT, en, x-default), og:*
e twitter:* próprios, e nenhuma tem JSON-LD.

| Página | title | description | og:image |
|---|---|---:|---|
| `/projetos/dae/` | DAE - Arquitetura Full-Stack & IA — Francisco Pereira | 150 | `dae…jpg` 1200×670, 65,7 KB |
| `/en/projects/dae/` | DAE - Full-Stack Architecture & AI — Francisco Pereira | 144 | idem |
| `/projetos/ainet/` | AINET - Plataforma Full-Stack Laravel — Francisco Pereira | 136 | `ainet…jpg` 1200×670, 67,8 KB |
| `/en/projects/ainet/` | AINET - Laravel Full-Stack Platform — Francisco Pereira | 126 | idem |
| `/projetos/gest/` | Gest - E-commerce e Gestão de Stock — Francisco Pereira | 136 | `logo-gest…jpg` 1200×670, 78,0 KB |
| `/en/projects/gest/` | Gest - E-commerce & Stock Management — Francisco Pereira | 149 | idem |
| `/projetos/hotel-inteligente/` | Hotel Inteligente - Plataforma IoT — Francisco Pereira | 121 | `ti…jpg` 1200×675, 78,1 KB |
| `/en/projects/hotel-inteligente/` | Smart Hotel - IoT Platform — Francisco Pereira | 122 | idem |

**O `og:image` dos quatro é o screenshot do próprio projeto**, e o ficheiro existe
no `dist/`. Era a primeira vez que este caminho do molde corria com imagem real.

**Uma nota:** os screenshots do DAE, AINET e Gest têm 1024 px de largura e o molde
pede 1200, por isso a pré-visualização social é uma ampliação de 1024 para 1200.
Funciona, mas perde nitidez. A solução é limitar à largura original, com uma linha
no `CaseStudyPage.astro`. Não a fiz porque a tarefa pedia o molde sem alterações.
O screenshot do Hotel tem 1400 px e é reduzido.

## Sitemap e links

- **Sitemap:** 14 páginas, 2 iniciais e 12 de case study, cada uma ligada à sua
  versão na outra língua.
- **Links internos:** 222 hrefs nas 14 páginas (30 distintos), 84 deles com âncora.
  **Nenhum partido e nenhuma âncora morta.** Cada caminho foi resolvido para o
  ficheiro no `dist/`, e cada âncora para um `id` existente na página de destino.

## Cobertura final do `check:texto`

**886 verificações, zero divergências, nada fora do canónico** (eram 574 no fim da
3.3b). Cobre:

- os seis case studies, nas duas línguas e nas suas próprias páginas:
  - `title` e meta description;
  - `h1` e `umaFrase`;
  - os títulos das sete secções, pela ordem;
  - cada parágrafo e cada decisão, com título e texto;
  - os dois links de volta;
- os botões de case study no cartão e na modal, com o destino certo;
- a ausência de página e de botão nos três projetos sem case study;
- a decisão registada: os projetos com página batem com `caseStudies.com`, e
  nenhum dos `caseStudies.sem` tem texto ou página;
- a descrição corrigida do Hotel Inteligente, e o resto do texto do site, como
  antes.

Provei que dispara sabotando o `dist` em quatro sítios: a descrição do Hotel em
inglês, um parágrafo do DAE, o título de uma decisão do Gest e o `fariaDiferente`
do Hotel. Deu 4 divergências, as quatro esperadas, e depois do rebuild voltou a zero.

## Critérios de aceitação

| # | Critério | Resultado |
|---|---|---|
| 1 | Build e Zod, 9 entradas | ✅ exit 0, 14 páginas |
| 2 | `check:i18n` | ✅ 58 chaves de cada lado |
| 3 | `check:texto` cobre os quatro case studies e a descrição corrigida | ✅ 886 verificações, zero divergências; testado por sabotagem |
| 4 | As oito rotas novas servem o texto | ✅ verificado parágrafo a parágrafo |
| 5 | Exatamente 6 com case study; os outros 3 sem página nem botão | ✅ um a um, nas duas línguas |
| 6 | Zero "Flat-File", "garantindo uma comunicação leve", "ensuring lightweight" | ✅ 0 / 0 / 0 |
| 7 | Todo o texto comparado string a string | ✅ 108 strings novas mais a descrição, zero divergências |
| 8 | SEO próprio, com o `og:image` do projeto | ✅ ver tabela; ampliação de 1024 para 1200 anotada acima |
| 9 | Sitemap com 14 páginas | ✅ 2 + 12 |
| 10 | Máximo ≤ 75 caracteres em todas as páginas de case study | ✅ máximo 75, com o método corrigido |
| 11 | Sem scroll horizontal | ✅ 14 páginas × 3 larguras |
| 12 | Nenhum ficheiro acima de 500 KB | ✅ 47 ficheiros; o maior é o `CV.pdf`, com 380 KB |
| 13 | Zero links internos partidos e zero âncoras mortas | ✅ 222 hrefs, 0 partidos |

## Commits desta fase

1. `34da3c1` Estreitar a coluna de leitura dos case studies para 37,5rem
2. `4b0a80f` Corrigir a descrição do Hotel Inteligente
3. `90ee54c` Acrescentar o case study do DAE
4. `3c4aed8` Acrescentar o case study do AINET
5. `c1d004e` Acrescentar o case study do Gest
6. `0319ea7` Acrescentar o case study do Hotel Inteligente
7. `3d8d7b1` Registar no canónico quais projetos têm case study
8. este relatório

Cada um passou no build, no `check:i18n` e no `check:texto` antes de ser feito.
