"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';

interface ShareTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenName: string;
  tokenSymbol: string;
  tokenAddress: string;
  className?: string;
}

export function ShareTokenModal({
  isOpen,
  onClose,
  tokenName,
  tokenSymbol,
  tokenAddress,
  className,
}: ShareTokenModalProps) {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const shareUrl = `https://basescan.org/token/${tokenAddress}`;
  const tweetText = encodeURIComponent(
    `I just created ${tokenName} ($${tokenSymbol}) on @base using @BaseTokenForge! 🔥\n\nCheck it out: ${shareUrl}`
  );
  const farcasterText = encodeURIComponent(
    `Just forged ${tokenName} ($${tokenSymbol}) on Base! 🔥 ${shareUrl}`
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          'relative w-full max-w-md p-6 rounded-2xl bg-dark-card border border-white/10',
          className
        )}
      >
        <h3 className="font-display font-bold text-xl text-white mb-4">
          Share Your Token 🎉
        </h3>
        <p className="text-white/60 text-sm mb-6">
          Let the world know about {tokenName}!
        </p>

        <div className="space-y-3">
          {/* Twitter/X share */}
          <a
            href={`https://twitter.com/intent/tweet?text=${tweetText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 border border-[#1DA1F2]/30 text-[#1DA1F2] transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Share on X
          </a>

          {/* Farcaster share */}
          <a
            href={`https://warpcast.com/~/compose?text=${farcasterText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.25 4C4.45 4 3 5.45 3 7.25v9.5C3 18.55 4.45 20 6.25 20h11.5c1.8 0 3.25-1.45 3.25-3.25v-9.5C21 5.45 19.55 4 17.75 4H6.25z" />
            </svg>
            Share on Farcaster
          </a>

          {/* Copy link */}
          <Button
            variant="secondary"
            onClick={handleCopy}
            className="w-full justify-center"
          >
            {copied ? '✓ Copied!' : 'Copy Link'}
          </Button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
