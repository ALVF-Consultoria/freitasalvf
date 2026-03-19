"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { DeepSpace } from "@/components/blockchain/DeepSpace";
import { YoutubeBackground } from "@/components/common/YoutubeBackground";
import { metaverseChapters } from "../constants/metaverseData";
import { ArrowLeft, Target, Cpu, Activity, Globe } from "lucide-react";
import { ScrollIndicator } from "../components/common/ScrollIndicator";

interface MetaverseSolutionProps {
  onBack: () => void;
}

export const MetaverseSolution = ({ onBack }: MetaverseSolutionProps) => {
  const [activeChapter, setActiveChapter] = useState(0);
  const totalSteps = metaverseChapters.length;
  const [step, setStep] = useState(1);
  const lastScrollTime = useRef(0);
  const stepRef = useRef(1);

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  useEffect(() => {
    const handleNavigation = (direction: "next" | "prev") => {
      const now = Date.now();
      if (now - lastScrollTime.current > 800) {
        if (direction === "next") {
          if (stepRef.current < totalSteps) {
            setStep((prev) => prev + 1);
            setActiveChapter((prev) => (prev + 1));
          } else {
            onBack();
          }
        } else if (direction === "prev" && stepRef.current > 1) {
          setStep((prev) => prev - 1);
          setActiveChapter((prev) => (prev - 1));
        }
        lastScrollTime.current = now;
      }
    };

    const handleScroll = (e: WheelEvent) => {
      if (e.deltaY > 0) handleNavigation("next");
      else if (e.deltaY < 0) handleNavigation("prev");
    };

    window.addEventListener("wheel", handleScroll);
    return () => window.removeEventListener("wheel", handleScroll);
  }, [onBack, totalSteps]);

  const current = metaverseChapters[activeChapter];

  return (
    <section className="relative h-screen w-full bg-black overflow-hidden font-mono selection:bg-blue-500/30">
      <YoutubeBackground videoId="jfJdIk1hbyY" start={70} overlayOpacity={0.6} />

      <DeepSpace transparent={true} />

      {/* Cinematic Overlays */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
      
      {/* HUD Borders (Star Atlas Style) */}
      <div className="absolute inset-8 border border-blue-500/10 pointer-events-none rounded-lg">
        <div className="absolute top-0 left-10 w-40 h-px bg-blue-500/40" />
        <div className="absolute bottom-0 right-10 w-40 h-px bg-blue-500/40" />
        <div className="absolute top-10 left-0 w-px h-20 bg-blue-500/40" />
        <div className="absolute bottom-10 right-0 w-px h-20 bg-blue-500/40" />
      </div>

      {/* TOPBAR - Minimalist Return */}
      <div className="absolute top-8 left-8 z-50">
        <motion.button 
          onClick={onBack}
          whileHover={{ opacity: 1, x: 5 }}
          className="flex items-center gap-3 text-white/30 hover:text-white transition-all group"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold">FECHAR</span>
        </motion.button>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="relative w-full h-full flex flex-col items-center justify-center pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeChapter}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              hidden: { opacity: 0 },
              visible: { 
                opacity: 1,
                transition: { staggerChildren: 0.4, delayChildren: 0.2 }
              },
              exit: { 
                opacity: 0, 
                y: -20, 
                transition: { duration: 0.5 } 
              }
            }}
            className="flex flex-col items-center gap-12 max-w-5xl w-full px-12"
          >
            {/* Title Section */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } }
              }}
              className="flex flex-col items-center text-center gap-4"
            >
              <span className="text-blue-400 text-[10px] uppercase tracking-[0.5em] opacity-60">
                {current.subtitle}
              </span>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                {current.title}
              </h2>
            </motion.div>

            {/* Impact Quote Area */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1, transition: { duration: 1.2, ease: "easeOut" } }
              }}
              className="w-full max-w-3xl p-1 bg-linear-to-r from-transparent via-blue-500/10 to-transparent"
            >
               <div className="bg-black/40 backdrop-blur-3xl p-8 py-10 border-x border-blue-500/20">
                  <p className="text-lg md:text-xl font-light text-blue-100 text-center leading-relaxed italic uppercase tracking-tight">
                    "{current.impact}"
                  </p>
               </div>
            </motion.div>

            {/* Description only */}
            <motion.div 
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 0.6, transition: { duration: 1.5 } }
              }}
              className="w-full max-w-2xl text-center"
            >
              <p className="text-white text-sm md:text-base leading-relaxed uppercase font-light tracking-[0.2em]">
                {current.description}
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
 
        {activeChapter === 0 && <ScrollIndicator />}
      </div>

      {/* Progress Dots - Minimalist */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 pointer-events-none">
        {metaverseChapters.map((_, i) => (
          <motion.div 
            key={i} 
            animate={{ scale: step === i + 1 ? 1.2 : 1, opacity: step === i + 1 ? 1 : 0.2 }}
            className={`h-1.5 w-12 rounded-full ${step === i + 1 ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-white'}`} 
          />
        ))}
      </div>
    </section>
  );
};
