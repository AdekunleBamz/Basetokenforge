/**
 * Basescan API Utilities
 * 
 * Helper functions for interacting with the Basescan API.
 * Used for fetching token info, transactions, and verification status.
 */

// Basescan API endpoints
const BASESCAN_API = {
  mainnet: 'https://api.basescan.org/api',
  sepolia: 'https://api-sepolia.basescan.org/api',
} as const;

// API response types
export interface BasescanResponse<T> {
  status: '0' | '1';
  message: string;
  result: T;
}

export interface TokenInfo {
  contractAddress: string;
  tokenName: string;
  symbol: string;
  divisor: string;
  tokenType: string;
  totalSupply: string;
  blueCheckmark: string;
  description: string;
  website: string;
  email: string;
  blog: string;
  reddit: string;
  slack: string;
  facebook: string;
  twitter: string;
  bitcointalk: string;
  github: string;
  telegram: string;
  wechat: string;
  linkedin: string;
  discord: string;
  whitepaper: string;
  tokenPriceUSD: string;
}

export interface TransactionInfo {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  gasUsed: string;
}

export interface ContractSourceCode {
  SourceCode: string;
  ABI: string;
  ContractName: string;
  CompilerVersion: string;
  OptimizationUsed: string;
  Runs: string;
  ConstructorArguments: string;
  EVMVersion: string;
  Library: string;
  LicenseType: string;
  Proxy: string;
  Implementation: string;
  SwarmSource: string;
}

/**
 * Get the API URL for a chain
 */
export function getApiUrl(chainId: number): string {
  return chainId === 84532 ? BASESCAN_API.sepolia : BASESCAN_API.mainnet;
}

/**
 * Check if contract is verified on Basescan
 */
export async function isContractVerified(
  address: string,
  chainId: number,
  apiKey?: string
): Promise<boolean> {
  try {
    const baseUrl = getApiUrl(chainId);
    const params = new URLSearchParams({
      module: 'contract',
      action: 'getsourcecode',
      address,
      ...(apiKey && { apikey: apiKey }),
    });

    const response = await fetch(`${baseUrl}?${params}`);
    const data: BasescanResponse<ContractSourceCode[]> = await response.json();

    if (data.status === '1' && data.result.length > 0) {
      // Contract is verified if SourceCode is not empty
      return data.result[0].SourceCode !== '';
    }

    return false;
  } catch {
    console.error('Failed to check contract verification');
    return false;
  }
}

/**
 * Get contract source code from Basescan
 */
export async function getContractSourceCode(
  address: string,
  chainId: number,
  apiKey?: string
): Promise<ContractSourceCode | null> {
  try {
    const baseUrl = getApiUrl(chainId);
    const params = new URLSearchParams({
      module: 'contract',
      action: 'getsourcecode',
      address,
      ...(apiKey && { apikey: apiKey }),
    });

    const response = await fetch(`${baseUrl}?${params}`);
    const data: BasescanResponse<ContractSourceCode[]> = await response.json();

    if (data.status === '1' && data.result.length > 0) {
      return data.result[0];
    }

    return null;
  } catch {
    console.error('Failed to get contract source code');
    return null;
  }
}

/**
 * Get token info from Basescan
 */
export async function getTokenInfo(
  address: string,
  chainId: number,
  apiKey?: string
): Promise<TokenInfo | null> {
  try {
    const baseUrl = getApiUrl(chainId);
    const params = new URLSearchParams({
      module: 'token',
      action: 'tokeninfo',
      contractaddress: address,
      ...(apiKey && { apikey: apiKey }),
    });

    const response = await fetch(`${baseUrl}?${params}`);
    const data: BasescanResponse<TokenInfo[]> = await response.json();

    if (data.status === '1' && data.result.length > 0) {
      return data.result[0];
    }

    return null;
  } catch {
    console.error('Failed to get token info');
    return null;
  }
}

/**
 * Get token transfer events
 */
export async function getTokenTransfers(
  address: string,
  tokenAddress: string,
  chainId: number,
  options: {
    page?: number;
    offset?: number;
    sort?: 'asc' | 'desc';
    apiKey?: string;
  } = {}
): Promise<TransactionInfo[]> {
  try {
    const { page = 1, offset = 100, sort = 'desc', apiKey } = options;
    const baseUrl = getApiUrl(chainId);
    
    const params = new URLSearchParams({
      module: 'account',
      action: 'tokentx',
      address,
      contractaddress: tokenAddress,
      page: page.toString(),
      offset: offset.toString(),
      sort,
      ...(apiKey && { apikey: apiKey }),
    });

    const response = await fetch(`${baseUrl}?${params}`);
    const data: BasescanResponse<TransactionInfo[]> = await response.json();

    if (data.status === '1') {
      return data.result;
    }

    return [];
  } catch {
    console.error('Failed to get token transfers');
    return [];
  }
}

/**
 * Get contract creation transaction
 */
export async function getContractCreation(
  addresses: string[],
  chainId: number,
  apiKey?: string
): Promise<{ contractAddress: string; contractCreator: string; txHash: string }[]> {
  try {
    const baseUrl = getApiUrl(chainId);
    const params = new URLSearchParams({
      module: 'contract',
      action: 'getcontractcreation',
      contractaddresses: addresses.join(','),
      ...(apiKey && { apikey: apiKey }),
    });

    const response = await fetch(`${baseUrl}?${params}`);
    const data = await response.json();

    if (data.status === '1') {
      return data.result;
    }

    return [];
  } catch {
    console.error('Failed to get contract creation');
    return [];
  }
}

/**
 * Get current ETH price
 */
export async function getEthPrice(
  chainId: number,
  apiKey?: string
): Promise<{ ethbtc: string; ethusd: string } | null> {
  try {
    const baseUrl = getApiUrl(chainId);
    const params = new URLSearchParams({
      module: 'stats',
      action: 'ethprice',
      ...(apiKey && { apikey: apiKey }),
    });

    const response = await fetch(`${baseUrl}?${params}`);
    const data = await response.json();

    if (data.status === '1') {
      return data.result;
    }

    return null;
  } catch {
    console.error('Failed to get ETH price');
    return null;
  }
}

/**
 * Rate limiter for Basescan API (5 calls/sec without API key)
 */
export class BasescanRateLimiter {
  private queue: (() => Promise<void>)[] = [];
  private processing = false;
  private lastCall = 0;
  private minInterval: number;

  constructor(callsPerSecond: number = 5) {
    this.minInterval = 1000 / callsPerSecond;
  }

  async throttle<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  private async processQueue() {
    this.processing = true;

    while (this.queue.length > 0) {
      const now = Date.now();
      const timeSinceLastCall = now - this.lastCall;

      if (timeSinceLastCall < this.minInterval) {
        await new Promise((resolve) =>
          setTimeout(resolve, this.minInterval - timeSinceLastCall)
        );
      }

      const fn = this.queue.shift();
      if (fn) {
        this.lastCall = Date.now();
        await fn();
      }
    }

    this.processing = false;
  }
}

export const basescanRateLimiter = new BasescanRateLimiter();
