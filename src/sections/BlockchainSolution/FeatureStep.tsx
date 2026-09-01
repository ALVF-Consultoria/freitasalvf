"use client";

import { motion } from "framer-motion";
import { blockchainFeatures } from "@/constants/blockchainData";
import { useMobile } from "@/hooks/useMobile";
import { MobileScrollWrapper } from "@/components/common/MobileScrollWrapper";
import { travelScrollOut, type TravelProps } from "@/lib/travel";
import { bcType } from "./typography";

interface FeatureStepProps extends TravelProps {
  step: number;
}

// O bloco cobre os passos 3..6 sem remontar: cada passo acende mais um card.
const FIRST_CARD_STEP = 3;

export const FeatureStep = ({ step, direction }: FeatureStepProps) => {
  const isMobile = useMobile();
  const revealed = step - FIRST_CARD_STEP;

  return (
    <motion.div
      variants={travelScrollOut}
      custom={direction}
      initial="enter"
      animate="center"
      exit="exit"
      className={`w-full flex flex-col md:flex-row gap-6 md:gap-12 font-mono ${isMobile ? "pt-10" : "pt-20"}`}
    >
      <MobileScrollWrapper accentColor="amber">
        <div className="flex flex-col md:flex-row gap-6 md:gap-12">
          <div className="md:w-1/3">
            <h3 className={`${bcType.title} font-black text-white uppercase mb-2 md:mb-4`}>
              O Sistema
            </h3>
            <p className={`${bcType.label} text-amber-500 opacity-60 mb-6 md:mb-12`}>
              Explorando os fundamentos da Blockchain
            </p>

            <div className="space-y-3">
              {blockchainFeatures.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={revealed >= i ? { opacity: 1, x: 0 } : { opacity: 0.1 }}
                  className={`${bcType.label} flex items-center gap-3 p-3 border-l-2 transition-all cursor-default ${revealed === i ? "border-amber-500 bg-amber-500/10 text-white" : "border-white/5"}`}
                >
                  <span className="opacity-30">0{i + 1}</span> {f.title}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {blockchainFeatures.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={revealed >= i ? { opacity: 1, scale: 1 } : { opacity: 0 }}
                className={`p-4 md:p-10 border ${revealed === i ? "border-amber-500/40 bg-amber-500/5" : "border-white/5 bg-transparent"} transition-all flex flex-col justify-between overflow-hidden`}
              >
                <div>
                  <div className="mb-2 md:mb-8 opacity-40 scale-90 md:scale-125 origin-left">{f.icon}</div>
                  <h4 className={`${bcType.cardTitle} font-bold text-white mb-2 md:mb-4 uppercase`}>{f.title}</h4>
                </div>
                <p className={`${bcType.body} text-white/40 font-sans italic line-clamp-3 md:line-clamp-none`}>
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
