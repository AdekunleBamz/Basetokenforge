"use client";

import { useReadContract, useReadContracts } from "wagmi";
import { TOKEN_FACTORY_ABI, ERC20_ABI } from "@/config/abi";
import { TOKEN_FACTORY_ADDRESS } from "@/config/wagmi";
import type { TokenInfo } from "@/types";

interface UseUserTokensReturn {
  tokens: TokenInfo[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useUserTokens(address: `0x${string}` | null): UseUserTokensReturn {
  // Get user's tokens from factory
  const { 
    data: tokenAddresses, 
    isLoading: isLoadingAddresses,
    error: addressError,
    refetch 
  } = useReadContract({
    address: TOKEN_FACTORY_ADDRESS,
    abi: TOKEN_FACTORY_ABI,
    functionName: "getTokensByCreator",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Build contracts array for multicall
  const tokenContracts = (tokenAddresses || []).flatMap((addr) => [
    { address: addr as `0x${string}`, abi: ERC20_ABI, functionName: "name" },
    { address: addr as `0x${string}`, abi: ERC20_ABI, functionName: "symbol" },
    { address: addr as `0x${string}`, abi: ERC20_ABI, functionName: "decimals" },
    { address: addr as `0x${string}`, abi: ERC20_ABI, functionName: "totalSupply" },
  ]);

  // Fetch token details
  const { 
    data: tokenDetails, 
    isLoading: isLoadingDetails 
  } = useReadContracts({
    contracts: tokenContracts,
    query: {
      enabled: tokenAddresses && tokenAddresses.length > 0,
    },
  });

  // Parse token info
  const tokens: TokenInfo[] = (tokenAddresses || []).map((addr, i) => {
    const baseIdx = i * 4;
    return {
      address: addr as `0x${string}`,
      name: tokenDetails?.[baseIdx]?.result as string | undefined,
      symbol: tokenDetails?.[baseIdx + 1]?.result as string | undefined,
      decimals: tokenDetails?.[baseIdx + 2]?.result as number | undefined,
      totalSupply: tokenDetails?.[baseIdx + 3]?.result as bigint | undefined,
    };
  });

  return {
    tokens,
    isLoading: isLoadingAddresses || isLoadingDetails,
    error: addressError || null,
    refetch,
  };
}
