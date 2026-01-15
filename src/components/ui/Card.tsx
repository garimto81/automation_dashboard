/**
 * Card Component
 *
 * Container card with dark theme
 */

import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

export function Card({ children, className = '', padding = true }: CardProps) {
  const classes = [
    'bg-broadcast-panel rounded-lg border border-broadcast-border',
    padding ? 'p-4' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} data-testid="card">
      {children}
    </div>
  );
}
