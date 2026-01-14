"use client";

import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { parseUnits, parseEther, formatEther, createWalletClient, custom } from "viem";
import { base } from "viem/chains";
import { useState, useCallback } from "react";
import { TOKEN_FACTORY_ABI } from "@/config/abi";
import { TOKEN_FACTORY_ADDRESS, CREATION_FEE } from "@/config/wagmi";
import { useFarcaster } from "./useFarcaster";
import { sdk } from "@farcaster/frame-sdk";
import type { TokenFormData, TransactionState } from "@/types";

interface UseTokenCreatorReturn {
  createToken: (data: TokenFormData) => Promise<void>;
  transactionState: TransactionState;
  fee: string;
  reset: () => void;
}

export function useTokenCreator(address: `0x${string}` | null): UseTokenCreatorReturn {
  const { isInFrame } = useFarcaster();
  
  // Farcaster-specific state
  const [fcTxHash, setFcTxHash] = useState<`0x${string}` | null>(null);
  const [fcIsPending, setFcIsPending] = useState(false);
  const [fcError, setFcError] = useState<string | null>(null);

  // Read current fee from contract
  const { data: currentFee } = useReadContract({
    address: TOKEN_FACTORY_ADDRESS,
    abi: TOKEN_FACTORY_ABI,
    functionName: "creationFee",
  });

  const fee = currentFee ? formatEther(currentFee) : CREATION_FEE;

  // Wagmi write contract hook
  const { 
    data: hash, 
    isPending, 
    writeContract, 
    error,
    reset: resetWagmi 
  } = useWriteContract();

  // Wait for transaction receipt
  const { 
    isLoading: isConfirming, 
    isSuccess 
  } = useWaitForTransactionReceipt({
    hash: hash || fcTxHash || undefined,
  });

  // Create token function
  const createToken = useCallback(async (data: TokenFormData) => {
    if (!address) throw new Error("Wallet not connected");

    const supplyWithDecimals = parseUnits(data.supply, data.decimals);

    if (isInFrame) {
      // Use Farcaster wallet
      setFcIsPending(true);
      setFcError(null);
      setFcTxHash(null);

      try {
        const walletClient = createWalletClient({
          chain: base,
          transport: custom(sdk.wallet.ethProvider),
        });

        const txHash = await walletClient.writeContract({
          address: TOKEN_FACTORY_ADDRESS,
          abi: TOKEN_FACTORY_ABI,
          functionName: "createToken",
          args: [data.name, data.symbol, data.decimals, supplyWithDecimals],
          value: parseEther(fee),
          account: address,
        });

        setFcTxHash(txHash);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Transaction failed";
        setFcError(message);
        throw err;
      } finally {
        setFcIsPending(false);
      }
    } else {
      // Use wagmi/AppKit
      writeContract({
        address: TOKEN_FACTORY_ADDRESS,
        abi: TOKEN_FACTORY_ABI,
        functionName: "createToken",
        args: [data.name, data.symbol, data.decimals, supplyWithDecimals],
        value: parseEther(fee),
      });
    }
  }, [address, isInFrame, fee, writeContract]);

  // Reset function
  const reset = useCallback(() => {
    setFcTxHash(null);
    setFcIsPending(false);
    setFcError(null);
    resetWagmi();
  }, [resetWagmi]);

  // Combine transaction states
  const transactionState: TransactionState = {
    hash: isInFrame ? fcTxHash : hash ?? null,
    isPending: isInFrame ? fcIsPending : isPending,
    isConfirming,
    isSuccess: isSuccess && !!(isInFrame ? fcTxHash : hash),
    error: isInFrame ? fcError : error?.message ?? null,
  };

  return {
    createToken,
    transactionState,
    fee,
    reset,
  };
}
