"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useStepNavigation } from "../hooks/useStepNavigation";
import { History } from "lucide-react";
import { ParticlesBackground } from "./ParticlesBackground";

interface HeritageTransitionProps {
  onComplete: () => void;
}

export const HeritageTransition = ({ onComplete }: HeritageTransitionProps) => {
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
    <div className="fixed inset-0 z-100 bg-[#050505] flex items-center justify-center overflow-hidden px-10">
      <ParticlesBackground />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-600/5 blur-[120px] rounded-full pointer-events-none" />

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="heritage-intro"
            initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -50, filter: "blur(30px)" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative z-10 max-w-4xl text-center"
          >
            <span className="text-amber-500 font-mono text-[10px] tracking-[0.5em] uppercase mb-8 block opacity-40">
              ARQUIVO HISTÓRICO ATIVADO
            </span>
            <h2 className="text-3xl md:text-5xl font-serif italic text-white leading-relaxed tracking-tight">
               &quot;Há mais de 30 anos transformando tecnologia em valor, da mecanografia ao Blockchain.&quot;
            </h2>
            
            <div className="mt-12 flex flex-col items-center gap-6">
              <motion.div
                animate={{ opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-px h-12 bg-linear-to-b from-amber-400/50 to-transparent" />
                <span className="text-[10px] font-mono text-amber-400/60 uppercase tracking-[0.3em]">DESLIZE_PARA_RECAPITULAR</span>
              </motion.div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="heritage-branding"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.2, filter: "blur(20px)" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center text-center"
          >
            <div className="relative mb-12">
               <motion.div
                 initial={{ scale: 0, rotate: -90 }}
                 animate={{ scale: 1, rotate: 0 }}
                 className="w-24 h-24 rounded-full border border-amber-500/30 flex items-center justify-center bg-amber-500/5 shadow-[0_0_50px_rgba(245,158,11,0.2)]"
               >
                 <History className="w-10 h-10 text-amber-400" />
               </motion.div>
            </div>

            <span className="text-amber-500 font-mono text-xs tracking-[1em] uppercase mb-4 opacity-70">
              ESTEVE LÁ, FEZ ACONTECER
            </span>
            <h3 className="text-6xl md:text-9xl font-black text-white uppercase tracking-tighter">
              + DE 30 ANOS <br /><span className="text-amber-500 text-glow-amber">LEGADO</span>
            </h3>
            
            <div className="mt-16 flex flex-col items-center gap-6">
              <motion.div
                animate={{ opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-px h-16 bg-linear-to-b from-amber-400/50 to-transparent" />
                <span className="text-[10px] font-mono text-amber-400/60 uppercase tracking-[0.3em]">ACESSAR_LINHA_DO_TEMPO</span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 bg-linear-to-b from-transparent via-amber-900/5 to-transparent bg-size-[100%_4px] pointer-events-none opacity-20" />
    </div>
  );
};
