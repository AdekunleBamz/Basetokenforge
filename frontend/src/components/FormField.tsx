"use client";

import { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  error?: string | null;
  touched?: boolean;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  successMessage?: string;
  showSuccess?: boolean;
}

export function FormField({
  label,
  error,
  touched,
  hint,
  required,
  children,
  successMessage,
  showSuccess,
}: FormFieldProps) {
  const hasError = touched && error;
  const isSuccess = touched && !error && showSuccess;

  return (
    <div className="space-y-2">
      {/* Label */}
      <label className="flex items-center gap-2 text-white/80 font-medium">
        {label}
        {required && <span className="text-forge-orange text-sm">*</span>}
      </label>

      {/* Input wrapper with validation styling */}
      <div className="relative">
        {children}
        
        {/* Validation icon */}
        {touched && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            {hasError ? (
              <svg
                className="w-5 h-5 text-red-400 animate-in fade-in duration-200"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            ) : isSuccess ? (
              <svg
                className="w-5 h-5 text-green-400 animate-in fade-in duration-200"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : null}
          </div>
        )}
      </div>

      {/* Error message */}
      {hasError && (
        <p className="flex items-center gap-1.5 text-red-400 text-sm animate-in slide-in-from-top-1 duration-200">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}

      {/* Success message */}
      {isSuccess && successMessage && (
        <p className="flex items-center gap-1.5 text-green-400 text-sm animate-in slide-in-from-top-1 duration-200">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          {successMessage}
        </p>
      )}

      {/* Hint text (only show when no error) */}
      {!hasError && hint && (
        <p className="text-white/40 text-sm">{hint}</p>
      )}
    </div>
  );
}

// Input with validation styling
interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
  isSuccess?: boolean;
}

export function ValidatedInput({
  hasError,
  isSuccess,
  className = "",
  ...props
}: ValidatedInputProps) {
  const baseClasses =
    "w-full px-5 py-4 rounded-xl bg-base-gray/50 text-white placeholder-white/40 font-body transition-all duration-300 pr-12";
  
  const stateClasses = hasError
    ? "border-2 border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
    : isSuccess
    ? "border-2 border-green-500/50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
    : "border border-white/10 focus:border-forge-orange/50 focus:ring-2 focus:ring-forge-orange/20";

  return (
    <input
      className={`${baseClasses} ${stateClasses} ${className} focus:outline-none`}
      {...props}
    />
  );
}
