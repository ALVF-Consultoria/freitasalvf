"use client";

import { motion } from "framer-motion";

export const ScrollIndicator = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 1 }}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-50"
    >
      <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
        <motion.div 
          animate={{ 
            y: [0, 12, 0],
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="w-1 h-2 bg-amber-500 rounded-full"
        />
      </div>
      <span className="text-[10px] font-mono text-white/30 tracking-[0.2em] uppercase">Deslize para navegar</span>
    </motion.div>
  );
};
