"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { educationContent } from "../constants/educationData";
import { useStepNavigation } from "../hooks/useStepNavigation";
import { ArrowLeft, Cpu, Bot, Mic, Link as LinkIcon, LineChart, Wifi, GraduationCap, UserCheck, Search } from "lucide-react";
import { ParticlesBackground } from "../components/ParticlesBackground";
import { ScrollIndicator } from "../components/common/ScrollIndicator";
import { useMobile } from "@/hooks/useMobile";
import { MobileScrollWrapper } from "../components/blockchain/MobileScrollWrapper";

interface EducationSolutionProps {
  onBack: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  Bot, Cpu, Mic, Link: LinkIcon, LineChart, Wifi, GraduationCap, UserCheck, Search
};

export const EducationSolution = ({ onBack }: EducationSolutionProps) => {
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
    <section className={`relative h-screen w-full bg-[#050505] overflow-hidden flex items-center justify-center p-6 md:p-12`}>
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <ParticlesBackground />
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: The Inflexion Point */}
        {step === 1 && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, x: -50, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: 50, filter: "blur(10px)" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`max-w-5xl text-left flex flex-col gap-8 items-center ${isMobile ? 'pt-12' : ''}`}
          >
            <MobileScrollWrapper>
              <div className="w-full py-4">
                <div className="flex items-center gap-4">
                   <span className="w-8 md:w-12 h-[2px] bg-indigo-500" />
                   <span className="font-mono text-[9px] md:text-xs text-indigo-400 tracking-[0.6em] uppercase">O PONTO DE INFLEXÃO</span>
                </div>
                <h2 className="text-2xl md:text-6xl font-serif italic text-white leading-tight mt-6 md:mt-8">
                  &quot;{educationContent.philosophy.phrase}&quot;
                </h2>
                <div className="flex items-center gap-4 md:gap-6 mt-8 md:mt-12">
                   <div className="flex flex-col">
                      <span className="text-2xl md:text-3xl font-black text-white">30+ ANOS</span>
                      <span className="text-[9px] md:text-[10px] font-mono text-white/30 uppercase tracking-widest">DE JORNADA TÉCNICA</span>
                   </div>
                   <div className="w-px h-8 md:h-12 bg-white/10" />
                   <p className="text-white/40 font-mono text-[8px] md:text-[10px] uppercase tracking-[0.3em]">CADA SUCESSO GEROU UMA AULA.</p>
                </div>
              </div>
            </MobileScrollWrapper>
          </motion.div>
        )}

        {/* Step 2: The Expertise Matrix */}
        {step === 2 && (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            className={`flex flex-col items-center gap-8 md:gap-16 w-full max-w-6xl ${isMobile ? 'pt-12' : ''}`}
          >
            <MobileScrollWrapper>
              <div className="flex flex-col items-center gap-8 md:gap-16 py-4">
                <h3 className="text-3xl md:text-7xl font-black text-white uppercase tracking-tighter text-center">
                  MATRIZ DE <span className="text-indigo-500 italic">DOMÍNIO</span>
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-6 w-full">
                   {educationContent.expertise.map((exp, i) => {
                     const Icon = iconMap[exp.icon];
                     return (
                       <motion.div
                         key={exp.id}
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: i * 0.05 }}
                         className="flex flex-col items-center gap-4 md:gap-6 p-4 md:p-8 border border-white/5 bg-white/5 group hover:border-indigo-500/30 transition-all cursor-default"
                       >
                         <div className="p-3 md:p-4 rounded-xl bg-white/5 group-hover:bg-indigo-500/20 transition-all">
                           <Icon className="w-6 h-6 md:w-8 md:h-8 text-white/40 group-hover:text-indigo-400" />
                         </div>
                         <span className="text-[8px] md:text-[10px] font-mono text-white/30 uppercase tracking-widest group-hover:text-white transition-colors text-center">{exp.title}</span>
                       </motion.div>
                     );
                   })}
                </div>
              </div>
            </MobileScrollWrapper>
          </motion.div>
        )}

        {/* Step 3-5: Educational Pillars */}
        {[0, 1, 2].map((i) => step === i + 3 && (
          <motion.div
            key={`pillar-${i}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className={`flex flex-col items-center text-center max-w-4xl px-4 ${isMobile ? 'pt-12' : ''}`}
          >
            <MobileScrollWrapper>
              <div className="flex flex-col items-center text-center py-4">
                <div className="mb-4 md:mb-8 p-4 md:p-6 rounded-3xl bg-indigo-500/10 border border-indigo-500/20">
                   {i === 0 && <UserCheck className="w-8 h-8 md:w-12 md:h-12 text-indigo-400" />}
                   {i === 1 && <Search className="w-8 h-8 md:w-12 md:h-12 text-indigo-400" />}
                   {i === 2 && <GraduationCap className="w-8 h-8 md:w-12 md:h-12 text-indigo-400" />}
                </div>
                <span className="text-indigo-500 font-mono text-[9px] md:text-xs tracking-[0.5em] md:tracking-[1em] uppercase block mb-4">MÓDULO EDUCACIONAL 0{i+1}</span>
                <h3 className="text-3xl md:text-8xl font-black text-white uppercase tracking-tighter mb-4 md:mb-8 leading-none">
                  {educationContent.categories[i].title}
                </h3>
                <p className="text-base md:text-2xl text-white/50 font-light leading-relaxed max-w-2xl px-2">
                  {educationContent.categories[i].description}
                </p>
                <div className="mt-8 md:mt-12 h-px w-24 md:w-32 bg-indigo-500/30" />
                <p className="mt-6 md:mt-8 text-[9px] md:text-xs text-indigo-400 font-mono uppercase tracking-[0.3em] md:tracking-[0.4em]">{educationContent.categories[i].detail}</p>
              </div>
            </MobileScrollWrapper>
          </motion.div>
        ))}

        {/* Step 6: End Transition */}
        {step === 6 && (
          <motion.div 
            key="step-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black z-100 flex flex-col items-center justify-center gap-6"
          >
            <div className="w-24 h-px bg-indigo-500 animate-pulse" />
            <span className="text-[10px] text-indigo-500 font-mono animate-pulse uppercase tracking-[1em]">DESCONECTADO</span>
          </motion.div>
        )}
      </AnimatePresence>

      {(step === 1 && !isMobile) && <ScrollIndicator />}

      {/* Progress Indicator */}
      <div className={`absolute ${isMobile ? 'right-4 top-1/2' : 'right-12 top-1/2'} -translate-y-1/2 flex flex-col gap-2 md:gap-4 pointer-events-none`}>
        {[1, 2, 3, 4, 5].map((s) => (
          <div 
            key={s} 
            className={`w-1 transition-all duration-500 ${step === s ? 'bg-indigo-500 h-8 md:h-16 shadow-[0_0_15px_rgba(99,102,241,0.8)]' : 'bg-white/10 h-4 md:h-8'}`}
          />
        ))}
      </div>

      {/* Manual Back */}
      <div className={`absolute ${isMobile ? 'top-6 left-6' : 'top-12 left-12'} z-50`}>
        <motion.button 
          onClick={onBack}
          whileHover={{ x: -10 }}
          className="flex items-center gap-3 md:gap-4 text-white/20 hover:text-white transition-all font-mono text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold"
        >
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
          FECHAR
        </motion.button>
      </div>
    </section>
  );
};
