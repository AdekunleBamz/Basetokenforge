/**
 * Network Selector Component
 * 
 * Allows switching between Base Mainnet and Base Sepolia testnet.
 */

"use client";

import { useState } from "react";
import { base, baseSepolia } from "wagmi/chains";
import { useSwitchChain } from "wagmi";
import { useWalletConnection } from "@/hooks/useWalletConnection";

interface NetworkSelectorProps {
  className?: string;
  showTestnet?: boolean;
}

const networks = [
  {
    id: base.id,
    name: 'Base',
    icon: '🔵',
    description: 'Production network',
    isTestnet: false,
  },
  {
    id: baseSepolia.id,
    name: 'Base Sepolia',
    icon: '🟡',
    description: 'Test network',
    isTestnet: true,
  },
];

export function NetworkSelector({ className = '', showTestnet = true }: NetworkSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { chainId, isConnected } = useWalletConnection();
  const { switchChain, isPending } = useSwitchChain();

  const currentNetwork = networks.find(n => n.id === chainId) || null;
  const availableNetworks = showTestnet 
    ? networks 
    : networks.filter(n => !n.isTestnet);

  const handleSelect = (networkId: number) => {
    if (switchChain) {
      switchChain({ chainId: networkId });
    }
    setIsOpen(false);
  };

  if (!isConnected) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className={`
          flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl
          hover:border-white/20 transition-all
          ${isPending ? 'opacity-50 cursor-wait' : ''}
        `}
      >
        {currentNetwork ? (
          <>
            <span className="text-lg">{currentNetwork.icon}</span>
            <span className="text-sm font-medium text-white">
              {currentNetwork.name}
            </span>
          </>
        ) : (
          <>
            <span className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </span>
            <span className="text-sm font-medium text-red-400">
              Wrong Network
            </span>
          </>
        )}
        <svg
          className={`w-4 h-4 text-white/60 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 mt-2 w-64 bg-neutral-900 border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
            <div className="p-2">
              <p className="px-3 py-2 text-xs text-white/40 uppercase tracking-wider">
                Select Network
              </p>
              
              {availableNetworks.map((network) => (
                <button
                  key={network.id}
                  onClick={() => handleSelect(network.id)}
                  disabled={chainId === network.id}
                  className={`
                    w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left
                    transition-colors
                    ${chainId === network.id 
                      ? 'bg-base-blue/10 border border-base-blue/30' 
                      : 'hover:bg-white/5'
                    }
                  `}
                >
                  <span className="text-2xl">{network.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{network.name}</span>
                      {network.isTestnet && (
                        <span className="px-1.5 py-0.5 text-[10px] bg-yellow-500/20 text-yellow-400 rounded">
                          TESTNET
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/50">{network.description}</p>
                  </div>
                  {chainId === network.id && (
                    <svg className="w-5 h-5 text-base-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>

            {/* Footer with info */}
            <div className="border-t border-white/10 p-3 bg-white/5">
              <p className="text-xs text-white/40">
                {showTestnet 
                  ? 'Use Sepolia testnet to test without real funds.'
                  : 'Connected to Base L2 network.'
                }
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Simple network indicator badge
 */
export function NetworkBadge() {
  const { chainId, isOnBase, isOnBaseSepolia } = useWalletConnection();

  if (!chainId) return null;

  if (isOnBase) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-base-blue/20 rounded-full text-base-blue text-xs font-medium">
        <span className="w-2 h-2 rounded-full bg-base-blue animate-pulse" />
        Base
      </span>
    );
  }

  if (isOnBaseSepolia) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-yellow-500/20 rounded-full text-yellow-400 text-xs font-medium">
        <span className="w-2 h-2 rounded-full bg-yellow-400" />
        Sepolia
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-red-500/20 rounded-full text-red-400 text-xs font-medium">
      <span className="w-2 h-2 rounded-full bg-red-400" />
      Wrong Network
    </span>
  );
}
