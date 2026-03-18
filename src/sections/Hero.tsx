"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { SvgAnimation } from "@/components/SvgAnimation";
import { ParticlesBackground } from "@/components/ParticlesBackground";

type HeroPhase = "idle" | "frenetic" | "video";

interface HeroProps {
  onTransitionComplete?: () => void;
}

export const Hero = ({ onTransitionComplete }: HeroProps) => {
  const [phase, setPhase] = useState<HeroPhase>("idle");
  const [isFlashing, setIsFlashing] = useState(false);
  const [isGlobalGlitch, setIsGlobalGlitch] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHoveringBg, setIsHoveringBg] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleBrainClick = () => {
    if (phase !== "idle") return;
    
    // Trigger Flash
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 600);
    
    setPhase("frenetic");
    
    // Transição para o vídeo após 1.8 segundos de frenesi
    setTimeout(() => {
      setPhase("video");
    }, 1800);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || phase === "video") return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  // Efeito de Glitch Sincronizado Aleatório
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const triggerGlitch = () => {
      setIsGlobalGlitch(true);
      setTimeout(() => setIsGlobalGlitch(false), 150);

      // Agenda o próximo glitch após um intervalo aleatório (3 a 8 segundos)
      const nextDelay = Math.random() * 5000 + 3000;
      timeoutId = setTimeout(triggerGlitch, nextDelay);
    };

    timeoutId = setTimeout(triggerGlitch, 5000); // Primeiro glitch após 5s

    return () => clearTimeout(timeoutId);
  }, []);

  const handleVideoTimeUpdate = () => {
    if (!videoRef.current || isZooming) return;
    
    const video = videoRef.current;
    // Ativa o zoom 1.5 segundos antes de acabar
    if (video.duration && video.currentTime > video.duration - 1.5) {
      setIsZooming(true);
      // Callback para trocar de seção quando o zoom estiver no auge
      setTimeout(() => {
        onTransitionComplete?.();
      }, 1200);
    }
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHoveringBg(true)}
      onMouseLeave={() => setIsHoveringBg(false)}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#050505]"
    >
      {/* 1. Imagem de Fundo (Camada 0 - Base Escura/P&B) */}
      <motion.div 
        animate={{ 
          opacity: phase === "frenetic" ? 0.05 : 0.15,
          scale: isGlobalGlitch ? 1.15 : (phase === "frenetic" ? 1.05 : 1.1),
          filter: isGlobalGlitch 
            ? "grayscale(100%) brightness(1.5) contrast(150%)" 
            : "grayscale(100%) brightness(0.3) contrast(100%)"
        }}
        transition={{ duration: isGlobalGlitch ? 0.05 : 0.8 }}
        className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
      >
        <Image
          src="/images/Engravatado-sem-fundo.png"
          alt="Hero Background"
          fill
          className="object-contain object-center"
          priority
        />
      </motion.div>

      {/* 1.2 Camada Lanterna (Vivida e Colorida - Spotlight) */}
      <motion.div 
        animate={{ 
          opacity: (isHoveringBg && phase === "idle") ? 1 : 0,
          scale: isGlobalGlitch ? 1.15 : 1.1,
          filter: isGlobalGlitch ? "brightness(1.8) saturate(200%)" : "brightness(1.25) saturate(150%)"
        } as any}
        style={{
          WebkitMaskImage: `radial-gradient(circle 250px at ${mousePos.x}% ${mousePos.y}%, black, transparent)`,
          maskImage: `radial-gradient(circle 250px at ${mousePos.x}% ${mousePos.y}%, black, transparent)`,
        }}
        transition={{ duration: isGlobalGlitch ? 0.05 : 0.3 }}
        className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
      >
        <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay" />
        <Image
          src="/images/Engravatado-sem-fundo.png"
          alt="Hero Background Vivid"
          fill
          className="object-contain object-center scale-110"
          priority
        />
      </motion.div>

      {/* 2. Gradiente (Camada 1) */}
      <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-transparent to-transparent z-1" />

      {/* 3. Partículas (Camada 5) */}
      <AnimatePresence>
        {phase !== "video" && (
          <motion.div
            key="particles"
            animate={{ opacity: phase === "frenetic" ? 0.3 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <ParticlesBackground />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Conteúdo Central (Camada 10/20) */}
      <AnimatePresence mode="wait">
        {phase !== "video" ? (
          <motion.div
            key="svg-brain"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
            transition={{ duration: 0.8 }}
            onClick={handleBrainClick}
            className="relative z-10 w-full max-w-3xl transform scale-75 md:scale-100 flex items-center justify-center cursor-pointer"
          >
            <SvgAnimation isFrenetic={phase === "frenetic"} isGlitching={isGlobalGlitch} />
          </motion.div>
        ) : (
          <motion.div
            key="video-brain"
            initial={{ opacity: 0, scale: 1 }}
            animate={{ 
              opacity: isZooming ? 0 : 1,
              scale: isZooming ? 8 : 1,
              filter: isZooming ? "blur(15px)" : "blur(0px)"
            }}
            transition={{ 
              duration: isZooming ? 1.5 : 1.5, 
              ease: isZooming ? "easeIn" : "easeInOut" 
            }}
            style={{ 
              willChange: "transform, opacity, filter",
              backfaceVisibility: "hidden",
              transform: "translateZ(0)"
            }}
            className="absolute inset-0 z-20 w-screen h-screen bg-black overflow-hidden"
          >
            <video
              ref={videoRef}
              onTimeUpdate={handleVideoTimeUpdate}
              src="/videos/cerebro-engravatado-rodando.mp4"
              autoPlay
              playsInline
              className="w-full h-full object-cover mix-blend-screen drop-shadow-[0_0_80px_rgba(59,130,246,0.4)]"
            />
            {/* Brilho extra atrás do vídeo para profundidade total */}
            <div className="absolute inset-0 bg-blue-600/10 blur-[200px] rounded-full -z-1" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Efeito de Flash (Overlay Branco) */}
      <AnimatePresence>
        {isFlashing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 z-50 bg-white pointer-events-none"
          />
        )}
      </AnimatePresence>
    </section>
  );
};
