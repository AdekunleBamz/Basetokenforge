"use client";

import Link from 'next/link';
import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
}

export function Breadcrumbs({
  items,
  separator = (
    <svg className="w-4 h-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  className,
}: BreadcrumbsProps) {
  if (!items.length) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn('w-full', className)}>
      <ol className="flex items-center gap-2 text-sm">
        {/* Home icon at start */}
        <li className="flex items-center gap-2">
          <Link href="/" className="text-white/40 hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="sr-only">Home</span>
          </Link>
          {separator}
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isCurrent = item.current ?? isLast;

          const content = item.href && !isCurrent ? (
            <Link
              href={item.href}
              className={cn(
                'text-white/60 hover:text-white transition-colors',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-forge-orange/30 rounded'
              )}
            >
              {item.label}
            </Link>
          ) : (
            <span
              aria-current={isCurrent ? 'page' : undefined}
              className={cn(isCurrent ? 'text-white/90 font-medium' : 'text-white/60')}
            >
              {item.label}
            </span>
          );

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {content}
              {!isLast && separator}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
