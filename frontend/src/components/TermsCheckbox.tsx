"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface TermsCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  className?: string;
}

export function TermsCheckbox({
  checked,
  onChange,
  error,
  className,
}: TermsCheckboxProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <label className="flex items-start gap-3 cursor-pointer group">
        <div className="relative flex-shrink-0 mt-0.5">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="sr-only"
          />
          <div
            className={cn(
              'w-5 h-5 rounded border-2 transition-all duration-200',
              'flex items-center justify-center',
              checked
                ? 'bg-forge-orange border-forge-orange'
                : 'bg-transparent border-white/30 group-hover:border-white/50',
              error && 'border-red-500'
            )}
          >
            {checked && (
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
        </div>
        <span className="text-sm text-white/70 leading-relaxed">
          I agree to the{' '}
          <a href="/terms" className="text-forge-orange hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-forge-orange hover:underline">
            Privacy Policy
          </a>
        </span>
      </label>
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
