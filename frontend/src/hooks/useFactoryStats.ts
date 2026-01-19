/**
 * useFactoryStats Hook
 * 
 * Fetches statistics from the Token Factory contract on Base.
 */

"use client";

import { useReadContract, useReadContracts } from "wagmi";
import { formatEther } from "viem";
import { TOKEN_FACTORY_ABI } from "@/config/abi";
import { TOKEN_FACTORY_ADDRESS } from "@/config/wagmi";

interface FactoryStats {
  totalTokensCreated: number;
  creationFee: string;
  creationFeeWei: bigint;
  feeRecipient: string;
  owner: string;
  recentTokens: `0x${string}`[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useFactoryStats(): FactoryStats {
  // Batch read contract data
  const { data, isLoading, error, refetch } = useReadContracts({
    contracts: [
      {
        address: TOKEN_FACTORY_ADDRESS,
        abi: TOKEN_FACTORY_ABI,
        functionName: "getDeployedTokensCount",
      },
      {
        address: TOKEN_FACTORY_ADDRESS,
        abi: TOKEN_FACTORY_ABI,
        functionName: "creationFee",
      },
      {
        address: TOKEN_FACTORY_ADDRESS,
        abi: TOKEN_FACTORY_ABI,
        functionName: "feeRecipient",
      },
      {
        address: TOKEN_FACTORY_ADDRESS,
        abi: TOKEN_FACTORY_ABI,
        functionName: "owner",
      },
    ],
    query: {
      refetchInterval: 60000, // Refetch every minute
    },
  });

  // Get recent tokens
  const totalTokens = (data?.[0]?.result as bigint) || 0n;
  const recentCount = totalTokens > 10n ? 10 : Number(totalTokens);

  const { data: recentTokensData } = useReadContract({
    address: TOKEN_FACTORY_ADDRESS,
    abi: TOKEN_FACTORY_ABI,
    functionName: "getRecentTokens",
    args: [BigInt(recentCount)],
    query: {
      enabled: recentCount > 0,
    },
  });

  const creationFeeWei = (data?.[1]?.result as bigint) || 0n;

  return {
    totalTokensCreated: Number(totalTokens),
    creationFee: formatEther(creationFeeWei),
    creationFeeWei,
    feeRecipient: (data?.[2]?.result as string) || "",
    owner: (data?.[3]?.result as string) || "",
    recentTokens: (recentTokensData as `0x${string}`[]) || [],
    isLoading,
    error: error as Error | null,
    refetch,
  };
}

/**
 * Hook to get the current creation fee
 */
export function useCreationFee() {
  const { data, isLoading } = useReadContract({
    address: TOKEN_FACTORY_ADDRESS,
    abi: TOKEN_FACTORY_ABI,
    functionName: "creationFee",
  });

  const feeWei = (data as bigint) || 0n;

  return {
    feeWei,
    feeEth: formatEther(feeWei),
    isLoading,
  };
}
