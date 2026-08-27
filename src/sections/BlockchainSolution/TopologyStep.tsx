"use client";

import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ecosystemPlatforms } from "@/constants/blockchainData";
import { useMobile } from "@/hooks/useMobile";
import { travelFlat, type TravelProps } from "@/lib/travel";

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

export const TopologyStep = ({ direction }: TravelProps) => {
  const isMobile = useMobile();
  const containerSize = isMobile ? 350 : 800;
  const center = containerSize / 2;
  const radius = isMobile ? 105 : 280;
  const spread = isMobile ? 350 : 850;
  // O celular carrega menos da metade dos nos: sao 60 elementos animando em
  // paralelo por cima do ParticlesBackground, que ja e outro campo animado.
  const nodeCount = isMobile ? 24 : 60;

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
    [nodeCount, spread]
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
    [fillerNodes, nodeCount, center]
  );

  // As ligacoes ate o centro so aparecem depois que a constelacao assentou.
  const [showConnections, setShowConnections] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShowConnections(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      variants={travelFlat}
      custom={direction}
      initial="enter"
      animate="center"
      exit="exit"
      className={`flex flex-col items-center justify-center font-mono ${isMobile ? "pt-8" : "pt-20"}`}
    >
      <div
        className="relative flex items-center justify-center"
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
              transition={{ duration: line.duration, repeat: Infinity, ease: "linear" }}
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
              opacity: { duration: node.duration, repeat: Infinity, delay: node.delay },
              scale: { duration: node.duration, repeat: Infinity, delay: node.delay },
              x: { duration: node.duration * 1.5, repeat: Infinity, ease: "easeInOut" },
              y: { duration: node.duration * 1.5, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute bg-amber-500/60 rounded-full"
            style={{ width: node.size, height: node.size }}
          />
        ))}

        {/* Central Node */}
        <div className="relative z-20 flex flex-col items-center">
          <Activity className={`text-amber-500 mb-2 md:mb-4 animate-pulse ${isMobile ? "w-10 h-10" : "w-16 h-16"}`} />
          <h3 className={`${isMobile ? "text-xl" : "text-3xl"} font-black text-white uppercase tracking-widest text-center px-4 leading-tight`}>
            Constellation<br />
            <span className="text-amber-500">Nodes</span>
          </h3>
        </div>

        {/* Ecosystem Links (Constellation) */}
        {ecosystemPlatforms.map((p, i) => {
          const angle = [0, 90, 180, 270][i] * (Math.PI / 180);
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <motion.a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={{ opacity: 1, x, y }}
              transition={{ delay: i * 0.1, duration: 1, type: "spring" }}
              className={`absolute z-30 p-2 md:p-6 border border-white/10 bg-black/60 backdrop-blur-md flex flex-col items-center gap-1 md:gap-3 hover:border-amber-500 transition-all group ${isMobile ? "scale-90" : "scale-100"}`}
              style={{
                marginLeft: isMobile ? -50 : -80,
                marginTop: isMobile ? -30 : -45,
                width: isMobile ? 100 : 160,
              }}
            >
              <div className={`w-1.5 h-1.5 rounded-full bg-current ${p.color} shadow-[0_0_10px_currentColor]`} />
              <span className={`${isMobile ? "text-[10px]" : "text-xl"} font-black ${p.color} uppercase tracking-tighter`}>{p.name}</span>
              <span className={`${isMobile ? "text-[6px]" : "text-[8px]"} text-white/20 font-mono tracking-widest group-hover:text-amber-500/50 transition-colors uppercase`}>Tap_for_Intel</span>

              {/* SVG Connection to Center */}
              {showConnections && (
                <svg className="absolute top-1/2 left-1/2 pointer-events-none -z-10 overflow-visible" style={{ width: 0, height: 0 }}>
                  <motion.line
                    x1={0} y1={0} x2={-x} y2={-y}
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    className={p.color + " opacity-20"}
                  />
                </svg>
              )}
            </motion.a>
          );
        })}
      </div>
      <p className="mt-20 md:mt-12 text-amber-500/40 text-[9px] md:text-[10px] uppercase tracking-[0.5em] animate-pulse text-center px-6">
        {"// Sincronizando_Ecossistema_Global //"}
      </p>
    </motion.div>
  );
};
