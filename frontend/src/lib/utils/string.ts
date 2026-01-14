/**
 * String utility functions
 */

/**
 * Truncate an Ethereum address for display
 */
export function truncateAddress(address: string, startChars = 6, endChars = 4): string {
  if (!address || address.length < startChars + endChars) {
    return address;
  }
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Capitalize first letter of a string
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Convert string to uppercase (for token symbols)
 */
export function toUpperCase(str: string): string {
  return str.toUpperCase();
}

/**
 * Sanitize token symbol input
 */
export function sanitizeSymbol(symbol: string): string {
  return symbol.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11);
}

/**
 * Sanitize token name input
 */
export function sanitizeName(name: string): string {
  return name.replace(/[^\w\s-]/g, '').slice(0, 64);
}

/**
 * Check if string is valid hex
 */
export function isValidHex(str: string): boolean {
  return /^0x[a-fA-F0-9]+$/.test(str);
}

/**
 * Check if string is valid Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Generate a slug from a string
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Pluralize a word based on count
 */
export function pluralize(word: string, count: number): string {
  return count === 1 ? word : `${word}s`;
}
