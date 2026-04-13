/**
 * Spreadsheet Grid Feature - Public API
 * Export all public components, hooks, and utilities
 */

// Components
export { SpreadsheetGrid } from './components/SpreadsheetGrid';
export { EditableCell } from './components/EditableCell';
export { GridColumnHeader, GridRowHeader } from './components/GridHeader';

// Hooks
export { useGridKeyboard } from './hooks/useGridKeyboard';
export { useGridCellInteraction } from './hooks/useGridCellInteraction';

// Store
export { useGridStore } from './store/gridStore';
export type { GridStore } from './store/gridStore';

// Utils
export {
  GRID_CONFIG,
  getCellId,
  parseCellId,
  isSameCellPosition,
  getNextCell,
  isInSelection,
  normalizeSelection,
  initializeGrid,
  getColumnLabel,
  getRowLabel,
  getGridTemplateColumns,
  isNavigationKey,
  isEditKey,
} from './utils/grid.utils';

// Types
export type {
  CellValue,
  GridCell,
  CellPosition,
  SelectionRange,
  GridState,
  GridConfig,
} from './types/grid.types';
