# Fase 14 — relatório técnico

Data: 2026-09-22. Fechar o projeto: o lock do git, a classe morta do `cv.css`, o
procedimento para acrescentar uma entrada à Experiência em outubro, e a publicação.
**Publicado com autorização expressa do Francisco**, dada no enunciado, só na Tarefa 4.

---

## 1. O lock

O `.git/index.lock` tinha **0 bytes**, criado a 2026-09-22 às 11:26:41 (hora local;
10:26 UTC) e não havia nenhum processo `git` a correr. Apaguei-o, e o
`git add --dry-run -A` correu a exit 0 sem nada para preparar: a árvore estava limpa e a
`main` alinhada com a `origin/main`, em `b211268`.

---

## 2. A classe apagada, com a prova

**Onde estava.** `.cv-item-linha` só existia em `src/styles/cv.css`, em duas regras: a
do ecrã (linha 184, cinco declarações com tokens) e a de impressão (linha 471, dentro do
`@media print`). Nenhum outro ficheiro de `src/` a referia; fora de `src/`, só a
documentação a mencionava, como pendente. Saíram 13 linhas: as duas regras (6 e 5
linhas) e as duas linhas em branco a seguir a cada uma. O script que as apagou verificou
o conteúdo exato das 13 linhas antes de mexer.

**Como se provou.** Duas builds na cache, "antes" e "depois", e entre elas só a
alteração ao `cv.css`:

| Verificação | Resultado |
|---|---|
| Referências em `src/` | zero, antes de apagar |
| As 16 páginas fora do CV | o mesmo SHA-256, byte a byte |
| As 2 páginas do CV (`/cv/`, `/en/cv/`) | diferem numa só linha, a 72: `href="/_astro/CvPage.CxTYq8xd.css"` passou a `CvPage.CShgY8iK.css` |
| O CSS gerado | 5743 B → 5564 B; o novo é **exatamente** o antigo sem as duas regras (179 B) |
| 4 capturas (as 2 páginas × 2 temas, 1440px, página inteira) | byte a byte iguais: 1440×2244 e 1440×2218 px, os mesmos SHA-256 |
| Os 2 PDF do `npm run cv` | o mesmo SHA-256 de antes: `4ebefdbc…6b4e` (217 950 B) e `9a2d65a0…00c7` (217 074 B); 8,9 mm de folga |

As capturas foram tiradas duas vezes na mesma build antes de mexer, e deram os mesmos
bytes: são determinísticas, e por isso a igualdade "antes/depois" prova alguma coisa.

**A verificação que falhou à letra.** O enunciado pedia o HTML das 18 páginas byte a
byte igual. Isso não pode acontecer ao mudar o `cv.css`: o Astro põe um hash do
conteúdo no nome do ficheiro CSS, e as duas páginas do CV apontam para esse nome. Como a
regra era "se qualquer uma falhar, repões e páras", **repus o `cv.css`** a partir do
blob do HEAD (bytes iguais, `git status` limpo, e a build de volta aos hashes de antes)
e **parei para perguntar**, com a prova equivalente em cima da mesa. O Francisco escolheu
**"prova equivalente e publicar"**. Voltei a apagar as duas regras e repeti a bateria
inteira: os mesmos resultados, linha por linha.

---

## 3. O procedimento para acrescentar uma entrada à Experiência

Está na **secção 9 do `docs/ESTADO-ATUAL.md`**, "Como acrescentar uma entrada à
Experiência", com os oito passos do enunciado escritos com o mecanismo real de cada um,
e a lista do que não se faz. O `CLAUDE.md` aponta-lhe da secção do CV.

Três factos que confirmei antes de os escrever:

- o `src/data/cv.json` é a secção `cv` do canónico sem as chaves que começam por `_`,
  com dois espaços de indentação — igual, ignorando só o fim de linha (o `cv.json` está
  em CRLF). **Não há comando para o gerar**: cada fase o fez com um script temporário, e
  o procedimento diz isso;
- o `check:texto` lê `cv.experiencia` do canónico e compara posição a posição (a
  `funcao`, a `empresa`, a `tech`, o `quando`, a quantidade de pontos e cada ponto), e
  depois a sequência inteira do `<main>`. Uma entrada com os mesmos cinco campos não
  obriga a mexer no script; a contagem sobe (hoje 1026);
- o terceiro ponto do Licas, o candidato a sair, tem 188 caracteres em português: é o
  mais longo dos três (176 e 146 os outros).

---

## 4. A publicação

**Verificação completa antes do commit**, pela ordem build → cv → build → mapa:

| Verificação | Resultado |
|---|---|
| `npm run build` | exit 0, zero avisos, 18 páginas, 45 ficheiros, 1 515,0 KB |
| `check:i18n` | OK |
| `check:texto` | 1026 verificações, zero divergências |
| `npm run cv` | dois PDF de uma página, 8,9 mm de folga, os SHA-256 de sempre |
| `npm run build` (de novo) | exit 0, 18 páginas |
| `audit:a11y` | zero falhas, em 60 s (18 páginas × 2 temas: 0 violações axe, contraste mínimo 5,7:1 e 5,02:1; sem JS a 1440/900/375px; a grelha do CV e a impressão) |
| `audit:teclado` | zero falhas, em 36 s |
| `npm run mapa` e `--verificar` | 102 ficheiros = 102 linhas, em dia |

**Preparados com `git add -A`: 4 ficheiros** (`cv.css` −13 linhas; `ESTADO-ATUAL.md`
+52; `CLAUDE.md` +6; o mapa, 8 linhas de tamanhos). Nenhum de `node_modules/`, `dist/`
ou `.astro/`.

**Commit `3ecefe9`** ("Remove the unused .cv-item-linha rules and document how to add an
Experience entry"), 2026-09-22 às 11:43 (hora de Lisboa). **O push passou**
(`b211268..3ecefe9`).

**A Action** (execução `35717579356`) correu verde, com o `Verificar` antes do `Build`:

| Job | Início (UTC) | Fim (UTC) | Passos |
|---|---|---|---|
| Verificar | 10:43:52 | 10:44:09 | checkout, Node 24, dependências, build, "Paridade entre PT e EN", "O site diz o texto aprovado" — todos sucesso |
| Build | 10:44:11 | 10:44:27 | instalar, construir e enviar o site — sucesso |
| Deploy | 10:44:31 | 10:44:40 | "Deploy to GitHub Pages" — sucesso |

---

## 5. A verificação ao vivo

Contra um **build limpo do `3ecefe9`**: `git archive` do commit para
`node_modules/.cache/`, `npm ci`, `npm run build`. Esse build é byte a byte o da árvore
de trabalho, nos 45 ficheiros. Às 10:45:44 UTC, um minuto depois do deploy, e sempre com
um parâmetro aleatório no URL para não ler cópias antigas da CDN:

| Verificação | Resultado |
|---|---|
| `http://franciscopereira.dev/` | 301 para `https://` |
| Certificado | Let's Encrypt (YR1), válido até 2026-10-27 |
| Sitemap ao vivo | 18 páginas |
| As 18 páginas | todas 200 |
| Byte a byte contra o build limpo | 43 de 44 ficheiros iguais; o 44.º, o `robots.txt`, é byte a byte o objeto do git (`e73f0cf`) |
| As 18 páginas num browser | 114 respostas, zero erros, zero 404 |

**O `robots.txt` outra vez.** Extraí o commit com `git -c core.autocrlf=false archive`,
para evitar os 4 bytes de CRLF da fase 13, e mesmo assim o export deu 84 B: é o
`* text=auto` do `.gitattributes`, que nesta máquina Windows converte na exportação. O
que está no ar tem 80 B e o mesmo hash de objeto que o blob do commit. Não é erro de
produção.

---

## 6. O último commit

Só de documentação: o `CLAUDE.md` e o `ESTADO-ATUAL.md` com o `3ecefe9` publicado, a
hora, a verificação ao vivo e a lista "Por fazer"; o mapa refeito (os tamanhos dos
documentos mudaram); e estes dois relatórios. Não muda o site. O resultado da Action
desse commit não pode estar aqui, porque este relatório vai dentro dele; está na
resposta final da sessão.

## Decisões que tomei sozinho

1. **Repor e perguntar** quando a verificação do HTML falhou só no nome do CSS, em vez de
   decidir que a diferença não contava.
2. **Duas corridas de capturas na mesma build**, para provar o determinismo antes de
   comparar antes e depois.
3. **A secção 9, numerada, no fim do `ESTADO-ATUAL.md`**, e um ponto na secção do CV do
   `CLAUDE.md` a apontar-lhe.
4. **O mapa no mesmo commit da classe**, porque os tamanhos mudaram e o mapa tem de estar
   em dia em cada commit.
5. **O `robots.txt` provado contra o objeto do git**, e não contra o export.

