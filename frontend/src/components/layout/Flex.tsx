"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface FlexProps {
  children: React.ReactNode;
  direction?: 'row' | 'col';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  wrap?: boolean;
  gap?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

const DIRECTION_CLASSES = {
  row: 'flex-row',
  col: 'flex-col',
};

const ALIGN_CLASSES = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
};

const JUSTIFY_CLASSES = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
};

const GAP_CLASSES = {
  none: 'gap-0',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
};

export function Flex({
  children,
  direction = 'row',
  align = 'start',
  justify = 'start',
  wrap = false,
  gap = 'md',
  className,
}: FlexProps) {
  return (
    <div
      className={cn(
        'flex',
        DIRECTION_CLASSES[direction],
        ALIGN_CLASSES[align],
        JUSTIFY_CLASSES[justify],
        GAP_CLASSES[gap],
        wrap && 'flex-wrap',
        className
      )}
    >
      {children}
    </div>
  );
}
