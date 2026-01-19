'use client';

/**
 * Network Status Indicator Component
 * 
 * Shows the current network status with visual indicators.
 * Warns users if they're on the wrong network.
 */

import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { Wifi, WifiOff, AlertTriangle, Check, Loader2 } from 'lucide-react';
import { BASE_MAINNET_CHAIN_ID, BASE_SEPOLIA_CHAIN_ID, isBaseNetwork, getNetworkName } from '@/lib/base-network';

interface NetworkStatusIndicatorProps {
  /** Required chain ID (default: Base mainnet) */
  requiredChainId?: number;
  /** Show switch network button */
  showSwitchButton?: boolean;
  /** Compact mode */
  compact?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function NetworkStatusIndicator({
  requiredChainId = BASE_MAINNET_CHAIN_ID,
  showSwitchButton = true,
  compact = false,
  className = '',
}: NetworkStatusIndicatorProps) {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  // Determine network status
  const isCorrectNetwork = chainId === requiredChainId;
  const isOnBase = isBaseNetwork(chainId);
  const networkName = getNetworkName(chainId);
  const requiredNetworkName = getNetworkName(requiredChainId);

  // Handle switch network
  const handleSwitch = () => {
    if (switchChain) {
      switchChain({ chainId: requiredChainId });
    }
  };

  // Not connected
  if (!isConnected) {
    if (compact) {
      return (
        <div className={`flex items-center gap-1.5 text-gray-400 ${className}`}>
          <WifiOff className="h-4 w-4" />
          <span className="text-sm">Not connected</span>
        </div>
      );
    }

    return (
      <div className={`flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg ${className}`}>
        <WifiOff className="h-4 w-4 text-gray-400" />
        <span className="text-sm text-gray-400">Wallet not connected</span>
      </div>
    );
  }

  // Correct network
  if (isCorrectNetwork) {
    if (compact) {
      return (
        <div className={`flex items-center gap-1.5 ${className}`}>
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-sm text-green-400">{networkName}</span>
        </div>
      );
    }

    return (
      <div className={`flex items-center gap-2 px-3 py-2 bg-green-900/20 border border-green-700/50 rounded-lg ${className}`}>
        <Check className="h-4 w-4 text-green-400" />
        <span className="text-sm text-green-400">Connected to {networkName}</span>
      </div>
    );
  }

  // Wrong network
  if (compact) {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
        <span className="text-sm text-yellow-400">Wrong Network</span>
        {showSwitchButton && (
          <button
            onClick={handleSwitch}
            disabled={isPending}
            className="text-xs text-blue-400 hover:text-blue-300 ml-1"
          >
            {isPending ? 'Switching...' : 'Switch'}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-2 p-3 bg-yellow-900/20 border border-yellow-700/50 rounded-lg ${className}`}>
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-yellow-400" />
        <span className="text-sm text-yellow-400">Wrong Network</span>
      </div>
      <p className="text-xs text-gray-400">
        You&apos;re connected to <span className="text-white">{networkName || 'Unknown'}</span>.
        Please switch to <span className="text-white">{requiredNetworkName}</span>.
      </p>
      {showSwitchButton && (
        <button
          onClick={handleSwitch}
          disabled={isPending}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white text-sm rounded-lg transition-colors"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Switching...
            </>
          ) : (
            <>
              <Wifi className="h-4 w-4" />
              Switch to {requiredNetworkName}
            </>
          )}
        </button>
      )}
    </div>
  );
}

/**
 * Network Dot Indicator
 * 
 * A minimal dot that shows network status
 */
export function NetworkDot({ className = '' }: { className?: string }) {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const isOnBase = isBaseNetwork(chainId);

  if (!isConnected) {
    return <div className={`w-2 h-2 rounded-full bg-gray-500 ${className}`} />;
  }

  if (!isOnBase) {
    return <div className={`w-2 h-2 rounded-full bg-yellow-500 animate-pulse ${className}`} />;
  }

  return <div className={`w-2 h-2 rounded-full bg-green-500 ${className}`} />;
}

/**
 * Network Required Wrapper
 * 
 * Wraps content that requires a specific network
 */
export function NetworkRequired({
  children,
  requiredChainId = BASE_MAINNET_CHAIN_ID,
  fallback,
}: {
  children: React.ReactNode;
  requiredChainId?: number;
  fallback?: React.ReactNode;
}) {
  const { isConnected } = useAccount();
  const chainId = useChainId();

  if (!isConnected) {
    return fallback ?? (
      <div className="text-center py-8">
        <p className="text-gray-400">Please connect your wallet</p>
      </div>
    );
  }

  if (chainId !== requiredChainId) {
    return fallback ?? (
      <div className="max-w-md mx-auto">
        <NetworkStatusIndicator requiredChainId={requiredChainId} />
      </div>
    );
  }

  return <>{children}</>;
}

export default NetworkStatusIndicator;
