# Fase 6 — resumo

**O que está no ar está bem.** O site responde, o domínio e o certificado estão válidos até 27 de outubro, e as 16 páginas abrem. Comparei o que está publicado com o que o teu commit produz e é igual, letra a letra, nas 16 páginas. Corri a verificação de texto contra o site ao vivo: 914 verificações, zero diferenças. Nenhuma página pede um ficheiro que já não existe.

**O que passa a acontecer quando publicares.** Antes, o GitHub construía o site e publicava, sem verificar nada. Agora há um primeiro passo que instala, constrói e corre as duas verificações de texto. Se alguma falhar, o passo que publica **não chega a arrancar** — o site fica como está, em vez de ir ao ar com o erro. As auditorias de acessibilidade continuam a ser feitas à mão, porque exigem descarregar um browser de 707 MB e tornariam cada publicação lenta e instável.

**Arrumação.** Os 16 relatórios de fase foram para a pasta `historico/`, sem que nenhum se perdesse ou mudasse — confirmei um a um. O `CLAUDE.md` e o `ESTADO-ATUAL.md` passam a estar guardados no Git, em vez de existirem só no teu computador. Antes disso, varri os 19 documentos à procura de qualquer coisa confidencial do cliente do Licas, chaves, emails ou nomes de empresas: está limpo, e no relatório técnico digo exatamente o que procurei.

**As 15 imagens que faltavam.** A meio do trabalho, 15 imagens do projeto não estavam na pasta — as dos projetos e as de partilha. Parei e perguntei-te antes de mexer, e repus todas a partir do teu commit, iguais ao original. O site nunca foi afetado, porque o que está publicado vem do commit e não da pasta. **Foste tu que as tinhas apagado**, como confirmaste depois: o build e as verificações não tiveram nada a ver com isso.

**Também declarei o `sharp`**, um programa que o gerador de imagens de partilha usa e que não estava na lista de dependências: funcionava por sorte, porque vinha com o Astro.

**Não publiquei nada.** Está tudo preparado e por commitar: as verificações no CI, o `sharp`, a pasta `historico/` e a documentação. Falta, como sempre, a tua palavra.

**Por fazer:** o CV como página do site, o CV em PDF que ainda diz "Instituto Politécnico de Leiria", os testes com leitores de ecrã a sério, e os commits duplicados no histórico.

