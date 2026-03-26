// "use client";

// import { useState } from "react";
// import { motion } from "framer-motion";
// import { DashboardNode } from "../components/DashboardNode";
// import { ParticlesBackground } from "../components/ParticlesBackground";

// interface DashboardProps {
//   onNavigateToAI?: () => void;
//   onNavigateToBlockchain?: () => void;
//   onNavigateToMetaverse?: () => void;
//   onNavigateToStorytelling?: () => void;
//   onNavigateToB2B?: () => void;
//   onNavigateToEducation?: () => void;
//   onNavigateToHeritage?: () => void;
// }

// export const Dashboard = ({ onNavigateToAI, onNavigateToBlockchain, onNavigateToMetaverse, onNavigateToStorytelling, onNavigateToB2B, onNavigateToEducation, onNavigateToHeritage }: DashboardProps) => {
//   const [activeNodeNumber, setActiveNodeNumber] = useState<number | null>(null);

//   const toggleNode = (e: React.MouseEvent, num: number) => {
//     e.stopPropagation();
//     setActiveNodeNumber((prev) => (prev === num ? null : num));
//   };

//   const playEnterSound = () => {
//     const audio = new Audio("/audios/enter-effect.mp3");
//     audio.volume = 0.4;
//     audio.play().catch(e => console.log("Audio play prevented:", e));
//   };

//   return (
//     <section
//       id="dashboard"
//       className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#050505] py-10 px-8 overflow-hidden"
//       onClick={() => setActiveNodeNumber(null)}
//     >
//       {/* Sistema de Partículas Ambiente */}
//       <div className="absolute inset-0 pointer-events-none opacity-40">
//         <ParticlesBackground />
//       </div>
//       {/* Luzes de fundo para ambientação */}
//       <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none" />
//       <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-600/5 blur-[150px] rounded-full pointer-events-none" />

//       {/* Núcleo Central Pulsante (Sutil) */}
//       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/5 blur-[80px] rounded-full animate-pulse pointer-events-none" />

//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 1 }}
//         className="max-w-7xl w-full z-10"
//       >

//         {/* Container Holográfico Mestre (Estilo HUD Imersiva) */}
//         <div className="relative p-16 md:p-28 rounded-[40px] z-10 group/container max-w-7xl w-full mx-auto">

//           {/* 1. Camada de Brilho de Fundo Sutil */}
//           <div className="absolute inset-0 bg-blue-500/5 rounded-[40px] blur-sm -z-10" />

//           {/* 2. Moldura HUD Mestra (Bordas Duplas e Glow) */}
//           <div className="absolute inset-0 rounded-[40px] border-2 border-cyan-400/30 shadow-[0_0_20px_rgba(34,211,238,0.2)] pointer-events-none" />
//           <div className="absolute inset-[-4px] rounded-[44px] border border-cyan-400/10 pointer-events-none" />

//           {/* Cantos Reforçados e Segmentados (Conforme Imagem) */}
//           <div className="absolute -top-1 -left-1 w-24 h-24 border-t-4 border-l-4 border-cyan-400 rounded-tl-[44px] shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
//           <div className="absolute -top-1 -right-1 w-24 h-24 border-t-4 border-r-4 border-cyan-400 rounded-tr-[44px] shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
//           <div className="absolute -bottom-1 -left-1 w-24 h-24 border-b-4 border-l-4 border-cyan-400 rounded-bl-[44px] shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
//           <div className="absolute -bottom-1 -right-1 w-24 h-24 border-b-4 border-r-4 border-cyan-400 rounded-br-[44px] shadow-[0_0_15px_rgba(34,211,238,0.8)]" />

//           {/* Marcadores Laterais (Ticks / Ruler Style) */}
//           <div className="absolute left-[-20px] top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-50">
//             {[...Array(12)].map((_, i) => (
//               <div key={i} className={`h-px bg-cyan-400 ${i % 3 === 0 ? 'w-4' : 'w-2'}`} />
//             ))}
//           </div>
//           <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-50">
//             {[...Array(12)].map((_, i) => (
//               <div key={i} className={`h-px bg-cyan-400 ${i % 3 === 0 ? 'w-4' : 'w-2'}`} />
//             ))}
//           </div>

//           <motion.div
//             variants={{
//               hidden: { opacity: 0 },
//               show: {
//                 opacity: 1,
//                 transition: {
//                   staggerChildren: 0.15,
//                   delayChildren: 0.5
//                 }
//               }
//             }}
//             initial="hidden"
//             animate="show"
//             className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 relative"
//           >
//             {[
//               { id: 1, word: "Soluções IA", onNavigate: onNavigateToAI, color: "bg-cyan-400", shadow: "shadow-[0_0_20px_rgba(34,211,238,0.6)]" },
//               { id: 2, word: "Blockchain", onNavigate: onNavigateToBlockchain, color: "bg-amber-500", shadow: "shadow-[0_0_20px_rgba(245,158,11,0.6)]" },
//               { id: 3, word: "Metaverso", onNavigate: onNavigateToMetaverse, color: "bg-blue-500", shadow: "shadow-[0_0_20px_rgba(59,130,246,0.6)]" },
//               { id: 4, word: "Storytelling", onNavigate: onNavigateToStorytelling, color: "bg-linear-to-r from-purple-500 to-blue-500", shadow: "shadow-[0_0_20px_rgba(168,85,247,0.6)]" },
//               { id: 6, word: "Curadoria Educacional", onNavigate: onNavigateToEducation, color: "bg-indigo-500", shadow: "shadow-[0_0_20px_rgba(99,102,241,0.6)]" },
//               { id: 5, word: "HÁ 30 ANOS", onNavigate: onNavigateToHeritage, color: "bg-amber-600", shadow: "shadow-[0_0_20px_rgba(217,119,6,0.6)]" },
//               { id: 7, word: "B2B", onNavigate: onNavigateToB2B, color: "bg-linear-to-r from-emerald-600 to-emerald-400", shadow: "shadow-[0_0_20px_rgba(16,185,129,0.6)]", textClass: "text-black" }
//             ].map((node, visualIndex) => {
//               const nodeNumber = node.id;
              
//               return (
//                 <motion.div
//                   key={node.id}
//                   variants={{
//                     hidden: { opacity: 0, scale: 0.8, y: 20 },
//                     show: { opacity: 1, scale: 1, y: 0 }
//                   }}
//                   className="relative"
//                 >
//                   <DashboardNode
//                     word={node.word}
//                     nodeNumber={nodeNumber}
//                     visualIndex={visualIndex}
//                     isSelected={activeNodeNumber === nodeNumber}
//                     hasActiveSelection={activeNodeNumber !== null}
//                     onSelect={(e) => toggleNode(e, nodeNumber)}
//                   />

//                   {activeNodeNumber === nodeNumber && (
//                     <motion.button
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         playEnterSound();
//                         node.onNavigate?.();
//                       }}
//                       className={`absolute -bottom-16 left-1/2 z-50 px-6 py-2 ${node.color} ${node.textClass || 'text-white'} font-bold rounded-full text-xs uppercase tracking-widest ${node.shadow} hover:scale-110 active:scale-95 transition-all -translate-x-1/2`}
//                     >
//                       Acessar
//                     </motion.button>
//                   )}
//                 </motion.div>
//               );
//             })}
//           </motion.div>
//         </div>
//       </motion.div>
//     </section>
//   );
// };
