"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface NetworkBadgeProps {
  chainId: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const NETWORKS: Record<number, { name: string; color: string; icon: string; bgColor: string }> = {
  1: { name: 'Ethereum', color: 'bg-blue-500', bgColor: 'bg-blue-500/10 border-blue-500/30', icon: '⟠' },
  8453: { name: 'Base', color: 'bg-blue-600', bgColor: 'bg-blue-600/10 border-blue-600/30', icon: '🔵' },
  84532: { name: 'Base Sepolia', color: 'bg-blue-400', bgColor: 'bg-blue-400/10 border-blue-400/30', icon: '🔵' },
  137: { name: 'Polygon', color: 'bg-purple-500', bgColor: 'bg-purple-500/10 border-purple-500/30', icon: '⬡' },
  10: { name: 'Optimism', color: 'bg-red-500', bgColor: 'bg-red-500/10 border-red-500/30', icon: '🔴' },
  42161: { name: 'Arbitrum', color: 'bg-blue-700', bgColor: 'bg-blue-700/10 border-blue-700/30', icon: '🔷' },
};

const SIZE_CLASSES = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-sm px-3 py-1 gap-1.5',
  lg: 'text-base px-4 py-2 gap-2',
};

export function NetworkBadge({
  chainId,
  showLabel = true,
  size = 'md',
  className,
}: NetworkBadgeProps) {
  const network = NETWORKS[chainId] || {
    name: `Chain ${chainId}`,
    color: 'bg-gray-500',
    bgColor: 'bg-gray-500/10 border-gray-500/30',
    icon: '?',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border',
        SIZE_CLASSES[size],
        network.bgColor,
        className
      )}
    >
      <span
        className={cn(
          'flex-shrink-0 rounded-full',
          network.color,
          size === 'sm' && 'w-2 h-2',
          size === 'md' && 'w-2.5 h-2.5',
          size === 'lg' && 'w-3 h-3'
        )}
      />
      {showLabel && (
        <span className="text-white/80">{network.name}</span>
      )}
    </span>
  );
}
