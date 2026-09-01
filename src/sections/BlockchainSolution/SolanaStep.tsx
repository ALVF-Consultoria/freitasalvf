"use client";

import { motion } from "framer-motion";
import { Activity, Cpu } from "lucide-react";
import { solanaImmersionData } from "@/constants/blockchainData";
import { useMobile } from "@/hooks/useMobile";
import { MobileScrollWrapper } from "@/components/common/MobileScrollWrapper";
import { travelFlat, type TravelProps } from "@/lib/travel";
import { bcType } from "./typography";

// Os tres passos da imersao Solana. Nenhum deles traz fundo proprio: o grid roxo
// e a diagonal que moravam no orquestrador sairam quando o holograma passou a
// cobrir a secao inteira. A identidade da Solana aqui vem da cor nos elementos
// (#9945FF / #14F195) e do radial roxo da luz ambiente, nao de um segundo campo.

export const SolanaIntro = ({ direction }: TravelProps) => (
  <motion.div
    variants={travelFlat}
    custom={direction}
    initial="enter"
    animate="center"
    exit="exit"
    className="flex flex-col items-center text-center gap-6 md:gap-8 z-10 px-4"
  >
    <MobileScrollWrapper accentColor="solana">
      <div className="flex flex-col items-center gap-6 md:gap-8 py-2">
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="flex items-center gap-3 md:gap-4 py-1.5 md:py-2 px-4 md:px-6 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl"
        >
          <div className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-[#14F195] animate-pulse" />
          <span className={`${bcType.micro} font-mono text-white/50`}>Next-Gen Infrastructure</span>
        </motion.div>

        <div className="relative">
          <h2 className={`${bcType.display} font-black italic text-white uppercase`}>SOLANA</h2>
          <div className="absolute -bottom-2 md:-bottom-4 left-0 w-full h-0.5 md:h-1 bg-linear-to-r from-[#9945FF] to-[#14F195] shadow-[0_0_20px_rgba(153,69,255,0.5)]" />
        </div>

        <p className={`${bcType.label} max-w-md md:max-w-xl text-white/40 font-medium`}>
          A arquitetura que escalou para as massas. Desempenho de hardware, segurança de blockchain.
        </p>
      </div>
    </MobileScrollWrapper>
  </motion.div>
);

export const SolanaDeepDive = ({ direction }: TravelProps) => (
  <motion.div
    variants={travelFlat}
    custom={direction}
    initial="enter"
    animate="center"
    exit="exit"
    className="w-full h-full flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12 z-10 px-4 pt-12 md:pt-0"
  >
    <MobileScrollWrapper accentColor="solana" maxHeight="80vh">
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12 py-4">
        {/* Left: Metrics Grid */}
        <div className="flex-1 grid grid-cols-1 gap-3 md:gap-6 max-w-md w-full">
          {solanaImmersionData.hero.metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 md:p-8 border border-white/5 bg-white/2 backdrop-blur-3xl rounded-2xl group hover:border-[#9945FF]/30 transition-all shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]"
            >
              <span className={`${bcType.micro} font-mono text-white/30 mb-1 md:mb-2 block`}>{m.label}</span>
              <div className="flex items-baseline gap-2 md:gap-3">
                <span className={`${bcType.title} font-black text-white italic`}>{m.value}</span>
                <span className={`${bcType.micro} font-bold text-[#14F195]`}>{m.detail}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Center: The Core Symbol */}
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
        <div className="flex-1 space-y-3 md:space-y-4 max-w-md">
          {solanaImmersionData.pillars.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="p-3 md:p-6 border-l-2 border-[#14F195]/30 bg-white/5"
            >
              <h4 className={`${bcType.label} text-[#14F195] font-black mb-1`}>{p.title}</h4>
              <p className={`${bcType.body} text-white/40 uppercase mb-1 md:mb-2`}>{p.description}</p>
              <div className={`${bcType.micro} font-mono text-white/20 italic`}>{p.tech}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </MobileScrollWrapper>
  </motion.div>
);

export const SolanaEcosystem = ({ direction }: TravelProps) => {
  const isMobile = useMobile();

  return (
    <motion.div
      variants={travelFlat}
      custom={direction}
      initial="enter"
      animate="center"
      exit="exit"
      className="flex flex-col items-center gap-6 md:gap-12 z-10 w-full px-4"
    >
      <MobileScrollWrapper accentColor="solana" maxHeight="80vh">
        <div className="flex flex-col items-center gap-6 md:gap-12 py-4">
          <div className="text-center space-y-1 md:space-y-2">
            <span className={`${bcType.micro} font-mono text-[#9945FF] font-bold`}>The Backbone of Web3</span>
            <h3 className={`${bcType.title} font-black italic text-white uppercase`}>Powered Ecosystem</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full max-w-5xl">
            {solanaImmersionData.ecosystem.map((project, i) => (
              <motion.div
                key={project.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, borderColor: "rgba(20, 241, 149, 0.4)" }}
                className="p-4 md:p-8 border border-white/10 bg-white/3 backdrop-blur-xl rounded-xl flex flex-col items-center text-center gap-2 md:gap-3 group transition-all"
              >
                <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Activity className="w-4 h-4 md:w-5 md:h-5 text-[#14F195]" />
                </div>
                <div className="space-y-0.5 md:space-y-1">
                  <span className={`block ${bcType.cardTitle} font-black text-white italic`}>{project.name}</span>
                  <span className={`block ${bcType.micro} text-white/30`}>{project.role}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {!isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex flex-col items-center gap-4 mt-8"
            >
              <div className="h-20 w-px bg-linear-to-b from-[#14F195] to-transparent" />
              <span className={`${bcType.micro} font-mono text-white/20`}>Scroll para concluir</span>
            </motion.div>
          )}
        </div>
      </MobileScrollWrapper>
    </motion.div>
  );
};
