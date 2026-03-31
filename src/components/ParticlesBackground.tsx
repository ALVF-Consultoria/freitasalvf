"use client";

import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { useMobile } from "../hooks/useMobile";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export const ParticlesBackground = () => {
  const isMobile = useMobile();
  const particleCount = isMobile ? 30 : 100;

  const [particles] = useState<Particle[]>(() => {
    return Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1.5, 
      duration: Math.random() * 10 + 10, 
      delay: Math.random() * -20,
    }));
  });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth mouse movement for parallax
  const springX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 30 });

  // Move transformation out of the map/callback
  const layer1X = useTransform(springX, (v) => v * 1);
  const layer1Y = useTransform(springY, (v) => v * 1);
  const layer2X = useTransform(springX, (v) => v * 2);
  const layer2Y = useTransform(springY, (v) => v * 2);
  const layer3X = useTransform(springX, (v) => v * 4);
  const layer3Y = useTransform(springY, (v) => v * 4);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const moveX = (clientX - window.innerWidth / 2) / 25;
      const moveY = (clientY - window.innerHeight / 2) / 25;
      mouseX.set(moveX);
      mouseY.set(moveY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, isMobile]);

  const memoizedLayers = useMemo(() => {
     if (particles.length === 0) return [];
     const activeParticles = particles.slice(0, particleCount);
     const count = activeParticles.length;

     return [
      { p: activeParticles.slice(0, Math.floor(count * 0.4)), x: layer1X, y: layer1Y },
      { p: activeParticles.slice(Math.floor(count * 0.4), Math.floor(count * 0.75)), x: layer2X, y: layer2Y },
      { p: activeParticles.slice(Math.floor(count * 0.75), count), x: layer3X, y: layer3Y },
    ];
  }, [particles, particleCount, layer1X, layer1Y, layer2X, layer2Y, layer3X, layer3Y]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
      {memoizedLayers.map((layer, index) => (
        <motion.div
          key={`layer-${index}`}
          style={{ x: layer.x, y: layer.y }}
          className="absolute inset-[-10%]"
        >
          {layer.p.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0 }}
              animate={{
                y: [0, -20, 0],
                opacity: 0.2, 
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
                boxShadow: isMobile ? "none" : `0 0 ${particle.size * 2}px rgba(34, 211, 238, 0.4)`,
              }}
            />
          ))}
        </motion.div>
      ))}
    </div>
  );
};
