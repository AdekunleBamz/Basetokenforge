"use client";

import { useEffect, useRef, ReactNode, KeyboardEvent } from "react";

// Skip to main content link for keyboard users
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[1000] focus:px-4 focus:py-2 focus:bg-forge-orange focus:text-base-dark focus:rounded-lg focus:font-semibold"
    >
      Skip to main content
    </a>
  );
}

// Focus trap for modals and dialogs
interface FocusTrapProps {
  children: ReactNode;
  isActive: boolean;
  onEscape?: () => void;
}

export function FocusTrap({ children, isActive, onEscape }: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    // Focus first element
    firstElement?.focus();

    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape" && onEscape) {
        onEscape();
        return;
      }

      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isActive, onEscape]);

  return <div ref={containerRef}>{children}</div>;
}

// Screen reader only text
export function ScreenReaderOnly({ children }: { children: ReactNode }) {
  return <span className="sr-only">{children}</span>;
}

// Announce to screen readers
export function useAnnounce() {
  const announce = (message: string, priority: "polite" | "assertive" = "polite") => {
    const announcement = document.createElement("div");
    announcement.setAttribute("role", "status");
    announcement.setAttribute("aria-live", priority);
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = message;
    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  return { announce };
}

// Accessible button with loading state
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  children: ReactNode;
}

export function AccessibleButton({
  isLoading,
  loadingText = "Loading...",
  children,
  disabled,
  ...props
}: AccessibleButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      aria-disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="sr-only">{loadingText}</span>
          <span aria-hidden="true">{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

// Progress indicator with ARIA
interface AccessibleProgressProps {
  value: number;
  max?: number;
  label: string;
}

export function AccessibleProgress({ value, max = 100, label }: AccessibleProgressProps) {
  const percentage = Math.round((value / max) * 100);

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
    >
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-forge-orange to-forge-gold transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="sr-only">{`${label}: ${percentage}%`}</span>
    </div>
  );
}

// Alert with proper ARIA role
interface AccessibleAlertProps {
  type: "error" | "warning" | "success" | "info";
  children: ReactNode;
}

export function AccessibleAlert({ type, children }: AccessibleAlertProps) {
  const role = type === "error" ? "alert" : "status";
  const ariaLive = type === "error" ? "assertive" : "polite";

  const styles = {
    error: "bg-red-500/10 border-red-500/30 text-red-400",
    warning: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
    success: "bg-green-500/10 border-green-500/30 text-green-400",
    info: "bg-blue-500/10 border-blue-500/30 text-blue-400",
  };

  return (
    <div
      role={role}
      aria-live={ariaLive}
      className={`p-4 rounded-xl border ${styles[type]}`}
    >
      {children}
    </div>
  );
}

// Keyboard navigation helper
export function useKeyboardNav<T extends HTMLElement>(
  onEnter?: () => void,
  onSpace?: () => void
) {
  const handleKeyDown = (e: KeyboardEvent<T>) => {
    if (e.key === "Enter" && onEnter) {
      e.preventDefault();
      onEnter();
    }
    if (e.key === " " && onSpace) {
      e.preventDefault();
      onSpace();
    }
  };

  return { onKeyDown: handleKeyDown };
}

// Visually hidden but accessible
export function VisuallyHidden({ children }: { children: ReactNode }) {
  return (
    <span
      className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0"
      style={{ clip: "rect(0, 0, 0, 0)" }}
    >
      {children}
    </span>
  );
}
