/**
 * Creation Wizard Component
 * 
 * Main component that orchestrates the token creation flow.
 */

"use client";

import { CreationFlowProvider, useCreationFlow } from "@/context/CreationFlowContext";
import { CreationStepDetails } from "./CreationStepDetails";
import { CreationStepSupply } from "./CreationStepSupply";
import { CreationStepReview } from "./CreationStepReview";
import { TransactionProgress } from "./TransactionProgress";

const STEPS = [
  { id: 'details', label: 'Details', number: 1 },
  { id: 'supply', label: 'Supply', number: 2 },
  { id: 'review', label: 'Review', number: 3 },
];

function StepIndicator() {
  const { step } = useCreationFlow();
  
  const currentStepIndex = STEPS.findIndex(s => s.id === step);
  
  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      {STEPS.map((s, index) => {
        const isComplete = currentStepIndex > index;
        const isCurrent = s.id === step;
        const isPending = currentStepIndex < index;

        return (
          <div key={s.id} className="flex items-center">
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold
                  transition-all duration-300
                  ${isComplete ? 'bg-green-500 text-white' : ''}
                  ${isCurrent ? 'bg-base-blue text-white ring-4 ring-base-blue/30' : ''}
                  ${isPending ? 'bg-white/10 text-white/40' : ''}
                `}
              >
                {isComplete ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  s.number
                )}
              </div>
              <span
                className={`
                  mt-2 text-xs font-medium
                  ${isCurrent ? 'text-base-blue' : isComplete ? 'text-green-400' : 'text-white/40'}
                `}
              >
                {s.label}
              </span>
            </div>

            {/* Connector line */}
            {index < STEPS.length - 1 && (
              <div
                className={`
                  w-16 h-0.5 mx-2 -mt-6
                  transition-colors duration-300
                  ${isComplete ? 'bg-green-500' : 'bg-white/10'}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function WizardContent() {
  const { step, transactionHash, error, reset } = useCreationFlow();

  // Transaction states
  if (['confirm', 'pending'].includes(step)) {
    return (
      <TransactionProgress
        phase={step === 'confirm' ? 'awaiting-signature' : 'pending'}
        hash={transactionHash}
        onRetry={reset}
      />
    );
  }

  if (step === 'success') {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
          <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Token Created!</h2>
        <p className="text-white/60 mb-6">
          Your token has been successfully deployed to Base.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-base-blue hover:bg-base-blue/90 text-white font-semibold rounded-xl transition-colors"
        >
          Create Another Token
        </button>
      </div>
    );
  }

  if (step === 'error') {
    return (
      <TransactionProgress
        phase="failed"
        error={error ? { title: 'Error', message: error.message } : null}
        onRetry={reset}
      />
    );
  }

  // Form steps
  return (
    <div>
      <StepIndicator />
      
      {step === 'details' && <CreationStepDetails />}
      {step === 'supply' && <CreationStepSupply />}
      {step === 'review' && <CreationStepReview />}
    </div>
  );
}

export function CreationWizard() {
  return (
    <CreationFlowProvider>
      <div className="max-w-lg mx-auto">
        <div className="p-6 bg-neutral-900/50 border border-white/10 rounded-2xl backdrop-blur-sm">
          <WizardContent />
        </div>
      </div>
    </CreationFlowProvider>
  );
}
