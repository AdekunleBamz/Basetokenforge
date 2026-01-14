"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Badge } from '@/components/ui/Badge';

interface ComingSoonBadgeProps {
  label?: string;
  className?: string;
}

export function ComingSoonBadge({
  label = 'Coming Soon',
  className,
}: ComingSoonBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        'bg-gradient-to-r from-purple-500/20 to-blue-500/20',
        'border-purple-500/30 text-purple-300',
        'animate-pulse',
        className
      )}
    >
      {label}
    </Badge>
  );
}
