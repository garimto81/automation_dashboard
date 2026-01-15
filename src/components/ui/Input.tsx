/**
 * Input Component
 *
 * Reusable text input with dark theme
 */

import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({
  label,
  error,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={[
          'w-full px-4 py-2 bg-broadcast-bg border border-broadcast-border rounded text-sm text-white placeholder-gray-500',
          'focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error ? 'border-red-500' : '',
          className
        ].filter(Boolean).join(' ')}
        data-testid="input"
        {...props}
      />
      {error && (
        <p className="text-xs text-red-400" data-testid="input-error">
          {error}
        </p>
      )}
    </div>
  );
}
