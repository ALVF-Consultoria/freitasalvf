"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { constellationPosters } from "@/constants/blockchainData";
import { FlyingPosters } from "@/components/FlyingPosters";
import { useMobile } from "@/hooks/useMobile";
import { travelScrollIn, type TravelProps } from "@/lib/travel";

interface FillerNode {
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  floatX: number;
  floatY: number;
}

/**
 * Ruido deterministico: mesma entrada, mesma saida, sem estado global. Entra no
 * lugar do Math.random(), que rodava durante o render e e impuro — proibido pelo
 * React Compiler. De quebra, o campo fica identico no HTML pre-renderizado e na
 * hidratacao, entao nao ha salto na primeira pintura.
 */
const noise = (n: number) => {
  const t = Math.sin(n * 12.9898) * 43758.5453;
  return t - Math.floor(t);
};

const posterItems = constellationPosters.map((poster) => poster.src);

export const TopologyStep = ({ direction }: TravelProps) => {
  const isMobile = useMobile();
  const containerSize = isMobile ? 350 : 800;
  const center = containerSize / 2;
  const spread = isMobile ? 350 : 850;
  // O celular carrega menos da metade dos nos: sao 60 elementos animando em
  // paralelo por cima do holograma, que ja e um campo de milhares de pontos.
  const nodeCount = isMobile ? 24 : 60;

  // O poster e menor que o canvas de proposito. O canvas e a pista: ocupa o anel
  // inteiro para os posteres terem por onde entrar e sair de quadro, enquanto o
  // plano em si para com este tamanho no centro.
  const posterSize = isMobile ? 200 : 360;

  const fillerNodes = useMemo<FillerNode[]>(
    () =>
      Array.from({ length: nodeCount }).map((_, i) => {
        const s = i * 7;
        return {
          x: (noise(s + 1) - 0.5) * spread,
          y: (noise(s + 2) - 0.5) * spread,
          size: noise(s + 3) * 2 + 0.5,
          duration: 3 + noise(s + 4) * 4,
          delay: noise(s + 5) * 5,
          floatX: (noise(s + 6) - 0.5) * 20,
          floatY: (noise(s + 7) - 0.5) * 20,
        };
      }),
    [nodeCount, spread],
  );

  // Malha decorativa: metade dos nos, ligados ao vizinho tres posicoes a frente.
  const meshLines = useMemo(
    () =>
      fillerNodes.slice(0, Math.floor(nodeCount / 2)).map((node, i) => {
        const next = fillerNodes[(i + 3) % fillerNodes.length];
        return {
          key: i,
          x1: center + node.x,
          y1: center + node.y,
          x2: center + next.x,
          y2: center + next.y,
          duration: node.duration,
        };
      }),
    [fillerNodes, nodeCount, center],
  );

  return (
    <motion.div
      variants={travelScrollIn}
      custom={direction}
      initial="enter"
      animate="center"
      exit="exit"
      className="absolute inset-0 z-10 flex items-center justify-center font-mono"
    >
      <div
        className="relative flex items-center justify-center shrink-0"
        style={{ width: containerSize, height: containerSize }}
      >
        {/* Decorative Circles */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border border-amber-500/5 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute inset-10 md:inset-20 border border-amber-500/10 border-dashed rounded-full"
        />

        {/* Malha. Os extremos das linhas sao fixos e so a opacidade pulsa: animar
            x1/y1/x2/y2 obriga o navegador a repintar o SVG inteiro a cada quadro,
            porque geometria de SVG nao e composta pela GPU como transform e
            opacity. Os pontos continuam flutuando — o deslocamento e de ate 10px
            num campo de 800px, com traco de 0.5px a 10% de opacidade. */}
        <svg className="absolute inset-0 pointer-events-none overflow-visible opacity-30">
          {meshLines.map((line) => (
            <motion.line
              key={`mesh-${line.key}`}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-amber-500/10"
              animate={{ opacity: [0.05, 0.2, 0.05] }}
              transition={{
                duration: line.duration,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </svg>

        {/* Decentralized Filler Nodes */}
        {fillerNodes.map((node, i) => (
          <motion.div
            key={`filler-${i}`}
            initial={{ opacity: 0, x: node.x, y: node.y }}
            animate={{
              opacity: [0.1, 0.5, 0.1],
              x: [node.x, node.x + node.floatX, node.x],
              y: [node.y, node.y + node.floatY, node.y],
              scale: [1, 1.4, 1],
            }}
            transition={{
              opacity: {
                duration: node.duration,
                repeat: Infinity,
                delay: node.delay,
              },
              scale: {
                duration: node.duration,
                repeat: Infinity,
                delay: node.delay,
              },
              x: {
                duration: node.duration * 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              },
              y: {
                duration: node.duration * 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            className="absolute bg-amber-500/60 rounded-full"
            style={{ width: node.size, height: node.size }}
          />
        ))}
      </div>

      {/* Os quatro nos do ecossistema, agora posteres, no lugar dos cards que
          orbitavam em 0/90/180/270. Ocupa a area inteira e nao so o anel: a
          pista precisa de altura para o poster entrar e sair de quadro, e o
          scroller de dentro precisa cobrir a tela para receber a roda onde quer
          que o cursor esteja. */}
      <div className="absolute inset-0 z-20">
        <FlyingPosters
          items={posterItems}
          planeWidth={posterSize}
          planeHeight={posterSize}
          /* Chegando por baixo, a pilha nasce no fim, na Solana. Sem isso o
             passo abria no Polygon com o scroller em scrollTop 0 — que e a
             condicao que libera a subida — e uma rolagem para cima saltava os
             quatro posteres de uma vez, em vez de refazer o caminho. */
          startAtEnd={direction < 0}
        />
      </div>

    </motion.div>
  );
};
