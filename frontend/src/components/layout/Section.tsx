"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface SectionProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  titleClassName?: string;
  className?: string;
}

export function Section({
  children,
  title,
  subtitle,
  titleClassName,
  className,
}: SectionProps) {
  return (
    <section className={cn('py-12 sm:py-16 lg:py-20', className)}>
      {(title || subtitle) && (
        <div className="text-center mb-12">
          {title && (
            <h2
              className={cn(
                'font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-4',
                titleClassName
              )}
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
