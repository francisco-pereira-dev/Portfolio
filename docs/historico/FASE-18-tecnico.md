# Fase 18 — relatório técnico

Data: 2026-09-22. O contrato passa para `docs/CLAUDE.md`, a raiz fica com um importador
de duas linhas, e todos os ficheiros de texto levam uma linha vazia no fim.
**Publicado com autorização expressa do Francisco**, dada no enunciado, **num só
commit**, como o enunciado exigia.

---

## 1. O movimento já estava feito

O enunciado mandava correr `git mv CLAUDE.md docs/CLAUDE.md`. **Já estava feito**: o
Francisco fê-lo à mão no commit `e1452b2`, às 14:11, entre o fim da fase 17 e o início
desta. Não havia nada a mover, e o que se fez foi provar que o movimento não perdeu
nada e continuar a partir daí.

**A prova**, melhor do que um SHA-256 calculado antes e depois:

| O quê | Valor |
|---|---|
| `cf53fc8:CLAUDE.md` (o último commit com o ficheiro na raiz) | blob `5c4a5ec767587851150db0b3956fcdfef1a31bd5` |
| `HEAD:docs/CLAUDE.md` (depois do movimento) | blob `5c4a5ec767587851150db0b3956fcdfef1a31bd5` |
| SHA-256 do conteúdo, dos dois lados | `0045ad0743fdd1fe…bab72eb4` |

É **o mesmo objeto do git**: o conteúdo é byte a byte o mesmo, e o próprio commit do
movimento aparece como `CLAUDE.md => docs/CLAUDE.md | 0`, sem uma linha alterada. O
histórico do ficheiro mantém-se.

## 2. O importador na raiz

O `CLAUDE.md` novo da raiz tem **119 bytes** e exatamente o que o enunciado mandava:

```
@docs/CLAUDE.md

As regras deste projeto estão em docs/CLAUDE.md. Lê-o até ao fim antes de mexer em qualquer coisa.
```

A primeira linha é a importação do Claude Code, que carrega o conteúdo como se
estivesse na raiz. A segunda é a rede, para o caso de a importação não funcionar. **Não
tem mais nada**, e o conteúdo não foi copiado para lá.

## 3. Os caminhos corrigidos

Dentro do `docs/CLAUDE.md`, três correções, e só caminhos e a primeira frase:

1. **A primeira frase**: "Lido automaticamente no início de cada sessão" passou a
   "Importado pelo `CLAUDE.md` da raiz, que só tem a linha `@docs/CLAUDE.md`, e por isso
   lido no início de cada sessão como se estivesse na raiz".
2. **O único link markdown do ficheiro**: `[docs/ESTADO-ATUAL.md](docs/ESTADO-ATUAL.md)`
   passou a `[ESTADO-ATUAL.md](ESTADO-ATUAL.md)`. Era o único que o movimento partia —
   confirmei que não há mais nenhum `](…)` no ficheiro.
3. **O bloco da estrutura** ganhou duas entradas: o `CLAUDE.md` da raiz, descrito como
   só o importador, e o `docs/CLAUDE.md`, descrito como o contrato.

As restantes menções a `docs/ESTADO-ATUAL.md`, `docs/ESTRUTURA.md` e `docs/historico/`
**ficaram como estavam**, de propósito: são caminhos a partir da raiz do repositório
escritos em prosa, não são links, e continuam certos.

Nos ficheiros vivos, procurados com Node:

| Ficheiro | Menções | O que se fez |
|---|---:|---|
| `README.md` | 0 | nada |
| `docs/LICENCAS.md` | 0 | nada |
| `docs/ESTADO-ATUAL.md` | 15 | **uma corrigida**: o link `[CLAUDE.md](../CLAUDE.md)` apontava para a raiz, que agora é só o importador; passou a `[CLAUDE.md](CLAUDE.md)`. As outras 14 são prosa e continuam certas |
| `docs/ESTRUTURA.md` | 3 | a introdução da raiz e a da pasta `docs/`, reescritas à mão; a linha da tabela é refeita pelo `npm run mapa` |

Os relatórios de `docs/historico/` não foram tocados: são registo datado.

## 4. A linha vazia no fim

Dos ficheiros versionados, separados por extensão:

| Grupo | Quantos | O que se fez |
|---|---:|---|
| Texto | 115 | um `\n` acrescentado no fim, em modo binário |
| Binários (`.pdf`, `.jpg`, `.png`, `.webp`, `.ico`, `.woff2`, `.ttf`) | 30 | **não tocados** |
| `public/CNAME` | 1 | **não tocado**, por decisão do enunciado |

O `git status` confirmou-o: nenhum PDF, imagem, fonte, favicon ou CNAME aparece como
alterado.

A operação é literal — lê-se o ficheiro como bytes e escreve-se com um `0x0A` no fim —
e por isso não converte fins de linha nem toca no conteúdo. Um ficheiro que já acabava
em quebra de linha fica com uma linha vazia no fim; um que não acabava passa a acabar.

**O `docs/ESTRUTURA.md` é a exceção prática:** o gerador do mapa força exatamente uma
quebra de linha no fim (`.replace(/\n*$/, '\n')`), por isso a linha vazia que lhe foi
posta desaparece quando o mapa é refeito. Não faz diferença para o objetivo — o mapa
entra neste commit à mesma, porque os tamanhos de 115 ficheiros mudaram.

## 5. A verificação

Tudo deu o mesmo que antes, com uma exceção esperada e explicada.

| Verificação | Resultado |
|---|---|
| `npm run build` | exit 0, zero avisos, 18 páginas |
| `npm run check:i18n` | OK, 63 chaves de cada lado |
| `npm run check:texto` | 1026 verificações, zero divergências |
| `npm run cv` | os dois PDF com os **mesmos SHA-256**: `4ebefdbc…6b4e` e `9a2d65a0…00c7` |
| `npm run og` | as 9 imagens de partilha byte a byte iguais |
| `npm run audit:a11y` | zero falhas |
| `npm run audit:teclado` | zero falhas |
| `npm run mapa` e `--verificar` | o mapa em dia, com os tamanhos novos e o `docs/CLAUDE.md` |

**Os PDF são a prova que interessa.** São reproduzíveis desde a fase 10: os mesmos
bytes se o texto não mudar. Acrescentar uma quebra de linha ao fim de 115 ficheiros,
incluindo os componentes `.astro`, o CSS e o canónico, **não mexeu num único byte
deles** — o que mostra que a operação foi mesmo cosmética.

A exceção esperada: o nome dos ficheiros CSS do `dist/` leva um hash do conteúdo, e o
CSS ganhou a quebra de linha, por isso o nome muda e as páginas que lhe apontam mudam
nessa linha. É o mesmo efeito das fases 14 e 15.

## 6. O commit único

Um só commit, como o enunciado exigia: o movimento já feito, o importador novo, os
caminhos corrigidos, a linha vazia em 115 ficheiros, o mapa, o `ESTADO-ATUAL.md` e
estes dois relatórios.

**Não há um segundo commit a registar o hash.** O `docs/ESTADO-ATUAL.md` diz
explicitamente que o hash não está lá, e porquê: registá-lo exigia outro commit, que é
o que esta fase proíbe. Quem quiser sabê-lo tem o histórico do git.

## Decisões que tomei sozinho

1. **Continuar em vez de parar**, ao encontrar o `git mv` já feito. O estado no disco
   era exatamente o que o passo 1 pedia, e era demonstrável por comparação de objetos do
   git; não havia nada a adivinhar.
2. **As menções em prosa a `docs/…` ficaram como estavam.** São caminhos a partir da
   raiz do repositório, não links, e reescrevê-los todos seria mexer em texto por
   estética, com o risco de os tornar ambíguos.
3. **O `docs/ESTRUTURA.md` é refeito depois da linha vazia**, e não antes, para o mapa
   levar os tamanhos novos dos 115 ficheiros.

