/**
 * Base Chain Feature Flags
 * 
 * Feature flags and configuration for enabling/disabling
 * specific features in Base Token Forge.
 */

// ============================================
// Feature Flags
// ============================================

/** Feature flag configuration */
export interface FeatureFlags {
  /** Enable testnet networks */
  enableTestnet: boolean;
  /** Enable token creation */
  enableTokenCreation: boolean;
  /** Enable token transfers */
  enableTransfers: boolean;
  /** Enable token approvals */
  enableApprovals: boolean;
  /** Enable token importing */
  enableImport: boolean;
  /** Enable analytics tracking */
  enableAnalytics: boolean;
  /** Enable debug mode */
  enableDebug: boolean;
  /** Enable experimental features */
  enableExperimental: boolean;
  /** Enable Farcaster integration */
  enableFarcaster: boolean;
  /** Enable share functionality */
  enableShare: boolean;
}

/** Default feature flags */
export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  enableTestnet: true,
  enableTokenCreation: true,
  enableTransfers: true,
  enableApprovals: true,
  enableImport: true,
  enableAnalytics: false,
  enableDebug: process.env.NODE_ENV === 'development',
  enableExperimental: false,
  enableFarcaster: true,
  enableShare: true,
};

// ============================================
// Environment Configuration
// ============================================

/** Check if running in browser */
export const IS_BROWSER = typeof window !== 'undefined';

/** Check if running in production */
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

/** Check if running in development */
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

/** Check if running in test */
export const IS_TEST = process.env.NODE_ENV === 'test';

// ============================================
// Runtime Configuration
// ============================================

/** Runtime configuration */
export interface RuntimeConfig {
  /** Application name */
  appName: string;
  /** Application version */
  appVersion: string;
  /** Default chain ID */
  defaultChainId: number;
  /** API base URL */
  apiBaseUrl: string;
  /** Analytics ID */
  analyticsId?: string;
  /** Feature flags */
  features: FeatureFlags;
}

/** Get runtime configuration */
export function getRuntimeConfig(): RuntimeConfig {
  return {
    appName: 'Base Token Forge',
    appVersion: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    defaultChainId: IS_PRODUCTION ? 8453 : 84532,
    apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || '',
    analyticsId: process.env.NEXT_PUBLIC_ANALYTICS_ID,
    features: {
      ...DEFAULT_FEATURE_FLAGS,
      enableTestnet: !IS_PRODUCTION || true,
      enableDebug: IS_DEVELOPMENT,
    },
  };
}

// ============================================
// Feature Checks
// ============================================

/** Check if a feature is enabled */
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  const config = getRuntimeConfig();
  return config.features[feature];
}

/** Check if testnet is enabled */
export function isTestnetEnabled(): boolean {
  return isFeatureEnabled('enableTestnet');
}

/** Check if debug mode is enabled */
export function isDebugEnabled(): boolean {
  return isFeatureEnabled('enableDebug');
}

/** Check if analytics is enabled */
export function isAnalyticsEnabled(): boolean {
  return isFeatureEnabled('enableAnalytics');
}

// ============================================
// Chain Configuration
// ============================================

/** Chain configuration options */
export interface ChainConfig {
  /** Chain ID */
  id: number;
  /** Chain name */
  name: string;
  /** Is testnet */
  isTestnet: boolean;
  /** RPC URL */
  rpcUrl: string;
  /** Block explorer URL */
  explorerUrl: string;
  /** Native currency symbol */
  currency: string;
  /** Token factory address */
  factoryAddress?: string;
}

/** Base mainnet configuration */
export const BASE_MAINNET_CONFIG: ChainConfig = {
  id: 8453,
  name: 'Base',
  isTestnet: false,
  rpcUrl: 'https://mainnet.base.org',
  explorerUrl: 'https://basescan.org',
  currency: 'ETH',
  factoryAddress: undefined, // To be deployed
};

/** Base Sepolia configuration */
export const BASE_SEPOLIA_CONFIG: ChainConfig = {
  id: 84532,
  name: 'Base Sepolia',
  isTestnet: true,
  rpcUrl: 'https://sepolia.base.org',
  explorerUrl: 'https://sepolia.basescan.org',
  currency: 'ETH',
  factoryAddress: undefined, // To be deployed
};

/** All chain configurations */
export const CHAIN_CONFIGS: Record<number, ChainConfig> = {
  [BASE_MAINNET_CONFIG.id]: BASE_MAINNET_CONFIG,
  [BASE_SEPOLIA_CONFIG.id]: BASE_SEPOLIA_CONFIG,
};

/** Get chain configuration by ID */
export function getChainConfig(chainId: number): ChainConfig | undefined {
  return CHAIN_CONFIGS[chainId];
}

/** Check if chain is supported */
export function isSupportedChain(chainId: number): boolean {
  const config = getChainConfig(chainId);
  if (!config) return false;
  if (config.isTestnet && !isTestnetEnabled()) return false;
  return true;
}

/** Get supported chain IDs */
export function getSupportedChainIds(): number[] {
  return Object.keys(CHAIN_CONFIGS)
    .map(Number)
    .filter(isSupportedChain);
}

// ============================================
// Application Limits
// ============================================

/** Application limits */
export const LIMITS = {
  /** Maximum tokens per wallet display */
  maxTokensPerWallet: 100,
  /** Maximum recent tokens to store */
  maxRecentTokens: 20,
  /** Maximum favorite tokens */
  maxFavoriteTokens: 50,
  /** Maximum transaction history items */
  maxTransactionHistory: 100,
  /** Maximum file upload size (bytes) */
  maxFileUploadSize: 5 * 1024 * 1024, // 5MB
  /** Maximum API requests per minute */
  maxApiRequestsPerMinute: 60,
};

export default {
  getRuntimeConfig,
  isFeatureEnabled,
  getChainConfig,
  isSupportedChain,
  LIMITS,
};
