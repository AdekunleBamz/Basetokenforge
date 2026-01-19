/**
 * Local Storage Hook for Token Data
 * 
 * Persists token information and user preferences to localStorage.
 * Provides type-safe access with automatic serialization.
 */

import { useState, useEffect, useCallback } from 'react';

// Storage keys
const STORAGE_PREFIX = 'base-token-forge';
const STORAGE_KEYS = {
  CREATED_TOKENS: `${STORAGE_PREFIX}:created-tokens`,
  FAVORITE_TOKENS: `${STORAGE_PREFIX}:favorite-tokens`,
  RECENT_RECIPIENTS: `${STORAGE_PREFIX}:recent-recipients`,
  USER_PREFERENCES: `${STORAGE_PREFIX}:preferences`,
  TRANSACTION_HISTORY: `${STORAGE_PREFIX}:tx-history`,
} as const;

// Types
export interface StoredToken {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  initialSupply: string;
  createdAt: string;
  chainId: number;
  transactionHash?: string;
}

export interface UserPreferences {
  defaultDecimals: number;
  infiniteApproval: boolean;
  showTestnets: boolean;
  compactMode: boolean;
  autoRefreshInterval: number;
}

export interface StoredTransaction {
  hash: string;
  type: 'create' | 'transfer' | 'approve';
  tokenAddress?: string;
  timestamp: string;
  status: 'pending' | 'success' | 'failed';
  chainId: number;
}

// Default preferences
const DEFAULT_PREFERENCES: UserPreferences = {
  defaultDecimals: 18,
  infiniteApproval: true,
  showTestnets: true,
  compactMode: false,
  autoRefreshInterval: 30000,
};

/**
 * Generic localStorage hook with type safety
 */
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // Get from localStorage or use initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Save to localStorage whenever value changes
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}

/**
 * Hook for managing created tokens in localStorage
 */
export function useStoredTokens() {
  const [tokens, setTokens] = useLocalStorage<StoredToken[]>(STORAGE_KEYS.CREATED_TOKENS, []);

  const addToken = useCallback((token: StoredToken) => {
    setTokens((prev) => {
      // Check if already exists
      const exists = prev.some(
        (t) => t.address.toLowerCase() === token.address.toLowerCase() && t.chainId === token.chainId
      );
      if (exists) return prev;
      
      return [token, ...prev];
    });
  }, [setTokens]);

  const removeToken = useCallback((address: string, chainId: number) => {
    setTokens((prev) => 
      prev.filter(
        (t) => !(t.address.toLowerCase() === address.toLowerCase() && t.chainId === chainId)
      )
    );
  }, [setTokens]);

  const getToken = useCallback((address: string, chainId: number): StoredToken | undefined => {
    return tokens.find(
      (t) => t.address.toLowerCase() === address.toLowerCase() && t.chainId === chainId
    );
  }, [tokens]);

  const clearAll = useCallback(() => {
    setTokens([]);
  }, [setTokens]);

  return {
    tokens,
    addToken,
    removeToken,
    getToken,
    clearAll,
    count: tokens.length,
  };
}

/**
 * Hook for managing favorite tokens
 */
export function useFavoriteTokens() {
  const [favorites, setFavorites] = useLocalStorage<string[]>(STORAGE_KEYS.FAVORITE_TOKENS, []);

  const addFavorite = useCallback((address: string) => {
    setFavorites((prev) => {
      if (prev.includes(address.toLowerCase())) return prev;
      return [...prev, address.toLowerCase()];
    });
  }, [setFavorites]);

  const removeFavorite = useCallback((address: string) => {
    setFavorites((prev) => prev.filter((a) => a !== address.toLowerCase()));
  }, [setFavorites]);

  const isFavorite = useCallback((address: string): boolean => {
    return favorites.includes(address.toLowerCase());
  }, [favorites]);

  const toggleFavorite = useCallback((address: string) => {
    if (isFavorite(address)) {
      removeFavorite(address);
    } else {
      addFavorite(address);
    }
  }, [isFavorite, addFavorite, removeFavorite]);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    count: favorites.length,
  };
}

/**
 * Hook for managing recent recipient addresses
 */
export function useRecentRecipients(maxRecent: number = 10) {
  const [recipients, setRecipients] = useLocalStorage<string[]>(STORAGE_KEYS.RECENT_RECIPIENTS, []);

  const addRecipient = useCallback((address: string) => {
    setRecipients((prev) => {
      const filtered = prev.filter((a) => a.toLowerCase() !== address.toLowerCase());
      return [address.toLowerCase(), ...filtered].slice(0, maxRecent);
    });
  }, [setRecipients, maxRecent]);

  const removeRecipient = useCallback((address: string) => {
    setRecipients((prev) => prev.filter((a) => a !== address.toLowerCase()));
  }, [setRecipients]);

  const clearRecipients = useCallback(() => {
    setRecipients([]);
  }, [setRecipients]);

  return {
    recipients,
    addRecipient,
    removeRecipient,
    clearRecipients,
  };
}

/**
 * Hook for managing user preferences
 */
export function useUserPreferences() {
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>(
    STORAGE_KEYS.USER_PREFERENCES,
    DEFAULT_PREFERENCES
  );

  const updatePreference = useCallback(<K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, [setPreferences]);

  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
  }, [setPreferences]);

  return {
    preferences,
    updatePreference,
    resetPreferences,
  };
}

/**
 * Hook for managing transaction history
 */
export function useTransactionHistory(maxHistory: number = 100) {
  const [history, setHistory] = useLocalStorage<StoredTransaction[]>(
    STORAGE_KEYS.TRANSACTION_HISTORY,
    []
  );

  const addTransaction = useCallback((tx: Omit<StoredTransaction, 'timestamp'>) => {
    setHistory((prev) => {
      const newTx: StoredTransaction = {
        ...tx,
        timestamp: new Date().toISOString(),
      };
      return [newTx, ...prev].slice(0, maxHistory);
    });
  }, [setHistory, maxHistory]);

  const updateTransactionStatus = useCallback((
    hash: string,
    status: StoredTransaction['status']
  ) => {
    setHistory((prev) =>
      prev.map((tx) => (tx.hash === hash ? { ...tx, status } : tx))
    );
  }, [setHistory]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  const getByToken = useCallback((tokenAddress: string): StoredTransaction[] => {
    return history.filter(
      (tx) => tx.tokenAddress?.toLowerCase() === tokenAddress.toLowerCase()
    );
  }, [history]);

  return {
    history,
    addTransaction,
    updateTransactionStatus,
    clearHistory,
    getByToken,
  };
}

/**
 * Clear all Base Token Forge storage
 */
export function clearAllStorage(): void {
  if (typeof window === 'undefined') return;

  Object.values(STORAGE_KEYS).forEach((key) => {
    window.localStorage.removeItem(key);
  });
}

/**
 * Export all stored data (for backup)
 */
export function exportStorageData(): string {
  if (typeof window === 'undefined') return '{}';

  const data: Record<string, unknown> = {};

  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        data[name] = JSON.parse(item);
      }
    } catch {
      // Skip invalid items
    }
  });

  return JSON.stringify(data, null, 2);
}
