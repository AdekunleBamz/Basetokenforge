"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { IconGithub, IconTwitter, IconDiscord } from '@/components/icons/social';
import { SOCIAL_LINKS } from '@/lib/constants';

interface SocialLinksProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 16,
  md: 20,
  lg: 24,
};

export function SocialLinks({ className, size = 'md' }: SocialLinksProps) {
  const iconSize = sizeStyles[size];

  return (
    <div className={cn('flex items-center gap-4', className)}>
      <a
        href={SOCIAL_LINKS.github}
        target="_blank"
        rel="noopener noreferrer"
        className="text-white/50 hover:text-white transition-colors"
        aria-label="GitHub"
      >
        <IconGithub size={iconSize} />
      </a>
      <a
        href={SOCIAL_LINKS.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="text-white/50 hover:text-white transition-colors"
        aria-label="Twitter"
      >
        <IconTwitter size={iconSize} />
      </a>
      <a
        href={SOCIAL_LINKS.discord}
        target="_blank"
        rel="noopener noreferrer"
        className="text-white/50 hover:text-white transition-colors"
        aria-label="Discord"
      >
        <IconDiscord size={iconSize} />
      </a>
    </div>
  );
}
