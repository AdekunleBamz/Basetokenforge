/**
 * Token Share Modal Component
 * 
 * Modal for sharing created tokens on social platforms.
 */

"use client";

import { useState } from "react";
import { 
  SHARE_PLATFORMS, 
  openSharePopup, 
  copyTokenAddress,
  getBasescanUrl,
} from "@/lib/share";
import type { StoredToken } from "@/lib/storage";

interface ShareModalProps {
  token: StoredToken;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareModal({ token, isOpen, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareableToken = {
    name: token.name,
    symbol: token.symbol,
    address: token.address,
    chainId: token.chainId,
  };

  const handleCopy = async () => {
    const success = await copyTokenAddress(token.address);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = (platformId: string) => {
    const platform = SHARE_PLATFORMS.find(p => p.id === platformId);
    if (platform) {
      const url = platform.getUrl(shareableToken);
      openSharePopup(url);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div 
          className="bg-neutral-900 border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Share Token</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Token Preview */}
          <div className="p-4 bg-white/5 rounded-xl mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-base-blue to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold">
                  {token.symbol.slice(0, 2)}
                </span>
              </div>
              <div>
                <p className="font-semibold text-white">{token.name}</p>
                <p className="text-white/60 text-sm">${token.symbol}</p>
              </div>
            </div>
          </div>

          {/* Copy Address */}
          <div className="mb-6">
            <label className="text-sm text-white/60 mb-2 block">Token Address</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={token.address}
                readOnly
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/80 font-mono text-sm"
              />
              <button
                onClick={handleCopy}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-all
                  ${copied 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                  }
                `}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Share Platforms */}
          <div className="space-y-3 mb-6">
            <label className="text-sm text-white/60">Share on</label>
            <div className="grid grid-cols-3 gap-3">
              {SHARE_PLATFORMS.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => handleShare(platform.id)}
                  className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10"
                >
                  {platform.id === 'twitter' && (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" style={{ color: platform.color }}>
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  )}
                  {platform.id === 'warpcast' && (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" style={{ color: platform.color }}>
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  )}
                  {platform.id === 'telegram' && (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" style={{ color: platform.color }}>
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  )}
                  <span className="text-xs text-white/70">{platform.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Basescan Link */}
          <a
            href={getBasescanUrl(token.address, token.chainId)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-base-blue/20 hover:bg-base-blue/30 text-base-blue font-medium rounded-xl transition-colors"
          >
            View on Basescan
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </>
  );
}
