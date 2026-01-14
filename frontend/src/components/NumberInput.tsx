"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
  label?: string;
  hint?: string;
  error?: string;
  value: string;
  onValueChange: (value: string) => void;
  onCommit?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  allowDecimals?: boolean;
  allowNegative?: boolean;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
  fullWidth?: boolean;
}

function clampNumber(value: number, min?: number, max?: number) {
  if (typeof min === 'number') value = Math.max(min, value);
  if (typeof max === 'number') value = Math.min(max, value);
  return value;
}

function getStepPrecision(step: number) {
  const asString = String(step);
  const decimals = asString.split('.')[1];
  return decimals ? decimals.length : 0;
}

export function NumberInput({
  label,
  hint,
  error,
  value,
  onValueChange,
  onCommit,
  min,
  max,
  step = 1,
  allowDecimals = true,
  allowNegative = false,
  leftAddon,
  rightAddon,
  fullWidth = true,
  className,
  id,
  disabled,
  ...props
}: NumberInputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const precision = allowDecimals ? getStepPrecision(step) : 0;

  const commitNumber = (next: number) => {
    const clamped = clampNumber(next, min, max);
    const formatted = precision > 0 ? clamped.toFixed(precision) : String(Math.trunc(clamped));
    onValueChange(formatted);
    onCommit?.(clamped);
  };

  const parseCurrent = () => {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
  };

  const handleIncrement = () => {
    if (disabled) return;
    const current = parseCurrent();
    commitNumber(current + step);
  };

  const handleDecrement = () => {
    if (disabled) return;
    const current = parseCurrent();
    commitNumber(current - step);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextRaw = e.target.value;

    // Allow empty so user can edit
    if (nextRaw === '') {
      onValueChange('');
      return;
    }

    // Basic sanitization: keep digits, optional leading -, optional single dot
    let sanitized = nextRaw.replace(/[^0-9.\-]/g, '');

    if (!allowNegative) {
      sanitized = sanitized.replace(/-/g, '');
    } else {
      // keep only one leading '-'
      sanitized = sanitized.replace(/(?!^)-/g, '');
    }

    if (!allowDecimals) {
      sanitized = sanitized.replace(/\./g, '');
    } else {
      const firstDot = sanitized.indexOf('.');
      if (firstDot !== -1) {
        sanitized = sanitized.slice(0, firstDot + 1) + sanitized.slice(firstDot + 1).replace(/\./g, '');
      }
    }

    onValueChange(sanitized);
  };

  const handleCommit = () => {
    const nextRaw = value.trim();

    if (nextRaw === '' || nextRaw === '-' || nextRaw === '.' || nextRaw === '-.') {
      onValueChange('');
      onCommit?.(null);
      return;
    }

    const parsed = Number(nextRaw);
    if (!Number.isFinite(parsed)) {
      onValueChange('');
      onCommit?.(null);
      return;
    }

    commitNumber(parsed);
  };

  return (
    <div className={cn('space-y-2', fullWidth && 'w-full', className)}>
      {label && (
        <label htmlFor={inputId} className="block text-white/80 font-medium text-sm">
          {label}
        </label>
      )}
      <div
        className={cn(
          'flex items-stretch rounded-xl border border-white/10 bg-white/5 overflow-hidden',
          'focus-within:border-forge-orange/50 focus-within:ring-2 focus-within:ring-forge-orange/20',
          disabled && 'opacity-60 pointer-events-none',
          error && 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20'
        )}
      >
        {leftAddon && <div className="px-3 flex items-center text-white/50">{leftAddon}</div>}
        <input
          id={inputId}
          type="text"
          inputMode={allowDecimals ? 'decimal' : 'numeric'}
          value={value}
          onChange={handleChange}
          onBlur={handleCommit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleCommit();
            }
          }}
          disabled={disabled}
          className={cn(
            'flex-1 px-4 py-3 bg-transparent text-white placeholder:text-white/40',
            'outline-none'
          )}
          {...props}
        />
        {rightAddon && <div className="px-3 flex items-center text-white/50">{rightAddon}</div>}
        <div className="flex flex-col border-l border-white/10">
          <button
            type="button"
            onClick={handleIncrement}
            className={cn('px-3 py-1.5 hover:bg-white/10 transition-colors', disabled && 'cursor-not-allowed')}
            aria-label="Increment"
          >
            <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleDecrement}
            className={cn('px-3 py-1.5 hover:bg-white/10 transition-colors border-t border-white/10', disabled && 'cursor-not-allowed')}
            aria-label="Decrement"
          >
            <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {hint && !error && <p className="text-sm text-white/40">{hint}</p>}
    </div>
  );
}
