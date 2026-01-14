"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface SortDropdownProps {
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SortDropdown({
  options,
  value,
  onChange,
  className,
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
      >
        <span className="text-sm text-white/60">Sort by:</span>
        <span className="text-sm font-medium text-white">{selectedOption?.label}</span>
        <svg
          className={cn('w-4 h-4 text-white/60 transition-transform', isOpen && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 py-2 rounded-xl bg-dark-card border border-white/10 shadow-xl z-50">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full px-4 py-2 text-left text-sm transition-colors',
                  option.value === value
                    ? 'text-forge-orange bg-forge-orange/10'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
