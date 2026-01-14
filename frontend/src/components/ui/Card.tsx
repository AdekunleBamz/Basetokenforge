"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'elevated' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variantStyles = {
  default: 'glass',
  outline: 'bg-transparent border-2 border-white/10',
  elevated: 'glass shadow-xl shadow-black/20',
  interactive: 'glass hover:border-forge-orange/30 hover:-translate-y-1 cursor-pointer',
};

const paddingStyles = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl transition-all duration-300',
        variantStyles[variant],
        paddingStyles[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Card Header
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function CardHeader({
  title,
  description,
  action,
  children,
  className,
  ...props
}: CardHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4 mb-4', className)} {...props}>
      <div>
        {title && (
          <h3 className="font-display font-semibold text-lg text-white">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-white/60 text-sm mt-1">{description}</p>
        )}
        {children}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// Card Content
type CardContentProps = React.HTMLAttributes<HTMLDivElement>;

export function CardContent({ children, className, ...props }: CardContentProps) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
}

// Card Footer
type CardFooterProps = React.HTMLAttributes<HTMLDivElement>;

export function CardFooter({ children, className, ...props }: CardFooterProps) {
  return (
    <div
      className={cn('mt-4 pt-4 border-t border-white/10 flex items-center gap-3', className)}
      {...props}
    >
      {children}
    </div>
  );
}
