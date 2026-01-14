/**
 * Number formatting utility functions
 */

/**
 * Format a large number with commas
 */
export function formatNumber(num: number | bigint | string): string {
  const n = typeof num === 'string' ? parseFloat(num) : Number(num);
  return n.toLocaleString('en-US');
}

/**
 * Format a number with compact notation (1K, 1M, etc.)
 */
export function formatCompact(num: number | bigint | string): string {
  const n = typeof num === 'string' ? parseFloat(num) : Number(num);
  
  if (n >= 1_000_000_000_000) {
    return `${(n / 1_000_000_000_000).toFixed(1)}T`;
  }
  if (n >= 1_000_000_000) {
    return `${(n / 1_000_000_000).toFixed(1)}B`;
  }
  if (n >= 1_000_000) {
    return `${(n / 1_000_000).toFixed(1)}M`;
  }
  if (n >= 1_000) {
    return `${(n / 1_000).toFixed(1)}K`;
  }
  return n.toString();
}

/**
 * Format currency value
 */
export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value);
}

/**
 * Format ETH value with proper decimals
 */
export function formatETH(wei: bigint | string, decimals = 4): string {
  const value = typeof wei === 'string' ? BigInt(wei) : wei;
  const eth = Number(value) / 1e18;
  return `${eth.toFixed(decimals)} ETH`;
}

/**
 * Format token amount with decimals
 */
export function formatTokenAmount(
  amount: bigint | string,
  decimals: number,
  displayDecimals = 2
): string {
  const value = typeof amount === 'string' ? BigInt(amount) : amount;
  const divisor = BigInt(10 ** decimals);
  const whole = value / divisor;
  const fraction = value % divisor;
  
  const fractionStr = fraction.toString().padStart(decimals, '0');
  const displayFraction = fractionStr.slice(0, displayDecimals);
  
  return `${formatNumber(whole)}.${displayFraction}`;
}

/**
 * Parse a string to a safe number
 */
export function parseNumber(str: string, defaultValue = 0): number {
  const parsed = parseFloat(str);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Clamp a number between min and max
 */
export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

/**
 * Round to specified decimal places
 */
export function roundTo(num: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}

/**
 * Calculate percentage
 */
export function percentage(part: number, total: number): number {
  if (total === 0) return 0;
  return (part / total) * 100;
}
