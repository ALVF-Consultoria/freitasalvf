import type { Variants } from "framer-motion";

/**
 * Gramatica de movimento compartilhada entre as secoes que navegam por passos
 * (AISolution, BlockchainSolution): a camera avanca sempre no mesmo sentido.
 * Descendo, a tela nasce pequena e distante, chega ao lugar e depois cresce ate
 * atravessar a camera. Subindo, o mesmo caminho ao contrario — sem isso, voltar
 * repete a animacao de descer e a ilusao de percurso quebra.
 *
 * A personalidade de cada bloco e a INTENSIDADE (o quanto ele se afasta e o
 * quanto ele avanca), nunca a direcao.
 */

interface TravelOptions {
  /** Escala ao passar pela camera. Quanto maior, mais a tela "fura" a tela. */
  near: number;
  /** Escala no ponto distante, antes de chegar. */
  far: number;
  /** Desfoque em px nas pontas. 0 nao aplica filter nenhum — ver nota abaixo. */
  blur?: number;
}

export const makeTravel = ({ near, far, blur = 24 }: TravelOptions): Variants => {
  // filter: "blur(0px)" no estado de repouso ainda deixa um filter aplicado, o
  // que forca o navegador a rasterizar a subarvore. Em telas com muitos nos (a
  // pilha 3D do DepthText, por exemplo) isso custa caro, entao blur 0 remove a
  // propriedade em vez de zera-la.
  const withBlur = (px: number) => (blur === 0 ? {} : { filter: `blur(${px}px)` });

  return {
    enter: (direction: number) => ({
      opacity: 0,
      scale: direction >= 0 ? far : near,
      ...withBlur(blur),
    }),
    center: {
      opacity: 1,
      scale: 1,
      ...withBlur(0),
      transition: { duration: 0.8, ease: "easeOut" },
    },
    exit: (direction: number) => ({
      opacity: 0,
      scale: direction >= 0 ? near : far,
      ...withBlur(blur),
      // Saida mais rapida que a entrada: aproximar demora, passar por voce e rapido.
      transition: { duration: 0.55, ease: "easeIn" },
    }),
  };
};

/** Telas de titulo e de cards: o ritmo padrao do percurso. */
export const travelNormal = makeTravel({ near: 1.9, far: 0.55 });

/** Abertura e o NAIA: mais contido, e sem blur por causa da pilha do DepthText. */
export const travelSoft = makeTravel({ near: 1.45, far: 0.62, blur: 0 });

/** Mesma amplitude do normal, sem filter. Dois casos pedem este preset:
 *  blocos com canvas ou pilha 3D animando por frame, onde um filter no ancestral
 *  forca rerrasterizar tudo; e blocos cujos filhos usam backdrop-filter, que
 *  precisa se resolver de novo contra o contexto criado pelo filter — a cada
 *  valor de escala da transicao. */
export const travelFlat = makeTravel({ near: 1.9, far: 0.55, blur: 0 });

/** As pontes entre areas. Sao a pontuacao do percurso — atravessam a camera. */
export const travelPunch = makeTravel({ near: 4, far: 0.2, blur: 40 });

/** Props que todo bloco de conteudo recebe do orquestrador. */
export interface TravelProps {
  /** +1 descendo, -1 subindo. Decide para que lado a viagem acontece. */
  direction: number;
}
