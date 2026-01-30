"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  date?: string;
  status?: 'completed' | 'current' | 'upcoming';
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
  'aria-label'?: string;
}

export function Timeline({ items, className, 'aria-label': ariaLabel = 'Progress timeline' }: TimelineProps) {
  const completedCount = items.filter(i => i.status === 'completed').length;
  const currentIndex = items.findIndex(i => i.status === 'current');

  return (
    <nav 
      aria-label={ariaLabel}
      className={cn('relative', className)}
    >
      {/* Vertical line - progress indicator */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/10" aria-hidden="true" />
      <div 
        className="absolute left-4 top-0 w-0.5 bg-gradient-to-b from-green-500 to-forge-orange transition-all duration-500" 
        style={{ height: `${((currentIndex >= 0 ? currentIndex : completedCount) / Math.max(items.length - 1, 1)) * 100}%` }}
        aria-hidden="true"
      />

      <ol className="space-y-8" role="list">
        {items.map((item, index) => {
          const isCompleted = item.status === 'completed';
          const isCurrent = item.status === 'current';

          return (
            <li 
              key={item.id} 
              className="relative pl-10"
              aria-current={isCurrent ? 'step' : undefined}
            >
              {/* Dot */}
              <div
                className={cn(
                  'absolute left-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300',
                  isCompleted && 'bg-green-500 shadow-lg shadow-green-500/25',
                  isCurrent && 'bg-forge-orange ring-4 ring-forge-orange/30 animate-pulse',
                  !isCompleted && !isCurrent && 'bg-white/10'
                )}
                aria-hidden="true"
              >
                {isCompleted ? (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-sm font-medium text-white">{index + 1}</span>
                )}
              </div>

              {/* Content */}
              <div>
                <h4 className={cn(
                  'font-medium transition-colors',
                  isCompleted && 'text-green-400',
                  isCurrent && 'text-white',
                  !isCompleted && !isCurrent && 'text-white/50'
                )}>
                  {item.title}
                  {isCompleted && <span className="sr-only"> (completed)</span>}
                  {isCurrent && <span className="sr-only"> (current step)</span>}
                </h4>
                {item.description && (
                  <p className="text-sm text-white/40 mt-1">{item.description}</p>
                )}
                {item.date && (
                  <time className="text-xs text-white/30 mt-2 block">{item.date}</time>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
