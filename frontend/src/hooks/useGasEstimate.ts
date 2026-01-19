/**
 * useGasEstimate Hook
 * 
 * Estimates gas costs for token operations on Base L2.
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { usePublicClient } from "wagmi";
import { parseEther, formatEther, encodeFunctionData } from "viem";
import { TOKEN_FACTORY_ABI } from "@/config/abi";
import { TOKEN_FACTORY_ADDRESS, CREATION_FEE } from "@/config/wagmi";

interface GasEstimateResult {
  gasLimit: bigint;
  gasPrice: bigint;
  estimatedCost: string;
  estimatedCostUsd: string;
  isLoading: boolean;
  error: Error | null;
}

interface TokenCreationParams {
  name: string;
  symbol: string;
  decimals: number;
  supply: bigint;
}

const ETH_PRICE_USD = 2500; // Would typically fetch live price

export function useGasEstimate(
  params: TokenCreationParams | null,
  enabled: boolean = true
): GasEstimateResult {
  const publicClient = usePublicClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['gasEstimate', params?.name, params?.symbol, params?.decimals, params?.supply?.toString()],
    queryFn: async () => {
      if (!params || !publicClient) {
        throw new Error("Missing parameters");
      }

      // Estimate gas for token creation
      const gasLimit = await publicClient.estimateGas({
        to: TOKEN_FACTORY_ADDRESS,
        data: encodeFunctionData({
          abi: TOKEN_FACTORY_ABI,
          functionName: "createToken",
          args: [params.name, params.symbol, params.decimals, params.supply],
        }),
        value: parseEther(CREATION_FEE),
      });

      // Get current gas price
      const gasPrice = await publicClient.getGasPrice();

      // Calculate estimated cost
      const estimatedCostWei = gasLimit * gasPrice;
      const estimatedCost = formatEther(estimatedCostWei);
      const estimatedCostUsd = (parseFloat(estimatedCost) * ETH_PRICE_USD).toFixed(4);

      return {
        gasLimit,
        gasPrice,
        estimatedCost,
        estimatedCostUsd,
      };
    },
    enabled: enabled && !!params && !!publicClient,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });

  return {
    gasLimit: data?.gasLimit || 0n,
    gasPrice: data?.gasPrice || 0n,
    estimatedCost: data?.estimatedCost || "0",
    estimatedCostUsd: data?.estimatedCostUsd || "0",
    isLoading,
    error: error as Error | null,
  };
}

/**
 * Simple hook to get current Base gas price
 */
export function useBaseGasPrice() {
  const publicClient = usePublicClient();

  return useQuery({
    queryKey: ['baseGasPrice'],
    queryFn: async () => {
      if (!publicClient) throw new Error("No client");
      
      const gasPrice = await publicClient.getGasPrice();
      const gasPriceGwei = Number(gasPrice) / 1e9;
      
      return {
        wei: gasPrice,
        gwei: gasPriceGwei,
        formatted: `${gasPriceGwei.toFixed(6)} Gwei`,
      };
    },
    enabled: !!publicClient,
    staleTime: 15000,
    refetchInterval: 30000,
  });
}
