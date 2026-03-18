"use client";

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/cn';

interface CardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, padding = 'md', ...props }, ref) => {
    const paddings = {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-10',
    };

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          'glass-morphism rounded-3xl overflow-hidden',
          paddings[padding],
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

export { Card };
