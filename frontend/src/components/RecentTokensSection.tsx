/**
 * Recent Tokens Section Component
 * 
 * Displays recently created tokens from the factory.
 */

"use client";

import { useRecentTokens } from "@/context/TokenContext";
import { useBasescanUrl } from "@/context/NetworkContext";

export function RecentTokensSection() {
  const recentTokens = useRecentTokens(6);
  const basescan = useBasescanUrl();

  const formatSupply = (supply: string) => {
    const num = parseFloat(supply);
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (recentTokens.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Recently Created</h2>
            <p className="text-white/60">Tokens you&apos;ve deployed on Base</p>
          </div>
          <a
            href="#my-tokens"
            className="text-base-blue hover:text-base-blue/80 font-medium transition-colors"
          >
            View All →
          </a>
        </div>

        {/* Token Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentTokens.map((token) => (
            <a
              key={token.address}
              href={basescan.token(token.address)}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-5 bg-white/5 border border-white/10 rounded-xl hover:border-base-blue/30 transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-start gap-4">
                {/* Token icon */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-base-blue to-purple-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">
                    {token.symbol.slice(0, 2)}
                  </span>
                </div>

                {/* Token info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white truncate group-hover:text-base-blue transition-colors">
                      {token.name}
                    </h3>
                    <span className="text-xs text-white/40 flex-shrink-0">
                      {formatTimeAgo(token.createdAt)}
                    </span>
                  </div>
                  <p className="text-white/60 text-sm mb-2">
                    ${token.symbol}
                  </p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-white/50">
                      Supply: <span className="text-white/70 font-mono">{formatSupply(token.initialSupply)}</span>
                    </span>
                    <span className="text-white/50">
                      Decimals: <span className="text-white/70 font-mono">{token.decimals}</span>
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <svg
                  className="w-5 h-5 text-white/20 group-hover:text-base-blue transition-colors flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Empty state for when user has no tokens
 */
export function NoTokensYet() {
  return (
    <div className="text-center py-16 px-4">
      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
        <svg
          className="w-10 h-10 text-white/30"
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
      <h3 className="text-xl font-semibold text-white mb-2">No Tokens Yet</h3>
      <p className="text-white/60 mb-6 max-w-sm mx-auto">
        Create your first ERC-20 token on Base in just a few clicks.
      </p>
      <a
        href="#create"
        className="inline-flex items-center gap-2 px-6 py-3 bg-base-blue hover:bg-base-blue/90 text-white font-semibold rounded-xl transition-colors"
      >
        Create Token
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </a>
    </div>
  );
}
