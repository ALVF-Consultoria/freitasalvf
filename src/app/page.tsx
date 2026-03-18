"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Hero } from "@/sections/Hero";
import { Dashboard } from "@/sections/Dashboard";
import { AISolution } from "@/sections/AISolution";
import { AITransition } from "@/components/AITransition";
import { BlockchainTransition } from "@/components/BlockchainTransition";
import { BlockchainSolution } from "@/sections/BlockchainSolution";

export default function Home() {
  const [activeSection, setActiveSection] = useState<"hero" | "dashboard" | "ai-transition" | "ai-solution" | "blockchain-transition" | "blockchain-solution">("hero");

  return (
    <main className="min-h-screen bg-[#050505] overflow-hidden">
      <AnimatePresence mode="wait">
        {activeSection === "hero" && (
          <motion.div
            key="hero-section"
            exit={{ 
              opacity: 0, 
              scale: 1.5,
              filter: "blur(20px)"
            }}
            transition={{ duration: 1, ease: "easeIn" }}
          >
            <Hero onTransitionComplete={() => setActiveSection("dashboard")} />
          </motion.div>
        )}

        {activeSection === "dashboard" && (
          <motion.div
            key="dashboard-section"
            initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.2, filter: "blur(20px)" }}
            transition={{ duration: 1.2, ease: "circOut" }}
          >
            <Dashboard 
              onNavigateToAI={() => setActiveSection("ai-transition")}
              onNavigateToBlockchain={() => setActiveSection("blockchain-transition")}
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
      </AnimatePresence>
    </main>
  );
}
