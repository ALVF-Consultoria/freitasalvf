"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SvgAnimation } from "../SvgAnimation";

interface LoadingCurtainProps {
  onComplete: () => void;
}

export const LoadingCurtain = ({ onComplete }: LoadingCurtainProps) => {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsFinished(true), 500);
          return 100;
        }
        return prev + Math.random() * 15; // Velocidade aleatória para realismo
      });
    }, 200);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isFinished) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1200); // Duração da animação da cortina
      return () => clearTimeout(timer);
    }
  }, [isFinished, onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <div className="fixed inset-0 z-100 flex items-center justify-center pointer-events-none">
          {/* Lado Esquerdo da Cortina */}
          <motion.div 
            initial={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
            className="absolute inset-y-0 left-0 w-1/2 bg-[linear-gradient(to_right,#2a2a2a,#1a1a1a)]"
          />
          {/* Lado Direito da Cortina */}
          <motion.div 
            initial={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
            className="absolute inset-y-0 right-0 w-1/2 bg-[linear-gradient(to_left,#2a2a2a,#1a1a1a)]"
          />

          {/* Conteúdo Central (Brain + Loader) */}
          <motion.div 
            exit={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
            transition={{ duration: 0.5 }}
            className="relative z-10 flex flex-col items-center gap-12"
          >
            {/* Brain Thumbnail */}
            <div className="w-32 h-32 md:w-48 md:h-48">
              <SvgAnimation isFrenetic={false} />
            </div>

            {/* Barra de Progresso do Centro para Cantos */}
            <div className="relative w-64 md:w-96 h-px overflow-hidden">
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: progress / 100 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-blue-500 origin-center shadow-[0_0_15px_rgba(59,130,246,0.8)]"
              />
            </div>

            {/* Texto de Status */}
            <div className="flex flex-col items-center gap-4">
              <span className="text-xs md:text-sm font-mono text-blue-400 tracking-[0.6em] uppercase animate-pulse">
                Sincronizando Módulos
              </span>
              <span className="text-[10px] md:text-xs font-mono text-white/40 tracking-widest uppercase">
                {Math.round(progress)}%
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
