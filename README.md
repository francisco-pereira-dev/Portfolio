# franciscopereira.dev

Código do meu portefólio pessoal. É um site estático em duas línguas: todo o HTML é
gerado no build e publicado no GitHub Pages.

**Em produção:** https://franciscopereira.dev

## Stack

- **Astro 7**, com saída estática, TypeScript e CSS simples, sem framework de UI.
- **@astrojs/sitemap.** São as duas únicas dependências de runtime.
- Poppins auto-alojada em WOFF2, sem Google Fonts nem CDNs.
- Publicação por GitHub Actions: cada push para a `main` faz o build e publica.

## Conteúdo

- **Duas línguas em rotas reais:**
  - português na raiz (`/`, `/projetos/<slug>/` e `/cv/`);
  - inglês em `/en/` (`/en/`, `/en/projects/<slug>/` e `/en/cv/`).
- **9 projetos**, numa só lista na página inicial.
- **7 case studies** por língua, cada um com página própria. Os 2 projetos sem case
  study abrem numa modal.
- **O CV como página**, em `/cv/` e `/en/cv/`, com o PDF de cada língua gerado a partir
  dela.
- **18 páginas** no total, todas no sitemap.

## Como está organizado

- `content/texto-canonico.json` é a fonte de verdade de todo o texto visível. O texto
  passa daqui para os dados, e o `check:texto` confirma que o HTML gerado coincide
  com ele.
- `src/content/projects/*.json` guarda os projetos, validados por um schema Zod em
  `src/content.config.ts`. Um projeto inválido parte o build em vez de chegar à página.
- `src/i18n/pt.json` e `en.json` guardam os textos de interface.
- `src/data/skills.json` guarda as competências e as provas de cada tecnologia.
- `astro.config.mjs` tem três integrações próprias, que guardam o build:
  - uma lista de uma vez todas as imagens de projeto em falta;
  - outra retira do `dist/` os ficheiros que nada referencia;
  - a terceira faz o build falhar se uma fonte que não seja WOFF2 chegar ao `dist/`.

## Como correr

É preciso o Node 22.12 ou mais recente (o build usa o 24).

```bash
npm install
npm run dev       # servidor de desenvolvimento em http://localhost:4321
npm run build     # build estático para dist/
npm run preview   # serve o dist/ localmente
```

## Verificações

Antes de dar um trabalho por terminado, correm estas três, por esta ordem:

```bash
npm run build         # falha com schema inválido, imagem em falta ou fonte não-WOFF2
npm run check:i18n    # paridade de chaves entre pt.json e en.json, sem valores vazios
npm run check:texto   # compara o texto canónico com o HTML gerado, nas duas línguas
```

Depois do build, as duas auditorias correm sobre o `dist/`:

```bash
npm run audit:a11y      # axe, estrutura, contraste e o site sem JavaScript
npm run audit:teclado   # percursos com Tab, foco, menu, modais e atalhos
```

Arrancam um servidor de pré-visualização sozinhas, se não houver nenhum a responder.
`npm run og` regenera as imagens de partilha (1200×630) quando muda o título de um
projeto ou o seu screenshot.

Outros dois geradores, que correm à mão:

```bash
npm run cv     # os dois PDF do CV, a partir das páginas /cv/ e /en/cv/
npm run mapa   # o docs/ESTRUTURA.md, a partir do disco
```

O `npm run cv` falha, sem escrever nada, se um PDF tiver mais de uma página, se o
texto não for extraível ou se não bater com o texto canónico.

## Acessibilidade

O site foi auditado com axe e com navegação por teclado, nas 18 páginas, nas duas
línguas e nos dois temas. Tem link para saltar para o conteúdo, marcos de página e um
indicador de foco visível. Todo o texto tem contraste de 4,5:1 ou mais. As
ferramentas de auditoria (Playwright e axe) são só dependências de desenvolvimento e
não chegam ao `dist/`. O axe não cobre a versão sem JavaScript, porque precisa de
executar JavaScript dentro da página; aí medem-se a estrutura, o que está visível e o
contraste.

## Sem JavaScript

O conteúdo está todo no HTML e é visível sem JavaScript: a animação de entrada só
esconde o que vai aparecer quando há script. Sem ele, o tema segue o do sistema e os
links de navegação aparecem no cabeçalho — ou antes do rodapé, nos ecrãs onde não
cabem. Perdem-se o menu de ecrã inteiro, a troca manual de tema, a seta de voltar ao
topo e as duas janelas de projeto.

## Licenças

Os dois ícones vêm do Devicon (MIT) e a Poppins do Google Fonts (SIL OFL 1.1). A
atribuição e o texto das licenças estão em [docs/LICENCAS.md](docs/LICENCAS.md).

## Contacto

- Email: franciscojrp1004@gmail.com
- LinkedIn: [francisco-pereira-dev](https://www.linkedin.com/in/francisco-pereira-dev)
