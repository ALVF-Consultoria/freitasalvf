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
  // O nodeNumber é usado aqui para gerar um ID determinístico, satisfazendo o lint de uso
  const nodeID = useMemo(() => `0x${(nodeNumber * 123 + 456).toString(16).toUpperCase()}`, [nodeNumber]);
  // Novo path de nuvem (Cloud Computing style - Longa e suave conforme imagem)
  const cloudPath = useMemo(() => {
    return "M25,60 Q25,38 60,38 Q75,23 110,23 Q145,23 160,38 Q200,38 200,60 Q200,87 170,87 L55,87 Q25,87 25,60 Z";
  }, []);

  const playHoverSound = () => {
    const audio = new Audio("/audios/transition-efect.mp3");
    audio.volume = 0.3;
    audio.play().catch(e => console.log("Audio play prevented:", e));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      onMouseEnter={playHoverSound}
      data-node-id={nodeID}
      animate={{ 
        opacity: isSelected ? 1 : (hasActiveSelection ? 0.2 : 1), 
        scale: isSelected ? 1.15 : (hasActiveSelection ? 0.9 : 1),
        filter: (hasActiveSelection && !isSelected) ? "blur(4px) grayscale(50%)" : "blur(0px) grayscale(0%)",
        y: [0, -5, 0],
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
      className={`group relative p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all pointer-events-auto min-h-[115px] w-full ${isSelected ? 'z-50' : 'z-20'}`}
    >
      {/* === CLOUD SHAPE (SVG) === */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center scale-110">
        <svg
          viewBox="0 0 225 100"
          className="w-full h-full drop-shadow-[0_10px_20px_rgba(34,211,238,0.2)]"
          preserveAspectRatio="xMidYMid meet"
        >
          <motion.path
            d={cloudPath}
            fill="rgba(8, 47, 73, 0.7)"
            stroke="rgba(34, 211, 238, 0.4)"
            strokeWidth="1.5"
            className="group-hover:fill-sky-950/80 group-hover:stroke-cyan-300 transition-all duration-500"
            animate={isSelected ? { 
              strokeWidth: [1.5, 2.5, 1.5],
              stroke: ["rgba(34, 211, 238, 0.4)", "rgba(34, 211, 238, 1)", "rgba(34, 211, 238, 0.4)"]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </svg>
      </div>

      {/* Internal Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-500/5 blur-[30px] rounded-full pointer-events-none group-hover:bg-cyan-400/15 transition-colors duration-1000" />

      {/* Word and Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full w-full pointer-events-none translate-y-[6px] px-8 text-center">
        <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] group-hover:text-cyan-50 transition-colors leading-tight whitespace-pre-line max-w-[140px]">
          {word}
        </span>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1 opacity-20 group-hover:opacity-60 transition-opacity pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-0.5 h-0.5 rounded-full bg-cyan-400" />
        ))}
      </div>
    </motion.div>
  );
};
