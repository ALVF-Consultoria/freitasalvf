"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useStepNavigation } from "../hooks/useStepNavigation";
import { ParticlesBackground } from "./ParticlesBackground";

interface AITransitionProps {
  onComplete: () => void;
}

export const AITransition = ({ onComplete }: AITransitionProps) => {
  const [step, setStep] = useState(1);

  useStepNavigation({
    onNext: () => {
      if (step < 2) setStep((prev) => prev + 1);
      else onComplete();
    },
    onPrev: () => setStep((prev) => (prev > 1 ? prev - 1 : prev)),
    cooldown: 1500,
  });

  return (
    <div className="relative min-h-screen w-full bg-[#050505] flex items-center justify-center overflow-hidden px-10">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <ParticlesBackground />
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="quote-step"
            initial={{ opacity: 0, scale: 0.5, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.5, filter: "blur(30px)" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative z-10 max-w-4xl text-center"
          >
            <span className="text-cyan-400 font-mono text-[10px] tracking-[0.5em] uppercase mb-8 block opacity-50">
              INTERFACE AUTÔNOMA_ATIVADA
            </span>
            <h2 className="text-2xl md:text-4xl font-light text-white leading-relaxed tracking-tight italic">
              &quot;Indo muito além das limitadas IAs <span className="text-cyan-400/50">(pseudo inteligência artificial)</span>, nossa <span className="text-cyan-400 font-bold">Interface Autônoma</span>, gera integração da necessidade com as soluções.&quot;
            </h2>
            
            <div className="mt-12 flex flex-col items-center gap-6">
              <motion.div
                animate={{ opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex flex-col items-center gap-2"
              >
                <span className="text-[10px] font-mono text-cyan-400/60 uppercase tracking-[0.3em]">DESLIZE_PARA_INICIAR</span>
                <div className="w-px h-12 bg-linear-to-b from-cyan-400/50 to-transparent" />
              </motion.div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="branding-step"
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.2, filter: "blur(20px)" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center text-center"
          >
            <span className="text-cyan-400 font-mono text-xs tracking-[0.6em] uppercase mb-4 opacity-70">
              AGENTE INTELIGENTE
            </span>
            <h3 className="text-6xl md:text-9xl font-black text-white uppercase tracking-tighter drop-shadow-[0_0_30px_rgba(34,211,238,0.6)]">
              NA<span className="text-cyan-400 text-glow">IA</span>
            </h3>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-4 text-cyan-400/80 font-mono text-sm md:text-xl tracking-[0.3em] uppercase italic"
            >
              Nano Agente Interface Autônoma
            </motion.p>
            
            <div className="mt-20 flex flex-col items-center gap-6">
              <motion.div
                animate={{ opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex flex-col items-center gap-2"
              >
                <span className="text-[10px] font-mono text-cyan-400/60 uppercase tracking-[0.3em]">DESLIZE_PARA_ACESSAR</span>
                <div className="w-px h-16 bg-linear-to-b from-cyan-400/50 to-transparent" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scanline Effect */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-cyan-400/3 to-transparent bg-size-[100%_4px] pointer-events-none" />
    </div>
  );
};
