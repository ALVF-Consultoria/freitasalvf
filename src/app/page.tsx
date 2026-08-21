"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Hero } from "@/sections/Hero";
import { Dashboard } from "@/sections/Dashboard";
import { BlockchainTransition } from "@/components/BlockchainTransition";
import { MetaverseTransition } from "@/components/MetaverseTransition";
import { StorytellingSolution } from "@/sections/StorytellingSolution";
import { StorytellingTransition } from "@/components/StorytellingTransition";
import { B2BTransition } from "@/components/B2BTransition";
import { B2BSolution } from "@/sections/B2BSolution";
import { EducationTransition } from "@/components/EducationTransition";
import { EducationSolution } from "@/sections/EducationSolution";
import { BlockchainSolution } from "@/sections/BlockchainSolution";
import { MetaverseSolution } from "@/sections/MetaverseSolution";
import { HeritageTransition } from "@/components/HeritageTransition";
import { HeritageSolution } from "@/sections/HeritageSolution";
import { DashboardToNaia } from "@/sections/DashboardToNaia";
import { BackgroundMusic } from "@/components/common/BackgroundMusic";
import { LoadingCurtain } from "@/components/common/LoadingCurtain";

type Section =
  | "hero" | "dashboard"
  | "blockchain-transition" | "blockchain-solution"
  | "metaverse-transition" | "metaverse-solution"
  | "storytelling-transition" | "storytelling-solution"
  | "b2b-transition" | "b2b-solution"
  | "education-transition" | "education-solution"
  | "heritage-transition" | "heritage-solution"
  | "dashboard-naia";

// Modulo, nao sessionStorage: um router.push entre rotas nao recarrega o
// documento, entao esta variavel sobrevive a ida e volta para /solucoes-ia e
// zera num F5 — que e exatamente a diferenca entre "voltei de uma rota" e
// "abri a pagina de novo". Com sessionStorage o hero sumia ate fechar a aba.
let hasEnteredDocument = false;
const noopSubscribe = () => () => {};

export default function Home() {
  const router = useRouter();

  // Secoes que viraram rota saem desta pagina e voltam para ela. Sem retomar o
  // dashboard, o retorno cairia no hero e obrigaria a rever o video de abertura.
  // useSyncExternalStore em vez de setState num efeito: o snapshot do servidor e
  // false e o do cliente le a variavel de modulo, entao a hidratacao nao quebra.
  const hasEntered = useSyncExternalStore(
    noopSubscribe,
    () => hasEnteredDocument,
    () => false
  );

  const [isAppLoading, setIsAppLoading] = useState(true);
  const [navigatedSection, setNavigatedSection] = useState<Section | null>(null);

  const section: Section = navigatedSection ?? (hasEntered ? "dashboard" : "hero");
  const showCurtain = isAppLoading && !hasEntered;

  useEffect(() => {
    if (section !== "hero") hasEnteredDocument = true;
  }, [section]);

  return (
    <main className="min-h-screen bg-[#050505] overflow-hidden">
      <AnimatePresence>
        {showCurtain && (
          <LoadingCurtain onComplete={() => setIsAppLoading(false)} />
        )}
      </AnimatePresence>

      {!showCurtain && (
        <AnimatePresence>
        {section === "hero" && (
          <motion.div
            key="hero-section"
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <Hero onTransitionComplete={() => setNavigatedSection("dashboard")} />
          </motion.div>
        )}

        {section === "dashboard" && (
          <motion.div
            key="dashboard-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <Dashboard
              onNavigateToAI={() => router.push("/solucoes-ia")}
              onNavigateToBlockchain={() => setNavigatedSection("blockchain-transition")}
              onNavigateToMetaverse={() => setNavigatedSection("metaverse-transition")}
              onNavigateToStorytelling={() => setNavigatedSection("storytelling-transition")}
              onNavigateToB2B={() => setNavigatedSection("b2b-transition")}
              onNavigateToEducation={() => setNavigatedSection("education-transition")}
              onNavigateToHeritage={() => setNavigatedSection("heritage-transition")}
              onNavigateToNaia={() => setNavigatedSection("dashboard-naia")}
            />
          </motion.div>
        )}

        {section === "blockchain-transition" && (
          <motion.div
            key="blockchain-transition-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <BlockchainTransition onComplete={() => setNavigatedSection("blockchain-solution")} />
          </motion.div>
        )}

        {section === "blockchain-solution" && (
          <motion.div
            key="blockchain-solution-section"
            initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <BlockchainSolution onBack={() => setNavigatedSection("dashboard")} />
          </motion.div>
        )}

        {section === "metaverse-transition" && (
          <motion.div
            key="metaverse-transition-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MetaverseTransition onComplete={() => setNavigatedSection("metaverse-solution")} />
          </motion.div>
        )}

        {section === "metaverse-solution" && (
          <motion.div
            key="metaverse-solution-section"
            initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <MetaverseSolution onBack={() => setNavigatedSection("dashboard")} />
          </motion.div>
        )}

        {section === "storytelling-transition" && (
          <motion.div
            key="storytelling-transition-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StorytellingTransition onComplete={() => setNavigatedSection("storytelling-solution")} />
          </motion.div>
        )}

        {section === "storytelling-solution" && (
          <motion.div
            key="storytelling-solution-section"
            initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <StorytellingSolution onBack={() => setNavigatedSection("dashboard")} />
          </motion.div>
        )}

        {section === "b2b-transition" && (
          <motion.div
            key="b2b-transition-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <B2BTransition onComplete={() => setNavigatedSection("b2b-solution")} />
          </motion.div>
        )}

        {section === "b2b-solution" && (
          <motion.div
            key="b2b-solution-section"
            initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <B2BSolution onBack={() => setNavigatedSection("dashboard")} />
          </motion.div>
        )}

        {section === "education-transition" && (
          <motion.div
            key="education-transition-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <EducationTransition onComplete={() => setNavigatedSection("education-solution")} />
          </motion.div>
        )}

        {section === "education-solution" && (
          <motion.div
            key="education-solution-section"
            initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <EducationSolution onBack={() => setNavigatedSection("dashboard")} />
          </motion.div>
        )}

        {section === "heritage-transition" && (
          <motion.div
            key="heritage-transition-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <HeritageTransition onComplete={() => setNavigatedSection("heritage-solution")} />
          </motion.div>
        )}

        {section === "heritage-solution" && (
          <motion.div
            key="heritage-solution-section"
            initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <HeritageSolution onBack={() => setNavigatedSection("dashboard")} />
          </motion.div>
        )}

        {section === "dashboard-naia" && (
          <motion.div
            key="dashboard-naia-section"
            initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <DashboardToNaia onBack={() => setNavigatedSection("dashboard")} />
          </motion.div>
        )}
      </AnimatePresence>
      )}
      <BackgroundMusic />
    </main>
  );
}
