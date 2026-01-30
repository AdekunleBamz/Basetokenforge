"use client";

import { useState, useEffect } from "react";

interface ShortcutItem {
  key: string;
  shift?: boolean;
  description: string;
}

export function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleShowShortcuts = () => setIsOpen(true);
    window.addEventListener("show-shortcuts-help", handleShowShortcuts);
    return () => window.removeEventListener("show-shortcuts-help", handleShowShortcuts);
  }, []);

  const shortcuts: ShortcutItem[] = [
    { key: "C", description: "Go to Create Token section" },
    { key: "T", description: "Go to My Tokens section" },
    { key: "H", description: "Go to Home/Top of page" },
    { key: "F", description: "Go to FAQ section" },
    { key: "?", shift: true, description: "Show this help dialog" },
  ];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={() => setIsOpen(false)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-md bg-base-gray border border-white/10 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forge-orange/20 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-forge-orange"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
                />
              </svg>
            </div>
            <h2 className="text-xl font-display font-bold text-white">
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <svg
              className="w-5 h-5 text-white/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="space-y-3">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.key}
              className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <span className="text-white/80 text-sm">{shortcut.description}</span>
              <div className="flex items-center gap-1">
                {shortcut.shift && (
                  <>
                    <kbd className="px-2 py-1 rounded bg-base-dark border border-white/20 text-xs font-mono text-white/70">
                      Shift
                    </kbd>
                    <span className="text-white/40 text-xs">+</span>
                  </>
                )}
                <kbd className="px-2.5 py-1 rounded bg-base-dark border border-white/20 text-xs font-mono text-forge-orange font-semibold min-w-[28px] text-center">
                  {shortcut.key}
                </kbd>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-white/40 text-xs text-center">
            Press <kbd className="px-1.5 py-0.5 rounded bg-base-dark border border-white/20 text-[10px] font-mono">Esc</kbd> or click outside to close
          </p>
        </div>
      </div>
    </div>
  );
}
