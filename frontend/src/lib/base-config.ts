/**
 * Base L2 Network Configuration
 * 
 * Comprehensive configuration for Base chain operations.
 * Separate from general constants for modularity.
 */

import { CHAIN_IDS } from './constants';

/**
 * L2 to L1 message status
 */
export type L2MessageStatus = 
  | 'pending'
  | 'ready-to-prove'
  | 'in-challenge-period'
  | 'ready-to-finalize'
  | 'finalized';

/**
 * Base sequencer configuration
 */
export const SEQUENCER_CONFIG = {
  // Sequencer URL for transaction submission
  sequencerUrl: 'https://mainnet-sequencer.base.org',
  
  // Batch submission interval (approximately)
  batchInterval: 60, // seconds
  
  // L1 data availability
  dataAvailability: 'ethereum' as const,
} as const;

/**
 * Base fee configuration
 */
export const FEE_CONFIG = {
  // L1 data fee multiplier
  l1DataFeeScalar: 0.684,
  
  // L2 execution fee is typically much lower than L1
  l2ExecutionFeeMultiplier: 1,
  
  // Overhead for L1 data (in gas)
  l1DataOverhead: 2100,
} as const;

/**
 * Withdrawal configuration (for bridging back to L1)
 */
export const WITHDRAWAL_CONFIG = {
  // Challenge period for fraud proofs
  challengePeriod: 7 * 24 * 60 * 60, // 7 days in seconds
  
  // Minimum withdrawal amount
  minWithdrawal: 0, // No minimum
  
  // Steps in withdrawal process
  steps: [
    'initiate',
    'prove',
    'wait-challenge',
    'finalize',
  ] as const,
} as const;

/**
 * Popular Base DEX routers
 */
export const DEX_ROUTERS = {
  [CHAIN_IDS.BASE_MAINNET]: {
    uniswapV2: '0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24',
    uniswapV3: '0x2626664c2603336E57B271c5C0b26F421741e481',
    aerodrome: '0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43',
    baseswap: '0x327Df1E6de05895d2ab08513aaDD9313Fe505d86',
  },
  [CHAIN_IDS.BASE_SEPOLIA]: {
    uniswapV2: '0x', // Testnet addresses
    uniswapV3: '0x',
  },
} as const;

/**
 * Popular tokens on Base
 */
export const POPULAR_TOKENS = {
  [CHAIN_IDS.BASE_MAINNET]: {
    ETH: { address: '0x0000000000000000000000000000000000000000', symbol: 'ETH', decimals: 18 },
    WETH: { address: '0x4200000000000000000000000000000000000006', symbol: 'WETH', decimals: 18 },
    USDC: { address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', symbol: 'USDC', decimals: 6 },
    USDbC: { address: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA', symbol: 'USDbC', decimals: 6 },
    DAI: { address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb', symbol: 'DAI', decimals: 18 },
    cbETH: { address: '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22', symbol: 'cbETH', decimals: 18 },
    rETH: { address: '0xB6fe221Fe9EeF5aBa221c348bA20A1Bf5e73624c', symbol: 'rETH', decimals: 18 },
  },
} as const;

/**
 * Base NFT marketplaces
 */
export const NFT_MARKETPLACES = {
  opensea: 'https://opensea.io/assets/base',
  zora: 'https://zora.co/base',
  mint: 'https://mint.fun',
} as const;

/**
 * Faucet links for testnet
 */
export const FAUCETS = {
  [CHAIN_IDS.BASE_SEPOLIA]: [
    {
      name: 'Coinbase Faucet',
      url: 'https://www.coinbase.com/faucets/base-ethereum-goerli-faucet',
    },
    {
      name: 'Alchemy Faucet',
      url: 'https://basefaucet.com/',
    },
  ],
} as const;

/**
 * Estimate L1 data fee for a transaction
 */
export function estimateL1DataFee(
  txDataBytes: number,
  l1GasPrice: bigint
): bigint {
  const { l1DataFeeScalar, l1DataOverhead } = FEE_CONFIG;
  const dataGas = BigInt(txDataBytes * 16 + l1DataOverhead);
  const scaledFee = (l1GasPrice * dataGas * BigInt(Math.floor(l1DataFeeScalar * 1000))) / 1000n;
  return scaledFee;
}

/**
 * Get explorer URL for different types
 */
export function getBaseExplorerUrl(
  chainId: number,
  type: 'address' | 'tx' | 'token' | 'block',
  value: string
): string {
  const baseUrl = chainId === CHAIN_IDS.BASE_SEPOLIA
    ? 'https://sepolia.basescan.org'
    : 'https://basescan.org';

  const paths: Record<string, string> = {
    address: 'address',
    tx: 'tx',
    token: 'token',
    block: 'block',
  };

  return `${baseUrl}/${paths[type]}/${value}`;
}

/**
 * Format challenge period remaining time
 */
export function formatChallengePeriod(secondsRemaining: number): string {
  if (secondsRemaining <= 0) return 'Ready';
  
  const days = Math.floor(secondsRemaining / (24 * 60 * 60));
  const hours = Math.floor((secondsRemaining % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((secondsRemaining % (60 * 60)) / 60);

  if (days > 0) return `${days}d ${hours}h remaining`;
  if (hours > 0) return `${hours}h ${minutes}m remaining`;
  return `${minutes}m remaining`;
}

/**
 * Get Base L2 specific transaction type
 */
export type BaseTransactionType = 
  | 'deposit'
  | 'withdrawal'
  | 'l2-transfer'
  | 'contract-interaction'
  | 'token-creation';

export function getTransactionType(
  to: string | null,
  value: bigint,
  data: string
): BaseTransactionType {
  // Deposit from L1
  if (to === '0x4200000000000000000000000000000000000007') {
    return 'deposit';
  }
  
  // Withdrawal to L1
  if (to === '0x4200000000000000000000000000000000000010') {
    return 'withdrawal';
  }
  
  // Contract creation
  if (!to && data.length > 2) {
    return 'token-creation';
  }
  
  // Contract interaction
  if (data.length > 2) {
    return 'contract-interaction';
  }
  
  // Simple transfer
  return 'l2-transfer';
}
