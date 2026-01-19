/**
 * Created Tokens Hook
 * 
 * Manages the list of tokens created by the user.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { 
  getCreatedTokens, 
  addCreatedToken, 
  removeCreatedToken,
  type StoredToken 
} from "@/lib/storage";

interface UseCreatedTokensOptions {
  filterByAddress?: boolean;
  chainId?: number;
}

export function useCreatedTokens(options: UseCreatedTokensOptions = {}) {
  const { filterByAddress = true, chainId } = options;
  const { address } = useAccount();

  const [tokens, setTokens] = useState<StoredToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load tokens from storage
  useEffect(() => {
    const stored = getCreatedTokens();
    
    let filtered = stored;
    
    // Filter by chain if specified
    if (chainId) {
      filtered = filtered.filter(t => t.chainId === chainId);
    }
    
    // Sort by creation date (newest first)
    filtered.sort((a, b) => b.createdAt - a.createdAt);
    
    setTokens(filtered);
    setIsLoading(false);
  }, [chainId, filterByAddress, address]);

  // Add a new token
  const addToken = useCallback((token: Omit<StoredToken, 'createdAt'>) => {
    const newToken: StoredToken = {
      ...token,
      createdAt: Date.now(),
    };
    
    addCreatedToken(newToken);
    setTokens(prev => [newToken, ...prev]);
  }, []);

  // Remove a token
  const removeToken = useCallback((tokenAddress: `0x${string}`) => {
    removeCreatedToken(tokenAddress);
    setTokens(prev => prev.filter(t => t.address !== tokenAddress));
  }, []);

  // Get token by address
  const getToken = useCallback((tokenAddress: `0x${string}`) => {
    return tokens.find(t => t.address.toLowerCase() === tokenAddress.toLowerCase());
  }, [tokens]);

  return {
    tokens,
    isLoading,
    isEmpty: tokens.length === 0,
    tokenCount: tokens.length,
    addToken,
    removeToken,
    getToken,
  };
}

/**
 * Get token creation statistics
 */
export function useTokenStats() {
  const { tokens } = useCreatedTokens({ filterByAddress: false });

  const stats = {
    totalTokens: tokens.length,
    tokensToday: 0,
    tokensThisWeek: 0,
    tokensThisMonth: 0,
    latestToken: tokens[0] || null,
  };

  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const weekMs = 7 * dayMs;
  const monthMs = 30 * dayMs;

  tokens.forEach(token => {
    const age = now - token.createdAt;
    if (age < dayMs) stats.tokensToday++;
    if (age < weekMs) stats.tokensThisWeek++;
    if (age < monthMs) stats.tokensThisMonth++;
  });

  return stats;
}
