"use client";

import { motion } from "framer-motion";

interface DashboardNodeNaiaProps {
  word: string;
  visualIndex: number;
  isSelected?: boolean;
  hasActiveSelection?: boolean;
  onSelect?: (e: React.MouseEvent) => void;
}

export const DashboardNodeNaia = ({ 
  word, 
  visualIndex, 
  isSelected = false, 
  hasActiveSelection = false, 
  onSelect 
}: DashboardNodeNaiaProps) => {
  const playHoverSound = () => {
    const audio = new Audio("/audios/transition-efect.mp3");
    audio.volume = 0.3;
    audio.play().catch(e => console.log("Audio play prevented:", e));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      onMouseEnter={playHoverSound}
      animate={{ 
        opacity: isSelected ? 1 : (hasActiveSelection ? 0.2 : 1), 
        scale: isSelected ? 1.15 : (hasActiveSelection ? 0.9 : 1),
        filter: (hasActiveSelection && !isSelected) ? "blur(4px) grayscale(50%)" : "blur(0px) grayscale(0%)",
        transition: { 
          duration: 0.5, 
          delay: isSelected ? 0 : visualIndex * 0.1,
          ease: "easeOut"
        } 
      }}
      whileHover={!hasActiveSelection ? { 
        scale: 1.05, 
        boxShadow: "0 0 40px rgba(34,211,238,0.15)",
        transition: { duration: 0.2, delay: 0 }
      } : {}}
      onClick={onSelect}
      className={`group relative p-8 rounded-2xl border border-cyan-400/20 bg-cyan-950/20 backdrop-blur-xl flex flex-col items-center justify-center text-center cursor-pointer min-h-[220px] transition-all overflow-hidden ${isSelected ? 'z-50 shadow-[0_0_60px_rgba(34,211,238,0.3)] border-cyan-400/60' : 'z-10'}`}
    >
      {/* === BACKGROUND DECOR: GRID SUTIL === */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: "radial-gradient(circle, #22d3ee 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

      {/* === ANIMAÇÃO DE BORDA HUD (CONFORME IMAGEM) === */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <path d="M 0 20 L 0 0 L 20 0" fill="none" stroke="#22d3ee" strokeWidth="2" className="opacity-40 group-hover:opacity-100 transition-opacity" />
        <path d="M 100% 20 L 100% 0 L calc(100% - 20px) 0" fill="none" stroke="#22d3ee" strokeWidth="2" className="opacity-40 group-hover:opacity-100 transition-opacity" />
        
        <motion.rect
          x="2"
          y="2"
          width="calc(100% - 4px)"
          height="calc(100% - 4px)"
          rx="14"
          fill="none"
          stroke="#22d3ee"
          strokeWidth="1"
          strokeDasharray="50 150"
          animate={{ strokeDashoffset: [0, -200] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="opacity-30 group-hover:opacity-100"
        />
      </svg>

      {/* === MICRO-DADOS TÉCNICOS VISUAIS === */}
      <div className="absolute bottom-4 right-6 flex items-end gap-0.5 h-6 opacity-30 group-hover:opacity-80 transition-opacity">
        {[20, 60, 40, 80, 50].map((h, i) => (
          <motion.div 
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ duration: 1, delay: i * 0.1, repeat: Infinity, repeatType: 'reverse' }}
            className="w-1 bg-cyan-400 rounded-t-sm"
          />
        ))}
      </div>
      
      {/* Word Content - Centralizado precisely */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full w-full pointer-events-none translate-y-[6px] px-8 text-center">
        <span className="text-sm md:text-base font-black uppercase tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] group-hover:scale-105 transition-transform duration-300 whitespace-pre-line max-w-[160px]">
          {word}
        </span>
      </div>
    </motion.div>
  );
};
