'use client';

import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import React from 'react';

interface SummaryCardProps extends Omit<NextLinkProps, 'className'> {
  href: string;
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
  /** Optional custom background (e.g. a gradient) */
  bg?: string;
}

export default function SummaryCard({
  href,
  title,
  value,
  icon,
  className = '',
  bg,
  ...linkProps
}: SummaryCardProps) {
  const defaultBg = 'bg-[var(--background)] dark:bg-[var(--chart-background)]';
  const containerBg = bg || defaultBg;

  return (
    <NextLink
      href={href}
      className={`
        w-full flex items-center space-x-5
        rounded-2xl shadow-xl p-6
        transform transition-transform duration-300
        hover:scale-105 hover:shadow-2xl
        border border-[var(--primary)]/20 dark:border-[var(--secondary)]/20
        ${containerBg} ${className}
      `}
      {...linkProps}
    >
      {icon && (
        <div className="
          flex-shrink-0 p-3 rounded-full
          bg-[var(--accent)]/20 dark:bg-[var(--accent)]/30
          text-[var(--accent)] text-2xl
        ">
          {icon}
        </div>
      )}

      <div className="flex-1">
        <div className="text-sm font-semibold text-[var(--secondary)] uppercase">
          {title}
        </div>
        <div className="mt-1 text-3xl font-extrabold text-[var(--primary)]">
          {value}
        </div>
      </div>
    </NextLink>
  );
}
