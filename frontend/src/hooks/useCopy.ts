"use client";

import { useState, useCallback } from 'react';
import { copyToClipboard } from '@/lib/utils/clipboard';

interface UseCopyOptions {
  resetDelay?: number;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useCopy(options: UseCopyOptions = {}) {
  const { resetDelay = 2000, onSuccess, onError } = options;
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const copy = useCallback(async (text: string) => {
    try {
      const success = await copyToClipboard(text);
      if (success) {
        setCopied(true);
        setError(null);
        onSuccess?.();
        
        setTimeout(() => setCopied(false), resetDelay);
        return true;
      } else {
        throw new Error('Failed to copy to clipboard');
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
      return false;
    }
  }, [resetDelay, onSuccess, onError]);

  const reset = useCallback(() => {
    setCopied(false);
    setError(null);
  }, []);

  return {
    copy,
    copied,
    error,
    reset,
  };
}
