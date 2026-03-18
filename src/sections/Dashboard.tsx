"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardNode } from "../components/DashboardNode";
import { ParticlesBackground } from "../components/ParticlesBackground";

const dashboardWords = [
  "Soluções IA",
  "Blockchain",
  "Metaverso",
  "Storytelling",
  "HÁ 30 ANOS",
  "B2B",
  "Educação e\nCuradoria",
  "Inbound\nMarketing"
];

interface DashboardProps {
  onNavigateToAI?: () => void;
  onNavigateToBlockchain?: () => void;
}

export const Dashboard = ({ onNavigateToAI, onNavigateToBlockchain }: DashboardProps) => {
  const [activeNodeNumber, setActiveNodeNumber] = useState<number | null>(null);

  const toggleNode = (e: React.MouseEvent, num: number) => {
    e.stopPropagation();
    setActiveNodeNumber((prev) => (prev === num ? null : num));
  };

  return (
    <section
      id="dashboard"
      className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#050505] py-10 px-8 overflow-hidden"
      onClick={() => setActiveNodeNumber(null)}
    >
      {/* Sistema de Partículas Ambiente */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <ParticlesBackground />
      </div>
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
        <div className="relative p-16 md:p-28 rounded-[40px] z-10 group/container max-w-7xl w-full mx-auto">
          
          {/* 1. Camada de Brilho de Fundo Sutil */}
          <div className="absolute inset-0 bg-blue-500/5 rounded-[40px] blur-sm -z-10" />

          {/* 2. Moldura HUD Mestra (Bordas Duplas e Glow) */}
          <div className="absolute inset-0 rounded-[40px] border-2 border-cyan-400/30 shadow-[0_0_20px_rgba(34,211,238,0.2)] pointer-events-none" />
          <div className="absolute inset-[-4px] rounded-[44px] border border-cyan-400/10 pointer-events-none" />
          
          {/* Cantos Reforçados e Segmentados (Conforme Imagem) */}
          <div className="absolute -top-1 -left-1 w-24 h-24 border-t-4 border-l-4 border-cyan-400 rounded-tl-[44px] shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
          <div className="absolute -top-1 -right-1 w-24 h-24 border-t-4 border-r-4 border-cyan-400 rounded-tr-[44px] shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
          <div className="absolute -bottom-1 -left-1 w-24 h-24 border-b-4 border-l-4 border-cyan-400 rounded-bl-[44px] shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
          <div className="absolute -bottom-1 -right-1 w-24 h-24 border-b-4 border-r-4 border-cyan-400 rounded-br-[44px] shadow-[0_0_15px_rgba(34,211,238,0.8)]" />

          {/* Marcadores Laterais (Ticks / Ruler Style) */}
          <div className="absolute left-[-20px] top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-50">
            {[...Array(12)].map((_, i) => (
              <div key={i} className={`h-px bg-cyan-400 ${i % 3 === 0 ? 'w-4' : 'w-2'}`} />
            ))}
          </div>
          <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-50">
            {[...Array(12)].map((_, i) => (
              <div key={i} className={`h-px bg-cyan-400 ${i % 3 === 0 ? 'w-4' : 'w-2'}`} />
            ))}
          </div>

          {/* Grid de Nodes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 relative">
            {/* Mapeamento especial para criar o flow em 'S' */}
            {[0, 1, 2, 3, 7, 6, 5, 4].map((dataIndex, visualIndex) => {
              const word = dashboardWords[dataIndex];
              const nodeNumber = dataIndex + 1;
              const isAI = dataIndex === 0;
              const isBlockchain = dataIndex === 1;

              return (
                <div key={dataIndex} className="relative">
                  <DashboardNode
                    word={word}
                    nodeNumber={nodeNumber}
                    visualIndex={visualIndex}
                    isSelected={activeNodeNumber === nodeNumber}
                    hasActiveSelection={activeNodeNumber !== null}
                    onSelect={(e) => toggleNode(e, nodeNumber)}
                  />
                  
                  {/* Botão de Detalhes para Soluções IA */}
                  {isAI && activeNodeNumber === nodeNumber && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateToAI?.();
                      }}
                      className="absolute -bottom-16 left-1/2 -translate-x-1/2 z-50 px-6 py-2 bg-cyan-400 text-black font-bold rounded-full text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(34,211,238,0.6)] hover:scale-110 active:scale-95 transition-all"
                    >
                      Ver Detalhes
                    </motion.button>
                  )}

                  {/* Botão de Detalhes para Blockchain */}
                  {isBlockchain && activeNodeNumber === nodeNumber && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateToBlockchain?.();
                      }}
                      className="absolute -bottom-16 left-1/2 -translate-x-1/2 z-50 px-6 py-2 bg-amber-500 text-black font-bold rounded-full text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(245,158,11,0.6)] hover:scale-110 active:scale-95 transition-all"
                    >
                      Acessar
                    </motion.button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
};
