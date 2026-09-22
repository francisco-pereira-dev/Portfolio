# Fase 10 — relatório técnico

Data: 2026-09-18. Três correções à Fase 9. **Sem commit, sem push e sem `git add`:** o
HEAD continua em `4f13bec`.

---

## 1. As quatro substituições

| Onde | Antes | Agora |
|---|---|---|
| Resumo PT, última frase | "Cada projeto abaixo está documentado em franciscopereira.dev, com as decisões técnicas e o que correu mal." | "O meu trabalho está documentado em franciscopereira.dev, com as decisões técnicas e o que correu mal." |
| Resumo EN, última frase | "Every project below is documented at franciscopereira.dev, with the technical decisions and what went wrong." | "My work is documented at franciscopereira.dev, with the technical decisions and what went wrong." |
| Linha final dos projetos, PT | "Mais seis projetos, com o contexto e as decisões de cada um, em franciscopereira.dev" | "Mais seis projetos em franciscopereira.dev" |
| Linha final dos projetos, EN | "Six more projects, each with its context and decisions, at franciscopereira.dev" | "Six more projects at franciscopereira.dev" |

**Como entraram.** Um script temporário fez o seguinte:

1. Confirmou que as oito frases, as quatro antigas e as quatro novas, são fatias
   literais do enunciado.
2. Confirmou que o resumo atual acabava mesmo na frase antiga e que a linha era a
   antiga. Só depois trocou.
3. Registou a fonte em `_sobre.fontes["fase-10"]`.
4. Pôs o texto antigo em **`retirado["fase-10"]`**, em dois pares, cada um com o motivo
   ("afirmação falsa — o Portfolio não tem linha nem case study no site, e o Mr. Pizza e
   o Diane Arbus só têm modal"):
   - `cv.resumo (última frase)`;
   - `cv.projetosMais`.
5. Regenerou o `src/data/cv.json`.

**Prova de que os dados batem:**

- `src/data/cv.json` = a secção `cv` do canónico, sem as notas;
- fora do resumo e da linha dos projetos, o `cv.json` é o de antes;
- nos resumos só mudou a última frase: os primeiros 179 caracteres (PT) e 206 (EN) são
  iguais;
- repondo o texto antigo e tirando as adições, o canónico é igual ao de antes da fase,
  com a mesma ordem de chaves;
- `check:texto`: **1016 verificações antes e 1016 depois**, zero divergências. O número
  não muda, porque as mesmas strings são verificadas, agora com o texto novo;
- os dois PDF continuam numa página, com a mesma folga: **36,3 mm em PT e 41,0 mm em
  EN**.

---

## 2. A exceção à regra de não repetição

Escrevi no `CLAUDE.md`, logo a seguir à regra:

- **o CV (`/cv` e `/en/cv`) está fora da regra de não repetição** (decisão do
  Francisco, fase 10);
- **porquê:** um CV lê-se sozinho, fora do contexto do site. Quem o abre não leu as
  linhas dos projetos nem os case studies, e obrigá-lo a não repetir o site tornava-o
  pior;
- **as repetições entre o CV e o resto do site são esperadas e não se corrigem.** Na
  fase 9 contaram-se 23, e ficaram por decisão, não por esquecimento;
- **a regra continua a valer, inteira, dentro do CV:** um facto não aparece duas vezes
  na mesma página do CV.

No `docs/ESTADO-ATUAL.md` ficou registado que eram 23 na fase 9, e que ficaram por
decisão. Também ficou lá a lista resumida. Voltei a contar com o texto novo e continuam
23: as quatro frases mudadas não estavam entre elas. Seis desses pares são com o campo
`description`, que nenhuma página mostra.

**Dentro do CV há zero repetições** (5 ou mais palavras seguidas em dois textos do CV).
O endereço franciscopereira.dev aparece quatro vezes: nos links, no resumo, na descrição
do Portfolio e em "Mais seis projetos". São quatro factos diferentes, e não os contei
como repetição.

---

## 3. PDF reproduzíveis

**O diagnóstico, medido.** Gerei os PDF duas vezes e comparei byte a byte. Só mudam 36
bytes, os mesmos nas duas línguas: o `/CreationDate` e o `/ModDate` do dicionário
`/Info`. Não há `/ID` no trailer nem metadados XMP.

**A correção**, no `scripts/gerar-cv.mjs`, sem bibliotecas:

- a função `semDatas` lê o trailer com o leitor que já existia (`lerValor`) e encontra
  o objeto `/Info`;
- troca as duas entradas por espaços com o mesmo número de bytes. Um dicionário PDF
  aceita espaço em branco, e assim nenhuma posição da tabela `xref` muda;
- apaga as datas em vez de as fixar, para não gravar uma data inventada;
- se aparecer XMP não comprimido, apaga as datas lá também. Se for comprimido, o comando
  falha em vez de deixar a data;
- as guardas correm sobre o PDF já limpo, e o que se verifica é o que se escreve;
- o comando passou a escrever o SHA-256 de cada PDF.

**As corridas.** Fiz a 1.ª e a 2.ª com o texto da fase 9, antes da Tarefa 1. A 3.ª já
tinha as quatro frases novas: a alteração de texto veio da própria Tarefa 1, sem mexer
em texto aprovado só para o teste. A 4.ª e a 5.ª repetem a prova com o texto final.

| Corrida | Texto | `CV.pdf` (SHA-256) | `CV-en.pdf` (SHA-256) |
|---|---|---|---|
| 1 | fase 9 | `109ce4f9470124f73dbd7da4f9f7c91f305b23eb560eb83f755d15202839874d` | `7c403f22f67cd88b705dac3fb09bf6d1f53287ced48dca71a1dd3484b7412080` |
| 2 | fase 9, sem mudar nada | `109ce4f9470124f73dbd7da4f9f7c91f305b23eb560eb83f755d15202839874d` | `7c403f22f67cd88b705dac3fb09bf6d1f53287ced48dca71a1dd3484b7412080` |
| 3 | **as quatro frases novas** | `b185baef90a59c75ff81e2e28dd44ddd61d8b68f1049b7f8a71e9973bb853472` | `0dbe0ee05e7cbfe958e8a4d60212df825b9c57d7a163beab0563a2fc7571ec93` |
| 4 | final, sem mudar nada | `b185baef…853472` (igual à 3) | `0dbe0ee0…71ec93` (igual à 3) |
| 5 | final, sem mudar nada | `b185baef…853472` (igual à 3) | `0dbe0ee0…71ec93` (igual à 3) |

**Resultado:**

- sem mudanças, as somas são iguais (1 = 2, e 3 = 4 = 5);
- com uma mudança de texto, as somas mudam (2 ≠ 3);
- desapareceu só o ruído da data; a deteção de mudanças continua a funcionar;
- o `dist/` recebeu os mesmos bytes no build seguinte.

---

## 4. Verificação final

| Verificação | Resultado |
|---|---|
| `npm run build` | ✅ exit 0, zero avisos, 18 páginas |
| `npm run check:i18n` | ✅ 63 chaves de cada lado |
| `npm run check:texto` | ✅ 1016 antes, 1016 depois, zero divergências |
| `npm run cv` | ✅ dois PDF de 1 página, 52 strings do canónico em cada; sobram 36,3 mm (PT) e 41,0 mm (EN) |
| Duas corridas seguidas | ✅ o mesmo SHA-256 (tabela acima) |
| `audit:a11y` e `audit:teclado` | ✅ zero falhas, 18 páginas × 2 temas |
| `npm run mapa -- --verificar` | ✅ sem discrepâncias |
| As quatro frases antigas em `retirado` | ✅ `retirado["fase-10"]`, com o motivo |
| Texto do site alterado | ✅ só as quatro frases |
| `git log -1` | ✅ `4f13bec`, nada commitado nem enviado |
| `git status` | ✅ nenhuma linha de *deleted* |
| `node_modules/.cache/` | ✅ vazia |

## Decisões que tomei sozinho

1. **Fiz a Tarefa 3 antes da 1**, para a alteração de texto da prova ser a própria
   Tarefa 1, e não uma alteração temporária a texto aprovado.
2. **Apaguei as datas em vez de as fixar**, trocando-as por espaços com o mesmo tamanho.
3. **Guardei o texto antigo em dois pares** (a frase do resumo e a linha dos projetos),
   com as duas línguas em cada um.
4. **Acrescentei aos documentos** o que a fase 10 mudou:
   - no `CLAUDE.md` e no `ESTADO-ATUAL.md`: os PDF reproduzíveis, a fase 10 na lista e
     o "por commitar";
   - no `docs/ESTRUTURA.md`: a descrição do `gerar-cv.mjs`.

