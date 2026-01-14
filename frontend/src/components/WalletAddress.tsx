"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface WalletAddressProps {
  address: string;
  truncate?: boolean;
  showCopy?: boolean;
  className?: string;
}

export function WalletAddress({
  address,
  truncate = true,
  showCopy = true,
  className,
}: WalletAddressProps) {
  const [copied, setCopied] = React.useState(false);

  const displayAddress = truncate
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : address;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <span className="font-mono text-sm text-white/70">{displayAddress}</span>
      {showCopy && (
        <button
          onClick={handleCopy}
          className="p-1 rounded hover:bg-white/10 transition-colors"
          title={copied ? 'Copied!' : 'Copy address'}
        >
          {copied ? (
            <svg
              className="w-4 h-4 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 text-white/40 hover:text-white/70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}
