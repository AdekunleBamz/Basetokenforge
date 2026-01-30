"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface RadioGroupOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  options: RadioGroupOption[];
  value: string;
  onChange: (value: string) => void;
  name: string;
  label?: string;
  className?: string;
}

export function RadioGroup({
  options,
  value,
  onChange,
  name,
  label,
  className,
}: RadioGroupProps) {
  return (
    <div 
      role="radiogroup" 
      aria-label={label || name}
      className={cn('space-y-3', className)}
    >
      {options.map((option) => {
        const isSelected = value === option.value;
        const descriptionId = option.description ? `${name}-${option.value}-desc` : undefined;
        
        return (
          <label
            key={option.value}
            className={cn(
              'flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all',
              'border',
              option.disabled && 'opacity-50 cursor-not-allowed',
              isSelected
                ? 'bg-forge-orange/10 border-forge-orange/30'
                : 'bg-white/5 border-white/10 hover:border-white/20',
              'focus-within:ring-2 focus-within:ring-forge-orange/50'
            )}
          >
            <div className="relative flex-shrink-0 mt-0.5">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                onChange={() => !option.disabled && onChange(option.value)}
                disabled={option.disabled}
                aria-describedby={descriptionId}
                className="sr-only peer"
              />
              <div
                className={cn(
                  'w-5 h-5 rounded-full border-2 transition-all',
                  isSelected
                    ? 'border-forge-orange'
                    : 'border-white/30 peer-hover:border-white/50'
                )}
              >
                {isSelected && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-forge-orange animate-in zoom-in-50 duration-150" />
                )}
              </div>
            </div>
            <div>
              <p className="font-medium text-white">{option.label}</p>
              {option.description && (
                <p id={descriptionId} className="text-sm text-white/40 mt-1">{option.description}</p>
              )}
            </div>
          </label>
        );
      })}
    </div>
  );
}
