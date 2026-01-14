"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Badge } from '@/components/ui/Badge';

interface TagInputProps {
  label?: string;
  hint?: string;
  error?: string;
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  allowDuplicates?: boolean;
  normalize?: (tag: string) => string;
  validate?: (tag: string) => string | null;
  className?: string;
  disabled?: boolean;
}

const defaultNormalize = (tag: string) => tag.trim();

export function TagInput({
  label,
  hint,
  error,
  value,
  onChange,
  placeholder = 'Add a tag…',
  maxTags,
  allowDuplicates = false,
  normalize = defaultNormalize,
  validate,
  className,
  disabled = false,
}: TagInputProps) {
  const [draft, setDraft] = React.useState('');
  const [localError, setLocalError] = React.useState<string | null>(null);

  const canAddMore = typeof maxTags === 'number' ? value.length < maxTags : true;

  const tryAddTag = (raw: string) => {
    if (!canAddMore) return;

    const nextTag = normalize(raw);
    if (!nextTag) return;

    if (!allowDuplicates && value.some((t) => normalize(t).toLowerCase() === nextTag.toLowerCase())) {
      setLocalError('Tag already added.');
      return;
    }

    const validationError = validate?.(nextTag) ?? null;
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    setLocalError(null);
    onChange([...value, nextTag]);
    setDraft('');
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && <p className="text-white/80 font-medium text-sm">{label}</p>}

      <div
        className={cn(
          'rounded-xl border bg-white/5',
          'border-white/10',
          'px-3 py-2',
          'transition-all',
          'focus-within:border-forge-orange/50 focus-within:ring-2 focus-within:ring-forge-orange/20',
          disabled && 'opacity-60 pointer-events-none',
          (error || localError) && 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20'
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          {value.map((tag) => (
            <Badge key={tag} variant="default" className="bg-white/10 border-white/10">
              <span className="max-w-[220px] truncate">{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 rounded hover:bg-white/10 transition-colors p-0.5"
                aria-label={`Remove ${tag}`}
              >
                <svg className="w-3.5 h-3.5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </Badge>
          ))}

          <input
            type="text"
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              if (localError) setLocalError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                tryAddTag(draft);
              }
              if (e.key === 'Backspace' && draft === '' && value.length > 0) {
                // quick-remove last tag
                e.preventDefault();
                onChange(value.slice(0, -1));
              }
            }}
            onBlur={() => {
              if (draft.trim()) tryAddTag(draft);
            }}
            placeholder={canAddMore ? placeholder : 'Max tags reached'}
            className={cn(
              'flex-1 min-w-[160px] bg-transparent outline-none',
              'text-sm text-white placeholder:text-white/40',
              !canAddMore && 'cursor-not-allowed'
            )}
            disabled={disabled || !canAddMore}
          />
        </div>
      </div>

      {(error || localError) && <p className="text-sm text-red-400">{error || localError}</p>}
      {hint && !error && !localError && <p className="text-sm text-white/40">{hint}</p>}
      {typeof maxTags === 'number' && (
        <p className="text-xs text-white/30">{value.length}/{maxTags} tags</p>
      )}
    </div>
  );
}
