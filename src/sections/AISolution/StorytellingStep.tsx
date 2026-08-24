"use client";

import { motion } from "framer-motion";
import { Rocket } from "lucide-react";
import { MobileScrollWrapper } from "@/components/blockchain/MobileScrollWrapper";
import { naiaStorytellingFeatures } from "./features";
import { travelNormal, travelPunch, type TravelProps } from "./travel";

interface StepProps extends TravelProps {
  contentStep: number;
}

export const StorytellingIntro = ({ contentStep, direction }: StepProps) => (
  <motion.div
    variants={travelNormal}
    custom={direction}
    initial="enter"
    animate="center"
    exit="exit"
    className="flex flex-col items-center absolute w-full px-4"
  >
    <MobileScrollWrapper accentColor="#3b82f6">
      <div className="flex flex-col items-center py-4">
        <div className="mb-4 md:mb-8 font-black uppercase tracking-tighter text-center">
          <h2 className="text-4xl md:text-8xl text-white drop-shadow-[0_0_20px_rgba(59,130,246,0.5)] leading-none">
            NAIA <span className="text-blue-500">Storytelling</span>
          </h2>
          <p className="text-blue-400 font-mono text-sm md:text-2xl tracking-[0.2em] md:tracking-[0.4em] mt-4 md:mt-2 opacity-80">Histórias Autônomas</p>
        </div>
        {contentStep >= 9 && (
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl text-white/80 text-base md:text-2xl italic font-light px-2">
            Geração automática de histórias a partir das suas respostas. Conteúdo emocional focado em audiência e engajamento.
          </motion.p>
        )}
      </div>
    </MobileScrollWrapper>
  </motion.div>
);

export const StorytellingCards = ({ contentStep, direction }: StepProps) => (
  <motion.div
    variants={travelNormal}
    custom={direction}
    initial="enter"
    animate="center"
    exit="exit"
    className="w-full"
  >
    <MobileScrollWrapper accentColor="#3b82f6" maxHeight="75vh">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 py-4 px-2">
        {naiaStorytellingFeatures.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            animate={contentStep > i + 9 ? { opacity: 1, y: 0 } : { opacity: 0 }}
            className="p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-blue-500/20 bg-blue-950/10 backdrop-blur-3xl shadow-[0_0_30px_rgba(59,130,246,0.05)]"
          >
            <div className="mb-4 md:mb-6 p-4 md:p-5 rounded-2xl bg-blue-500/10 text-blue-400 inline-block">{f.icon}</div>
            <h4 className="text-base md:text-lg font-bold text-white uppercase mb-2 md:mb-4">{f.title}</h4>
            <p className="text-[12px] md:text-sm text-white/50 font-light leading-relaxed">{f.description}</p>
          </motion.div>
        ))}
      </div>
    </MobileScrollWrapper>
  </motion.div>
);

export const StorytellingBridge = ({ direction }: TravelProps) => (
  <motion.div
    variants={travelPunch}
    custom={direction}
    initial="enter"
    animate="center"
    exit="exit"
    className="flex flex-col items-center absolute w-full px-6"
  >
    <Rocket className="w-8 h-8 md:w-12 md:h-12 text-blue-400 mb-6 md:mb-8 animate-bounce" />
    <h2 className="text-3xl md:text-7xl font-black text-white uppercase tracking-tighter leading-tight">
      Escalando para o <br />
      <span className="text-blue-500 text-glow-blue">Próximo Nível</span>
    </h2>
  </motion.div>
);
