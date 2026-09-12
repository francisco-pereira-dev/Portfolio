/**
 * O que muda de página para página na camada de SEO.
 *
 * A página inicial não passa nada disto e fica com os valores de sempre. As
 * páginas de case study passam o seu título, descrição, caminhos e imagem.
 */
export interface PaginaSeo {
  titulo: string;
  descricao: string;
  /** Caminho desta página e o da mesma página na outra língua. */
  caminho: string;
  caminhoOutra: string;
  tipo: 'website' | 'article';
  /** Imagem da pré-visualização social. Sem ela, usa-se a og-image geral. */
  imagem?: { src: string; width?: number; height?: number; alt: string };
}
