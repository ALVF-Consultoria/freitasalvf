"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export const ParticlesBackground = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // 100 partículas sutis e elegantes
    const newParticles = Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 2, // 2px a 4px (discreto e premium)
      duration: Math.random() * 10 + 10, 
      delay: Math.random() * -20,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ opacity: 0 }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.1, 0.6, 0.1], // Brilho pulsante sutil
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
          className="absolute rounded-full bg-cyan-400"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            boxShadow: `0 0 ${particle.size * 1.5}px rgba(34, 211, 238, 0.8)`,
          }}
        />
      ))}
    </div>
  );
};
