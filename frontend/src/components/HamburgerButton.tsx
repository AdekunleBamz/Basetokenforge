"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

export function HamburgerButton({
  isOpen,
  onClick,
  className,
}: HamburgerButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative w-10 h-10 flex items-center justify-center rounded-lg',
        'hover:bg-white/10 transition-colors',
        className
      )}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
    >
      <div className="w-5 h-4 relative">
        <span
          className={cn(
            'absolute left-0 w-5 h-0.5 bg-white transition-all duration-300',
            isOpen ? 'top-1.5 rotate-45' : 'top-0'
          )}
        />
        <span
          className={cn(
            'absolute left-0 top-1.5 w-5 h-0.5 bg-white transition-all duration-300',
            isOpen && 'opacity-0'
          )}
        />
        <span
          className={cn(
            'absolute left-0 w-5 h-0.5 bg-white transition-all duration-300',
            isOpen ? 'top-1.5 -rotate-45' : 'top-3'
          )}
        />
      </div>
    </button>
  );
}
