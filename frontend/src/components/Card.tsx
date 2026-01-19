/**
 * Card Component
 * 
 * Flexible card components with Base chain styling.
 * Supports multiple variants for different use cases.
 */

"use client";

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'glass' | 'bordered' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

const variantStyles = {
  default: 'bg-white/5 border border-white/5',
  glass: 'bg-white/5 backdrop-blur-xl border border-white/10',
  bordered: 'bg-transparent border border-white/10',
  elevated: 'bg-gradient-to-br from-white/10 to-white/5 border border-white/10 shadow-xl shadow-black/20',
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
  className = '',
  onClick,
  hoverable = false,
}: CardProps) {
  const isClickable = !!onClick || hoverable;

  return (
    <div
      onClick={onClick}
      className={`
        rounded-2xl transition-all duration-200
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${isClickable ? 'cursor-pointer hover:border-white/20 hover:bg-white/10' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

/**
 * Card Header
 */
interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function CardHeader({ title, subtitle, action, icon }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-4">
      <div className="flex items-start gap-3">
        {icon && (
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-base-blue/20 flex items-center justify-center text-base-blue">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {subtitle && (
            <p className="text-sm text-white/60 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

/**
 * Card Footer
 */
interface CardFooterProps {
  children: ReactNode;
  border?: boolean;
  className?: string;
}

export function CardFooter({ children, border = true, className = '' }: CardFooterProps) {
  return (
    <div
      className={`
        mt-4 pt-4 flex items-center justify-end gap-3
        ${border ? 'border-t border-white/5' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

/**
 * Stat Card - For displaying metrics on Base
 */
interface StatCardProps {
  label: string;
  value: string | number;
  change?: {
    value: number;
    direction: 'up' | 'down';
  };
  icon?: ReactNode;
  variant?: 'default' | 'highlight';
}

export function StatCard({ label, value, change, icon, variant = 'default' }: StatCardProps) {
  return (
    <Card
      variant={variant === 'highlight' ? 'elevated' : 'default'}
      padding="md"
      className={variant === 'highlight' ? 'border-base-blue/30' : ''}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-white/60 mb-1">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {change && (
            <p className={`text-xs mt-2 flex items-center gap-1 ${
              change.direction === 'up' ? 'text-green-400' : 'text-red-400'
            }`}>
              {change.direction === 'up' ? (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
              {Math.abs(change.value)}%
            </p>
          )}
        </div>
        {icon && (
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            variant === 'highlight' 
              ? 'bg-base-blue/20 text-base-blue' 
              : 'bg-white/5 text-white/60'
          }`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}

/**
 * Token Display Card
 */
interface TokenCardDisplayProps {
  name: string;
  symbol: string;
  supply?: string;
  address?: string;
  imageUrl?: string;
  onClick?: () => void;
}

export function TokenCardDisplay({
  name,
  symbol,
  supply,
  address,
  imageUrl,
  onClick,
}: TokenCardDisplayProps) {
  return (
    <Card variant="glass" padding="md" onClick={onClick} hoverable>
      <div className="flex items-center gap-4">
        {/* Token icon */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-base-blue to-blue-600 flex items-center justify-center overflow-hidden">
          {imageUrl ? (
            <img src={imageUrl} alt={symbol} className="w-full h-full object-cover" />
          ) : (
            <span className="text-lg font-bold text-white">{symbol.slice(0, 2)}</span>
          )}
        </div>

        {/* Token info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white truncate">{name}</h4>
          <p className="text-sm text-white/60">${symbol}</p>
        </div>

        {/* Supply */}
        {supply && (
          <div className="text-right">
            <p className="text-sm text-white/60">Supply</p>
            <p className="font-medium text-white">{supply}</p>
          </div>
        )}
      </div>

      {/* Address */}
      {address && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <p className="text-xs text-white/40 font-mono truncate">{address}</p>
        </div>
      )}
    </Card>
  );
}

/**
 * Feature Card
 */
interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  href?: string;
}

export function FeatureCard({ icon, title, description, href }: FeatureCardProps) {
  const content = (
    <>
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-base-blue/20 to-blue-600/10 flex items-center justify-center text-base-blue mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-white/60">{description}</p>
    </>
  );

  if (href) {
    return (
      <a href={href} className="block">
        <Card variant="bordered" padding="md" hoverable>
          {content}
        </Card>
      </a>
    );
  }

  return (
    <Card variant="bordered" padding="md">
      {content}
    </Card>
  );
}
