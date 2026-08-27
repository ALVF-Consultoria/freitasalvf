"use client";

import { motion } from "framer-motion";
import { DepthText } from "@/components/DepthText";
import { travelNormal, travelSoft, type TravelProps } from "@/lib/travel";

// Telas de conceito herdadas do antigo AITransition. Abrem a secao antes do
// conteudo numerado comecar.

export const IntroQuote = ({ direction }: TravelProps) => (
  <motion.div
    variants={travelNormal}
    custom={direction}
    initial="enter"
    animate="center"
    exit="exit"
    className="flex flex-col items-center absolute w-full max-w-4xl px-4"
  >
    <h2 className="text-2xl md:text-4xl font-light text-white leading-relaxed tracking-tight italic">
      &quot;Indo muito além das limitadas IAs <span className="text-cyan-400/50">(pseudo inteligência artificial)</span>, nossa <span className="text-cyan-400 font-bold">Interface Autônoma</span>, gera integração da necessidade com as soluções.&quot;
    </h2>
  </motion.div>
);

export const IntroBrand = ({ direction }: TravelProps) => (
  <motion.div
    variants={travelSoft}
    custom={direction}
    initial="enter"
    animate="center"
    exit="exit"
    className="flex flex-col items-center absolute w-full px-4 text-center"
  >
    <h3 className="leading-none">
      <DepthText
        segments={[{ text: "NA" }, { text: "IA", color: "#22d3ee" }]}
        layers={34}
        depth={2.4}
        faceColor="#ffffff"
        depthColor="#22d3ee"
        tilt={7.5}
        pointerTracking
        smoothing={0.14}
        perspective={900}
        autoOrbit
        orbitSpeed={0.35}
        fontSize="clamp(4.5rem, 18vw, 10.5rem)"
        fontWeight={900}
        shadow
      />
    </h3>
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 0.8, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="mt-4 text-cyan-400/80 font-mono text-sm md:text-xl tracking-[0.3em] uppercase italic"
    >
      Nano Agente Interface Autônoma
    </motion.p>
  </motion.div>
);
