# Fase 16 — relatório técnico

Data: 2026-09-22. O `README.md` refeito em inglês, e a página do repositório no GitHub.
**Publicado com autorização expressa do Francisco**, dada no enunciado.

---

## 1. O que mudou

**O `README.md`, inteiro.** O anterior tinha 109 linhas em português e descrevia
sobretudo o que o site é (a stack, as rotas, os comandos). O novo tem 94 linhas em
inglês e começa por **o que o projeto tem de diferente**: o texto verificado no build,
o PDF do CV gerado a partir da página e reproduzível ao byte, as três guardas do build,
nada de terceiros em runtime, o site a funcionar sem JavaScript, e o deploy travado
pelas verificações. Depois disso vêm o conteúdo, a stack, como correr, as verificações,
a acessibilidade, as licenças e os contactos.

Passou a ter duas coisas que não tinha:

- **o badge da Action**, ligado a `.github/workflows/deploy.yml`;
- **a imagem de partilha**, por caminho relativo dentro do repositório.

O texto foi copiado literalmente do enunciado, **com uma exceção**, que o próprio
enunciado previa.

## 2. A exceção: o LinkedIn

| Onde | URL |
|---|---|
| Enunciado | `https://www.linkedin.com/in/francisco-pereira-dev` |
| `src/data/site.json` | `https://www.linkedin.com/in/francisco-pereira-dev/` |

Diferem na barra final. O enunciado mandava usar o do `site.json` nesse caso, e foi o
que ficou. O README antigo tinha a versão sem barra, por isso a divergência já existia.

## 3. As confirmações pedidas

| O quê | Resultado |
|---|---|
| A imagem existe | `public/og-image.png`, 1200×630, 46 770 B |
| O caminho é relativo | `![franciscopereira.dev](public/og-image.png)` — caminho dentro do repositório, não um URL; o GitHub resolve-o a partir da raiz, onde o README está |
| O ficheiro do workflow | `.github/workflows/deploy.yml`, o único em `.github/workflows/`, com o nome "Deploy to GitHub Pages" |
| O repositório | `francisco-pereira-dev/Portfolio`, público |
| O badge responde | 200, `image/svg+xml`; a página do workflow, 200 |

Também se conferiram, contra o projeto, as afirmações do README que se podiam medir:
duas dependências de runtime (`astro` e `@astrojs/sitemap`), o Playwright e o axe só em
`devDependencies`, e o Node 24 no workflow. Todas verdadeiras.

## 4. O que o `gh` devolveu

Antes de editar, a permissão foi confirmada: `viewerPermission: ADMIN`, com o token a
ter o scope `repo`. Não foi preciso parar.

O comando saiu com **código 0** e sem mensagens. Antes e depois:

| Campo | Antes | Depois |
|---|---|---|
| Descrição | "Personal portfolio (franciscopereira.dev). Astro static site with PT/EN i18n, a Zod-validated content collection for projects, and custom build hooks that fail the build on missing images or stray font files." | "Personal portfolio — a bilingual Astro site where every visible string is verified against an approved source at build time, and the CV PDF is generated from the page." |
| Homepage | vazia | `https://franciscopereira.dev` |
| Topics | 5: astro, github-pages, i18n, portfolio, static-site | 7: os mesmos mais **accessibility** e **typescript** |

O `--add-topic static-site` não acrescentou nada porque já lá estava; os topics novos
são dois.

## 5. O mapa

`npm run build` → `npm run mapa` → `npm run mapa -- --verificar`, tudo a exit 0, com
102 ficheiros no disco e 102 linhas no mapa.

O tamanho do README ajustou-se sozinho (4,4 KB → 4,2 KB), mas **a descrição não**: a que
lá estava descrevia o README antigo. Foi reescrita à mão, a dizer que é em inglês, o que
tem agora, e que leva o badge e a imagem. O `--verificar` passou a seguir, o que prova
que o gerador a guardou.

## 6. A publicação

O commit leva o README, o mapa, o `CLAUDE.md`, o `ESTADO-ATUAL.md` e estes dois
relatórios. **A descrição e os topics não vão no commit**: vivem nas definições do
repositório, no GitHub, e não em nenhum ficheiro.

O último commit, só de documentação, fecha a fase com o hash publicado e a hora da
Action. O resultado da Action desse commit está na resposta final da sessão, porque este
relatório vai dentro dele.

## Decisões que tomei sozinho

1. **A descrição e os topics foram postos antes de o texto do README chegar.** O
   enunciado que abriu a fase trazia um marcador de posição em vez do README, e parei
   para o pedir; o passo do `gh` não dependia dele, estava escrito por extenso e estava
   autorizado, por isso avançou.
2. **A descrição do README no mapa reescrita**, em vez de deixar a antiga a descrever um
   ficheiro que já não existe.
3. **As afirmações do README conferidas** contra o `package.json` e o workflow antes de
   escrever, mesmo tendo o texto vindo aprovado: um README que se contradiz com o
   projeto é pior do que não ter README.

