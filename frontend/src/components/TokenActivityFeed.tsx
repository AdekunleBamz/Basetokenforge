'use client';

/**
 * Token Activity Feed Component
 * 
 * Real-time feed of token activities including transfers,
 * approvals, and creation events.
 */

import { useState, useEffect } from 'react';
import { 
  Activity, 
  ArrowRight, 
  Shield, 
  PlusCircle, 
  RefreshCw,
  ExternalLink 
} from 'lucide-react';
import { shortenAddress } from '@/lib/token-metadata';
import { getTransactionUrl } from '@/lib/base-network';
import type { Address } from 'viem';

// Activity types
type ActivityType = 'transfer' | 'approval' | 'creation' | 'burn';

// Activity item interface
interface ActivityItem {
  id: string;
  type: ActivityType;
  from: Address;
  to?: Address;
  amount?: string;
  symbol: string;
  timestamp: Date;
  txHash: string;
  chainId: number;
}

interface TokenActivityFeedProps {
  /** Token address to filter by (optional) */
  tokenAddress?: Address;
  /** Chain ID */
  chainId: number;
  /** Maximum items to show */
  limit?: number;
  /** Auto-refresh interval in ms (0 to disable) */
  refreshInterval?: number;
  /** Additional CSS classes */
  className?: string;
}

// Activity type configurations
const ACTIVITY_CONFIG = {
  transfer: {
    icon: ArrowRight,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    label: 'Transfer',
  },
  approval: {
    icon: Shield,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    label: 'Approval',
  },
  creation: {
    icon: PlusCircle,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    label: 'Created',
  },
  burn: {
    icon: Activity,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    label: 'Burn',
  },
};

export function TokenActivityFeed({
  tokenAddress,
  chainId,
  limit = 10,
  refreshInterval = 30000,
  className = '',
}: TokenActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Format relative time
  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  // Format amount for display
  const formatAmount = (amount: string, symbol: string): string => {
    const num = parseFloat(amount);
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(2)}M ${symbol}`;
    }
    if (num >= 1_000) {
      return `${(num / 1_000).toFixed(2)}K ${symbol}`;
    }
    return `${num.toLocaleString()} ${symbol}`;
  };

  // Simulate fetching activities (in production, use events from chain)
  const fetchActivities = async () => {
    // This would fetch from blockchain events or indexer in production
    // For now, return empty array as placeholder
    setActivities([]);
    setIsLoading(false);
  };

  // Refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchActivities();
    setIsRefreshing(false);
  };

  // Initial fetch
  useEffect(() => {
    fetchActivities();
  }, [tokenAddress, chainId]);

  // Auto-refresh
  useEffect(() => {
    if (refreshInterval <= 0) return;

    const interval = setInterval(fetchActivities, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  // Get activity icon component
  const getActivityIcon = (type: ActivityType) => {
    const config = ACTIVITY_CONFIG[type];
    const Icon = config.icon;
    return (
      <div className={`p-2 rounded-lg ${config.bgColor}`}>
        <Icon className={`h-4 w-4 ${config.color}`} />
      </div>
    );
  };

  // Get activity description
  const getActivityDescription = (activity: ActivityItem): React.ReactNode => {
    switch (activity.type) {
      case 'transfer':
        return (
          <span>
            <span className="text-white font-medium">
              {shortenAddress(activity.from)}
            </span>
            <span className="text-gray-400"> sent </span>
            <span className="text-blue-400 font-medium">
              {formatAmount(activity.amount || '0', activity.symbol)}
            </span>
            <span className="text-gray-400"> to </span>
            <span className="text-white font-medium">
              {shortenAddress(activity.to || '')}
            </span>
          </span>
        );
      case 'approval':
        return (
          <span>
            <span className="text-white font-medium">
              {shortenAddress(activity.from)}
            </span>
            <span className="text-gray-400"> approved </span>
            <span className="text-purple-400 font-medium">
              {shortenAddress(activity.to || '')}
            </span>
            <span className="text-gray-400"> to spend </span>
            <span className="text-white">{activity.symbol}</span>
          </span>
        );
      case 'creation':
        return (
          <span>
            <span className="text-white font-medium">
              {shortenAddress(activity.from)}
            </span>
            <span className="text-gray-400"> created </span>
            <span className="text-green-400 font-medium">{activity.symbol}</span>
          </span>
        );
      case 'burn':
        return (
          <span>
            <span className="text-white font-medium">
              {shortenAddress(activity.from)}
            </span>
            <span className="text-gray-400"> burned </span>
            <span className="text-red-400 font-medium">
              {formatAmount(activity.amount || '0', activity.symbol)}
            </span>
          </span>
        );
    }
  };

  return (
    <div className={`bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-500" />
          <h3 className="font-semibold text-white">Activity</h3>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-1.5 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCw className={`h-4 w-4 text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Activity List */}
      <div className="divide-y divide-gray-700/50">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-700 rounded-lg" />
                <div className="flex-1">
                  <div className="h-4 w-3/4 bg-gray-700 rounded mb-1" />
                  <div className="h-3 w-1/4 bg-gray-700 rounded" />
                </div>
              </div>
            </div>
          ))
        ) : activities.length === 0 ? (
          // Empty state
          <div className="p-8 text-center">
            <Activity className="h-10 w-10 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-400">No recent activity</p>
            <p className="text-gray-500 text-sm mt-1">
              Token activities will appear here
            </p>
          </div>
        ) : (
          // Activity items
          activities.slice(0, limit).map((activity) => (
            <div
              key={activity.id}
              className="p-4 hover:bg-gray-800/50 transition-colors group"
            >
              <div className="flex items-start gap-3">
                {getActivityIcon(activity.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-relaxed">
                    {getActivityDescription(activity)}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {formatRelativeTime(activity.timestamp)}
                    </span>
                    <a
                      href={getTransactionUrl(activity.txHash, chainId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      View <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TokenActivityFeed;
