'use client';

/**
 * Token Action Buttons Component
 * 
 * A set of action buttons for common token operations.
 * Includes transfer, burn, share, and view on explorer.
 */

import { useState } from 'react';
import { 
  Send, 
  Flame, 
  Share2, 
  ExternalLink, 
  MoreHorizontal,
  Copy,
  QrCode,
  FileText,
  Eye,
  Shield
} from 'lucide-react';
import { getTokenUrl, getAddressUrl } from '@/lib/base-network';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import type { Address } from 'viem';

interface TokenActionButtonsProps {
  /** Token contract address */
  tokenAddress: Address;
  /** Chain ID */
  chainId: number;
  /** On transfer click */
  onTransfer?: () => void;
  /** On share click */
  onShare?: () => void;
  /** Token symbol */
  tokenSymbol: string;
  /** Show burn option (only for token owners) */
  showBurn?: boolean;
  /** On burn click */
  onBurn?: () => void;
  /** Compact mode */
  compact?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function TokenActionButtons({
  tokenAddress,
  chainId,
  onTransfer,
  onShare,
  tokenSymbol,
  showBurn = false,
  onBurn,
  compact = false,
  className = '',
}: TokenActionButtonsProps) {
  const [showMore, setShowMore] = useState(false);
  const { copy, copied } = useCopyToClipboard();

  // Get explorer URL
  const explorerUrl = getTokenUrl(tokenAddress, chainId);

  // Handle copy address
  const handleCopy = () => {
    copy(tokenAddress);
  };

  // Primary actions
  const primaryActions = [
    {
      label: 'Transfer',
      icon: Send,
      onClick: onTransfer,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      label: 'Share',
      icon: Share2,
      onClick: onShare,
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      label: 'Explorer',
      icon: ExternalLink,
      onClick: () => window.open(explorerUrl, '_blank'),
      color: 'bg-gray-600 hover:bg-gray-500',
    },
  ];

  // Secondary actions (in more menu)
  const secondaryActions = [
    {
      label: copied ? 'Copied!' : 'Copy Address',
      icon: Copy,
      onClick: handleCopy,
    },
    {
      label: 'View Contract',
      icon: FileText,
      onClick: () => window.open(`${explorerUrl}#code`, '_blank'),
    },
    {
      label: 'View Holders',
      icon: Eye,
      onClick: () => window.open(`${explorerUrl}#balances`, '_blank'),
    },
    ...(showBurn
      ? [
          {
            label: 'Burn Tokens',
            icon: Flame,
            onClick: onBurn,
            danger: true,
          },
        ]
      : []),
  ];

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {onTransfer && (
          <button
            onClick={onTransfer}
            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            title="Transfer"
          >
            <Send className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={() => window.open(explorerUrl, '_blank')}
          className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
          title="View on Basescan"
        >
          <ExternalLink className="h-4 w-4" />
        </button>
        <button
          onClick={handleCopy}
          className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
          title={copied ? 'Copied!' : 'Copy Address'}
        >
          <Copy className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Primary Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        {primaryActions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium transition-colors ${action.color}`}
          >
            <action.icon className="h-4 w-4" />
            {action.label}
          </button>
        ))}

        {/* More Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMore(!showMore)}
            className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {showMore && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowMore(false)}
              />

              {/* Menu */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-xl overflow-hidden z-50">
                {secondaryActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => {
                      action.onClick?.();
                      setShowMore(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      'danger' in action && action.danger
                        ? 'text-red-400 hover:bg-red-900/30'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <action.icon className="h-4 w-4" />
                    {action.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Quick Action Bar
 * 
 * A horizontal bar of icon-only actions
 */
export function QuickActionBar({
  tokenAddress,
  chainId,
  onTransfer,
  className = '',
}: {
  tokenAddress: Address;
  chainId: number;
  onTransfer?: () => void;
  className?: string;
}) {
  const { copy, copied } = useCopyToClipboard();
  const explorerUrl = getTokenUrl(tokenAddress, chainId);

  const actions = [
    {
      icon: Send,
      label: 'Transfer',
      onClick: onTransfer,
      className: 'text-blue-400 hover:text-blue-300',
    },
    {
      icon: Copy,
      label: copied ? 'Copied!' : 'Copy',
      onClick: () => copy(tokenAddress),
      className: copied ? 'text-green-400' : 'text-gray-400 hover:text-white',
    },
    {
      icon: ExternalLink,
      label: 'Explorer',
      onClick: () => window.open(explorerUrl, '_blank'),
      className: 'text-gray-400 hover:text-white',
    },
  ];

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={action.onClick}
          className={`p-2 rounded-lg transition-colors ${action.className}`}
          title={action.label}
        >
          <action.icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}

export default TokenActionButtons;
