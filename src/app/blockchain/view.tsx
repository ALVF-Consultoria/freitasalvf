"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { markEntered } from "@/lib/entry";
import { BlockchainTransition } from "./BlockchainTransition";
import { BlockchainSolution } from "@/sections/BlockchainSolution";

type Stage = "transition" | "solution" | "leaving";

export function BlockchainView() {
  const router = useRouter();
  // A transicao de video veio junto para a rota, e nao ficou em page.tsx: assim
  // quem abre /blockchain direto pela URL vive a mesma abertura de quem chegou
  // pelo dashboard, em vez de cair no meio da secao.
  const [stage, setStage] = useState<Stage>("transition");

  // O App Router nao espera animacao de saida entre rotas: ele desmonta a pagina
  // e monta a proxima. Entao a saida acontece aqui dentro e a navegacao so dispara
  // no onExitComplete — mesmo padrao de /solucoes-ia.
  const handleBack = () => setStage("leaving");

  // Marcar antes do push, nao depois: a home decide entre hero e dashboard ja na
  // primeira renderizacao. Sem isso, quem abriu /blockchain direto pela URL
  // voltava para o hero, porque a flag so era escrita por um efeito de /.
  const leaveToHub = () => {
    markEntered();
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-[#050505] overflow-hidden">
      <AnimatePresence onExitComplete={() => stage === "leaving" && leaveToHub()}>
        {stage === "transition" && (
          <motion.div
            key="blockchain-transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <BlockchainTransition onComplete={() => setStage("solution")} />
          </motion.div>
        )}

        {stage === "solution" && (
          <motion.div
            key="blockchain-solution"
            initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <BlockchainSolution onBack={handleBack} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
