"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useStepNavigation } from "../hooks/useStepNavigation";
import { BookOpen } from "lucide-react";
import { ParticlesBackground } from "./ParticlesBackground";
import { educationContent } from "../constants/educationData";

interface EducationTransitionProps {
  onComplete: () => void;
}

export const EducationTransition = ({ onComplete }: EducationTransitionProps) => {
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

      {/* Decorative Indigo Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="philosophy-step"
            initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(30px)" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative z-10 max-w-4xl text-center"
          >
            <span className="text-indigo-400 font-mono text-[10px] tracking-[0.5em] uppercase mb-8 block opacity-40">
              {educationContent.philosophy.heritage}
            </span>
            <h2 className="text-2xl md:text-4xl font-serif italic text-white leading-relaxed tracking-tight">
               &quot;{educationContent.philosophy.phrase}&quot;
            </h2>
            
            <div className="mt-12 flex flex-col items-center gap-6">
              <motion.div
                animate={{ opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-px h-12 bg-linear-to-b from-indigo-400/50 to-transparent" />
                <span className="text-[10px] font-mono text-indigo-400/60 uppercase tracking-[0.3em]">DESLIZE_PARA_ACESSAR</span>
              </motion.div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="branding-step"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.2, filter: "blur(20px)" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center text-center"
          >
            <div className="relative mb-12">
               <motion.div
                 initial={{ scale: 0, rotate: -45 }}
                 animate={{ scale: 1, rotate: 0 }}
                 className="w-24 h-24 rounded-full border border-indigo-500/30 flex items-center justify-center bg-indigo-500/5 shadow-[0_0_50px_rgba(99,102,241,0.2)]"
               >
                 <BookOpen className="w-10 h-10 text-indigo-400" />
               </motion.div>
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                 className="absolute -inset-4 border border-indigo-500/10 rounded-full border-dashed" 
               />
            </div>

            <span className="text-indigo-400 font-mono text-xs tracking-[1em] uppercase mb-4 opacity-70">
              PONTO DE INFLEXÃO
            </span>
            <h3 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter">
              EDUCAÇÃO<br /><span className="text-indigo-500">& CURADORIA</span>
            </h3>
            
            <div className="mt-16 flex flex-col items-center gap-6">
              <motion.div
                animate={{ opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-px h-16 bg-linear-to-b from-indigo-400/50 to-transparent" />
                <span className="text-[10px] font-mono text-indigo-400/60 uppercase tracking-[0.3em]">INICIAR_TRANSFERENCIA</span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Particles Mask */}
      <div className="absolute inset-0 bg-radial-to-c from-transparent via-transparent to-[#050505] pointer-events-none" />
    </div>
  );
};
