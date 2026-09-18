# Fase 8 — relatório técnico

Data: 2026-09-18. Quatro pontos da Fase 7 por fechar. **Sem commit e sem push:** o HEAD
continua em `4f13bec`.

---

## 1. A prova do lote do `Icon.astro`

**Resposta direta: não tinha.** Quando capturei o "antes" estável, o `Icon.astro` **já
estava limpo**. A reposição por substituição de texto falhou por causa dos fins de linha,
eu confirmei-o na altura (`grep -c className` deu 0) e segui à mesma. **A comparação de
capturas estáveis cobriu o lote do `LANGS`; no lote do `Icon` comparou o ficheiro limpo
consigo próprio, e isso não prova nada.**

O relatório da Fase 7 ficou a dar a entender uma prova que, para esse lote, não tinha
existido. Está corrigido no `FASE-7-tecnico.md`, com as duas coisas separadas:

- **A prova estática, que é a que sempre valeu:** nenhum dos 4 usos do componente passa o
  prop `class`, e sem ele a classe gerada é a mesma string `"icon"`. Não havia como a
  saída mudar.
- **A prova mais forte, que cobria os dois lotes desde o início:** o SHA-256 do HTML das
  16 páginas, comparado com o estado anterior às duas remoções. As capturas são derivadas
  do HTML e do CSS — se estes não mudam, os pixéis não podem mudar.

**E refiz a prova dinâmica em condições**, como sugeriste:

1. Repus o `Icon.astro` original **a partir do commit `4f13bec`** (`git show`), e não por
   substituição de texto. Confirmei que o prop estava lá: `class?: string` e `className`,
   duas ocorrências.
2. Construí e capturei o "antes": 16 SHA-256 e 44 capturas.
3. Voltei a aplicar a limpeza, construí e capturei o "depois".

**Resultado: os 16 SHA-256 iguais e as 44 capturas iguais**, agora com o prop mesmo
presente no "antes". O lote do `Icon` passa a ter prova estática **e** dinâmica.

---

## 2. As contagens

| | |
|---|---:|
| Ficheiros no disco, fora de `node_modules/`, `dist/`, `.astro/` e `.git/` | **116** |
| Linhas na tabela do `docs/ESTRUTURA.md` | **116** |

Confirmei ficheiro a ficheiro, e não só pelo total: nenhum ficheiro do disco falta no
mapa, e nenhuma linha do mapa aponta para um ficheiro que já não existe.

**De onde vinha a diferença.** O "112" foi contado **antes** de os dois relatórios da
Fase 7 existirem — foram escritos depois de o mapa ter sido gerado a primeira vez. A
regeneração seguinte já os incluiu, e o mapa da Fase 7 ficou com 114. O número no corpo dos
dois relatórios é que tinha ficado desatualizado.

**Corrigido:** o `FASE-7-tecnico.md` (duas ocorrências, no texto e na tabela de
verificação) e o `FASE-7-resumo.md` passaram a dizer 114.

**E porque é que hoje são 116.** A mesma coisa voltou a acontecer nesta fase, e apanhei-a
desta vez: escrevi estes dois relatórios da Fase 8 depois de conferir o mapa, e a
contagem seguinte deu 116 no disco contra 114 no mapa. Acrescentei-lhes as duas linhas,
acertei os totais do mapa (116 ficheiros; 28 de documentação) e voltei a contar: **116 =
116, ficheiro a ficheiro.** É um efeito que se repete sempre que o último relatório de uma
fase é escrito depois do mapa — a regra passa a ser contar outra vez no fim.

O mapa já incluía tudo — o próprio `ESTRUTURA.md`, o `docs/LICENCAS.md` e os dois
relatórios da Fase 7. Não foi preciso regenerá-lo por falta de ficheiros; foi preciso
editá-lo por causa da Tarefa 4, e a contagem voltou a bater certo depois disso.

---

## 3. A data do `CLAUDE.md`

`## ESTADO ATUAL (2026-09-17)` → `## ESTADO ATUAL (2026-09-18)`.

---

## 4. O inventário passa a histórico

- O `LIMPEZA-PROPOSTA.md` saiu de `docs/` e passou a **`docs/historico/LIMPEZA-PROPOSTA.md`**,
  com `git mv`, para o Git registar um rename.
- **Ganhou um aviso no topo**, em citação: é um registo datado de 2026-09-18, o
  inventário vivo é o `docs/ESTRUTURA.md`, e as decisões que dele saíram estão no
  `docs/ESTADO-ATUAL.md`. As duas ligações são relativas e resolvem.
- **Prova de que o conteúdo não mudou:** o MD5 antes e depois de mover é o mesmo
  (`df609986…`). Depois de acrescentar o aviso, comparei o corpo sem essa linha com o
  corpo original: **mesmo SHA-256 e os mesmos 26 458 caracteres**.

**Referências corrigidas** (procuradas com Node, em todos os `.md`, `.astro`, `.ts`,
`.js`, `.mjs`, `.json` e `.yml` fora das quatro pastas excluídas):

| Onde | O que mudou |
|---|---|
| `CLAUDE.md` | O bloco da estrutura de pastas, e a menção nas decisões da limpeza |
| `docs/ESTADO-ATUAL.md` | Duas menções, na secção do que está por commitar e na do inventário |
| `docs/ESTRUTURA.md` | A linha saiu da tabela de `docs/` e entrou na de `docs/historico/`, com o caminho novo e uma ficha atualizada; as introduções das duas pastas passaram a explicar a mudança |
| `docs/historico/FASE-7-tecnico.md` | Uma linha que citava o caminho antigo como se fosse atual, na tabela do que tinha sido corrigido na Fase 7 |

**Verificação:** zero referências partidas. O verificador resolve cada link de Markdown a
partir da pasta do ficheiro e cada caminho entre crases contra o disco.

As menções pelo nome, sem caminho, dentro dos relatórios antigos ficaram como estavam:
`LIMPEZA-PROPOSTA.md` continua a chamar-se assim, e são registos do que se passou.

---

## 5. Verificação final

| # | Verificação | Resultado |
|---:|---|---|
| 1 | `npm run build` | ✅ exit 0, zero avisos, 16 páginas |
| 2 | `npm run check:i18n` e `check:texto` | ✅ OK; 926 verificações, zero divergências |
| 3 | Git | ✅ HEAD em `4f13bec`, nada commitado nem enviado |
| 4 | `git status` | ✅ nenhuma linha de *deleted* que não seja o par de um *rename* |
| 5 | Texto aprovado | ✅ zero ficheiros alterados em `content/`, `src/i18n/*.json`, `src/content/projects/` e `src/data/` |
| 6 | Contagem | ✅ 116 no disco = 116 no mapa, ficheiro a ficheiro |
| 7 | Referências ao `LIMPEZA-PROPOSTA.md` | ✅ nenhuma partida |
| 8 | `node_modules/.cache/` | ✅ sem nada meu |

## Decisões que tomei sozinho

1. **Refiz a prova dinâmica do lote do `Icon`** em vez de me ficar pela correção do
   texto: a tarefa dava as duas hipóteses, e com a prova feita o relatório fica a
   descrever o que aconteceu mesmo.
2. **Repus o ficheiro a partir do commit**, e não por substituição de texto — foi
   exatamente a substituição de texto que falhou da primeira vez.
3. **Reescrevi a linha do `FASE-7-tecnico.md`** que citava o caminho antigo, em vez de a
   anotar: assim não fica nenhum caminho pendurado, e o registo continua verdadeiro.
4. **Atualizei o tamanho que o `ESTRUTURA.md` declara para si próprio** (48,2 → 49,4 KB),
   que tinha ficado desatualizado depois das edições.
