"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  showCount?: boolean;
}

export function Textarea({
  label,
  error,
  hint,
  showCount = false,
  maxLength,
  className,
  id,
  ...props
}: TextareaProps) {
  const [count, setCount] = React.useState(0);
  const inputId = id || React.useId();
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCount(e.target.value.length);
    props.onChange?.(e);
  };

  const isNearLimit = maxLength && count > maxLength * 0.9;

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-white">{label}</label>
      )}
      <textarea
        {...props}
        id={inputId}
        maxLength={maxLength}
        onChange={handleChange}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        className={cn(
          'w-full px-4 py-3 rounded-xl resize-none',
          'bg-white/5 border text-white placeholder:text-white/40',
          'focus:outline-none focus:ring-2 focus:ring-forge-orange/30 transition-all',
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
            : 'border-white/10 focus:border-forge-orange',
          className
        )}
      />
      <div className="flex items-center justify-between">
        {error ? (
          <p id={errorId} className="text-sm text-red-400" role="alert">{error}</p>
        ) : hint ? (
          <p id={hintId} className="text-sm text-white/40">{hint}</p>
        ) : (
          <span />
        )}
        {showCount && maxLength && (
          <span 
            className={cn(
              'text-sm transition-colors',
              isNearLimit ? 'text-forge-orange' : 'text-white/40'
            )}
            aria-live="polite"
          >
            {count}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}
