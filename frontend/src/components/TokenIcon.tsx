"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface TokenIconProps {
  symbol: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  imageUrl?: string;
  className?: string;
}

const SIZE_CLASSES = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-20 h-20 text-2xl',
};

export function TokenIcon({
  symbol,
  size = 'md',
  imageUrl,
  className,
}: TokenIconProps) {
  const [imageError, setImageError] = React.useState(false);
  const initials = symbol.slice(0, 2).toUpperCase();

  // Generate consistent color based on symbol
  const colorIndex = symbol.charCodeAt(0) % 5;
  const colors = [
    'from-forge-orange to-yellow-500',
    'from-blue-500 to-cyan-400',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-400',
    'from-red-500 to-orange-400',
  ];

  if (imageUrl && !imageError) {
    return (
      <img
        src={imageUrl}
        alt={symbol}
        className={cn(
          'rounded-full object-cover',
          SIZE_CLASSES[size],
          className
        )}
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full bg-gradient-to-br flex items-center justify-center font-bold text-white',
        SIZE_CLASSES[size],
        colors[colorIndex],
        className
      )}
    >
      {initials}
    </div>
  );
}
