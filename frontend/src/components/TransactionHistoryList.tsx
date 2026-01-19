'use client';

/**
 * Transaction History List Component
 * 
 * Displays a list of recent transactions with status and links.
 * Optimized for Base chain with fast confirmations.
 */

import { useState, useMemo } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Shield, 
  PlusCircle, 
  ExternalLink,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Filter
} from 'lucide-react';
import { useTransactionHistory } from '@/hooks/useTokenStorage';
import { createBasescanTxUrl, formatTxHash } from '@/lib/transaction-utils';
import { isBaseSepolia } from '@/lib/base-network';

type TransactionType = 'create' | 'transfer' | 'approve' | 'all';
type TransactionStatus = 'pending' | 'success' | 'failed' | 'all';

interface TransactionHistoryListProps {
  /** Filter by token address */
  tokenAddress?: string;
  /** Max transactions to show */
  limit?: number;
  /** Show filter controls */
  showFilters?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// Transaction type icons
const TYPE_ICONS = {
  create: PlusCircle,
  transfer: ArrowUpRight,
  approve: Shield,
};

// Status colors
const STATUS_COLORS = {
  pending: 'text-yellow-400',
  success: 'text-green-400',
  failed: 'text-red-400',
};

export function TransactionHistoryList({
  tokenAddress,
  limit = 20,
  showFilters = true,
  className = '',
}: TransactionHistoryListProps) {
  const { history, getByToken } = useTransactionHistory();
  const [typeFilter, setTypeFilter] = useState<TransactionType>('all');
  const [statusFilter, setStatusFilter] = useState<TransactionStatus>('all');

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    let txs = tokenAddress ? getByToken(tokenAddress) : history;

    // Apply type filter
    if (typeFilter !== 'all') {
      txs = txs.filter((tx) => tx.type === typeFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      txs = txs.filter((tx) => tx.status === statusFilter);
    }

    // Apply limit
    return txs.slice(0, limit);
  }, [history, tokenAddress, getByToken, typeFilter, statusFilter, limit]);

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Loader2 className="h-4 w-4 animate-spin text-yellow-400" />;
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-400" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  // Get transaction description
  const getDescription = (type: string) => {
    switch (type) {
      case 'create':
        return 'Token Created';
      case 'transfer':
        return 'Token Transferred';
      case 'approve':
        return 'Approval Set';
      default:
        return 'Transaction';
    }
  };

  if (filteredTransactions.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <Clock className="h-12 w-12 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-400">No transactions yet</p>
        <p className="text-gray-500 text-sm mt-1">
          Your transaction history will appear here
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Filters */}
      {showFilters && (
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-400">Filter:</span>
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as TransactionType)}
            className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="create">Created</option>
            <option value="transfer">Transfers</option>
            <option value="approve">Approvals</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TransactionStatus)}
            className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="success">Successful</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      )}

      {/* Transaction List */}
      <div className="space-y-2">
        {filteredTransactions.map((tx) => {
          const Icon = TYPE_ICONS[tx.type] || Clock;
          const isTestnet = isBaseSepolia(tx.chainId);
          const explorerUrl = createBasescanTxUrl(tx.hash as `0x${string}`, isTestnet);

          return (
            <div
              key={tx.hash}
              className="flex items-center justify-between p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors group"
            >
              {/* Left: Type and Description */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-700/50 rounded-lg">
                  <Icon className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">
                    {getDescription(tx.type)}
                  </p>
                  <p className="text-gray-500 text-xs font-mono">
                    {formatTxHash(tx.hash as `0x${string}`)}
                  </p>
                </div>
              </div>

              {/* Right: Status and Time */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(tx.status)}
                  <span className={`text-sm capitalize ${STATUS_COLORS[tx.status]}`}>
                    {tx.status}
                  </span>
                </div>

                <span className="text-gray-500 text-sm min-w-[60px] text-right">
                  {formatTimestamp(tx.timestamp)}
                </span>

                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-gray-500 hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all"
                  title="View on Basescan"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show count */}
      {filteredTransactions.length >= limit && (
        <p className="text-center text-gray-500 text-sm mt-4">
          Showing latest {limit} transactions
        </p>
      )}
    </div>
  );
}

export default TransactionHistoryList;
