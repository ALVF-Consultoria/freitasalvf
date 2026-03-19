"use client";

import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";
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
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth mouse movement for parallax
  const springX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 30 });

  useEffect(() => {
    // 100 partículas sutis e elegantes
    const newParticles = Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1.5, // 1.5px a 3.5px
      duration: Math.random() * 10 + 10, 
      delay: Math.random() * -20,
    }));
    setParticles(newParticles);

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const moveX = (clientX - window.innerWidth / 2) / 25;
      const moveY = (clientY - window.innerHeight / 2) / 25;
      mouseX.set(moveX);
      mouseY.set(moveY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Split particles into 3 layers for parallax depth
  const layers = [
    { p: particles.slice(0, 40), speed: 1 },    // Far
    { p: particles.slice(40, 75), speed: 2 },   // Mid
    { p: particles.slice(75, 100), speed: 4 },  // Near
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
      {layers.map((layer, layerIdx) => (
        <motion.div
          key={`layer-${layerIdx}`}
          style={{ 
            x: useSpring(useTransform(springX, (v) => v * layer.speed)),
            y: useSpring(useTransform(springY, (v) => v * layer.speed))
          }}
          className="absolute inset-[-10%]"
        >
          {layer.p.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0 }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.1, 0.4, 0.1], // Brilho pulsante sutil
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
                boxShadow: `0 0 ${particle.size * 2}px rgba(34, 211, 238, 0.6)`,
              }}
            />
          ))}
        </motion.div>
      ))}
    </div>
  );
};
