"use client";

import { motion } from "framer-motion";
import { MessageSquareQuote } from "lucide-react";
import { MobileScrollWrapper } from "@/components/blockchain/MobileScrollWrapper";
import { naiaAvaliativaFeatures } from "./features";

interface StepProps {
  contentStep: number;
}

export const AvaliativaIntro = ({ contentStep }: StepProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5, rotateY: 20, filter: "blur(20px)" }}
    animate={{ opacity: 1, scale: 1, rotateY: 0, filter: "blur(0px)" }}
    exit={{ opacity: 0, scale: 1.5, rotateY: -20, filter: "blur(30px)" }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="flex flex-col items-center absolute w-full px-4"
  >
    <MobileScrollWrapper accentColor="#22d3ee">
      <div className="flex flex-col items-center py-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4 md:mb-8">
          <h2 className="text-4xl md:text-8xl font-black text-white uppercase tracking-tighter drop-shadow-[0_0_20px_rgba(34,211,238,0.5)] leading-none">
            NAIA <span className="text-cyan-400">Avaliativa</span>
          </h2>
          <p className="text-cyan-400 font-mono text-sm md:text-2xl tracking-[0.2em] md:tracking-[0.4em] uppercase mt-4 md:mt-2 opacity-80">em desenvolvimento</p>
        </motion.div>
        {contentStep >= 2 && (
          <motion.p initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl text-white/80 text-base md:text-2xl italic font-light px-2">
            Plataforma educacional com IA. Criação, aplicação e correção de provas de forma totalmente automatizada e segura para instituições.
          </motion.p>
        )}
      </div>
    </MobileScrollWrapper>
  </motion.div>
);

export const AvaliativaCards = ({ contentStep }: StepProps) => (
  <motion.div
    initial={{ opacity: 0, rotateX: 10 }}
    animate={{ opacity: 1, rotateX: 0 }}
    exit={{ opacity: 0, scale: 2, filter: "blur(40px)" }}
    className="w-full"
  >
    <MobileScrollWrapper accentColor="#22d3ee" maxHeight="75vh">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 py-4 px-2">
        {naiaAvaliativaFeatures.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8, z: -100 }}
            animate={contentStep > i + 2 ? { opacity: 1, scale: 1, z: 0 } : { opacity: 0 }}
            className="p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-cyan-400/20 bg-cyan-950/20 backdrop-blur-3xl shadow-[0_0_30px_rgba(34,211,238,0.05)]"
          >
            <div className="mb-4 md:mb-6 p-4 md:p-5 rounded-2xl bg-cyan-400/10 text-cyan-400 inline-block">{f.icon}</div>
            <h4 className="text-base md:text-lg font-bold text-white uppercase mb-2 md:mb-4">{f.title}</h4>
            <p className="text-[12px] md:text-sm text-white/50 font-light leading-relaxed">{f.description}</p>
          </motion.div>
        ))}
      </div>
    </MobileScrollWrapper>
  </motion.div>
);

export const AvaliativaBridge = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.2, filter: "blur(30px)" }}
    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
    exit={{ opacity: 0, scale: 4, filter: "blur(50px)" }}
    className="flex flex-col items-center absolute w-full px-6"
  >
    <MessageSquareQuote className="w-8 h-8 md:w-12 md:h-12 text-cyan-400 mb-6 md:mb-8 opacity-50" />
    <h2 className="text-3xl md:text-7xl font-black text-white uppercase tracking-tighter drop-shadow-[0_0_40px_rgba(34,211,238,0.6)] leading-tight">
      O futuro da Educação é <br />
      <span className="text-cyan-400">Humano</span> e <span className="text-cyan-400">Inteligente</span>
    </h2>
  </motion.div>
);
