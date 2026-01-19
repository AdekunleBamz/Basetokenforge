/**
 * Wallet Connection Hook
 * 
 * Enhanced wallet connection handling with Base-specific features.
 */

"use client";

import { useAccount, useConnect, useDisconnect, useBalance, useSwitchChain } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { useMemo, useCallback } from "react";
import { formatEther } from "viem";

// Default to mainnet, use testnet in development
const TARGET_CHAIN = process.env.NEXT_PUBLIC_USE_TESTNET === 'true' ? baseSepolia : base;

export interface WalletState {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  isReconnecting: boolean;
  isDisconnected: boolean;
  
  // Account info
  address: `0x${string}` | undefined;
  shortAddress: string | null;
  
  // Chain info
  chainId: number | undefined;
  isOnBase: boolean;
  isOnBaseSepolia: boolean;
  isOnCorrectNetwork: boolean;
  networkName: string | null;
  
  // Balance
  balance: string | null;
  balanceFormatted: string | null;
  isLoadingBalance: boolean;
  
  // Actions
  connect: () => void;
  disconnect: () => void;
  switchToBase: () => Promise<void>;
}

export function useWalletConnection(): WalletState {
  const { 
    address, 
    isConnected, 
    isConnecting, 
    isReconnecting, 
    isDisconnected,
    chain,
  } = useAccount();

  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  const { data: balanceData, isLoading: isLoadingBalance } = useBalance({
    address: address,
    chainId: TARGET_CHAIN.id,
  });

  // Chain status
  const chainId = chain?.id;
  const isOnBase = chainId === base.id;
  const isOnBaseSepolia = chainId === baseSepolia.id;
  const isOnCorrectNetwork = chainId === TARGET_CHAIN.id;

  // Network name
  const networkName = useMemo(() => {
    if (!chainId) return null;
    if (isOnBase) return 'Base';
    if (isOnBaseSepolia) return 'Base Sepolia';
    return chain?.name || 'Unknown';
  }, [chainId, isOnBase, isOnBaseSepolia, chain?.name]);

  // Shortened address
  const shortAddress = useMemo(() => {
    if (!address) return null;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, [address]);

  // Formatted balance
  const balance = balanceData ? formatEther(balanceData.value) : null;
  const balanceFormatted = useMemo(() => {
    if (!balance) return null;
    const num = parseFloat(balance);
    if (num < 0.0001) return '< 0.0001 ETH';
    if (num < 1) return `${num.toFixed(4)} ETH`;
    return `${num.toFixed(3)} ETH`;
  }, [balance]);

  // Connect handler
  const handleConnect = useCallback(() => {
    const connector = connectors[0];
    if (connector) {
      connect({ connector });
    }
  }, [connect, connectors]);

  // Switch to Base
  const switchToBase = useCallback(async () => {
    if (switchChain) {
      switchChain({ chainId: TARGET_CHAIN.id });
    }
  }, [switchChain]);

  return {
    isConnected,
    isConnecting,
    isReconnecting,
    isDisconnected,
    address,
    shortAddress,
    chainId,
    isOnBase,
    isOnBaseSepolia,
    isOnCorrectNetwork,
    networkName,
    balance,
    balanceFormatted,
    isLoadingBalance,
    connect: handleConnect,
    disconnect,
    switchToBase,
  };
}

/**
 * Check if wallet has sufficient balance
 */
export function useSufficientBalance(requiredAmount: bigint) {
  const { balance } = useWalletConnection();
  
  const balanceWei = useMemo(() => {
    if (!balance) return BigInt(0);
    try {
      return BigInt(Math.floor(parseFloat(balance) * 1e18));
    } catch {
      return BigInt(0);
    }
  }, [balance]);

  const isSufficient = balanceWei >= requiredAmount;
  const deficit = isSufficient ? BigInt(0) : requiredAmount - balanceWei;

  return {
    isSufficient,
    deficit,
    deficitFormatted: formatEther(deficit),
  };
}
