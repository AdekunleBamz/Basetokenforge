/**
 * Token Verification Badge Component
 * 
 * Shows verification status of a token contract on Basescan.
 */

"use client";

interface VerificationBadgeProps {
  isVerified: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function VerificationBadge({
  isVerified,
  className = '',
  size = 'md',
  showLabel = true,
}: VerificationBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  if (isVerified) {
    return (
      <span
        className={`
          inline-flex items-center gap-1.5 bg-green-500/20 text-green-400 rounded-full font-medium
          ${sizeClasses[size]}
          ${className}
        `}
      >
        <svg
          className={iconSizes[size]}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
        {showLabel && 'Verified'}
      </span>
    );
  }

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 bg-yellow-500/20 text-yellow-400 rounded-full font-medium
        ${sizeClasses[size]}
        ${className}
      `}
    >
      <svg
        className={iconSizes[size]}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      {showLabel && 'Unverified'}
    </span>
  );
}

/**
 * Contract source badge
 */
export function ContractSourceBadge({
  hasSource,
  className = '',
}: {
  hasSource: boolean;
  className?: string;
}) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full font-medium
        ${hasSource ? 'bg-base-blue/20 text-base-blue' : 'bg-white/10 text-white/50'}
        ${className}
      `}
    >
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
      {hasSource ? 'Source Available' : 'No Source'}
    </span>
  );
}

/**
 * Token standard badge
 */
export function TokenStandardBadge({
  standard = 'ERC20',
  className = '',
}: {
  standard?: string;
  className?: string;
}) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full font-medium
        ${className}
      `}
    >
      {standard}
    </span>
  );
}

/**
 * Chain badge for Base
 */
export function BaseBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 text-xs px-2 py-0.5 bg-base-blue/20 text-base-blue rounded-full font-medium
        ${className}
      `}
    >
      <span className="w-2 h-2 rounded-full bg-base-blue" />
      Base
    </span>
  );
}
