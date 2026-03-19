"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ParticlesBackground } from "../components/ParticlesBackground";
import { BlockchainHUD } from "../components/blockchain/BlockchainHUD";
import { IntroStep } from "../components/blockchain/IntroStep";
import { FeatureStep } from "../components/blockchain/FeatureStep";
import { TopologyStep } from "../components/blockchain/TopologyStep";
import { AnalysisStep } from "../components/blockchain/AnalysisStep";
import { SloganStep } from "../components/blockchain/SloganStep";
import { ecosystemPlatforms } from "../constants/blockchainData";

interface BlockchainSolutionProps {
  onBack: () => void;
}

export const BlockchainSolution = ({ onBack }: BlockchainSolutionProps) => {
  const [step, setStep] = useState(1);
  const [showConnections, setShowConnections] = useState(false);
  const lastScrollTime = useRef(0);
  const totalSteps = 12;

  // Gerenciador de Scroll para a Timeline Vertical
  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastScrollTime.current < 1200) return;

      if (e.deltaY > 0) {
        if (step < totalSteps) {
          setStep(prev => prev + 1);
          lastScrollTime.current = now;
        } else {
          onBack(); // Scroll final volta para o dashboard
        }
      } else if (e.deltaY < 0) {
        if (step > 1) {
          setStep(prev => prev - 1);
          lastScrollTime.current = now;
        }
      }
    };

    window.addEventListener("wheel", handleScroll);
    return () => window.removeEventListener("wheel", handleScroll);
  }, [step, onBack]);

  // Gatilho para animações de rede no step 7
  useEffect(() => {
    if (step === 7) {
      const timer = setTimeout(() => setShowConnections(true), 1200);
      return () => clearTimeout(timer);
    } else {
      setShowConnections(false);
    }
  }, [step]);

  return (
    <section className="relative h-screen w-full bg-[#050505] overflow-hidden">
      {/* Background Dinâmico */}
      <div className="absolute inset-0 z-0">
        <ParticlesBackground />
      </div>

      {/* Grid de Dados de Fundo (Sutil) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: "linear-gradient(#f59e0b 0.5px, transparent 0.5px), linear-gradient(90deg, #f59e0b 0.5px, transparent 0.5px)", backgroundSize: "100px 100px" }} 
      />

      {/* Camada de Gradiente de Profundidade */}
      {step > 1 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-radial-at-c from-amber-500/5 via-transparent to-transparent z-0"
        />
      )}

      <BlockchainHUD step={step} totalSteps={totalSteps} onBack={onBack} />

      <div className="relative z-10 w-full max-w-7xl flex items-center justify-center h-full px-12 mx-auto">
        <AnimatePresence mode="wait">
          {(step === 1 || step === 2) && <IntroStep step={step} />}
          {(step >= 3 && step <= 6) && <FeatureStep step={step} />}
          {step === 7 && <TopologyStep showConnections={showConnections} />}
          {(step >= 8 && step <= 11) && <AnalysisStep step={step} />}
          {step === 12 && <SloganStep onBack={onBack} />}
        </AnimatePresence>
      </div>

      {/* Scanner Visual (Efeito de HUD) */}
      <motion.div 
        animate={{ y: ["0%", "100%", "0%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 w-full h-px bg-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.5)] z-20 pointer-events-none"
      />
    </section>
  );
};
