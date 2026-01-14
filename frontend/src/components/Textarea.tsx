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
  ...props
}: TextareaProps) {
  const [count, setCount] = React.useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCount(e.target.value.length);
    props.onChange?.(e);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-white">{label}</label>
      )}
      <textarea
        {...props}
        maxLength={maxLength}
        onChange={handleChange}
        className={cn(
          'w-full px-4 py-3 rounded-xl resize-none',
          'bg-white/5 border text-white placeholder:text-white/40',
          'focus:outline-none transition-colors',
          error
            ? 'border-red-500 focus:border-red-500'
            : 'border-white/10 focus:border-forge-orange',
          className
        )}
      />
      <div className="flex items-center justify-between">
        {error ? (
          <p className="text-sm text-red-400">{error}</p>
        ) : hint ? (
          <p className="text-sm text-white/40">{hint}</p>
        ) : (
          <span />
        )}
        {showCount && maxLength && (
          <span className="text-sm text-white/40">
            {count}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}
