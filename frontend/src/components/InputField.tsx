/**
 * Input Field Component
 * 
 * Consistent styled input field with label, error, and helper text.
 */

"use client";

import { forwardRef, InputHTMLAttributes, ReactNode } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  required?: boolean;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  function InputField(
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      required,
      className = '',
      disabled,
      ...props
    },
    ref
  ) {
    const hasError = !!error;

    return (
      <div className="space-y-2">
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-white/80">
            {label}
            {required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}

        {/* Input container */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            disabled={disabled}
            className={`
              w-full px-4 py-3 
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon ? 'pr-10' : ''}
              bg-white/5 border rounded-xl text-white placeholder-white/40
              transition-all duration-200
              ${hasError
                ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                : 'border-white/10 focus:border-base-blue/50 focus:ring-2 focus:ring-base-blue/20'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-white/20'}
              outline-none
              ${className}
            `}
            {...props}
          />

          {/* Right icon */}
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Error or helper text */}
        {(error || helperText) && (
          <p className={`text-xs ${hasError ? 'text-red-400' : 'text-white/40'}`}>
            {hasError && (
              <span className="inline-flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </span>
            )}
            {!hasError && helperText}
          </p>
        )}
      </div>
    );
  }
);

/**
 * Textarea variant
 */
interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  function TextareaField(
    {
      label,
      error,
      helperText,
      required,
      className = '',
      disabled,
      ...props
    },
    ref
  ) {
    const hasError = !!error;

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-white/80">
            {label}
            {required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          disabled={disabled}
          className={`
            w-full px-4 py-3 min-h-[100px]
            bg-white/5 border rounded-xl text-white placeholder-white/40
            transition-all duration-200 resize-y
            ${hasError
              ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              : 'border-white/10 focus:border-base-blue/50 focus:ring-2 focus:ring-base-blue/20'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-white/20'}
            outline-none
            ${className}
          `}
          {...props}
        />

        {(error || helperText) && (
          <p className={`text-xs ${hasError ? 'text-red-400' : 'text-white/40'}`}>
            {hasError ? error : helperText}
          </p>
        )}
      </div>
    );
  }
);

/**
 * Select field variant
 */
interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  options: { value: string | number; label: string }[];
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  function SelectField(
    {
      label,
      error,
      helperText,
      required,
      options,
      className = '',
      disabled,
      ...props
    },
    ref
  ) {
    const hasError = !!error;

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-white/80">
            {label}
            {required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}

        <select
          ref={ref}
          disabled={disabled}
          className={`
            w-full px-4 py-3 
            bg-white/5 border rounded-xl text-white
            transition-all duration-200 appearance-none cursor-pointer
            ${hasError
              ? 'border-red-500/50 focus:border-red-500'
              : 'border-white/10 focus:border-base-blue/50'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-white/20'}
            outline-none
            ${className}
          `}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-neutral-900">
              {option.label}
            </option>
          ))}
        </select>

        {(error || helperText) && (
          <p className={`text-xs ${hasError ? 'text-red-400' : 'text-white/40'}`}>
            {hasError ? error : helperText}
          </p>
        )}
      </div>
    );
  }
);
