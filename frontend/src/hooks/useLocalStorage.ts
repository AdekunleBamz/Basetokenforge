"use client";

import { useState, useEffect, useCallback } from 'react';
import { getLocalStorage, setLocalStorage } from '@/lib/utils/storage';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    return getLocalStorage(key, initialValue);
  });

  // Return a wrapped version of useState's setter function that persists to localStorage
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        setLocalStorage(key, valueToStore);
        return valueToStore;
      });
    },
    [key]
  );

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    setStoredValue(initialValue);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(`btf_${key}`);
    }
  }, [key, initialValue]);

  // Listen for changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `btf_${key}` && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch {
          setStoredValue(e.newValue as unknown as T);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
}
