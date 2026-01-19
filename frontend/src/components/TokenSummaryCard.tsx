/**
 * Token Summary Card Component
 * 
 * Displays a summary of a created token with key metrics.
 */

"use client";

import { AddressWithCopy, TxHashWithCopy } from "./CopyButton";
import { ShareButtons } from "./ShareButtons";
import { getTokenUrl, getAddressUrl } from "@/lib/urls";
import { formatDistanceToNow } from "date-fns";

interface TokenSummaryCardProps {
  token: {
    address: `0x${string}`;
    name: string;
    symbol: string;
    decimals: number;
    initialSupply: string;
    createdAt: number;
    transactionHash: `0x${string}`;
    chainId: number;
  };
  className?: string;
  showShare?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}

export function TokenSummaryCard({
  token,
  className = '',
  showShare = true,
  variant = 'default',
}: TokenSummaryCardProps) {
  const createdAgo = formatDistanceToNow(new Date(token.createdAt), { addSuffix: true });
  const tokenUrl = getTokenUrl(token.address, token.chainId);
  const creatorUrl = getAddressUrl(token.address, token.chainId);

  if (variant === 'compact') {
    return (
      <div className={`p-4 bg-white/5 border border-white/10 rounded-xl ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Token icon */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-base-blue to-purple-500 flex items-center justify-center text-white font-bold text-sm">
              {token.symbol.slice(0, 2)}
            </div>
            <div>
              <h4 className="font-semibold text-white">{token.name}</h4>
              <p className="text-xs text-white/50">${token.symbol}</p>
            </div>
          </div>
          <a
            href={tokenUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base-blue hover:text-base-blue/80 text-sm"
          >
            View →
          </a>
        </div>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={`bg-white/5 border border-white/10 rounded-2xl overflow-hidden ${className}`}>
        {/* Header with gradient */}
        <div className="p-6 bg-gradient-to-r from-base-blue/20 to-purple-500/20 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-base-blue to-purple-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              {token.symbol.slice(0, 2)}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{token.name}</h3>
              <p className="text-base-blue font-mono">${token.symbol}</p>
            </div>
          </div>
        </div>

        {/* Details grid */}
        <div className="p-6 grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-white/40 mb-1">Contract Address</p>
            <AddressWithCopy address={token.address} />
          </div>
          <div>
            <p className="text-xs text-white/40 mb-1">Transaction</p>
            <TxHashWithCopy hash={token.transactionHash} explorerUrl={`${getTokenUrl(token.address, token.chainId).replace('/token/', '/tx/')}`} />
          </div>
          <div>
            <p className="text-xs text-white/40 mb-1">Initial Supply</p>
            <p className="text-white font-mono">{BigInt(token.initialSupply).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-white/40 mb-1">Decimals</p>
            <p className="text-white font-mono">{token.decimals}</p>
          </div>
          <div>
            <p className="text-xs text-white/40 mb-1">Created</p>
            <p className="text-white">{createdAgo}</p>
          </div>
          <div>
            <p className="text-xs text-white/40 mb-1">Network</p>
            <p className="text-white">{token.chainId === 8453 ? 'Base' : 'Base Sepolia'}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-white/10 flex items-center justify-between">
          <a
            href={tokenUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-base-blue text-white font-semibold rounded-xl hover:bg-base-blue/90 transition-colors"
          >
            View on Basescan
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          
          {showShare && (
            <ShareButtons
              tokenName={token.name}
              tokenSymbol={token.symbol}
              tokenAddress={token.address}
              chainId={token.chainId}
              variant="compact"
            />
          )}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`p-6 bg-white/5 border border-white/10 rounded-xl ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-base-blue to-purple-500 flex items-center justify-center text-white font-bold">
          {token.symbol.slice(0, 2)}
        </div>
        <div>
          <h4 className="text-lg font-bold text-white">{token.name}</h4>
          <p className="text-white/60 text-sm">${token.symbol}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-white/40">Supply</p>
          <p className="text-white font-mono text-sm">{BigInt(token.initialSupply).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-white/40">Decimals</p>
          <p className="text-white font-mono text-sm">{token.decimals}</p>
        </div>
      </div>

      {/* Address */}
      <div className="mb-4">
        <p className="text-xs text-white/40 mb-1">Contract</p>
        <AddressWithCopy address={token.address} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <span className="text-xs text-white/40">{createdAgo}</span>
        <a
          href={tokenUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-base-blue hover:text-base-blue/80 text-sm flex items-center gap-1"
        >
          Basescan
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}
