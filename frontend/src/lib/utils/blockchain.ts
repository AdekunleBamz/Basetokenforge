/**
 * Blockchain-specific utility functions
 */

import { EXPLORER_URL } from '@/lib/constants';

/**
 * Get block explorer URL for an address
 */
export function getAddressUrl(address: string): string {
  return `${EXPLORER_URL}/address/${address}`;
}

/**
 * Get block explorer URL for a transaction
 */
export function getTxUrl(txHash: string): string {
  return `${EXPLORER_URL}/tx/${txHash}`;
}

/**
 * Get block explorer URL for a token
 */
export function getTokenUrl(tokenAddress: string): string {
  return `${EXPLORER_URL}/token/${tokenAddress}`;
}

/**
 * Get block explorer URL for a block
 */
export function getBlockUrl(blockNumber: number | string): string {
  return `${EXPLORER_URL}/block/${blockNumber}`;
}

/**
 * Format wei to ether string
 */
export function weiToEther(wei: bigint): string {
  return (Number(wei) / 1e18).toString();
}

/**
 * Format ether to wei
 */
export function etherToWei(ether: string | number): bigint {
  return BigInt(Math.floor(Number(ether) * 1e18));
}

/**
 * Check if an address is a contract (heuristic)
 */
export function isContractAddress(address: string): boolean {
  // This is a simple heuristic - in practice you'd check the bytecode
  return address.startsWith('0x') && address.length === 42;
}

/**
 * Generate a token icon URL (using a placeholder service)
 */
export function getTokenIconUrl(address: string, size = 64): string {
  // Use a deterministic avatar based on address
  return `https://api.dicebear.com/7.x/identicon/svg?seed=${address}&size=${size}`;
}

/**
 * Calculate gas estimate with buffer
 */
export function addGasBuffer(gasEstimate: bigint, bufferPercent = 20): bigint {
  return gasEstimate + (gasEstimate * BigInt(bufferPercent)) / BigInt(100);
}

/**
 * Parse token units with decimals
 */
export function parseTokenUnits(amount: string, decimals: number): bigint {
  const [whole, fraction = ''] = amount.split('.');
  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
  return BigInt(whole + paddedFraction);
}

/**
 * Format token units to string
 */
export function formatTokenUnits(amount: bigint, decimals: number): string {
  const str = amount.toString().padStart(decimals + 1, '0');
  const whole = str.slice(0, -decimals) || '0';
  const fraction = str.slice(-decimals);
  return `${whole}.${fraction}`.replace(/\.?0+$/, '');
}
