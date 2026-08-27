"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { VideoBackground } from "@/components/common/VideoBackground";

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
    if (video.duration && video.currentTime > video.duration - 0.8) {
      setStep(2); 
      setTimeout(onComplete, 400); 
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
            transition={{ duration: 0.8, ease: "easeIn" }}
            className="absolute inset-0 w-full h-screen flex items-center justify-center"
          >
            <VideoBackground
              ref={videoRef}
              src="/videos/blockchin.mp4"
              onTimeUpdate={handleVideoTimeUpdate}
              loop={false}
              className="opacity-80"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
