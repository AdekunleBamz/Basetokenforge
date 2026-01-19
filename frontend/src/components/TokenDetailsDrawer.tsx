'use client';

/**
 * Token Details Drawer Component
 * 
 * Slide-out drawer showing comprehensive token details
 * optimized for Base L2 tokens.
 */

import { Fragment } from 'react';
import { 
  X, 
  Copy, 
  ExternalLink, 
  Coins, 
  Users, 
  Hash,
  Calendar,
  Shield,
  TrendingUp,
  Send,
  MoreHorizontal
} from 'lucide-react';
import { formatUnits } from 'viem';
import { shortenAddress } from '@/lib/token-metadata';
import { getAddressUrl, getTransactionUrl } from '@/lib/base-network';
import type { Address } from 'viem';

interface TokenInfo {
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: bigint;
  owner?: Address;
  createdAt?: Date;
  creationTxHash?: string;
  holderCount?: number;
  transferCount?: number;
  verified?: boolean;
}

interface TokenDetailsDrawerProps {
  /** Whether drawer is open */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Token information */
  token: TokenInfo | null;
  /** Current chain ID */
  chainId: number;
  /** User's token balance */
  userBalance?: bigint;
  /** Transfer handler */
  onTransfer?: () => void;
  /** Additional actions */
  actions?: Array<{
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    onClick: () => void;
    variant?: 'default' | 'danger';
  }>;
}

export function TokenDetailsDrawer({
  isOpen,
  onClose,
  token,
  chainId,
  userBalance,
  onTransfer,
  actions = [],
}: TokenDetailsDrawerProps) {
  if (!isOpen || !token) return null;

  // Format supply for display
  const formatSupply = (supply: bigint, decimals: number): string => {
    const formatted = formatUnits(supply, decimals);
    const num = parseFloat(formatted);
    
    if (num >= 1_000_000_000) {
      return `${(num / 1_000_000_000).toFixed(2)}B`;
    }
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(2)}M`;
    }
    if (num >= 1_000) {
      return `${(num / 1_000).toFixed(2)}K`;
    }
    return num.toLocaleString(undefined, { maximumFractionDigits: 4 });
  };

  // Format date
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Stats data
  const stats = [
    {
      label: 'Total Supply',
      value: formatSupply(token.totalSupply, token.decimals),
      icon: Coins,
    },
    {
      label: 'Decimals',
      value: token.decimals.toString(),
      icon: Hash,
    },
    ...(token.holderCount !== undefined
      ? [
          {
            label: 'Holders',
            value: token.holderCount.toLocaleString(),
            icon: Users,
          },
        ]
      : []),
    ...(token.transferCount !== undefined
      ? [
          {
            label: 'Transfers',
            value: token.transferCount.toLocaleString(),
            icon: TrendingUp,
          },
        ]
      : []),
  ];

  return (
    <Fragment>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-gray-900 border-l border-gray-700 z-50 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            {/* Token Icon */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white">
              {token.symbol.slice(0, 2)}
            </div>
            <div>
              <h2 className="font-semibold text-white">{token.name}</h2>
              <p className="text-sm text-gray-400">{token.symbol}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Contract Address */}
          <div className="bg-gray-800/50 rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
              Contract Address
            </p>
            <div className="flex items-center gap-2">
              <code className="text-sm text-white font-mono flex-1 truncate">
                {token.address}
              </code>
              <button
                onClick={() => copyToClipboard(token.address)}
                className="p-1.5 rounded hover:bg-gray-700 transition-colors"
                title="Copy address"
              >
                <Copy className="h-4 w-4 text-gray-400" />
              </button>
              <a
                href={getAddressUrl(token.address, chainId)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded hover:bg-gray-700 transition-colors"
                title="View on explorer"
              >
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </a>
            </div>
          </div>

          {/* User Balance */}
          {userBalance !== undefined && (
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                Your Balance
              </p>
              <p className="text-2xl font-bold text-white">
                {formatSupply(userBalance, token.decimals)}
                <span className="text-lg text-gray-400 ml-2">{token.symbol}</span>
              </p>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-gray-800/50 rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-1">
                  <stat.icon className="h-4 w-4 text-gray-500" />
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
                <p className="text-lg font-semibold text-white">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Owner Info */}
          {token.owner && (
            <div className="bg-gray-800/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-gray-500" />
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  Owner
                </p>
              </div>
              <div className="flex items-center gap-2">
                <code className="text-sm text-white font-mono">
                  {shortenAddress(token.owner)}
                </code>
                <a
                  href={getAddressUrl(token.owner, chainId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* Creation Info */}
          {token.createdAt && (
            <div className="bg-gray-800/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  Created
                </p>
              </div>
              <p className="text-sm text-white">{formatDate(token.createdAt)}</p>
              {token.creationTxHash && (
                <a
                  href={getTransactionUrl(token.creationTxHash, chainId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-1"
                >
                  View creation transaction
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          )}

          {/* Verified Badge */}
          {token.verified && (
            <div className="flex items-center gap-2 text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <Shield className="h-5 w-5" />
              <span className="text-sm font-medium">Contract Verified on Basescan</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-gray-700 space-y-2">
          {onTransfer && (
            <button
              onClick={onTransfer}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Send className="h-4 w-4" />
              Transfer Tokens
            </button>
          )}
          
          {actions.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {actions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={action.onClick}
                  className={`py-2.5 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                    action.variant === 'danger'
                      ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                  }`}
                >
                  <action.icon className="h-4 w-4" />
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
}

export default TokenDetailsDrawer;
