"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Database, TrendingUp, ShieldCheck } from "lucide-react";
import { ParticlesBackground } from "./ParticlesBackground";
import { b2bContent } from "../constants/b2bData";

interface B2BTransitionProps {
  onComplete: () => void;
}

export const B2BTransition = ({ onComplete }: B2BTransitionProps) => {
  const [step, setStep] = useState(1);
  const lastScrollTime = useRef(0);

  useEffect(() => {
    if (step === 3) {
      onComplete();
    }
  }, [step, onComplete]);

  useEffect(() => {
    const handleNavigation = (direction: "next" | "prev") => {
      const now = Date.now();
      if (now - lastScrollTime.current > 1500) {
        setStep((prev) => {
          if (direction === "next" && prev < 3) return prev + 1;
          if (direction === "prev" && prev > 1) return prev - 1;
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
  }, [step]);

  return (
    <div className="fixed inset-0 z-100 bg-[#020617] flex items-center justify-center overflow-hidden px-10">
      <ParticlesBackground />

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="philosophy-step"
            initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.2, filter: "blur(30px)" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative z-10 max-w-4xl text-center"
          >
            <span className="text-emerald-500 font-mono text-[10px] tracking-[0.5em] uppercase mb-8 block opacity-50">
              ESTRATÉGIA_B2B_ATIVADA
            </span>
            <h2 className="text-2xl md:text-5xl font-serif italic text-white leading-tight tracking-tight">
              "{b2bContent.philosophy.phrase}"
            </h2>
            
            <div className="mt-12 flex flex-col items-center gap-6">
              <motion.div
                animate={{ opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex flex-col items-center gap-2"
              >
                <span className="text-[10px] font-mono text-emerald-400/60 uppercase tracking-[0.3em]">SCROLL_TO_SYNCHRONIZE</span>
                <div className="w-px h-12 bg-linear-to-b from-emerald-400/50 to-transparent" />
              </motion.div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="branding-step"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center text-center"
          >
            <div className="relative mb-12">
               <motion.div
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
                 className="w-24 h-24 rounded-3xl border-2 border-emerald-500 flex items-center justify-center bg-emerald-500/10 shadow-[0_0_50px_rgba(16,185,129,0.3)]"
               >
                 <Database className="w-10 h-10 text-emerald-400" />
               </motion.div>
               <div className="absolute -inset-4 border border-emerald-500/20 rounded-full animate-pulse" />
            </div>

            <span className="text-emerald-500 font-mono text-xs tracking-[0.6em] uppercase mb-4 opacity-70">
              CONSULTORIA DE TI
            </span>
            <h3 className="text-6xl md:text-9xl font-black text-white uppercase tracking-tighter">
              ALVF <span className="text-emerald-500 text-glow-emerald">CONSULTORIA</span>
            </h3>
            
            <div className="mt-20 flex flex-col items-center gap-6">
              <motion.div
                animate={{ opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex flex-col items-center gap-2"
              >
                <span className="text-[10px] font-mono text-emerald-400/60 uppercase tracking-[0.3em]">SCROLL_TO_ENTER_HUB</span>
                <div className="w-px h-16 bg-linear-to-b from-emerald-400/50 to-transparent" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scanline Effect */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-emerald-400/3 to-transparent bg-size-[100%_4px] pointer-events-none" />
    </div>
  );
};
