# Fase 3.3b — Case study do 3D Analyzer e duas pendências fechadas

Segundo case study, no molde da 3.3a e sem lhe mexer. Com ele fecham-se as duas
pendências dessa fase: os títulos de secção, agora aprovados, e as 8 divergências
de `alt` e tecnologias em inglês. O canónico cobre agora todo o texto do site:
o `check:texto` não lista nenhuma chave nem nenhum campo como não coberto.

## As 8 divergências em inglês

Regra aplicada: o `imageAlt` em inglês é a tradução direta do português, sem
informação a mais; os nomes próprios de tecnologias não se traduzem e os rótulos
genéricos traduzem-se.

| Projeto | Campo | PT | EN | O que fiz |
|---|---|---|---|---|
| AINET | `imageAlt` | AINET - Plataforma Full-Stack Laravel | AINET - Laravel Full-Stack Platform | Mantido: já era a tradução direta |
| DAE | `imageAlt` | DAE - Arquitetura Full-Stack & IA | DAE - Full-Stack Architecture & AI | Mantido |
| **Diane Arbus** | `imageAlt` | Catálogo Digital - Diane Arbus | **Digital Catalog - Diane Arbus** | **Alterado.** Era "Diane Arbus - Digital Catalog", com a ordem invertida face ao PT |
| Gest | `imageAlt` | Gest - E-commerce e Gestão de Stock | Gest - E-commerce & Stock Management | Mantido |
| Hotel Inteligente | `imageAlt` | Hotel Inteligente - Plataforma IoT | Smart Hotel - IoT Platform | Mantido |
| Mr. Pizza | `imageAlt` | Mr. Pizza - Plataforma E-commerce | Mr. Pizza - E-commerce Platform | Mantido |
| Gest | `tech` | OutSystems · Base de Dados | OutSystems · Database | Mantido. OutSystems é nome próprio; "Base de Dados" é rótulo genérico |
| DAE | `tech` | Docker · LLaMA 3 (IA) · Full-Stack · Vite | Docker · LLaMA 3 (AI) · Full-Stack · Vite | Mantido. Docker, LLaMA 3 e Vite são nomes próprios; "(IA)" é rótulo genérico |

Sete já cumpriam a regra; só o Diane Arbus mudou. Uma consequência: em todos os
outros projetos o `alt` em inglês é igual ao título em inglês, e no Diane Arbus
deixou de ser. O título continua "Diane Arbus - Digital Catalog", porque é texto
aprovado do site original e esta tarefa não lhe tocava.

O motivo de cada decisão ficou registado no canónico, junto ao valor
(`imageAlt._en` e `tech._en`).

## Títulos de secção

Aprovados, com "Decisões" → "Decisões técnicas" / "Decisions" → "Technical
decisions". As 8 chaves entraram no canónico numa secção própria,
`interface.caseStudy`. As duas chaves de i18n alteradas foram geradas a partir dela.

## Case study do 3D Analyzer

- 34 strings (17 PT + 17 EN), 5 decisões técnicas, 2 parágrafos no `problema` e
  4 no `correuMal`.
- O molde suportou as 5 decisões sem alteração: o schema exige pelo menos uma e
  não tem limite, e a página percorre a lista. Não mexi em código do site, só em
  dados.
- O texto entrou primeiro no canónico e o `3d-analyzer.json` foi gerado a partir
  dele. Um script confirmou que o `caseStudy` gerado é idêntico ao do canónico.

## O que o `check:texto` passou a cobrir

De 454 para **574 verificações**.

- **Títulos de secção**: verificados em cada página de case study, secção a secção,
  nas duas línguas. Não existem na página inicial, por isso deixaram de ser
  procurados lá.
- **Links de volta**: os dois de cada página, o do topo e o do fim, com o texto e
  o destino certos.
- **As 8 divergências**: o `alt` em inglês dos 6 projetos, no cartão e na modal,
  e as tecnologias em inglês do Gest e do DAE.
- **O case study do 3D Analyzer**: `title`, meta description, `h1`, `umaFrase`,
  as sete secções pela ordem, cada parágrafo e cada decisão, os botões no cartão
  e na modal, e a página nas duas línguas.
- **Cobertura**: zero chaves de i18n e zero campos de projeto fora do canónico.

Provei que a cobertura nova dispara sabotando o `dist` em quatro sítios:

- um título de secção PT;
- um link de volta EN;
- o `alt` do Diane Arbus reposto na ordem antiga;
- "Database" trocado por "Base de Dados".

Deu 4 divergências, as quatro esperadas, e depois do rebuild voltou a zero.

## SEO das páginas novas

| | PT | EN |
|---|---|---|
| `title` | 3D Analyzer — Inspetor de malhas com motor C++ — Francisco Pereira | 3D Analyzer — Mesh inspector with a C++ engine — Francisco Pereira |
| `description` | a `umaFrase` cortada em 145 caracteres | a `umaFrase` cortada em 151 caracteres |
| `canonical` | https://franciscopereira.dev/projetos/3d-analyzer/ | https://franciscopereira.dev/en/projects/3d-analyzer/ |
| `hreflang pt-PT` / `x-default` | …/projetos/3d-analyzer/ | …/projetos/3d-analyzer/ |
| `hreflang en` | …/en/projects/3d-analyzer/ | …/en/projects/3d-analyzer/ |
| `og:type` | article | article |
| `og:title`, `og:description`, `og:url` | iguais ao title, à description e ao canonical | idem |
| `og:image` | /og-image.png, 1200×630 (o 3D Analyzer não tem imagem) | idem |
| `twitter:*` | card, title, description e image | idem |
| JSON-LD | nenhum | nenhum |

As duas páginas entram no `sitemap-0.xml`, ligadas entre si por `xhtml:link`.

## Critérios de aceitação

| # | Critério | Resultado |
|---|---|---|
| 1 | Build e Zod, 9 entradas | ✅ exit 0, 6 páginas |
| 2 | `check:i18n` | ✅ 58 chaves de cada lado |
| 3 | `check:texto` cobre títulos, divergências e case study novo | ✅ 574 verificações, zero divergências, zero não cobertos; testado por sabotagem |
| 4 | `/projetos/3d-analyzer` e `/en/projects/3d-analyzer` | ✅ existem e servem o texto, verificado parágrafo a parágrafo |
| 5 | Os 7 sem case study continuam sem página nem botão | ✅ verificado projeto a projeto; só `licas` e `3d-analyzer` nas pastas de rotas |
| 6 | Texto da secção 3 comparado string a string | ✅ 34 strings, zero divergências |
| 7 | SEO próprio | ✅ ver tabela acima |
| 8 | Sitemap | ✅ as duas páginas, com `xhtml:link` |
| 9 | Scroll e caracteres por linha | ✅ zero elementos a transbordar a 1440, 900 e 375 px. Medições a 1440 px abaixo |
| 10 | Ficheiros acima de 500 KB | ✅ nenhum; 35 ficheiros, 1,2 MB |

### Caracteres por linha a 1440 px

Medidos carácter a carácter no browser, só em linhas cheias (sem contar a última
linha de cada parágrafo):

| Página | Média | Mín. | Máx. |
|---|---:|---:|---:|
| 3D Analyzer PT | 63,9 | 56 | 73 |
| 3D Analyzer EN | 67,9 | 59 | **76** |
| Licas PT (3.3a) | 64,3 | 53 | 71 |
| Licas EN (3.3a) | 66,7 | 55 | 74 |

As médias ficam dentro dos 60-75. No 3D Analyzer em inglês há linhas com 76,
**um carácter acima do limite** que a 3.3a fixou. Não ajustei a largura da coluna:
isso mudava o molde, e esta tarefa pedia para o reutilizar sem alteração.
Estreitar a coluna de 38rem para 37,5rem resolvia o caso, se o quiseres.

## Notas

- **"Orçamentar" / "Quoting".** O critério 2 da fase 3.3 exigia zero "orçamentação"
  e "quoting" associados a este projeto. O texto novo usa "Orçamentar" e "Quoting"
  na `umaFrase`. Copiei-o como está, porque é o texto final que me deste; fica
  anotado para saberes que o critério antigo deixa de valer.
- **Servidor de pré-visualização.** Como na 3.3a, o painel só aponta para o projeto
  Licas. Para as medições usei `npm run dev` dentro desta pasta, e parei-o no fim.
