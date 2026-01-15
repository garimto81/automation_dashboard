/**
 * FieldMapper Component
 *
 * Scrollable field mapping table with all slots and fields
 */

import React from 'react';
import type { FieldMapping } from '@/types';
import { FieldRow } from './FieldRow';

export interface FieldMapperProps {
  fields: FieldMapping[];
  selectedFieldId: string | null;
  onFieldSelect: (fieldId: string | null) => void;
  onFieldUpdate: (fieldId: string, updates: Partial<FieldMapping>) => void;
}

export function FieldMapper({
  fields,
  selectedFieldId,
  onFieldSelect,
  onFieldUpdate
}: FieldMapperProps) {
  // Group fields by slot index
  const fieldsBySlot = fields.reduce((acc, field) => {
    const slotIndex = field.slotIndex || 0;
    if (!acc[slotIndex]) {
      acc[slotIndex] = [];
    }
    acc[slotIndex].push(field);
    return acc;
  }, {} as Record<number, FieldMapping[]>);

  const sortedSlots = Object.keys(fieldsBySlot)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="overflow-y-auto scrollbar-thin" style={{ maxHeight: 'calc(100vh - 320px)' }} data-testid="field-mapper">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-broadcast-bg border-b border-broadcast-border">
          <tr className="text-left">
            <th className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase">Slot</th>
            <th className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase">Field Key</th>
            <th className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase">Source</th>
            <th className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase">Transform</th>
            <th className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase">Preview</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-broadcast-border">
          {sortedSlots.map((slotIndex) => {
            const slotFields = fieldsBySlot[slotIndex];
            return slotFields.map((field, index) => (
              <FieldRow
                key={field.fieldId}
                field={field}
                slotIndex={slotIndex}
                onUpdate={(updates) => onFieldUpdate(field.fieldId, updates)}
                isSelected={field.fieldId === selectedFieldId}
                onSelect={() => onFieldSelect(field.fieldId)}
              />
            ));
          })}
        </tbody>
      </table>
    </div>
  );
}
