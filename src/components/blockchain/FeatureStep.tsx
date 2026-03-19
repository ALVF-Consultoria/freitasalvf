"use client";

import { motion } from "framer-motion";
import { blockchainFeatures } from "../../constants/blockchainData";

interface FeatureStepProps {
  step: number;
}

export const FeatureStep = ({ step }: FeatureStepProps) => {
  return (
    <motion.div
      key="matrix"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: 50 }}
      className="w-full flex flex-col md:flex-row gap-12 font-mono pt-20"
    >
      <div className="md:w-1/3">
        <h3 className="text-4xl font-black text-white uppercase tracking-tight mb-4">System <br /><span className="text-amber-500 underline underline-offset-8 decoration-amber-500/30">Capabilities</span></h3>
        <p className="text-xs text-amber-500 opacity-60 uppercase tracking-[0.3em] mb-12">Explorando os fundamentos do protocolo</p>

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

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
        {blockchainFeatures.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={step > i + 2 ? { opacity: 1, scale: 1 } : { opacity: 0 }}
            className={`p-10 border ${step === i + 3 ? 'border-amber-500/40 bg-amber-500/5' : 'border-white/5 bg-transparent'} transition-all flex flex-col justify-between`}
          >
            <div>
              <div className="mb-8 opacity-40 scale-125 origin-left">{f.icon}</div>
              <h4 className="text-xl font-bold text-white mb-4 uppercase tracking-tighter">{f.title}</h4>
            </div>
            <p className="text-sm text-white/40 font-sans leading-relaxed italic">
              {f.description}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
