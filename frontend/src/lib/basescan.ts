/**
 * Basescan API Integration
 * 
 * Utilities for interacting with Basescan API to fetch token data.
 */

const BASESCAN_API_URL = 'https://api.basescan.org/api';
const BASESCAN_API_KEY = process.env.NEXT_PUBLIC_BASESCAN_API_KEY || '';

interface BasescanResponse<T> {
  status: '0' | '1';
  message: string;
  result: T;
}

interface TokenInfo {
  contractAddress: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  totalSupply: string;
}

interface TokenTransfer {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  contractAddress: string;
}

/**
 * Get token info from Basescan
 */
export async function getTokenInfo(contractAddress: string): Promise<TokenInfo | null> {
  try {
    const url = new URL(BASESCAN_API_URL);
    url.searchParams.set('module', 'token');
    url.searchParams.set('action', 'tokeninfo');
    url.searchParams.set('contractaddress', contractAddress);
    if (BASESCAN_API_KEY) {
      url.searchParams.set('apikey', BASESCAN_API_KEY);
    }

    const response = await fetch(url.toString());
    const data: BasescanResponse<TokenInfo[]> = await response.json();

    if (data.status === '1' && data.result.length > 0) {
      return data.result[0];
    }
    return null;
  } catch (error) {
    console.error('Error fetching token info:', error);
    return null;
  }
}

/**
 * Get token transfers for an address
 */
export async function getTokenTransfers(
  address: string,
  contractAddress?: string,
  page: number = 1,
  offset: number = 100
): Promise<TokenTransfer[]> {
  try {
    const url = new URL(BASESCAN_API_URL);
    url.searchParams.set('module', 'account');
    url.searchParams.set('action', 'tokentx');
    url.searchParams.set('address', address);
    url.searchParams.set('page', page.toString());
    url.searchParams.set('offset', offset.toString());
    url.searchParams.set('sort', 'desc');
    
    if (contractAddress) {
      url.searchParams.set('contractaddress', contractAddress);
    }
    if (BASESCAN_API_KEY) {
      url.searchParams.set('apikey', BASESCAN_API_KEY);
    }

    const response = await fetch(url.toString());
    const data: BasescanResponse<TokenTransfer[]> = await response.json();

    if (data.status === '1') {
      return data.result;
    }
    return [];
  } catch (error) {
    console.error('Error fetching token transfers:', error);
    return [];
  }
}

/**
 * Get contract creation info
 */
export async function getContractCreation(contractAddresses: string[]): Promise<{
  contractAddress: string;
  contractCreator: string;
  txHash: string;
}[]> {
  try {
    const url = new URL(BASESCAN_API_URL);
    url.searchParams.set('module', 'contract');
    url.searchParams.set('action', 'getcontractcreation');
    url.searchParams.set('contractaddresses', contractAddresses.join(','));
    if (BASESCAN_API_KEY) {
      url.searchParams.set('apikey', BASESCAN_API_KEY);
    }

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status === '1') {
      return data.result;
    }
    return [];
  } catch (error) {
    console.error('Error fetching contract creation:', error);
    return [];
  }
}

/**
 * Check if a contract is verified on Basescan
 */
export async function isContractVerified(contractAddress: string): Promise<boolean> {
  try {
    const url = new URL(BASESCAN_API_URL);
    url.searchParams.set('module', 'contract');
    url.searchParams.set('action', 'getsourcecode');
    url.searchParams.set('address', contractAddress);
    if (BASESCAN_API_KEY) {
      url.searchParams.set('apikey', BASESCAN_API_KEY);
    }

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status === '1' && data.result.length > 0) {
      return data.result[0].SourceCode !== '';
    }
    return false;
  } catch (error) {
    console.error('Error checking contract verification:', error);
    return false;
  }
}

/**
 * Get Base gas price from Basescan
 */
export async function getGasPrice(): Promise<{
  safeGasPrice: string;
  proposeGasPrice: string;
  fastGasPrice: string;
} | null> {
  try {
    const url = new URL(BASESCAN_API_URL);
    url.searchParams.set('module', 'gastracker');
    url.searchParams.set('action', 'gasoracle');
    if (BASESCAN_API_KEY) {
      url.searchParams.set('apikey', BASESCAN_API_KEY);
    }

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status === '1') {
      return {
        safeGasPrice: data.result.SafeGasPrice,
        proposeGasPrice: data.result.ProposeGasPrice,
        fastGasPrice: data.result.FastGasPrice,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching gas price:', error);
    return null;
  }
}
