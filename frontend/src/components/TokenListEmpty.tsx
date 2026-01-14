"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';

interface TokenListEmptyProps {
  isConnected: boolean;
  onCreateClick?: () => void;
  onConnectClick?: () => void;
  className?: string;
}

export function TokenListEmpty({
  isConnected,
  onCreateClick,
  onConnectClick,
  className,
}: TokenListEmptyProps) {
  return (
    <div className={cn('text-center py-16 px-4', className)}>
      {/* Empty state illustration */}
      <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
        <svg
          className="w-16 h-16 text-white/20"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </div>

      {isConnected ? (
        <>
          <h3 className="font-display font-bold text-xl text-white mb-2">
            No tokens yet
          </h3>
          <p className="text-white/60 mb-6 max-w-sm mx-auto">
            You haven&apos;t created any tokens yet. Start by creating your first token on Base!
          </p>
          {onCreateClick && (
            <Button
              variant="primary"
              onClick={onCreateClick}
              className="px-8"
            >
              Create Your First Token
            </Button>
          )}
        </>
      ) : (
        <>
          <h3 className="font-display font-bold text-xl text-white mb-2">
            Connect to view tokens
          </h3>
          <p className="text-white/60 mb-6 max-w-sm mx-auto">
            Connect your wallet to see your created tokens and create new ones.
          </p>
          {onConnectClick && (
            <Button
              variant="primary"
              onClick={onConnectClick}
              className="px-8"
            >
              Connect Wallet
            </Button>
          )}
        </>
      )}
    </div>
  );
}
