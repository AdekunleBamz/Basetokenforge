"use client";

import React from 'react';
import { Badge } from '@/components/ui/Badge';

interface NetworkBadgeProps {
  network: 'base' | 'farcaster';
  className?: string;
}

export function NetworkBadge({ network, className }: NetworkBadgeProps) {
  return (
    <Badge
      variant={network === 'base' ? 'info' : 'default'}
      size="sm"
      dot
      pulse
      className={className}
    >
      {network === 'base' ? 'Base Mainnet' : 'Farcaster'}
    </Badge>
  );
}

// Connection status badge
interface ConnectionStatusProps {
  isConnected: boolean;
  isConnecting?: boolean;
  className?: string;
}

export function ConnectionStatus({
  isConnected,
  isConnecting,
  className,
}: ConnectionStatusProps) {
  if (isConnecting) {
    return (
      <Badge variant="warning" size="sm" dot pulse className={className}>
        Connecting...
      </Badge>
    );
  }

  return (
    <Badge
      variant={isConnected ? 'success' : 'default'}
      size="sm"
      dot
      className={className}
    >
      {isConnected ? 'Connected' : 'Not Connected'}
    </Badge>
  );
}

// Transaction status badge
interface TransactionStatusProps {
  status: 'pending' | 'confirming' | 'success' | 'error' | 'idle';
  className?: string;
}

export function TransactionStatus({ status, className }: TransactionStatusProps) {
  const config = {
    idle: { variant: 'default' as const, text: 'Ready' },
    pending: { variant: 'warning' as const, text: 'Pending...' },
    confirming: { variant: 'warning' as const, text: 'Confirming...' },
    success: { variant: 'success' as const, text: 'Success' },
    error: { variant: 'error' as const, text: 'Failed' },
  };

  const { variant, text } = config[status];

  return (
    <Badge
      variant={variant}
      size="sm"
      dot
      pulse={status === 'pending' || status === 'confirming'}
      className={className}
    >
      {text}
    </Badge>
  );
}
