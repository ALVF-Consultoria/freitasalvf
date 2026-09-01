"use client";

import { motion } from "framer-motion";
import { Terminal } from "lucide-react";
import { ecosystemPlatforms } from "@/constants/blockchainData";
import { useMobile } from "@/hooks/useMobile";
import { MobileScrollWrapper } from "@/components/common/MobileScrollWrapper";
import { travelFlat, type TravelProps } from "@/lib/travel";
import { bcType } from "./typography";

interface AnalysisStepProps extends TravelProps {
  step: number;
}

// Cada passo de 8 a 11 abre uma plataforma do array, na ordem.
const FIRST_ANALYSIS_STEP = 8;

export const AnalysisStep = ({ step, direction }: AnalysisStepProps) => {
  const isMobile = useMobile();
  const platform = ecosystemPlatforms[step - FIRST_ANALYSIS_STEP];
  if (!platform) return null;

  return (
    <motion.div
      variants={travelFlat}
      custom={direction}
      initial="enter"
      animate="center"
      exit="exit"
      className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 w-full text-left font-mono ${isMobile ? "pt-8" : "pt-20"}`}
    >
      <MobileScrollWrapper accentColor="amber">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <div className="md:w-1/2 space-y-6 md:space-y-12">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-px ${platform.color} bg-current opacity-40`} />
                <span className={`${bcType.micro} ${platform.color}`}>MODO_ANÁLISE_ATIVO</span>
              </div>
              <h3 className={`${bcType.display} font-black uppercase ${platform.color} drop-shadow-[0_0_30px_currentColor]`}>
                {platform.name}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-6 md:gap-12 border-t border-amber-500/10 pt-4 md:pt-8 max-w-lg">
              <div>
                <span className={`block ${bcType.label} text-white/30 mb-1`}>RELATÓRIO_MISSÃO</span>
                <p className={`${bcType.cardTitle} text-white font-bold italic uppercase`}>
                  &quot;{platform.mission}&quot;
                </p>
              </div>
              <div className="space-y-2">
                <span className={`block ${bcType.label} text-white/30 mb-1`}>ARQUITETURA</span>
                <p className={`${bcType.body} text-white/50 uppercase`}>
                  {platform.description}
                </p>
              </div>
            </div>
          </div>

          {/* Technical Spec Box */}
          <div className={`flex-1 p-6 md:p-12 border ${platform.color} border-current bg-white/5 backdrop-blur-xl relative overflow-hidden group w-full`}>
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Terminal className="w-12 md:w-24 h-12 md:h-24" />
            </div>
            <h4 className={`${bcType.label} mb-6 md:mb-12 opacity-40`}>DIAGNÓSTICO_SISTEMA</h4>

            <div className={`grid grid-cols-1 gap-4 md:gap-6 font-mono ${bcType.body}`}>
              {platform.specs?.map((spec) => (
                <div key={spec.l} className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className={`${bcType.micro} text-white/20`}>{spec.l}</span>
                  <span className="text-white font-bold tracking-tighter uppercase">{spec.v}</span>
                </div>
              ))}
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className={`${bcType.micro} text-white/20`}>SINCRONIA_REDE</span>
                <span className="text-white font-bold tracking-tighter uppercase">DISTRIBUÍDO</span>
              </div>
            </div>

            <div className="mt-12 h-12 w-full bg-linear-to-r from-amber-500/10 to-transparent flex items-center px-4 overflow-hidden">
              <motion.div
                animate={{ x: [-100, 400] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                className={`${bcType.micro} whitespace-nowrap opacity-20`}
              >
                0101010101 PROCESSANDO_DADOS_REGISTRO 0101010101 SINCRONIZANDO_NÓ_ALPHA 0101010101 0101010101
              </motion.div>
            </div>
          </div>
        </div>
      </MobileScrollWrapper>
    </motion.div>
  );
};
