'use client';

/**
 * Quick Transfer Widget Component
 * 
 * A compact widget for quick token transfers without opening modals.
 * Perfect for sidebar or dashboard placement.
 */

import { useState, useCallback } from 'react';
import { Send, ArrowRight, Loader2, Check, AlertCircle } from 'lucide-react';
import { useTokenTransfer } from '@/hooks/useTokenTransfer';
import { isAddress } from 'viem';
import type { Address } from 'viem';

interface QuickTransferWidgetProps {
  /** Token contract address */
  tokenAddress: Address;
  /** Token symbol */
  tokenSymbol: string;
  /** Token decimals */
  tokenDecimals: number;
  /** User's balance */
  userBalance: string;
  /** Callback on successful transfer */
  onSuccess?: (txHash: string) => void;
  /** Additional CSS classes */
  className?: string;
}

export function QuickTransferWidget({
  tokenAddress,
  tokenSymbol,
  tokenDecimals,
  userBalance,
  onSuccess,
  className = '',
}: QuickTransferWidgetProps) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const { transfer, status, result, error, reset, isPending, isAwaitingSignature } = useTokenTransfer();

  // Validate inputs
  const isValidRecipient = recipient && isAddress(recipient);
  const numAmount = parseFloat(amount);
  const numBalance = parseFloat(userBalance);
  const isValidAmount = !isNaN(numAmount) && numAmount > 0 && numAmount <= numBalance;
  const canTransfer = isValidRecipient && isValidAmount && !isPending;

  // Handle transfer
  const handleTransfer = async () => {
    if (!canTransfer) return;

    const success = await transfer({
      tokenAddress,
      to: recipient as Address,
      amount,
      decimals: tokenDecimals,
    });

    if (success) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setRecipient('');
        setAmount('');
        reset();
      }, 3000);
      
      if (result.hash) {
        onSuccess?.(result.hash);
      }
    }
  };

  // Set amount to max
  const handleMax = () => {
    setAmount(userBalance);
  };

  // Success state
  if (showSuccess || status === 'success') {
    return (
      <div className={`bg-green-900/20 border border-green-700/50 rounded-xl p-4 text-center ${className}`}>
        <Check className="h-10 w-10 text-green-400 mx-auto mb-2" />
        <p className="text-green-400 font-medium">Transfer Sent!</p>
        {result.hash && (
          <a
            href={`https://basescan.org/tx/${result.hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 text-sm hover:underline"
          >
            View transaction →
          </a>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-gray-800/50 border border-gray-700 rounded-xl p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Send className="h-5 w-5 text-blue-500" />
        <h3 className="font-semibold text-white">Quick Transfer</h3>
      </div>

      {/* Error Display */}
      {status === 'error' && error && (
        <div className="flex items-start gap-2 p-2 bg-red-900/30 rounded-lg mb-4">
          <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-400 text-sm">{error.message}</p>
        </div>
      )}

      {/* Recipient Input */}
      <div className="mb-3">
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="Recipient address (0x...)"
          disabled={isPending}
          className={`w-full px-3 py-2 bg-gray-900 border rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
            recipient && !isValidRecipient 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-600 focus:ring-blue-500'
          }`}
        />
      </div>

      {/* Amount Input */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
            placeholder="Amount"
            disabled={isPending}
            className={`w-full px-3 py-2 pr-20 bg-gray-900 border rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
              amount && !isValidAmount
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-600 focus:ring-blue-500'
            }`}
          />
          <button
            onClick={handleMax}
            disabled={isPending}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-0.5 text-xs text-blue-400 hover:text-blue-300 bg-gray-800 rounded"
          >
            MAX
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Balance: {parseFloat(userBalance).toLocaleString()} {tokenSymbol}
        </p>
      </div>

      {/* Transfer Button */}
      <button
        onClick={handleTransfer}
        disabled={!canTransfer}
        className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm transition-colors"
      >
        {isAwaitingSignature ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Confirm...
          </>
        ) : isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            Send <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </div>
  );
}

export default QuickTransferWidget;
