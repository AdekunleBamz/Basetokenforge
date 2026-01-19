/**
 * Skeleton Loading Components
 * 
 * Consistent skeleton loaders for various UI elements.
 */

"use client";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-white/10 rounded ${className}`} />
  );
}

/**
 * Token card skeleton
 */
export function TokenCardSkeleton() {
  return (
    <div className="p-6 bg-white/5 border border-white/10 rounded-xl space-y-4">
      {/* Icon and name */}
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
      </div>
      
      {/* Address */}
      <Skeleton className="h-4 w-full" />
    </div>
  );
}

/**
 * Stats section skeleton
 */
export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-4 bg-white/5 rounded-xl space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      ))}
    </div>
  );
}

/**
 * Form skeleton
 */
export function FormSkeleton() {
  return (
    <div className="space-y-6">
      {/* Input fields */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      ))}
      
      {/* Button */}
      <Skeleton className="h-14 w-full rounded-xl" />
    </div>
  );
}

/**
 * Transaction list skeleton
 */
export function TransactionListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}

/**
 * Token list skeleton
 */
export function TokenListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <TokenCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Balance skeleton
 */
export function BalanceSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="w-5 h-5 rounded-full" />
      <Skeleton className="h-5 w-24" />
    </div>
  );
}

/**
 * Network badge skeleton
 */
export function NetworkBadgeSkeleton() {
  return <Skeleton className="h-6 w-20 rounded-full" />;
}

/**
 * Text skeleton with lines
 */
export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`} 
        />
      ))}
    </div>
  );
}

/**
 * Avatar skeleton
 */
export function AvatarSkeleton({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  return <Skeleton className={`${sizeClasses[size]} rounded-full`} />;
}
