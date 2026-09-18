# Licenças de material de terceiros

Quase tudo neste repositório é escrito de raiz. O que não é está aqui, com a origem e a
licença.

## Ícones do LinkedIn e do GitHub

| Ficheiro | Origem |
|---|---|
| `src/icons/linkedin-plain.svg` | Devicon, ícone `linkedin` (variante *plain*) |
| `src/icons/github-original.svg` | Devicon, ícone `github` (variante *original*) |

São os dois únicos ícones do projeto, e são desenhados pelo `src/components/Icon.astro`,
embutidos no HTML em vez de servidos como ficheiros. A única alteração feita aos SVG
originais foi **substituir as cores de marca por `currentColor`**, para o ícone herdar a
cor do texto à volta, como a fonte Devicon fazia antes de ela ser retirada do projeto.

- **Projeto:** Devicon — <https://devicon.dev>
- **Código:** <https://github.com/devicons/devicon>
- **Licença:** MIT

## Texto da licença

Copiado tal e qual de <https://github.com/devicons/devicon/blob/master/LICENSE>
(ficheiro `LICENSE` do ramo `master`), obtido a 2026-09-18:

```
The MIT License (MIT)

Copyright (c) 2015 konpa

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

A licença MIT exige que este aviso acompanhe o material. É o que este ficheiro faz: o
`ICONES.md`, que cumpria este papel, foi apagado a 2026-09-14 (commit `21d0811`), e
entre essa data e 2026-09-18 a atribuição não existiu em lado nenhum do repositório.

## Fonte Poppins

- `public/fonts/poppins-*.woff2`, servidas pelo site, e `scripts/fontes/Poppins-*.ttf`,
  usadas só pelo `npm run og` para desenhar o texto das imagens de partilha.
- **Origem:** Google Fonts. **Licença:** SIL Open Font License 1.1, que permite usar,
  incorporar e redistribuir a fonte, incluindo em sítios comerciais.
