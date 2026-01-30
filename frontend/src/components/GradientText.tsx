"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface GradientTextProps {
  children: React.ReactNode;
  gradient?: 'orange' | 'blue' | 'purple' | 'rainbow';
  className?: string;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
}

const GRADIENTS = {
  orange: 'from-forge-orange via-yellow-400 to-forge-orange',
  blue: 'from-blue-400 via-cyan-400 to-blue-500',
  purple: 'from-purple-400 via-pink-400 to-purple-500',
  rainbow: 'from-red-400 via-yellow-400 to-green-400',
  gold: 'from-yellow-400 via-amber-400 to-yellow-500',
  green: 'from-green-400 via-emerald-400 to-green-500',
};

export function GradientText({
  children,
  gradient = 'orange',
  className,
  as: Component = 'span',
  animate = false,
}: GradientTextProps & { animate?: boolean }) {
  return (
    <Component
      className={cn(
        'bg-gradient-to-r bg-clip-text text-transparent',
        GRADIENTS[gradient],
        animate && 'animate-gradient bg-[length:200%_auto]',
        className
      )}
    >
      {children}
    </Component>
  );
}
