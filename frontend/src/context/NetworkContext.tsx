/**
 * Base Network Context
 * 
 * Provides Base network state and utilities throughout the app.
 */

"use client";

import React, { createContext, useContext, useMemo, type ReactNode } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { useBaseStats } from "@/hooks/useBaseStats";

interface NetworkContextValue {
  // Connection status
  isConnected: boolean;
  chainId: number | undefined;
  
  // Network identification
  isBase: boolean;
  isBaseSepolia: boolean;
  isBaseNetwork: boolean; // Either mainnet or testnet
  isWrongNetwork: boolean;
  
  // Network info
  networkName: string;
  networkColor: string;
  blockExplorerUrl: string;
  bridgeUrl: string;
  
  // Stats
  blockNumber: number | null;
  gasPrice: string | null;
  isHealthy: boolean;
  
  // Target network
  targetChainId: number;
  isTestnet: boolean;
}

const NetworkContext = createContext<NetworkContextValue | null>(null);

// Configuration
const USE_TESTNET = process.env.NEXT_PUBLIC_USE_TESTNET === 'true';
const TARGET_CHAIN = USE_TESTNET ? baseSepolia : base;

export function NetworkProvider({ children }: { children: ReactNode }) {
  const { isConnected, chain } = useAccount();
  const publicClient = usePublicClient({ chainId: TARGET_CHAIN.id });
  const { stats } = useBaseStats();

  const chainId = chain?.id;
  const isBase = chainId === base.id;
  const isBaseSepolia = chainId === baseSepolia.id;
  const isBaseNetwork = isBase || isBaseSepolia;
  const isWrongNetwork = isConnected && !isBaseNetwork;

  const value = useMemo<NetworkContextValue>(() => ({
    // Connection
    isConnected,
    chainId,
    
    // Network identification
    isBase,
    isBaseSepolia,
    isBaseNetwork,
    isWrongNetwork,
    
    // Network info
    networkName: isBase ? 'Base' : isBaseSepolia ? 'Base Sepolia' : chain?.name || 'Unknown',
    networkColor: isBase ? '#0052FF' : isBaseSepolia ? '#F59E0B' : '#EF4444',
    blockExplorerUrl: isBase 
      ? 'https://basescan.org' 
      : 'https://sepolia.basescan.org',
    bridgeUrl: 'https://bridge.base.org',
    
    // Stats
    blockNumber: stats?.blockNumber || null,
    gasPrice: stats?.gasPriceGwei || null,
    isHealthy: stats?.isHealthy ?? true,
    
    // Target
    targetChainId: TARGET_CHAIN.id,
    isTestnet: USE_TESTNET,
  }), [isConnected, chainId, isBase, isBaseSepolia, isBaseNetwork, isWrongNetwork, chain?.name, stats]);

  return (
    <NetworkContext.Provider value={value}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within NetworkProvider');
  }
  return context;
}

/**
 * Utility to generate Basescan URLs
 */
export function useBasescanUrl() {
  const { blockExplorerUrl } = useNetwork();
  
  return {
    address: (addr: string) => `${blockExplorerUrl}/address/${addr}`,
    tx: (hash: string) => `${blockExplorerUrl}/tx/${hash}`,
    token: (addr: string) => `${blockExplorerUrl}/token/${addr}`,
    block: (num: number) => `${blockExplorerUrl}/block/${num}`,
  };
}
