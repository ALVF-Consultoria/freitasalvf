"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export const BackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (isPlaying) return;

    const handleFirstInteraction = () => {
      audioRef.current?.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.log("Autoplay blocked, waiting for interaction:", err);
      });
    };

    // Nem todo caminho comeca num clique: em /solucoes-ia o usuario avanca no
    // scroll. "wheel" nao conta como gesto de ativacao para o autoplay, mas
    // pointerdown/touchend/keydown contam — entao a musica pega em qualquer
    // entrada, inclusive quem abre a rota direto pela URL.
    const events = ["click", "pointerdown", "touchend", "keydown"] as const;
    events.forEach((e) => window.addEventListener(e, handleFirstInteraction));
    return () => {
      events.forEach((e) => window.removeEventListener(e, handleFirstInteraction));
    };
  }, [isPlaying]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-100 flex items-center gap-4">
      <audio
        ref={audioRef}
        src="/audios/background.mp3"
        loop
        playsInline
      />
      <button
        onClick={toggleMute}
        className="p-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all group shadow-2xl"
        title={isMuted ? "Ativar som" : "Desativar som"}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-white/40 group-hover:text-white" />
        ) : (
          <Volume2 className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 animate-pulse" />
        )}
      </button>
    </div>
  );
};
