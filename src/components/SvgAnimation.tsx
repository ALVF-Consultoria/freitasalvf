"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import { motion, Variants } from "framer-motion";
import { svgPaths } from "./svgPaths";
import { HologramText } from "./HologramText";
import { useMobile } from "../hooks/useMobile";

interface SvgAnimationProps {
  isFrenetic?: boolean;
  isGlitching?: boolean;
  /** Chamado na virada de cada loop, quando o cérebro completo pulsa. */
  onBrainPulse?: () => void;
}

const hologramWords = [
  "Freitas ALVF\nSoluções Inovadoras",
];

// svgPaths[0] é um path único contendo os 84 subpaths do desenho inteiro.
// Ele tem dois papéis: silhueta estática de fundo e, animado, o pulso que
// acende o cérebro completo a cada loop — o ápice da animação. Por ser um
// path só, o dash percorre os 84 subpaths como um comprimento contínuo;
// os traços individuais não reproduzem isso porque cada um é um path separado,
// com dash próprio e fase própria.
const [fullBrainPath, ...strokePaths] = svgPaths;

// Quanto o flash da imagem dispara ANTES da virada do loop, em ms.
// Existe atraso no caminho: notificação do framer-motion -> setState do React
// -> re-render (1-2 frames) e, no Hero, a imagem ainda faz o brightness com
// transition de 50ms. O brilho só chega ao pico ~70ms depois do gatilho, então
// adiantamos na mesma medida.
// Ajuste ESTE número: aumente se o flash ainda vier atrasado, diminua se
// passar a vir cedo demais.
const FLASH_LEAD_MS = 70;

// Duração única do ciclo, para o pulso e para todos os 83 traços. Com o mesmo
// período eles compartilham um ritmo só, em vez de cada um derivar no seu
// tempo — e o FLASH_LEAD_MS calibrado passa a valer entre recarregamentos.
const CYCLE_DURATION = 5;
const CYCLE_DURATION_FRENETIC = 0.8;

// Subconjunto animado no mobile — índices em strokePaths.
const mobileAnimatedIndices = new Set([0, 1, 9, 24, 39, 54, 59, 69, 79, 82]);

export const SvgAnimation = ({ isFrenetic = false, isGlitching = false, onBrainPulse }: SvgAnimationProps) => {
  const isMobile = useMobile();
  const [wordIndex, setWordIndex] = useState(0);
  const [showHologram, setShowHologram] = useState(false);

  // Configurações de estilo dinâmicas
  const strokeColor = "#3b82f6";
  const freneticColor = "#60a5fa";

  // O glow é aplicado uma única vez, no grupo inteiro. Por path custava
  // 2 blurs x 84 paths por frame — era o gargalo real da animação.
  const glowShadow = isFrenetic
    ? `drop-shadow(0 0 15px ${freneticColor})${isMobile ? "" : ` drop-shadow(0 0 30px ${freneticColor})`}`
    : `drop-shadow(0 0 5px ${strokeColor})${isMobile ? "" : ` drop-shadow(0 0 10px ${strokeColor})`}`;

  const handleHoverStart = () => {
    if (isFrenetic) return;
    setWordIndex((prev) => (prev + 1) % hologramWords.length);
    setShowHologram(true);
  };

  const handleHoverEnd = () => {
    setShowHologram(false);
  };

  // Variantes para a animação da corrente de luz
  const lightStreamVariants: Variants = useMemo(() => ({
    initial: { pathLength: 0, pathOffset: 0, opacity: 0 },
    animate: {
      pathLength: [0, 0.4, 0],
      pathOffset: [0, 1.1],
      opacity: isFrenetic ? [0, 1, 0.8, 0] : [0, 0.8, 0.4, 0],
      transition: {
        duration: isFrenetic ? 0.8 : 5,
        repeat: Infinity,
        ease: "linear",
      },
    },
  }), [isFrenetic]);

  const vibrantBlue = "#3b82f6";

  // O pulso do cérebro completo roda sem delay, fechando cada loop
  const cycleDuration = isFrenetic ? CYCLE_DURATION_FRENETIC : CYCLE_DURATION;

  // O pulso é o relógio da cena. pathOffset varre 0 -> 1.1 e reinicia a cada
  // loop; essa virada é o instante em que o cérebro completo pulsa, e é nela
  // que o flash da imagem tem que cair. Detectar a queda do valor é exato —
  // não depende de limiar, ao contrário de mirar o pico do pathLength, que
  // acontece no meio do ciclo e por isso ficava fora de sincronia.
  // pathOffset varre 0 -> 1.1 linearmente ao longo do ciclo. Converter o lead
  // de ms para unidades de offset mantém o adianto constante no tempo real,
  // inclusive no modo frenético, que tem ciclo bem mais curto.
  const flashAtOffset = 1.1 - (FLASH_LEAD_MS / 1000 / cycleDuration) * 1.1;

  const lastOffset = useRef(0);
  const flashArmed = useRef(true);
  const handlePulseUpdate = useCallback((latest: { [key: string]: string | number }) => {
    const offset = typeof latest.pathOffset === "number" ? latest.pathOffset : 0;
    // queda brusca = o loop virou; rearma para o próximo ciclo
    if (offset < lastOffset.current - 0.1) {
      flashArmed.current = true;
    } else if (flashArmed.current && offset >= flashAtOffset) {
      flashArmed.current = false;
      onBrainPulse?.();
    }
    lastOffset.current = offset;
  }, [onBrainPulse, flashAtOffset]);

  // Todos os traços têm o mesmo período; o que os distingue é a fase (delay),
  // que os espalha ao longo do ciclo e forma a onda percorrendo o desenho.
  const streamDelay = (i: number) => (isFrenetic ? (i * 0.01) % 0.8 : (i * 0.08) % 5);

  return (
    <motion.div 
      className="relative w-full aspect-square flex items-center justify-center bg-transparent"
      animate={isFrenetic ? {
        x: [0, -2, 2, -2, 2, 0],
        y: [0, 2, -2, 2, -2, 0],
      } : (isGlitching ? {
        opacity: [1, 0.4, 1.2, 1],
        scale: [1, 1.05, 0.98, 1],
        filter: ["brightness(1)", "brightness(2)", "brightness(1)"]
      } : {})}
      transition={isFrenetic ? {
        duration: 0.1,
        repeat: Infinity,
      } : (isGlitching ? {
        duration: 0.15,
        ease: "linear"
      } : {})}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
    >
      {/* Luz de fundo constante */}
      <div className={`absolute w-[50%] h-[50%] rounded-full blur-[100px] transition-colors duration-500 ${isFrenetic ? 'bg-blue-400/30 grow' : 'bg-blue-600/10'}`} />

      {/* Componente Isolado de Holograma */}
      <HologramText 
        word={hologramWords[wordIndex]} 
        isVisible={showHologram && !isFrenetic} 
      />

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1040 1024"
        className="w-full h-full p-8 relative z-10 overflow-visible pointer-events-none"
      >
        {/* Camada Base: contorno sutil do desenho inteiro em um único path */}
        <path
          d={fullBrainPath}
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="0.5"
          opacity="0.3"
        />

        {/* Camada Colorida: as correntes de luz que percorrem os caminhos */}
        <g style={{ filter: glowShadow }}>
          {/* Pulso do cérebro completo — o ápice que fecha cada loop */}
          <motion.path
            d={fullBrainPath}
            fill="none"
            stroke={isFrenetic ? freneticColor : vibrantBlue}
            strokeWidth={isFrenetic ? 4 : 2}
            strokeLinecap="round"
            variants={lightStreamVariants}
            initial="initial"
            animate="animate"
            onUpdate={handlePulseUpdate}
            transition={{
              duration: cycleDuration,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {strokePaths.map((p, i) => {
            // No mobile, animamos apenas um subconjunto selecionado para economizar CPU
            if (isMobile && !mobileAnimatedIndices.has(i)) return null;

            return (
              <motion.path
                key={`stream-${i}`}
                d={p}
                fill="none"
                stroke={isFrenetic ? freneticColor : vibrantBlue}
                strokeWidth={isFrenetic ? 4 : 2}
                strokeLinecap="round"
                variants={lightStreamVariants}
                initial="initial"
                animate="animate"
                transition={{
                  delay: streamDelay(i),
                  duration: cycleDuration,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            );
          })}
        </g>

        {/* Ponto de luz fixo */}
        <motion.circle
          cx="520"
          cy="512"
          r={isFrenetic ? 8 : 4}
          fill="#fff"
          animate={isFrenetic ? {
            scale: [1, 1.5, 1],
            opacity: [1, 0.5, 1],
          } : {}}
          transition={{ duration: 0.2, repeat: Infinity }}
          style={{ filter: isFrenetic ? "drop-shadow(0 0 20px #fff)" : "drop-shadow(0 0 10px #fff)" }}
        />
      </svg>
    </motion.div>
  );
};
