/**
 * DataSourceSelector Component
 *
 * Data source selection dropdown (GFX / WSOP+ / Manual / Unified)
 */

import React from 'react';
import type { DataSourceType } from '@/types';
import { Select } from '@/components/ui';

export interface DataSourceSelectorProps {
  value: DataSourceType;
  onChange: (source: DataSourceType) => void;
  disabled?: boolean;
}

const dataSourceOptions = [
  { value: 'gfx', label: 'GFX JSON DB' },
  { value: 'wsop_plus', label: 'WSOP+ DB' },
  { value: 'manual', label: 'Manual DB' },
  { value: 'unified', label: 'Unified View' }
];

export function DataSourceSelector({ value, onChange, disabled }: DataSourceSelectorProps) {
  return (
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value as DataSourceType)}
      options={dataSourceOptions}
      disabled={disabled}
      data-testid="data-source-selector"
    />
  );
}
