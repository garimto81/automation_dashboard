/**
 * Select Component
 *
 * Reusable select dropdown with dark theme
 */

import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export function Select({
  label,
  options,
  error,
  className = '',
  id,
  ...props
}: SelectProps) {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={[
          'w-full px-3 py-2 bg-broadcast-bg border border-broadcast-border rounded text-sm text-white',
          'focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error ? 'border-red-500' : '',
          className
        ].filter(Boolean).join(' ')}
        data-testid="select"
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-red-400" data-testid="select-error">
          {error}
        </p>
      )}
    </div>
  );
}
