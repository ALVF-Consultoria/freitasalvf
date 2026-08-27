"use client";

import { useEffect, useRef, type CSSProperties } from "react";

/** Mesma fisica do ParticleText (reunir a partir do espalhamento, repelir o
 *  ponteiro, deriva ociosa), mas amostrando os pixels de uma imagem em vez do
 *  fillText. Sao dois arquivos e nao um porque a amostragem e o enquadramento
 *  divergem por completo: texto mede metricas de fonte e espera o FontFaceSet,
 *  imagem espera decode e encaixa uma razao de aspecto. */

export interface ParticleImageProps {
  src: string;
  alt?: string;
  /** Passo da grade de amostragem em pixels da imagem ja redimensionada.
   *  Maior = menos particulas e menos detalhe. */
  density?: number;
  particleSize?: number;
  /** Fracao do container que a imagem ocupa, preservando a razao de aspecto. */
  scale?: number;
  /** Deslocamento do centro, em fracao do container. 0.1 = 10% para a direita/baixo. */
  offsetX?: number;
  offsetY?: number;
  scatter?: number;
  gatherDuration?: number;
  stagger?: number;
  pointerRepel?: number;
  repelRadius?: number;
  idleDrift?: number;
  /** Desmontagem continua: amplitude, em pixels, do vagar de cada particula para
   *  fora da propria casa quando o desenho esta parado. Cada uma tem direcao
   *  fixa e fase propria, entao o conjunto nunca pulsa junto — o desenho fica
   *  se desfazendo e se refazendo em vez de respirar em bloco. 0 desliga. */
  dissolve?: number;
  /** Velocidade do ciclo de desmontagem, em radianos por segundo. */
  dissolveSpeed?: number;
  /** Quanto a fase do ciclo se espalha entre as particulas, 0-1. Em 0 todas
   *  saem e voltam juntas e o desenho lateja em bloco. Em 1 elas cobrem o ciclo
   *  inteiro a qualquer instante, e o resultado e um chuvisco permanente: bonito,
   *  mas o desenho nunca chega a ficar nitido. Valores baixos dao o que se le
   *  como desmontagem — a forma se desfaz e se refaz, com as particulas soltando
   *  em tempos ligeiramente diferentes. */
  dissolveSpread?: number;
  /** Aproximacao da camera. 1 e o repouso; acima disso as particulas se afastam
   *  do centro do desenho e crescem, e o efeito e atravessar a arte em vez de
   *  ve-la de longe. Vai daqui, e nao de um scale CSS no canvas: escalar o
   *  bitmap borra pontos de 2px, enquanto afastar as posicoes mantem cada
   *  particula desenhada nitida. Mudar este valor nao reamostra a imagem — ele
   *  chega ao laco por ref, entao esta fora das dependencias do efeito. */
  zoom?: number;
  /** Raio, em pixels, de um vazio aberto no centro do desenho: as particulas
   *  dentro dele apagam progressivamente ate quase nada no meio. Serve para
   *  depois da aproximacao, quando a arte deixa de ser o assunto e vira o lugar
   *  onde o conteudo acontece — sem isso o campo cobre justamente o miolo da
   *  tela. Tambem e o que faz a cena ler como estar dentro da peca em vez de
   *  olhar para ela: a estrutura fica em volta, nao na frente. 0 desliga.
   *  Como o zoom, chega ao laco por ref e nao reamostra a imagem. */
  coreFade?: number;
  /** Quao rapido a camera persegue o zoom alvo, por quadro. Baixo o bastante
   *  para ler como voo; a mola de cada particula fica para tras de proposito e
   *  esse atraso e o rastro. */
  zoomFollow?: number;
  /** Raio do punhado agarrado no pointerdown. */
  dragRadius?: number;
  /** Quanto do deslocamento do ponteiro chega nas particulas, 0-1. Abaixo de 1
   *  a nuvem cede menos que a mao, e a volta ao lugar le como elastico. */
  dragStrength?: number;
  /** Teto rigido: se a grade render mais que isso, o passo aumenta e ela e
   *  reamostrada. Evita que uma imagem grande derrube o frame. */
  maxParticles?: number;
  /** Descarta pixels quase transparentes. */
  alphaThreshold?: number;
  /** Descarta pixels abaixo deste brilho (0-1). Numa arte de brilho sobre preto
   *  o canal alfa cobre a silhueta inteira, miolo escuro incluso, e a maioria
   *  das amostras cai no preenchimento em vez das linhas que acendem: o desenho
   *  vira um borrao. Cortando o escuro, o mesmo teto de particulas compra uma
   *  grade mais fina sobre o que restou, e a forma reaparece. 0 mantem tudo.
   *
   *  O brilho aqui e o canal mais forte, e nao a luminancia Rec.709, de proposito:
   *  a luminancia pesa o vermelho em 21%, entao um vermelho aceso mede 0.21 e
   *  seria descartado como se fosse sombra. Arte de holograma costuma ter
   *  justamente esses realces saturados. */
  lightThreshold?: number;
  /** Ajuste fino sobre a normalizacao de cor, nao um multiplicador cru. Cada
   *  particula ja tem os tres canais escalados juntos ate o canal mais forte
   *  bater um alvo derivado da luminancia — assim o pixel mais escuro que
   *  sobreviveu ao corte ainda aparece sobre #050505 e a matiz nao desvia. */
  brightness?: number;
  /** null = cada particula herda a cor do proprio pixel. Um par [escuro, claro]
   *  joga fora a cor da imagem e mapeia so a luminancia nessa rampa. */
  tint?: [string, string] | null;
  /** Composicao aditiva: particulas sobrepostas somam brilho. Da o halo de
   *  holograma sem o custo do shadowBlur, que a 3 mil particulas inviabiliza. */
  additive?: boolean;
  className?: string;
  style?: CSSProperties;
}

type Rgb = { r: number; g: number; b: number };
type Target = { x: number; y: number; alpha: number; norm: number; color: string };
type Particle = {
  x: number;
  y: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  size: number;
  color: string;
  seed: number;
  depth: number;
  delay: number;
  /** Direcao fixa do vagar da desmontagem, ja como vetor unitario: seno e
   *  cosseno por particula por quadro sao milhares de chamadas por segundo. */
  driftX: number;
  driftY: number;
};

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

const hexToRgb = (hex: string): Rgb | null => {
  const clean = hex.replace("#", "").trim();
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
};

const mixRgb = (from: Rgb, to: Rgb, amount: number): Rgb => ({
  r: Math.round(from.r + (to.r - from.r) * amount),
  g: Math.round(from.g + (to.g - from.g) * amount),
  b: Math.round(from.b + (to.b - from.b) * amount),
});

/** Canal mais forte, o "valor" do HSV. Ver a nota em lightThreshold sobre por
 *  que nao e a luminancia Rec.709. */
const channelPeak = (r: number, g: number, b: number): number => Math.max(r, g, b) / 255;

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    // Sem crossOrigin de proposito: a imagem vem de /public, mesma origem, e
    // pedir CORS a um host que nao responde com o cabecalho quebraria o load.
    // Uma imagem de outra origem sem CORS suja o canvas e o getImageData lanca.
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`ParticleImage: falha ao carregar ${src}`));
    image.src = src;
  });

export const ParticleImage = ({
  src,
  alt = "",
  density = 4,
  particleSize = 1.9,
  scale = 0.9,
  offsetX = 0,
  offsetY = 0,
  scatter = 200,
  gatherDuration = 1800,
  stagger = 500,
  pointerRepel = 46,
  repelRadius = 150,
  idleDrift = 0.7,
  dissolve = 0,
  dissolveSpeed = 0.9,
  dissolveSpread = 1,
  zoom = 1,
  coreFade = 0,
  zoomFollow = 0.045,
  dragRadius = 260,
  dragStrength = 0.85,
  maxParticles = 3600,
  alphaThreshold = 40,
  lightThreshold = 0,
  brightness = 1,
  tint = null,
  additive = true,
  className = "",
  style,
}: ParticleImageProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Por ref, e nao por dependencia: o zoom muda a cada passo da secao, e como
  // dependencia do efeito ele derrubaria as particulas e refaria a amostragem
  // inteira no meio do voo.
  const zoomRef = useRef(zoom);
  const coreFadeRef = useRef(coreFade);
  useEffect(() => {
    zoomRef.current = zoom;
    coreFadeRef.current = coreFade;
  }, [zoom, coreFade]);

  const tintFrom = tint?.[0] ?? null;
  const tintTo = tint?.[1] ?? null;

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    let particles: Particle[] = [];
    let animationFrame: number | null = null;
    let resizeFrame: number | null = null;
    let buildId = 0;
    let disposed = false;
    let gathering = false;
    let gatherStart = 0;
    let reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    let width = 0;
    let height = 0;
    let dpr = 1;
    // Centro do desenho, nao do container: e dele que a camera se aproxima.
    let focusX = 0;
    let focusY = 0;
    let zoomNow = zoomRef.current;
    let coreNow = coreFadeRef.current;
    // O rect fica em cache: o pointermove dispara dezenas de vezes por segundo e
    // um getBoundingClientRect por evento e uma leitura de layout forcada.
    let rect: DOMRect | null = null;

    const pointer = {
      active: false,
      x: 0, y: 0,
      smoothX: 0, smoothY: 0,
      // Agarrado: o punhado e escolhido uma vez, no pointerdown, e nao a cada
      // quadro pela posicao atual. Medindo do ponto de origem o mesmo conjunto
      // continua preso durante todo o arrasto — a sensacao e de pegar um punhado
      // de tecido; medindo da posicao corrente viraria um pincel varrendo.
      down: false, grabX: 0, grabY: 0,
    };

    const refreshRect = (): void => {
      rect = canvas.getBoundingClientRect();
    };

    const startGather = (fromScatter: boolean): void => {
      if (!particles.length) return;
      const spread = reducedMotion ? 0 : scatter;

      particles.forEach((particle) => {
        if (fromScatter) {
          const angle = particle.seed * Math.PI * 2;
          const distance = spread * (0.35 + particle.depth * 0.75);
          particle.x = particle.targetX + Math.cos(angle) * distance;
          particle.y = particle.targetY + Math.sin(angle) * distance + (particle.depth - 0.5) * spread * 0.5;
        }
        particle.startX = particle.x;
        particle.startY = particle.y;
        particle.delay = reducedMotion ? 0 : particle.seed * stagger;
      });

      gatherStart = performance.now();
      gathering = true;
    };

    const render = (now: number): void => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = additive ? "lighter" : "source-over";

      pointer.smoothX += (pointer.x - pointer.smoothX) * 0.18;
      pointer.smoothY += (pointer.y - pointer.smoothY) * 0.18;

      const driftTime = now * 0.001;
      zoomNow += (zoomRef.current - zoomNow) * zoomFollow;
      // O vazio abre no mesmo ritmo do zoom: aberto de uma vez, o centro pisca.
      coreNow += (coreFadeRef.current - coreNow) * zoomFollow;
      const zooming = Math.abs(zoomNow - 1) > 0.001;
      const coring = coreNow > 1;
      let complete = true;

      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i];
        let baseX = particle.targetX;
        let baseY = particle.targetY;
        let progress = 1;

        if (gathering) {
          const local = (now - gatherStart - particle.delay) / Math.max(1, reducedMotion ? 1 : gatherDuration);
          progress = clamp(local, 0, 1);
          const eased = easeOutCubic(progress);
          baseX = particle.startX + (particle.targetX - particle.startX) * eased;
          baseY = particle.startY + (particle.targetY - particle.startY) * eased;
          if (progress < 1) complete = false;
        } else if (!reducedMotion) {
          if (idleDrift > 0) {
            baseX += Math.sin(driftTime * 0.9 + particle.seed * 10) * idleDrift * particle.depth;
            baseY += Math.cos(driftTime * 0.75 + particle.depth * 10) * idleDrift * particle.depth;
          }
          if (dissolve > 0) {
            // Fase deslocada por particula: sem isso o cosseno bate junto em
            // todas e o desenho lateja inteiro em vez de se desfazer aos poucos.
            const pulse = 0.5 - 0.5 * Math.cos(driftTime * dissolveSpeed + particle.seed * Math.PI * 2 * dissolveSpread);
            const reach = dissolve * (0.3 + particle.depth * 0.7) * pulse;
            baseX += particle.driftX * reach;
            baseY += particle.driftY * reach;
          }
        }

        if (zooming) {
          baseX = focusX + (baseX - focusX) * zoomNow;
          baseY = focusY + (baseY - focusY) * zoomNow;
        }

        if (pointer.down && !reducedMotion) {
          // Alvo ja aproximado: o punhado precisa acompanhar para onde a
          // particula esta agora, nao para onde ela repousaria sem zoom.
          const gx = focusX + (particle.targetX - focusX) * zoomNow - pointer.grabX;
          const gy = focusY + (particle.targetY - focusY) * zoomNow - pointer.grabY;
          const grabbed = Math.hypot(gx, gy);
          if (grabbed < dragRadius) {
            const hold = Math.pow(1 - grabbed / dragRadius, 2) * dragStrength;
            baseX += (pointer.smoothX - pointer.grabX) * hold;
            baseY += (pointer.smoothY - pointer.grabY) * hold;
          }
        }

        if (pointer.active && !pointer.down && !reducedMotion && pointerRepel > 0 && repelRadius > 0) {
          const dx = baseX - pointer.smoothX;
          const dy = baseY - pointer.smoothY;
          const distance = Math.hypot(dx, dy);
          if (distance > 0 && distance < repelRadius) {
            const force = Math.pow(1 - distance / repelRadius, 2) * pointerRepel;
            baseX += (dx / distance) * force;
            baseY += (dy / distance) * force;
          }
        }

        const follow = reducedMotion ? 1 : 0.22;
        particle.x += (baseX - particle.x) * follow;
        particle.y += (baseY - particle.y) * follow;

        let fade = 1;
        if (coring) {
          const cx = particle.x - focusX;
          const cy = particle.y - focusY;
          const away = Math.sqrt(cx * cx + cy * cy);
          // Ao quadrado: linear deixa uma auréola cinzenta larga demais em volta
          // do vazio, e o que se quer e um centro limpo com borda curta.
          if (away < coreNow) fade = Math.pow(away / coreNow, 2);
        }
        ctx.globalAlpha = clamp((0.3 + progress * 0.7) * fade, 0, 1);
        ctx.fillStyle = particle.color;
        // Cresce menos que o afastamento: em proporcao cheia os pontos viram
        // blocos antes de a forma sair do quadro.
        const drawn = zooming ? particle.size * (1 + (zoomNow - 1) * 0.45) : particle.size;
        ctx.fillRect(particle.x, particle.y, drawn, drawn);
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      if (gathering && complete) gathering = false;

      animationFrame = window.requestAnimationFrame(render);
    };

    const ensureRenderLoop = (): void => {
      if (animationFrame === null) animationFrame = window.requestAnimationFrame(render);
    };

    const sample = async (): Promise<void> => {
      const currentBuild = ++buildId;

      // clientWidth/clientHeight e nao getBoundingClientRect: o rect ja vem com
      // os transforms dos ancestrais aplicados, e as particulas vivem no espaco
      // nao escalado do canvas.
      width = container.clientWidth;
      height = container.clientHeight;
      if (width <= 0 || height <= 0) return;

      let image: HTMLImageElement;
      try {
        image = await loadImage(src);
      } catch {
        return;
      }
      if (disposed || currentBuild !== buildId) return;

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      refreshRect();

      const natW = image.naturalWidth || image.width;
      const natH = image.naturalHeight || image.height;
      if (!natW || !natH) return;

      const fit = Math.min((width * scale) / natW, (height * scale) / natH);
      const drawW = Math.max(1, Math.round(natW * fit));
      const drawH = Math.max(1, Math.round(natH * fit));

      const offscreen = document.createElement("canvas");
      const offCtx = offscreen.getContext("2d", { willReadFrequently: true });
      if (!offCtx) return;
      offscreen.width = drawW;
      offscreen.height = drawH;
      offCtx.clearRect(0, 0, drawW, drawH);
      offCtx.drawImage(image, 0, 0, drawW, drawH);

      let data: Uint8ClampedArray;
      try {
        data = offCtx.getImageData(0, 0, drawW, drawH).data;
      } catch {
        // Canvas sujo por imagem de outra origem sem CORS.
        return;
      }

      // Trava nas bordas: um offset que jogaria o desenho para fora satura em
      // vez de cortar. So vale quando ele cabe — se for maior que o container o
      // corte e intencional e o offset passa direto.
      const place = (extent: number, drawn: number, offset: number): number => {
        const centered = (extent - drawn) / 2 + offset * extent;
        return drawn <= extent ? clamp(centered, 0, extent - drawn) : centered;
      };
      const originX = place(width, drawW, offsetX);
      const originY = place(height, drawH, offsetY);
      focusX = originX + drawW / 2;
      focusY = originY + drawH / 2;

      const fromRgb = tintFrom ? hexToRgb(tintFrom) : null;
      const toRgb = tintTo ? hexToRgb(tintTo) : null;
      const useTint = Boolean(fromRgb && toRgb);

      const scan = (gridStep: number): Target[] => {
        const found: Target[] = [];
        for (let y = 0; y < drawH; y += gridStep) {
          for (let x = 0; x < drawW; x += gridStep) {
            const offset = (y * drawW + x) * 4;
            const alpha = data[offset + 3];
            if (alpha <= alphaThreshold) continue;

            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];
            const light = channelPeak(r, g, b);
            if (light < lightThreshold) continue;

            // Reespalha a faixa que sobrou do corte de volta em 0-1: sem isso,
            // cortar em 0.45 deixaria o resultado inteiro na metade de cima da
            // escala e sem sombra nenhuma.
            const norm = clamp((light - lightThreshold) / Math.max(1e-6, 1 - lightThreshold), 0, 1);

            let color: string;
            if (useTint) {
              const mixed = mixRgb(fromRgb as Rgb, toRgb as Rgb, norm);
              color = `rgb(${mixed.r},${mixed.g},${mixed.b})`;
            } else {
              // O expoente 0.6 abre as sombras; o piso 0.35 garante que nada
              // amostrado desapareca no fundo.
              const target = (0.35 + Math.pow(norm, 0.6) * 0.65) * brightness;
              const peak = Math.max(r, g, b) || 1;
              const k = (target * 255) / peak;
              // Quantizado em passos de 8: a fillStyle e reparseada a cada
              // atribuicao, e menos strings distintas aliviam o cache do canvas.
              const qr = Math.min(255, Math.round((r * k) / 8) * 8);
              const qg = Math.min(255, Math.round((g * k) / 8) * 8);
              const qb = Math.min(255, Math.round((b * k) / 8) * 8);
              color = `rgb(${qr},${qg},${qb})`;
            }

            found.push({ x: originX + x, y: originY + y, alpha: alpha / 255, norm, color });
          }
        }
        return found;
      };

      const baseStep = Math.max(1, Math.floor(density));
      let targets = scan(baseStep);
      if (targets.length > maxParticles) {
        // Reamostra numa grade mais larga em vez de filtrar a lista: pular um a
        // cada N numa varredura por linhas produz faixas diagonais no desenho.
        const widened = Math.ceil(baseStep * Math.sqrt(targets.length / maxParticles));
        targets = scan(widened);
      }

      particles = targets.map((target, index) => {
        const seed = ((index * 9301 + 49297) % 233280) / 233280;
        const depth = 0.45 + (((index * 233 + 97) % 1000) / 1000) * 0.9;
        return {
          x: target.x,
          y: target.y,
          startX: target.x,
          startY: target.y,
          targetX: target.x,
          targetY: target.y,
          size: Math.max(0.6, particleSize * (0.75 + target.norm * 0.6) * (0.6 + target.alpha * 0.4)),
          color: target.color,
          seed,
          depth,
          delay: seed * stagger,
          driftX: Math.cos(seed * Math.PI * 2),
          driftY: Math.sin(seed * Math.PI * 2),
        };
      });

      pointer.x = width / 2;
      pointer.y = height / 2;
      pointer.smoothX = pointer.x;
      pointer.smoothY = pointer.y;

      if (reducedMotion) {
        gathering = false;
      } else {
        startGather(true);
      }

      ensureRenderLoop();
    };

    const queueSample = (): void => {
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(() => void sample());
    };

    // O ponteiro e escutado na janela, nao no canvas: como camada de fundo ele
    // roda com pointer-events-none para nao roubar clique nem scroll da secao,
    // e um canvas nesse estado nunca recebe pointermove proprio.
    const handlePointerMove = (event: PointerEvent): void => {
      if (!rect || !rect.width || !rect.height) refreshRect();
      if (!rect || !rect.width || !rect.height) return;
      // O rect esta em pixels de tela e pode estar escalado por um ancestral; a
      // razao entre ele e width/height converte um espaco no outro.
      pointer.x = (event.clientX - rect.left) * (width / rect.width);
      pointer.y = (event.clientY - rect.top) * (height / rect.height);
      pointer.active = true;
    };

    const handlePointerLeave = (): void => {
      pointer.active = false;
      pointer.down = false;
    };

    const handlePointerDown = (event: PointerEvent): void => {
      handlePointerMove(event);
      // Toque nao agarra: no celular o mesmo gesto ja e a navegacao por swipe do
      // useStepNavigation, e as duas coisas brigariam pelo arrasto.
      if (event.pointerType === "touch") return;
      pointer.grabX = pointer.x;
      pointer.grabY = pointer.y;
      pointer.smoothX = pointer.x;
      pointer.smoothY = pointer.y;
      pointer.down = true;
    };

    const handlePointerUp = (): void => {
      // Solta e pronto: a mola que ja puxa cada particula para a casa dela e o
      // "magnetismo" da volta, sem precisar de um caminho de retorno proprio.
      pointer.down = false;
    };

    const reduceMotionQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const handleReduceMotionChange = (event: MediaQueryListEvent): void => {
      reducedMotion = event.matches;
      void sample();
    };

    reduceMotionQuery?.addEventListener("change", handleReduceMotionChange);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    window.addEventListener("pointercancel", handlePointerUp, { passive: true });
    window.addEventListener("blur", handlePointerLeave);
    window.addEventListener("scroll", refreshRect, { passive: true });
    document.addEventListener("pointerleave", handlePointerLeave);

    const resizeObserver = new ResizeObserver(queueSample);
    resizeObserver.observe(container);
    void sample();

    return () => {
      disposed = true;
      buildId += 1;
      resizeObserver.disconnect();
      reduceMotionQuery?.removeEventListener("change", handleReduceMotionChange);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      window.removeEventListener("blur", handlePointerLeave);
      window.removeEventListener("scroll", refreshRect);
      document.removeEventListener("pointerleave", handlePointerLeave);
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
      if (resizeFrame !== null) window.cancelAnimationFrame(resizeFrame);
    };
  }, [
    src, density, particleSize, scale, offsetX, offsetY, scatter, gatherDuration,
    stagger, pointerRepel, repelRadius, idleDrift, dissolve, dissolveSpeed, dissolveSpread,
    zoomFollow, dragRadius, dragStrength, maxParticles, alphaThreshold,
    lightThreshold, brightness, tintFrom, tintTo, additive,
  ]);

  return (
    <div
      ref={containerRef}
      className={`relative block h-full w-full overflow-hidden ${className}`}
      style={style}
      role={alt ? "img" : "presentation"}
      aria-label={alt || undefined}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" aria-hidden="true" />
    </div>
  );
};
