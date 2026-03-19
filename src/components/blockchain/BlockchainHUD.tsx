"use client";

import { motion } from "framer-motion";

interface BlockchainHUDProps {
  step: number;
  totalSteps: number;
  onBack: () => void;
}

export const BlockchainHUD = ({ step, totalSteps, onBack }: BlockchainHUDProps) => {
  return (
    <>
      {/* Back Button (Terminal Style) */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        className="absolute top-8 left-8 z-50 flex items-center gap-3 text-amber-500/40 hover:text-amber-400 transition-all group"
      >
        <div className="p-2 px-3 border border-amber-500/20 bg-amber-500/5 backdrop-blur-md font-mono text-xs tracking-tighter uppercase whitespace-nowrap">
          [ ESC ] SAIR_DO_NÓ_BLOCKCHAIN
        </div>
      </motion.button>

      {/* Sidebar Technical Data (HUD) */}
      <div className="absolute top-0 right-0 h-full w-64 border-l border-amber-500/10 p-8 hidden xl:flex flex-col gap-8 opacity-20 pointer-events-none font-mono">
        <div className="space-y-4">
           <span className="block text-[10px] tracking-[0.3em] uppercase underline underline-offset-4 mb-4">Status_do_Nó</span>
           <div className="flex justify-between items-center text-xs">
              <span>TAXA_HASH</span>
              <span className="text-amber-500">2.4 PH/s</span>
           </div>
           <div className="flex justify-between items-center text-xs">
              <span>DIFICULDADE_REDE</span>
              <span className="text-amber-500">14.12 T</span>
           </div>
           <div className="flex justify-between items-center text-xs">
              <span>PARES_ATIVOS</span>
              <span className="text-amber-500">4,192</span>
           </div>
        </div>
        <div className="mt-auto space-y-2 text-[10px] leading-relaxed">
          <p>[ ALERTA_SISTEMA ]</p>
          <p>D_LEDGER_SINCRONIZADO_ATIVO</p>
          <p>GERAÇÃO_BLOCO: OK</p>
          <p>PROTOCOLO_CIP: V2.1</p>
        </div>
      </div>

      {/* GLOBAL HUD PROGRESS INDICATOR */}
      <div className="fixed bottom-12 right-12 flex flex-col items-end gap-3 pointer-events-none opacity-40 font-mono">
         <div className="flex gap-1">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className={`h-1 w-6 border transition-all ${step === i + 1 ? 'bg-amber-500 border-amber-500 w-12' : 'border-white/10 bg-transparent'}`} />
            ))}
         </div>
         <div className="text-xs uppercase tracking-[0.4em]">
            PROT_BC_SEQ // {step < 10 ? `0${step}` : step}_{totalSteps}
         </div>
      </div>

      {/* FOOTER SYSTEM METRICS (Left) */}
      <div className="absolute bottom-6 left-8 flex flex-col gap-1 opacity-20 font-mono text-[10px] text-white pointer-events-none uppercase text-left">
        <span>SISTEMA: BC_V1.0</span>
        <span>STATUS: {step === totalSteps ? 'DATABASE_SINCRONIZADA' : 'VALIDANDO_BLOCOS'}</span>
        <div className="flex gap-4 mt-2">
           <span className="text-amber-500">TPS: 65,000+</span>
           <span>LATENCY: 1.2MS</span>
        </div>
      </div>
    </>
  );
};
