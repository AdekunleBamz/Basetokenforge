"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils/cn';
import { IconCheck, IconCopy } from '@/components/icons';
import { copyToClipboard } from '@/lib/utils/clipboard';

interface CopyButtonProps {
  text: string;
  className?: string;
  onCopy?: () => void;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'p-1.5',
  md: 'p-2',
  lg: 'p-2.5',
};

const iconSizes = {
  sm: 14,
  md: 16,
  lg: 20,
};

export function CopyButton({
  text,
  className,
  onCopy,
  showText = false,
  size = 'md',
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = async () => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      onCopy?.();
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'inline-flex items-center gap-2 rounded-lg',
        'bg-white/5 hover:bg-white/10 border border-white/10',
        'text-white/60 hover:text-white transition-all duration-200',
        sizeStyles[size],
        className
      )}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
    >
      {copied ? (
        <IconCheck size={iconSizes[size]} className="text-green-400" />
      ) : (
        <IconCopy size={iconSizes[size]} />
      )}
      {showText && (
        <span className="text-sm font-medium">
          {copied ? 'Copied!' : 'Copy'}
        </span>
      )}
    </button>
  );
}

// Address display with copy
interface AddressDisplayProps {
  address: string;
  truncate?: boolean;
  showFull?: boolean;
  className?: string;
}

export function AddressDisplay({
  address,
  truncate = true,
  showFull = false,
  className,
}: AddressDisplayProps) {
  const displayAddress = truncate && !showFull
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : address;

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <code className="font-mono text-sm text-white/80">{displayAddress}</code>
      <CopyButton text={address} size="sm" />
    </div>
  );
}
