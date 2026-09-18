# Fase 6 — relatório técnico

Data: 2026-09-18. Verificação da publicação, verificações no CI, `sharp` declarado,
varredura de confidencialidade e arrumação da documentação. **Sem commit e sem push:** o
HEAD continua em `4f13bec`.

---

## 1. O que está publicado

O commit `4f13bec` foi feito e publicado à mão, sem as verificações terem corrido antes.
Correram agora, contra o site.

### Domínio, HTTPS e páginas

- `https://franciscopereira.dev` responde **200**, servido pelo GitHub, com
  `Strict-Transport-Security` e `Last-Modified: 2026-09-17 21:15:26 GMT` — o deploy do
  commit.
- **Certificado:** `CN=franciscopereira.dev`, emitido por Let's Encrypt, válido de
  2026-07-29 a **2026-10-27**. Verificação TLS a devolver 0 (válido). O `CNAME`
  sobreviveu ao deploy.
- **As 16 páginas devolvem 200**, sem exceção:

| Página | Código | | Página | Código |
|---|---|---|---|---|
| `/` | 200 | | `/en/` | 200 |
| `/projetos/licas/` | 200 | | `/en/projects/licas/` | 200 |
| `/projetos/dae/` | 200 | | `/en/projects/dae/` | 200 |
| `/projetos/ainet/` | 200 | | `/en/projects/ainet/` | 200 |
| `/projetos/3d-analyzer/` | 200 | | `/en/projects/3d-analyzer/` | 200 |
| `/projetos/cadflow-bank-system/` | 200 | | `/en/projects/cadflow-bank-system/` | 200 |
| `/projetos/hotel-inteligente/` | 200 | | `/en/projects/hotel-inteligente/` | 200 |
| `/projetos/gest/` | 200 | | `/en/projects/gest/` | 200 |

### O HTML ao vivo é o do commit

Extraí o commit para `node_modules/.cache/verif-4f13bec` (`git archive`, sem tocar no
histórico), corri lá `npm ci` e `npm run build` — build com exit 0, zero avisos, 16
páginas — e comparei cada página com a que está no ar.

**As 16 são byte a byte iguais.** Comparei o conteúdo inteiro, não só o tamanho: mesmo
SHA-256 e mesmo número de bytes em todas. O `sitemap-0.xml` publicado também é igual ao
local, com 16 `<loc>`.

### `check:texto` contra o HTML ao vivo

O script lê `<raiz>/dist`, e a raiz é a pasta acima dele — não aceita uma origem remota,
e **não o alterei**. Em vez disso, descarreguei as 16 páginas publicadas para o `dist/`
do checkout de verificação e corri lá o script, tal como está:

- **`npm run check:texto`: 914 verificações, zero divergências**, contra o HTML que está
  no ar;
- `npm run check:i18n`: OK.

### Ícones apagados e 404

Percorri as 16 páginas publicadas e recolhi todos os `href` e `src` internos: **5
recursos distintos**, todos a 200 — `/assets/icons/favicon.ico`,
`/fonts/poppins-400-latin.woff2`, `/_astro/Footer.sp45kQGd.css`,
`/_astro/avatar.CsZFE6D4_Z1hufz1.webp` e `/assets/docs/CV.pdf`.

**Nenhuma página menciona nenhum dos 13 ícones apagados, e nenhuma pede um SVG externo**
— os dois ícones que restam entram no HTML já embutidos.

### Ficheiros servidos

Todos a 200, e todos com o mesmo tamanho dos ficheiros locais: `CNAME` (20 B),
`robots.txt` (80 B), `sitemap-index.xml`, `sitemap-0.xml`, `CV.pdf` (389 345 B),
`favicon.ico` (15 406 B), `og-image.png` (46 770 B), as **8 imagens de `og/`** e as
**8 fontes WOFF2**.

**Nada está errado em produção.**

---

## 2. Verificações no CI, a bloquear o deploy

`.github/workflows/deploy.yml` passa a ter três jobs em cadeia:

```
verificar  →  build  →  deploy
(npm ci,      (withastro    (actions/
 build,        /action@v3)   deploy-pages@v4)
 check:i18n,
 check:texto)
```

### Porque é que uma falha impede a publicação

É a cadeia de `needs:`, e o ponto está em quem **não chega a arrancar**:

1. O job `verificar` corre primeiro. Faz o seu próprio `checkout`, `setup-node@v4` com
   Node 24, `npm ci`, `npm run build`, `npm run check:i18n` e `npm run check:texto`.
2. Um passo `run:` que devolva um código diferente de zero falha o passo, e um passo
   falhado falha o job. **O `check:texto` sai com 1 quando encontra uma divergência** —
   provei-o, ver abaixo.
3. O job `build` declara `needs: verificar`. Um job cujo `needs` falhou **é marcado como
   skipped: não corre**. Como é ele que constrói o site e faz o upload do artefacto, não
   existe artefacto nenhum.
4. O job `deploy` declara `needs: build`. Pelo mesmo motivo, também não corre. E é o
   `actions/deploy-pages@v4`, dentro dele, o único passo que publica.

Ou seja: a publicação não é revertida depois do facto — **nunca chega a acontecer**. A
diferença em relação a correr as verificações dentro do job que publica é essa: aqui o
site não chega a ser substituído.

O `verificar` é auto-suficiente de propósito: não depende do que a `withastro/action`
faz a seguir, e por isso uma alteração nessa action não desliga as verificações sem que
alguém dê por isso.

### O que validei, já que não posso fazer push

- **Sintaxe YAML:** o ficheiro foi lido com o analisador `js-yaml` que já está em
  `node_modules`. Resultado: YAML válido, jobs `verificar → build → deploy`, com
  `needs: "verificar"` no `build` e `needs: "build"` no `deploy`, e `node-version: 24`
  nos dois sítios onde há Node.
- **A sequência exata do job novo, localmente**, num checkout limpo do commit:

  | Passo | Resultado |
  |---|---|
  | `npm ci` | exit 0 |
  | `npm run build` | exit 0 |
  | `npm run check:i18n` | OK |
  | `npm run check:texto` | 914 verificações, zero divergências |

- **Que uma falha devolve mesmo código de erro**, sabotando um checkout descartável (e
  nunca o repositório):
  - apaguei uma chave do `en.json` → `npm run check:i18n` saiu com **1**;
  - troquei uma frase inteira no HTML → `npm run check:texto` saiu com **1**, com a
    divergência listada.

### Um pormenor que encontrei ao fazer esse teste

Na primeira tentativa acrescentei uma letra ao fim de "Developer full-stack" e o
`check:texto` **passou**. A razão é que essa frase curta continua a existir noutro sítio
da mesma página (na meta descrição, "Developer full-stack e finalista de…"), e para os
textos de interface a verificação é de presença. Para o texto dos projetos e dos case
studies a verificação é posicional, e aí a sabotagem foi apanhada de imediato. Não é um
defeito do desenho, mas convém saber: **frases curtas de interface que sejam pedaço de
uma frase maior aprovada não são apanhadas**.

### Auditorias de acessibilidade

Ficaram **fora do CI**, como mandaste, com o motivo escrito no próprio workflow: os
707 MB do Chromium tornariam cada publicação lenta e sujeita a falhas intermitentes.
Continuam a correr à mão, com `npm run audit:a11y` e `npm run audit:teclado`. Não criei
nenhum workflow para elas. **Se um dia quiseres**, a proposta seria um workflow separado
com `workflow_dispatch` e agendamento semanal, com cache do Chromium — mas fica por tua
ordem.

---

## 3. O `sharp` declarado

- `npm ls sharp` → `astro@7.2.10 → sharp@0.35.4`. É a versão instalada.
- Entrou no `package.json` como **`"sharp": "0.35.4"` em `devDependencies`**, na versão
  exata, porque só serve o `npm run og`.
- **O `package-lock.json` mudou em 13 linhas, e nenhuma altera versões:** a declaração
  nova, e o `sharp` (e um pacote dele) a passar de `"optional": true` para
  `"devOptional": true`. Comparei o mapa completo pacote→versão antes e depois: **igual,
  sem uma única diferença**.
- **`npm run og` corre** (exit 0, 9 imagens a 1200×630) e **as 9 saem byte a byte iguais
  às que já lá estavam** — verificado por soma MD5.
- **O `dist` não ganhou nada:** 41 ficheiros, 1 460 212 B antes e depois, e nenhum
  ficheiro do `dist` menciona o `sharp`.

---

## 4. Varredura de confidencialidade

Corri-a com Node (nunca com `git grep`, por causa dos acentos) sobre **19 ficheiros**:
os 16 relatórios, o `CLAUDE.md`, o `ESTADO-ATUAL.md` e o `LIMPEZA-PROPOSTA.md`.

**O que procurei, com expressões regulares:**

| Categoria | Padrão |
|---|---|
| Supabase: projeto | `*.supabase.co`, `project_ref`, URLs de projeto |
| Supabase: chaves | `eyJ…` (JWT), `service_role`, `anon_key`, `SUPABASE_*`, `sbp_`/`sbu_` |
| Segredos genéricos | `api_key`, `secret`, `password`, `token` seguidos de valor |
| Tabelas, funções, RPC | `create/alter/drop table|function|policy|trigger`, `.rpc(`, `from public.` |
| Números de migração | `20…` com 14 dígitos, "migração n.º…" |
| Emails | qualquer email; tudo o que não seja `franciscojrp1004@gmail.com` |
| Telefones, NIF, IBAN, cartão | formatos portugueses |
| Moradas | "Rua/Avenida/Travessa/Largo/Praceta/Urbanização" seguidos de nome próprio |
| Incidente de produção | "incidente", "em produção" perto de "falhou/perdeu/apagou/corrompeu" |
| Dados de clientes | "dados reais", "dados de clientes", "encomendas reais", "clientes reais" |
| Empresa do Cadflow | "Cadflow" perto de "empresa/proposto/desafio", e o inverso |

**Segunda rede, mais dura:** listei **todas as palavras capitalizadas** dos 19 ficheiros
que não pertencem ao vocabulário conhecido do projeto (tecnologias, nomes dos projetos,
meses, termos do site). Deu 65 palavras, e revi-as uma a uma: são todas palavras comuns
em início de frase ou termos do projeto — "Estágio", "Aptidão", "Profissional",
"Polytechnic", "Google" (de Google Fonts), "Desktop", "Equipa". **Nenhum nome de
negócio, nenhuma localidade, nenhum nome de pessoa além de Francisco Pereira.**

**Resultado: limpo.** Cinco ocorrências assinaladas, todas falsos positivos, e explico
cada uma:

| Onde | O que a regra apanhou | Porque não é fuga |
|---|---|---|
| `FASE-4.2b-tecnico.md:39` | "Cadflow · resultado \| Entregue, com resposta positiva da empresa" | É o texto aprovado do case study, que diz "a empresa" **sem a nomear** |
| `FASE-5.2-resumo.md:3`, `FASE-5.2-tecnico.md:27`, `CLAUDE.md:231` | "largo d…", "largo q…", "largo e…" | É a palavra *largo* no sentido de largura, apanhada pelo padrão de moradas ("Largo …") |
| `CLAUDE.md:340` | "dados de clientes" | É a própria regra de confidencialidade, que lista o que nunca pode aparecer |

Também verifiquei o contexto de todas as linhas que falam do cliente do Licas: são 8, e
todas dizem apenas **"Cliente real"**, que é a etiqueta aprovada do site. Os 4 emails
nos documentos são todos o `franciscojrp1004@gmail.com`.

**A porta abriu:** a Tarefa 5 podia acontecer.

---

## 5. Documentação arrumada

- Criei `historico/` e **movi** (não copiei) os 16 relatórios. Zero ficheiros `FASE-*.md`
  na raiz.
- **Prova de que nenhum se perdeu nem mudou:** 16 antes, 16 depois, com os mesmos nomes,
  os mesmos tamanhos (soma: 124 979 B) e as **mesmas somas MD5** — verifiquei com
  `md5sum -c`, e as 16 deram OK.
- Na raiz ficaram, como pediste, o `LIMPEZA-PROPOSTA.md`, o `CLAUDE.md`, o
  `ESTADO-ATUAL.md` e o `README.md`.
- **Referências corrigidas:** as do `ESTADO-ATUAL.md` (a da tabela e a que aponta por
  nome para o `FASE-4.2a-tecnico.md`), a do `CLAUDE.md`, e as do `LIMPEZA-PROPOSTA.md`
  (as duas do texto e os 16 nomes da tabela). Não sobrou nenhuma referência a apontar
  para a raiz.
- `git add` feito para `historico/`, `CLAUDE.md`, `ESTADO-ATUAL.md` e
  `LIMPEZA-PROPOSTA.md`: **19 ficheiros em stage, sem commit**.

---

## 6. `CLAUDE.md` e `ESTADO-ATUAL.md` atualizados

- **O HEAD é `4f13bec`**, de 2026-09-17 às 22:14:52 (UTC+1), autor Francisco Pereira, 54
  ficheiros, +2568 −825, com a `main` alinhada com a `origin/main`. Está registado como
  **decisão do Francisco, tomada de propósito fora das sessões** — não como anomalia.
- A secção 4 do `ESTADO-ATUAL.md` deixou de se chamar "Por commitar" e passou a **"O que
  foi publicado no commit `4f13bec`"**, com uma secção **4.1** com a verificação contra o
  site e uma **4.2** com o que está mesmo por commitar agora.
- A secção 5 ganhou a entrada do commit, com data e hora reais, e a consequência: **o
  site deixou de estar na Fase 4 intermédia**. Corrigi também a linha do `9810f88`, que
  dizia "é o que está publicado", e a de "Consequências", nos dois ficheiros.
- **As quatro decisões** ficaram registadas: os relatórios em `historico/`; as duas
  imagens dormentes ficam (a poda já as tira do `dist`, não pesam para quem visita, e
  removê-las obrigava a mexer no `imageAlt`, que é texto canónico); o `CLAUDE.md` e o
  `ESTADO-ATUAL.md` passam a versionados; e as verificações passam a correr no CI, com as
  auditorias manuais.
- O `sharp` está na lista de dependências do `CLAUDE.md`, com a nota de que só serve o
  `gerar-og` e nunca chega ao `dist`.
- A estrutura de pastas do `CLAUDE.md` tem o `historico/` e o `LIMPEZA-PROPOSTA.md`.
- **"Por fazer"** ficou com quatro pontos: o CV como rota `/cv`, o `CV.pdf` com o nome
  antigo da instituição, os testes com leitores de ecrã reais, e os commits duplicados.

---

## 7. As 15 imagens apagadas da árvore de trabalho

**Parei e perguntei-te antes de tocar em qualquer coisa.** Autorizaste a reposição.

- **O quê:** `assets/images/{ainet.jpg, dae.jpg, dianearbus.webp, logo-gest.jpg,
  mrpizza.webp, ti.webp}` e `public/og-image.png` com as 8 imagens de `public/og/` — 15
  ficheiros versionados, desaparecidos da árvore de trabalho a meio da sessão.
- **O que não se perdeu:** estão no commit `4f13bec`, no `dist/` local, nas duas pastas
  de verificação, e continuam servidos no site (todos a 200). **Produção nunca foi
  afetada:** o que está no ar foi construído a partir do commit.
- **Reposição:** `git checkout -- assets/images public/og public/og-image.png`. Repõe do
  commit, não mexe no histórico e não faz commit. Depois: zero ficheiros apagados no
  `git status`, e `git diff HEAD` vazio nesses caminhos.
- **Causa: foi o próprio Francisco que as apagou**, como ele confirmou depois. **Nem o
  build nem as integrações do `astro.config.mjs` tiveram parte nisso** — a suspeita que
  eu tinha levantado, por as datas caírem perto de dois builds que corri em checkouts de
  verificação, estava errada, e fica corrigida aqui.
- **Não há nada a endurecer no build por causa disto:** o `npm run build`, as duas
  auditorias e o `npm run og` correram várias vezes depois, sempre com os 15 ficheiros
  intactos (verificado por MD5 a seguir a cada corrida).

---

## 8. Verificação final

| # | Verificação | Resultado |
|---:|---|---|
| 1 | `npm run build` | ✅ exit 0, zero avisos, 16 páginas |
| 2 | `npm run check:i18n` | ✅ OK, 55 chaves de cada lado |
| 3 | `npm run check:texto` | ✅ 914 verificações, zero divergências |
| 4 | `npm run audit:a11y` | ✅ zero falhas (0 violações axe, contraste mínimo 5,70 escuro / 5,02 claro; sem JavaScript, 926 textos visíveis por combinação) |
| 5 | `npm run audit:teclado` | ✅ zero falhas |
| 6 | `npm run og` | ✅ exit 0, 9 imagens a 1200×630, todas byte a byte iguais; `dist` com os mesmos 41 ficheiros e 1 460 212 B |
| 7 | Site ao vivo | ✅ 16 páginas a 200, HTML byte a byte igual ao build de `4f13bec` |
| 8 | Zero texto do site alterado | ✅ `git diff HEAD -- content/ src/i18n/ src/content/projects/ src/data/` **vazio**, 0 ficheiros |
| 9 | Nada commitado nem enviado | ✅ `git log -1` continua em `4f13bec` |
| 10 | `git status` | ✅ só o esperado: `deploy.yml`, `package.json` e `package-lock.json` modificados; 16 relatórios em `historico/`, e os três documentos, em stage |

---

## Decisões que tomei sozinho

1. **O `check:texto` contra o site ao vivo correu num checkout descartável**, com o HTML
   publicado copiado para o `dist` desse checkout. Foi a forma de correr o script tal
   como está, sem lhe tocar, contra o que está no ar.
2. **As referências entre relatórios dentro de `historico/` ficaram como estavam.** Um
   relatório que cita outro agora tem-no ao lado, na mesma pasta; pôr-lhe `historico/` à
   frente é que passaria a apontar para `historico/historico/`. Só corrigi as referências
   feitas de fora da pasta.
3. **No `Icon.astro` e no comentário do rodapé não mexi** — não era desta tarefa.
4. **A sabotagem para provar que o CI bloqueia foi feita num checkout descartável**, e
   nunca no repositório.
5. **Não criei nenhum workflow para as auditorias**, como mandaste: fica só a proposta.
