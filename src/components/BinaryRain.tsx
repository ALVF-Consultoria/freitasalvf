"use client";

import { motion } from "framer-motion";

export const BinaryRain = () => {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden whitespace-nowrap text-[10px] leading-none uppercase select-none">
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -1000 }}
          animate={{ y: 1000 }}
          transition={{ duration: 15 + Math.random() * 20, repeat: Infinity, ease: "linear", delay: Math.random() * 10 }}
          className="absolute top-0 text-amber-500"
          style={{ left: `${i * 2.5}%` }}
        >
          {Array.from({ length: 120 }).map(() => (Math.random() > 0.5 ? "0" : "1")).join("\n")}
        </motion.div>
      ))}
    </div>
  );
};
