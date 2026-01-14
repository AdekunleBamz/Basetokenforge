/**
 * Clipboard utility functions
 */

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    return fallbackCopyToClipboard(text);
  }
  
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return fallbackCopyToClipboard(text);
  }
}

/**
 * Fallback copy method for older browsers
 */
function fallbackCopyToClipboard(text: string): boolean {
  if (typeof document === 'undefined') return false;
  
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
  
  try {
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (error) {
    console.error('Fallback copy failed:', error);
    document.body.removeChild(textArea);
    return false;
  }
}

/**
 * Read text from clipboard
 */
export async function readFromClipboard(): Promise<string | null> {
  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    return null;
  }
  
  try {
    return await navigator.clipboard.readText();
  } catch (error) {
    console.error('Failed to read from clipboard:', error);
    return null;
  }
}

/**
 * Check if clipboard API is available
 */
export function isClipboardSupported(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.clipboard;
}
