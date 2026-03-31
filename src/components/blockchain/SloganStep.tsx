"use client";

import { motion } from "framer-motion";
import { Network } from "lucide-react";

export const SloganStep = () => {
  return (
    <motion.div
      key="slogan"
      initial={{ opacity: 0, filter: "blur(50px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      className="flex flex-col items-center max-w-4xl font-mono pt-10"
    >
      <div className="mb-12 flex items-center justify-center relative">
        <motion.div
          animate={{ rotate: [0, 180, 360], scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute w-[200px] h-[200px] border border-amber-500/10 rounded-full"
        />
        <Network className="w-24 h-24 text-amber-500 z-10 drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]" />
      </div>

      <h2 className="text-4xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none text-center mb-12">
        O Futuro é <br />
        <span className="italic stroke-amber-500/20 stroke-1">Descentralizado.</span>
      </h2>

      <div className="space-y-4 flex flex-col items-center">
        <a
          href="https://x.com/FreitasALVF"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative px-16 py-6 border border-amber-500/40 bg-transparent hover:bg-amber-500 text-amber-500 hover:text-black font-mono text-sm tracking-[0.5em] uppercase transition-all overflow-hidden flex items-center justify-center no-underline"
        >
          <span className="relative z-10">CONNECT_ON_X</span>
          <motion.div className="absolute inset-0 bg-amber-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </a>
        <span className="text-[8px] text-amber-500/20 tracking-widest uppercase">NODE_STATUS: READY_FOR_CONNECTION</span>
      </div>
    </motion.div>
  );
};
