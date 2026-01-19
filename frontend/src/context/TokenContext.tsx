/**
 * Token Context
 * 
 * Provides token-related state and actions.
 */

"use client";

import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { useCreatedTokens } from "@/hooks/useCreatedTokens";
import type { StoredToken } from "@/lib/storage";

interface TokenContextValue {
  // Created tokens
  tokens: StoredToken[];
  isLoading: boolean;
  isEmpty: boolean;
  
  // Selected token
  selectedToken: StoredToken | null;
  selectToken: (token: StoredToken | null) => void;
  
  // Token actions
  addToken: (token: Omit<StoredToken, 'createdAt'>) => void;
  removeToken: (address: `0x${string}`) => void;
  
  // UI state
  isShareModalOpen: boolean;
  openShareModal: (token: StoredToken) => void;
  closeShareModal: () => void;
  
  // Stats
  totalTokens: number;
  recentTokens: number;
}

const TokenContext = createContext<TokenContextValue | null>(null);

export function TokenProvider({ children }: { children: ReactNode }) {
  const { 
    tokens, 
    isLoading, 
    isEmpty, 
    addToken, 
    removeToken,
    stats,
  } = useCreatedTokens();

  const [selectedToken, setSelectedToken] = useState<StoredToken | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareToken, setShareToken] = useState<StoredToken | null>(null);

  const selectToken = useCallback((token: StoredToken | null) => {
    setSelectedToken(token);
  }, []);

  const openShareModal = useCallback((token: StoredToken) => {
    setShareToken(token);
    setIsShareModalOpen(true);
  }, []);

  const closeShareModal = useCallback(() => {
    setIsShareModalOpen(false);
    setShareToken(null);
  }, []);

  const value: TokenContextValue = {
    tokens,
    isLoading,
    isEmpty,
    selectedToken: shareToken || selectedToken,
    selectToken,
    addToken,
    removeToken,
    isShareModalOpen,
    openShareModal,
    closeShareModal,
    totalTokens: stats.totalTokens,
    recentTokens: stats.recentTokens,
  };

  return (
    <TokenContext.Provider value={value}>
      {children}
    </TokenContext.Provider>
  );
}

export function useTokenContext() {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error('useTokenContext must be used within TokenProvider');
  }
  return context;
}

/**
 * Hook for recently created tokens
 */
export function useRecentTokens(limit: number = 5) {
  const { tokens } = useTokenContext();
  return tokens.slice(0, limit);
}
