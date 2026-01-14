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
};

export function GradientText({
  children,
  gradient = 'orange',
  className,
  as: Component = 'span',
}: GradientTextProps) {
  return (
    <Component
      className={cn(
        'bg-gradient-to-r bg-clip-text text-transparent',
        GRADIENTS[gradient],
        className
      )}
    >
      {children}
    </Component>
  );
}
