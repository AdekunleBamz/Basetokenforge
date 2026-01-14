"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface DataTableColumn<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyMessage = 'No data available',
  className,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className={cn('rounded-xl bg-white/5 border border-white/10 overflow-hidden', className)}>
        <div className="animate-pulse">
          <div className="h-12 bg-white/5 border-b border-white/10" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 border-b border-white/10 last:border-0" />
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={cn('rounded-xl bg-white/5 border border-white/10 p-8 text-center', className)}>
        <p className="text-white/40">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn('rounded-xl bg-white/5 border border-white/10 overflow-hidden', className)}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn('px-4 py-3 text-left text-sm font-medium text-white/60', col.className)}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={keyExtractor(item)} className="border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className={cn('px-4 py-4 text-sm text-white', col.className)}>
                  {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
