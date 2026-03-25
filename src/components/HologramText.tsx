"use client";

import { motion, AnimatePresence } from "framer-motion";

interface HologramTextProps {
  word: string;
  isVisible: boolean;
}

export const HologramText = ({ word, isVisible }: HologramTextProps) => {
  const lines = word.split('\n');

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
          className="absolute z-50 pointer-events-none text-center flex flex-col items-center justify-center translate-y-[-10%]"
        >
          <div className="relative flex flex-col items-center">
            {/* Texto com Sombra (Shadow) mantida */}
            {lines.map((line, idx) => (
              <span
                key={idx}
                className={`uppercase tracking-[0.25em] text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,1)] mix-blend-screen italic whitespace-nowrap
                  ${idx === 0 ? 'text-2xl md:text-5xl font-black' : 'text-xs md:text-lg font-medium mt-1 opacity-90'}
                `}
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                {line}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
