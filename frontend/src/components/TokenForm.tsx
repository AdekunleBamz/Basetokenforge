"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';
import { InfoTooltipIcon } from './InfoTooltipIcon';

interface FormFieldProps {
  label: string;
  tooltip?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  tooltip,
  error,
  hint,
  required = false,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-white">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
        {tooltip && <InfoTooltipIcon content={tooltip} />}
      </div>
      {children}
      {error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : hint ? (
        <p className="text-sm text-white/40">{hint}</p>
      ) : null}
    </div>
  );
}

interface TokenFormProps {
  onSubmit: (data: { name: string; symbol: string; initialSupply: string }) => void;
  isLoading?: boolean;
  className?: string;
}

export function TokenForm({ onSubmit, isLoading = false, className }: TokenFormProps) {
  const [name, setName] = React.useState('');
  const [symbol, setSymbol] = React.useState('');
  const [initialSupply, setInitialSupply] = React.useState('');
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Token name is required';
    if (name.length > 32) newErrors.name = 'Name must be 32 characters or less';
    if (!symbol.trim()) newErrors.symbol = 'Symbol is required';
    if (symbol.length > 8) newErrors.symbol = 'Symbol must be 8 characters or less';
    if (!initialSupply) newErrors.initialSupply = 'Initial supply is required';
    if (Number(initialSupply) <= 0) newErrors.initialSupply = 'Supply must be greater than 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ name, symbol, initialSupply });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
      <FormField
        label="Token Name"
        tooltip="The full name of your token (e.g., My Token)"
        error={errors.name}
        required
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Awesome Token"
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-forge-orange focus:outline-none"
          maxLength={32}
        />
      </FormField>

      <FormField
        label="Token Symbol"
        tooltip="A short ticker for your token (e.g., MTK)"
        error={errors.symbol}
        required
      >
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          placeholder="MTK"
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-forge-orange focus:outline-none"
          maxLength={8}
        />
      </FormField>

      <FormField
        label="Initial Supply"
        tooltip="The number of tokens to create initially"
        error={errors.initialSupply}
        hint="You'll receive all tokens to your connected wallet"
        required
      >
        <input
          type="number"
          value={initialSupply}
          onChange={(e) => setInitialSupply(e.target.value)}
          placeholder="1000000"
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-forge-orange focus:outline-none"
          min="1"
        />
      </FormField>

      <Button
        type="submit"
        variant="primary"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Creating Token...' : 'Create Token'}
      </Button>
    </form>
  );
}
