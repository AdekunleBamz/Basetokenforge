"use client";

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils/cn';
import { IconInfo } from '@/components/icons';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

const positionStyles = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

const arrowStyles = {
  top: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-t-base-gray border-x-transparent border-b-transparent',
  bottom: 'top-0 left-1/2 -translate-x-1/2 -translate-y-full border-b-base-gray border-x-transparent border-t-transparent',
  left: 'right-0 top-1/2 -translate-y-1/2 translate-x-full border-l-base-gray border-y-transparent border-r-transparent',
  right: 'left-0 top-1/2 -translate-y-1/2 -translate-x-full border-r-base-gray border-y-transparent border-l-transparent',
};

export function Tooltip({
  content,
  children,
  position = 'top',
  delay = 200,
  className,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {isVisible && (
        <div
          className={cn(
            'absolute z-50 px-3 py-2 rounded-lg bg-base-gray border border-white/10',
            'text-sm text-white whitespace-nowrap shadow-lg',
            'animate-in fade-in duration-150',
            positionStyles[position],
            className
          )}
          role="tooltip"
        >
          {content}
          <div
            className={cn(
              'absolute border-4',
              arrowStyles[position]
            )}
          />
        </div>
      )}
    </div>
  );
}

// Info tooltip - common use case
interface InfoTooltipProps {
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function InfoTooltip({ content, position = 'top' }: InfoTooltipProps) {
  return (
    <Tooltip content={content} position={position}>
      <button type="button" className="text-white/40 hover:text-white/60 transition-colors">
        <IconInfo size={16} />
      </button>
    </Tooltip>
  );
}
