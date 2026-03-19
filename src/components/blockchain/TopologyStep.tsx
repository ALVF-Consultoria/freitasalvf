"use client";

import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { useMemo } from "react";
import { ecosystemPlatforms } from "../../constants/blockchainData";

interface TopologyStepProps {
  showConnections: boolean;
}

export const TopologyStep = ({ showConnections }: TopologyStepProps) => {
  // Estabilizar os nós decorativos com useMemo para evitar que "pulem" em cada render
  const fillerNodes = useMemo(() => Array.from({ length: 60 }).map((_, i) => ({
    x: (Math.random() - 0.5) * 650,
    y: (Math.random() - 0.5) * 650,
    size: Math.random() * 2 + 0.5,
    duration: 3 + Math.random() * 4,
    delay: Math.random() * 5,
    floatX: (Math.random() - 0.5) * 20,
    floatY: (Math.random() - 0.5) * 20
  })), []);

  return (
    <motion.div
      key="topology"
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
      className="flex flex-col items-center justify-center font-mono pt-20"
    >
      <div className="relative w-[600px] h-[600px] flex items-center justify-center">
         {/* Decorative Circles */}
         <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border border-amber-500/5 rounded-full" />
         <motion.div animate={{ rotate: -360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} className="absolute inset-20 border border-amber-500/10 border-dashed rounded-full" />
         
         {/* Decentralized Mesh Connections */}
         <svg className="absolute inset-0 pointer-events-none overflow-visible opacity-30">
           {fillerNodes.slice(0, 30).map((node, i) => {
             const nextNode = fillerNodes[(i + 3) % fillerNodes.length];
             return (
               <motion.line
                 key={`mesh-${i}`}
                 x1={300 + node.x} y1={300 + node.y}
                 x2={300 + nextNode.x} y2={300 + nextNode.y}
                 stroke="currentColor"
                 strokeWidth="0.5"
                 className="text-amber-500/10"
                 animate={{ 
                   opacity: [0.05, 0.2, 0.05],
                   x1: [300 + node.x, 300 + node.x + node.floatX],
                   y1: [300 + node.y, 300 + node.y + node.floatY],
                   x2: [300 + nextNode.x, 300 + nextNode.x + nextNode.floatX],
                   y2: [300 + nextNode.y, 300 + nextNode.y + nextNode.floatY],
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
            <Activity className="w-12 h-12 text-amber-500 mb-4 animate-pulse" />
            <h3 className="text-2xl font-black text-white uppercase tracking-widest text-center px-4 leading-tight">Constellation<br/><span className="text-amber-500">Nodes</span></h3>
         </div>

         {/* Ecosystem Links (Constellation) */}
         {ecosystemPlatforms.map((p, i) => {
           const angles = [0, 90, 180, 270];
           const angle = angles[i] * (Math.PI / 180);
           const radius = 220;
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
                className={`absolute z-30 p-4 border border-white/10 bg-black/60 backdrop-blur-md flex flex-col items-center gap-2 hover:border-amber-500 transition-all group scale-75 md:scale-100`}
                style={{ marginLeft: -60, marginTop: -40, width: 120 }}
             >
                <div className={`w-1 h-1 rounded-full bg-current ${p.color} shadow-[0_0_10px_currentColor]`} />
                <span className={`text-base font-black ${p.color} uppercase`}>{p.name}</span>
                <span className="text-[6px] text-white/20 font-mono tracking-widest group-hover:text-amber-500/50 transition-colors uppercase">Tap_for_Intel</span>
                
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
      <p className="mt-8 text-amber-500/40 text-[10px] uppercase tracking-[0.5em] animate-pulse">// Sincronizando_Ecossistema_Global //</p>
    </motion.div>
  );
};
