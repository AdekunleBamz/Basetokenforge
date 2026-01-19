/**
 * Creation Step Review Component
 * 
 * Third step of token creation - review all details before deployment.
 */

"use client";

import { useCreationFlow } from "@/context/CreationFlowContext";
import { useNetwork } from "@/context/NetworkContext";
import { formatEther } from "viem";

interface ReviewItemProps {
  label: string;
  value: string;
  mono?: boolean;
}

function ReviewItem({ label, value, mono = false }: ReviewItemProps) {
  return (
    <div className="flex justify-between py-3 border-b border-white/10 last:border-0">
      <span className="text-white/60">{label}</span>
      <span className={`text-white ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}

interface CreationStepReviewProps {
  creationFee?: bigint;
  estimatedGas?: bigint;
}

export function CreationStepReview({ 
  creationFee = BigInt(100000000000000), // 0.0001 ETH
  estimatedGas,
}: CreationStepReviewProps) {
  const { formData, goBack, setStep } = useCreationFlow();
  const { networkName, isTestnet } = useNetwork();

  const formatSupply = (value: string): string => {
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return num.toLocaleString();
  };

  const feeEth = formatEther(creationFee);
  const feeFormatted = parseFloat(feeEth).toFixed(6);

  const handleConfirm = () => {
    setStep('confirm');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-2">Review Token</h2>
        <p className="text-white/60">
          Double-check your token details before deploying to {networkName}.
        </p>
      </div>

      {/* Testnet Notice */}
      {isTestnet && (
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-yellow-400 font-medium">Testnet Deployment</p>
              <p className="text-white/60 text-sm mt-1">
                This token will be deployed on Base Sepolia testnet using test ETH.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Token Preview Card */}
      <div className="p-6 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-base-blue to-purple-500 flex items-center justify-center">
            <span className="text-white font-bold text-xl">
              {formData.symbol.slice(0, 2)}
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{formData.name}</h3>
            <p className="text-white/60">${formData.symbol}</p>
          </div>
        </div>

        <div className="space-y-1">
          <ReviewItem label="Token Name" value={formData.name} />
          <ReviewItem label="Symbol" value={formData.symbol} mono />
          <ReviewItem label="Decimals" value={formData.decimals.toString()} mono />
          <ReviewItem label="Initial Supply" value={formatSupply(formData.initialSupply)} mono />
          <ReviewItem label="Network" value={networkName} />
        </div>
      </div>

      {/* Fee Information */}
      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
        <h4 className="text-sm font-medium text-white/80 mb-3">Transaction Details</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-white/60">Creation Fee</span>
            <span className="text-white font-mono">{feeFormatted} ETH</span>
          </div>
          {estimatedGas && (
            <div className="flex justify-between">
              <span className="text-white/60">Estimated Gas</span>
              <span className="text-white/60 font-mono">
                ~{formatEther(estimatedGas)} ETH
              </span>
            </div>
          )}
          <div className="pt-2 border-t border-white/10 flex justify-between">
            <span className="text-white/80">Total Cost</span>
            <span className="text-base-blue font-mono font-semibold">
              {feeFormatted} ETH + gas
            </span>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
        <h4 className="text-sm font-medium text-blue-400 mb-2">Important</h4>
        <ul className="text-sm text-white/60 space-y-1">
          <li>• Token details cannot be changed after deployment</li>
          <li>• All tokens will be minted to your wallet</li>
          <li>• The contract will be verified on Basescan</li>
        </ul>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={goBack}
          className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleConfirm}
          className="flex-1 px-6 py-4 bg-gradient-to-r from-base-blue to-purple-500 hover:from-base-blue/90 hover:to-purple-500/90 text-white font-semibold text-lg rounded-xl transition-all shadow-lg shadow-base-blue/25"
        >
          Deploy Token
        </button>
      </div>
    </div>
  );
}
