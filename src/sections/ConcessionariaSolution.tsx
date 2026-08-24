"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useStepNavigation } from "../hooks/useStepNavigation";
import { ParticlesBackground } from "../components/ParticlesBackground";
import { useMobile } from "@/hooks/useMobile";
import { concessionariaContent } from "../constants/concessionariaData";

interface ConcessionariaSolutionProps {
  onBack: () => void;
}

export const ConcessionariaSolution = ({ onBack }: ConcessionariaSolutionProps) => {
  const isMobile = useMobile();

  // Tela unica enquanto a concessionaria nao tem conteudo proprio: qualquer
  // direcao de scroll devolve ao dashboard, como o ultimo passo das outras
  // secoes faz com onBack().
  useStepNavigation({ onNext: onBack, onPrev: onBack, cooldown: 1200 });

  return (
    <section
      className={`relative h-screen w-full bg-[#050505] overflow-hidden flex items-center justify-center ${
        isMobile ? "p-6 pt-20" : "p-12"
      }`}
    >
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <ParticlesBackground />
      </div>

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent_70%)]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center text-center gap-8 md:gap-12 max-w-4xl px-4"
      >
        <motion.span
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="text-blue-400 font-mono text-[10px] md:text-xs tracking-[0.5em] md:tracking-[0.8em] uppercase"
        >
          {concessionariaContent.status}
        </motion.span>

        <h2 className="text-2xl md:text-5xl font-serif italic text-white leading-tight">
          {concessionariaContent.title}
        </h2>

        <div className="w-16 h-px bg-blue-500/50" />

        <motion.a
          href={concessionariaContent.url}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(59,130,246,0.3)" }}
          whileTap={{ scale: 0.95 }}
          className="group flex items-center gap-4 md:gap-6 py-4 md:py-5 px-8 md:px-10 border-2 border-blue-500 rounded-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 font-mono text-xs md:text-base tracking-[0.2em] uppercase transition-colors"
        >
          {concessionariaContent.website}
          <ExternalLink className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-45 transition-transform" />
        </motion.a>
      </motion.div>

      <div className={`absolute ${isMobile ? "top-6 left-6" : "top-12 left-12"} z-50`}>
        <motion.button
          onClick={onBack}
          whileHover={{ x: -10 }}
          className="flex items-center gap-3 md:gap-4 text-white/20 hover:text-white transition-all font-mono text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold"
        >
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
          FECHAR
        </motion.button>
      </div>
    </section>
  );
};
