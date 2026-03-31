"use client";
import { useState, useEffect } from "react";

/**
 * Hook para detectar se o dispositivo é mobile baseado na largura da janela.
 * @param breakpoint Largura em pixels para o limite mobile (padrão 768px)
 */
export const useMobile = (breakpoint: number = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Executa no mount
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
};
