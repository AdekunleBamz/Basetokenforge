"use client";

import { useEffect, useCallback } from "react";

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  action: () => void;
  description: string;
}

interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
}

export function useKeyboardShortcuts(
  shortcuts: KeyboardShortcut[],
  options: UseKeyboardShortcutsOptions = {}
) {
  const { enabled = true } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable
      ) {
        return;
      }

      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey;
        const metaMatch = shortcut.meta ? event.metaKey : true;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;

        if (keyMatch && ctrlMatch && metaMatch && shiftMatch) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, handleKeyDown]);
}

// Pre-defined app shortcuts
export function useAppShortcuts() {
  const scrollToCreate = () => {
    document.getElementById("create")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTokens = () => {
    document.getElementById("tokens")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToFAQ = () => {
    document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" });
  };

  const shortcuts: KeyboardShortcut[] = [
    { key: "c", description: "Go to Create Token", action: scrollToCreate },
    { key: "t", description: "Go to My Tokens", action: scrollToTokens },
    { key: "h", description: "Go to Home/Top", action: scrollToTop },
    { key: "f", description: "Go to FAQ", action: scrollToFAQ },
    {
      key: "?",
      shift: true,
      description: "Show shortcuts help",
      action: () => {
        window.dispatchEvent(new CustomEvent("show-shortcuts-help"));
      },
    },
  ];

  useKeyboardShortcuts(shortcuts);

  return shortcuts;
}
