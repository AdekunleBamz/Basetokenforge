/**
 * Base Chain Configuration
 * 
 * Base is an Ethereum L2 built by Coinbase, offering low fees and fast transactions.
 * This file contains all Base-specific constants and utilities.
 */

// Base Mainnet Configuration
export const BASE_MAINNET = {
  id: 8453,
  name: 'Base',
  network: 'base',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: 'https://mainnet.base.org',
    public: 'https://mainnet.base.org',
    alchemy: 'https://base-mainnet.g.alchemy.com/v2',
    infura: 'https://base-mainnet.infura.io/v3',
  },
  blockExplorers: {
    default: {
      name: 'Basescan',
      url: 'https://basescan.org',
    },
    blockscout: {
      name: 'Blockscout',
      url: 'https://base.blockscout.com',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11' as const,
      blockCreated: 5022,
    },
  },
} as const;

// Base Sepolia Testnet Configuration
export const BASE_SEPOLIA = {
  id: 84532,
  name: 'Base Sepolia',
  network: 'base-sepolia',
  nativeCurrency: {
    name: 'Sepolia Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: 'https://sepolia.base.org',
    public: 'https://sepolia.base.org',
  },
  blockExplorers: {
    default: {
      name: 'Basescan Sepolia',
      url: 'https://sepolia.basescan.org',
    },
  },
  testnet: true,
} as const;

// Base Network Stats (approximate)
export const BASE_NETWORK_STATS = {
  avgBlockTime: 2, // seconds
  avgGasPrice: 0.001, // gwei (very low due to L2)
  tps: 2000, // transactions per second capacity
  finality: 'instant', // L2 soft finality
  l1Finality: '~15 minutes', // Ethereum L1 finality
} as const;

// Base Token Standards
export const BASE_TOKEN_STANDARDS = {
  ERC20: 'ERC-20',
  ERC721: 'ERC-721',
  ERC1155: 'ERC-1155',
} as const;

/**
 * Get block explorer URL for a transaction
 */
export function getTransactionUrl(txHash: string, testnet = false): string {
  const baseUrl = testnet ? BASE_SEPOLIA.blockExplorers.default.url : BASE_MAINNET.blockExplorers.default.url;
  return `${baseUrl}/tx/${txHash}`;
}

/**
 * Get block explorer URL for an address
 */
export function getAddressUrl(address: string, testnet = false): string {
  const baseUrl = testnet ? BASE_SEPOLIA.blockExplorers.default.url : BASE_MAINNET.blockExplorers.default.url;
  return `${baseUrl}/address/${address}`;
}

/**
 * Get block explorer URL for a token
 */
export function getTokenUrl(tokenAddress: string, testnet = false): string {
  const baseUrl = testnet ? BASE_SEPOLIA.blockExplorers.default.url : BASE_MAINNET.blockExplorers.default.url;
  return `${baseUrl}/token/${tokenAddress}`;
}

/**
 * Check if a chain ID is a Base network
 */
export function isBaseNetwork(chainId: number): boolean {
  return chainId === BASE_MAINNET.id || chainId === BASE_SEPOLIA.id;
}

/**
 * Get network name from chain ID
 */
export function getNetworkName(chainId: number): string {
  switch (chainId) {
    case BASE_MAINNET.id:
      return BASE_MAINNET.name;
    case BASE_SEPOLIA.id:
      return BASE_SEPOLIA.name;
    default:
      return 'Unknown Network';
  }
}
