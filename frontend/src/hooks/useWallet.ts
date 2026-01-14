"use client";

import { useAppKitAccount } from "@reown/appkit/react";
import { useState, useEffect, useCallback } from "react";
import { useFarcaster } from "./useFarcaster";
import { sdk } from "@farcaster/frame-sdk";
import type { WalletState, WalletType } from "@/types";

interface UseWalletReturn extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => void;
  isReady: boolean;
}

export function useWallet(): UseWalletReturn {
  const { 
    address: appKitAddress, 
    isConnected: isAppKitConnected 
  } = useAppKitAccount();
  const { isInFrame } = useFarcaster();
  
  const [farcasterAddress, setFarcasterAddress] = useState<`0x${string}` | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Get Farcaster address on mount if in frame
  useEffect(() => {
    if (isInFrame) {
      sdk.wallet.ethProvider
        .request({ method: "eth_accounts" })
        .then((accounts) => {
          if (accounts && accounts.length > 0) {
            setFarcasterAddress(accounts[0] as `0x${string}`);
          }
          setIsReady(true);
        })
        .catch(() => {
          setIsReady(true);
        });
    } else {
      setIsReady(true);
    }
  }, [isInFrame]);

  // Determine current wallet state
  const isConnected = isInFrame ? !!farcasterAddress : isAppKitConnected;
  const address = isInFrame 
    ? farcasterAddress 
    : (appKitAddress as `0x${string}` | undefined) ?? null;
  const walletType: WalletType | null = isConnected 
    ? (isInFrame ? 'farcaster' : 'appkit') 
    : null;

  // Connect wallet
  const connect = useCallback(async () => {
    if (isConnecting) return;
    
    setIsConnecting(true);
    try {
      if (isInFrame) {
        const accounts = await sdk.wallet.ethProvider.request({
          method: "eth_requestAccounts",
        });
        if (accounts && accounts.length > 0) {
          setFarcasterAddress(accounts[0] as `0x${string}`);
        }
      }
      // AppKit connection is handled by the AppKit modal
    } catch (error) {
      console.error("Wallet connection error:", error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, [isInFrame, isConnecting]);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    if (isInFrame) {
      setFarcasterAddress(null);
    }
    // AppKit disconnection is handled by the AppKit modal
  }, [isInFrame]);

  return {
    address,
    isConnected,
    isConnecting,
    walletType,
    connect,
    disconnect,
    isReady,
  };
}
