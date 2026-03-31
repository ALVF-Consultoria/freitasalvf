"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { b2bContent } from "../constants/b2bData";
import { ArrowLeft, ExternalLink, Database } from "lucide-react";
import { useStepNavigation } from "../hooks/useStepNavigation";
import { ParticlesBackground } from "../components/ParticlesBackground";
import { ScrollIndicator } from "../components/common/ScrollIndicator";
import { useMobile } from "@/hooks/useMobile";
import { MobileScrollWrapper } from "../components/blockchain/MobileScrollWrapper";

interface B2BSolutionProps {
  onBack: () => void;
}

export const B2BSolution = ({ onBack }: B2BSolutionProps) => {
  const isMobile = useMobile();
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  useStepNavigation({
    onNext: () => setStep((prev) => (prev < totalSteps ? prev + 1 : prev)),
    onPrev: () => setStep((prev) => (prev > 1 ? prev - 1 : prev)),
    cooldown: 1200,
  });

  useEffect(() => {
    if (step === totalSteps) {
      setTimeout(onBack, 1000);
    }
  }, [step, onBack]);

  return (
    <section className={`relative h-screen w-full bg-[#050505] overflow-hidden flex items-center justify-center ${isMobile ? 'p-6 pt-20' : 'p-12'}`}>
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <ParticlesBackground />
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Philosophy */}
        {step === 1 && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -50, filter: "blur(10px)" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-5xl text-center flex flex-col items-center gap-6 md:gap-12"
          >
            <span className="text-emerald-500 font-mono text-[10px] md:text-xs tracking-[0.5em] md:tracking-[0.8em] uppercase opacity-40">
              PRIMEIRA DIRETRIZ
            </span>
            <h2 className="text-xl md:text-5xl font-serif italic text-white leading-tight px-4 md:px-0">
              &quot;{b2bContent.philosophy.phrase}&quot;
            </h2>
            <div className="flex flex-col items-center gap-4">
               <div className="w-12 h-px bg-emerald-500/50" />
               <p className="text-white/30 font-mono text-[9px] md:text-[10px] uppercase tracking-widest italic">VISÃO ESTRATÉGICA ATIVADA</p>
            </div>
          </motion.div>
        )}

        {/* Step 2-4: Pillars */}
        {[0, 1, 2].map((i) => step === i + 2 && (
          <motion.div
            key={`step-pillar-${i}`}
            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center text-center max-w-4xl"
          >
            <MobileScrollWrapper accentColor="#10b981">
              <div className="flex flex-col items-center py-10 md:py-0">
                <div className="relative mb-6 md:mb-12">
                   <span className="text-6xl md:text-[120px] font-black text-white/3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mono">
                     0{i + 1}
                   </span>
                   <span className="relative z-10 text-emerald-500 font-mono text-[10px] md:text-xs tracking-[0.5em] md:tracking-[1em] uppercase block">
                     PILAR ESTRATÉGICO
                   </span>
                </div>
                <h3 className="text-4xl md:text-8xl font-black uppercase tracking-tighter mb-6 md:mb-8 bg-linear-to-b from-white to-white/20 bg-clip-text text-transparent leading-none">
                  {b2bContent.pillars[i].title}
                </h3>
                <p className="text-base md:text-2xl text-white/50 font-light leading-relaxed max-w-2xl px-4 md:px-0">
                  {b2bContent.pillars[i].description}
                </p>
                <div className="mt-6 md:mt-12 p-3 px-6 border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-3xl rounded-full">
                  <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-[0.4em]">{b2bContent.pillars[i].metric}</span>
                </div>
              </div>
            </MobileScrollWrapper>
          </motion.div>
        ))}

        {/* Step 5: Finale - Call to Action */}
        {step === 5 && (
          <motion.div
            key="step-5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, filter: "blur(20px)" }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center gap-10 md:gap-16 text-center w-full max-w-4xl px-4"
          >
            <div className="flex flex-col items-center">
              <motion.div 
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                className="w-16 h-16 md:w-24 md:h-24 mb-6 md:mb-12 border border-emerald-500/30 flex items-center justify-center rounded-xl md:rounded-2xl bg-emerald-500/5 shadow-[0_0_80px_rgba(16,185,129,0.1)]"
              >
                <Database className="w-8 h-8 md:w-12 md:h-12 text-emerald-400" />
              </motion.div>
              <h2 className="text-3xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-4">
                ALVF <span className="text-emerald-500">CONSULTORIA</span>
              </h2>
              <p className="text-white/40 font-mono text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.5em] mb-8 md:mb-12">NÚCLEO DE ALTO IMPACTO TECNOLÓGICO</p>
            </div>

            <motion.a
              href={b2bContent.consultancy.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(16,185,129,0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center gap-4 md:gap-8 py-4 md:py-6 px-8 md:px-12 border-2 border-emerald-500 rounded-full bg-emerald-500 text-black font-black text-sm md:text-lg uppercase tracking-widest transition-all"
            >
              Acessar Consultoria
              <ExternalLink className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-45 transition-transform" />
            </motion.a>

            <motion.p 
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-[9px] md:text-[10px] text-white/20 font-mono uppercase tracking-[0.5em] md:tracking-[0.8em] mt-6 md:mt-8"
            >
              DESLIZE PARA FINALIZAR CONEXÃO
            </motion.p>
          </motion.div>
        )}

        {/* Step 6: Return Transition (Black screen) */}
        {step === 6 && (
          <motion.div 
            key="step-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black z-100 flex flex-col items-center justify-center gap-6"
          >
            <div className="w-24 h-px bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-emerald-500 font-mono animate-pulse uppercase tracking-[1em]">DESCONECTADO</span>
          </motion.div>
        )}
      </AnimatePresence>

      {(step === 1 && !isMobile) && <ScrollIndicator />}

      {/* Progress Indicator */}
      <div className={`absolute ${isMobile ? 'right-4' : 'left-12'} top-1/2 -translate-y-1/2 flex flex-col gap-3 md:gap-4 pointer-events-none`}>
        {[1, 2, 3, 4, 5].map((s) => (
          <div 
            key={s} 
            className={`w-1 rounded-full transition-all duration-500 ${step === s ? 'bg-emerald-500 h-10 md:h-16 shadow-[0_0_15px_rgba(16,185,129,0.8)]' : 'bg-white/10 h-6 md:h-8'}`}
          />
        ))}
      </div>

      {/* Manual Back */}
      <div className={`absolute ${isMobile ? 'top-6 left-6' : 'top-12 left-12'} z-50`}>
        <motion.button 
          onClick={onBack}
          whileHover={{ x: -10 }}
          className="flex items-center gap-3 md:gap-4 text-white/20 hover:text-white transition-all font-mono text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold"
        >
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
          FECHAR
        </motion.button>
      </div>
    </section>
  );
};
