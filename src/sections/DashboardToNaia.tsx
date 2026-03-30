"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardNodeNaia } from "../components/DashboardNodeNaia";
import { ParticlesBackground } from "../components/ParticlesBackground";
import { ArrowLeft } from "lucide-react";

interface DashboardToNaiaProps {
  onNavigateToNaiaStorytelling?: () => void;
  onNavigateToNaiaAvaliativa?: () => void;
  onBack?: () => void;
}

export const DashboardToNaia = ({ 
  onNavigateToNaiaStorytelling, 
  onNavigateToNaiaAvaliativa, 
  onBack 
}: DashboardToNaiaProps) => {
  const [activeNodeNumber, setActiveNodeNumber] = useState<number | null>(null);
  const [showComingSoon, setShowComingSoon] = useState(false);

  const toggleNode = (e: React.MouseEvent, num: number) => {
    e.stopPropagation();
    setActiveNodeNumber((prev) => (prev === num ? null : num));
  };

  const playEnterSound = () => {
    const audio = new Audio("/audios/enter-effect.mp3");
    audio.volume = 0.4;
    audio.play().catch(e => console.log("Audio play prevented:", e));
  };

  return (
    <section
      id="dashboard-naia"
      className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#050505] py-10 px-8 overflow-hidden"
      onClick={() => {
        if (!showComingSoon) setActiveNodeNumber(null);
      }}
    >
      {/* Sistema de Partículas Ambiente */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <ParticlesBackground />
      </div>
      
      {/* Botão de Voltar */}
      <button 
        onClick={onBack}
        className="absolute top-10 left-10 z-50 flex items-center gap-2 text-cyan-400/60 hover:text-cyan-400 transition-colors group px-4 py-2 rounded-full border border-cyan-400/20 bg-cyan-950/20 backdrop-blur-md"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-mono uppercase tracking-widest">Voltar ao HUB</span>
      </button>

      {/* Luzes de fundo para ambientação */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-600/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Núcleo Central Pulsante (Sutil) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/5 blur-[80px] rounded-full animate-pulse pointer-events-none" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="max-w-7xl w-full z-10"
      >

        {/* Container Holográfico Mestre (Estilo HUD Imersiva) */}
        <div className="relative p-16 md:p-28 rounded-[40px] z-10 group/container max-w-5xl w-full mx-auto">

          {/* 1. Camada de Brilho de Fundo Sutil */}
          <div className="absolute inset-0 bg-blue-500/5 rounded-[40px] blur-sm -z-10" />

          {/* 2. Moldura HUD Mestra (Bordas Duplas e Glow) */}
          <div className="absolute inset-0 rounded-[40px] border-2 border-cyan-400/30 shadow-[0_0_20px_rgba(34,211,238,0.2)] pointer-events-none" />
          <div className="absolute inset-[-4px] rounded-[44px] border border-cyan-400/10 pointer-events-none" />

          {/* Cantos Reforçados e Segmentados */}
          <div className="absolute -top-1 -left-1 w-24 h-24 border-t-4 border-l-4 border-cyan-400 rounded-tl-[44px] shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
          <div className="absolute -top-1 -right-1 w-24 h-24 border-t-4 border-r-4 border-cyan-400 rounded-tr-[44px] shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
          <div className="absolute -bottom-1 -left-1 w-24 h-24 border-b-4 border-l-4 border-cyan-400 rounded-bl-[44px] shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
          <div className="absolute -bottom-1 -right-1 w-24 h-24 border-b-4 border-r-4 border-cyan-400 rounded-br-[44px] shadow-[0_0_15px_rgba(34,211,238,0.8)]" />

          <div className="mb-12 text-center relative">
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-2 italic">
              NAIA <span className="text-cyan-400">ECOSYSTEM</span>
            </h2>
            <div className="h-px w-32 bg-cyan-400/50 mx-auto" />
          </div>

          <motion.div
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15,
                  delayChildren: 0.5
                }
              }
            }}
            initial="hidden"
            animate="show"
            className="flex flex-wrap justify-center gap-12 relative"
          >
            {[
              { id: 1, word: "Naia Storytelling", onNavigate: onNavigateToNaiaStorytelling, color: "bg-cyan-400", shadow: "shadow-[0_0_20px_rgba(34,211,238,0.6)]" },
              { id: 2, word: "Naia Avaliativa", onNavigate: onNavigateToNaiaAvaliativa, color: "bg-amber-500", shadow: "shadow-[0_0_20px_rgba(245,158,11,0.6)]" }
            ].map((node, visualIndex) => {
              const nodeNumber = node.id;
              
              return (
                <motion.div
                  key={node.id}
                  variants={{
                    hidden: { opacity: 0, scale: 0.8, y: 20 },
                    show: { opacity: 1, scale: 1, y: 0 }
                  }}
                  className="relative w-full max-w-[300px]"
                >
                  <DashboardNodeNaia
                    word={node.word}
                    nodeNumber={nodeNumber}
                    visualIndex={visualIndex}
                    isSelected={activeNodeNumber === nodeNumber}
                    hasActiveSelection={activeNodeNumber !== null}
                    onSelect={(e) => toggleNode(e, nodeNumber)}
                  />

                  {activeNodeNumber === nodeNumber && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        playEnterSound();
                        if (node.id === 2) {
                          setShowComingSoon(true);
                          setTimeout(() => {
                            setShowComingSoon(false);
                            setActiveNodeNumber(null);
                          }, 2000);
                        } else if (node.id === 1) {
                          window.open("https://naia.freitasalvf.net", "_blank");
                        } else {
                          node.onNavigate?.();
                        }
                      }}
                      className={`absolute -bottom-16 left-1/2 z-50 px-6 py-2 ${node.color} text-white font-bold rounded-full text-xs uppercase tracking-widest ${node.shadow} hover:scale-110 active:scale-95 transition-all -translate-x-1/2`}
                    >
                      Acessar
                    </motion.button>
                  )}
                </motion.div>
              );
            })}
          </motion.div>

          {/* Overlay de 'Em Breve' */}
          <AnimatePresence>
            {showComingSoon && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-50 flex items-center justify-center pointer-events-none"
              >
                <div className="bg-cyan-950/90 backdrop-blur-2xl border-2 border-cyan-400 px-12 py-6 rounded-2xl shadow-[0_0_50px_rgba(34,211,238,0.6)]">
                  <span className="text-xl md:text-2xl font-black text-white uppercase tracking-[0.2em] italic">
                    Disponível em <span className="text-cyan-400">Breve</span>
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
};
