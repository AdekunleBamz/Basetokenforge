/**
 * Copy Button Component
 * 
 * Reusable copy button with visual feedback.
 */

"use client";

import { useState, useCallback } from "react";
import { copyToClipboard } from "@/lib/clipboard";

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
  variant?: 'icon' | 'button' | 'text';
  size?: 'sm' | 'md' | 'lg';
  onCopy?: () => void;
}

export function CopyButton({
  text,
  label = "Copy",
  className = '',
  variant = 'icon',
  size = 'md',
  onCopy,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 2000);
    }
  }, [text, onCopy]);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const buttonSizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  if (variant === 'button') {
    return (
      <button
        onClick={handleCopy}
        className={`
          inline-flex items-center gap-1.5 
          ${buttonSizeClasses[size]}
          ${copied 
            ? 'bg-green-500/20 text-green-400 border-green-500/30' 
            : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
          }
          border rounded-lg transition-all
          ${className}
        `}
      >
        {copied ? (
          <>
            <svg className={sizeClasses[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Copied!
          </>
        ) : (
          <>
            <svg className={sizeClasses[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {label}
          </>
        )}
      </button>
    );
  }

  if (variant === 'text') {
    return (
      <button
        onClick={handleCopy}
        className={`
          inline-flex items-center gap-1 text-sm
          ${copied ? 'text-green-400' : 'text-base-blue hover:text-base-blue/80'}
          transition-colors
          ${className}
        `}
      >
        {copied ? 'Copied!' : label}
      </button>
    );
  }

  // Icon variant (default)
  return (
    <button
      onClick={handleCopy}
      className={`
        p-1.5 rounded-lg transition-all
        ${copied 
          ? 'bg-green-500/20 text-green-400' 
          : 'text-white/40 hover:text-white hover:bg-white/10'
        }
        ${className}
      `}
      title={copied ? 'Copied!' : label}
    >
      {copied ? (
        <svg className={sizeClasses[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className={sizeClasses[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
}

/**
 * Address with copy button
 */
interface AddressWithCopyProps {
  address: string;
  truncate?: boolean;
  className?: string;
}

export function AddressWithCopy({ address, truncate = true, className = '' }: AddressWithCopyProps) {
  const displayAddress = truncate 
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : address;

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <code className="font-mono text-white/80">{displayAddress}</code>
      <CopyButton text={address} label="Copy address" size="sm" />
    </div>
  );
}

/**
 * Transaction hash with copy and link
 */
interface TxHashWithCopyProps {
  hash: string;
  explorerUrl?: string;
  className?: string;
}

export function TxHashWithCopy({ hash, explorerUrl, className = '' }: TxHashWithCopyProps) {
  const shortHash = `${hash.slice(0, 10)}...${hash.slice(-8)}`;

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <code className="font-mono text-white/80">{shortHash}</code>
      <CopyButton text={hash} label="Copy hash" size="sm" />
      {explorerUrl && (
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 text-white/40 hover:text-base-blue transition-colors"
          title="View on Basescan"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      )}
    </div>
  );
}
