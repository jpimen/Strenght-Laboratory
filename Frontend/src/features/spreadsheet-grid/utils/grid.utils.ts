/**
 * Spreadsheet Grid Utilities
 * Configuration, calculations, and pure utility functions
 */

import type { CellPosition, SelectionRange, GridConfig } from '../types/grid.types';

// Configuration
export const GRID_CONFIG: GridConfig = {
  defaultRows: 20,
  defaultCols: 10,
  defaultCellWidth: 120,
  defaultCellHeight: 36,
  minCellWidth: 60,
  minCellHeight: 28,
};

// Cell Position Utilities
export const getCellId = (row: number, col: number): string => `cell-${row}-${col}`;

export const parseCellId = (id: string): CellPosition | null => {
  const match = id.match(/cell-(\d+)-(\d+)/);
  if (!match) return null;
  return { row: parseInt(match[1], 10), col: parseInt(match[2], 10) };
};

export const isSameCellPosition = (
  pos1: CellPosition | null,
  pos2: CellPosition | null
): boolean => {
  if (!pos1 || !pos2) return false;
  return pos1.row === pos2.row && pos1.col === pos2.col;
};

// Navigation Utilities
export const getNextCell = (
  current: CellPosition,
  direction: 'up' | 'down' | 'left' | 'right',
  maxRows: number,
  maxCols: number
): CellPosition | null => {
  const { row, col } = current;

  let newRow = row;
  let newCol = col;

  switch (direction) {
    case 'up':
      newRow = Math.max(0, row - 1);
      break;
    case 'down':
      newRow = Math.min(maxRows - 1, row + 1);
      break;
    case 'left':
      newCol = Math.max(0, col - 1);
      break;
    case 'right':
      newCol = Math.min(maxCols - 1, col + 1);
      break;
  }

  return { row: newRow, col: newCol };
};

// Selection Utilities
export const isInSelection = (
  cell: CellPosition,
  selection: SelectionRange | null
): boolean => {
  if (!selection) return false;

  const minRow = Math.min(selection.start.row, selection.end.row);
  const maxRow = Math.max(selection.start.row, selection.end.row);
  const minCol = Math.min(selection.start.col, selection.end.col);
  const maxCol = Math.max(selection.start.col, selection.end.col);

  return (
    cell.row >= minRow &&
    cell.row <= maxRow &&
    cell.col >= minCol &&
    cell.col <= maxCol
  );
};

export const normalizeSelection = (selection: SelectionRange): SelectionRange => {
  const startRow = Math.min(selection.start.row, selection.end.row);
  const startCol = Math.min(selection.start.col, selection.end.col);
  const endRow = Math.max(selection.start.row, selection.end.row);
  const endCol = Math.max(selection.start.col, selection.end.col);

  return {
    start: { row: startRow, col: startCol },
    end: { row: endRow, col: endCol },
  };
};

// Grid Initialization
export const initializeGrid = (rows: number, cols: number): string[][] => {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => '')
  );
};

// Formatting Utilities
export const getColumnLabel = (col: number): string => {
  let label = '';
  let num = col + 1;
  while (num > 0) {
    num--;
    label = String.fromCharCode(65 + (num % 26)) + label;
    num = Math.floor(num / 26);
  }
  return label;
};

export const getRowLabel = (row: number): string => `${row + 1}`;

// Grid Style Utilities
export const getGridTemplateColumns = (colWidth: number | number[], cols: number): string => {
  if (typeof colWidth === 'number') {
    return `40px ${Array(cols).fill(`${colWidth}px`).join(' ')}`;
  }
  return `40px ${colWidth.map(w => `${w}px`).join(' ')}`;
};

// Keyboard Utilities
export const isNavigationKey = (key: string): boolean => {
  return ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(key);
};

export const isEditKey = (key: string): boolean => {
  return key.length === 1 && /[a-zA-Z0-9\s\-_=+*/.():]/.test(key);
};
