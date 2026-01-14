/**
 * Environment configuration and validation
 */

interface EnvConfig {
  // App
  appName: string;
  appUrl: string;
  environment: 'development' | 'production' | 'test';
  
  // Blockchain
  chainId: number;
  rpcUrl: string;
  factoryAddress: string;
  
  // External services
  walletConnectProjectId: string;
  basescanUrl: string;
  
  // Feature toggles
  isProduction: boolean;
  isDevelopment: boolean;
}

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[`NEXT_PUBLIC_${key}`] || defaultValue;
  if (!value && !defaultValue) {
    console.warn(`Missing environment variable: ${key}`);
    return '';
  }
  return value || '';
}

const nodeEnv = process.env.NODE_ENV || 'development';

export const env: EnvConfig = {
  // App configuration
  appName: getEnvVar('APP_NAME', 'Base Token Forge'),
  appUrl: getEnvVar('APP_URL', 'https://basetokenforge.com'),
  environment: nodeEnv as EnvConfig['environment'],
  
  // Blockchain configuration
  chainId: parseInt(getEnvVar('CHAIN_ID', '8453'), 10),
  rpcUrl: getEnvVar('RPC_URL', 'https://mainnet.base.org'),
  factoryAddress: getEnvVar('FACTORY_ADDRESS', ''),
  
  // External services
  walletConnectProjectId: getEnvVar('WALLET_CONNECT_PROJECT_ID', ''),
  basescanUrl: getEnvVar('BASESCAN_URL', 'https://basescan.org'),
  
  // Computed values
  isProduction: nodeEnv === 'production',
  isDevelopment: nodeEnv === 'development',
};

/**
 * Validate that all required environment variables are set
 */
export function validateEnv(): { valid: boolean; missing: string[] } {
  const requiredVars = [
    'FACTORY_ADDRESS',
    'WALLET_CONNECT_PROJECT_ID',
  ];
  
  const missing = requiredVars.filter(
    (key) => !process.env[`NEXT_PUBLIC_${key}`]
  );
  
  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Get the block explorer URL for a given transaction or address
 */
export function getExplorerUrl(type: 'tx' | 'address' | 'token', hash: string): string {
  const base = env.basescanUrl;
  switch (type) {
    case 'tx':
      return `${base}/tx/${hash}`;
    case 'address':
      return `${base}/address/${hash}`;
    case 'token':
      return `${base}/token/${hash}`;
    default:
      return base;
  }
}
