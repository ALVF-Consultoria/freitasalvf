"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useStepNavigation } from "../hooks/useStepNavigation";
import { DeepSpace } from "@/components/blockchain/DeepSpace";
import { YoutubeBackground } from "@/components/common/YoutubeBackground";
import { storytellingLogs } from "../constants/storytellingData";
import { ArrowLeft, Youtube, Compass } from "lucide-react";
import { ScrollIndicator } from "../components/common/ScrollIndicator";
import { useMobile } from "@/hooks/useMobile";
import { MobileScrollWrapper } from "../components/blockchain/MobileScrollWrapper";

interface StorytellingSolutionProps {
  onBack: () => void;
}

export const StorytellingSolution = ({ onBack }: StorytellingSolutionProps) => {
  const isMobile = useMobile();
  const [activeLog, setActiveLog] = useState(0);
  const [step, setStep] = useState(1);
  const totalSteps = storytellingLogs.length;

  useStepNavigation({
    onNext: () => {
      if (step < totalSteps) {
        setStep((prev) => prev + 1);
        setActiveLog((prev) => prev + 1);
      } else {
        onBack();
      }
    },
    onPrev: () => {
      if (step > 1) {
        setStep((prev) => prev - 1);
        setActiveLog((prev) => prev - 1);
      }
    },
    cooldown: 1000,
  });

  const current = storytellingLogs[activeLog];

  return (
    <section className="relative h-screen w-full bg-[#050505] overflow-hidden selection:bg-blue-500/30">
      {/* Background: Subtle DeepSpace */}
      <DeepSpace transparent={true} />
      
      {/* Tactical Overlay Grid */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
        style={{ backgroundImage: 'linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)', backgroundSize: '100px 100px' }} 
      />

      {/* Cinematic Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.9)_100%)]" />

      {/* 1. LEFT SIDEBAR - Tactical Metrics */}
      <div className={`absolute left-0 top-0 bottom-0 ${isMobile ? 'w-12' : 'w-32'} border-r border-white/5 flex flex-col items-center py-8 md:py-12 gap-8 z-50 bg-black/20 backdrop-blur-md`}>
        <motion.button 
          onClick={onBack}
          whileHover={{ scale: 1.1, color: "#fff" }}
          className="text-white/20 transition-all flex flex-col items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
          <span className="text-[8px] md:text-[10px] font-mono uppercase tracking-widest leading-none">FECHAR</span>
        </motion.button>

        <div className="flex flex-col gap-8 md:gap-12 items-center flex-1">
          {storytellingLogs.map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <motion.div 
                animate={{ 
                  height: step === i + 1 ? (isMobile ? 24 : 40) : 4,
                  backgroundColor: step === i + 1 ? "#3b82f6" : "rgba(255,255,255,0.1)"
                }}
                className="w-[2px] rounded-full transition-all duration-500"
              />
              <span className={`text-[8px] font-mono tracking-widest ${step === i + 1 ? 'text-blue-400' : 'text-white/10'}`}>0{i+1}</span>
            </div>
          ))}
        </div>

        {!isMobile && (
          <div className="rotate-90 origin-center text-[8px] font-mono tracking-[1em] text-white/10 uppercase whitespace-nowrap">
            SISTEMA DE RASTREAMENTO ESTELAR v1.4
          </div>
        )}
      </div>

      {/* 2. MAIN GRID LAYOUT */}
      <div className={`${isMobile ? 'ml-12' : 'ml-32 md:mr-24'} h-full w-full grid grid-cols-12 relative overflow-hidden pr-4`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeLog}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="col-span-12 h-full flex flex-col items-center"
          >
            <MobileScrollWrapper accentColor="#3b82f6" maxHeight="90vh">
              <div className="flex flex-col items-center gap-12 md:gap-24 py-16 md:py-20 pb-32">
                {/* TEXT CONTENT */}
                <div className={`flex flex-col justify-center ${isMobile ? 'px-8' : 'px-20'} gap-8 md:gap-12 z-10 relative`}>
                  <motion.h2 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 1.2 }}
                    className="text-2xl md:text-5xl font-serif italic text-white leading-tight max-w-2xl"
                  >
                    {current.subject}
                  </motion.h2>

                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1.5 }}
                    className="max-w-xl p-6 md:p-8 border border-white/5 bg-white/2 backdrop-blur-3xl rounded-br-[30px] md:rounded-br-[60px]"
                  >
                    <p className="text-base md:text-2xl font-light text-white/80 leading-relaxed tracking-tight italic border-l-2 border-blue-500/20 pl-4 md:pl-6">
                      &quot;{current.content}&quot;
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    transition={{ delay: 1.5 }}
                    className="flex flex-col gap-1"
                  >
                    <span className="text-xs md:text-lg font-mono text-blue-400/80 font-bold tracking-wider uppercase">{current.insight}</span>
                  </motion.div>
                </div>

                {/* VISUAL CONTENT */}
                <div className={`w-full relative flex items-center justify-center ${isMobile ? 'px-8' : 'px-20'}`}>
                   <motion.div
                     initial={{ opacity: 0, scale: 0.9, x: isMobile ? 0 : 50 }}
                     animate={{ opacity: 1, scale: 1, x: 0 }}
                     transition={{ delay: 0.8, duration: 2, ease: "easeOut" }}
                     className="relative w-full aspect-video group"
                   >
                      {/* Cinematic Frame */}
                      <div className="absolute -inset-2 md:-inset-4 border border-white/5 rounded-lg opacity-50 pointer-events-none" />
                      <div className="absolute inset-0 border border-blue-500/20 rounded-md overflow-hidden bg-black/40 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                        {current.videoId ? (
                          <YoutubeBackground 
                            videoId={current.videoId} 
                            start={current.start} 
                            end={current.end} 
                            speed={current.speed} 
                            overlayOpacity={0.3} 
                          />
                        ) : current.image ? (
                          <div className="w-full h-full relative">
                            <img 
                              src={current.image} 
                              alt={current.subject} 
                              className="w-full h-full object-cover opacity-80" 
                            />
                            <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay" />
                          </div>
                        ) : (
                          <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent)] flex items-center justify-center">
                            <Compass className="w-12 h-12 md:w-20 md:h-20 text-blue-500/20 animate-pulse" />
                          </div>
                        )}
                      </div>

                      {/* Contextual UI Elements */}
                      <div className="absolute top-4 right-4 flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <div className="w-2 h-2 rounded-full bg-white/10" />
                      </div>

                      {current.youtubeUrl && (
                        <motion.a
                          href={current.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`absolute ${isMobile ? 'bottom-6 right-6 px-4 py-2 text-[8px]' : 'bottom-8 right-8 px-6 py-3 text-[10px]'} bg-red-600/90 text-white font-bold uppercase tracking-widest rounded-full flex items-center gap-2 md:gap-3 shadow-2xl backdrop-blur-md transition-all z-10`}
                        >
                          <Youtube className="w-3 h-3 md:w-4 md:h-4" />
                          Explorar Arquivo
                        </motion.a>
                      )}
                   </motion.div>

                   {/* Decorative Lines */}
                   {!isMobile && (
                     <>
                       <div className="absolute right-0 top-1/4 h-px w-64 bg-linear-to-l from-blue-500/20 to-transparent" />
                       <div className="absolute right-12 bottom-1/4 w-px h-64 bg-linear-to-t from-blue-500/20 to-transparent" />
                     </>
                   )}
                </div>
              </div>
            </MobileScrollWrapper>
          </motion.div>
        </AnimatePresence>
      </div>
      {(activeLog === 0 && !isMobile) && <ScrollIndicator />}
    </section>
  );
};
