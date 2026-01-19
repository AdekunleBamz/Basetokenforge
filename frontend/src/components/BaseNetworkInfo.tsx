/**
 * Base Network Information Component
 * 
 * Displays Base chain network status and information.
 */

"use client";

import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { BASE_MAINNET } from "@/lib/base-chain";

export function BaseNetworkInfo() {
  const { 
    isBase, 
    isCorrectNetwork, 
    networkName, 
    blockNumber,
    switchToBase 
  } = useNetworkStatus();

  if (!isCorrectNetwork) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-red-400 text-sm font-medium">
          Wrong Network
        </span>
        <button
          onClick={switchToBase}
          className="ml-auto text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1 rounded-md transition-colors"
        >
          Switch to Base
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-base-blue/10 border border-base-blue/30 rounded-lg">
      <div className="flex items-center gap-2">
        {/* Base Logo */}
        <div className="w-6 h-6 rounded-full bg-base-blue flex items-center justify-center">
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" />
          </svg>
        </div>
        <div>
          <p className="text-white text-sm font-medium">{networkName}</p>
          {blockNumber && (
            <p className="text-white/50 text-xs">
              Block #{blockNumber.toString()}
            </p>
          )}
        </div>
      </div>
      
      <div className="ml-auto flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-green-400 text-xs">Connected</span>
      </div>
    </div>
  );
}

/**
 * Compact network badge for header
 */
export function NetworkBadgeCompact() {
  const { isBase, isCorrectNetwork, switchToBase } = useNetworkStatus();

  if (!isCorrectNetwork) {
    return (
      <button
        onClick={switchToBase}
        className="flex items-center gap-1.5 px-2 py-1 bg-red-500/20 border border-red-500/30 rounded-md text-red-400 text-xs hover:bg-red-500/30 transition-colors"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
        Wrong Network
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5 px-2 py-1 bg-base-blue/20 border border-base-blue/30 rounded-md">
      <div className="w-1.5 h-1.5 rounded-full bg-base-blue" />
      <span className="text-base-blue text-xs font-medium">Base</span>
    </div>
  );
}

/**
 * Network stats display
 */
export function BaseNetworkStats() {
  const { blockNumber } = useNetworkStatus();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white/5 rounded-lg p-4">
        <p className="text-white/50 text-xs mb-1">Network</p>
        <p className="text-white font-medium">{BASE_MAINNET.name}</p>
      </div>
      <div className="bg-white/5 rounded-lg p-4">
        <p className="text-white/50 text-xs mb-1">Chain ID</p>
        <p className="text-white font-medium">{BASE_MAINNET.id}</p>
      </div>
      <div className="bg-white/5 rounded-lg p-4">
        <p className="text-white/50 text-xs mb-1">Currency</p>
        <p className="text-white font-medium">{BASE_MAINNET.nativeCurrency.symbol}</p>
      </div>
      <div className="bg-white/5 rounded-lg p-4">
        <p className="text-white/50 text-xs mb-1">Latest Block</p>
        <p className="text-white font-medium font-mono">
          {blockNumber ? `#${blockNumber.toString().slice(-6)}` : '...'}
        </p>
      </div>
    </div>
  );
}
