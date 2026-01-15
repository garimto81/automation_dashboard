/**
 * Badge Component
 *
 * Status badge with variants
 */

import React from 'react';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger';

export interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-gray-600/20 text-gray-400',
  primary: 'bg-blue-600/20 text-blue-400',
  success: 'bg-green-600/20 text-green-400',
  warning: 'bg-yellow-600/20 text-yellow-400',
  danger: 'bg-red-600/20 text-red-400'
};

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  const classes = [
    'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
    variantClasses[variant],
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={classes} data-testid="badge">
      {children}
    </span>
  );
}
