"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface StorytellingTransitionProps {
  onComplete: () => void;
}

export const StorytellingTransition = ({ onComplete }: StorytellingTransitionProps) => {
  const [phase, setPhase] = useState<"scanning" | "decrypted" | "exit">("scanning");

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase("decrypted"), 1500);
    const timer2 = setTimeout(() => setPhase("exit"), 4000);
    const timer3 = setTimeout(onComplete, 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#050505] flex items-center justify-center overflow-hidden font-mono">
      {/* Background Grid - Tactical Star Map */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />

      <div className="relative w-full max-w-4xl px-12 flex flex-col items-start gap-8">
        {/* Progress Bar (Top) */}
        <div className="w-full h-[2px] bg-white/5 relative overflow-hidden">
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: phase === "scanning" ? "0%" : "100%" }}
            transition={{ duration: 1.5, ease: "linear" }}
            className="absolute inset-y-0 w-1/2 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]"
          />
        </div>

        <div className="flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-white/40 text-[10px] uppercase tracking-[0.5em]"
          >
            Accessing Sector 04 // Storytelling Archive
          </motion.div>

          {/* Typewriter Title */}
          <motion.h1 
            className="text-4xl md:text-6xl text-white font-serif italic tracking-tight"
          >
            {phase === "scanning" ? "Iniciando Transmissão..." : "Crônicas do Almirante"}
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-1 h-12 bg-blue-500 ml-2 align-middle"
            />
          </motion.h1>
        </div>

        {/* Data Fragments */}
        <AnimatePresence>
          {phase === "decrypted" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-2 border-l border-blue-500/30 pl-6 py-2"
            >
              <div className="text-blue-400/60 text-[10px] uppercase tracking-[0.3em]">
                Stardate: 2026.074
              </div>
              <div className="text-white/20 text-[9px] uppercase tracking-widest leading-relaxed max-w-xs">
                Localizando frequências de narrativa...<br />
                Sincronizando jornadas digitais...<br />
                Vínculo estabelecido.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cinematic Flash (Exit) */}
      <AnimatePresence>
        {phase === "exit" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-white z-50"
            transition={{ duration: 1 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
