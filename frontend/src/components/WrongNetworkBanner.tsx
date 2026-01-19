/**
 * Wrong Network Banner Component
 * 
 * Displays a banner when the user is connected to the wrong network.
 */

"use client";

import { useWrongNetwork } from "@/hooks/useNetworkStatus";
import { BASE_MAINNET } from "@/lib/base-chain";

export function WrongNetworkBanner() {
  const { isWrongNetwork, switchToBase, currentChainId } = useWrongNetwork();

  if (!isWrongNetwork) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-red-500/95 text-white py-3 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <svg 
            className="w-5 h-5 flex-shrink-0" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
          <div>
            <p className="font-semibold">Wrong Network Detected</p>
            <p className="text-sm text-white/80">
              Please switch to Base (Chain ID: {BASE_MAINNET.id}) to use Token Forge.
              Currently connected to Chain ID: {currentChainId}
            </p>
          </div>
        </div>
        
        <button
          onClick={switchToBase}
          className="flex-shrink-0 bg-white text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-white/90 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Switch to Base
        </button>
      </div>
    </div>
  );
}

/**
 * Compact wrong network indicator
 */
export function WrongNetworkIndicator() {
  const { isWrongNetwork, switchToBase } = useWrongNetwork();

  if (!isWrongNetwork) return null;

  return (
    <button
      onClick={switchToBase}
      className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm hover:bg-red-500/30 transition-colors"
    >
      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
      <span>Wrong Network</span>
    </button>
  );
}
