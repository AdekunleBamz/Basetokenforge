'use client';

/**
 * Token Approval Button Component
 * 
 * A smart button that handles ERC20 token approvals with
 * status display, loading states, and revocation support.
 */

import { useState, useEffect } from 'react';
import { Check, AlertCircle, Loader2, Shield, ShieldOff } from 'lucide-react';
import { useTokenApproval, formatAllowance } from '@/hooks/useTokenApproval';
import type { Address } from 'viem';
import { maxUint256 } from 'viem';

interface TokenApprovalButtonProps {
  /** Token contract address */
  tokenAddress: Address;
  /** Spender address (contract that needs approval) */
  spenderAddress: Address;
  /** Required amount in wei (optional, checks if sufficient) */
  requiredAmount?: bigint;
  /** Token symbol for display */
  tokenSymbol: string;
  /** Token decimals */
  tokenDecimals?: number;
  /** Use infinite approval (max uint256) */
  infiniteApproval?: boolean;
  /** Show revoke option when approved */
  showRevoke?: boolean;
  /** Callback on successful approval */
  onApprovalSuccess?: () => void;
  /** Callback on revocation */
  onRevoke?: () => void;
  /** Additional CSS classes */
  className?: string;
}

export function TokenApprovalButton({
  tokenAddress,
  spenderAddress,
  requiredAmount,
  tokenSymbol,
  tokenDecimals = 18,
  infiniteApproval = true,
  showRevoke = true,
  onApprovalSuccess,
  onRevoke,
  className = '',
}: TokenApprovalButtonProps) {
  const {
    status,
    allowanceInfo,
    error,
    checkAllowance,
    approve,
    revoke,
    reset,
    isPending,
  } = useTokenApproval();

  const [showRevokeConfirm, setShowRevokeConfirm] = useState(false);

  // Check allowance on mount
  useEffect(() => {
    checkAllowance(tokenAddress, spenderAddress, requiredAmount);
  }, [tokenAddress, spenderAddress, requiredAmount, checkAllowance]);

  // Handle approval success
  useEffect(() => {
    if (status === 'approved' && onApprovalSuccess) {
      onApprovalSuccess();
    }
  }, [status, onApprovalSuccess]);

  // Handle approve click
  const handleApprove = async () => {
    const amount = infiniteApproval ? maxUint256 : requiredAmount;
    await approve(tokenAddress, spenderAddress, amount);
  };

  // Handle revoke click
  const handleRevoke = async () => {
    await revoke(tokenAddress, spenderAddress);
    setShowRevokeConfirm(false);
    onRevoke?.();
  };

  // Loading state
  if (status === 'checking') {
    return (
      <button
        disabled
        className={`flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-700 text-gray-400 rounded-lg ${className}`}
      >
        <Loader2 className="h-4 w-4 animate-spin" />
        Checking approval...
      </button>
    );
  }

  // Error state
  if (status === 'error' && error) {
    return (
      <div className={`${className}`}>
        <button
          onClick={() => reset()}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-900/50 border border-red-700 text-red-400 rounded-lg hover:bg-red-900/70 transition-colors"
        >
          <AlertCircle className="h-4 w-4" />
          Approval Failed - Retry
        </button>
        <p className="text-red-400 text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  // Already approved state
  if (status === 'approved' && allowanceInfo) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center gap-2 px-4 py-2.5 bg-green-900/30 border border-green-700 text-green-400 rounded-lg">
          <Check className="h-4 w-4" />
          <span>Approved</span>
          <span className="text-green-500 text-sm ml-auto">
            {formatAllowance(allowanceInfo.allowance, tokenDecimals, tokenSymbol)}
          </span>
        </div>

        {/* Revoke Option */}
        {showRevoke && (
          <>
            {showRevokeConfirm ? (
              <div className="flex gap-2">
                <button
                  onClick={handleRevoke}
                  disabled={isPending}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ShieldOff className="h-4 w-4" />
                  )}
                  Confirm Revoke
                </button>
                <button
                  onClick={() => setShowRevokeConfirm(false)}
                  disabled={isPending}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowRevokeConfirm(true)}
                className="text-sm text-gray-400 hover:text-red-400 transition-colors"
              >
                Revoke approval
              </button>
            )}
          </>
        )}
      </div>
    );
  }

  // Needs approval state
  return (
    <button
      onClick={handleApprove}
      disabled={isPending}
      className={`flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors ${className}`}
    >
      {isPending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {status === 'awaiting-signature' ? 'Confirm in wallet...' : 'Approving...'}
        </>
      ) : (
        <>
          <Shield className="h-4 w-4" />
          Approve {tokenSymbol}
        </>
      )}
    </button>
  );
}

/**
 * Approval Status Badge Component
 */
export function ApprovalStatusBadge({
  isApproved,
  allowance,
  decimals = 18,
  symbol = '',
}: {
  isApproved: boolean;
  allowance?: bigint;
  decimals?: number;
  symbol?: string;
}) {
  if (isApproved) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-900/30 text-green-400 rounded-full text-xs">
        <Check className="h-3 w-3" />
        Approved
        {allowance && (
          <span className="ml-1">({formatAllowance(allowance, decimals, symbol)})</span>
        )}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-900/30 text-yellow-400 rounded-full text-xs">
      <AlertCircle className="h-3 w-3" />
      Needs Approval
    </span>
  );
}

export default TokenApprovalButton;
