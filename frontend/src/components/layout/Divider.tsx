"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function Divider({
  orientation = 'horizontal',
  className,
}: DividerProps) {
  return (
    <div
      className={cn(
        'bg-white/10',
        orientation === 'horizontal' ? 'w-full h-px' : 'w-px h-full',
        className
      )}
    />
  );
}
