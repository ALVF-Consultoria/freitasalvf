"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { heritageContent } from "../constants/heritageData";
import { ArrowLeft } from "lucide-react";
import { useStepNavigation } from "../hooks/useStepNavigation";
import { ParticlesBackground } from "../components/ParticlesBackground";
import { ScrollIndicator } from "../components/common/ScrollIndicator";
import { useMobile } from "@/hooks/useMobile";
import { MobileScrollWrapper } from "../components/blockchain/MobileScrollWrapper";

interface HeritageSolutionProps {
  onBack: () => void;
}

export const HeritageSolution = ({ onBack }: HeritageSolutionProps) => {
  const isMobile = useMobile();
  const [viewMode, setViewMode] = useState<"macro" | "zooming" | "detail">("macro");
  const [step, setStep] = useState(0);
  const totalEvents = heritageContent.timeline.length;
  const totalSteps = totalEvents + 3;

  useStepNavigation({
    onNext: () => {
      if (step === totalSteps - 1) onBack();
      else setStep((prev) => prev + 1);
    },
    onPrev: () => setStep((prev) => (prev > 0 ? prev - 1 : prev)),
    cooldown: 1200,
    enabled: viewMode === "detail"
  });

  useEffect(() => {
    if (viewMode === "macro") {
      const timer = setTimeout(() => {
        setViewMode("zooming");
        setTimeout(() => setViewMode("detail"), 1500);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [viewMode]);

  return (
    <section className="relative h-screen w-full bg-[#050505] overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <ParticlesBackground />
      </div>

      <AnimatePresence>
        {(viewMode === "macro" || viewMode === "zooming") && (
          <motion.div
            key="macro-timeline"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: viewMode === "macro" ? 1 : (isMobile ? 2.5 : 4),
              x: viewMode === "macro" ? 0 : (isMobile ? "20%" : "40%"),
              filter: viewMode === "macro" ? "blur(0px)" : "blur(10px)"
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 flex flex-col items-center justify-center z-50 pointer-events-none p-6"
          >
            <div className={`relative w-full max-w-5xl h-px bg-amber-500/30 flex items-center justify-between`}>
              {heritageContent.timeline.map((event, i) => (
                <motion.div
                  key={event.year}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center gap-4 relative"
                >
                  <div className={`w-3 h-3 md:w-6 md:h-6 rounded-full bg-amber-500 shadow-[0_0_30px_rgba(245,158,11,1)]`} />
                  <span className={`absolute top-6 md:top-10 font-mono text-lg md:text-xl text-amber-500 rotate-45 origin-left font-bold`}>{event.year}</span>
                </motion.div>
              ))}
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "linear" }}
                className="absolute left-0 top-0 h-px bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
              />
            </div>
            <motion.h2 className={`mt-32 md:mt-40 text-amber-500 font-mono text-[8px] md:text-xs tracking-[0.5em] md:tracking-[1em] uppercase opacity-40 text-center`}>
              PROJETANDO_JORNADA_30_ANOS
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {viewMode === "detail" && (
          <motion.div
            key="detail-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full flex items-center justify-center relative"
          >
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="pillars-step"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, y: -50 }}
                  className="w-full h-full flex flex-col items-center justify-center p-6"
                >
                  <MobileScrollWrapper>
                    <div className="w-full max-w-7xl px-4 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 py-10 md:py-0">
                      {heritageContent.pillars.map((pillar, i) => (
                        <motion.div 
                          key={pillar.title}
                          initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-6 md:p-8 border border-amber-500/10 bg-amber-500/5 backdrop-blur-3xl"
                        >
                          <h4 className="text-amber-500 font-mono text-[8px] md:text-[10px] mb-2 md:mb-4 uppercase tracking-widest">PILAR_CENTRAL_0{i+1}</h4>
                          <h3 className="text-xl md:text-3xl font-black text-white uppercase mb-2 md:mb-4">{pillar.title}</h3>
                          <p className="text-white/50 text-[12px] md:text-sm font-light leading-relaxed">{pillar.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  </MobileScrollWrapper>
                  {!isMobile && <ScrollIndicator />}
                </motion.div>
              )}

              {/* Narrative Steps */}
              {heritageContent.timeline.map((event, i) => step === i + 1 && (
                <motion.div
                  key={`timeline-${event.year}`}
                  initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: -50, filter: "blur(10px)" }}
                  className={`flex flex-col items-center text-center max-w-4xl px-8 md:px-12 ${isMobile ? 'pt-12' : ''}`}
                >
                  <MobileScrollWrapper>
                    <div className="flex flex-col items-center py-6">
                      <div className="relative mb-6 md:mb-12">
                         <span className="text-[120px] md:text-[500px] font-black text-white/2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mono select-none pointer-events-none tracking-tighter leading-none">
                           {event.year}
                         </span>
                         <span className="relative z-10 text-amber-500 font-mono text-[8px] md:text-xs tracking-[0.5em] md:tracking-[1em] uppercase block">
                           {event.tag}
                         </span>
                      </div>
                      <h3 className="text-3xl md:text-7xl font-black text-white uppercase tracking-tighter mb-4 md:mb-8">{event.title}</h3>
                      <p className="text-sm md:text-2xl text-white/50 font-light leading-relaxed max-w-2xl italic px-2 md:px-0">&quot;{event.description}&quot;</p>
                    </div>
                  </MobileScrollWrapper>
                </motion.div>
              ))}

              {step === totalEvents + 1 && (
                <motion.div
                  key="skills-step"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`flex flex-col items-center justify-center gap-8 md:gap-12 w-full p-6 ${isMobile ? 'pt-16' : ''}`}
                >
                  <MobileScrollWrapper maxHeight="70vh">
                    <div className="flex flex-col items-center gap-8 md:gap-12 py-6">
                      <div className="flex flex-col items-center gap-4 md:gap-6">
                        <span className="text-sm md:text-xl text-amber-500 font-mono uppercase tracking-[0.5em] md:tracking-[1em] font-bold text-center">MATRIZ TÉCNICA</span>
                        <div className="w-24 md:w-32 h-px bg-amber-500 animate-pulse" />
                      </div>
                      <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-12">
                         {heritageContent.skills.map((skill) => (
                           <div key={skill} className="py-4 md:py-8 px-6 md:px-10 border border-white/10 bg-white/5 backdrop-blur-3xl text-sm md:text-xl font-mono text-white/70 uppercase text-center tracking-widest hover:border-amber-500/50 hover:bg-amber-500/10 hover:text-white transition-all">
                             {skill}
                           </div>
                         ))}
                      </div>
                    </div>
                  </MobileScrollWrapper>
                </motion.div>
              )}

              {step === totalEvents + 2 && (
                <motion.div
                  key="linkedin-step"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  className="flex flex-col items-center justify-center gap-8 md:gap-12 p-6"
                >
                  <div className="flex flex-col items-center gap-4 md:gap-6">
                    <span className="text-sm md:text-xl text-amber-500 font-mono uppercase tracking-[0.5em] md:tracking-[1em] font-bold text-center">LEGADO DIGITAL</span>
                    <div className="w-32 md:w-48 h-px bg-amber-500/50" />
                  </div>

                  <motion.a
                    href="https://www.linkedin.com/in/alvf01/"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group flex flex-col md:flex-row items-center gap-6 md:gap-8 py-8 md:py-10 px-8 md:px-16 border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/20 transition-all cursor-pointer shadow-[0_0_100px_rgba(245,158,11,0.1)] rounded-sm"
                  >
                    <div className="flex flex-col items-center md:items-start text-center md:text-left transition-all">
                      <span className="text-amber-500 font-mono text-[10px] md:text-xs uppercase tracking-[0.5em] font-bold mb-2">CONSTRUA SEU FUTURO</span>
                      <span className="text-3xl md:text-6xl font-black text-white italic tracking-tighter uppercase group-hover:text-amber-400">CONECTE-SE</span>
                    </div>
                    <div className="w-16 h-16 md:w-20 md:h-20 border-2 border-amber-500/30 flex items-center justify-center rounded-full group-hover:border-amber-400 group-hover:shadow-[0_0_50px_rgba(245,158,11,0.3)] transition-all">
                      <svg viewBox="0 0 24 24" className="w-8 h-8 md:w-10 md:h-10 fill-amber-500 group-hover:fill-amber-400 transition-colors" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </div>
                  </motion.a>

                  <p className="text-white/20 font-mono text-[8px] md:text-[10px] uppercase tracking-widest mt-4 md:mt-8">SCROLL PARA CONCLUIR JORNADA</p>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>

      <div className={`absolute ${isMobile ? 'top-6 left-6' : 'top-12 left-12'} z-100`}>
        <motion.button 
          onClick={onBack}
          whileHover={{ x: -10 }}
          className="flex items-center gap-3 md:gap-4 text-white/20 hover:text-white transition-all font-mono text-[9px] md:text-[10px] uppercase font-bold"
        >
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
          Fechar Arquivos
        </motion.button>
      </div>

      {viewMode === "detail" && (
        <div className={`absolute ${isMobile ? 'right-4' : 'left-12'} top-1/2 -translate-y-1/2 flex flex-col gap-2 md:gap-3`}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className={`w-1 md:w-px transition-all duration-700 ${step === i ? 'bg-amber-500 h-8 md:h-12 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-white/10 h-4 md:h-6'}`} />
          ))}
        </div>
      )}
    </section>
  );
};
