"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface DashboardNodeProps {
  word: string;
  nodeNumber: number;
  visualIndex: number;
  isSelected?: boolean;
  hasActiveSelection?: boolean;
  onSelect?: (e: React.MouseEvent) => void;
}

export const DashboardNode = ({
  word,
  nodeNumber,
  visualIndex,
  isSelected = false,
  hasActiveSelection = false,
  onSelect
}: DashboardNodeProps) => {
  // Memoize o ID para evitar mudanças em re-renders simples
  const nodeID = useMemo(() => `NODE_0x${Math.floor(Math.random() * 1000).toString(16).toUpperCase()}`, []);

  const playHoverSound = () => {
    const audio = new Audio("/audios/transition-efect.mp3");
    audio.volume = 0.3;
    audio.play().catch(e => console.log("Audio play prevented:", e));
  };

  // Gerar um caminho de nuvem com 12 curvaturas (scallops)
  const cloudPath = useMemo(() => {
    const numScallops = 15;
    const rx = 350; // Aumentado para evitar que pareça uma bola (mais largura)
    const ry = 110; // Mantendo o ajuste manual do usuário
    const centerX = 150; // Re-centrado para novo viewBox 300x200
    const centerY = 100; // Re-centrado para novo viewBox 300x200
    const amplitude = 25; // Gominhos mais marcados e maiores conforme pedido

    let path = `M ${centerX + rx},${centerY} `;

    for (let i = 0; i < numScallops; i++) {
      const theta1 = (i / numScallops) * Math.PI * 2;
      const theta2 = ((i + 1) / numScallops) * Math.PI * 2;
      const midTheta = (theta1 + theta2) / 2;

      const x2 = centerX + Math.cos(theta2) * rx;
      const y2 = centerY + Math.sin(theta2) * ry;

      // Ponto de controle puxado para fora para criar o efeito arredondado (gibi)
      // Aumentamos o raio no ponto médio para criar a "barriga" da curva
      const cx = centerX + Math.cos(midTheta) * (rx + amplitude);
      const cy = centerY + Math.sin(midTheta) * (ry + amplitude);

      path += `Q ${cx},${cy} ${x2},${y2} `;
    }
    return path + " Z";
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      onMouseEnter={playHoverSound}
      animate={{
        opacity: isSelected ? 1 : (hasActiveSelection ? 0.2 : 1),
        scale: isSelected ? 1.15 : (hasActiveSelection ? 0.9 : 1),
        y: [0, -10, 0],
        transition: {
          opacity: { duration: 0.5, delay: isSelected ? 0 : visualIndex * 0.1, ease: "easeOut" },
          scale: { duration: 0.5, delay: isSelected ? 0 : visualIndex * 0.1, ease: "easeOut" },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: visualIndex * 0.5 }
        }
      }}
      whileHover={!hasActiveSelection ? {
        scale: 1.1,
        transition: { duration: 0.2 }
      } : {}}
      onClick={onSelect}
      className={`group relative p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all pointer-events-auto ${isSelected ? 'z-50' : 'z-20'}`}
    >
      {/* === COMIC THOUGHT CLOUD (SVG Scalloped Shape) === */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <svg
          viewBox="0 0 310 210"
          className="w-full h-full filter drop-shadow-[0_10px_20px_rgba(34,211,238,0.2)]"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            d={cloudPath}
            fill="black"
            stroke="white"
            strokeWidth="2"
            className="group-hover:fill-zinc-900 transition-colors duration-500"
            style={{
              filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.2))'
            }}
          />
        </svg>
      </div>

      {/* Internal Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-500/5 blur-[30px] rounded-full pointer-events-none group-hover:bg-cyan-400/15 transition-colors duration-1000" />

      {/* Word and Main ID */}
      <div className="relative z-10 flex flex-col items-center">
        <span className="text-[10px] sm:text-[12px] md:text-sm font-black tracking-widest text-sky-400 mb-1 group-hover:text-sky-300 transition-colors leading-tight drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]">
          {word}
        </span>
      </div>
    </motion.div>
  );
};
