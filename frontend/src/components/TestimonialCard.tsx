"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface TestimonialCardProps {
  quote: string;
  author: string;
  role?: string;
  avatar?: string;
  className?: string;
}

export function TestimonialCard({
  quote,
  author,
  role,
  avatar,
  className,
}: TestimonialCardProps) {
  return (
    <div
      className={cn(
        'p-6 rounded-2xl bg-white/5 border border-white/10',
        'hover:border-white/20 transition-colors',
        className
      )}
    >
      <svg
        className="w-8 h-8 text-forge-orange/40 mb-4"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
      </svg>
      <p className="text-white/80 text-lg leading-relaxed mb-6">{quote}</p>
      <div className="flex items-center gap-3">
        {avatar ? (
          <img
            src={avatar}
            alt={author}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-forge-orange to-yellow-500 flex items-center justify-center text-white font-bold">
            {author.charAt(0)}
          </div>
        )}
        <div>
          <p className="font-medium text-white">{author}</p>
          {role && <p className="text-sm text-white/40">{role}</p>}
        </div>
      </div>
    </div>
  );
}
