"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface DateRangePickerProps {
  startDate?: Date;
  endDate?: Date;
  onChange: (range: { start?: Date; end?: Date }) => void;
  label?: string;
  className?: string;
}

export function DateRangePicker({
  startDate,
  endDate,
  onChange,
  label = 'Date range',
  className,
}: DateRangePickerProps) {
  const startId = React.useId();
  const endId = React.useId();

  const formatDate = (date?: Date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : undefined;
    onChange({ start: date, end: endDate });
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : undefined;
    onChange({ start: startDate, end: date });
  };

  return (
    <fieldset className={cn('flex items-center gap-2', className)}>
      <legend className="sr-only">{label}</legend>
      <div className="relative">
        <label htmlFor={startId} className="sr-only">Start date</label>
        <input
          id={startId}
          type="date"
          value={formatDate(startDate)}
          onChange={handleStartChange}
          aria-label="Start date"
          className={cn(
            'px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm',
            'focus:border-forge-orange focus:outline-none focus:ring-2 focus:ring-forge-orange/30',
            'transition-all hover:border-white/20'
          )}
        />
      </div>
      <span className="text-white/40" aria-hidden="true">to</span>
      <div className="relative">
        <label htmlFor={endId} className="sr-only">End date</label>
        <input
          id={endId}
          type="date"
          value={formatDate(endDate)}
          onChange={handleEndChange}
          min={formatDate(startDate)}
          aria-label="End date"
          className={cn(
            'px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm',
            'focus:border-forge-orange focus:outline-none focus:ring-2 focus:ring-forge-orange/30',
            'transition-all hover:border-white/20'
          )}
        />
      </div>
    </fieldset>
  );
}
