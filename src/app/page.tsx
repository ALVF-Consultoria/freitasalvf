"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Hero } from "@/sections/Hero";
import { Dashboard } from "@/sections/Dashboard";
import { AISolution } from "@/sections/AISolution";
import { AITransition } from "@/components/AITransition";
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
import { BackgroundMusic } from "@/components/common/BackgroundMusic";
import { LoadingCurtain } from "@/components/common/LoadingCurtain";

export default function Home() {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<"hero" | "dashboard" | "ai-transition" | "ai-solution" | "blockchain-transition" | "blockchain-solution" | "metaverse-transition" | "metaverse-solution" | "storytelling-transition" | "storytelling-solution" | "b2b-transition" | "b2b-solution" | "education-transition" | "education-solution" | "heritage-transition" | "heritage-solution">("hero");

  return (
    <main className="min-h-screen bg-[#050505] overflow-hidden">
      <AnimatePresence>
        {isAppLoading && (
          <LoadingCurtain onComplete={() => setIsAppLoading(false)} />
        )}
      </AnimatePresence>

      {!isAppLoading && (
        <AnimatePresence>
        {activeSection === "hero" && (
          <motion.div
            key="hero-section"
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <Hero onTransitionComplete={() => setActiveSection("dashboard")} />
          </motion.div>
        )}

        {activeSection === "dashboard" && (
          <motion.div
            key="dashboard-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <Dashboard
              onNavigateToAI={() => setActiveSection("ai-transition")}
              onNavigateToBlockchain={() => setActiveSection("blockchain-transition")}
              onNavigateToMetaverse={() => setActiveSection("metaverse-transition")}
              onNavigateToStorytelling={() => setActiveSection("storytelling-transition")}
              onNavigateToB2B={() => setActiveSection("b2b-transition")}
              onNavigateToEducation={() => setActiveSection("education-transition")}
              onNavigateToHeritage={() => setActiveSection("heritage-transition")}
            />
          </motion.div>
        )}

        {activeSection === "ai-transition" && (
          <motion.div
            key="ai-transition-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 0.8 }}
          >
            <AITransition onComplete={() => setActiveSection("ai-solution")} />
          </motion.div>
        )}

        {activeSection === "ai-solution" && (
          <motion.div
            key="ai-solution-section"
            initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <AISolution onBack={() => setActiveSection("dashboard")} />
          </motion.div>
        )}

        {activeSection === "blockchain-transition" && (
          <motion.div
            key="blockchain-transition-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <BlockchainTransition onComplete={() => setActiveSection("blockchain-solution")} />
          </motion.div>
        )}

        {activeSection === "blockchain-solution" && (
          <motion.div
            key="blockchain-solution-section"
            initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <BlockchainSolution onBack={() => setActiveSection("dashboard")} />
          </motion.div>
        )}

        {activeSection === "metaverse-transition" && (
          <motion.div
            key="metaverse-transition-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MetaverseTransition onComplete={() => setActiveSection("metaverse-solution")} />
          </motion.div>
        )}

        {activeSection === "metaverse-solution" && (
          <motion.div
            key="metaverse-solution-section"
            initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <MetaverseSolution onBack={() => setActiveSection("dashboard")} />
          </motion.div>
        )}

        {activeSection === "storytelling-transition" && (
          <motion.div
            key="storytelling-transition-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StorytellingTransition onComplete={() => setActiveSection("storytelling-solution")} />
          </motion.div>
        )}

        {activeSection === "storytelling-solution" && (
          <motion.div
            key="storytelling-solution-section"
            initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <StorytellingSolution onBack={() => setActiveSection("dashboard")} />
          </motion.div>
        )}

        {activeSection === "b2b-transition" && (
          <motion.div
            key="b2b-transition-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <B2BTransition onComplete={() => setActiveSection("b2b-solution")} />
          </motion.div>
        )}

        {activeSection === "b2b-solution" && (
          <motion.div
            key="b2b-solution-section"
            initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <B2BSolution onBack={() => setActiveSection("dashboard")} />
          </motion.div>
        )}

        {activeSection === "education-transition" && (
          <motion.div
            key="education-transition-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <EducationTransition onComplete={() => setActiveSection("education-solution")} />
          </motion.div>
        )}

        {activeSection === "education-solution" && (
          <motion.div
            key="education-solution-section"
            initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <EducationSolution onBack={() => setActiveSection("dashboard")} />
          </motion.div>
        )}

        {activeSection === "heritage-transition" && (
          <motion.div
            key="heritage-transition-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <HeritageTransition onComplete={() => setActiveSection("heritage-solution")} />
          </motion.div>
        )}

        {activeSection === "heritage-solution" && (
          <motion.div
            key="heritage-solution-section"
            initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <HeritageSolution onBack={() => setActiveSection("dashboard")} />
          </motion.div>
        )}
      </AnimatePresence>
      )}
      <BackgroundMusic />
    </main>
  );
}
