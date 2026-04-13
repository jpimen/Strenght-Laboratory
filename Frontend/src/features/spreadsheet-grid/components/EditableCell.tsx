'use client';

import React, { useRef, useEffect } from 'react';
import { useGridStore } from '../store/gridStore';
import { useGridCellInteraction } from '../hooks/useGridCellInteraction';
import { getCellId, isSameCellPosition, isInSelection } from '../utils/grid.utils';
import type { CellPosition } from '../types/grid.types';

interface EditableCellProps {
  row: number;
  col: number;
  value: string;
}

export const EditableCell: React.FC<EditableCellProps> = ({ row, col, value }) => {
  const {
    activeCell,
    isEditing,
    editingValue,
    selection,
    updateEditValue,
    saveEdit,
    cancelEdit,
  } = useGridStore();

  const { handleCellClick } = useGridCellInteraction();
  const inputRef = useRef<HTMLInputElement>(null);
  const cellRef = useRef<HTMLDivElement>(null);

  const isActive = isSameCellPosition(activeCell, { row, col });
  const isInCurrentEdit = isActive && isEditing;
  const isSelected = isInSelection({ row, col }, selection);
  const displayValue = isInCurrentEdit ? editingValue : value;

  // Focus input when entering edit mode
  useEffect(() => {
    if (isInCurrentEdit && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isInCurrentEdit, isActive]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateEditValue(e.target.value);
  };

  const handleInputBlur = () => {
    // Immediately save on blur to prevent data loss
    saveEdit();
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      saveEdit();
      // Navigation handled by useGridKeyboard
    }
  };

  return (
    <div
      ref={cellRef}
      id={getCellId(row, col)}
      onClick={() => handleCellClick(row, col)}
      className={`
        relative w-full h-full flex items-center
        border-r border-b border-[#333]
        transition-all duration-75
        ${isActive ? 'ring-2 ring-blue-500 ring-inset' : 'hover:bg-[#1a1a1a]'}
        ${isSelected && !isActive ? 'bg-blue-500 bg-opacity-10' : ''}
        cursor-cell
      `}
    >
      {isInCurrentEdit ? (
        <input
          ref={inputRef}
          type="text"
          value={editingValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          className={`
            absolute inset-0 w-full h-full px-2 py-1
            bg-[#1a1a1a] text-white text-sm
            border-none outline-none
            font-mono
          `}
          style={{
            zIndex: 10,
          }}
        />
      ) : (
        <div
          className={`
            w-full h-full px-2 py-1 flex items-center
            text-sm font-mono overflow-hidden text-ellipsis whitespace-nowrap
            ${displayValue ? 'text-white' : 'text-gray-500'}
          `}
          title={displayValue}
        >
          {displayValue || '...'}
        </div>
      )}
    </div>
  );
};
