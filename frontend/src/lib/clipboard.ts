/**
 * Clipboard utilities
 * 
 * Safe clipboard operations with fallbacks.
 */

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Try modern clipboard API first
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Clipboard API failed:', error);
    }
  }

  // Fallback to execCommand
  return fallbackCopyToClipboard(text);
}

/**
 * Fallback clipboard copy using execCommand
 */
function fallbackCopyToClipboard(text: string): boolean {
  const textArea = document.createElement('textarea');
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  let success = false;
  try {
    success = document.execCommand('copy');
  } catch (error) {
    console.error('Fallback copy failed:', error);
  }

  document.body.removeChild(textArea);
  return success;
}

/**
 * Copy address with formatting
 */
export async function copyAddress(address: string): Promise<boolean> {
  // Ensure proper formatting
  const formatted = address.startsWith('0x') ? address : `0x${address}`;
  return copyToClipboard(formatted);
}

/**
 * Copy transaction hash
 */
export async function copyTransactionHash(hash: string): Promise<boolean> {
  const formatted = hash.startsWith('0x') ? hash : `0x${hash}`;
  return copyToClipboard(formatted);
}

/**
 * Copy share URL with token info
 */
export async function copyTokenShareUrl(
  tokenAddress: string,
  tokenName: string
): Promise<boolean> {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const shareUrl = `${baseUrl}?token=${tokenAddress}`;
  const text = `Check out ${tokenName} on Base Token Forge: ${shareUrl}`;
  return copyToClipboard(text);
}

/**
 * Read from clipboard
 */
export async function readFromClipboard(): Promise<string | null> {
  if (!navigator.clipboard || !window.isSecureContext) {
    console.warn('Clipboard API not available');
    return null;
  }

  try {
    return await navigator.clipboard.readText();
  } catch (error) {
    console.error('Failed to read clipboard:', error);
    return null;
  }
}

/**
 * Check if clipboard is supported
 */
export function isClipboardSupported(): boolean {
  return !!(navigator.clipboard || document.execCommand);
}

/**
 * Create a copy handler with callback
 */
export function createCopyHandler(
  getText: () => string,
  onSuccess?: () => void,
  onError?: (error: Error) => void
): () => Promise<void> {
  return async () => {
    try {
      const text = getText();
      const success = await copyToClipboard(text);
      
      if (success) {
        onSuccess?.();
      } else {
        onError?.(new Error('Copy failed'));
      }
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error('Copy failed'));
    }
  };
}
