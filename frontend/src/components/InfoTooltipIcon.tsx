"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface InfoTooltipIconProps {
  content: string;
  className?: string;
}

export function InfoTooltipIcon({ content, className }: InfoTooltipIconProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        className={cn(
          'inline-flex items-center justify-center w-4 h-4 rounded-full',
          'bg-white/10 hover:bg-white/20 transition-colors',
          className
        )}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
      >
        <svg
          className="w-3 h-3 text-white/60"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
      {isVisible && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48">
          <div className="px-3 py-2 text-xs text-white bg-dark-card rounded-lg border border-white/10 shadow-lg">
            {content}
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
            <div className="w-2 h-2 bg-dark-card border-r border-b border-white/10 rotate-45" />
          </div>
        </div>
      )}
    </div>
  );
}
