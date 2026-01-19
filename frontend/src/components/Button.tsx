/**
 * Button Component
 * 
 * Consistent styled buttons for Base Token Forge.
 * Supports multiple variants and sizes with Base chain styling.
 */

"use client";

import { forwardRef, ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-gradient-to-r from-base-blue to-blue-600 
    text-white 
    hover:from-blue-500 hover:to-blue-700
    shadow-lg shadow-base-blue/25
    hover:shadow-base-blue/40
    border border-transparent
  `,
  secondary: `
    bg-white/5 
    text-white 
    hover:bg-white/10
    border border-white/10 hover:border-white/20
  `,
  ghost: `
    bg-transparent 
    text-white/80 
    hover:bg-white/5 hover:text-white
    border border-transparent
  `,
  danger: `
    bg-red-500/10 
    text-red-400 
    hover:bg-red-500/20
    border border-red-500/20 hover:border-red-500/30
  `,
  success: `
    bg-green-500/10 
    text-green-400 
    hover:bg-green-500/20
    border border-green-500/20 hover:border-green-500/30
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
  md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3.5 text-base rounded-xl gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      className = '',
      ...props
    },
    ref
  ) {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`
          inline-flex items-center justify-center font-medium
          transition-all duration-200 ease-out
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? 'w-full' : ''}
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]'}
          ${className}
        `}
        {...props}
      >
        {/* Loading spinner or left icon */}
        {loading ? (
          <LoadingSpinner size={size} />
        ) : leftIcon ? (
          <span className="flex-shrink-0">{leftIcon}</span>
        ) : null}

        {/* Button text */}
        {children}

        {/* Right icon (not shown when loading) */}
        {!loading && rightIcon && (
          <span className="flex-shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

/**
 * Loading spinner component
 */
function LoadingSpinner({ size }: { size: ButtonSize }) {
  const spinnerSize = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }[size];

  return (
    <svg
      className={`animate-spin ${spinnerSize}`}
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
  );
}

/**
 * Icon button variant
 */
interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  label: string; // For accessibility
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      variant = 'ghost',
      size = 'md',
      loading = false,
      label,
      disabled,
      children,
      className = '',
      ...props
    },
    ref
  ) {
    const isDisabled = disabled || loading;

    const iconSizeStyles: Record<ButtonSize, string> = {
      sm: 'w-7 h-7',
      md: 'w-9 h-9',
      lg: 'w-11 h-11',
    };

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-label={label}
        title={label}
        className={`
          inline-flex items-center justify-center
          transition-all duration-200 ease-out
          rounded-lg
          ${variantStyles[variant]}
          ${iconSizeStyles[size]}
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-[0.95]'}
          ${className}
        `}
        {...props}
      >
        {loading ? <LoadingSpinner size={size} /> : children}
      </button>
    );
  }
);

/**
 * Connect Wallet Button (specialized for Base)
 */
interface ConnectButtonProps {
  connected?: boolean;
  address?: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
  loading?: boolean;
}

export function BaseConnectButton({
  connected = false,
  address,
  onConnect,
  onDisconnect,
  loading = false,
}: ConnectButtonProps) {
  if (connected && address) {
    return (
      <Button
        variant="secondary"
        size="md"
        onClick={onDisconnect}
        leftIcon={
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        }
      >
        {address.slice(0, 6)}...{address.slice(-4)}
      </Button>
    );
  }

  return (
    <Button
      variant="primary"
      size="md"
      onClick={onConnect}
      loading={loading}
      leftIcon={
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      }
    >
      Connect Wallet
    </Button>
  );
}

/**
 * Button group for related actions
 */
interface ButtonGroupProps {
  children: ReactNode;
  attached?: boolean;
}

export function ButtonGroup({ children, attached = false }: ButtonGroupProps) {
  return (
    <div
      className={`
        flex items-center
        ${attached
          ? '[&>*:first-child]:rounded-r-none [&>*:last-child]:rounded-l-none [&>*:not(:first-child):not(:last-child)]:rounded-none [&>*:not(:last-child)]:-mr-px'
          : 'gap-2'
        }
      `}
    >
      {children}
    </div>
  );
}
