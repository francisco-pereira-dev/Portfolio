# Fase 9 — resumo

**O que passou a existir.** O teu CV é agora uma página do site: franciscopereira.dev/cv
em português e franciscopereira.dev/en/cv em inglês. Tem o mesmo menu, rodapé e troca de
língua das outras páginas, e segue o tema claro ou escuro. O texto é exatamente o que
aprovaste, e o site confirma-o sozinho sempre que é construído.

**Como se descarrega.** O botão do início passou a dizer **"Ver CV"** e leva à página do
CV, na mesma língua. É lá que está o botão **"Descarregar PDF"**, que dá o PDF da língua
certa: o português continua no endereço de sempre, para os links antigos não se
partirem, e o inglês é novo. Os dois PDF saem sempre em fundo branco, numa folha A4,
mesmo que estejas a ver o site no tema escuro. Deixaram de ser feitos à mão: um comando,
`npm run cv`, gera-os a partir da página.

**Se um dia o CV deixar de caber numa página.** O comando recusa-se a gerar o PDF e diz
quantos milímetros faltam, e os PDF que lá estão ficam como estavam. Hoje sobram 36 mm
em português e 41 mm em inglês. Faz o mesmo se o texto do PDF não for o que aprovaste,
ou se o PDF sair como uma imagem em vez de texto. Aí decides tu o que sai do CV.

**Mais duas coisas.** O mapa de ficheiros do projeto passou a atualizar-se com um
comando, e deixou de ficar para trás sempre que se escreve um relatório. E encontrei dois
pormenores no texto aprovado que ficaram como estavam, porque a decisão é tua: o CV diz
que cada projeto tem as decisões documentadas no site, mas o Portfolio, o Mr. Pizza e o
Diane Arbus não têm página própria.

Nada foi publicado nem apagado.
