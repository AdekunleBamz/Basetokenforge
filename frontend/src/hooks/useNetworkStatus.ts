/**
 * useNetworkStatus Hook
 * 
 * Monitors Base network connection and status.
 */

"use client";

import { useChainId, useAccount, useSwitchChain } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { usePublicClient } from "wagmi";
import { BASE_MAINNET, BASE_SEPOLIA } from "@/lib/base-chain";

interface NetworkStatus {
  chainId: number;
  isBase: boolean;
  isBaseSepolia: boolean;
  isCorrectNetwork: boolean;
  networkName: string;
  blockNumber: bigint | null;
  isConnected: boolean;
  switchToBase: () => Promise<void>;
  error: Error | null;
}

export function useNetworkStatus(): NetworkStatus {
  const chainId = useChainId();
  const { isConnected } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const publicClient = usePublicClient();

  // Fetch current block number
  const { data: blockNumber, error } = useQuery({
    queryKey: ['blockNumber', chainId],
    queryFn: async () => {
      if (!publicClient) return null;
      return await publicClient.getBlockNumber();
    },
    enabled: !!publicClient && isConnected,
    refetchInterval: 12000, // Refetch every ~12 seconds (Base block time is ~2s)
  });

  const isBase = chainId === BASE_MAINNET.id;
  const isBaseSepolia = chainId === BASE_SEPOLIA.id;
  const isCorrectNetwork = isBase || isBaseSepolia;

  const getNetworkName = () => {
    switch (chainId) {
      case BASE_MAINNET.id:
        return 'Base Mainnet';
      case BASE_SEPOLIA.id:
        return 'Base Sepolia';
      default:
        return 'Unknown Network';
    }
  };

  const switchToBase = async () => {
    if (!switchChainAsync) return;
    await switchChainAsync({ chainId: BASE_MAINNET.id });
  };

  return {
    chainId,
    isBase,
    isBaseSepolia,
    isCorrectNetwork,
    networkName: getNetworkName(),
    blockNumber: blockNumber || null,
    isConnected,
    switchToBase,
    error: error as Error | null,
  };
}

/**
 * Hook to detect if user is on wrong network
 */
export function useWrongNetwork() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();

  const isWrongNetwork = isConnected && chainId !== BASE_MAINNET.id && chainId !== BASE_SEPOLIA.id;

  const switchToBase = async () => {
    if (switchChainAsync) {
      await switchChainAsync({ chainId: BASE_MAINNET.id });
    }
  };

  return {
    isWrongNetwork,
    switchToBase,
    currentChainId: chainId,
  };
}
