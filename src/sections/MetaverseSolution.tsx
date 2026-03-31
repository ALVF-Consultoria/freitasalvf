"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useStepNavigation } from "../hooks/useStepNavigation";
import { DeepSpace } from "@/components/blockchain/DeepSpace";
import { YoutubeBackground } from "@/components/common/YoutubeBackground";
import { metaverseChapters } from "../constants/metaverseData";
import { ArrowLeft } from "lucide-react";
import { ScrollIndicator } from "../components/common/ScrollIndicator";
import { useMobile } from "@/hooks/useMobile";
import { MobileScrollWrapper } from "../components/blockchain/MobileScrollWrapper";

interface MetaverseSolutionProps {
  onBack: () => void;
}

export const MetaverseSolution = ({ onBack }: MetaverseSolutionProps) => {
  const isMobile = useMobile();
  const [activeChapter, setActiveChapter] = useState(0);
  const [step, setStep] = useState(1);
  const totalSteps = metaverseChapters.length;

  useStepNavigation({
    onNext: () => {
      if (step < totalSteps) {
        setStep((prev) => prev + 1);
        setActiveChapter((prev) => prev + 1);
      } else {
        onBack();
      }
    },
    onPrev: () => {
      if (step > 1) {
        setStep((prev) => prev - 1);
        setActiveChapter((prev) => prev - 1);
      }
    },
    cooldown: 800,
  });

  const current = metaverseChapters[activeChapter];

  return (
    <section className="relative h-screen w-full bg-black overflow-hidden font-mono selection:bg-blue-500/30">
      <YoutubeBackground videoId="jfJdIk1hbyY" start={70} overlayOpacity={0.6} />

      <DeepSpace transparent={true} />

      {/* Cinematic Overlays */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
      
      {/* HUD Borders (Star Atlas Style) */}
      <div className={`absolute ${isMobile ? 'inset-4' : 'inset-8'} border border-blue-500/10 pointer-events-none rounded-lg`}>
        <div className={`absolute top-0 left-10 ${isMobile ? 'w-20' : 'w-40'} h-px bg-blue-500/40`} />
        <div className={`absolute bottom-0 right-10 ${isMobile ? 'w-20' : 'w-40'} h-px bg-blue-500/40`} />
        <div className={`absolute top-10 left-0 w-px ${isMobile ? 'h-10' : 'h-20'} bg-blue-500/40`} />
        <div className={`absolute bottom-10 right-0 w-px ${isMobile ? 'h-10' : 'h-20'} bg-blue-500/40`} />
      </div>

      {/* TOPBAR - Minimalist Return */}
      <div className={`absolute ${isMobile ? 'top-6 left-6' : 'top-8 left-8'} z-50`}>
        <motion.button 
          onClick={onBack}
          whileHover={{ opacity: 1, x: 5 }}
          className="flex items-center gap-3 text-white/30 hover:text-white transition-all group"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold">FECHAR</span>
        </motion.button>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="relative w-full h-full flex flex-col items-center justify-center pt-10 md:pt-20 px-6">
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
            className="flex flex-col items-center gap-6 md:gap-12 max-w-5xl w-full px-4 md:px-12"
          >
            <MobileScrollWrapper accentColor="#3b82f6" maxHeight="80vh">
              <div className="flex flex-col items-center gap-6 md:gap-12 py-10 md:py-0">
                {/* Title Section */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } }
                  }}
                  className="flex flex-col items-center text-center gap-2 md:gap-4"
                >
                  <span className="text-blue-400 text-[8px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.5em] opacity-60">
                    {current.subtitle}
                  </span>
                  <h2 className="text-3xl md:text-7xl font-black uppercase tracking-tighter text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] leading-tight">
                    {current.title}
                  </h2>
                </motion.div>

                {/* Impact Quote Area */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, scale: 0.95 },
                    visible: { opacity: 1, scale: 1, transition: { duration: 1.2, ease: "easeOut" } }
                  }}
                  className="w-full max-w-3xl p-px bg-linear-to-r from-transparent via-blue-500/20 to-transparent"
                >
                   <div className="bg-black/40 backdrop-blur-3xl p-4 md:p-8 py-6 md:py-10 border-x border-blue-500/20">
                      <p className="text-sm md:text-xl font-light text-blue-100 text-center leading-relaxed italic uppercase tracking-tight px-2 md:px-0">
                        &quot;{current.impact}&quot;
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
                  <p className="text-white text-[12px] md:text-base leading-relaxed uppercase font-light tracking-[0.2em] px-2 md:px-0">
                    {current.description}
                  </p>
                </motion.div>
              </div>
            </MobileScrollWrapper>
          </motion.div>
        </AnimatePresence>
 
        {(activeChapter === 0 && !isMobile) && <ScrollIndicator />}
      </div>

      {/* Progress Dots - Minimalist */}
      <div className={`absolute ${isMobile ? 'bottom-8' : 'bottom-12'} left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 pointer-events-none`}>
        {metaverseChapters.map((_, i) => (
          <motion.div 
            key={i} 
            animate={{ scale: step === i + 1 ? 1.2 : 1, opacity: step === i + 1 ? 1 : 0.2 }}
            className={`h-1.5 ${isMobile ? 'w-8' : 'w-12'} rounded-full ${step === i + 1 ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-white'}`} 
          />
        ))}
      </div>
    </section>
  );
};
