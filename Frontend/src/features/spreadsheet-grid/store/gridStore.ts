/**
 * Spreadsheet Grid Store
 * Central state management using Zustand with persistence
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  GridState,
  CellPosition,
  SelectionRange,
} from '../types/grid.types';
import { GRID_CONFIG, initializeGrid, isSameCellPosition } from '../utils/grid.utils';

interface GridStoreActions {
  // Cell Operations
  setCellValue: (row: number, col: number, value: string) => void;
  getCellValue: (row: number, col: number) => string;
  insertRow: (afterRow: number) => void;
  insertColumn: (afterCol: number) => void;
  deleteRow: (row: number) => void;
  deleteColumn: (col: number) => void;
  clearCell: (row: number, col: number) => void;
  clearSelection: () => void;

  // Selection & Active Cell
  setActiveCell: (row: number, col: number) => void;
  clearActiveCell: () => void;
  setSelection: (selection: SelectionRange) => void;
  clearSelection: () => void;
  extendSelection: (to: CellPosition) => void;

  // Edit Mode
  startEdit: (row: number, col: number, initialValue?: string) => void;
  updateEditValue: (value: string) => void;
  saveEdit: () => void;
  cancelEdit: () => void;

  // Clipboard
  copy: () => void;
  paste: (row: number, col: number) => void;
  cut: () => void;

  // Undo/Redo
  clear: () => void;
  reset: () => void;
}

export type GridStore = GridState & GridStoreActions;

const createInitialState = (): GridState => ({
  data: initializeGrid(GRID_CONFIG.defaultRows, GRID_CONFIG.defaultCols),
  rows: GRID_CONFIG.defaultRows,
  cols: GRID_CONFIG.defaultCols,
  activeCell: null,
  isEditing: false,
  editingValue: '',
  selection: null,
  clipboard: null,
});

interface GridStoreWithRehydrate extends GridStore {
  _hasRehydrated: boolean;
  setRehydrated: () => void;
}

export const useGridStore = create<GridStoreWithRehydrate>()(
  persist(
    (set, get) => ({
      ...createInitialState(),
      _hasRehydrated: false,
      setRehydrated: () => set({ _hasRehydrated: true }),

      // Cell Operations
      setCellValue: (row: number, col: number, value: string) => {
        set((state) => {
          const newData = state.data.map((r) => [...r]);
          if (newData[row]) {
            newData[row][col] = value;
          }
          return { data: newData };
        });
      },

      getCellValue: (row: number, col: number) => {
        const state = get();
        return state.data[row]?.[col] ?? '';
      },

      insertRow: (afterRow: number) => {
        set((state) => {
          const newRow = Array(state.cols).fill('');
          const newData = [
            ...state.data.slice(0, afterRow + 1),
            newRow,
            ...state.data.slice(afterRow + 1),
          ];
          return { data: newData, rows: state.rows + 1 };
        });
      },

      insertColumn: (afterCol: number) => {
        set((state) => {
          const newData = state.data.map((row) => [
            ...row.slice(0, afterCol + 1),
            '',
            ...row.slice(afterCol + 1),
          ]);
          return { data: newData, cols: state.cols + 1 };
        });
      },

      deleteRow: (row: number) => {
        set((state) => {
          if (state.rows <= 1) return state;
          const newData = state.data.filter((_, i) => i !== row);
          return { data: newData, rows: state.rows - 1 };
        });
      },

      deleteColumn: (col: number) => {
        set((state) => {
          if (state.cols <= 1) return state;
          const newData = state.data.map((row) =>
            row.filter((_, i) => i !== col)
          );
          return { data: newData, cols: state.cols - 1 };
        });
      },

      clearCell: (row: number, col: number) => {
        get().setCellValue(row, col, '');
      },

      // Selection & Active Cell
      setActiveCell: (row: number, col: number) => {
        set({
          activeCell: { row, col },
          isEditing: false,
          editingValue: '',
          selection: null,
        });
      },

      clearActiveCell: () => {
        set({ activeCell: null });
      },

      setSelection: (selection: SelectionRange) => {
        set({ selection });
      },

      extendSelection: (to: CellPosition) => {
        set((state) => {
          if (!state.activeCell) return state;
          return {
            selection: {
              start: state.activeCell,
              end: to,
            },
          };
        });
      },

      // Edit Mode
      startEdit: (row: number, col: number, initialValue?: string) => {
        const state = get();
        if (!isSameCellPosition(state.activeCell, { row, col })) {
          set({ activeCell: { row, col } });
        }

        const cellValue = initialValue ?? state.getCellValue(row, col);
        set({
          isEditing: true,
          editingValue: cellValue,
        });
      },

      updateEditValue: (value: string) => {
        set({ editingValue: value });
      },

      saveEdit: () => {
        const state = get();
        if (!state.activeCell) return;

        const { row, col } = state.activeCell;
        const value = state.editingValue;

        // Update data first
        const newData = state.data.map((r) => [...r]);
        if (newData[row]) {
          newData[row][col] = value;
        }

        // Save all state at once to avoid race conditions
        set({
          data: newData,
          isEditing: false,
          editingValue: '',
        });
      },

      cancelEdit: () => {
        set({
          isEditing: false,
          editingValue: '',
        });
      },

      // Clipboard
      copy: () => {
        const state = get();
        if (!state.activeCell) return;
        const value = state.getCellValue(state.activeCell.row, state.activeCell.col);
        set({ clipboard: value });
      },

      paste: (row: number, col: number) => {
        const state = get();
        if (state.clipboard === null) return;
        state.setCellValue(row, col, state.clipboard);
      },

      cut: () => {
        const state = get();
        if (!state.activeCell) return;
        const value = state.getCellValue(state.activeCell.row, state.activeCell.col);
        set({ clipboard: value });
        state.clearCell(state.activeCell.row, state.activeCell.col);
      },

      // Reset
      clear: () => {
        set(createInitialState());
      },

      reset: () => {
        set(createInitialState());
      },
    }),
    {
      name: 'spreadsheet-grid-store',
      version: 1,
      onRehydrateStorage: () => (state, error) => {
        if (state) {
          // Mark as rehydrated after localStorage data is loaded
          state.setRehydrated();
        }
      },
    }
  )
);
