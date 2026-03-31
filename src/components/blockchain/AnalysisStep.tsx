"use client";

import { motion } from "framer-motion";
import { Terminal } from "lucide-react";
import { ecosystemPlatforms } from "../../constants/blockchainData";
import { useMobile } from "@/hooks/useMobile";
import { MobileScrollWrapper } from "./MobileScrollWrapper";

interface AnalysisStepProps {
   step: number;
}

export const AnalysisStep = ({ step }: AnalysisStepProps) => {
   const isMobile = useMobile();
   const platform = ecosystemPlatforms[step - 8];
   if (!platform) return null;

   return (
      <motion.div
         key={`analysis-${step}`}
         initial={{ opacity: 0, skewX: 5 }}
         animate={{ opacity: 1, skewX: 0 }}
         exit={{ opacity: 0, skewX: -5, filter: "blur(20px)" }}
         className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 w-full text-left font-mono ${isMobile ? 'pt-8' : 'pt-20'}`}
      >
         <MobileScrollWrapper accentColor="amber">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
               <div className="md:w-1/2 space-y-6 md:space-y-12">
            <div className="space-y-2">
               <div className="flex items-center gap-3">
                  <div className={`w-8 h-px ${platform.color} bg-current opacity-40`} />
                  <span className={`text-[10px] tracking-[0.4em] uppercase ${platform.color}`}>MODO_ANÁLISE_ATIVO</span>
               </div>
               <h3 className={`text-3xl md:text-[110px] font-black uppercase tracking-tighter leading-none ${platform.color} drop-shadow-[0_0_30px_currentColor]`}>
                  {platform.name}
               </h3>
            </div>

            <div className="grid grid-cols-2 gap-6 md:gap-12 border-t border-amber-500/10 pt-4 md:pt-8 max-w-lg">
               <div>
                  <span className="block text-[10px] text-white/30 uppercase tracking-widest mb-1">RELATÓRIO_MISSÃO</span>
                  <p className="text-white text-sm md:text-lg font-bold italic leading-tight uppercase tracking-tight">
                     &quot;{platform.mission}&quot;
                  </p>
               </div>
               <div className="space-y-2">
                  <span className="block text-[10px] text-white/30 uppercase tracking-widest mb-1">ARQUITETURA</span>
                  <p className="text-[10px] md:text-sm text-white/50 leading-relaxed uppercase">
                     {platform.description}
                  </p>
               </div>
            </div>
         </div>
 
         {/* Technical Spec Box */}
         <div className={`flex-1 p-6 md:p-12 border ${platform.color} border-current border-opacity-10 bg-white/5 backdrop-blur-xl relative overflow-hidden group w-full`}>
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <Terminal className="w-12 md:w-24 h-12 md:h-24" />
            </div>
            <h4 className="text-[10px] md:text-xs uppercase tracking-[0.5em] mb-6 md:mb-12 opacity-40">DIAGNÓSTICO_SISTEMA</h4>
 
            <div className="grid grid-cols-1 gap-4 md:gap-6 font-mono text-sm md:text-base">
               {platform.specs?.map((spec, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2">
                     <span className="text-white/20 text-[8px] md:text-[10px] tracking-widest uppercase">{spec.l}</span>
                     <span className="text-white font-bold tracking-tighter uppercase">{spec.v}</span>
                  </div>
               ))}
               <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-white/20 text-[10px] tracking-widest uppercase">SINCRONIA_REDE</span>
                  <span className="text-white font-bold tracking-tighter uppercase">DISTRIBUÍDO</span>
               </div>
            </div>

            <div className="mt-12 h-12 w-full bg-linear-to-r from-amber-500/10 to-transparent flex items-center px-4 overflow-hidden">
               <motion.div animate={{ x: [-100, 400] }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} className="text-[8px] whitespace-nowrap opacity-20 tracking-tighter uppercase">
                  0101010101 PROCESSANDO_DADOS_REGISTRO 0101010101 SINCRONIZANDO_NÓ_ALPHA 0101010101 0101010101
               </motion.div>
            </div>
         </div>
            </div>
         </MobileScrollWrapper>
      </motion.div>
   );
};
