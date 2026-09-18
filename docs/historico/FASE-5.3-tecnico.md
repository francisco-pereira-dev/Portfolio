# Fase 5.3 — relatório técnico

Data: 2026-09-17. Fecha o que faltava da Fase 5.1: a limpeza autorizada, a documentação
e a verificação final. Sem commit e sem push.

---

## 1. Limpeza restrita

### 1.1 Os 13 ícones SVG

**Colisão, perguntada antes de apagar.** A regra dizia para não apagar um ficheiro cujo
nome aparecesse em qualquer sítio do repositório, documentação incluída. Os 13 nomes não
aparecem em nenhum código, mas aparecem os 13 numa linha do `FASE-5-tecnico.md` (linha
258) — a tabela que os lista precisamente como ficheiros sem uso. Perguntei, e
respondeste para apagar os 13.

**Pesquisa, antes de apagar** (todo o repositório, sem `node_modules`, `.git`, `dist` e
`.astro`):

| Ficheiro apagado | Referências em código | Menções |
|---|---|---|
| `src/icons/csharp-plain.svg` | nenhuma | `FASE-5-tecnico.md` |
| `src/icons/css3-plain.svg` | nenhuma | `FASE-5-tecnico.md` |
| `src/icons/docker-plain.svg` | nenhuma | `FASE-5-tecnico.md` |
| `src/icons/html5-plain.svg` | nenhuma | `FASE-5-tecnico.md` |
| `src/icons/java-plain.svg` | nenhuma | `FASE-5-tecnico.md` |
| `src/icons/javascript-plain.svg` | nenhuma | `FASE-5-tecnico.md` |
| `src/icons/linux-plain.svg` | nenhuma | `FASE-5-tecnico.md` |
| `src/icons/mysql-plain.svg` | nenhuma | `FASE-5-tecnico.md` |
| `src/icons/nodejs-plain.svg` | nenhuma | `FASE-5-tecnico.md` |
| `src/icons/php-plain.svg` | nenhuma | `FASE-5-tecnico.md` |
| `src/icons/python-plain.svg` | nenhuma | `FASE-5-tecnico.md` |
| `src/icons/tailwindcss-original.svg` | nenhuma | `FASE-5-tecnico.md` |
| `src/icons/typescript-plain.svg` | nenhuma | `FASE-5-tecnico.md` |

Ficaram em `src/icons/` os dois que o site usa: `github-original.svg` e
`linkedin-plain.svg`, ambos nomeados por extenso no `Contacts.astro` e no
`OverlayMenu.astro`. O `Icon.astro` lê a pasta com `import.meta.glob`, mas só desenha o
ícone cujo nome lhe for pedido.

**Prova de que nenhum ícone desapareceu do site.** Antes e depois de apagar, inventariei
todos os SVG desenhados nas 16 páginas × 2 temas, com o dono, a classe, o `viewBox`, o
desenho (os caminhos) e o tamanho:

- **140 SVG antes, 140 depois**, todos com área;
- os dois inventários são **idênticos byte a byte**;
- por dono: 72 `icon` (LinkedIn e GitHub nos contactos e no menu), 32
  `overlay-social-icon`, 4 `contact-icon-circle` e 32 `back-to-top`.

O build passa (exit 0, zero avisos).

### 1.2 As três regras de CSS

Confirmei primeiro que nenhuma era usada:

| O que saiu | Onde estava | Prova de que não era usada |
|---|---|---|
| `.btn-outline` e `.btn-outline:hover` | `global.css`, 9 linhas | Zero ocorrências em `src/`, e nenhuma no HTML gerado. Era o botão com contorno do "Descarregar CV" no hero, até à Fase 4 |
| `--footer-bg` (as duas declarações, escuro e claro) | `global.css`, linhas 114 e 174 | Zero `var(--footer-bg)` no projeto. O rodapé deixou de ter fundo próprio na Fase 4.2c |
| O apontador para o `ICONES.md` | `Icon.astro`, linha 8 | O ficheiro foi apagado a 2026-09-14 (`21d0811`). O comentário passou a dizer "(licença MIT)", sem apontar para ficheiro nenhum |

**Prova de que nada mudou visualmente:** 64 capturas de página inteira (16 páginas × 2
temas × 1440 e 375px) antes e depois. **As 64 são idênticas byte a byte**, e o
inventário de ícones também.

### 1.3 O que encontrei sem uso e NÃO toquei

- `.modal-note` e `.btn-modal-disabled` (`global.css`): estão **adormecidas**, não
  mortas. O `ProjectModal.astro` gera-as se um projeto com modal tiver arranque a frio
  ou estiver em desenvolvimento; hoje nenhum dos dois tem.
- O comentário do rodapé em `global.css` menciona o antigo `--footer-bg` para explicar
  porque é que o rodapé deixou de ter fundo próprio. É história, e fica.
- `public/robots.txt` não é referido por nenhum código: é pedido pelos motores de busca.
- `mrpizza.webp` e `dianearbus.webp` são validados pelo schema mas não chegam ao
  `dist/`, porque a integração `podar-assets-nao-referenciados` os retira.

Tudo isto fica para a limpeza completa, já registada no "Por fazer".

---

## 2. Documentação

### `CLAUDE.md`

- **Estrutura:** entra o `NavSemJs.astro`, entra `scripts/auditoria/`, e `src/icons/`
  passa a dizer que só lá estão dois ícones.
- **Comandos:** `npm run audit:a11y` e `npm run audit:teclado`, com o que cada um cobre.
- **Provas das competências:** todas levam à linha do projeto (`/#projeto-<slug>`);
  "todos" à secção; "Portfolio" ao GitHub; o case study abre-se pelo "Ver mais".
- **Contactos:** três colunas de largura igual, e porquê.
- **Acessibilidade:** seletor de idioma que anuncia o destino e cada código com o seu
  `lang`; texto alternativo novo da foto.
- **Secção nova, "O site funciona sem JavaScript":** a classe `js` no `<html>`, o tema
  pelo sistema, a navegação no cabeçalho (ou antes do rodapé abaixo de 1180px), o texto
  do "?" aberto, os controlos escondidos, e o que se perde — menu, troca de tema, seta e
  as duas modais.
- **Limites do ambiente:** o axe não corre sem JavaScript, porque precisa de o executar
  dentro da página, e fica à espera para sempre.
- **Estado atual:** fases 5, 5.1, 5.2 e 5.3 listadas; por commitar, tudo até à 5.3; e o
  contorno de foco do "?" fica como está, por decisão tua.

### `ESTADO-ATUAL.md`

- Cabeçalho: retrato no fim da Fase 5.3.
- **Secção 1:** contactos em três colunas iguais.
- **Secção 2:** mapa das provas refeito — as 19 competências agora com
  `/#projeto-<slug>` — mais a posição de chegada (96px, 72px no telemóvel) e a forma dos
  dados (`projeto`, `allRepos`, `repo`), com nota de que o ramo `caseStudy` ficou no
  código sem uso.
- **Secção 3:** números atuais e a auditoria versionada, com o que cada comando cobre,
  incluindo a parte sem JavaScript e a limitação do axe.
- **Secção 4:** tabela do que está por commitar, agora com nove fases, os ficheiros
  novos (`NavSemJs.astro`, `scripts/auditoria/`) e os 13 ícones apagados.
- **Secção 6:** o que ficou feito nas fases 5, 5.1 e 5.2; o pendente encolheu para os
  testes com leitores de ecrã reais, as auditorias fora da Action, o axe sem JavaScript
  e o que se perde sem script. O contorno do "?" está registado como decisão tua.
- **Secção 7, "Por fazer":** entra a **limpeza completa do repositório** (depois do site
  fechado, antes do CV, e nada sai sem a lista ser aprovada) e continua o **CV como rota
  `/cv`** com o `CV.pdf` que ainda diz "Instituto Politécnico de Leiria".
- **Secção 8:** decisões das fases 5.1, 5.2 e 5.3.

### `README.md`

Os dois comandos de auditoria, a nota de que arrancam o servidor sozinhas, a limitação
do axe sem JavaScript, e uma secção nova "Sem JavaScript".

---

## 3. Verificação final

| # | Verificação | Resultado |
|---:|---|---|
| 1 | `npm run build` | ✅ exit 0, zero avisos, 16 páginas, 41 ficheiros |
| 2 | `npm run check:i18n` | ✅ 55 chaves de cada lado |
| 3 | `npm run check:texto` | ✅ 914 verificações (457 + 457), zero divergências |
| 4 | `npm run audit:a11y` e `npm run audit:teclado` | ✅ zero falhas. Com JavaScript: zero violações axe nas 16 páginas × 2 temas, 874 textos medidos por tema, contraste mínimo 5,70 (escuro) e 5,02 (claro). Teclado: 32 percursos completos com Tab, contorno visível em todas as paragens |
| 5 | Sem JavaScript | ✅ 16 páginas × 2 temas do sistema × 1440/900/375: 926 textos visíveis em cada combinação, navegação no sítio certo, tema do sistema aplicado |
| 6 | 13 ícones apagados, nenhum ícone perdido | ✅ inventário de 140 SVG idêntico antes e depois (ver 1.1) |
| 7 | Três regras de CSS apagadas, sem mudança visual | ✅ 64 capturas idênticas byte a byte |
| 8 | Nada além do autorizado foi apagado | ✅ `git status` mostra exatamente 13 ficheiros apagados, todos `src/icons/*.svg` da lista |
| 9 | Provas das competências | ✅ 33 por língua; 132 percursos seguidos com clique real (2 línguas × 2 larguras × com e sem JavaScript); zero âncoras mortas; a linha para a 96px do topo (72px no telemóvel), abaixo da barra de 68px |
| 10 | Contactos centrados | ✅ título, régua, caixa dos cartões e ícones no mesmo eixo (720 / 450 / 187,5), nas duas línguas |
| 11 | Links | ✅ 72 destinos internos e 16 externos. LinkedIn devolve 999 (aceite). Os demos do Render deram 503 à primeira, a dormir; à segunda, 200 |
| 12 | Scroll horizontal | ✅ nenhum, em 16 páginas × 1440/900/375 × 2 temas |
| 13 | Consola | ✅ zero erros e zero avisos nas mesmas 96 cargas |
| 14 | `dist/` | ✅ nenhum ficheiro acima de 500 KB (o maior é o `CV.pdf`, 389 345 bytes); zero ficheiros com vestígios do axe ou do Playwright; sitemap com 16 páginas; CNAME `franciscopereira.dev` |
| 15 | Documentação | ✅ `CLAUDE.md`, `ESTADO-ATUAL.md` e `README.md` atualizados (ver 2) |

### Ficheiros apagados — lista completa

```
src/icons/csharp-plain.svg
src/icons/css3-plain.svg
src/icons/docker-plain.svg
src/icons/html5-plain.svg
src/icons/java-plain.svg
src/icons/javascript-plain.svg
src/icons/linux-plain.svg
src/icons/mysql-plain.svg
src/icons/nodejs-plain.svg
src/icons/php-plain.svg
src/icons/python-plain.svg
src/icons/tailwindcss-original.svg
src/icons/typescript-plain.svg
```

13 ficheiros, nem mais um. As outras alterações da fase são edições: `global.css`
(menos as duas regras), `Icon.astro` (uma linha de comentário), `CLAUDE.md`,
`ESTADO-ATUAL.md` e `README.md`.

---

## 4. Publicação

**Não feita.** A Tarefa 4 depende da tua confirmação explícita ("podes publicar"). Não
houve commit nem push: o HEAD continua em `9810f88`.

## Decisões que tomei sozinho

1. **No `Icon.astro`, mantive a menção à licença MIT** e tirei só o apontador para o
   `ICONES.md`. Apagar a frase inteira apagava a única referência à licença dos ícones
   do Devicon que resta no repositório.
2. **O comentário histórico do rodapé, que menciona o antigo `--footer-bg`, ficou.**
   Não é a variável; é a explicação de porque é que o rodapé deixou de ter fundo próprio.
3. **A prova de que nada mudou foi feita por comparação byte a byte** das capturas e do
   inventário de ícones, em vez de olhar para imagens uma a uma.
