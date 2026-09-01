"use client";

import { useEffect, useRef } from "react";
import {
  Renderer,
  Camera,
  Transform,
  Plane,
  Program,
  Mesh,
  Texture,
  type OGLRenderingContext,
} from "ogl";

/**
 * Pilha de posteres que voa pelo eixo Y. Quem manda e o passo: `focus` diz qual
 * poster deve estar no centro, e a pilha desliza ate ele. Um scroll, um poster.
 *
 * Nasceu do FlyingPosters do react-bits e diverge dele em cinco pontos, todos
 * anotados no lugar onde aparecem: o giro esta deslocado meio ciclo, a posicao
 * vem do passo em vez da roda do mouse, o loop infinito saiu, o
 * requestAnimationFrame e cancelado no destroy e o encaixe de proporcao no
 * fragment shader trocava os eixos.
 *
 * `ogl` ja era dependencia do projeto (Galaxy.tsx), entao isto nao traz peso
 * novo para o bundle.
 */

type GL = OGLRenderingContext;

interface ScreenSize {
  width: number;
  height: number;
}

interface ViewportSize {
  width: number;
  height: number;
}

/* O `- PI * 0.5` na chamada do rotate e a correcao central deste arquivo.
 *
 * `localprogress` varre 0..PI conforme o poster desce a tela, e o meio dessa
 * varredura cai exatamente no centro do viewport — ou seja, no original o
 * poster fica a 90°, de perfil e invisivel, justo onde a viagem para. Medido:
 * 170° entrando pelo topo, 90° no centro, 10° saindo por baixo.
 *
 * Deslocando meio ciclo a varredura vira -90°..+90°: o poster entra quase de
 * perfil, ABRE de frente no centro e vira embora ao sair. Alem de deixar o
 * ultimo poster legivel parado, fica simetrico — o efeito passa a acontecer na
 * entrada e na saida, e nao so depois do centro.
 */
const vertexShader = `
precision highp float;

attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float uPosition;
uniform vec3 distortionAxis;
uniform vec3 rotationAxis;
uniform float uDistortion;

varying vec2 vUv;

float PI = 3.141592653589793238;

mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;

    return mat4(
      oc * axis.x * axis.x + c,         oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
      oc * axis.x * axis.y + axis.z * s,oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
      oc * axis.z * axis.x - axis.y * s,oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
      0.0,                              0.0,                                0.0,                                1.0
    );
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
  mat4 m = rotationMatrix(axis, angle);
  return (m * vec4(v, 1.0)).xyz;
}

float qinticInOut(float t) {
  return t < 0.5
    ? 16.0 * pow(t, 5.0)
    : -0.5 * abs(pow(2.0 * t - 2.0, 5.0)) + 1.0;
}

void main() {
  vUv = uv;

  float norm = 0.5;
  vec3 newpos = position;
  float offset = (dot(distortionAxis, position) + norm / 2.) / norm;
  float localprogress = clamp(
    (fract(uPosition * 5.0 * 0.01) - 0.01 * uDistortion * offset) / (1. - 0.01 * uDistortion),
    0.,
    2.
  );
  localprogress = qinticInOut(localprogress) * PI;
  newpos = rotate(newpos, rotationAxis, localprogress - PI * 0.5);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newpos, 1.0);
}
`;

/* Encaixe "cover" centrado. Os dois branches estavam com os eixos trocados no
 * original: plano mais largo que a imagem tem que recortar em cima e embaixo
 * (mexer no v), e o codigo mexia no u. Com proporcoes iguais dava na mesma, mas
 * qualquer arte fora da razao planeWidth/planeHeight saia esticada em vez de
 * recortada — armadilha silenciosa para quem trocasse uma imagem depois. */
const fragmentShader = `
precision highp float;

uniform vec2 uImageSize;
uniform vec2 uPlaneSize;
uniform sampler2D tMap;

varying vec2 vUv;

void main() {
  float imageAspect = uImageSize.x / uImageSize.y;
  float planeAspect = uPlaneSize.x / uPlaneSize.y;
  vec2 scale = vec2(1.0, 1.0);

  if (planeAspect > imageAspect) {
      scale.y = imageAspect / planeAspect;
  } else {
      scale.x = planeAspect / imageAspect;
  }

  vec2 uv = vUv * scale + (1.0 - scale) * 0.5;

  gl_FragColor = texture2D(tMap, uv);
}
`;

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);

const smoothstep = (edge0: number, edge1: number, x: number): number => {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

interface MediaParams {
  gl: GL;
  geometry: Plane;
  scene: Transform;
  screen: ScreenSize;
  viewport: ViewportSize;
  image: string;
  length: number;
  index: number;
  planeWidth: number;
  planeHeight: number;
  padding: number;
  distortion: number;
}

class Media {
  gl: GL;
  geometry: Plane;
  scene: Transform;
  screen: ScreenSize;
  viewport: ViewportSize;
  image: string;
  length: number;
  index: number;
  planeWidth: number;
  planeHeight: number;
  padding: number;
  distortion: number;

  program!: Program;
  plane!: Mesh;
  height = 0;
  y = 0;
  img: HTMLImageElement | null = null;

  constructor({
    gl,
    geometry,
    scene,
    screen,
    viewport,
    image,
    length,
    index,
    planeWidth,
    planeHeight,
    padding,
    distortion,
  }: MediaParams) {
    this.gl = gl;
    this.geometry = geometry;
    this.scene = scene;
    this.screen = screen;
    this.viewport = viewport;
    this.image = image;
    this.length = length;
    this.index = index;
    this.planeWidth = planeWidth;
    this.planeHeight = planeHeight;
    this.padding = padding;
    this.distortion = distortion;

    this.createShader();
    this.createMesh();
    this.onResize();
  }

  createShader(): void {
    const texture = new Texture(this.gl, { generateMipmaps: false });

    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      fragment: fragmentShader,
      vertex: vertexShader,
      uniforms: {
        tMap: { value: texture },
        uPosition: { value: 0 },
        uPlaneSize: { value: [0, 0] },
        uImageSize: { value: [0, 0] },
        rotationAxis: { value: [0, 1, 0] },
        distortionAxis: { value: [1, 1, 0] },
        uDistortion: { value: this.distortion },
      },
      cullFace: false,
    });

    // Sem crossOrigin: as imagens moram em /public, mesma origem. Pedir CORS a
    // um host que nao responde com o cabecalho quebra o carregamento — mesmo
    // motivo pelo qual ParticleImage tambem nao pede.
    const img = new Image();
    img.src = this.image;
    img.onload = () => {
      texture.image = img;
      this.program.uniforms.uImageSize.value = [img.naturalWidth, img.naturalHeight];
    };
    this.img = img;
  }

  createMesh(): void {
    this.plane = new Mesh(this.gl, { geometry: this.geometry, program: this.program });
    this.plane.setParent(this.scene);
  }

  onResize({ screen, viewport }: { screen?: ScreenSize; viewport?: ViewportSize } = {}): void {
    if (screen) this.screen = screen;
    if (viewport) this.viewport = viewport;

    // As duas divisoes dao a mesma escala de unidade-de-mundo por pixel, entao
    // planeWidth/planeHeight sao literalmente o tamanho do poster na tela.
    this.plane.scale.x = (this.viewport.width * this.planeWidth) / this.screen.width;
    this.plane.scale.y = (this.viewport.height * this.planeHeight) / this.screen.height;
    this.plane.position.x = 0;
    this.program.uniforms.uPlaneSize.value = [this.plane.scale.x, this.plane.scale.y];

    // No original o padding era 5 fixo em unidades de mundo — ~30% da altura do
    // viewport, deixando 1,4 poster em cena. Virou prop justamente por isso.
    this.height = this.plane.scale.y + this.padding;
    const total = this.height * this.length;
    this.y = -total / 2 + (this.index + 0.5) * this.height;
  }

  update(scroll: number, distortion: number): void {
    // Sem `extra`: o loop infinito do original salta heightTotal de uma vez, e
    // com 4 posteres esse salto e maior que a faixa estavel (viewport + um
    // plano), entao os posteres fora de quadro oscilavam de posicao a cada
    // quadro. A viagem aqui e uma passada so, com destino fixo — nao precisa
    // de ciclo, e sem ele o pouso e exato.
    this.plane.position.y = this.y - scroll;

    const t = (this.plane.position.y + this.viewport.height) / (2 * this.viewport.height);
    this.program.uniforms.uPosition.value = 5 + t * 10;
    this.program.uniforms.uDistortion.value = distortion;
  }

  destroy(): void {
    if (this.img) {
      this.img.onload = null;
      this.img.onerror = null;
      this.img = null;
    }
    this.plane.setParent(null);
    this.program.remove();
  }
}

interface CanvasParams {
  container: HTMLElement;
  scroller: HTMLElement;
  canvas: HTMLCanvasElement;
  items: string[];
  planeWidth: number;
  planeHeight: number;
  padding: number;
  distortion: number;
  scrollEase: number;
  startAtEnd: boolean;
  cameraFov: number;
  cameraZ: number;
}

class Canvas {
  container: HTMLElement;
  scroller: HTMLElement;
  items: string[];
  planeWidth: number;
  planeHeight: number;
  padding: number;
  distortion: number;
  scrollEase: number;

  renderer: Renderer;
  gl: GL;
  camera: Camera;
  scene: Transform;
  planeGeometry: Plane;
  medias: Media[] = [];
  screen: ScreenSize = { width: 1, height: 1 };
  viewport: ViewportSize = { width: 1, height: 1 };

  /** Primeiro poster no centro: e onde a pilha comeca. */
  entry = 0;
  /** Ultimo poster no centro exato: e onde a pilha para. */
  rest = 0;
  scroll = 0;
  target = 0;
  settle = 0;
  raf = 0;

  constructor({
    container,
    scroller,
    canvas,
    items,
    planeWidth,
    planeHeight,
    padding,
    distortion,
    scrollEase,
    startAtEnd,
    cameraFov,
    cameraZ,
  }: CanvasParams) {
    this.container = container;
    this.scroller = scroller;
    this.items = items;
    this.planeWidth = planeWidth;
    this.planeHeight = planeHeight;
    this.padding = padding;
    this.distortion = distortion;
    this.scrollEase = scrollEase;

    this.renderer = new Renderer({
      canvas,
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio, 2),
    });
    this.gl = this.renderer.gl;

    this.camera = new Camera(this.gl);
    this.camera.fov = cameraFov;
    this.camera.position.z = cameraZ;

    this.scene = new Transform();
    // widthSegments alto e heightSegments 1: a torcao percorre a LARGURA do
    // poster (o giro e no eixo Y), entao so a horizontal precisa de subdivisao.
    this.planeGeometry = new Plane(this.gl, { heightSegments: 1, widthSegments: 100 });

    this.measure();
    this.createMedias();
    this.computeRange();

    // Chegando por baixo (o usuario voltou da analise), a pilha nasce no FIM: no
    // Solana, com o scroller no fundo. Nascendo no comeco, o passo abria no
    // Polygon e — pior — o scroller ficava em scrollTop 0, que e a condicao que
    // o isAtScrollBoundary usa para liberar a subida: uma rolagem para cima
    // saltava os quatro posteres de uma vez.
    if (startAtEnd) {
      this.scroller.scrollTop = this.scroller.scrollHeight - this.scroller.clientHeight;
      this.scroll = this.rest;
      this.target = this.rest;
    } else {
      this.scroll = this.entry;
      this.target = this.entry;
    }

    this.onResize = this.onResize.bind(this);
    this.update = this.update.bind(this);
    window.addEventListener("resize", this.onResize);
    this.raf = requestAnimationFrame(this.update);
  }

  measure(): void {
    // offsetWidth/offsetHeight, e nao getBoundingClientRect(): o rect inclui as
    // transforms do CSS, e este canvas monta dentro de um bloco que entra com
    // travelFlat — cujo estado inicial e scale 0.55. Medindo pelo rect, um
    // container de 800px se apresentava como 440, o renderer fixava o canvas
    // nesse tamanho por style inline (que ganha do w-full/h-full) e a pista
    // inteira ficava encolhida e ancorada no canto. offsetWidth e a caixa de
    // layout, imune a transform.
    this.screen = {
      width: Math.max(1, this.container.offsetWidth),
      height: Math.max(1, this.container.offsetHeight),
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({ aspect: this.gl.canvas.width / this.gl.canvas.height });

    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    this.viewport = { width: height * this.camera.aspect, height };
  }

  createMedias(): void {
    this.medias = this.items.map(
      (image, index) =>
        new Media({
          gl: this.gl,
          geometry: this.planeGeometry,
          scene: this.scene,
          screen: this.screen,
          viewport: this.viewport,
          image,
          length: this.items.length,
          index,
          planeWidth: this.planeWidth,
          planeHeight: this.planeHeight,
          padding: this.padding,
          distortion: this.distortion,
        })
    );
  }

  computeRange(): void {
    const first = this.medias[0];
    const last = this.medias[this.medias.length - 1];
    if (!first || !last) return;
    // O primeiro poster comeca ENTRANDO — nem fora de quadro, nem centralizado.
    // Os dois extremos ja foram tentados e cada um perde uma coisa: fora de
    // quadro, chegar na topologia abria um anel vazio e a juncao com "O Sistema"
    // nao tinha o que sobrepor; centralizado, ele nascia pronto, e como a torcao
    // e medida por distancia ate o centro, no centro ela e zero — a primeira
    // imagem aparecia parada e chapada, sem efeito nenhum.
    //
    // A 0.55 da meia-faixa visivel ele entra alto, cortado no topo e ja torcido:
    // aparece durante a juncao e ainda tem para onde voar. A primeira rolagem o
    // traz ao centro abrindo de frente, que e o efeito.
    const ENTRY_LEAD = 0.55;
    const band = (this.viewport.height + first.plane.scale.y) / 2;
    this.entry = first.y - ENTRY_LEAD * band;
    this.rest = last.y;
  }

  onResize(): void {
    this.measure();
    this.medias.forEach((media) => media.onResize({ screen: this.screen, viewport: this.viewport }));
    this.computeRange();
  }

  update(): void {
    this.raf = requestAnimationFrame(this.update);

    // O alvo vem do scrollTop nativo, lido direto no loop — sem estado do React,
    // sem re-render por quadro. E o equivalente ao `scroll.target += deltaY` da
    // referencia: entrada continua, nao um destino discreto por passo.
    const max = Math.max(1, this.scroller.scrollHeight - this.scroller.clientHeight);
    const progress = clamp01(this.scroller.scrollTop / max);
    this.target = this.entry + (this.rest - this.entry) * progress;

    // Este lerp E a animacao. Com ease 0.01 o poster arrasta atras do alvo por
    // segundos, e e dai que vem o peso; qualquer valor alto transforma isso num
    // deslize seco entre duas posicoes.
    this.scroll = lerp(this.scroll, this.target, this.scrollEase);

    // A torcao (desalinhamento do giro entre os cantos e o meio do plano, ±43°
    // nos cantos) desmancha sempre que um poster esta no centro, e nao so no fim
    // do percurso. Amarrada ao fim, o primeiro poster — que hoje abre a tela ja
    // centralizado — aparecia torcido feito fita, e a Solana nao: mesma situacao,
    // tratamento diferente. Medida por distancia, cada poster chega reto e a
    // torcao volta ao sair, que e onde ela tem o que dizer.
    let nearest = Infinity;
    for (const media of this.medias) {
      const d = Math.abs(media.y - this.scroll);
      if (d < nearest) nearest = d;
    }
    const slot = this.medias[0]?.height ?? 1;
    this.settle = 1 - smoothstep(0, slot * 0.45, nearest);
    const distortion = this.distortion * (1 - this.settle);

    this.medias.forEach((media) => media.update(this.scroll, distortion));
    this.renderer.render({ scene: this.scene, camera: this.camera });

  }

  destroy(): void {
    // O original nunca cancelava o rAF: desmontado, o loop seguia chamando
    // render num canvas morto pelo resto da sessao.
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.onResize);
    this.medias.forEach((media) => media.destroy());
    this.medias = [];

    // NAO chamar WEBGL_lose_context.loseContext() aqui. O React remonta o efeito
    // (StrictMode em dev monta -> desmonta -> monta) e a segunda montagem recebe
    // o MESMO elemento <canvas>: getContext devolve o contexto que acabou de ser
    // morto, e a partir dai nenhum shader compila. O sintoma e enganoso — o
    // info log do shader vem null, o Program do ogl retorna antes de criar
    // uniformLocations, e o erro que aparece e um forEach de undefined dentro do
    // render, um quadro depois e longe da causa. Apagar programas ja devolve o
    // que era nosso; o contexto pertence ao canvas, nao a esta instancia.
  }
}

interface FlyingPostersProps {
  items: string[];
  planeWidth?: number;
  planeHeight?: number;
  padding?: number;
  distortion?: number;
  scrollEase?: number;
  /** Pixels de rolagem por poster. E o botao de calibrar o ritmo. */
  scrollPerItem?: number;
  /** Entrar pelo fim da pilha, para quem chega por baixo. */
  startAtEnd?: boolean;
  cameraFov?: number;
  cameraZ?: number;
  className?: string;
}

export const FlyingPosters = ({
  items,
  planeWidth = 320,
  planeHeight = 320,
  // 5 e o valor da referencia. Em 2 os posteres ficam colados e a pilha perde o
  // ar entre um e outro, que e metade da leitura de "voando".
  padding = 5,
  distortion = 3,
  // 0.01 e o valor da referencia e nao e um detalhe: e o que faz o poster
  // arrastar atras do alvo. Ver a nota no loop.
  scrollEase = 0.01,
  scrollPerItem = 700,
  startAtEnd = false,
  cameraFov = 45,
  cameraZ = 20,
  className = "",
}: FlyingPostersProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startAtEndRef = useRef(startAtEnd);

  // items entra na dependencia como string. Um literal inline e referencia nova
  // a cada render, e no original isso reconstruia o Canvas inteiro toda vez.
  const key = items.join("|");

  useEffect(() => {
    const container = containerRef.current;
    const scroller = scrollerRef.current;
    const canvas = canvasRef.current;
    if (!container || !scroller || !canvas) return;

    const instance = new Canvas({
      container,
      scroller,
      canvas,
      items: key.split("|"),
      planeWidth,
      planeHeight,
      padding,
      distortion,
      scrollEase,
      startAtEnd: startAtEndRef.current,
      cameraFov,
      cameraZ,
    });

    return () => instance.destroy();
    // startAtEnd so vale no instante da montagem, entao fica fora da lista: se
    // entrasse, mudar de sentido depois derrubaria a cena WebGL sem motivo.
  }, [key, planeWidth, planeHeight, padding, distortion, scrollEase, cameraFov, cameraZ]);

  return (
    <div ref={containerRef} className={`relative w-full h-full overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="block w-full h-full pointer-events-none" />
      {/* Um scroller de verdade por cima do canvas, e nao listeners de roda no
          window como no original: a roda aqui pertence ao useStepNavigation, e os
          dois disparariam juntos. Sendo um elemento rolavel de verdade, o
          isAtScrollBoundary do hook sobe o DOM, encontra este no e se recusa a
          trocar de passo enquanto ele nao chegou ao topo ou ao fundo — entao a
          pilha consome a rolagem ate a Solana e so entao entrega a secao. */}
      <div
        ref={scrollerRef}
        className="absolute inset-0 overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        <div style={{ height: `calc(100% + ${(items.length - 1) * scrollPerItem}px)` }} />
      </div>
    </div>
  );
};
