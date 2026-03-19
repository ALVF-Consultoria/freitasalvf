"use client";

import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

export const DeepSpace = ({ transparent = false }: { transparent?: boolean }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth mouse movement for parallax
  const springX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 30 });

  useEffect(() => {
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

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${transparent ? 'bg-transparent' : 'bg-black'}`}>
      {/* Nebula Layers */}
      <motion.div 
        style={{ x: springX, y: springY }}
        className="absolute inset-[-10%] opacity-30 blur-[120px]"
      >
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] bg-amber-600/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-orange-500/5 rounded-full" />
      </motion.div>

      {/* Far Stars */}
      <motion.div 
        style={{ x: useSpring(useTransform(springX, (v) => v * 1.5)), y: useSpring(useTransform(springY, (v) => v * 1.5)) }}
        className="absolute inset-[-20%] opacity-40"
      >
        {Array.from({ length: 150 }).map((_, i) => (
          <div
            key={`star-far-${i}`}
            className="absolute rounded-full bg-white shadow-[0_0_2px_white]"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: Math.random() * 2 + 0.5,
              height: Math.random() * 2 + 0.5,
              opacity: Math.random() * 0.7 + 0.3
            }}
          />
        ))}
      </motion.div>

      {/* Mid Stars */}
      <motion.div 
        style={{ x: useSpring(useTransform(springX, (v) => v * 2)), y: useSpring(useTransform(springY, (v) => v * 2)) }}
        className="absolute inset-[-30%] opacity-60"
      >
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.div
            key={`star-mid-${i}`}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5 }}
            className="absolute rounded-full bg-amber-200 shadow-[0_0_4px_rgba(251,191,36,0.5)]"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
            }}
          />
        ))}
      </motion.div>

      {/* Near Particles (Dust) */}
      <motion.div 
        style={{ x: useSpring(useTransform(springX, (v) => v * 3)), y: useSpring(useTransform(springY, (v) => v * 3)) }}
        className="absolute inset-[-50%] opacity-20"
      >
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={`dust-${i}`}
            animate={{ rotate: 360 }}
            transition={{ duration: 50 + Math.random() * 50, repeat: Infinity, ease: "linear" }}
            className="absolute w-1 h-1 bg-amber-500/30 blur-[1px]"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </motion.div>

      {/* Scanline Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-size-[100%_4px,3px_100%] pointer-events-none" />
    </div>
  );
};
