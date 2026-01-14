"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface ViewToggleProps {
  view: 'grid' | 'list';
  onChange: (view: 'grid' | 'list') => void;
  className?: string;
}

export function ViewToggle({ view, onChange, className }: ViewToggleProps) {
  return (
    <div className={cn('flex rounded-lg bg-white/5 border border-white/10 p-1', className)}>
      <button
        onClick={() => onChange('grid')}
        className={cn(
          'p-2 rounded transition-colors',
          view === 'grid' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'
        )}
        aria-label="Grid view"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      </button>
      <button
        onClick={() => onChange('list')}
        className={cn(
          'p-2 rounded transition-colors',
          view === 'list' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'
        )}
        aria-label="List view"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      </button>
    </div>
  );
}
