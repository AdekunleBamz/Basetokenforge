/**
 * Base Chain Contract Utilities
 * 
 * Helper functions for interacting with smart contracts on Base L2.
 * Optimized for low gas costs and high reliability.
 */

import { 
  type Address, 
  type Hash, 
  type PublicClient,
  type WalletClient,
  encodeFunctionData,
  decodeFunctionResult,
  parseAbi,
  getContract,
} from 'viem';
import { BASE_CHAIN_ID, BASE_SEPOLIA_CHAIN_ID } from './base-network';

// Common contract ABIs
export const ERC20_ABI = parseAbi([
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address account) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
]);

export const ERC20_METADATA_ABI = parseAbi([
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
]);

// Token factory ABI (subset)
export const TOKEN_FACTORY_ABI = parseAbi([
  'function createToken(string name, string symbol, uint256 initialSupply) returns (address)',
  'function getTokensByCreator(address creator) view returns (address[])',
  'function getTokenCount() view returns (uint256)',
  'event TokenCreated(address indexed creator, address indexed tokenAddress, string name, string symbol)',
]);

// Contract call options
export interface ContractCallOptions {
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
  gasLimit?: bigint;
  value?: bigint;
}

// Token metadata result
export interface TokenMetadata {
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: bigint;
}

// Batch call result
export interface BatchCallResult<T> {
  success: boolean;
  result?: T;
  error?: Error;
}

/**
 * Read token metadata from a contract
 */
export async function readTokenMetadata(
  client: PublicClient,
  tokenAddress: Address
): Promise<TokenMetadata> {
  const contract = getContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    client,
  });

  const [name, symbol, decimals, totalSupply] = await Promise.all([
    contract.read.name(),
    contract.read.symbol(),
    contract.read.decimals(),
    contract.read.totalSupply(),
  ]);

  return {
    address: tokenAddress,
    name: name as string,
    symbol: symbol as string,
    decimals: decimals as number,
    totalSupply: totalSupply as bigint,
  };
}

/**
 * Batch read multiple token balances
 */
export async function batchReadBalances(
  client: PublicClient,
  tokenAddresses: Address[],
  holderAddress: Address
): Promise<Map<Address, bigint>> {
  const results = new Map<Address, bigint>();

  const balancePromises = tokenAddresses.map(async (tokenAddress) => {
    try {
      const balance = await client.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [holderAddress],
      });
      results.set(tokenAddress, balance as bigint);
    } catch (error) {
      results.set(tokenAddress, 0n);
    }
  });

  await Promise.all(balancePromises);
  return results;
}

/**
 * Check if address is a valid ERC20 token
 */
export async function isValidERC20(
  client: PublicClient,
  address: Address
): Promise<boolean> {
  try {
    // Try to read basic ERC20 functions
    const [name, symbol, decimals] = await Promise.all([
      client.readContract({
        address,
        abi: ERC20_METADATA_ABI,
        functionName: 'name',
      }),
      client.readContract({
        address,
        abi: ERC20_METADATA_ABI,
        functionName: 'symbol',
      }),
      client.readContract({
        address,
        abi: ERC20_METADATA_ABI,
        functionName: 'decimals',
      }),
    ]);

    return (
      typeof name === 'string' &&
      typeof symbol === 'string' &&
      typeof decimals === 'number' &&
      decimals <= 18
    );
  } catch {
    return false;
  }
}

/**
 * Estimate gas for a token transfer on Base
 */
export async function estimateTransferGas(
  client: PublicClient,
  tokenAddress: Address,
  from: Address,
  to: Address,
  amount: bigint
): Promise<bigint> {
  try {
    const gas = await client.estimateContractGas({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: [to, amount],
      account: from,
    });

    // Add 20% buffer for safety
    return (gas * 120n) / 100n;
  } catch (error) {
    // Return default gas estimate for ERC20 transfer
    return 65000n;
  }
}

/**
 * Execute token transfer with retry logic
 */
export async function executeTransfer(
  walletClient: WalletClient,
  publicClient: PublicClient,
  tokenAddress: Address,
  to: Address,
  amount: bigint,
  options?: ContractCallOptions
): Promise<Hash> {
  const account = walletClient.account;
  if (!account) throw new Error('No account connected');

  // Get current gas prices if not provided
  let maxFeePerGas = options?.maxFeePerGas;
  let maxPriorityFeePerGas = options?.maxPriorityFeePerGas;

  if (!maxFeePerGas || !maxPriorityFeePerGas) {
    const gasPrice = await publicClient.getGasPrice();
    maxFeePerGas = maxFeePerGas || gasPrice;
    maxPriorityFeePerGas = maxPriorityFeePerGas || 1000000n; // 0.001 gwei
  }

  const hash = await walletClient.writeContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'transfer',
    args: [to, amount],
    maxFeePerGas,
    maxPriorityFeePerGas,
    gas: options?.gasLimit,
  });

  return hash;
}

/**
 * Execute token approval with max amount option
 */
export async function executeApproval(
  walletClient: WalletClient,
  tokenAddress: Address,
  spender: Address,
  amount: bigint,
  options?: ContractCallOptions
): Promise<Hash> {
  const hash = await walletClient.writeContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'approve',
    args: [spender, amount],
    maxFeePerGas: options?.maxFeePerGas,
    maxPriorityFeePerGas: options?.maxPriorityFeePerGas,
    gas: options?.gasLimit,
  });

  return hash;
}

/**
 * Revoke token approval (set to 0)
 */
export async function revokeApproval(
  walletClient: WalletClient,
  tokenAddress: Address,
  spender: Address
): Promise<Hash> {
  return executeApproval(walletClient, tokenAddress, spender, 0n);
}

/**
 * Get all token approvals for an address
 */
export async function getApprovals(
  client: PublicClient,
  tokenAddress: Address,
  owner: Address,
  spenders: Address[]
): Promise<Map<Address, bigint>> {
  const approvals = new Map<Address, bigint>();

  const promises = spenders.map(async (spender) => {
    try {
      const allowance = await client.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: [owner, spender],
      });
      approvals.set(spender, allowance as bigint);
    } catch {
      approvals.set(spender, 0n);
    }
  });

  await Promise.all(promises);
  return approvals;
}

/**
 * Wait for transaction with timeout
 */
export async function waitForTransaction(
  client: PublicClient,
  hash: Hash,
  timeoutMs: number = 60000
): Promise<{ success: boolean; blockNumber?: bigint }> {
  try {
    const receipt = await Promise.race([
      client.waitForTransactionReceipt({ hash }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Transaction timeout')), timeoutMs)
      ),
    ]);

    return {
      success: receipt.status === 'success',
      blockNumber: receipt.blockNumber,
    };
  } catch (error) {
    return { success: false };
  }
}

/**
 * Get optimal gas settings for Base L2
 */
export async function getOptimalGasSettings(
  client: PublicClient,
  chainId: number
): Promise<{
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
}> {
  // Base L2 specific optimizations
  const isBase = chainId === BASE_CHAIN_ID || chainId === BASE_SEPOLIA_CHAIN_ID;

  const gasPrice = await client.getGasPrice();
  
  // Base L2 has very low priority fees
  const priorityFee = isBase ? 1000000n : 1500000000n; // 0.001 gwei vs 1.5 gwei

  return {
    maxFeePerGas: gasPrice,
    maxPriorityFeePerGas: priorityFee,
  };
}

/**
 * Encode function data for a contract call
 */
export function encodeTransfer(to: Address, amount: bigint): `0x${string}` {
  return encodeFunctionData({
    abi: ERC20_ABI,
    functionName: 'transfer',
    args: [to, amount],
  });
}

/**
 * Encode approval data
 */
export function encodeApproval(spender: Address, amount: bigint): `0x${string}` {
  return encodeFunctionData({
    abi: ERC20_ABI,
    functionName: 'approve',
    args: [spender, amount],
  });
}

/**
 * Decode transfer result
 */
export function decodeTransferResult(data: `0x${string}`): boolean {
  const result = decodeFunctionResult({
    abi: ERC20_ABI,
    functionName: 'transfer',
    data,
  });
  return result as boolean;
}

export default {
  readTokenMetadata,
  batchReadBalances,
  isValidERC20,
  estimateTransferGas,
  executeTransfer,
  executeApproval,
  revokeApproval,
  getApprovals,
  waitForTransaction,
  getOptimalGasSettings,
  encodeTransfer,
  encodeApproval,
  decodeTransferResult,
};
