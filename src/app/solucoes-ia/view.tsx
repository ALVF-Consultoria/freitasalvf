"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AISolution } from "@/sections/AISolution";

export function SolucoesIAView() {
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);

  // O App Router nao espera animacao de saida entre rotas: ele desmonta a pagina
  // e monta a proxima. Entao a saida acontece aqui dentro e a navegacao so dispara
  // no onExitComplete — o mesmo padrao que o Dashboard ja usa na ida, onde a nuvem
  // faz o zoom primeiro e so depois chama a navegacao.
  const handleBack = () => setLeaving(true);

  return (
    <main className="min-h-screen bg-[#050505] overflow-hidden">
      <AnimatePresence onExitComplete={() => router.push("/")}>
        {!leaving && (
          <motion.div
            key="ai-solution-route"
            initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <AISolution onBack={handleBack} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
