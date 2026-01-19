/**
 * Local Storage Utilities
 * 
 * Type-safe local storage helpers for persisting app state.
 */

const STORAGE_PREFIX = 'base-token-forge';

/**
 * Storage keys enum
 */
export enum StorageKey {
  TOKENS_CREATED = 'tokens-created',
  TRANSACTION_HISTORY = 'transaction-history',
  USER_PREFERENCES = 'user-preferences',
  RECENT_TOKENS = 'recent-tokens',
  THEME = 'theme',
  DISMISSED_BANNERS = 'dismissed-banners',
}

/**
 * Get item from local storage with type safety
 */
export function getStorageItem<T>(key: StorageKey, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;

  try {
    const item = localStorage.getItem(`${STORAGE_PREFIX}:${key}`);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
}

/**
 * Set item in local storage
 */
export function setStorageItem<T>(key: StorageKey, value: T): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(`${STORAGE_PREFIX}:${key}`, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
  }
}

/**
 * Remove item from local storage
 */
export function removeStorageItem(key: StorageKey): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(`${STORAGE_PREFIX}:${key}`);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
}

/**
 * Clear all app storage
 */
export function clearAllStorage(): void {
  if (typeof window === 'undefined') return;

  try {
    Object.keys(localStorage)
      .filter(key => key.startsWith(STORAGE_PREFIX))
      .forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}

// =================
// Token Storage
// =================

export interface StoredToken {
  address: `0x${string}`;
  name: string;
  symbol: string;
  decimals: number;
  initialSupply: string;
  createdAt: number;
  transactionHash: `0x${string}`;
  chainId: number;
}

/**
 * Get all created tokens
 */
export function getCreatedTokens(): StoredToken[] {
  return getStorageItem<StoredToken[]>(StorageKey.TOKENS_CREATED, []);
}

/**
 * Add a created token to storage
 */
export function addCreatedToken(token: StoredToken): void {
  const tokens = getCreatedTokens();
  const exists = tokens.some(t => t.address === token.address);
  if (!exists) {
    setStorageItem(StorageKey.TOKENS_CREATED, [token, ...tokens]);
  }
}

/**
 * Remove a token from storage
 */
export function removeCreatedToken(address: `0x${string}`): void {
  const tokens = getCreatedTokens();
  setStorageItem(
    StorageKey.TOKENS_CREATED, 
    tokens.filter(t => t.address !== address)
  );
}

// =================
// User Preferences
// =================

export interface UserPreferences {
  defaultDecimals: number;
  showTestnetBanner: boolean;
  showGasEstimates: boolean;
  autoSwitchNetwork: boolean;
  theme: 'dark' | 'light' | 'system';
}

const DEFAULT_PREFERENCES: UserPreferences = {
  defaultDecimals: 18,
  showTestnetBanner: true,
  showGasEstimates: true,
  autoSwitchNetwork: true,
  theme: 'dark',
};

/**
 * Get user preferences
 */
export function getUserPreferences(): UserPreferences {
  return getStorageItem<UserPreferences>(StorageKey.USER_PREFERENCES, DEFAULT_PREFERENCES);
}

/**
 * Update user preferences
 */
export function updateUserPreferences(partial: Partial<UserPreferences>): void {
  const current = getUserPreferences();
  setStorageItem(StorageKey.USER_PREFERENCES, { ...current, ...partial });
}

// =================
// Dismissed Banners
// =================

/**
 * Check if a banner has been dismissed
 */
export function isBannerDismissed(bannerId: string): boolean {
  const dismissed = getStorageItem<string[]>(StorageKey.DISMISSED_BANNERS, []);
  return dismissed.includes(bannerId);
}

/**
 * Dismiss a banner
 */
export function dismissBanner(bannerId: string): void {
  const dismissed = getStorageItem<string[]>(StorageKey.DISMISSED_BANNERS, []);
  if (!dismissed.includes(bannerId)) {
    setStorageItem(StorageKey.DISMISSED_BANNERS, [...dismissed, bannerId]);
  }
}

/**
 * Reset dismissed banners
 */
export function resetDismissedBanners(): void {
  setStorageItem(StorageKey.DISMISSED_BANNERS, []);
}
