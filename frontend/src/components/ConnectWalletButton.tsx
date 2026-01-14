"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';
import { IconWallet } from '@/components/icons';
import { truncateAddress } from '@/lib/utils/string';

interface ConnectWalletButtonProps {
  isConnected: boolean;
  isConnecting?: boolean;
  address?: string | null;
  onConnect: () => void;
  onDisconnect?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  showAddress?: boolean;
  className?: string;
}

export function ConnectWalletButton({
  isConnected,
  isConnecting = false,
  address,
  onConnect,
  onDisconnect,
  variant = 'primary',
  size = 'md',
  showAddress = true,
  className,
}: ConnectWalletButtonProps) {
  if (isConnected && address && showAddress) {
    return (
      <Button
        variant="secondary"
        size={size}
        onClick={onDisconnect || onConnect}
        className={cn('font-mono', className)}
        leftIcon={<IconWallet size={18} />}
      >
        {truncateAddress(address)}
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={onConnect}
      isLoading={isConnecting}
      className={className}
      leftIcon={!isConnecting ? <IconWallet size={18} /> : undefined}
    >
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  );
}
