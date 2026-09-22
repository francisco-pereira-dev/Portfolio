# Fase 4.2c — Ajustes visuais e três correções: relatório técnico

Nesta fase entraram:

- **ajustes visuais depois de o Francisco ver o site:**
  - foto maior;
  - um só fundo;
  - cabeçalhos sem número;
  - círculos dos contactos sem preenchimento cinzento;
  - o Licas como linha normal;
  - mais espaço antes de "Design → Código";
  - contactos sem introdução;
  - rodapé simples;
- **as etiquetas dos três projetos universitários;**
- **três correções:**
  - o contraste do botão principal;
  - as repetições do Gest;
  - a seta de voltar ao topo.

Nada foi commitado nem enviado. Não entraram fontes, dependências nem cores novas, com
uma exceção autorizada: o fundo do botão "Ver projetos".

## Colisões resolvidas antes de implementar

| Colisão | Decisão do Francisco |
|---|---|
| O rodapé simétrico acabava com os 96px de baixo, que existiam para a seta nunca tapar o rodapé no fim da página | "Metas a seta um bocado acima, quero um rodapé simples": o rodapé fica simétrico e a seta sobe |
| Com um só fundo, o preenchimento `--surface-color` da seta quase não se distingue da página (1,05:1 no claro, 1,22:1 no escuro) | O contorno passa de `--border-color` a `--text-secondary`, uma variável que já existia |

## Ficheiros alterados

O diff contra o HEAD (`9810f88`) acumula quatro fases por commitar: o fim da Fase 4,
a 4.2a, a 4.2b e esta. A coluna "Nesta fase" é a diferença para o diff do fim da
4.2b. É aproximada, porque o `numstat` não se subtrai exatamente.

| Ficheiro | Acumulado (+/−) | Nesta fase (≈ +/−) | O que mudou nesta fase |
|---|---|---|---|
| `src/styles/global.css` | 211 / 169 | +10 / −33 | Foto, fundo único, cabeçalhos sem número, Licas, espaços, contactos, rodapé, botão, seta |
| `content/texto-canonico.json` | 322 / 78 | +33 / −2 | 3 etiquetas universitárias, Gest, sai `contacts-text`, `retirado.fase-4.2c`, fonte |
| `src/components/Projects.astro` | 9 / 48 | +6 / −46 | Sai o bloco de destaque; o Licas passa a linha |
| `src/components/ProjectRow.astro` | 10 / 1 | +8 / −0 | Rótulo inerte "Ainda não publicado" na coluna da ação |
| `src/components/SectionHeading.astro` (novo nas fases por commitar) | 18 / 0 | −9 | Sai a linha "01 — SOBRE" |
| `scripts/check-texto.mjs` | 59 / 34 | −4 | O cabeçalho exige só o título e a régua, sem mais texto |
| `src/content/projects/dae.json` · `ainet.json` · `hotel-inteligente.json` | 12/4 · 8/0 · 8/0 | +4 cada | Etiqueta nova |
| `src/content/projects/gest.json` | 10 / 10 | (3 valores trocados) | Etiqueta, frase da linha e `umaFrase` |
| `src/components/Contacts.astro` | 51 / 36 | −1 | Sai a introdução |
| `src/components/About.astro`, `Skills.astro` | | (1 linha trocada cada) | `SectionHeading` sem número |
| `src/components/Hero.astro` | 15 / 5 | (1 linha trocada) | A foto é pedida a 400px |
| `src/i18n/pt.json`, `en.json` | 9 / 14 cada | −1 cada | Sai `contacts-text`; ficam 54 chaves |

## CSS removido por deixar de ser usado

- **`.section-eyebrow` e `.section-num`:** a linha "01 — SOBRE".
- **Os fundos alternados:**
  - `background-color`, `box-shadow: 0 0 0 100vmax` e `clip-path` em `.skills-section, .contacts-section`;
  - o mesmo em `.about-section, .projects-section`.
- **O destaque do Licas:** `.project-featured`, `.project-featured .project-title` e `.project-featured-actions`.
- **A introdução dos contactos:** `.contacts-text`.
- **No `.site-footer`:** `background: var(--footer-bg)`, `backdrop-filter` e `-webkit-backdrop-filter: blur(12px)`, e `transition: background`.

Chaves de i18n:

- **Saiu `contacts-text`.** O texto ficou registado no canónico em `retirado.fase-4.2c`.
- **A linha "01 — SOBRE" não tinha chaves próprias.** Usava os rótulos do menu (`overlay-about`
  e os outros), que o menu continua a usar, por isso não havia chaves a remover.

A variável `--footer-bg` deixou de ser usada, mas continua definida, porque é um dos
17 custom properties de cor, que não mudam.

## O que causava o destaque do rodapé

1. **Fundo próprio**, `background: var(--footer-bg)`, semitransparente:
   - no tema claro era `rgba(255,255,255,0.85)` sobre `#F8FAFC`, uma faixa mais branca do que a página;
   - no tema escuro era `rgba(15,23,42,0.8)`.
2. **`backdrop-filter: blur(12px)`**, que desfocava o que passava por trás e dava ao
   rodapé o aspeto de uma barra à parte.
3. **Espaço assimétrico:** 24px em cima e 96px em baixo, reservados na 4.2b para a seta.
   Fazia do rodapé um bloco alto, com o texto encostado ao topo.

**Agora:**

- o fundo é transparente, sem desfoque;
- mantém a régua de 1px com `--border-color`;
- tem `--sp-8` (32px) em cima e em baixo;
- o conteúdo está centrado, numa linha a 1440 e 900px e em 3 linhas a 375px;
- o texto, os links e os separadores têm todos 13px e a mesma cor.

## Botão principal: cor e contraste

- **Cor final do fundo:** `#7C3AED` (rgb 124, 58, 237), com o contorno da mesma cor.
  - É o roxo mais escuro da família: o mesmo tom que o site já usa para o texto a
    roxo no tema claro (`--accent-text`).
  - O `hover` continua a escurecer 10%.
- **Contraste medido:** texto branco sobre `#7C3AED` dá **5,70:1**, nos dois temas.
  Antes, sobre `#8B5CF6`, dava 4,23:1.
- **O acento `#8B5CF6` não mudou** no resto do site: réguas, contornos, ícones e barra
  de scroll.

## Parte 2 e 3.2 — texto

Todo o texto entrou primeiro no canónico, com a fonte `fase-4.2c`, e foi gerado para os
dados. O texto substituído ficou em `retirado.fase-4.2c`, com o motivo.

- **DAE e AINET:** "Projeto universitário · Equipa de 4" / "University project · Team of 4".
  Não tinham etiqueta.
- **Hotel Inteligente:** "Projeto universitário · Equipa de 2" / "University project · Team of 2".
  Também não tinha.
- **Gest:**
  - etiqueta "Secundário · 2021" / "Secondary school · 2021";
  - frase da linha nova;
  - `umaFrase` nova;
  - o contexto ficou igual.

**Repetições que as etiquetas novas criam** (texto final, não mexi):

| Projeto | Etiqueta | Contexto do case study |
|---|---|---|
| DAE | "Equipa de 4" | "Equipa de quatro" |
| AINET | "Equipa de 4" | "Equipa de quatro" |
| Hotel | "Equipa de 2" | "em equipa de dois" |

"Projeto universitário" também repete o que o contexto diz: "unidade curricular" e
"primeiro projeto da licenciatura".

## Critérios de aceitação

| # | Critério | Resultado |
|---|---|---|
| 1 | Build sem avisos | ✅ exit 0, 0 avisos, 16 páginas |
| 2 | `check:i18n` | ✅ 54 chaves de cada lado |
| 3 | `check:texto` | ✅ **894 verificações, zero divergências**, sem `contacts-text`, com as etiquetas e o Gest novos. O cabeçalho de secção passa a exigir só o título e a régua |
| 4 | Foto 200px e 150px | ✅ 200×200 a 1440 e 900px, 150×150 a 375px, redonda e com `object-fit: cover`. Até ao nome: 32px (24px no telemóvel) |
| 5 | Fundo único nos dois temas | ✅ As 5 secções e o rodapé são transparentes sobre o `body` (`--bg-color`), sem sombras nem desfoque. Nenhum outro elemento com mais de 120×60px tem fundo diferente, nas duas línguas e nos dois temas. Os círculos dos contactos têm a cor da página |
| 6 | Zero "01 —" a "04 —" | ✅ 0 nas 16 páginas, e zero `section-eyebrow` e `section-num` |
| 7 | Licas com a mesma estrutura das outras linhas | ✅ **Zero diferenças** a 1440, 900 e 375px, nas duas línguas: elemento, classe, grelha, padding, borda, tamanho e peso do título, posição do número, do cabeçalho e da ação. Ver a nota abaixo |
| 8 | Espaço antes de "Design → Código" ≥ 2× o espaço entre linhas | ✅ 121px contra 49px (**2,47×**) a 1440 e 900px; 113px contra 33px (**3,42×**) a 375px |
| 9 | Sem a introdução dos contactos | ✅ 0 ocorrências de cada frase, em qualquer língua, e sem a classe `contacts-text` |
| 10 | "Prova de Aptidão Profissional" no máximo 2 por língua | ✅ PT: 2 (a frase da linha e o contexto do Gest); EN: 0 |
| 11 | Frase da linha diferente da `umaFrase` do Gest | ✅ Diferentes nas duas línguas; cada uma só aparece no seu sítio |
| 12 | "Ver projetos" ≥4,5:1 | ✅ **5,70:1** (branco sobre `#7C3AED`), nos dois temas |
| 13 | Contraste ≥4,5:1, sem exceções | ✅ **2348 textos**, 16 páginas, dois temas, modais abertas: **nenhum abaixo de 4,5:1**. Ver abaixo |
| 14 | A seta distingue-se do fundo | ✅ Contorno 12,02:1 no escuro e 7,24:1 no claro; seta desenhada 13,98:1 e 17,85:1 sobre o preenchimento. Parada no fim da página, não tapa nada em nenhuma das 48 medições |
| 15 | Sem scroll horizontal | ✅ 48 medições (16 páginas × 3 larguras) |
| 16 | Zero erros de consola | ✅ 16 páginas, nas duas línguas |
| 17 | Nenhum ficheiro acima de 500 KB | ✅ 41 ficheiros, 1 394,6 KB; o maior é o `CV.pdf`, com 380 KB |

**As três piores combinações de contraste** (todas no tema claro):

1. "O que correu mal", âmbar `#B45309` sobre a caixa branca: **5,02:1**.
2. O ponto final roxo do nome, `#7C3AED` sobre `#F8FAFC`: **5,45:1**.
3. O roxo de texto nos links de prova (por exemplo "Licas"), na etiqueta "Cliente real"
   e no link "Voltar aos projetos": **5,45:1**.

O mínimo no tema escuro é 5,70:1.

**Nota ao critério 7.** Na primeira medição a linha do Licas não era igual, por duas
razões:

- **A coluna da ação era automática.** O rótulo "Ainda não publicado" alargava-a para
  208px, contra 90px nas outras linhas, e a descrição ficava mais estreita só nessa
  linha.
- **No telemóvel, a coluna do número também era automática.** "01" ocupava 12px e "02",
  16px.

Corrigi com colunas de largura fixa para todas as linhas: 13rem para a ação e
`--sp-8` para o número no telemóvel. Depois disso ficaram zero diferenças.

## A seta de voltar ao topo

- **Posição:**
  - a 64px do fundo (`--sp-16`) em ecrãs largos;
  - a 192px no telemóvel (`calc(var(--sp-32) + var(--sp-16))`), a `--sp-4` da direita.
- **Porquê 192px no telemóvel:** a 375px o rodapé quebra em 3 linhas de alvos de toque
  de 44px e fica mais alto. Com 128px, a primeira medição mostrou a seta por cima do
  link "LinkedIn" no fim de 8 páginas. A escala não tem valor acima de 128px, por isso
  somei dois degraus.
- **Preenchimento:** continua `--surface-color`. O contorno passou a `--text-secondary`.
- **O comportamento não mudou.**

## Decisões que tomei sozinho

1. **Espaço entre secções, "cerca de 20%" dentro da escala.** O espaço de cima de cada
   secção subiu um degrau (`--sp-16` → `--sp-24`) e o de baixo ficou igual.
   - Em ecrãs largos, de uma secção à seguinte vão 160px em vez de 128px (+25%).
   - No telemóvel vão 112px em vez de 96px (+17%).
   - Não há na escala um valor que dê exatamente 20%.
2. **Espaço à volta da foto:** o espaço até ao nome subiu de `--sp-4` para `--sp-8`, e
   para `--sp-6` no telemóvel. A imagem é pedida a 400px, o dobro dos 200px, para não
   ficar desfocada em ecrãs de alta densidade.
3. **Linha do Licas:**
   - o "Ainda não publicado" fica por baixo do "Ver mais →", na coluna da ação;
   - para as linhas terem as mesmas caixas, a coluna da ação passou a 13rem fixos em
     todas as linhas, e a do número a `--sp-8` no telemóvel;
   - o rótulo não quebra de linha.
4. **"Design → Código":** o espaço antes da sub-secção subiu de `--sp-12` para `--sp-24`.
   O degrau intermédio (`--sp-16`) daria 88px, menos do dobro dos 49px entre linhas.
5. **A seta passou para 64px do fundo em ecrãs largos**, e não só no telemóvel, como
   pediste ("um bocado acima").
6. **O botão principal usa `#7C3AED`,** um tom que o site já tinha (o `--accent-text`
   do tema claro), em vez de inventar outro roxo. Fica escrito diretamente no CSS,
   porque a variável muda de tom com o tema.
7. **O `--footer-bg` ficou definido sem uso,** para não mexer nos 17 custom properties.

## Por fazer ou por decidir

- **O `CLAUDE.md` e o `ESTADO-ATUAL.md` ficaram outra vez desatualizados.** Ainda
  descrevem:
  - os fundos alternados e os cabeçalhos numerados;
  - a introdução dos contactos;
  - a exceção de contraste do botão;
  - o destaque do Licas;
  - a seta com `--border-color` a 24px do fundo.

  Não os alterei, porque esta tarefa não o pedia.
- **As etiquetas novas repetem o contexto dos case studies** (ver acima).
- **Não houve verificação visual por imagem:** o painel do browser corre escondido, e
  tudo foi medido por script.
- **O site publicado continua na Fase 4 intermédia.** O fim da Fase 4 e as fases 4.2a,
  4.2b e 4.2c estão por commitar.

