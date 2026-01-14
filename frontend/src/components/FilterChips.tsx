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
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-full',
        'text-sm font-medium transition-all',
        isActive
          ? 'bg-forge-orange text-white'
          : 'bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-white/20',
        className
      )}
    >
      {label}
      {count !== undefined && (
        <span
          className={cn(
            'px-1.5 py-0.5 rounded-full text-xs',
            isActive ? 'bg-white/20' : 'bg-white/10'
          )}
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
  className?: string;
}

export function FilterChips({
  filters,
  activeFilters,
  onChange,
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
    <div className={cn('flex flex-wrap gap-2', className)}>
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
