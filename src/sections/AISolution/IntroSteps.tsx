"use client";

import { motion } from "framer-motion";
import { DepthText } from "@/components/DepthText";

// Telas de conceito herdadas do antigo AITransition. Abrem a secao antes do
// conteudo numerado comecar.

export const IntroQuote = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5, filter: "blur(20px)" }}
    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
    exit={{ opacity: 0, scale: 1.5, filter: "blur(30px)" }}
    transition={{ duration: 1.5, ease: "easeOut" }}
    className="flex flex-col items-center absolute w-full max-w-4xl px-4"
  >
    <h2 className="text-2xl md:text-4xl font-light text-white leading-relaxed tracking-tight italic">
      &quot;Indo muito além das limitadas IAs <span className="text-cyan-400/50">(pseudo inteligência artificial)</span>, nossa <span className="text-cyan-400 font-bold">Interface Autônoma</span>, gera integração da necessidade com as soluções.&quot;
    </h2>
  </motion.div>
);

export const IntroBrand = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, y: 30 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 1.2, filter: "blur(20px)" }}
    transition={{ duration: 1, ease: "easeOut" }}
    className="flex flex-col items-center absolute w-full px-4 text-center"
  >
    {/* O h3 fica so como semantica: tamanho, peso e sombra vem das variaveis CSS
        do DepthText. Tirei o drop-shadow que estava aqui de proposito — um filter
        no ancestral forca rerrasterizar as 35 camadas de texto a cada frame, e o
        stage gira em requestAnimationFrame. O halo agora e o shadow do proprio
        componente, tirado do depthColor. */}
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
