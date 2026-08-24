"use client";

import { motion } from "framer-motion";
import { ParticleText } from "@/components/ParticleText";
import { Magnet } from "@/components/Magnet";
import { travelFlat, type TravelProps } from "./travel";

/**
 * Passo final da secao. O ParticleText desenha num canvas proprio e roda um
 * requestAnimationFrame continuo (idleDrift), entao viaja pelo travelFlat: um
 * filter no ancestral obrigaria a rerrasterizar o canvas a cada frame.
 */
export const SaibaMaisStep = ({ direction }: TravelProps) => (
  <motion.div
    variants={travelFlat}
    custom={direction}
    initial="enter"
    animate="center"
    exit="exit"
    className="flex flex-col items-center absolute w-full px-4"
  >
    <div className="w-full h-[38vh] min-h-[220px]">
      <ParticleText
        text="NAIA"
        particleSize={2.2}
        density={4}
        color="#f8fafc"
        highlightColor="#8b5cf6"
        scatter={190}
        gatherDuration={1600}
        stagger={420}
        pointerRepel={42}
        repelRadius={120}
        idleDrift={0.8}
        trigger="mount"
        fontSize="clamp(5.25rem, 19.5vw, 13.5rem)"
        fontWeight={800}
        fontFamily="inherit"
        glow
      />
    </div>

    {/* padding = raio do campo (onde o ima comeca a puxar).
        magnetStrength = DIVISOR da distancia, entao menor = mais forte. */}
    {/* Margem negativa em vez de encurtar a caixa do canvas: as particulas
        chegam de ate 190px de distancia (scatter) e uma caixa justa cortaria a
        entrada delas. O botao apenas sobe por cima da parte vazia do canvas. */}
    <Magnet
      padding={100}
      disabled={false}
      magnetStrength={6}
      style={{ marginTop: "clamp(-6rem, -7vh, -1.5rem)" }}
    >
      <button
        type="button"
        className="px-8 md:px-12 py-4 md:py-5 rounded-full border border-violet-500/40 bg-violet-600/10 hover:bg-violet-600/20 text-violet-300 font-mono text-[10px] md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase transition-colors shadow-[0_0_30px_rgba(139,92,246,0.2)]"
      >
        Saiba Mais
      </button>
    </Magnet>
  </motion.div>
);
