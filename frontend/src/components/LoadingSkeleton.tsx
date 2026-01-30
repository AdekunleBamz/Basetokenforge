"use client";

import { ReactNode } from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "rounded";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

export function Skeleton({
  className = "",
  variant = "text",
  width,
  height,
  animation = "pulse",
}: SkeletonProps) {
  const baseClasses = "bg-white/10";
  
  const variantClasses = {
    text: "rounded h-4",
    circular: "rounded-full",
    rectangular: "",
    rounded: "rounded-xl",
  };

  const animationClasses = {
    pulse: "animate-pulse",
    wave: "skeleton-wave",
    none: "",
  };

  const style: React.CSSProperties = {
    width: width ? (typeof width === "number" ? `${width}px` : width) : undefined,
    height: height ? (typeof height === "number" ? `${height}px` : height) : undefined,
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

// Pre-built skeleton layouts
export function TokenCardSkeleton() {
  return (
    <div className="card-forge flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-pulse">
      {/* Token Icon */}
      <Skeleton variant="rounded" width={48} height={48} animation="none" />

      {/* Token Info */}
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton variant="text" width="60%" height={20} animation="none" />
        <Skeleton variant="text" width="40%" height={16} animation="none" />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Skeleton variant="rounded" width={90} height={36} animation="none" />
        <Skeleton variant="rounded" width={110} height={36} animation="none" />
      </div>
    </div>
  );
}

export function TokenListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <TokenCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-8 max-w-xl mx-auto animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="text-center space-y-2">
          <Skeleton variant="text" width="80%" height={40} className="mx-auto" animation="none" />
          <Skeleton variant="text" width="60%" height={14} className="mx-auto" animation="none" />
        </div>
      ))}
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="card-forge space-y-6 animate-pulse">
      {/* Field 1 */}
      <div className="space-y-2">
        <Skeleton variant="text" width={100} height={16} animation="none" />
        <Skeleton variant="rounded" height={56} animation="none" />
      </div>
      {/* Field 2 */}
      <div className="space-y-2">
        <Skeleton variant="text" width={120} height={16} animation="none" />
        <Skeleton variant="rounded" height={56} animation="none" />
      </div>
      {/* Field 3 */}
      <div className="space-y-2">
        <Skeleton variant="text" width={80} height={16} animation="none" />
        <Skeleton variant="rounded" height={56} animation="none" />
      </div>
      {/* Button */}
      <Skeleton variant="rounded" height={56} animation="none" />
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="text-center space-y-8 animate-pulse">
      {/* Badge */}
      <Skeleton variant="rounded" width={180} height={36} className="mx-auto" animation="none" />
      
      {/* Headline */}
      <div className="space-y-4">
        <Skeleton variant="text" width="50%" height={64} className="mx-auto" animation="none" />
        <Skeleton variant="text" width="40%" height={64} className="mx-auto" animation="none" />
      </div>
      
      {/* Subtitle */}
      <div className="space-y-2 max-w-2xl mx-auto">
        <Skeleton variant="text" width="80%" height={24} className="mx-auto" animation="none" />
        <Skeleton variant="text" width="60%" height={24} className="mx-auto" animation="none" />
      </div>
      
      {/* CTA Button */}
      <Skeleton variant="rounded" width={240} height={56} className="mx-auto" animation="none" />
    </div>
  );
}

// Skeleton wrapper for conditional rendering
interface SkeletonWrapperProps {
  isLoading: boolean;
  skeleton: ReactNode;
  children: ReactNode;
}

export function SkeletonWrapper({ isLoading, skeleton, children }: SkeletonWrapperProps) {
  return <>{isLoading ? skeleton : children}</>;
}
