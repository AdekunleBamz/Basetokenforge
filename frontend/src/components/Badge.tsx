/**
 * Badge Component
 * 
 * Status and label badges for Base Token Forge.
 * Used for token status, network indicators, and more.
 */

"use client";

import { ReactNode } from "react";

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'base';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  icon?: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-white/10 text-white/80 border-white/10',
  success: 'bg-green-500/10 text-green-400 border-green-500/20',
  warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  error: 'bg-red-500/10 text-red-400 border-red-500/20',
  info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  base: 'bg-base-blue/10 text-base-blue border-base-blue/20',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs rounded',
  md: 'px-2.5 py-1 text-xs rounded-md',
  lg: 'px-3 py-1.5 text-sm rounded-lg',
};

const dotStyles: Record<BadgeVariant, string> = {
  default: 'bg-white/60',
  success: 'bg-green-400',
  warning: 'bg-yellow-400',
  error: 'bg-red-400',
  info: 'bg-blue-400',
  base: 'bg-base-blue',
};

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  icon,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium border
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[variant]} animate-pulse`} />
      )}
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
}

/**
 * Network Badge - Shows current chain
 */
interface NetworkBadgeComponentProps {
  chainId?: number;
  showIcon?: boolean;
  size?: BadgeSize;
}

const NETWORK_INFO: Record<number, { name: string; color: string }> = {
  8453: { name: 'Base', color: 'base' },
  84532: { name: 'Base Sepolia', color: 'info' },
  1: { name: 'Ethereum', color: 'default' },
  11155111: { name: 'Sepolia', color: 'default' },
};

export function ChainBadge({ chainId = 8453, showIcon = true, size = 'md' }: NetworkBadgeComponentProps) {
  const network = NETWORK_INFO[chainId] || { name: 'Unknown', color: 'default' };

  return (
    <Badge 
      variant={network.color as BadgeVariant} 
      size={size}
      icon={showIcon ? (
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" />
        </svg>
      ) : undefined}
    >
      {network.name}
    </Badge>
  );
}

/**
 * Status Badge - For transaction/token status
 */
type StatusType = 'pending' | 'confirmed' | 'failed' | 'created';

interface StatusBadgeProps {
  status: StatusType;
  size?: BadgeSize;
}

const STATUS_CONFIG: Record<StatusType, { label: string; variant: BadgeVariant; dot: boolean }> = {
  pending: { label: 'Pending', variant: 'warning', dot: true },
  confirmed: { label: 'Confirmed', variant: 'success', dot: false },
  failed: { label: 'Failed', variant: 'error', dot: false },
  created: { label: 'Created', variant: 'base', dot: false },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <Badge variant={config.variant} size={size} dot={config.dot}>
      {config.label}
    </Badge>
  );
}

/**
 * Gas Badge - Shows gas estimation level
 */
type GasLevel = 'low' | 'medium' | 'high';

interface GasBadgeProps {
  level: GasLevel;
  gwei?: number;
}

const GAS_CONFIG: Record<GasLevel, { label: string; variant: BadgeVariant }> = {
  low: { label: 'Low', variant: 'success' },
  medium: { label: 'Medium', variant: 'warning' },
  high: { label: 'High', variant: 'error' },
};

export function GasBadge({ level, gwei }: GasBadgeProps) {
  const config = GAS_CONFIG[level];

  return (
    <Badge variant={config.variant} size="sm">
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
      </svg>
      {config.label}
      {gwei && <span className="opacity-70">({gwei} gwei)</span>}
    </Badge>
  );
}

/**
 * Supply Badge - For token supply display
 */
interface SupplyBadgeProps {
  type: 'fixed' | 'mintable' | 'burnable';
}

const SUPPLY_CONFIG: Record<string, { label: string; variant: BadgeVariant; icon: string }> = {
  fixed: { label: 'Fixed Supply', variant: 'info', icon: '🔒' },
  mintable: { label: 'Mintable', variant: 'success', icon: '➕' },
  burnable: { label: 'Burnable', variant: 'warning', icon: '🔥' },
};

export function SupplyBadge({ type }: SupplyBadgeProps) {
  const config = SUPPLY_CONFIG[type];

  return (
    <Badge variant={config.variant} size="sm">
      <span className="text-xs">{config.icon}</span>
      {config.label}
    </Badge>
  );
}

/**
 * New/Coming Soon Badge
 */
interface LabelBadgeProps {
  type: 'new' | 'coming-soon' | 'beta' | 'pro';
}

const LABEL_CONFIG: Record<string, { label: string; variant: BadgeVariant }> = {
  'new': { label: 'New', variant: 'success' },
  'coming-soon': { label: 'Coming Soon', variant: 'info' },
  'beta': { label: 'Beta', variant: 'warning' },
  'pro': { label: 'Pro', variant: 'base' },
};

export function LabelBadge({ type }: LabelBadgeProps) {
  const config = LABEL_CONFIG[type];

  return (
    <Badge variant={config.variant} size="sm">
      {config.label}
    </Badge>
  );
}

/**
 * Count Badge - Shows a number (notifications, items, etc.)
 */
interface CountBadgeProps {
  count: number;
  max?: number;
  variant?: BadgeVariant;
}

export function CountBadge({ count, max = 99, variant = 'base' }: CountBadgeProps) {
  const displayCount = count > max ? `${max}+` : count.toString();

  return (
    <Badge variant={variant} size="sm" className="min-w-[1.5rem] justify-center">
      {displayCount}
    </Badge>
  );
}
