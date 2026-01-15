/**
 * SlotMappingPanel Component
 *
 * Main slot mapping panel with data source selector and field mapper
 */

import React from 'react';
import { useSlotMappingStore } from '@/stores/slotMappingStore';
import { DataSourceSelector } from './DataSourceSelector';
import { FieldMapper } from './FieldMapper';
import { Button, Card } from '@/components/ui';

export function SlotMappingPanel() {
  const {
    selectedComposition,
    dataSource,
    selectedFieldId,
    isDirty,
    setDataSource,
    selectField,
    updateMapping,
    saveMapping,
    refreshPreview
  } = useSlotMappingStore();

  const handleSave = async () => {
    await saveMapping();
  };

  const handleRefresh = async () => {
    await refreshPreview();
  };

  if (!selectedComposition) {
    return (
      <Card className="flex items-center justify-center h-full" data-testid="no-composition">
        <div className="text-center">
          <svg className="w-12 h-12 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
          </svg>
          <p className="text-gray-400">Select a composition to view slot mapping</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-full" data-testid="slot-mapping-panel">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Slot Mapping</h2>
          <p className="text-xs text-gray-400 mt-1">
            {selectedComposition.compositionName} - {selectedComposition.totalSlots} slots
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {/* Data Source Selector */}
          <DataSourceSelector
            value={dataSource}
            onChange={setDataSource}
            disabled={false}
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRefresh}
            data-testid="refresh-preview-btn"
          >
            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={!isDirty}
            data-testid="save-mapping-btn"
          >
            Save Mapping
          </Button>
        </div>
      </div>

      {/* Field Mapping Table */}
      <FieldMapper
        fields={selectedComposition.fields}
        selectedFieldId={selectedFieldId}
        onFieldSelect={selectField}
        onFieldUpdate={updateMapping}
      />
    </Card>
  );
}
