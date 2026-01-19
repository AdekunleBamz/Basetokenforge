/**
 * Transaction Progress Component
 * 
 * Visual progress indicator for Base transactions.
 */

"use client";

import { type TransactionPhase, getPhaseInfo, formatDuration } from "@/hooks/useTransactionStatus";

interface TransactionProgressProps {
  phase: TransactionPhase;
  hash?: `0x${string}` | null;
  duration?: number | null;
  error?: { title: string; message: string } | null;
  onRetry?: () => void;
  onViewOnBasescan?: () => void;
}

const PHASES: TransactionPhase[] = [
  'preparing',
  'awaiting-signature',
  'pending',
  'confirming',
  'confirmed',
];

export function TransactionProgress({
  phase,
  hash,
  duration,
  error,
  onRetry,
  onViewOnBasescan,
}: TransactionProgressProps) {
  const currentPhaseInfo = getPhaseInfo(phase);

  if (phase === 'idle') {
    return null;
  }

  if (phase === 'failed' && error) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-xl">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5 text-red-400"
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
          </div>
          <div className="flex-1">
            <h4 className="text-red-400 font-semibold">{error.title}</h4>
            <p className="text-white/60 text-sm mt-1">{error.message}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="mt-3 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl text-red-400 text-sm font-medium transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
      {/* Progress steps */}
      <div className="flex items-center justify-between mb-6">
        {PHASES.map((stepPhase, index) => {
          const info = getPhaseInfo(stepPhase);
          const phaseIndex = PHASES.indexOf(phase);
          const stepIndex = index;
          
          const isComplete = phaseIndex > stepIndex;
          const isCurrent = phase === stepPhase;
          const isPending = phaseIndex < stepIndex;

          return (
            <div key={stepPhase} className="flex items-center flex-1">
              {/* Step circle */}
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm
                  transition-all duration-300
                  ${isComplete ? 'bg-green-500 text-white' : ''}
                  ${isCurrent ? `${info.bgColor} ${info.color}` : ''}
                  ${isPending ? 'bg-white/10 text-white/40' : ''}
                `}
              >
                {isComplete ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>

              {/* Connector line */}
              {index < PHASES.length - 1 && (
                <div
                  className={`
                    flex-1 h-0.5 mx-2
                    transition-colors duration-300
                    ${isComplete ? 'bg-green-500' : 'bg-white/10'}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Current status */}
      <div className="text-center">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${currentPhaseInfo.bgColor} mb-3`}>
          {phase !== 'confirmed' && (
            <svg
              className={`w-4 h-4 ${currentPhaseInfo.color} animate-spin`}
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
          {phase === 'confirmed' && (
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          <span className={`font-medium ${currentPhaseInfo.color}`}>
            {currentPhaseInfo.label}
          </span>
        </div>

        <p className="text-white/60 text-sm">{currentPhaseInfo.description}</p>

        {/* Duration */}
        {duration !== null && duration !== undefined && (
          <p className="text-white/40 text-xs mt-2">
            Time elapsed: {formatDuration(duration)}
          </p>
        )}

        {/* Transaction hash */}
        {hash && (
          <button
            onClick={onViewOnBasescan}
            className="mt-4 text-base-blue hover:text-base-blue/80 text-sm flex items-center gap-1 mx-auto transition-colors"
          >
            View on Basescan
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
