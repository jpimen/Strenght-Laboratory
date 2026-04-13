'use client';

import React, { useEffect, useState } from 'react';
import { useGridStore } from '../store/gridStore';
import { useGridKeyboard } from '../hooks/useGridKeyboard';
import { EditableCell } from './EditableCell';
import { GridColumnHeader, GridRowHeader } from './GridHeader';
import { GRID_CONFIG } from '../utils/grid.utils';

interface SpreadsheetGridProps {
  rows?: number;
  cols?: number;
  onDataChange?: (data: string[][]) => void;
}

export const SpreadsheetGrid: React.FC<SpreadsheetGridProps> = ({
  rows = GRID_CONFIG.defaultRows,
  cols = GRID_CONFIG.defaultCols,
  onDataChange,
}) => {
  // Subscribe to store to ensure re-renders on ANY state change
  const storeState = useGridStore();
  const { data, activeCell, isEditing, _hasRehydrated } = storeState as any;
  const [hasHydrated, setHydrated] = useState(false);

  // Keyboard navigation setup
  useGridKeyboard();

  // Wait for Zustand to rehydrate from localStorage
  useEffect(() => {
    if (_hasRehydrated) {
      setHydrated(true);
    }
  }, [_hasRehydrated]);

  // Notify parent of data changes
  useEffect(() => {
    if (hasHydrated && onDataChange && data && data.length > 0) {
      onDataChange(data);
    }
  }, [data, hasHydrated, onDataChange]);

  // Show loading only if not yet rehydrated
  if (!hasHydrated || !data || data.length === 0) {
    return (
      <div className="w-full h-full bg-[#0d0d0d] flex items-center justify-center text-[#666]">
        Loading grid data...
      </div>
    );
  }

  const gridRows = Math.min(rows, data.length);
  const gridCols = Math.min(cols, data[0]?.length ?? 0);

  return (
    <div className="w-full h-full bg-[#0d0d0d] text-[#e0e0e0] flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="px-4 py-3 border-b border-[#222] bg-[#111] flex items-center gap-2 shrink-0">
        <h1 className="text-sm font-bold text-[#facc15] font-mono">
          SPREADSHEET GRID
        </h1>
        {activeCell && (
          <span className="text-xs text-[#888] font-mono">
            Row {activeCell.row + 1} • Col {activeCell.col + 1}
            {isEditing && ' • Editing'}
          </span>
        )}
      </div>

      {/* Grid Container */}
      <div className="flex-1 overflow-auto relative">
        <div
          className="inline-grid bg-[#0d0d0d]"
          style={{
            gridTemplateColumns: `40px ${Array(gridCols)
              .fill(GRID_CONFIG.defaultCellWidth)
              .map((w) => `${w}px`)
              .join(' ')}`,
            gridTemplateRows: `auto ${Array(gridRows)
              .fill(GRID_CONFIG.defaultCellHeight)
              .map((h) => `${h}px`)
              .join(' ')}`,
            minWidth: '100%',
            minHeight: '100%',
          }}
        >
          {/* Column Headers */}
          <GridColumnHeader cols={gridCols} />

          {/* Rows */}
          {Array.from({ length: gridRows }).map((_, row) => (
            <React.Fragment key={`row-${row}`}>
              {/* Row Header */}
              <GridRowHeader row={row} />

              {/* Row Cells */}
              {Array.from({ length: gridCols }).map((_, col) => (
                <EditableCell
                  key={`cell-${row}-${col}`}
                  row={row}
                  col={col}
                  value={data[row]?.[col] ?? ''}
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 border-t border-[#222] bg-[#111] text-xs text-[#888] font-mono shrink-0">
        <div className="flex justify-between">
          <span>
            Grid: {gridRows}×{gridCols}
          </span>
          <span>
            💡 Click to select • Double-click to edit • Arrow keys to navigate • Enter to save
          </span>
        </div>
      </div>
    </div>
  );
};
