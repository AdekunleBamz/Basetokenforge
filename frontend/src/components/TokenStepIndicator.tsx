"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Badge } from '@/components/ui/Badge';

interface TokenStepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: Array<{
    title: string;
    description?: string;
  }>;
  className?: string;
}

export function TokenStepIndicator({
  currentStep,
  totalSteps,
  steps,
  className,
}: TokenStepIndicatorProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-white/60">
          Step <span className="text-white/80 font-medium">{currentStep}</span> of{' '}
          <span className="text-white/80 font-medium">{totalSteps}</span>
        </p>
        <p className="text-sm text-white/40">
          {Math.max(0, Math.min(100, Math.round((currentStep / Math.max(totalSteps, 1)) * 100)))}%
        </p>
      </div>
      {/* Progress bar */}
      <div className="flex items-center justify-between mb-6">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <React.Fragment key={index}>
              {/* Step circle */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all',
                    isCompleted && 'bg-green-500 text-white',
                    isCurrent && 'bg-forge-orange text-white ring-4 ring-forge-orange/30',
                    !isCompleted && !isCurrent && 'bg-white/10 text-white/40'
                  )}
                >
                  {isCompleted ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </div>
                <span
                  className={cn(
                    'mt-2 text-sm font-medium',
                    isCurrent ? 'text-white' : 'text-white/40'
                  )}
                >
                  {step.title}
                </span>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-4 mb-8',
                    stepNumber < currentStep
                      ? 'bg-green-500'
                      : 'bg-white/10'
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Current step description */}
      {steps[currentStep - 1]?.description && (
        <div className="text-center">
          <Badge variant="info">
            {steps[currentStep - 1].description}
          </Badge>
        </div>
      )}
    </div>
  );
}
