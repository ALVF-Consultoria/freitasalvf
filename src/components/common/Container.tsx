"use client";

import React from 'react';
import { cn } from '@/utils/cn';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  // Restrito a elementos que aceitam className: React.ElementType puro inclui os
  // elementos three.js que o react-three-fiber adiciona a JSX.IntrinsicElements.
  as?: React.ElementType<{ className?: string }>;
}

export const Container = ({
  children,
  className,
  as: Component = 'div',
}: ContainerProps) => {
  return (
    <Component
      className={cn(
        'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8',
        className
      )}
    >
      {children}
    </Component>
  );
};
