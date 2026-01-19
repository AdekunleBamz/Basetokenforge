'use client';

/**
 * Token Transfer Modal Component
 * 
 * A modal dialog for transferring ERC20 tokens to another address.
 * Includes validation, amount presets, and transaction tracking.
 */

import { useState, useEffect } from 'react';
import { X, Send, Wallet, ArrowRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useTokenTransfer, formatTransferAmount } from '@/hooks/useTokenTransfer';
import { useWalletBalance } from '@/hooks/useWalletBalance';
import { isAddress } from 'viem';
import type { Address } from 'viem';

interface TokenTransferModalProps {
  /** Whether modal is open */
  isOpen: boolean;
  /** Close modal callback */
  onClose: () => void;
  /** Token contract address */
  tokenAddress: Address;
  /** Token symbol */
  tokenSymbol: string;
  /** Token decimals */
  tokenDecimals: number;
  /** User's balance of this token */
  userBalance: string;
  /** Callback on successful transfer */
  onSuccess?: (txHash: string) => void;
}

// Amount presets as percentages
const AMOUNT_PRESETS = [
  { label: '25%', value: 0.25 },
  { label: '50%', value: 0.5 },
  { label: '75%', value: 0.75 },
  { label: 'Max', value: 1 },
];

export function TokenTransferModal({
  isOpen,
  onClose,
  tokenAddress,
  tokenSymbol,
  tokenDecimals,
  userBalance,
  onSuccess,
}: TokenTransferModalProps) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [recipientError, setRecipientError] = useState('');
  const [amountError, setAmountError] = useState('');

  const { transfer, status, result, error, reset, isPending, isAwaitingSignature } = useTokenTransfer();
  const { hasGasBalance } = useWalletBalance();

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setRecipient('');
      setAmount('');
      setRecipientError('');
      setAmountError('');
      reset();
    }
  }, [isOpen, reset]);

  // Validate recipient address
  const validateRecipient = (value: string): boolean => {
    if (!value) {
      setRecipientError('Recipient address is required');
      return false;
    }
    if (!isAddress(value)) {
      setRecipientError('Invalid Ethereum address');
      return false;
    }
    if (value === '0x0000000000000000000000000000000000000000') {
      setRecipientError('Cannot send to zero address');
      return false;
    }
    setRecipientError('');
    return true;
  };

  // Validate amount
  const validateAmount = (value: string): boolean => {
    const numValue = parseFloat(value);
    const balanceNum = parseFloat(userBalance);

    if (!value || isNaN(numValue)) {
      setAmountError('Amount is required');
      return false;
    }
    if (numValue <= 0) {
      setAmountError('Amount must be greater than 0');
      return false;
    }
    if (numValue > balanceNum) {
      setAmountError('Insufficient balance');
      return false;
    }
    setAmountError('');
    return true;
  };

  // Handle preset click
  const handlePreset = (percentage: number) => {
    const balanceNum = parseFloat(userBalance);
    const presetAmount = (balanceNum * percentage).toFixed(tokenDecimals > 8 ? 8 : tokenDecimals);
    setAmount(presetAmount);
    validateAmount(presetAmount);
  };

  // Handle transfer
  const handleTransfer = async () => {
    const isRecipientValid = validateRecipient(recipient);
    const isAmountValid = validateAmount(amount);

    if (!isRecipientValid || !isAmountValid) return;

    const success = await transfer({
      tokenAddress,
      to: recipient as Address,
      amount,
      decimals: tokenDecimals,
    });

    if (success && result.hash) {
      onSuccess?.(result.hash);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-gray-900 rounded-2xl border border-gray-700 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Send className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-white">Transfer {tokenSymbol}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Success State */}
          {status === 'success' && (
            <div className="text-center py-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Transfer Successful!</h3>
              <p className="text-gray-400 mb-4">
                {formatTransferAmount(amount, tokenSymbol)} sent to recipient
              </p>
              {result.hash && (
                <a
                  href={`https://basescan.org/tx/${result.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  View on Basescan →
                </a>
              )}
              <button
                onClick={onClose}
                className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Done
              </button>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && error && (
            <div className="flex items-start gap-3 p-3 bg-red-900/30 border border-red-700 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-400 font-medium">Transfer Failed</p>
                <p className="text-red-300 text-sm">{error.message}</p>
              </div>
            </div>
          )}

          {/* Form */}
          {status !== 'success' && (
            <>
              {/* Balance Display */}
              <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-gray-400">
                  <Wallet className="h-4 w-4" />
                  <span className="text-sm">Your Balance</span>
                </div>
                <span className="text-white font-medium">
                  {parseFloat(userBalance).toLocaleString()} {tokenSymbol}
                </span>
              </div>

              {/* Recipient Input */}
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">
                  Recipient Address
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => {
                    setRecipient(e.target.value);
                    if (recipientError) validateRecipient(e.target.value);
                  }}
                  onBlur={() => validateRecipient(recipient)}
                  placeholder="0x..."
                  className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
                    recipientError 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-700 focus:ring-blue-500'
                  }`}
                  disabled={isPending}
                />
                {recipientError && (
                  <p className="text-red-400 text-sm mt-1">{recipientError}</p>
                )}
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">
                  Amount
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9.]/g, '');
                      setAmount(value);
                      if (amountError) validateAmount(value);
                    }}
                    onBlur={() => validateAmount(amount)}
                    placeholder="0.00"
                    className={`w-full px-4 py-3 pr-20 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
                      amountError 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-700 focus:ring-blue-500'
                    }`}
                    disabled={isPending}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    {tokenSymbol}
                  </span>
                </div>
                {amountError && (
                  <p className="text-red-400 text-sm mt-1">{amountError}</p>
                )}

                {/* Amount Presets */}
                <div className="flex gap-2 mt-2">
                  {AMOUNT_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => handlePreset(preset.value)}
                      disabled={isPending}
                      className="flex-1 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gas Warning */}
              {!hasGasBalance && (
                <div className="flex items-center gap-2 p-3 bg-yellow-900/30 border border-yellow-700 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-yellow-400" />
                  <span className="text-yellow-300 text-sm">
                    Low ETH balance for gas fees
                  </span>
                </div>
              )}

              {/* Transfer Button */}
              <button
                onClick={handleTransfer}
                disabled={isPending || !hasGasBalance}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                {isAwaitingSignature ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Confirm in Wallet...
                  </>
                ) : isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Transferring...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Transfer {tokenSymbol}
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default TokenTransferModal;
