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
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn('relative', className)}>
      {/* Vertical line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/10" />

      <div className="space-y-8">
        {items.map((item, index) => {
          const isCompleted = item.status === 'completed';
          const isCurrent = item.status === 'current';

          return (
            <div key={item.id} className="relative pl-10">
              {/* Dot */}
              <div
                className={cn(
                  'absolute left-0 w-8 h-8 rounded-full flex items-center justify-center',
                  isCompleted && 'bg-green-500',
                  isCurrent && 'bg-forge-orange ring-4 ring-forge-orange/30',
                  !isCompleted && !isCurrent && 'bg-white/10'
                )}
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
                <h4 className={cn('font-medium', isCurrent ? 'text-white' : 'text-white/70')}>
                  {item.title}
                </h4>
                {item.description && (
                  <p className="text-sm text-white/40 mt-1">{item.description}</p>
                )}
                {item.date && (
                  <p className="text-xs text-white/30 mt-2">{item.date}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
