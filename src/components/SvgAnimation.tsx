"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { svgPaths } from "./svgPaths";
import { HologramText } from "./HologramText";

interface SvgAnimationProps {
  isFrenetic?: boolean;
  isGlitching?: boolean;
}

const hologramWords = [
  "Freitas ALVF\nSoluções Inovadoras",
];

export const SvgAnimation = ({ isFrenetic = false, isGlitching = false }: SvgAnimationProps) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [showHologram, setShowHologram] = useState(false);

  // Configurações de estilo dinâmicas
  const strokeColor = "#3b82f6";
  const freneticColor = "#60a5fa";
  
  const glowShadow = isFrenetic 
    ? `drop-shadow(0 0 15px ${freneticColor}) drop-shadow(0 0 30px ${freneticColor})`
    : `drop-shadow(0 0 5px ${strokeColor}) drop-shadow(0 0 10px ${strokeColor})`;

  const handleHoverStart = () => {
    if (isFrenetic) return;
    setWordIndex((prev) => (prev + 1) % hologramWords.length);
    setShowHologram(true);
  };

  const handleHoverEnd = () => {
    setShowHologram(false);
  };

  // Variantes para a animação da corrente de luz
  const lightStreamVariants: any = {
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
  };

  const paths = svgPaths;
  const vibrantBlue = "#3b82f6";
  const hoverBlue = "#60a5fa";

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
        {/* Camada Base: Contornos sutis */}
        {paths.map((p, i) => (
          <path
            key={`base-${i}`}
            d={p}
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="0.5"
            opacity="0.3"
          />
        ))}

        {/* Camada Colorida: As correntes de luz que percorrem os caminhos */}
        {paths.map((p, i) => (
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
            whileHover={!isFrenetic ? {
              strokeWidth: 4,
              stroke: hoverBlue,
              opacity: 1,
              filter: `drop-shadow(0 0 5px ${hoverBlue}) drop-shadow(0 0 10px ${hoverBlue})`,
            } : {}}
            transition={{
              ...(lightStreamVariants.animate.transition as any),
              delay: isFrenetic ? (i * 0.01) % 0.8 : (i * 0.08) % 5,
              duration: isFrenetic ? 0.6 + Math.random() * 0.4 : 4 + Math.random() * 2,
              strokeWidth: { duration: 0.2 },
              stroke: { duration: 0.2 },
            }}
            style={{
              filter: glowShadow,
              cursor: isFrenetic ? "default" : "pointer",
            }}
          />
        ))}

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
