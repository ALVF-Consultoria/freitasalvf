"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface MetaverseTransitionProps {
  onComplete: () => void;
}

export const MetaverseTransition = ({ onComplete }: MetaverseTransitionProps) => {
  const [phase, setPhase] = useState<"idle" | "charge" | "warp" | "exit">("idle");

  useEffect(() => {
    const sequence = async () => {
      setPhase("charge");
      await new Promise(resolve => setTimeout(resolve, 800));
      setPhase("warp");
      await new Promise(resolve => setTimeout(resolve, 1500));
      setPhase("exit");
      await new Promise(resolve => setTimeout(resolve, 500));
      onComplete();
    };
    sequence();
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden">
      {/* Star Streaks (Warp) */}
      {phase === "warp" && (
        <div className="absolute inset-0">
          {Array.from({ length: 100 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scaleX: 0, x: 0, opacity: 0 }}
              animate={{ 
                scaleX: [0, 40, 0], 
                x: [0, (Math.random() - 0.5) * 2000],
                y: (Math.random() - 0.5) * 1000,
                opacity: [0, 1, 0]
              }}
              transition={{ duration: 1, repeat: Infinity, delay: Math.random() }}
              className="absolute h-px w-20 bg-blue-400/60 blur-[1px]"
              style={{ left: "50%", top: "50%" }}
            />
          ))}
        </div>
      )}

      {/* Charging Pulse */}
      <AnimatePresence>
        {phase === "charge" && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 0.8], opacity: [0, 1, 0.5] }}
            exit={{ scale: 10, opacity: 0 }}
            transition={{ duration: 0.8, ease: "circIn" }}
            className="w-40 h-40 rounded-full border-2 border-cyan-500 shadow-[0_0_50px_rgba(34,211,238,0.8)] flex items-center justify-center"
          >
             <div className="w-10 h-10 bg-white rounded-full animate-ping" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Warp Flash */}
      {phase === "warp" && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 0.2, repeat: Infinity }}
          className="absolute inset-0 bg-white"
        />
      )}

      {/* Destination Portal Reveal */}
      {phase === "exit" && (
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 15, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-40 h-40 bg-blue-400 rounded-full blur-3xl"
        />
      )}

      <div className="absolute bottom-12 text-blue-400/20 font-mono text-[10px] tracking-[1.5em] uppercase animate-pulse">
        CARREGANDO
      </div>
    </div>
  );
};

import { AnimatePresence } from "framer-motion";
