/**
 * Token Details Page Component
 * 
 * Full page view of a created token with all details.
 */

"use client";

import { useNetwork, useBasescanUrl } from "@/context/NetworkContext";
import type { StoredToken } from "@/lib/storage";

interface TokenDetailsPageProps {
  token: StoredToken;
  onBack?: () => void;
}

export function TokenDetailsPage({ token, onBack }: TokenDetailsPageProps) {
  const { networkName } = useNetwork();
  const basescan = useBasescanUrl();

  const formatSupply = (supply: string) => {
    const num = parseFloat(supply);
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toLocaleString();
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/5 rounded-xl transition-colors"
          >
            <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-base-blue to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {token.symbol.slice(0, 2)}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{token.name}</h1>
              <p className="text-white/60">${token.symbol}</p>
            </div>
          </div>
        </div>
        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
          Deployed
        </span>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
          <p className="text-white/60 text-sm mb-1">Total Supply</p>
          <p className="text-xl font-bold text-white">{formatSupply(token.initialSupply)}</p>
        </div>
        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
          <p className="text-white/60 text-sm mb-1">Decimals</p>
          <p className="text-xl font-bold text-white">{token.decimals}</p>
        </div>
        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
          <p className="text-white/60 text-sm mb-1">Network</p>
          <p className="text-xl font-bold text-base-blue">{networkName}</p>
        </div>
      </div>

      {/* Contract Details */}
      <div className="p-6 bg-white/5 rounded-2xl border border-white/10 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Contract Details</h2>
        
        <div className="space-y-4">
          <div>
            <label className="text-white/60 text-sm">Token Address</label>
            <div className="flex items-center gap-2 mt-1">
              <code className="flex-1 px-3 py-2 bg-black/30 rounded-lg text-white/80 font-mono text-sm break-all">
                {token.address}
              </code>
              <a
                href={basescan.token(token.address)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-base-blue/20 hover:bg-base-blue/30 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-base-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <label className="text-white/60 text-sm">Transaction Hash</label>
            <div className="flex items-center gap-2 mt-1">
              <code className="flex-1 px-3 py-2 bg-black/30 rounded-lg text-white/80 font-mono text-sm break-all">
                {token.transactionHash}
              </code>
              <a
                href={basescan.tx(token.transactionHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-base-blue/20 hover:bg-base-blue/30 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-base-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <label className="text-white/60 text-sm">Created</label>
            <p className="text-white mt-1">{formatDate(token.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <a
          href={basescan.token(token.address)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 px-4 py-3 bg-base-blue hover:bg-base-blue/90 text-white font-semibold rounded-xl text-center transition-colors"
        >
          View on Basescan
        </a>
        <button
          onClick={() => {
            navigator.clipboard.writeText(token.address);
          }}
          className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-colors"
        >
          Copy Address
        </button>
      </div>
    </div>
  );
}
