"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useStepNavigation } from "../hooks/useStepNavigation";
import { ParticlesBackground } from "../components/ParticlesBackground";
import { BlockchainHUD } from "../components/blockchain/BlockchainHUD";
import { IntroStep } from "../components/blockchain/IntroStep";
import { FeatureStep } from "../components/blockchain/FeatureStep";
import { TopologyStep } from "../components/blockchain/TopologyStep";
import { AnalysisStep } from "../components/blockchain/AnalysisStep";
import { SloganStep } from "../components/blockchain/SloganStep";
import { SolanaStep } from "../components/blockchain/SolanaStep";

interface BlockchainSolutionProps {
  onBack: () => void;
}

export const BlockchainSolution = ({ onBack }: BlockchainSolutionProps) => {
  const [step, setStep] = useState(1);
  const [showConnections, setShowConnections] = useState(false);
  const totalSteps = 15;

  useStepNavigation({
    onNext: () => {
      if (step < totalSteps) setStep((prev) => prev + 1);
      else onBack();
    },
    onPrev: () => setStep((prev) => (prev > 1 ? prev - 1 : prev)),
    cooldown: 1200,
  });

  // Gatilho para animações de rede no step 7
  useEffect(() => {
    if (step === 7) {
      const timer = setTimeout(() => setShowConnections(true), 1200);
      return () => {
        clearTimeout(timer);
        setShowConnections(false);
      };
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
          {(step >= 12 && step <= 14) && <SolanaStep step={step} />}
          {step === 15 && <SloganStep />}
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
