"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
  isLoading?: boolean;
}

export function SearchInput({
  onSearch,
  isLoading = false,
  className,
  ...props
}: SearchInputProps) {
  const [value, setValue] = React.useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onSearch?.(newValue);
  };

  const handleClear = () => {
    setValue('');
    onSearch?.('');
  };

  return (
    <div className={cn('relative', className)}>
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        className={cn(
          'w-full pl-10 pr-10 py-3 rounded-xl',
          'bg-white/5 border border-white/10 text-white',
          'placeholder:text-white/40',
          'focus:border-forge-orange focus:outline-none',
          'transition-colors'
        )}
        {...props}
      />
      {value && !isLoading && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
        >
          <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      {isLoading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 border-2 border-white/20 border-t-forge-orange rounded-full animate-spin" />
      )}
    </div>
  );
}
