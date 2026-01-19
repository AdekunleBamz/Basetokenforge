/**
 * Token Creation Success Component
 * 
 * Displays success state after token is created on Base.
 */

"use client";

import { useState } from "react";
import { getTokenUrl, getTransactionUrl } from "@/lib/base-chain";
import { formatTokenSupply, truncateAddress } from "@/lib/formatting";

interface TokenCreationSuccessProps {
  tokenAddress: `0x${string}`;
  tokenName: string;
  tokenSymbol: string;
  decimals: number;
  totalSupply: bigint;
  transactionHash: `0x${string}`;
  onCreateAnother: () => void;
}

export function TokenCreationSuccess({
  tokenAddress,
  tokenName,
  tokenSymbol,
  decimals,
  totalSupply,
  transactionHash,
  onCreateAnother,
}: TokenCreationSuccessProps) {
  const [copied, setCopied] = useState<'address' | 'tx' | null>(null);

  const copyToClipboard = async (text: string, type: 'address' | 'tx') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const formattedSupply = formatTokenSupply(totalSupply, decimals);

  return (
    <div className="bg-gradient-to-b from-green-500/10 to-transparent border border-green-500/30 rounded-2xl p-8 text-center">
      {/* Success Icon */}
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
        <svg 
          className="w-10 h-10 text-green-400" 
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
      </div>

      {/* Success Message */}
      <h3 className="text-2xl font-display font-bold text-white mb-2">
        Token Created Successfully!
      </h3>
      <p className="text-white/60 mb-8">
        Your {tokenSymbol} token is now live on Base
      </p>

      {/* Token Info Card */}
      <div className="bg-white/5 rounded-xl p-6 mb-6 text-left">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-forge-orange to-forge-gold flex items-center justify-center">
            <span className="text-base-dark font-bold text-xl">
              {tokenSymbol.slice(0, 2)}
            </span>
          </div>
          <div>
            <h4 className="text-white font-semibold text-lg">{tokenName}</h4>
            <p className="text-white/50">${tokenSymbol}</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Token Address */}
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <p className="text-white/50 text-xs mb-1">Token Address</p>
              <p className="text-white font-mono text-sm">
                {truncateAddress(tokenAddress, 10, 8)}
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(tokenAddress, 'address')}
              className="text-base-blue hover:text-base-blue/80 transition-colors"
            >
              {copied === 'address' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>

          {/* Total Supply */}
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <p className="text-white/50 text-xs mb-1">Total Supply</p>
              <p className="text-white font-medium">
                {formattedSupply} {tokenSymbol}
              </p>
            </div>
            <span className="text-white/30 text-sm">{decimals} decimals</span>
          </div>

          {/* Transaction Hash */}
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <p className="text-white/50 text-xs mb-1">Transaction</p>
              <p className="text-white font-mono text-sm">
                {truncateAddress(transactionHash, 10, 8)}
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(transactionHash, 'tx')}
              className="text-base-blue hover:text-base-blue/80 transition-colors"
            >
              {copied === 'tx' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={getTokenUrl(tokenAddress)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-base-blue text-white font-semibold rounded-xl hover:bg-base-blue/90 transition-colors"
        >
          View on Basescan
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
        
        <button
          onClick={onCreateAnother}
          className="flex-1 px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors"
        >
          Create Another Token
        </button>
      </div>

      {/* Network Badge */}
      <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 bg-base-blue/10 border border-base-blue/30 rounded-full">
        <div className="w-2 h-2 rounded-full bg-base-blue" />
        <span className="text-base-blue text-xs font-medium">Deployed on Base Mainnet</span>
      </div>
    </div>
  );
}
