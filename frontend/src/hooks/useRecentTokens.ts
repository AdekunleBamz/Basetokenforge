'use client';

/**
 * useRecentTokens Hook
 * 
 * Manages recently viewed or created tokens with local storage persistence.
 * Optimized for Base L2 token tracking.
 */

import { useState, useEffect, useCallback } from 'react';
import type { Address } from 'viem';

// Recent token record
export interface RecentToken {
  address: Address;
  chainId: number;
  name: string;
  symbol: string;
  decimals: number;
  viewedAt: number;
  isCreated?: boolean;
}

// Hook options
interface UseRecentTokensOptions {
  /** Maximum number of recent tokens to store */
  maxItems?: number;
  /** Storage key prefix */
  storageKey?: string;
}

// Hook return type
interface UseRecentTokensReturn {
  /** List of recent tokens */
  recentTokens: RecentToken[];
  /** Add or update a token in recent list */
  addRecentToken: (token: Omit<RecentToken, 'viewedAt'>) => void;
  /** Remove a token from recent list */
  removeRecentToken: (address: Address, chainId: number) => void;
  /** Clear all recent tokens */
  clearRecentTokens: () => void;
  /** Get a specific recent token */
  getRecentToken: (address: Address, chainId: number) => RecentToken | undefined;
  /** Check if token is in recent list */
  isRecent: (address: Address, chainId: number) => boolean;
}

const DEFAULT_MAX_ITEMS = 20;
const DEFAULT_STORAGE_KEY = 'base-token-forge:recent-tokens';

export function useRecentTokens(options?: UseRecentTokensOptions): UseRecentTokensReturn {
  const maxItems = options?.maxItems ?? DEFAULT_MAX_ITEMS;
  const storageKey = options?.storageKey ?? DEFAULT_STORAGE_KEY;

  const [recentTokens, setRecentTokens] = useState<RecentToken[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from storage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as RecentToken[];
        // Validate and clean data
        const valid = parsed.filter(
          (t) =>
            t.address &&
            t.chainId &&
            t.name &&
            t.symbol &&
            typeof t.decimals === 'number' &&
            typeof t.viewedAt === 'number'
        );
        setRecentTokens(valid);
      }
    } catch (error) {
      console.error('Failed to load recent tokens:', error);
    } finally {
      setIsInitialized(true);
    }
  }, [storageKey]);

  // Save to storage when tokens change
  useEffect(() => {
    if (!isInitialized || typeof window === 'undefined') return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(recentTokens));
    } catch (error) {
      console.error('Failed to save recent tokens:', error);
    }
  }, [recentTokens, storageKey, isInitialized]);

  // Add or update a token
  const addRecentToken = useCallback(
    (token: Omit<RecentToken, 'viewedAt'>) => {
      const normalizedAddress = token.address.toLowerCase() as Address;
      
      setRecentTokens((prev) => {
        // Remove existing entry for this token
        const filtered = prev.filter(
          (t) =>
            !(
              t.address.toLowerCase() === normalizedAddress &&
              t.chainId === token.chainId
            )
        );

        // Add new entry at the beginning
        const updated: RecentToken[] = [
          {
            ...token,
            address: normalizedAddress,
            viewedAt: Date.now(),
          },
          ...filtered,
        ];

        // Limit to max items
        return updated.slice(0, maxItems);
      });
    },
    [maxItems]
  );

  // Remove a token
  const removeRecentToken = useCallback(
    (address: Address, chainId: number) => {
      const normalizedAddress = address.toLowerCase();
      
      setRecentTokens((prev) =>
        prev.filter(
          (t) =>
            !(t.address.toLowerCase() === normalizedAddress && t.chainId === chainId)
        )
      );
    },
    []
  );

  // Clear all tokens
  const clearRecentTokens = useCallback(() => {
    setRecentTokens([]);
  }, []);

  // Get a specific token
  const getRecentToken = useCallback(
    (address: Address, chainId: number): RecentToken | undefined => {
      const normalizedAddress = address.toLowerCase();
      return recentTokens.find(
        (t) =>
          t.address.toLowerCase() === normalizedAddress && t.chainId === chainId
      );
    },
    [recentTokens]
  );

  // Check if token is recent
  const isRecent = useCallback(
    (address: Address, chainId: number): boolean => {
      return getRecentToken(address, chainId) !== undefined;
    },
    [getRecentToken]
  );

  return {
    recentTokens,
    addRecentToken,
    removeRecentToken,
    clearRecentTokens,
    getRecentToken,
    isRecent,
  };
}

/**
 * useFavoriteTokens Hook
 * 
 * Manages favorite tokens with local storage persistence.
 */

export interface FavoriteToken {
  address: Address;
  chainId: number;
  name: string;
  symbol: string;
  decimals: number;
  addedAt: number;
}

interface UseFavoriteTokensReturn {
  /** List of favorite tokens */
  favoriteTokens: FavoriteToken[];
  /** Toggle favorite status */
  toggleFavorite: (token: Omit<FavoriteToken, 'addedAt'>) => void;
  /** Check if token is favorite */
  isFavorite: (address: Address, chainId: number) => boolean;
  /** Clear all favorites */
  clearFavorites: () => void;
}

const FAVORITES_STORAGE_KEY = 'base-token-forge:favorite-tokens';

export function useFavoriteTokens(): UseFavoriteTokensReturn {
  const [favoriteTokens, setFavoriteTokens] = useState<FavoriteToken[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from storage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as FavoriteToken[];
        setFavoriteTokens(parsed);
      }
    } catch (error) {
      console.error('Failed to load favorite tokens:', error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to storage when tokens change
  useEffect(() => {
    if (!isInitialized || typeof window === 'undefined') return;

    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteTokens));
    } catch (error) {
      console.error('Failed to save favorite tokens:', error);
    }
  }, [favoriteTokens, isInitialized]);

  // Toggle favorite
  const toggleFavorite = useCallback(
    (token: Omit<FavoriteToken, 'addedAt'>) => {
      const normalizedAddress = token.address.toLowerCase() as Address;
      
      setFavoriteTokens((prev) => {
        const exists = prev.some(
          (t) =>
            t.address.toLowerCase() === normalizedAddress &&
            t.chainId === token.chainId
        );

        if (exists) {
          // Remove from favorites
          return prev.filter(
            (t) =>
              !(
                t.address.toLowerCase() === normalizedAddress &&
                t.chainId === token.chainId
              )
          );
        } else {
          // Add to favorites
          return [
            ...prev,
            {
              ...token,
              address: normalizedAddress,
              addedAt: Date.now(),
            },
          ];
        }
      });
    },
    []
  );

  // Check if favorite
  const isFavorite = useCallback(
    (address: Address, chainId: number): boolean => {
      const normalizedAddress = address.toLowerCase();
      return favoriteTokens.some(
        (t) =>
          t.address.toLowerCase() === normalizedAddress && t.chainId === chainId
      );
    },
    [favoriteTokens]
  );

  // Clear all
  const clearFavorites = useCallback(() => {
    setFavoriteTokens([]);
  }, []);

  return {
    favoriteTokens,
    toggleFavorite,
    isFavorite,
    clearFavorites,
  };
}

export default useRecentTokens;
