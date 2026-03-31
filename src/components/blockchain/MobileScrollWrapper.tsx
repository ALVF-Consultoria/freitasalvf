"use client";

import React from "react";
import { useMobile } from "@/hooks/useMobile";

interface MobileScrollWrapperProps {
  children: React.ReactNode;
  maxHeight?: string;
  className?: string;
  accentColor?: string; // Aceita nomes ou Hex
}

export const MobileScrollWrapper = ({ 
  children, 
  maxHeight = "75vh", 
  className = "",
  accentColor = "#f59e0b"
}: MobileScrollWrapperProps) => {
  const isMobile = useMobile();

  if (!isMobile) {
    return <>{children}</>;
  }

  // Mapeamento de cores conhecidas ou uso direto de HEX
  const getScrollColor = () => {
    if (accentColor === "solana") return "#14F195";
    if (accentColor === "amber") return "#f59e0b";
    return accentColor; // Assume que é um HEX
  };

  const scrollbarColor = getScrollColor();

  return (
    <div 
      className={`w-full overflow-y-auto pr-2 custom-mobile-scroll ${className}`}
      style={{ 
        maxHeight,
        scrollbarWidth: 'thin',
        scrollbarColor: `${scrollbarColor}20 transparent`
      } as React.CSSProperties}
    >
      <style jsx>{`
        .custom-mobile-scroll::-webkit-scrollbar {
          width: 2px;
        }
        .custom-mobile-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-mobile-scroll::-webkit-scrollbar-thumb {
          background: ${scrollbarColor}40;
          border-radius: 10px;
        }
      `}</style>
      {children}
    </div>
  );
};
