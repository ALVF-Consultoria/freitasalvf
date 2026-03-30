"use client";

import { motion, AnimatePresence } from "framer-motion";
import { solanaImmersionData } from "../../constants/blockchainData";
import { Zap, Shield, Globe, ExternalLink, Activity, Cpu, ArrowRight } from "lucide-react";

interface SolanaStepProps {
  step: number;
}

export const SolanaStep = ({ step }: SolanaStepProps) => {
  const isIntro = step === 12;
  const isDeepDive = step === 13;
  const isEcosystem = step === 14;

  return (
    <div className="relative w-full h-full flex items-center justify-center font-sans overflow-hidden">
      {/* Background Motifs - Solana Style (Grid and Diagonals) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #9945FF 1px, transparent 0)', backgroundSize: '48px 48px' }} />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(20,241,149,0.05)_50%,transparent_75%)] bg-size-[1000px_1000px] animate-[pulse_8s_infinite]" />
      </div>

      <AnimatePresence mode="wait">
        {isIntro && (
          <motion.div
            key="solana-intro"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            className="flex flex-col items-center text-center gap-8 z-10"
          >
            <motion.div 
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="flex items-center gap-4 py-2 px-6 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl"
            >
              <div className="w-2 h-2 rounded-full bg-[#14F195] animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/50">Next-Gen Infrastructure</span>
            </motion.div>

            <div className="relative">
              <h2 className="text-7xl md:text-9xl font-black italic tracking-tighter text-white uppercase leading-none">
                SOLANA
              </h2>
              <div className="absolute -bottom-4 left-0 w-full h-1 bg-linear-to-r from-[#9945FF] to-[#14F195] shadow-[0_0_20px_rgba(153,69,255,0.5)]" />
            </div>

            <p className="max-w-xl text-white/40 uppercase tracking-[0.2em] text-sm font-medium">
              A arquitetura que escalou para as massas. Desempenho de hardware, segurança de blockchain.
            </p>
          </motion.div>
        )}

        {isDeepDive && (
          <motion.div
            key="solana-deep-dive"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full h-full flex flex-col md:flex-row items-center justify-between gap-12 z-10 px-4"
          >
            {/* Left: Metrics Grid */}
            <div className="flex-1 grid grid-cols-1 gap-6 max-w-md w-full">
              {solanaImmersionData.hero.metrics.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 border border-white/5 bg-white/2 backdrop-blur-3xl rounded-2xl group hover:border-[#9945FF]/30 transition-all shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]"
                >
                  <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.4em] mb-2 block">{m.label}</span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-black text-white italic tracking-tighter">{m.value}</span>
                    <span className="text-[10px] font-bold text-[#14F195] uppercase tracking-widest">{m.detail}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Center: The Core Symbol (Simulated "Zoom-in" Focal Point) */}
            <div className="hidden lg:flex relative w-96 h-96 items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-[#9945FF]/20"
              />
              <div className="relative w-64 h-64 bg-linear-to-br from-[#9945FF]/20 to-[#14F195]/20 rounded-full flex items-center justify-center border border-white/10 backdrop-blur-3xl shadow-[0_0_80px_rgba(153,69,255,0.15)]">
                <Cpu className="w-24 h-24 text-white opacity-50" />
              </div>
            </div>

            {/* Right: Technical Pillars */}
            <div className="flex-1 space-y-4 max-w-md">
              {solanaImmersionData.pillars.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="p-6 border-l-2 border-[#14F195]/30 bg-white/5"
                >
                  <h4 className="text-[#14F195] font-black text-xs tracking-widest mb-1 uppercase">{p.title}</h4>
                  <p className="text-white/40 text-[11px] leading-relaxed uppercase mb-2">{p.description}</p>
                  <div className="text-[9px] font-mono text-white/20 tracking-tighter italic">{p.tech}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {isEcosystem && (
          <motion.div
            key="solana-ecosystem"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-12 z-10 w-full"
          >
            <div className="text-center space-y-2">
              <span className="text-[10px] font-mono text-[#9945FF] uppercase tracking-[0.5em] font-bold">The Backbone of Web3</span>
              <h3 className="text-5xl font-black italic text-white uppercase tracking-tighter">Powered Ecosystem</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl px-6">
              {solanaImmersionData.ecosystem.map((project, i) => (
                <motion.div
                  key={project.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5, borderColor: "rgba(20, 241, 149, 0.4)" }}
                  className="p-8 border border-white/10 bg-white/3 backdrop-blur-xl rounded-xl flex flex-col items-center text-center gap-3 group transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Activity className="w-5 h-5 text-[#14F195]" />
                  </div>
                  <div className="space-y-1">
                    <span className="block text-lg font-black text-white italic tracking-tight">{project.name}</span>
                    <span className="block text-[8px] text-white/30 uppercase tracking-[0.2em]">{(project as any).role || (project as any).label}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex flex-col items-center gap-4 mt-8"
            >
              <div className="h-20 w-px bg-linear-to-b from-[#14F195] to-transparent" />
              <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.5em]">Scroll para concluir</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Futuristic Floating HUD Elements */}
      <div className="absolute top-20 right-20 hidden xl:block opacity-10 pointer-events-none">
        <div className="flex flex-col gap-2 items-end font-mono text-[8px] text-[#14F195]">
          <span>NETWORK_NODE: ACTIVE</span>
          <span>LATENCY: 382MS</span>
          <span>EPOCH: 592</span>
        </div>
      </div>
    </div>
  );
};
