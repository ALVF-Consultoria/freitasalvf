"use client";

import { motion } from "framer-motion";
import { ScrollIndicator } from "../common/ScrollIndicator";
import { useMobile } from "@/hooks/useMobile";
import { MobileScrollWrapper } from "./MobileScrollWrapper";

interface IntroStepProps {
  step: number;
}

export const IntroStep = ({ step }: IntroStepProps) => {
  const isMobile = useMobile();

  return (
    <motion.div
      key="intro"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100, filter: "blur(20px)" }}
      className={`flex flex-col md:flex-row items-center gap-8 md:gap-20 w-full ${isMobile ? 'pt-10' : 'pt-20'}`}
    >
      <MobileScrollWrapper>
        <div className="flex-1 max-w-2xl text-left">
        <motion.span
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-amber-500/40 text-[10px] tracking-[0.5em] uppercase mb-6 block"
        >
          {"// Inovação Tecnológica // Módulo_Blockchain //"}
        </motion.span>
        <h2 className="text-4xl md:text-9xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-8">
          <span className="block italic text-transparent stroke-amber-500 stroke-1">Liderando a</span>
          <span className="text-amber-500">Nova Ordem</span>
          <span className="block">Digital.</span>
        </h2>

        {step >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <p className="text-white/60 text-lg md:text-xl font-light font-sans max-w-xl leading-relaxed">
              Transformando a segurança em algoritmos. A economia programável não é o futuro, é a infraestrutura do agora.
            </p>
            <div className="h-px w-20 bg-amber-500/30" />
            <div className="text-[10px] text-amber-500/40 tracking-widest uppercase">
              D_LEDGER :: SMART_CONTRACTS :: RWA_TOKENIZATION
            </div>
          </motion.div>
        )}
      </div>

      {/* Status Log (Intro Decor) */}
      <div className="hidden lg:block w-80 p-6 border-l border-amber-500/10 font-mono text-[9px] text-amber-500/20 space-y-2 uppercase select-none opacity-40">
        <p>&gt; Inicializando_Subsistema_Blockchain...</p>
        <p>&gt; Pool_de_Conexão: 4_Nós_Ativos</p>
        <p>&gt; Protocolo_Alpha_V2: Standby</p>
        <p>&gt; Handshake_Completo: Seguro</p>
        <p>&gt; Buscando_Manifesto_do_Ecossistema...</p>
        <p>&gt; Endereço_de_Memória: 0x7F...3B</p>
      </div>
      </MobileScrollWrapper>
      {!isMobile && <ScrollIndicator />}
    </motion.div>
  );
};
