"use client";

import { useEffect, useCallback, useRef } from 'react';

type KeyHandler = (event: KeyboardEvent) => void;

interface UseKeyboardOptions {
  key: string;
  handler: KeyHandler;
  enabled?: boolean;
  preventDefault?: boolean;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
}

export function useKeyboard({
  key,
  handler,
  enabled = true,
  preventDefault = false,
  ctrl = false,
  shift = false,
  alt = false,
  meta = false,
}: UseKeyboardOptions): void {
  const handlerRef = useRef(handler);
  
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Check if the key matches
      if (event.key.toLowerCase() !== key.toLowerCase()) return;

      // Check modifiers
      if (ctrl && !event.ctrlKey) return;
      if (shift && !event.shiftKey) return;
      if (alt && !event.altKey) return;
      if (meta && !event.metaKey) return;

      // Prevent default if specified
      if (preventDefault) {
        event.preventDefault();
      }

      handlerRef.current(event);
    },
    [key, ctrl, shift, alt, meta, preventDefault]
  );

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enabled, handleKeyDown]);
}

// Common keyboard shortcuts
export function useEscapeKey(handler: () => void, enabled = true): void {
  useKeyboard({ key: 'Escape', handler, enabled });
}

export function useEnterKey(handler: () => void, enabled = true): void {
  useKeyboard({ key: 'Enter', handler, enabled });
}
