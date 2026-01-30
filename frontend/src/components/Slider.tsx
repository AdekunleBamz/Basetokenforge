"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  formatValue?: (value: number) => string;
  className?: string;
  id?: string;
}

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = true,
  formatValue = (v) => String(v),
  className,
  id,
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;
  const sliderId = id || React.useId();

  return (
    <div className={cn('space-y-2', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <label htmlFor={sliderId} className="text-sm text-white/60">
              {label}
            </label>
          )}
          {showValue && (
            <span 
              className="text-sm font-medium text-white tabular-nums"
              aria-live="polite"
              aria-atomic="true"
            >
              {formatValue(value)}
            </span>
          )}
        </div>
      )}
      <div className="relative group">
        <input
          id={sliderId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={formatValue(value)}
          className={cn(
            'w-full h-2 appearance-none cursor-pointer bg-transparent',
            '[&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-white/10',
            '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5',
            '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-forge-orange [&::-webkit-slider-thumb]:mt-[-6px]',
            '[&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-forge-orange/25',
            '[&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110',
            'focus:outline-none focus-visible:[&::-webkit-slider-thumb]:ring-2 focus-visible:[&::-webkit-slider-thumb]:ring-forge-orange/50'
          )}
          style={{
            background: `linear-gradient(to right, #ED8936 ${percentage}%, rgba(255,255,255,0.1) ${percentage}%)`,
          }}
        />
      </div>
    </div>
  );
}
