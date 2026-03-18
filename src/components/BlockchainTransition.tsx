"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";

interface BlockchainTransitionProps {
  onComplete: () => void;
}

export const BlockchainTransition = ({ onComplete }: BlockchainTransitionProps) => {
  const [step, setStep] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoTimeUpdate = () => {
    if (!videoRef.current || step !== 1) return;
    const video = videoRef.current;
    
    // Inicia a transição para a conclusão automaticamente perto do fim do vídeo
    if (video.duration && video.currentTime > video.duration - 0.5) {
      setStep(2); // Muda para o passo de saída para acionar o onExitComplete ou apenas para efeito
      setTimeout(onComplete, 800); // Aguarda o tempo do zoom/fade
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050505] flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="video-step"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 8, filter: "blur(20px)" }}
            transition={{ duration: 1.2, ease: "easeIn" }}
            className="relative w-full h-screen flex items-center justify-center"
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              onTimeUpdate={handleVideoTimeUpdate}
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            >
              <source src="/videos/blockchin.mp4" type="video/mp4" />
            </video>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
