# Fase 7 — resumo

**O que mudou de sítio.** A documentação foi toda para uma pasta `docs/`: o estado do projeto, o inventário de limpeza, as licenças, o mapa novo da estrutura, e os 18 relatórios de fase em `docs/historico/`. Na raiz ficaram só o `README.md`, o `CLAUDE.md` e os ficheiros de configuração. Confirmei documento a documento, pela soma de verificação, que nenhum se perdeu nem mudou uma letra ao ser movido.

**Cinco correções.** O `CLAUDE.md` deixou de dizer que o objetivo do site é arranjar emprego — agora diz o que é verdade: mostrar trabalho real, com texto verificável. Corrigi também o registo das 15 imagens: estava escrito "causa não determinada", e a causa sabe-se — foste tu que as apagaste, e o build não teve nada a ver com isso. E o repositório passou a ter a atribuição dos ícones, que faltava desde setembro: está em `docs/LICENCAS.md`, com o texto da licença copiado do próprio Devicon.

**O que passou a ser apanhado.** Descobri que a falha que eu tinha reportado na fase anterior não existia: sabotei o texto que se vê na página e a verificação apanhou-o logo. O que me tinha escapado foi outra coisa — eu tinha sabotado a descrição escondida do `<head>`, e essa, sim, passava despercebida, porque o mesmo texto está repetido em três etiquetas e bastava uma ficar intacta. Está fechado: a verificação passou de 914 para 926 e agora cada etiqueta responde por si. Provei com três sabotagens, todas apanhadas.

**O que foi apagado.** Seis linhas, e só seis: uma opção do componente dos ícones que nenhum dos quatro usos passava, e uma constante que ninguém importava. Procurei em cinco frentes — CSS, JavaScript, componentes, schema e dependências — e não havia mais nada morto: os 201 seletores de CSS casam todos com alguma página, as 8 funções do JavaScript são todas usadas, e as 10 tarefas e 5 dependências também. Provei que nada mudou: as 16 páginas têm exatamente o mesmo conteúdo, ao byte, e as 44 fotografias do site são idênticas.

**O que não podia ser apagado.** Há texto aprovado que nenhuma página mostra — a descrição longa dos 9 projetos e as características dos 7 que têm case study. Está listado à tua espera. Texto sai por decisão tua, nunca por limpeza minha.

**Quantos ficheiros tem o projeto.** 114, fora as pastas que se regeneram sozinhas. Destes, **61 chegam a quem visita o site** e os outros são ferramentas de construção e documentação. O mapa novo, `docs/ESTRUTURA.md`, diz de cada um o que é, quem lhe pega pelo nome, e o que parte se desaparecer — e não há um único ficheiro cuja remoção não parta nada.

**Não publiquei nada.** Está tudo preparado e por commitar, à tua espera.

