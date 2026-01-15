/**
 * FieldRow Component
 *
 * Individual field mapping row in the slot mapping table
 */

import React from 'react';
import type { FieldMapping } from '@/types';
import { Badge } from '@/components/ui';

export interface FieldRowProps {
  field: FieldMapping;
  slotIndex: number;
  onUpdate: (updates: Partial<FieldMapping>) => void;
  isSelected: boolean;
  onSelect: () => void;
}

const transformColors: Record<string, 'warning' | 'success' | 'default'> = {
  UPPER: 'warning',
  LOWER: 'warning',
  format_chips: 'success',
  format_bbs: 'success',
  format_flag: 'success',
  format_rank: 'success',
  format_money: 'success',
  format_time: 'success',
  direct: 'default',
  custom: 'primary'
};

export function FieldRow({ field, slotIndex, onUpdate, isSelected, onSelect }: FieldRowProps) {
  return (
    <tr
      className={[
        'hover:bg-broadcast-bg transition-colors cursor-pointer',
        isSelected ? 'bg-blue-600/10 border-l-2 border-blue-500' : ''
      ].filter(Boolean).join(' ')}
      onClick={onSelect}
      data-testid="field-row"
    >
      {/* Slot Index */}
      {field.slotIndex === slotIndex && (
        <td className="px-3 py-3" rowSpan={4}>
          <span
            className="inline-flex items-center justify-center w-6 h-6 bg-blue-600/20 text-blue-400 rounded-full text-xs font-bold"
            data-testid="slot-badge"
          >
            {slotIndex}
          </span>
        </td>
      )}

      {/* Field Key */}
      <td className="px-3 py-3">
        <div className="text-white font-medium text-sm" data-testid="field-key">
          {field.targetFieldKey}
        </div>
      </td>

      {/* Source */}
      <td className="px-3 py-3">
        <div className="text-xs text-gray-400" data-testid="field-source">
          {field.sourceTable}.{field.sourceColumn}
        </div>
      </td>

      {/* Transform */}
      <td className="px-3 py-3">
        <Badge
          variant={transformColors[field.transform] || 'default'}
          data-testid="transform-badge"
        >
          {field.transform}
        </Badge>
      </td>

      {/* Preview */}
      <td className="px-3 py-3">
        <div className="font-mono text-xs text-white" data-testid="preview-value">
          {field.currentValue || '-'}
        </div>
      </td>
    </tr>
  );
}
