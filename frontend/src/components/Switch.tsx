"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function Switch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className,
}: SwitchProps) {
  const switchId = React.useId();
  
  return (
    <div className={cn('flex items-start gap-3', className)}>
      <button
        type="button"
        role="switch"
        id={switchId}
        aria-checked={checked}
        aria-labelledby={label ? `${switchId}-label` : undefined}
        aria-describedby={description ? `${switchId}-description` : undefined}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          'relative w-11 h-6 rounded-full transition-all flex-shrink-0',
          'focus:outline-none focus:ring-2 focus:ring-forge-orange/50 focus:ring-offset-2 focus:ring-offset-base-dark',
          checked ? 'bg-forge-orange' : 'bg-white/20',
          disabled && 'opacity-50 cursor-not-allowed',
          !disabled && 'cursor-pointer hover:opacity-90'
        )}
      >
        <span
          className={cn(
            'absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-200',
            checked ? 'translate-x-5' : 'translate-x-1'
          )}
        />
      </button>
      {(label || description) && (
        <div className="flex-1">
          {label && (
            <label 
              id={`${switchId}-label`}
              htmlFor={switchId}
              className={cn(
                'text-sm font-medium text-white cursor-pointer',
                disabled && 'cursor-not-allowed'
              )}
            >
              {label}
            </label>
          )}
          {description && (
            <p id={`${switchId}-description`} className="text-sm text-white/40">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
