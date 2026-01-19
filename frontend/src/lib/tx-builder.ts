/**
 * Transaction Builder Utilities
 * 
 * Helpers for building and preparing transactions on Base.
 */

import { encodeFunctionData, parseEther, parseUnits, type Address } from 'viem';
import { TOKEN_FACTORY_ABI, ERC20_ABI } from '@/config/abi';
import { TOKEN_FACTORY_ADDRESS, CREATION_FEE } from '@/config/wagmi';

export interface TokenCreationTx {
  to: Address;
  data: `0x${string}`;
  value: bigint;
}

export interface TokenTransferTx {
  to: Address;
  data: `0x${string}`;
}

export interface TokenApproveTx {
  to: Address;
  data: `0x${string}`;
}

/**
 * Build a token creation transaction
 */
export function buildTokenCreationTx(params: {
  name: string;
  symbol: string;
  decimals: number;
  supply: string;
  fee?: string;
}): TokenCreationTx {
  const supplyWithDecimals = parseUnits(params.supply, params.decimals);
  const fee = params.fee || CREATION_FEE;

  const data = encodeFunctionData({
    abi: TOKEN_FACTORY_ABI,
    functionName: 'createToken',
    args: [params.name, params.symbol, params.decimals, supplyWithDecimals],
  });

  return {
    to: TOKEN_FACTORY_ADDRESS,
    data,
    value: parseEther(fee),
  };
}

/**
 * Build a token transfer transaction
 */
export function buildTokenTransferTx(params: {
  tokenAddress: Address;
  to: Address;
  amount: string;
  decimals: number;
}): TokenTransferTx {
  const amountWithDecimals = parseUnits(params.amount, params.decimals);

  const data = encodeFunctionData({
    abi: ERC20_ABI,
    functionName: 'transfer',
    args: [params.to, amountWithDecimals],
  });

  return {
    to: params.tokenAddress,
    data,
  };
}

/**
 * Build a token approval transaction
 */
export function buildTokenApproveTx(params: {
  tokenAddress: Address;
  spender: Address;
  amount: string;
  decimals: number;
}): TokenApproveTx {
  const amountWithDecimals = parseUnits(params.amount, params.decimals);

  const data = encodeFunctionData({
    abi: ERC20_ABI,
    functionName: 'approve',
    args: [params.spender, amountWithDecimals],
  });

  return {
    to: params.tokenAddress,
    data,
  };
}

/**
 * Build an unlimited approval transaction
 */
export function buildUnlimitedApproveTx(params: {
  tokenAddress: Address;
  spender: Address;
}): TokenApproveTx {
  const maxUint256 = 2n ** 256n - 1n;

  const data = encodeFunctionData({
    abi: ERC20_ABI,
    functionName: 'approve',
    args: [params.spender, maxUint256],
  });

  return {
    to: params.tokenAddress,
    data,
  };
}

/**
 * Build a burn tokens transaction
 */
export function buildBurnTx(params: {
  tokenAddress: Address;
  amount: string;
  decimals: number;
}): TokenTransferTx {
  const amountWithDecimals = parseUnits(params.amount, params.decimals);

  const data = encodeFunctionData({
    abi: ERC20_ABI,
    functionName: 'burn',
    args: [amountWithDecimals],
  });

  return {
    to: params.tokenAddress,
    data,
  };
}

/**
 * Estimate transaction data size in bytes
 */
export function estimateTxDataSize(data: `0x${string}`): number {
  // Remove 0x prefix and count hex characters, divide by 2 for bytes
  return (data.length - 2) / 2;
}
