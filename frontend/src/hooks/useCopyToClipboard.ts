'use client';

/**
 * Copy to Clipboard Hook
 * 
 * Provides clipboard copy functionality with visual feedback.
 * Works across all modern browsers with fallback support.
 */

import { useState, useCallback } from 'react';

export interface UseCopyToClipboardReturn {
  /** Copy text to clipboard */
  copy: (text: string) => Promise<boolean>;
  /** Whether text was recently copied */
  copied: boolean;
  /** Error message if copy failed */
  error: string | null;
  /** Reset copied state */
  reset: () => void;
}

/**
 * Hook for copying text to clipboard
 * 
 * @param resetDelay - Time in ms before copied state resets (default: 2000)
 */
export function useCopyToClipboard(resetDelay: number = 2000): UseCopyToClipboardReturn {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const copy = useCallback(async (text: string): Promise<boolean> => {
    if (!text) {
      setError('No text to copy');
      return false;
    }

    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setError(null);

        // Reset after delay
        setTimeout(() => setCopied(false), resetDelay);
        return true;
      }

      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        const successful = document.execCommand('copy');
        if (successful) {
          setCopied(true);
          setError(null);
          setTimeout(() => setCopied(false), resetDelay);
          return true;
        } else {
          throw new Error('execCommand failed');
        }
      } finally {
        document.body.removeChild(textArea);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to copy';
      setError(message);
      setCopied(false);
      return false;
    }
  }, [resetDelay]);

  const reset = useCallback(() => {
    setCopied(false);
    setError(null);
  }, []);

  return { copy, copied, error, reset };
}

/**
 * Copy Button Component
 * 
 * A button that copies text and shows feedback
 */
import React from 'react';
import { Copy, Check, AlertCircle } from 'lucide-react';

interface CopyButtonProps {
  /** Text to copy */
  text: string;
  /** Button label (optional) */
  label?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
  /** Callback after successful copy */
  onCopy?: () => void;
}

export function CopyButton({
  text,
  label,
  size = 'md',
  className = '',
  onCopy,
}: CopyButtonProps) {
  const { copy, copied, error } = useCopyToClipboard();

  const handleClick = async () => {
    const success = await copy(text);
    if (success && onCopy) {
      onCopy();
    }
  };

  // Size classes
  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 text-sm',
    lg: 'p-2.5 text-base',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 rounded-lg transition-all ${sizeClasses[size]} ${
        copied
          ? 'bg-green-600 text-white'
          : error
          ? 'bg-red-600 text-white'
          : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
      } ${className}`}
      title={copied ? 'Copied!' : error ? error : 'Copy to clipboard'}
    >
      {copied ? (
        <Check className={iconSizes[size]} />
      ) : error ? (
        <AlertCircle className={iconSizes[size]} />
      ) : (
        <Copy className={iconSizes[size]} />
      )}
      {label && <span>{copied ? 'Copied!' : label}</span>}
    </button>
  );
}

/**
 * Copyable Text Component
 * 
 * Text that can be clicked to copy
 */
interface CopyableTextProps {
  /** Text to display and copy */
  text: string;
  /** Display text (if different from copy text) */
  displayText?: string;
  /** Truncate long text */
  truncate?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function CopyableText({
  text,
  displayText,
  truncate = false,
  className = '',
}: CopyableTextProps) {
  const { copy, copied } = useCopyToClipboard();

  const handleClick = () => {
    copy(text);
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-1 font-mono text-gray-300 hover:text-white transition-colors ${
        truncate ? 'truncate max-w-full' : ''
      } ${className}`}
      title={copied ? 'Copied!' : 'Click to copy'}
    >
      <span className={truncate ? 'truncate' : ''}>{displayText ?? text}</span>
      {copied ? (
        <Check className="h-3 w-3 text-green-400 flex-shrink-0" />
      ) : (
        <Copy className="h-3 w-3 text-gray-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </button>
  );
}

export default useCopyToClipboard;
