# Fase 17 — relatório técnico

Data: 2026-09-22. O `README.md` simplificado: só texto, sem imagens nem badge. E a
descrição do repositório, ajustada. **Publicado com autorização expressa do Francisco**,
dada no enunciado.

---

## 1. O que mudou

**O `README.md`, inteiro**, copiado literalmente do enunciado. O da fase 16, escrito
horas antes, tinha 94 linhas e 4,2 KB; este tem 75 linhas e 2,8 KB — **menos 1,4 KB**.

O que saiu:

- **o badge da Action**, que era a segunda linha do ficheiro;
- **a imagem de partilha**, que ocupava a largura toda logo a seguir à linha "Live";
- **o segundo e o terceiro link para o site**: a linha "Live" tinha os dois endereços,
  o português e o inglês, cada um como link com o seu rótulo.

O que mudou de forma:

- a linha "Live" passou a ser **um só endereço em texto simples**, `**Live:**
  https://franciscopereira.dev`, que o GitHub converte em link sozinho;
- a secção "What's different about it" passou a chamar-se **"How it works"**, e ganhou
  o ponto do deploy travado pelas verificações, antes disperso;
- a stack deixou de ser uma lista e passou a **um parágrafo corrido**;
- as verificações deixaram de incluir o `npm run build` na lista, que agora tem cinco
  comandos em vez de seis;
- a acessibilidade encolheu de um parágrafo com a explicação do axe sem JavaScript para
  **duas linhas** com os números.

## 2. As confirmações pedidas

Feitas por script sobre o ficheiro escrito, e não a olho:

| O quê | Resultado |
|---|---|
| Imagens em markdown (`![…](…)`) | **nenhuma** |
| Tags `<img>` | **nenhuma** |
| Badges (`badge.svg` ou `shields.io`) | **nenhum** |
| Menções a `og-image` | **nenhuma** |
| Links para `franciscopereira.dev` | **um só**: `https://franciscopereira.dev`, na linha "Live" |
| Blocos de código | 2, como no enunciado |
| LinkedIn | igual ao do `src/data/site.json`, com a barra final |
| Email | `franciscojrp1004@gmail.com`, o do `site.json` |

**A `public/og-image.png` não foi tocada.** Antes de tirar o README de cima dela,
confirmei quem a usa: o `src/components/Seo.astro` serve-a como pré-visualização social
por omissão, em todas as páginas sem imagem própria. O `git status public/` ficou vazio
do princípio ao fim.

## 3. O que o `gh` devolveu

Permissão confirmada antes: `ADMIN`. O comando saiu com **código 0** e sem mensagens.

| Campo | Antes | Depois |
|---|---|---|
| Descrição | "…every visible string is **verified against an approved source at build time**…" | "…every visible string is **checked against an approved source before every deploy**…" |
| Homepage | `https://franciscopereira.dev` | igual |
| Topics | 7 | os mesmos 7 |

Só a descrição mudou. Os sete `--add-topic` não acrescentaram nada, porque os topics já
tinham ficado postos na fase 16, e a homepage já lá estava.

## 4. O mapa

`npm run build` → `npm run mapa` → `npm run mapa -- --verificar`, tudo a exit 0, com 102
ficheiros no disco e 102 linhas no mapa.

O tamanho do README ajustou-se sozinho (4,2 → 2,8 KB), mas a descrição **prometia um
badge e uma imagem que já não existem**. Foi reescrita à mão, a dizer que é só texto,
sem imagens nem badge, e com um só link para o site. O `--verificar` passou a seguir.

É a segunda vez em duas fases que isto acontece, e vale a regra: **o gerador do mapa
corrige tamanhos, nunca afirmações.** Quem muda um ficheiro descrito à mão tem de ler a
descrição dele.

## 5. A publicação

O commit leva o README, o mapa, o `CLAUDE.md`, o `ESTADO-ATUAL.md` e estes dois
relatórios. **A descrição do repositório não vai no commit**: vive nas definições do
GitHub. E **o site não muda**: o README nunca chega ao `dist/`.

O último commit, só de documentação, fecha a fase com o hash publicado e a hora da
Action. O resultado da Action desse commit está na resposta final da sessão, porque este
relatório vai dentro dele.

## Decisões que tomei sozinho

1. **Confirmar quem usa a `og-image.png`** antes de tirar a referência do README, para o
   enunciado ("fica onde está") ficar provado e não só obedecido.
2. **A descrição do mapa reescrita**, em vez de deixar uma que prometia um badge que já
   não existe.
3. **As confirmações do ponto 3 feitas por script**, sobre o ficheiro gravado, porque
   "não tem imagens" é o tipo de coisa que se lê e não se vê.

