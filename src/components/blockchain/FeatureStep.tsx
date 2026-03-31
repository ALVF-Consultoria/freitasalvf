"use client";

import { motion } from "framer-motion";
import { blockchainFeatures } from "../../constants/blockchainData";
import { useMobile } from "@/hooks/useMobile";
import { MobileScrollWrapper } from "./MobileScrollWrapper";

interface FeatureStepProps {
  step: number;
}

export const FeatureStep = ({ step }: FeatureStepProps) => {
  const isMobile = useMobile();

  return (
    <motion.div
      key="matrix"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: 50 }}
      className={`w-full flex flex-col md:flex-row gap-6 md:gap-12 font-mono ${isMobile ? 'pt-10' : 'pt-20'}`}
    >
      <MobileScrollWrapper>
        <div className="flex flex-col md:flex-row gap-6 md:gap-12">
          <div className="md:w-1/3">
        <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight mb-2 md:mb-4">System <br /><span className="text-amber-500 underline underline-offset-8 decoration-amber-500/30">Capabilities</span></h3>
        <p className="text-[10px] text-amber-500 opacity-60 uppercase tracking-[0.3em] mb-6 md:mb-12">Explorando os fundamentos do protocolo</p>


        <div className="space-y-3">
          {blockchainFeatures.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={step > i + 2 ? { opacity: 1, x: 0 } : { opacity: 0.1 }}
              className={`text-xs uppercase tracking-widest flex items-center gap-3 p-3 border-l-2 transition-all cursor-default ${step === i + 3 ? 'border-amber-500 bg-amber-500/10 text-white' : 'border-white/5'}`}
            >
              <span className="opacity-30">0{i + 1}</span> {f.title}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {blockchainFeatures.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={step > i + 2 ? { opacity: 1, scale: 1 } : { opacity: 0 }}
            className={`p-4 md:p-10 border ${step === i + 3 ? 'border-amber-500/40 bg-amber-500/5' : 'border-white/5 bg-transparent'} transition-all flex flex-col justify-between overflow-hidden`}
          >
            <div>
              <div className="mb-2 md:mb-8 opacity-40 scale-90 md:scale-125 origin-left">{f.icon}</div>
              <h4 className="text-sm md:text-xl font-bold text-white mb-2 md:mb-4 uppercase tracking-tighter">{f.title}</h4>
            </div>
            <p className="text-[10px] md:text-sm text-white/40 font-sans leading-relaxed italic line-clamp-3 md:line-clamp-none">
              {f.description}
            </p>
          </motion.div>
        ))}
        </div>
      </div>
    </MobileScrollWrapper>
    </motion.div>
  );
};
