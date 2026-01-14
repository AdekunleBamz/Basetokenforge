"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
  className?: string;
}

export function NavLink({
  href,
  children,
  isActive = false,
  className,
}: NavLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        'relative px-4 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'text-forge-orange'
          : 'text-white/70 hover:text-white',
        className
      )}
    >
      {children}
      {isActive && (
        <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-forge-orange rounded-full" />
      )}
    </a>
  );
}

interface NavLinksProps {
  links: Array<{ href: string; label: string }>;
  activeHref?: string;
  className?: string;
}

export function NavLinks({ links, activeHref, className }: NavLinksProps) {
  return (
    <nav className={cn('flex items-center gap-1', className)}>
      {links.map((link) => (
        <NavLink key={link.href} href={link.href} isActive={link.href === activeHref}>
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
