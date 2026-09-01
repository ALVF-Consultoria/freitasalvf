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

/**
 * Excecao deliberada a gramatica acima, e so para uma juncao: o fim de "O Sistema"
 * e a pilha de posteres da topologia. A pilha e movida por rolagem, entao sair de
 * um voando pela camera e chegar no outro rolando trocava de linguagem no meio do
 * mesmo gesto. Aqui os dois deslizam.
 *
 * Indo, o sentido e PARA BAIXO, e vem da propria pilha: em Media.update a
 * posicao e `y - scroll`, entao avancar a rolagem faz os posteres descerem —
 * entram por cima, saem por baixo.
 *
 * Voltando, TUDO SOBE. Nao e o mesmo movimento outra vez: e o caminho refeito ao
 * contrario. "O Sistema" saiu pela borda de baixo, entao e de la que ele volta,
 * subindo; a topologia entrou pelo topo, entao e por ali que ela sai. Descer nos
 * dois sentidos fazia a tela anterior reaparecer vinda do nada, em vez de voltar
 * de onde estava — e a pilha, cuja posicao sobe quando a rolagem recua, ficava
 * andando ao contrario da juncao que a entrega.
 *
 * Cada preset desliza SO na ponta que encosta na juncao e mantem a outra ponta
 * igual ao que usava antes (travelNormal e travelFlat), para as transicoes
 * vizinhas — intro->features e topologia->analise — nao mudarem. Por isso os
 * dois branches de cada variante sao de naturezas diferentes.
 *
 * Deslocamento em vh e nao em %: os dois blocos tem alturas bem diferentes e a
 * distancia que importa e a da tela.
 */
const SLIDE = "100vh";
/* Mesma unidade nas duas pontas de proposito: interpolar `y` de 0 (numero, que o
 * framer-motion le como px) para "-60vh" (string com unidade) mistura tipos, e e
 * exatamente ai que a interpolacao de transform salta em vez de correr. */
const REST = "0vh";

/**
 * A saida e a entrada desta juncao copiam a curva do lerp da pilha de posteres,
 * e nao uma bezier. O FlyingPosters avanca `scroll += (target - scroll) * 0.01`
 * por quadro: e um decaimento exponencial, e e dele que vem o peso. Toda bezier
 * de saida que eu tentei aqui — a expo-out do IntroStep inclusive — sai rapido
 * demais no primeiro terco e depois arrasta, que e o tranco que se via.
 *
 * POSTER_EASE tem que acompanhar o scrollEase padrao do FlyingPosters. Se um
 * mudar, o outro muda junto, senao a juncao volta a andar num ritmo e a pilha
 * noutro.
 */
const POSTER_EASE = 0.01;

const lerpEase = (duration: number) => {
  const frames = 60 * duration;
  // Quanto sobraria no fim; divide-se por isso para a curva fechar exatamente
  // em 1, ja que exponencial nunca chega sozinha.
  const left = 1 - Math.pow(1 - POSTER_EASE, frames);
  return (t: number) => (1 - Math.pow(1 - POSTER_EASE, frames * t)) / left;
};

/** Duracao do deslize. E o botao de ritmo desta juncao. */
const SLIDE_OUT = 3;
const SLIDE_IN = 3.2;

const NEAR = 1.9;
const FAR = 0.55;

/** FeatureStep. Desliza na ponta que da na topologia; do outro lado, travelNormal. */
export const travelScrollOut: Variants = {
  enter: (direction: number) =>
    direction >= 0
      ? { opacity: 0, scale: FAR, y: REST, filter: "blur(24px)" }
      : // voltando da topologia: sobe de volta pela borda de baixo, por onde saiu
        { opacity: 1, scale: 1, y: SLIDE, filter: "blur(0px)" },
  // center e funcao do sentido porque e ELE que carrega a transicao de entrada, e
  // as duas entradas deste bloco sao de naturezas diferentes: vindo da abertura e
  // o travelNormal de sempre, voltando da topologia e o deslize longo. Fixar uma
  // duracao so aqui mudaria a transicao vizinha junto.
  center: (direction: number) => ({
    opacity: 1,
    scale: 1,
    y: REST,
    filter: "blur(0px)",
    transition:
      direction >= 0
        ? { duration: 0.8, ease: "easeOut" }
        : { duration: SLIDE_IN, ease: lerpEase(SLIDE_IN) },
  }),
  exit: (direction: number) =>
    direction >= 0
      ? // indo para a topologia: sai descendo, pela borda de baixo
        {
          opacity: 0,
          scale: 1,
          y: SLIDE,
          filter: "blur(0px)",
          transition: {
            duration: SLIDE_OUT,
            ease: lerpEase(SLIDE_OUT),
            // A opacidade nao carrega o movimento: ela so entra no fim, quando o
            // bloco ja saiu de quadro. Apagando junto com o deslize, o conteudo
            // evapora no meio da tela em vez de ir embora rolando.
            opacity: { duration: 0.4, delay: SLIDE_OUT - 0.4, ease: "linear" },
          },
        }
      : {
          opacity: 0,
          scale: FAR,
          y: REST,
          filter: "blur(24px)",
          transition: { duration: 0.55, ease: "easeIn" },
        },
};

/** TopologyStep. Desliza na ponta que da nas features; do outro lado, travelFlat.
 *  Sem filter em nenhum estado: esta tela carrega um canvas WebGL animando por
 *  quadro, e um filter no ancestral rerrasteriza a subarvore a cada valor da
 *  transicao — o mesmo motivo de travelFlat existir. */
export const travelScrollIn: Variants = {
  enter: (direction: number) =>
    direction >= 0
      ? // vindo das features: desce do topo, trazendo o primeiro poster junto
        { opacity: 1, scale: 1, y: `-${SLIDE}` }
      : { opacity: 0, scale: NEAR, y: REST },
  center: (direction: number) => ({
    opacity: 1,
    scale: 1,
    y: REST,
    transition:
      direction >= 0
        ? { duration: SLIDE_IN, ease: lerpEase(SLIDE_IN) }
        : { duration: 0.8, ease: "easeOut" },
  }),
  exit: (direction: number) =>
    direction >= 0
      ? { opacity: 0, scale: NEAR, y: REST, transition: { duration: 0.55, ease: "easeIn" } }
      : // voltando para as features: sobe e sai pelo topo, por onde entrou
        {
          opacity: 0,
          scale: 1,
          y: `-${SLIDE}`,
          transition: {
            duration: SLIDE_OUT,
            ease: lerpEase(SLIDE_OUT),
            opacity: { duration: 0.4, delay: SLIDE_OUT - 0.4, ease: "linear" },
          },
        },
};

/** As pontes entre areas. Sao a pontuacao do percurso — atravessam a camera. */
export const travelPunch = makeTravel({ near: 4, far: 0.2, blur: 40 });

/** Props que todo bloco de conteudo recebe do orquestrador. */
export interface TravelProps {
  /** +1 descendo, -1 subindo. Decide para que lado a viagem acontece. */
  direction: number;
}
