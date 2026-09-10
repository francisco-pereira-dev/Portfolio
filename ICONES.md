# Ícones

Os SVGs em `src/icons/` vêm do projeto **Devicon**, distribuído sob licença MIT.

- Projeto: https://github.com/devicons/devicon
- Licença: MIT

Os ficheiros foram alterados numa coisa só: as cores de marca fixas (`fill="#E44D26"`,
`fill="#181616"`, etc.) foram substituídas por `fill="currentColor"`, para os ícones
herdarem a cor do contexto. É o mesmo comportamento que a fonte Devicon tinha, já que
um glifo de fonte é sempre monocromático e pintado pela propriedade `color`.

O `mysql-plain.svg` veio do pacote npm `devicon@2`: o Devicon reorganizou os ícones do
MySQL no ramo principal e esse nome já lá não existe. É o ficheiro com o nome exato que
o site usava, não um substituto parecido.

## Texto da licença

```
MIT License

Copyright (c) 2015 konpa

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Fontes

A **Poppins** em `public/fonts/` é do Indian Type Foundry e da Jonny Pinhorn,
distribuída sob a SIL Open Font License 1.1 (https://openfontlicense.org).
Os ficheiros são os subsets `latin` e `latin-ext` servidos pelo Google Fonts,
guardados localmente para eliminar o pedido a terceiros.
