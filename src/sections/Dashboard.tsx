"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardNode } from "../components/DashboardNode";
import { ParticlesBackground } from "../components/ParticlesBackground";
import { VideoBackground } from "../components/common/VideoBackground";
import { NeuralConnectionSystem } from "../components/NeuralConnectionSystem";

interface DashboardProps {
  onNavigateToAI?: () => void;
  onNavigateToBlockchain?: () => void;
  onNavigateToMetaverse?: () => void;
  onNavigateToStorytelling?: () => void;
  onNavigateToB2B?: () => void;
  onNavigateToEducation?: () => void;
  onNavigateToHeritage?: () => void;
}

export const Dashboard = ({ onNavigateToAI, onNavigateToBlockchain, onNavigateToMetaverse, onNavigateToStorytelling, onNavigateToB2B, onNavigateToEducation, onNavigateToHeritage }: DashboardProps) => {
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1100;

  const handleVideoTimeUpdate = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    if (video.duration && video.currentTime >= video.duration - 0.2) {
      video.pause();
      if (!isVideoPaused) setIsVideoPaused(true);
    }
  };

  const playEnterSound = () => {
    const audio = new Audio("/audios/enter-effect.mp3");
    audio.volume = 0.4;
    audio.play().catch(e => console.log("Audio play prevented:", e));
  };

  const nodeElements = useMemo(() => {
    if (!isVideoPaused) return null;

    const nodes = [
      // LADO ESQUERDO (4 Nuvens - Aproximadas do centro)
      {
        id: 8, word: "NAIA", onNavigate: undefined,
        pos: isMobile ? { top: "30%", left: "30%" } : (isTablet ? { top: "32%", left: "32%" } : { top: "15%", left: "35%" })
      },
      {
        id: 7, word: "B2B", onNavigate: onNavigateToB2B,
        pos: isMobile ? { top: "42%", left: "25%" } : (isTablet ? { top: "44%", left: "28%" } : { top: "32%", left: "25%" })
      },
      {
        id: 5, word: "HÁ 30 ANOS", onNavigate: onNavigateToHeritage,
        pos: isMobile ? { top: "58%", left: "25%" } : (isTablet ? { top: "56%", left: "28%" } : { top: "52%", left: "25%" })
      },
      {
        id: 6, word: "Curadoria Educacional", onNavigate: onNavigateToEducation,
        pos: isMobile ? { top: "70%", left: "30%" } : (isTablet ? { top: "68%", left: "32%" } : { top: "73%", left: "35%" })
      },

      // LADO DIREITO (4 Nuvens - Aproximadas do centro)
      {
        id: 1, word: "Soluções IA", onNavigate: onNavigateToAI,
        pos: isMobile ? { top: "30%", left: "70%" } : (isTablet ? { top: "32%", left: "68%" } : { top: "15%", left: "65%" })
      },
      {
        id: 2, word: "Blockchain", onNavigate: onNavigateToBlockchain,
        pos: isMobile ? { top: "42%", left: "75%" } : (isTablet ? { top: "44%", left: "72%" } : { top: "32%", left: "75%" })
      },
      {
        id: 3, word: "Metaverso", onNavigate: onNavigateToMetaverse,
        pos: isMobile ? { top: "58%", left: "75%" } : (isTablet ? { top: "56%", left: "72%" } : { top: "52%", left: "75%" })
      },
      {
        id: 4, word: "Storytelling", onNavigate: onNavigateToStorytelling,
        pos: isMobile ? { top: "70%", left: "70%" } : (isTablet ? { top: "68%", left: "68%" } : { top: "73%", left: "65%" })
      }
    ];

    return {
      nodes,
      elements: nodes.map((node, visualIndex) => {
        const nodeNumber = node.id;

        return (
          <motion.div
            key={node.id}
            initial={{
              top: "50%",
              left: "50%",
              opacity: 0,
              scale: 0
            }}
            animate={{
              top: node.pos.top,
              left: node.pos.left,
              opacity: selectedId ? (selectedId === node.id ? 1 : 0) : 1,
              scale: selectedId ? (selectedId === node.id ? 12 : 0) : 1,
              filter: selectedId
                ? (selectedId === node.id ? "blur(40px)" : "blur(20px)")
                : "blur(0px)"
            }}
            exit={{ opacity: 0, scale: 0, filter: "blur(10px)" }}
            transition={{
              top: { duration: 1.2, ease: "easeOut" },
              left: { duration: 1.2, ease: "easeOut" },
              scale: { duration: selectedId === node.id ? 1.5 : 0.8, ease: "easeIn" },
              opacity: { duration: 0.8 },
              default: {
                duration: 0.8,
                delay: selectedId ? 0 : visualIndex * 0.15,
                type: "spring",
                stiffness: 80,
                damping: 12
              }
            }}
            className="absolute z-20 pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 w-[98%] max-w-[250px] sm:max-w-[500px] md:max-w-[1000px]"
          >
            <DashboardNode
              word={node.word}
              nodeNumber={nodeNumber}
              visualIndex={visualIndex}
              isSelected={false}
              hasActiveSelection={false}
              onSelect={(e) => {
                if (selectedId || !node.onNavigate) return;
                e.stopPropagation();
                playEnterSound();
                setSelectedId(node.id);
                setTimeout(() => {
                  if (node.onNavigate) node.onNavigate();
                }, 1300);
              }}
            />
          </motion.div>
        );
      })
    };
  }, [isVideoPaused, isMobile, isTablet, selectedId, onNavigateToAI, onNavigateToBlockchain, onNavigateToMetaverse, onNavigateToStorytelling, onNavigateToEducation, onNavigateToHeritage, onNavigateToB2B]);

  const dashboardContainerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="dashboard"
      className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#050505] py-10 px-8 overflow-hidden"
    >
      {/* Sistema de Partículas Ambiente */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <ParticlesBackground />
      </div>
      {/* Luzes de fundo para ambientação */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-600/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Núcleo Central Pulsante (Sutil) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/5 blur-[80px] rounded-full animate-pulse pointer-events-none" />

      {/* 4. Conteúdo Central - Vídeo Herdado do Hero (Fundo) */}
      <motion.div
        key="video-brain"
        animate={{
          scale: selectedId ? (isMobile ? 1.2 : 1.5) : 1,
          opacity: selectedId ? 0 : 1,
          filter: selectedId ? "blur(20px)" : "blur(0px)"
        }}
        transition={{ duration: 1, ease: "easeIn" }}
        style={{
          willChange: "transform, opacity, filter",
          backfaceVisibility: "hidden"
        }}
        className="absolute inset-0 z-0 w-full h-full bg-black overflow-hidden pointer-events-none"
      >
        <VideoBackground
          ref={videoRef}
          src="/videos/cerebro-engravatado-rodando.mp4"
          onTimeUpdate={handleVideoTimeUpdate}
          loop={false}
          muted={false}
          className="w-full h-full object-cover mix-blend-screen drop-shadow-[0_0_80px_rgba(59,130,246,0.4)]"
        />
        {/* Brilho extra atrás do vídeo para profundidade total */}
        <div className="absolute inset-0 bg-blue-600/10 blur-[200px] rounded-full -z-10" />
      </motion.div>

      <div className="relative w-full h-[85dvh] max-w-[1400px] flex items-center justify-center pointer-events-none mx-auto -mt-10 z-10" ref={dashboardContainerRef}>
        {/* A Teia Neuronal Global conectando o centro aos nós */}
        {isVideoPaused && !selectedId && nodeElements && (
          <NeuralConnectionSystem
            nodes={nodeElements.nodes.map(n => ({ id: n.id, top: n.pos.top, left: n.pos.left }))}
            containerRef={dashboardContainerRef}
          />
        )}

        {/* As Nuvens de Pensamentos (Nodes) */}
        <AnimatePresence>
          {nodeElements?.elements}
        </AnimatePresence>
      </div>
    </section>
  );
};
