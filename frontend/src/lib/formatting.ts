/**
 * Number Formatting Utilities
 * 
 * Format numbers for display in the Token Forge UI.
 */

/**
 * Format a large number with K, M, B, T suffixes
 */
export function formatCompactNumber(num: number): string {
  if (num >= 1e12) {
    return `${(num / 1e12).toFixed(2)}T`;
  }
  if (num >= 1e9) {
    return `${(num / 1e9).toFixed(2)}B`;
  }
  if (num >= 1e6) {
    return `${(num / 1e6).toFixed(2)}M`;
  }
  if (num >= 1e3) {
    return `${(num / 1e3).toFixed(2)}K`;
  }
  return num.toFixed(2);
}

/**
 * Format number with thousand separators
 */
export function formatWithCommas(num: number | string): string {
  const parts = num.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

/**
 * Format token supply for display
 */
export function formatTokenSupply(supply: bigint, decimals: number): string {
  const divisor = BigInt(10 ** decimals);
  const wholePart = supply / divisor;
  const fractionalPart = supply % divisor;
  
  // Convert to number for formatting (may lose precision for very large numbers)
  const wholeNum = Number(wholePart);
  
  if (wholeNum >= 1e12) {
    return `${(wholeNum / 1e12).toFixed(2)}T`;
  }
  if (wholeNum >= 1e9) {
    return `${(wholeNum / 1e9).toFixed(2)}B`;
  }
  if (wholeNum >= 1e6) {
    return `${(wholeNum / 1e6).toFixed(2)}M`;
  }
  if (wholeNum >= 1e3) {
    return formatWithCommas(wholeNum.toFixed(0));
  }
  
  // For smaller numbers, show some decimals
  if (fractionalPart > 0n && decimals > 0) {
    const fracStr = fractionalPart.toString().padStart(decimals, '0');
    const significantDecimals = fracStr.replace(/0+$/, '').slice(0, 4);
    if (significantDecimals.length > 0) {
      return `${wholeNum}.${significantDecimals}`;
    }
  }
  
  return wholeNum.toString();
}

/**
 * Format ETH value for display
 */
export function formatEthValue(value: string | number, precision: number = 6): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (num === 0) return '0';
  if (num < 0.000001) return '<0.000001';
  if (num < 0.01) return num.toFixed(6);
  if (num < 1) return num.toFixed(4);
  if (num < 100) return num.toFixed(3);
  if (num < 10000) return num.toFixed(2);
  
  return formatWithCommas(num.toFixed(2));
}

/**
 * Format USD value for display
 */
export function formatUsdValue(value: number): string {
  if (value < 0.01) return '<$0.01';
  if (value < 1) return `$${value.toFixed(2)}`;
  if (value < 1000) return `$${value.toFixed(2)}`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  
  return `$${formatWithCommas(value.toFixed(2))}`;
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Parse user input to token amount with decimals
 */
export function parseTokenAmount(input: string, decimals: number): bigint {
  // Remove any non-numeric characters except decimal point
  const cleaned = input.replace(/[^\d.]/g, '');
  const parts = cleaned.split('.');
  
  let wholePart = parts[0] || '0';
  let fractionalPart = parts[1] || '';
  
  // Pad or truncate fractional part to match decimals
  if (fractionalPart.length > decimals) {
    fractionalPart = fractionalPart.slice(0, decimals);
  } else {
    fractionalPart = fractionalPart.padEnd(decimals, '0');
  }
  
  const combined = wholePart + fractionalPart;
  return BigInt(combined);
}

/**
 * Truncate address for display
 */
export function truncateAddress(address: string, start: number = 6, end: number = 4): string {
  if (address.length <= start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}
