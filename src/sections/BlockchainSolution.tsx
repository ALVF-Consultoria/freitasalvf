"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { ParticlesBackground } from "../components/ParticlesBackground";
import {
  ArrowLeft, Gem, ShieldAlert, Users, Network,
  Cpu, Zap, Layers, Globe, Coins, Terminal, Activity
} from "lucide-react";

interface BlockchainSolutionProps {
  onBack: () => void;
}

const blockchainFeatures = [
  {
    icon: <Gem className="w-8 h-8 text-amber-500" />,
    title: "Tokenização (RWA)",
    description: "Transforme ativos reais do mundo físico em tokens digitais programáveis e fracionáveis.",
  },
  {
    icon: <Cpu className="w-8 h-8 text-amber-500" />,
    title: "Smart Contracts",
    description: "Automação total de processos com contratos inteligentes autoexecutáveis e auditáveis.",
  },
  {
    icon: <Users className="w-8 h-8 text-amber-500" />,
    title: "Governança (DAO)",
    description: "Decisões colegiadas, transparentes e imutáveis através de protocolos descentralizados.",
  },
  {
    icon: <ShieldAlert className="w-8 h-8 text-amber-500" />,
    title: "Segurança On-Chain",
    description: "Proteção máxima de dados e transações com criptografia de ponta e transparência total.",
  }
];

const ecosystemPlatforms = [
  {
    name: "Solana",
    color: "text-purple-400",
    glow: "bg-purple-500/20",
    url: "https://solana.com",
    mission: "Processamento ultraveloz para adoção em massa.",
    description: "Infraestrutura de alta performance com taxas mínimas, permitindo que aplicações alcancem bilhões de usuários sem gargalos técnicos.",
    specs: [
      { l: "TPS_MAX", v: "65,000+" },
      { l: "BLOCK_TIME", v: "400ms" },
      { l: "VALIDATORS", v: "2,000+ ACTIVE" }
    ]
  },
  {
    name: "ChainLink",
    color: "text-blue-500",
    glow: "bg-blue-500/20",
    url: "https://chain.link",
    mission: "Conectando o mundo real aos smart contracts.",
    description: "A rede de oráculos líder que provê dados seguros e auditáveis off-chain para a automação total de processos on-chain.",
    specs: [
      { l: "DATA_FEEDS", v: "1000+ ACTIVE" },
      { l: "NET_VALUE_ENABLE", v: "$10B+" },
      { l: "ORACLE_NODES", v: "DECENTRALIZED" }
    ]
  },
  {
    name: "Polygon",
    color: "text-purple-600",
    glow: "bg-purple-700/20",
    url: "https://polygon.technology",
    mission: "Escalando o ecossistema Ethereum para todos.",
    description: "Uma solução de segunda camada que democratiza o acesso à Web3, mantendo a compatibilidade total com os padrões globais.",
    specs: [
      { l: "L2_SCALING", v: "ZK_PROOFS" },
      { l: "TX_COST", v: "< $0.01" },
      { l: "DA_LAYER", v: "AVALON_CORE" }
    ]
  },
  {
    name: "Arbitrum",
    color: "text-blue-400",
    glow: "bg-blue-400/20",
    url: "https://arbitrum.io",
    mission: "Segurança máxima com eficiência extrema.",
    description: "Rollups otimistas que herdam a robustez do Ethereum enquanto reduzem custos e aumentam a velocidade das transações complexas.",
    specs: [
      { l: "ROLLUP_TYPE", v: "OPTIMISTIC" },
      { l: "SEC_LEVEL", v: "ETHEREUM_L1" },
      { l: "GAS_EFFICIENCY", v: "99% SAVINGS" }
    ]
  }
];

export const BlockchainSolution = ({ onBack }: BlockchainSolutionProps) => {
  const [step, setStep] = useState(1);
  const [showConnections, setShowConnections] = useState(false);
  const lastScrollTime = useRef(0);
  const totalSteps = 12;

  useEffect(() => {
    if (step === 7) {
      const timer = setTimeout(() => setShowConnections(true), 1200);
      return () => {
        clearTimeout(timer);
        setShowConnections(false);
      };
    }
  }, [step]);

  useEffect(() => {
    const handleNavigation = (direction: "next" | "prev") => {
      const now = Date.now();
      if (now - lastScrollTime.current > 800) {
        setStep((prev) => {
          if (direction === "next" && prev < totalSteps) return prev + 1;
          if (direction === "prev" && prev > 1) return prev - 1;
          return prev;
        });
        lastScrollTime.current = now;
      }
    };

    const handleScroll = (e: WheelEvent) => {
      if (e.deltaY > 0) handleNavigation("next");
      else if (e.deltaY < 0) handleNavigation("prev");
    };

    window.addEventListener("wheel", handleScroll);
    return () => window.removeEventListener("wheel", handleScroll);
  }, []);

  return (
    <section className="relative h-screen w-full bg-[#050505] flex items-center justify-center overflow-hidden font-mono text-left selection:bg-amber-500/30 selection:text-amber-200">
      {/* Background Decor: Binary Rain / Data Stream */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden whitespace-nowrap text-[10px] leading-none uppercase select-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -1000 }}
            animate={{ y: 1000 }}
            transition={{ duration: 15 + Math.random() * 20, repeat: Infinity, ease: "linear", delay: Math.random() * 10 }}
            className="absolute top-0 text-amber-500"
            style={{ left: `${i * 2.5}%` }}
          >
            {Array.from({ length: 120 }).map(() => (Math.random() > 0.5 ? "0" : "1")).join("\n")}
          </motion.div>
        ))}
      </div>

      {/* Background Decor: Grid/Particles */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.1)_0.5px,transparent_1px)] bg-size-[40px_40px]" />
        <ParticlesBackground />
      </div>

      {/* Ambient Lights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] bg-amber-500/5 blur-[180px] rounded-full pointer-events-none" />
      
      {/* Dynamic Ambient Glow for Company Detail Steps */}
      {step >= 8 && step <= 11 && (
        <motion.div
          key={`glow-${step}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`absolute inset-0 ${ecosystemPlatforms[step - 8].glow} blur-[120px] pointer-events-none transition-colors duration-1000`}
        />
      )}

      {/* Back Button (Terminal Style) */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        className="absolute top-8 left-8 z-50 flex items-center gap-3 text-amber-500/40 hover:text-amber-400 transition-all group"
      >
        <div className="p-1 px-2 border border-amber-500/20 bg-amber-500/5 backdrop-blur-md font-mono text-[10px] tracking-tighter uppercase whitespace-nowrap">
          [ ESC ] EXIT_BLOCKCHAIN_NODE
        </div>
      </motion.button>

      {/* Sidebar Technical Data (HUD) */}
      <div className="absolute top-0 right-0 h-full w-64 border-l border-amber-500/10 p-8 hidden xl:flex flex-col gap-8 opacity-20 pointer-events-none">
        <div className="space-y-4">
          <span className="block text-[8px] tracking-[0.3em] uppercase underline underline-offset-4 mb-4">Node_Status</span>
          <div className="flex justify-between items-center text-[10px]">
             <span>HASH_RATE</span>
             <span className="text-amber-500">2.4 PH/s</span>
          </div>
          <div className="flex justify-between items-center text-[10px]">
             <span>NET_DIFFICULTY</span>
             <span className="text-amber-500">14.12 T</span>
          </div>
          <div className="flex justify-between items-center text-[10px]">
             <span>ACTIVE_PEERS</span>
             <span className="text-amber-500">4,192</span>
          </div>
        </div>
        <div className="mt-auto space-y-2 text-[8px] leading-relaxed">
          <p>[ SYSTEM_ALERT ]</p>
          <p>D_LEDGER_SYNCHRONIZED_ACTIVE</p>
          <p>BLOCK_GENERATION: OK</p>
          <p>CIP_PROTOCOL: V2.1</p>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-7xl flex items-center justify-center h-full px-12">
        
        {/* STEPS 1-2: TECHNICAL INTRO */}
        <AnimatePresence mode="wait">
          {(step === 1 || step === 2) && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100, filter: "blur(20px)" }}
              className="flex flex-col md:flex-row items-center gap-20 absolute w-full left-12"
            >
              <div className="flex-1 max-w-2xl">
                <motion.span 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-amber-500/40 text-[10px] tracking-[0.5em] uppercase mb-6 block"
                >
                  // Inovação Tecnológica // Blockchain_Module //
                </motion.span>
                <h2 className="text-6xl md:text-9xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-8">
                  <span className="block italic text-transparent stroke-amber-500 stroke-1">Pioneirando a</span>
                  <span className="text-amber-500">Nova Ordem</span> 
                  <span className="block">Digital.</span>
                </h2>
                
                {step >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <p className="text-white/60 text-lg md:text-xl font-light font-sans max-w-xl leading-relaxed">
                      Transformando a segurança em algoritmos. A economia programável não é o futuro, é a infraestrutura do agora.
                    </p>
                    <div className="h-px w-20 bg-amber-500/30" />
                    <div className="text-[10px] text-amber-500/40 tracking-widest uppercase">
                       D_LEDGER :: SMART_CONTRACTS :: RWA_TOKENIZATION
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Status Log (Intro Decor) */}
              <div className="hidden lg:block w-80 p-6 border-l border-amber-500/10 font-mono text-[9px] text-amber-500/20 space-y-2 uppercase select-none opacity-40">
                <p>&gt; Initializing_Blockchain_Subsystem...</p>
                <p>&gt; Connection_Pool: 4_Active_Nodes</p>
                <p>&gt; Protocol_Alpha_V2: Standby</p>
                <p>&gt; Handshake_Complete: Secured</p>
                <p>&gt; Fetching_Ecosystem_Manifest...</p>
                <p>&gt; Memory_Address: 0x7F...3B</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* STEPS 3-6: FEATURE MATRIX */}
        <AnimatePresence mode="wait">
          {(step >= 3 && step <= 6) && (
            <motion.div
              key="matrix"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: 50 }}
              className="w-full flex flex-col md:flex-row gap-12 absolute left-12 right-12"
            >
              <div className="md:w-1/3">
                 <h3 className="text-4xl font-black text-white uppercase tracking-tight mb-4">System <br/><span className="text-amber-500 underline underline-offset-8 decoration-amber-500/30">Capabilities</span></h3>
                 <p className="text-[10px] text-amber-500 opacity-60 uppercase tracking-[0.3em] mb-12">Explorando os fundamentos do protocolo</p>
                 
                 <div className="space-y-3">
                    {blockchainFeatures.map((f, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={step > i + 2 ? { opacity: 1, x: 0 } : { opacity: 0.1 }}
                        className={`text-[9px] uppercase tracking-widest flex items-center gap-3 p-2 border-l-2 transition-all cursor-default ${step === i + 3 ? 'border-amber-500 bg-amber-500/10 text-white' : 'border-white/5'}`}
                      >
                        <span className="opacity-30">0{i+1}</span> {f.title}
                      </motion.div>
                    ))}
                 </div>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                 {blockchainFeatures.map((f, i) => (
                   <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={step > i + 2 ? { opacity: 1, scale: 1 } : { opacity: 0 }}
                      className={`p-10 border ${step === i + 3 ? 'border-amber-500/40 bg-amber-500/5' : 'border-white/5 bg-transparent'} transition-all flex flex-col justify-between`}
                   >
                      <div>
                        <div className="mb-8 opacity-40 scale-125 origin-left">{f.icon}</div>
                        <h4 className="text-xl font-bold text-white mb-4 uppercase tracking-tighter">{f.title}</h4>
                      </div>
                      <p className="text-sm text-white/40 font-sans leading-relaxed italic">
                        {f.description}
                      </p>
                   </motion.div>
                 ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* STEP 7: NETWORK TOPOLOGY MAP */}
        <AnimatePresence mode="wait">
          {step === 7 && (
            <motion.div
              key="topology"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
              className="flex flex-col items-center absolute w-full justify-center"
            >
              <div className="relative w-[600px] h-[600px] flex items-center justify-center">
                 {/* Decorative Circles */}
                 <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border border-amber-500/5 rounded-full" />
                 <motion.div animate={{ rotate: -360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} className="absolute inset-20 border border-amber-500/10 border-dashed rounded-full" />
                 
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
          )}
        </AnimatePresence>

        {/* STEPS 8-11: TECHNICAL SYSTEM ANALYSIS */}
        <AnimatePresence mode="wait">
          {step >= 8 && step <= 11 && (
            <motion.div
              key={`analysis-${step}`}
              initial={{ opacity: 0, skewX: 5 }}
              animate={{ opacity: 1, skewX: 0 }}
              exit={{ opacity: 0, skewX: -5, filter: "blur(20px)" }}
              className="flex flex-col md:flex-row items-center gap-16 absolute left-12 right-12 text-left"
            >
              <div className="md:w-1/2 space-y-12">
                <div className="space-y-2">
                   <div className="flex items-center gap-3">
                      <div className={`w-8 h-px ${ecosystemPlatforms[step-8].color} bg-current opacity-40`} />
                      <span className={`text-[10px] tracking-[0.4em] uppercase ${ecosystemPlatforms[step-8].color}`}>Analysis_Mode_Active</span>
                   </div>
                   <h3 className={`text-6xl md:text-[110px] font-black uppercase tracking-tighter leading-none ${ecosystemPlatforms[step - 8].color} drop-shadow-[0_0_30px_currentColor]`}>
                    {ecosystemPlatforms[step - 8].name}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-8 border-t border-amber-500/10 pt-8 max-w-lg">
                   <div>
                      <span className="block text-[8px] text-white/30 uppercase tracking-widest mb-1">Mission_Report</span>
                      <p className="text-white text-base font-bold italic leading-tight uppercase tracking-tight">
                         "{ecosystemPlatforms[step - 8].mission}"
                      </p>
                   </div>
                   <div className="space-y-2">
                      <span className="block text-[8px] text-white/30 uppercase tracking-widest mb-1">Architecture</span>
                      <p className="text-[10px] text-white/50 leading-relaxed uppercase">
                         {ecosystemPlatforms[step - 8].description}
                      </p>
                   </div>
                </div>
              </div>

              {/* Technical Spec Box */}
              <div className={`flex-1 p-12 border ${ecosystemPlatforms[step-8].color} border-current border-opacity-10 bg-white/5 backdrop-blur-xl relative overflow-hidden group`}>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Terminal className="w-24 h-24" />
                </div>
                <h4 className="text-xs uppercase tracking-[0.5em] mb-12 opacity-40">System_Diagnostics</h4>
                
                <div className="grid grid-cols-1 gap-6 font-mono text-sm">
                   {ecosystemPlatforms[step-8].specs?.map((spec, i) => (
                     <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-white/20 text-[9px] tracking-widest">{spec.l}</span>
                        <span className="text-white tracking-tighter uppercase">{spec.v}</span>
                     </div>
                   ))}
                   <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-white/20 text-[9px] tracking-widest">NETWORK_SYNC</span>
                      <span className="text-white tracking-tighter uppercase">DISTRIBUTED</span>
                   </div>
                </div>
                
                <div className="mt-12 h-12 w-full bg-linear-to-r from-amber-500/10 to-transparent flex items-center px-4 overflow-hidden">
                   <motion.div animate={{ x: [-100, 400] }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} className="text-[8px] whitespace-nowrap opacity-20 tracking-tighter uppercase">
                      0101010101 PROCESSING_LEDGER_DATA 0101010101 SYNCING_NODE_ALPHA 0101010101 0101010101
                   </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* STEP 12: FINAL LEDGER DISCONNECT */}
        <AnimatePresence mode="wait">
          {step === 12 && (
            <motion.div
              key="slogan"
              initial={{ opacity: 0, filter: "blur(50px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              className="flex flex-col items-center absolute max-w-4xl"
            >
              <div className="mb-12 flex items-center justify-center relative">
                 <motion.div 
                   animate={{ rotate: [0, 180, 360], scale: [1, 1.2, 1] }} 
                   transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                   className="absolute w-[200px] h-[200px] border border-amber-500/10 rounded-full"
                 />
                 <Network className="w-24 h-24 text-amber-500 z-10 drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]" />
              </div>
              
              <h2 className="text-4xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none text-center mb-12">
                O Futuro é <br />
                <span className="italic stroke-amber-500/20 stroke-1 text-transparent">Descentralizado.</span>
              </h2>
              
              <div className="space-y-4 flex flex-col items-center">
                <button
                  onClick={onBack}
                  className="group relative px-16 py-6 border border-amber-500/40 bg-transparent hover:bg-amber-500 text-amber-500 hover:text-black font-mono text-sm tracking-[0.5em] uppercase transition-all overflow-hidden"
                >
                  <span className="relative z-10">CLOSE_NODE_SESSION</span>
                  <motion.div className="absolute inset-0 bg-amber-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
                <span className="text-[8px] text-amber-500/20 tracking-widest uppercase">ID_SESSION: BC_FINAL_V1</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* GLOBAL HUD PROGRESS INDICATOR */}
        <div className="fixed bottom-12 right-12 flex flex-col items-end gap-3 pointer-events-none opacity-40">
           <div className="flex gap-1">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div key={i} className={`h-1 w-6 border transition-all ${step === i + 1 ? 'bg-amber-500 border-amber-500 w-12' : 'border-white/10 bg-transparent'}`} />
              ))}
           </div>
           <div className="text-[9px] font-mono uppercase tracking-[0.4em]">
              PROT_BC_SEQ // {step < 10 ? `0${step}` : step}_{totalSteps}
           </div>
        </div>
      </div>

      {/* FOOTER SYSTEM METRICS (Left) */}
      <div className="absolute bottom-6 left-8 flex flex-col gap-1 opacity-20 font-mono text-[8px] text-white pointer-events-none uppercase text-left">
        <span>SYSTEM_PROTOCOL: BC_V1.0</span>
        <span>STATUS: {step === totalSteps ? 'LEDGER_SYNCHRONIZED' : 'VALIDATING_BLOCKS'}</span>
        <div className="flex gap-4 mt-2">
           <span className="text-amber-500">TPS: 65,000+</span>
           <span>LATENCY: 1.2MS</span>
        </div>
      </div>
    </section>
  );
};
