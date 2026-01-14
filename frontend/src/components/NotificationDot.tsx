"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface NotificationDotProps {
  count?: number;
  showCount?: boolean;
  className?: string;
}

export function NotificationDot({
  count = 0,
  showCount = true,
  className,
}: NotificationDotProps) {
  if (count === 0) return null;

  const displayCount = count > 99 ? '99+' : count.toString();

  return (
    <span
      className={cn(
        'absolute -top-1 -right-1 flex items-center justify-center',
        'min-w-5 h-5 px-1 rounded-full',
        'bg-red-500 text-white text-xs font-bold',
        'animate-pulse',
        className
      )}
    >
      {showCount ? displayCount : ''}
    </span>
  );
}
