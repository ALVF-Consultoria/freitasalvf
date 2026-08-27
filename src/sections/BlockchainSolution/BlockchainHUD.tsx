"use client";

import { motion } from "framer-motion";

interface BlockchainHUDProps {
  step: number;
  onBack: () => void;
}

export const BlockchainHUD = ({ step, onBack }: BlockchainHUDProps) => {
  const isSolana = step >= 12 && step <= 14;
  const borderColor = isSolana ? "border-[#9945FF]/20" : "border-amber-500/20";
  const bgColor = isSolana ? "bg-[#9945FF]/5" : "bg-amber-500/5";

  return (
    <>
      {/* Back Button (Terminal Style). Sem o prefixo "[ ESC ]" que havia aqui:
          nao existe handler de teclado em lugar nenhum do projeto, entao ele
          anunciava um atalho que nao funcionava. */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        className={`absolute top-8 left-8 z-50 flex items-center gap-3 ${isSolana ? 'text-[#14F195]/40 hover:text-[#14F195]' : 'text-amber-500/40 hover:text-amber-400'} transition-all group`}
      >
        <div className={`p-2 px-3 border ${borderColor} ${bgColor} backdrop-blur-md font-mono text-xs tracking-tighter uppercase whitespace-nowrap`}>
          SAIR_DO_NÓ_BLOCKCHAIN
        </div>
      </motion.button>
    </>
  );
};
