"use client";

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';
import type { InputSize, InputVariant } from '@/types';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  size?: InputSize;
  variant?: InputVariant;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const sizeStyles: Record<InputSize, string> = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3 text-base',
  lg: 'px-5 py-4 text-lg',
};

const variantStyles: Record<InputVariant, string> = {
  default: 'bg-base-gray/50 border-white/10 focus:border-forge-orange/50',
  filled: 'bg-base-gray border-transparent focus:border-forge-orange/50',
  outline: 'bg-transparent border-white/20 focus:border-forge-orange/50',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      size = 'md',
      variant = 'default',
      leftIcon,
      rightIcon,
      fullWidth = true,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-white/80 font-medium text-sm"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full rounded-xl border text-white placeholder-white/40',
              'font-body transition-all duration-300',
              'focus:outline-none focus:ring-2 focus:ring-forge-orange/20',
              sizeStyles[size],
              variantStyles[variant],
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">
              {rightIcon}
            </div>
          )}
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

Input.displayName = 'Input';
