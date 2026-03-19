"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { heritageContent } from "../constants/heritageData";
import { ArrowLeft } from "lucide-react";
import { ParticlesBackground } from "../components/ParticlesBackground";
import { ScrollIndicator } from "../components/common/ScrollIndicator";

interface HeritageSolutionProps {
  onBack: () => void;
}

export const HeritageSolution = ({ onBack }: HeritageSolutionProps) => {
  const [viewMode, setViewMode] = useState<"macro" | "zooming" | "detail">("macro");
  const [step, setStep] = useState(0);
  const lastScrollTime = useRef(0);
  const totalEvents = heritageContent.timeline.length;
  const totalSteps = totalEvents + 2; // Pillars + Timeline + Skills

  useEffect(() => {
    if (viewMode === "macro") {
      const timer = setTimeout(() => {
        setViewMode("zooming");
        setTimeout(() => setViewMode("detail"), 1500);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [viewMode]);

  useEffect(() => {
    const handleNavigation = (direction: "next" | "prev") => {
      if (viewMode !== "detail") return;
      const now = Date.now();
      if (now - lastScrollTime.current > 1200) {
        setStep((prev) => {
          if (direction === "next") {
            if (prev === totalSteps - 1) {
              onBack();
              return prev;
            }
            return prev + 1;
          }
          if (direction === "prev" && prev > 0) return prev - 1;
          return prev;
        });
        lastScrollTime.current = now;
      }
    };

    const handleScroll = (e: WheelEvent) => {
      if (e.deltaY > 0) handleNavigation("next");
      else if (e.deltaY < 0) handleNavigation("prev");
    };

    window.addEventListener("wheel", handleScroll);
    return () => window.removeEventListener("wheel", handleScroll);
  }, [viewMode, totalSteps, onBack]);

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
              scale: viewMode === "macro" ? 1 : 4,
              x: viewMode === "macro" ? 0 : "40%",
              filter: viewMode === "macro" ? "blur(0px)" : "blur(10px)"
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 flex flex-col items-center justify-center z-50 pointer-events-none"
          >
            <div className="relative w-full max-w-5xl h-px bg-amber-500/30 flex items-center justify-between">
              {heritageContent.timeline.map((event, i) => (
                <motion.div
                  key={event.year}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center gap-4 relative"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-500 shadow-[0_0_30px_rgba(245,158,11,1)]" />
                  <span className="absolute top-10 font-mono text-xl text-amber-500 rotate-45 origin-left font-bold">{event.year}</span>
                </motion.div>
              ))}
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "linear" }}
                className="absolute left-0 top-0 h-px bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
              />
            </div>
            <motion.h2 className="mt-32 text-amber-500 font-mono text-xs tracking-[1em] uppercase opacity-40">
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
                  className="w-full h-full flex flex-col items-center justify-center"
                >
                  <div className="w-full max-w-7xl px-12 grid grid-cols-1 md:grid-cols-2 gap-12">
                    {heritageContent.pillars.map((pillar, i) => (
                      <motion.div 
                        key={pillar.title}
                        initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-8 border border-amber-500/10 bg-amber-500/5 backdrop-blur-3xl"
                      >
                        <h4 className="text-amber-500 font-mono text-[10px] mb-4 uppercase">PILAR_CENTRAL_0{i+1}</h4>
                        <h3 className="text-3xl font-black text-white uppercase mb-4">{pillar.title}</h3>
                        <p className="text-white/50 text-sm font-light leading-relaxed">{pillar.description}</p>
                      </motion.div>
                    ))}
                  </div>
                  <ScrollIndicator />
                </motion.div>
              )}

              {/* Narrative Steps */}
              {heritageContent.timeline.map((event, i) => step === i + 1 && (
                <motion.div
                  key={`timeline-${event.year}`}
                  initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: -50, filter: "blur(10px)" }}
                  className="flex flex-col items-center text-center max-w-4xl px-12"
                >
                  <div className="relative mb-12">
                     <span className="text-[500px] font-black text-white/2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mono select-none pointer-events-none tracking-tighter leading-none">
                       {event.year}
                     </span>
                     <span className="relative z-10 text-amber-500 font-mono text-xs tracking-[1em] uppercase block">
                       {event.tag}
                     </span>
                  </div>
                  <h3 className="text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter mb-8">{event.title}</h3>
                  <p className="text-xl lg:text-2xl text-white/50 font-light leading-relaxed max-w-2xl italic">"{event.description}"</p>
                </motion.div>
              ))}

              {step === totalEvents + 1 && (
                <motion.div
                  key="skills-step"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center gap-12"
                >
                  <div className="flex flex-col items-center gap-6">
                    <span className="text-xl text-amber-500 font-mono uppercase tracking-[1em] font-bold">MATRIZ TÉCNICA</span>
                    <div className="w-32 h-px bg-amber-500 animate-pulse" />
                  </div>
                  <div className="max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-8 px-12">
                     {heritageContent.skills.map((skill) => (
                       <div key={skill} className="py-8 px-10 border-2 border-white/10 bg-white/5 backdrop-blur-3xl text-xl font-mono text-white/70 uppercase text-center tracking-widest hover:border-amber-500/50 hover:bg-amber-500/10 hover:text-white transition-all shadow-2xl">
                         {skill}
                       </div>
                     ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-12 left-12 z-100">
        <motion.button 
          onClick={onBack}
          whileHover={{ x: -10 }}
          className="flex items-center gap-4 text-white/20 hover:text-white transition-all font-mono text-[10px] uppercase font-bold"
        >
          <ArrowLeft className="w-5 h-5" />
          Fechar Arquivos
        </motion.button>
      </div>

      {viewMode === "detail" && (
        <div className="absolute left-12 top-1/2 -translate-y-1/2 flex flex-col gap-3">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className={`w-px transition-all duration-700 ${step === i ? 'bg-amber-500 h-12' : 'bg-white/10 h-6'}`} />
          ))}
        </div>
      )}
    </section>
  );
};
