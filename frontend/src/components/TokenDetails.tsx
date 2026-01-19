/**
 * Token Details Component
 * 
 * Displays comprehensive token information for tokens on Base.
 */

"use client";

import { formatUnits } from "viem";
import { getTokenUrl, getAddressUrl } from "@/lib/base-chain";
import { EXPLORER_URL } from "@/lib/constants";

interface TokenDetailsProps {
  address: `0x${string}`;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: bigint;
  owner?: `0x${string}`;
  createdAt?: Date;
}

export function TokenDetails({
  address,
  name,
  symbol,
  decimals,
  totalSupply,
  owner,
  createdAt,
}: TokenDetailsProps) {
  const formattedSupply = formatUnits(totalSupply, decimals);
  
  // Format large numbers with commas
  const displaySupply = Number(formattedSupply).toLocaleString('en-US', {
    maximumFractionDigits: 4,
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-forge-orange to-forge-gold flex items-center justify-center">
            <span className="text-base-dark font-bold text-lg">
              {symbol.slice(0, 2)}
            </span>
          </div>
          <div>
            <h3 className="text-white font-semibold text-xl">{name}</h3>
            <p className="text-white/50">${symbol}</p>
          </div>
          <div className="ml-auto">
            <a
              href={getTokenUrl(address)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base-blue hover:text-base-blue/80 text-sm flex items-center gap-1"
            >
              View on Basescan
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="p-6 space-y-4">
        <DetailRow 
          label="Contract Address" 
          value={address}
          truncate
          copyable
          link={getAddressUrl(address)}
        />
        
        <DetailRow 
          label="Total Supply" 
          value={`${displaySupply} ${symbol}`}
        />
        
        <DetailRow 
          label="Decimals" 
          value={decimals.toString()}
        />
        
        {owner && (
          <DetailRow 
            label="Owner" 
            value={owner}
            truncate
            copyable
            link={getAddressUrl(owner)}
          />
        )}
        
        {createdAt && (
          <DetailRow 
            label="Created" 
            value={createdAt.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          />
        )}

        <DetailRow 
          label="Network" 
          value="Base Mainnet"
          badge="Base"
        />
      </div>
    </div>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
  truncate?: boolean;
  copyable?: boolean;
  link?: string;
  badge?: string;
}

function DetailRow({ label, value, truncate, copyable, link, badge }: DetailRowProps) {
  const displayValue = truncate && value.length > 16 
    ? `${value.slice(0, 8)}...${value.slice(-6)}` 
    : value;

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
  };

  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <span className="text-white/50 text-sm">{label}</span>
      <div className="flex items-center gap-2">
        {badge && (
          <span className="px-2 py-0.5 bg-base-blue/20 text-base-blue text-xs rounded-md">
            {badge}
          </span>
        )}
        {link ? (
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white font-mono text-sm hover:text-base-blue transition-colors"
          >
            {displayValue}
          </a>
        ) : (
          <span className="text-white font-mono text-sm">{displayValue}</span>
        )}
        {copyable && (
          <button 
            onClick={handleCopy}
            className="text-white/40 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
