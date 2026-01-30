"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface FilterChipProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  count?: number;
  className?: string;
}

export function FilterChip({
  label,
  isActive,
  onClick,
  count,
  className,
}: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      aria-pressed={isActive}
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-full',
        'text-sm font-medium transition-all',
        'focus:outline-none focus:ring-2 focus:ring-forge-orange/50 focus:ring-offset-2 focus:ring-offset-forge-dark',
        isActive
          ? 'bg-forge-orange text-white shadow-lg shadow-forge-orange/25'
          : 'bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-white/20 hover:bg-white/10',
        className
      )}
    >
      {label}
      {count !== undefined && (
        <span
          className={cn(
            'px-1.5 py-0.5 rounded-full text-xs tabular-nums',
            isActive ? 'bg-white/20' : 'bg-white/10'
          )}
          aria-label={`${count} items`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

interface FilterChipsProps {
  filters: Array<{ id: string; label: string; count?: number }>;
  activeFilters: string[];
  onChange: (filters: string[]) => void;
  label?: string;
  className?: string;
}

export function FilterChips({
  filters,
  activeFilters,
  onChange,
  label = 'Filter options',
  className,
}: FilterChipsProps) {
  const toggleFilter = (id: string) => {
    if (activeFilters.includes(id)) {
      onChange(activeFilters.filter((f) => f !== id));
    } else {
      onChange([...activeFilters, id]);
    }
  };

  return (
    <div 
      role="group" 
      aria-label={label}
      className={cn('flex flex-wrap gap-2', className)}
    >
      {filters.map((filter) => (
        <FilterChip
          key={filter.id}
          label={filter.label}
          count={filter.count}
          isActive={activeFilters.includes(filter.id)}
          onClick={() => toggleFilter(filter.id)}
        />
      ))}
    </div>
  );
}
