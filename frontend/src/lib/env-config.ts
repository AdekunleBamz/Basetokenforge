/**
 * Environment Configuration
 * 
 * Type-safe environment variable access for Base Token Forge.
 */

/**
 * Environment configuration type
 */
interface EnvConfig {
  // WalletConnect
  walletConnectProjectId: string;
  
  // Contract addresses
  factoryAddress: `0x${string}`;
  
  // API Keys
  basescanApiKey: string;
  
  // URLs
  baseRpcUrl: string;
  baseSepoliaRpcUrl: string;
  
  // Feature flags
  isTestnet: boolean;
  enableAnalytics: boolean;
  
  // App info
  appUrl: string;
  appName: string;
}

/**
 * Get environment configuration
 */
export function getEnvConfig(): EnvConfig {
  return {
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
    factoryAddress: (process.env.NEXT_PUBLIC_FACTORY_ADDRESS || '0xe42e88c072204060A9618140B6089a0a6c33b96e') as `0x${string}`,
    basescanApiKey: process.env.NEXT_PUBLIC_BASESCAN_API_KEY || '',
    baseRpcUrl: process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org',
    baseSepoliaRpcUrl: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org',
    isTestnet: process.env.NEXT_PUBLIC_IS_TESTNET === 'true',
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://basetokenforge.vercel.app',
    appName: 'Base Token Forge',
  };
}

/**
 * Check if required environment variables are set
 */
export function validateEnv(): { isValid: boolean; missing: string[] } {
  const required = [
    'NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID',
    'NEXT_PUBLIC_FACTORY_ADDRESS',
  ];

  const missing = required.filter(key => !process.env[key]);

  return {
    isValid: missing.length === 0,
    missing,
  };
}

/**
 * Get Base RPC URL based on network
 */
export function getRpcUrl(isTestnet: boolean = false): string {
  const config = getEnvConfig();
  return isTestnet ? config.baseSepoliaRpcUrl : config.baseRpcUrl;
}

/**
 * Check if we're in development mode
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Check if we're in production mode
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if running on server side
 */
export function isServer(): boolean {
  return typeof window === 'undefined';
}

/**
 * Check if running on client side
 */
export function isClient(): boolean {
  return typeof window !== 'undefined';
}
