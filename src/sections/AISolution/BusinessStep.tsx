"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { MobileScrollWrapper } from "@/components/blockchain/MobileScrollWrapper";
import { naiaBusinessFeatures } from "./features";

interface StepProps {
  contentStep: number;
}

export const BusinessIntro = ({ contentStep }: StepProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 2, filter: "blur(50px)" }}
    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
    exit={{ opacity: 0, scale: 0.5, filter: "blur(30px)" }}
    className="flex flex-col items-center absolute w-full px-4"
  >
    <MobileScrollWrapper accentColor="#10b981">
      <div className="flex flex-col items-center py-4 text-center">
        <div className="mb-4 md:mb-8 font-black uppercase tracking-tighter">
          <h2 className="text-4xl md:text-8xl text-white drop-shadow-[0_0_30px_rgba(16,185,129,0.5)] leading-none">
            NAIA <span className="text-emerald-400">Business</span>
          </h2>
          <p className="text-emerald-400 font-mono text-sm md:text-2xl tracking-[0.2em] md:tracking-[0.4em] mt-4 md:mt-2 opacity-80">Atendimento Whatsapp</p>
        </div>
        {contentStep >= 16 && (
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl text-white/80 text-base md:text-2xl italic font-light px-2">
            Revolucione seu atendimento e converta mais com automação inteligente e visão total do seu funil de atendimento.
          </motion.p>
        )}
      </div>
    </MobileScrollWrapper>
  </motion.div>
);

export const BusinessCards = ({ contentStep }: StepProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0, scale: 0, rotate: 180, filter: "blur(50px)" }}
    className="w-full"
  >
    <MobileScrollWrapper accentColor="#10b981" maxHeight="75vh">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 py-4 px-2">
        {naiaBusinessFeatures.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0, rotateY: 180 }}
            animate={contentStep > i + 16 ? { opacity: 1, scale: 1, rotateY: 0 } : { opacity: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-emerald-500/20 bg-emerald-950/10 backdrop-blur-3xl shadow-[0_0_40px_rgba(16,185,129,0.1)]"
          >
            <div className="mb-4 md:mb-6 p-4 md:p-5 rounded-2xl bg-emerald-500/10 text-emerald-400 inline-block">{f.icon}</div>
            <h4 className="text-base md:text-lg font-bold text-white uppercase mb-2 md:mb-4">{f.title}</h4>
            <p className="text-[12px] md:text-sm text-white/50 font-light leading-relaxed">{f.description}</p>
          </motion.div>
        ))}
      </div>
    </MobileScrollWrapper>
  </motion.div>
);

export const BusinessClose = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
    className="flex flex-col items-center absolute w-full max-w-4xl px-4"
  >
    <MobileScrollWrapper accentColor="#10b981">
      <div className="flex flex-col items-center py-6 text-center">
        <TrendingUp className="w-10 h-10 md:w-16 md:h-16 text-emerald-400 mb-6 md:mb-8 animate-pulse" />
        <h2 className="text-3xl md:text-7xl font-black text-white uppercase tracking-tighter leading-tight mb-6 md:mb-8">
          Visão Total. <br />
          <span className="text-emerald-400">Escala Infinita.</span>
        </h2>
        <p className="text-white/60 text-base md:text-2xl font-light italic px-2">
          Domine seu mercado com a inteligência autônoma que trabalha 24/7 por você.
        </p>
      </div>
    </MobileScrollWrapper>
  </motion.div>
);
