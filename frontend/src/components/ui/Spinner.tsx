"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'white' | 'gray';
  className?: string;
}

const sizeStyles = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const colorStyles = {
  primary: 'border-forge-orange/20 border-t-forge-orange',
  white: 'border-white/20 border-t-white',
  gray: 'border-gray-500/20 border-t-gray-500',
};

export function Spinner({ size = 'md', color = 'primary', className }: SpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2',
        sizeStyles[size],
        colorStyles[color],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// Full page loading spinner
interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = 'Loading...' }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-dark/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="xl" />
        <p className="text-white/60 font-medium">{message}</p>
      </div>
    </div>
  );
}

// Inline loading state
interface LoadingInlineProps {
  className?: string;
}

export function LoadingInline({ className }: LoadingInlineProps) {
  return (
    <div className={cn('flex items-center justify-center py-8', className)}>
      <Spinner size="lg" />
    </div>
  );
}
