"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import { debounce } from '@/lib/utils/async';

interface UseDebounceOptions {
  delay?: number;
  leading?: boolean;
}

/**
 * Debounce a value
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Debounce a callback function
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  options: UseDebounceOptions = {}
): T {
  const { delay = 300 } = options;
  const callbackRef = useRef(callback);

  // Update ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Create debounced function
  const debouncedFn = useMemo(() => {
    return debounce((...args: unknown[]) => {
      callbackRef.current(...args);
    }, delay);
  }, [delay]);

  return debouncedFn as T;
}
