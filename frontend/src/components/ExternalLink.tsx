"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface ExternalLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  showIcon?: boolean;
}

export function ExternalLink({
  children,
  showIcon = true,
  className,
  ...props
}: ExternalLinkProps) {
  return (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center gap-1 text-forge-orange hover:text-forge-orange/80 transition-colors',
        className
      )}
    >
      {children}
      {showIcon && (
        <svg
          className="w-4 h-4 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      )}
    </a>
  );
}
