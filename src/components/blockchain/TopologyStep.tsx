"use client";

import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { useState } from "react";
import { ecosystemPlatforms } from "../../constants/blockchainData";
import { useMobile } from "@/hooks/useMobile";

interface TopologyStepProps {
  showConnections: boolean;
}

interface FillerNode {
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  floatX: number;
  floatY: number;
}

export const TopologyStep = ({ showConnections }: TopologyStepProps) => {
  const isMobile = useMobile();
  const containerSize = isMobile ? 350 : 800;
  const center = containerSize / 2;
  const radius = isMobile ? 105 : 280;

  // Estabilizar os nós decorativos com useState (gerado uma única vez)
  const [fillerNodes] = useState<FillerNode[]>(() => Array.from({ length: 60 }).map(() => ({
    x: (Math.random() - 0.5) * (isMobile ? 350 : 850),
    y: (Math.random() - 0.5) * (isMobile ? 350 : 850),
    size: Math.random() * 2 + 0.5,
    duration: 3 + Math.random() * 4,
    delay: Math.random() * 5,
    floatX: (Math.random() - 0.5) * 20,
    floatY: (Math.random() - 0.5) * 20
  })));

  return (
    <motion.div
      key="topology"
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
      className={`flex flex-col items-center justify-center font-mono ${isMobile ? 'pt-8' : 'pt-20'}`}
    >
      <div 
        className="relative flex items-center justify-center"
        style={{ width: containerSize, height: containerSize }}
      >
         {/* Decorative Circles */}
         <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border border-amber-500/5 rounded-full" />
         <motion.div animate={{ rotate: -360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} className="absolute inset-10 md:inset-20 border border-amber-500/10 border-dashed rounded-full" />
         
         {/* Decentralized Mesh Connections */}
         <svg className="absolute inset-0 pointer-events-none overflow-visible opacity-30">
            {fillerNodes.slice(0, 30).map((node, i) => {
              const nextNode = fillerNodes[(i + 3) % fillerNodes.length];
              return (
                <motion.line
                  key={`mesh-${i}`}
                  x1={center + node.x} y1={center + node.y}
                  x2={center + nextNode.x} y2={center + nextNode.y}
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-amber-500/10"
                  animate={{ 
                    opacity: [0.05, 0.2, 0.05],
                    x1: [center + node.x, center + node.x + node.floatX],
                    y1: [center + node.y, center + node.y + node.floatY],
                    x2: [center + nextNode.x, center + nextNode.x + nextNode.floatX],
                    y2: [center + nextNode.y, center + nextNode.y + nextNode.floatY],
                  }}
                  transition={{ duration: node.duration, repeat: Infinity, ease: "linear" }}
                />
              );
            })}
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
                scale: [1, 1.4, 1]
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
            <Activity className={`text-amber-500 mb-2 md:mb-4 animate-pulse ${isMobile ? 'w-10 h-10' : 'w-16 h-16'}`} />
            <h3 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-black text-white uppercase tracking-widest text-center px-4 leading-tight`}>Constellation<br/><span className="text-amber-500">Nodes</span></h3>
         </div>

         {/* Ecosystem Links (Constellation) */}
         {ecosystemPlatforms.map((p, i) => {
            const angles = [0, 90, 180, 270];
            const angle = angles[i] * (Math.PI / 180);
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
                 className={`absolute z-30 p-2 md:p-6 border border-white/10 bg-black/60 backdrop-blur-md flex flex-col items-center gap-1 md:gap-3 hover:border-amber-500 transition-all group ${isMobile ? 'scale-90' : 'scale-100'}`}
                 style={{ 
                   marginLeft: isMobile ? -50 : -80, 
                   marginTop: isMobile ? -30 : -45, 
                   width: isMobile ? 100 : 160 
                 }}
              >
                 <div className={`w-1.5 h-1.5 rounded-full bg-current ${p.color} shadow-[0_0_10px_currentColor]`} />
                 <span className={`${isMobile ? 'text-[10px]' : 'text-xl'} font-black ${p.color} uppercase tracking-tighter`}>{p.name}</span>
                 <span className={`${isMobile ? 'text-[6px]' : 'text-[8px]'} text-white/20 font-mono tracking-widest group-hover:text-amber-500/50 transition-colors uppercase`}>Tap_for_Intel</span>
                 
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
