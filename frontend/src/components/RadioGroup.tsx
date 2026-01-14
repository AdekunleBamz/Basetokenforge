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
  className?: string;
}

export function RadioGroup({
  options,
  value,
  onChange,
  name,
  className,
}: RadioGroupProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            'flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all',
            'border',
            option.disabled && 'opacity-50 cursor-not-allowed',
            value === option.value
              ? 'bg-forge-orange/10 border-forge-orange/30'
              : 'bg-white/5 border-white/10 hover:border-white/20'
          )}
        >
          <div className="relative flex-shrink-0 mt-0.5">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => !option.disabled && onChange(option.value)}
              disabled={option.disabled}
              className="sr-only"
            />
            <div
              className={cn(
                'w-5 h-5 rounded-full border-2 transition-colors',
                value === option.value
                  ? 'border-forge-orange'
                  : 'border-white/30'
              )}
            >
              {value === option.value && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-forge-orange" />
              )}
            </div>
          </div>
          <div>
            <p className="font-medium text-white">{option.label}</p>
            {option.description && (
              <p className="text-sm text-white/40 mt-1">{option.description}</p>
            )}
          </div>
        </label>
      ))}
    </div>
  );
}
