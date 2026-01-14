"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-4 text-center',
        className
      )}
    >
      {icon && (
        <div className="w-20 h-20 mb-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          {icon}
        </div>
      )}
      <h3 className="font-display font-bold text-xl text-white mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-white/60 mb-6 max-w-sm">{description}</p>
      )}
      {action}
    </div>
  );
}
