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
    <span className="text-white/20" aria-hidden>
      /
    </span>
  ),
  className,
}: BreadcrumbsProps) {
  if (!items.length) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn('w-full', className)}>
      <ol className="flex items-center gap-2 text-sm">
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
