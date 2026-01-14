"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: { icon: 'w-8 h-8', text: 'text-lg' },
  md: { icon: 'w-10 h-10', text: 'text-xl' },
  lg: { icon: 'w-12 h-12', text: 'text-2xl' },
};

export function Logo({ size = 'md', showText = true, className }: LogoProps) {
  const styles = sizeStyles[size];

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        className={cn(
          'rounded-xl bg-gradient-to-br from-forge-orange to-forge-gold',
          'flex items-center justify-center',
          styles.icon
        )}
      >
        <svg
          className="w-3/5 h-3/5 text-base-dark"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>
      {showText && (
        <div>
          <h1 className={cn('font-display font-bold text-white', styles.text)}>
            Token Forge
          </h1>
        </div>
      )}
    </div>
  );
}

// Animated logo for loading states
export function LogoAnimated({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-forge-orange to-forge-gold flex items-center justify-center animate-pulse-glow">
        <svg
          className="w-10 h-10 text-base-dark animate-float"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>
    </div>
  );
}
