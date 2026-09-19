# Fase 11 — relatório técnico

Escrito na fase 13 (2026-09-19). A fase 11 correu entre a noite de 2026-09-18 e a
madrugada de 2026-09-19 (hora de Lisboa). Os relatórios dela ficaram por escrever
porque o push foi bloqueado e a sessão acabou antes do fim. Aqui está só o que ficou
registado na sessão. O que não sei está dito como tal.

A fase tinha sete tarefas:

1. desbloquear o git;
2. a pasta `Claude outputs/`;
3. medir o peso dos PDF;
4. preparar tudo;
5. a verificação completa;
6. publicar;
7. fechar os documentos.

Fiz até ao fim da 6, exceto o push. A 7 e a verificação depois da publicação ficaram
por fazer.

---

## 1. O lock do git

- **O que lá estava:** `.git/index.lock`, com **0 bytes**, modificado a 2026-09-18 às
  23:52:51 (+01:00), ou seja, 22:52 UTC, como tinhas descrito.
- **Nenhum processo git a correr:** o `tasklist` não encontrou nenhum `git.exe`.
- Apaguei-o. **Prova:** `git add --dry-run README.md` respondeu `add 'README.md'`, com
  exit 0.

## 2. A pasta `Claude outputs/`

Tinha **exatamente dois ficheiros**, e mais nada:

- `CV-Francisco-Pereira.pdf`, com 43 927 B;
- `cv-preview.html`, com 11 497 B.

São **55 424 B** no total.

1. **Acrescentei ao `.gitignore`**, com um comentário a dizer o que é:
   `# maquetes que a aplicação do Claude guarda aqui quando se trabalha noutro chat;`
   `# não pertencem ao projeto (o CV a sério é a página /cv e o npm run cv)`
   `Claude outputs/`
2. A pasta saiu do `git status`. O `git check-ignore -v` mostrou que é a linha 25 do
   `.gitignore` que a ignora.
3. Apaguei os dois ficheiros e a pasta.
4. **O mapa precisou de ser regenerado:** o `.gitignore` é um dos ficheiros listados e
   mudou de tamanho, por isso o `--verificar` acusou diferenças. Nessa altura também:
   - atualizei a descrição do `.gitignore` no mapa;
   - atualizei o texto da exclusão no `gerar-estrutura.mjs`, que falava de um conteúdo
     que já não existia.

   Depois disso, 102 ficheiros no disco = 102 linhas no mapa, e o `--verificar` passou.

## 3. O peso dos PDF (só medido, nada mudado)

A fotografia, lida diretamente de cada PDF, é o objeto 9:

- **400×405 px**, com FlateDecode, isto é, sem perdas;
- com um perfil de cor ICC;
- **192 376 B, 89% do PDF**.

Desenhada a 70pt (0,97 polegadas), dá cerca de 411 dpi. O PDF não aceita WebP, e o
Chromium descodifica a imagem e guarda-a comprimida sem perdas.

**Ensaios**, feitos só em `node_modules/.cache/`, com a fotografia sozinha num PDF A4:

| Versão | No PDF | Bytes da fotografia |
|---|---|---:|
| WebP 400px (a do site) | 400×405, FlateDecode | 192 376 |
| WebP 292px (os 300 dpi) | 292×296, FlateDecode | 117 190 |
| JPEG 400px, qualidade 80 | 400×405, DCTDecode | 15 543 |
| JPEG 292px, qualidade 80 | 292×296, DCTDecode | 10 052 |

A proposta foi a versão JPEG. **Na fase 13, depois de comparar os PDF de ensaio, o
Francisco decidiu ficar como está.**

## 4. Preparar tudo

O `git add -A` preparou **57 ficheiros**. Confirmei, ficheiro a ficheiro, que:

- nenhum era de `Claude outputs/`, `node_modules/`, `dist/` ou `.astro/`;
- os 13 novos pedidos estavam todos lá: as duas rotas do CV, o `CvPage.astro`, o
  `cv.css`, o `cv.ts`, o `cv.json`, o `gerar-cv.mjs`, o `gerar-estrutura.mjs`, o
  `CV-en.pdf` e os quatro relatórios das fases 9 e 10.

## 5. A verificação completa, e o incidente do `audit:a11y`

| Verificação | Resultado |
|---|---|
| `npm run build` | exit 0, zero avisos, 18 páginas |
| `check:i18n` | 63 chaves de cada lado |
| `check:texto` | 1016 verificações, zero divergências |
| `npm run cv` | dois PDF de uma página; 36,3 mm (PT) e 41,0 mm (EN) de folga; SHA-256 `b185baef…3472` e `0dbe0ee0…ec93`, byte a byte iguais aos preparados |
| `audit:a11y` | **falhou na primeira corrida** (em baixo) |
| `audit:teclado` | zero falhas nas 18 páginas × 2 temas |
| `npm run og` | as 9 imagens iguais às do commit |
| `npm run mapa -- --verificar` | em dia |
| Links internos | 550 referências nas 18 páginas, zero partidas |

Sobre os links: a primeira versão do meu verificador deu 36 falsos positivos, porque
leu a cor do `theme-color` (`content="#F8FAFC"`) como uma âncora. Corrigi o verificador
temporário, e não o site.

**O incidente.** A primeira corrida do `audit:a11y` saiu com código 1, sem nenhuma falha
de acessibilidade listada. Rebentou dentro do próprio teste, na linha 223 do
`acessibilidade.mjs`:

- **onde:** no bloco sem JavaScript, no tema escuro, a 375px, ao seguir um link da
  navegação;
- **o erro:** `page.waitForURL: Timeout 30000ms exceeded`, à espera do `load`.

**O que não sei:**

- **o URL exato:** a mensagem não o dizia;
- **a hora exata da falha:** não a registei; foi antes das 23:04 UTC, quando começaram
  as corridas com a sonda;
- **o estado do servidor de preview nesse momento:** não o testei antes de o parar.

O script tinha deixado o servidor órfão (pid 11800). O `audit:teclado`, que correu a
seguir, reutilizou-o e passou.

O que fiz:

1. **Parei, e não publiquei.** Parei o servidor órfão e repeti o `audit:a11y` uma vez,
   só como diagnóstico. **Passou**, com zero falhas.
2. **Perguntei-te.** Pediste mais três corridas, com diagnóstico guardado antes de
   qualquer nova tentativa se voltasse a rebentar.
3. **Três corridas com uma sonda de fora** (um módulo carregado com `node --import`, sem
   mudar o script), que registava:
   - cada navegação e cada `load`;
   - a consola;
   - os pedidos falhados e as respostas de erro;
   - o log `DEBUG=pw:api` do Playwright.

   As três passaram, com cerca de 60 s cada:

   | Corrida | Eventos | Navegações | Consola | Pedidos falhados | Respostas ≥400 | Maior pausa |
   |---|---:|---:|---:|---:|---:|---|
   | 1 | 845 | 438 | 0 | 0 | 0 | 2,81 s, no arranque |
   | 2 | 845 | 438 | 0 | 0 | 0 | 2,87 s, no arranque |
   | 3 | 845 | 438 | 0 | 0 | 0 | 3,05 s, no arranque |

Conclusão: **uma falha intermitente da auditoria, não do site.** Não se reproduziu em
quatro corridas seguidas: a repetição e as três com a sonda. Ficou registada como limite
conhecido do ambiente de teste, no `CLAUDE.md` e no `docs/ESTADO-ATUAL.md`, com o que se
guarda se voltar.

## 6. Os seis commits

Um por fase, pela ordem, em inglês e com o trailer `Co-Authored-By`. Cada ficheiro foi no
commit da última fase que lhe mexeu.

| Commit | Fase | Ficheiros | O que levou |
|---|---|---:|---|
| `288142d` | 6 | 2 | `deploy.yml` e `package-lock.json` |
| `2b157e5` | 7 | 21 | `docs/LICENCAS.md`, os 18 relatórios das fases 4 a 6, `Icon.astro` e `src/i18n/index.ts` |
| `55b1368` | 8 | 5 | Os relatórios das fases 7 e 8 e o `LIMPEZA-PROPOSTA.md` |
| `f82d8e9` | 9 | 17 | As páginas do CV, o hero, o i18n, o `site.json`, as verificações, o `package.json`, o `README.md` e os relatórios da fase 9 |
| `51c045d` | 10 | 9 | O canónico, o `cv.json`, os dois PDF, o `gerar-cv.mjs`, o `CLAUDE.md`, o `ESTADO-ATUAL.md` e os relatórios da fase 10 |
| `cb5e0dd` | 11 | 3 | O `.gitignore`, o `ESTRUTURA.md` e o `gerar-estrutura.mjs` |

**Prova:** a árvore do último commit (`1558f48…`) é exatamente a árvore que estava
preparada antes dos commits. O `git status` ficou vazio.

**Consequências da regra "última fase que mexeu":**

- **O `Icon.astro` foi para a fase 7:** a fase 8 só o repôs temporariamente e deixou-o
  byte a byte igual ao da 7.
- **Alguns commits não são coerentes sozinhos:**
  - o da fase 6 tem o `package-lock.json` sem o `package.json`;
  - o da fase 9 tem o `CvPage.astro` sem o `cv.json`.

Só a ponta foi construída e publicada.

## 7. O push, bloqueado

O `git push origin main` foi **recusado pelas permissões da sessão**, com o motivo
"[Remote Repoint]". Não tentei contorná-lo. Parei e dei-te o comando para correres.

**O que fizeste à mão:** o push. Sei que aconteceu porque, na fase 12, a `origin/main`
estava em `cb5e0dd` e a Action tinha corrido. **Não sei** com que comando o fizeste nem a
que horas exatas; a Action foi criada às 23:16:47 UTC de 2026-09-18.

## 8. A Action

Li o resultado na fase 12, com o `gh`, só para leitura. A execução `35405066738` de
"Deploy to GitHub Pages", para `cb5e0dd`, terminou com **sucesso**. Os três jobs correram
pela ordem certa, `Verificar` antes do `Build`:

| Job | Início (UTC) | Fim (UTC) | Resultado |
|---|---|---|---|
| Verificar | 23:16:50 | 23:17:02 | sucesso |
| Build | 23:17:06 | 23:17:24 | sucesso |
| Deploy | 23:17:30 | 23:17:39 | sucesso |

Foi a primeira vez que o CI novo correu a sério.

## 9. O que ficou por fazer, e onde foi feito

- **A verificação contra o site ao vivo:** feita na fase 13. O `cb5e0dd` está no ar,
  igual ao build limpo do commit; os resultados estão no relatório da fase 13.
- **Os documentos:** o `CLAUDE.md` e o `ESTADO-ATUAL.md` foram postos em dia na fase 12.
- **Estes dois relatórios:** escritos na fase 13.
