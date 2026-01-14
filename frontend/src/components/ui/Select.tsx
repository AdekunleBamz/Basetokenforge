"use client";

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';
import { IconChevronDown } from '@/components/icons';

interface SelectOption {
  value: string | number;
  label: string;
  description?: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const sizeStyles = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3 text-base',
  lg: 'px-5 py-4 text-lg',
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      hint,
      options,
      size = 'md',
      fullWidth = true,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-white/80 font-medium text-sm"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full rounded-xl border text-white appearance-none cursor-pointer',
              'bg-base-gray/50 border-white/10',
              'font-body transition-all duration-300',
              'focus:outline-none focus:border-forge-orange/50 focus:ring-2 focus:ring-forge-orange/20',
              sizeStyles[size],
              'pr-10',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
              className
            )}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <IconChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
            size={20}
          />
        </div>
        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}
        {hint && !error && (
          <p className="text-white/40 text-sm">{hint}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
