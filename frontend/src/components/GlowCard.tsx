"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface GlowCardProps {
  children: React.ReactNode;
  glowColor?: 'orange' | 'blue' | 'purple' | 'green';
  className?: string;
}

const GLOW_COLORS = {
  orange: 'hover:shadow-[0_0_40px_rgba(237,137,54,0.3)]',
  blue: 'hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]',
  purple: 'hover:shadow-[0_0_40px_rgba(168,85,247,0.3)]',
  green: 'hover:shadow-[0_0_40px_rgba(34,197,94,0.3)]',
};

const BORDER_COLORS = {
  orange: 'hover:border-forge-orange/50',
  blue: 'hover:border-blue-500/50',
  purple: 'hover:border-purple-500/50',
  green: 'hover:border-green-500/50',
};

export function GlowCard({
  children,
  glowColor = 'orange',
  className,
}: GlowCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-2xl p-6',
        'bg-white/5 border border-white/10',
        'transition-all duration-500',
        GLOW_COLORS[glowColor],
        BORDER_COLORS[glowColor],
        className
      )}
    >
      {children}
    </div>
  );
}
