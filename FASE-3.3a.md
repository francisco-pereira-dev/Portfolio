# Fase 3.3a — Páginas de case study e o case study do Licas

Infraestrutura de case studies gerada a partir da collection, e a primeira página,
a do Licas, nas duas línguas. O objetivo era o molde ficar certo: os próximos
case studies são uma entrada de dados, sem código novo.

## ⚠️ Texto por aprovar

O enunciado dá o texto do case study e o rótulo do botão, mas a página precisa de
mais texto de interface: os títulos das secções e o link de volta. Escrevi-os como
chaves de i18n, tentando ficar o mais perto possível dos nomes das secções no
enunciado. **Não estão no canónico**, e o `check:texto` lista-os como não cobertos
até serem aprovados.

| Chave | PT | EN |
|---|---|---|
| `case-back` | Voltar aos projetos | Back to projects |
| `case-heading-context` | Contexto | Context |
| `case-heading-problem` | O problema | The problem |
| `case-heading-my-part` | A minha parte | My part |
| `case-heading-decisions` | Decisões | Decisions |
| `case-heading-went-wrong` | O que correu mal | What went wrong |
| `case-heading-outcome` | Resultado | Outcome |
| `case-heading-differently` | O que faria diferente | What I'd do differently |

A `umaFrase` não tem título: aparece por baixo do título do projeto, como entrada.

## Rotas geradas

| Língua | Rota | Ficheiro |
|---|---|---|
| PT | `/projetos/licas/` | `dist/projetos/licas/index.html` |
| EN | `/en/projects/licas/` | `dist/en/projects/licas/index.html` |

Vêm de `src/pages/projetos/[slug].astro` e `src/pages/en/projects/[slug].astro`,
que só criam rotas para os projetos com `caseStudy`. Os outros 8 não geram página
nem mostram botão, e o `check:texto` confirma as duas coisas para cada um.

O caminho de cada língua está definido num único sítio, `src/lib/caseStudy.ts`.
O `astro.config.mjs` e o `check:texto` repetem-no de propósito: o primeiro porque
a configuração não importa código do site, o segundo para verificar o `dist` sem
depender dele.

## O `caseStudy` no schema

```ts
const caseStudy = z
  .object({
    umaFrase: localized,
    contexto: localized,
    problema: localized,
    minhaParte: localized,
    decisoes: z.array(z.object({ titulo: localized, texto: localized }).strict()).min(1),
    correuMal: localized,
    resultado: localized,
    fariaDiferente: localized,
  })
  .strict();

// no objeto do projeto:
caseStudy: caseStudy.optional(),
```

- Todas as secções são obrigatórias dentro do `caseStudy`, e todas com PT e EN não vazios.
- O `.strict()` rejeita campos com nome errado. Sem ele, uma gralha como
  `umaFrasse` era ignorada e a secção desaparecia em silêncio.
- Um campo com vários parágrafos separa-os por uma linha em branco. O `problema`
  tem 2 e o `correuMal` tem 3.
- A validação existente não mudou. O campo é opcional ao nível do projeto,
  como pede o enunciado.

Provei que dispara partindo o `licas.json` de propósito:

- Com um campo `umaFrasse` a mais, o build falhou com `caseStudy: Unrecognized key: "umaFrasse"`.
- Sem a secção `resultado`, falhou com `caseStudy.resultado: Required`.

Depois repus o ficheiro, byte a byte.

## A página

**Layout.** Uma coluna de `38rem` (608 px) centrada, com texto a 17 px e
entrelinha de 1,75. Os títulos das secções vão a cor de texto principal e o
corpo a cor secundária, como no resto do site. As decisões são uma lista
numerada, cada uma com uma régua de acento à esquerda. O CSS está em
`src/styles/case-study.css` e só é carregado nestas páginas.

**Largura de leitura, medida carácter a carácter no browser a 1440 px**, só em
linhas cheias (sem contar a última linha de cada parágrafo):

| Página | Média | Mín. | Máx. | Linhas medidas |
|---|---:|---:|---:|---:|
| PT | 64,3 | 53 | 71 | 47 |
| EN | 66,7 | 55 | 74 | 43 |

As médias ficam dentro dos 60-75. Os mínimos abaixo de 60 são linhas que partem
antes de uma palavra longa; nenhuma linha passa dos 75. A 375 px a média desce
para 35-37, que é o que cabe num telemóvel.

**Cabeçalho.** Tagline, título do projeto (`h1`), a `umaFrase` em destaque e as
tecnologias. Todo este texto já estava aprovado.

**Navegação.**

- Um link de volta à lista de projetos no topo e outro no fim, os dois para
  `/#projects` (ou `/en/#projects`).
- O menu overlay aponta para as secções da página inicial da mesma língua.
- O seletor PT | EN leva à mesma página na outra língua. Os `id` das secções são
  iguais nas duas, e o script que já existia leva a âncora: quem está a ler
  "Decisões" cai em "Decisions".
- O cabeçalho e o rodapé são os componentes do resto do site.

**Botão.** No cartão, "Ver case study" / "Read case study" vai cheio a cor de
acento por baixo do "Ver Mais", para se distinguir dele, que só abre a modal. Na
modal fica depois dos botões que já existiam, e esses não mudaram.

## SEO por página

| | PT | EN |
|---|---|---|
| `title` | Licas — Plataforma de encomendas online — Francisco Pereira | Licas — Online ordering platform — Francisco Pereira |
| `description` | a `umaFrase` cortada em 154 caracteres | a `umaFrase` cortada em 149 caracteres |
| `canonical` | https://franciscopereira.dev/projetos/licas/ | https://franciscopereira.dev/en/projects/licas/ |
| `hreflang pt-PT` | …/projetos/licas/ | …/projetos/licas/ |
| `hreflang en` | …/en/projects/licas/ | …/en/projects/licas/ |
| `hreflang x-default` | …/projetos/licas/ | …/projetos/licas/ |
| `og:type` | article | article |
| `og:title`, `og:description`, `og:url` | iguais ao title, à description e ao canonical | idem |
| `og:image` | /og-image.png, 1200×630 (o Licas não tem imagem) | idem |
| `twitter:*` | card, title, description e image | idem |
| JSON-LD | nenhum: o `Person` fica só na página inicial PT | nenhum |

A `umaFrase` tem mais de 155 caracteres nas duas línguas, por isso é cortada na
última palavra inteira e acaba em reticências.

Um projeto com screenshot usa essa imagem no `og:image`, convertida para JPG de
1200 px, com as dimensões reais. **Este caminho ainda não foi exercitado**, porque
nenhum projeto com imagem tem case study.

O `<head>` da página inicial ficou idêntico ao publicado nas duas línguas: o
`Seo.astro` sem a prop `pagina` produz exatamente o mesmo que antes.

**Sitemap.** As duas páginas entram no `sitemap-0.xml`, ligadas entre si com
`xhtml:link`. A ligação automática da integração só junta páginas com o mesmo
caminho depois do prefixo da língua, e aqui os caminhos diferem
(`projetos`/`projects`). Por isso acrescentei um `serialize` que as liga.

## Canónico e `check:texto`

O texto da secção 3 do enunciado entrou primeiro em `content/texto-canonico.json`,
em `projetos.licas.caseStudy`, junto com o rótulo `project-btn-case-study`. O
`licas.json` e as chaves de i18n foram gerados a partir dele. Um script confirmou
que o `caseStudy` do `licas.json` é idêntico ao do canónico.

O `check:texto` passou de 348 para **454 verificações**. O que passou a cobrir:

- em cada página de case study, nas duas línguas:
  - o `title` e a meta description (a `umaFrase` inteira, ou cortada numa palavra
    inteira, até 155 caracteres);
  - o `h1` e a `umaFrase`;
  - as sete secções pela ordem fixa;
  - cada parágrafo de cada secção, e cada decisão, com título e texto;
- o botão no cartão e na modal, com o rótulo e o destino certos;
- para os projetos sem case study: nenhum botão e nenhuma página;
- que não há páginas de case study a mais nem a menos;
- a cobertura do i18n, que passou a ser calculada no próprio check: uma chave nova
  sem texto aprovado aparece sozinha na lista de não cobertos.

Provei que dispara sabotando o `dist`: uma palavra num parágrafo PT, o título de
uma decisão EN e o `id` de uma secção EN. Deu 5 divergências, todas as esperadas,
e depois do rebuild voltou a zero.

**Pormenor que o check apanhou:** na primeira versão, o `BaseLayout` recebia o SEO
da página mas não o passava ao componente `Seo`. As páginas de case study saíam
com o `title`, o canonical e o hreflang da página inicial. O texto passava todo;
foi o `check:texto` que falhou nas quatro verificações de SEO e mostrou o defeito.

## Confidencialidade

Verificação em todo o `dist/` (HTML, CSS, JS, XML, TXT):

| Procura | Ocorrências |
|---|---:|
| `supabase.co` | 0 |
| migration / migração | 0 |
| `RPC`, `.rpc(` | 0 |
| chaves e tokens (`eyJ…`, `sb_…`, `service_role`, anon key) | 0 |
| SQL (`create table`, `insert into`, `select … from`, `public.`) | 0 |
| e-mails | só `franciscojrp1004@gmail.com` |
| identificadores `snake_case` no texto visível | 1: `password_hash`, da feature aprovada do Hotel Inteligente (função de PHP) |

Os nomes das tabelas do Licas não os posso procurar pelo nome: para os saber teria
de ler o repositório do Licas, que está fora do âmbito. A garantia é outra: o único
texto novo é o do enunciado, copiado sem acrescentos, e as procuras acima não
encontram identificadores nem SQL.

## Critérios de aceitação

| # | Critério | Resultado |
|---|---|---|
| 1 | `npm run build` passa; o Zod valida as 9 entradas | ✅ exit 0, 4 páginas. O `.strict()` e as secções obrigatórias foram provados a falhar |
| 2 | `npm run check:i18n` | ✅ 58 chaves de cada lado |
| 3 | `npm run check:texto` passa e cobre o case study nas duas línguas | ✅ 454 verificações, zero divergências; testado por sabotagem |
| 4 | `/projetos/licas` e `/en/projects/licas` existem e servem o texto | ✅ os dois ficheiros existem; o texto é verificado parágrafo a parágrafo |
| 5 | Os outros 8 sem página nem botão | ✅ 8 × 2 línguas × (sem botão, sem página), e só `licas` em cada pasta de rotas |
| 6 | Comparação string a string da secção 3 | ✅ 30 strings (15 PT + 15 EN), divididas em parágrafos, zero divergências |
| 7 | title, description, canonical, hreflang e og:* próprios | ✅ ver tabela acima |
| 8 | As duas páginas no sitemap | ✅ com `xhtml:link` entre elas |
| 9 | Zero dados confidenciais no dist | ✅ ver secção acima, com a limitação dos nomes de tabelas |
| 10 | Sem scroll horizontal; 60-75 caracteres a 1440 px | ✅ zero elementos a transbordar a 1440, 900 e 375 px nas duas páginas e na inicial; média 64,3 (PT) e 66,7 (EN) |
| 11 | Nenhum ficheiro acima de 500 KB | ✅ 33 ficheiros, 1,2 MB; o maior é o `CV.pdf`, com 380 KB |

## Nota sobre o servidor de pré-visualização

O painel de pré-visualização lê a configuração de arranque do projeto da sessão
(o Licas), não a do portefólio. Para as medições usei `npm run dev` dentro desta
pasta, arrancado diretamente, e parei-o no fim.
