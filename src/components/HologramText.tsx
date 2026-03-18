"use client";

import { motion, AnimatePresence } from "framer-motion";

interface HologramTextProps {
  word: string;
  isVisible: boolean;
}

export const HologramText = ({ word, isVisible }: HologramTextProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{
            opacity: [0, 1, 0.8, 1],
            scale: 1,
            y: 0,
            x: [0, -2, 2, 0], // Pequeno glitch visual
          }}
          exit={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
          className="absolute z-50 pointer-events-none text-center"
        >
          <div className="relative">
            <span
              className="text-2xl md:text-5xl font-black uppercase tracking-[0.25em] text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.9)] mix-blend-screen italic whitespace-pre-line"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              {word}
            </span>
            
            {/* Linhas de scan do holograma (Tailwind v4 style) */}
            <div 
              className="absolute inset-0 bg-linear-to-b from-transparent via-cyan-400/20 to-transparent bg-size-[100%_4px] opacity-30 animate-pulse pointer-events-none" 
            />
            
            {/* Aura de fundo ciano para profundidade */}
            <div className="absolute inset-0 -z-10 bg-cyan-500/5 blur-2xl rounded-full" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
