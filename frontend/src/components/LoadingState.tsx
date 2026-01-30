"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CLASSES = {
  sm: {
    container: 'py-8',
    spinner: 'w-8 h-8',
    text: 'text-sm',
  },
  md: {
    container: 'py-12',
    spinner: 'w-12 h-12',
    text: 'text-base',
  },
  lg: {
    container: 'py-16',
    spinner: 'w-16 h-16',
    text: 'text-lg',
  },
};

export function LoadingState({
  message = 'Loading...',
  size = 'md',
  className,
}: LoadingStateProps) {
  const classes = SIZE_CLASSES[size];

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        classes.container,
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className={cn('relative', classes.spinner)}>
        <div className="absolute inset-0 rounded-full border-2 border-white/10" />
        <div className="absolute inset-0 rounded-full border-2 border-t-forge-orange animate-spin" />
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-forge-orange/20 blur-xl animate-pulse" />
      </div>
      <p className={cn('mt-4 text-white/60', classes.text)}>{message}</p>
      <span className="sr-only">Loading, please wait</span>
    </div>
  );
}
