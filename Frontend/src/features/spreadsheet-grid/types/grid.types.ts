/**
 * Spreadsheet Grid Types
 * Core data structures for the editable grid component
 */

export interface CellValue {
  value: string;
  isFormula?: boolean;
}

export interface GridCell extends CellValue {
  row: number;
  col: number;
}

export interface CellPosition {
  row: number;
  col: number;
}

export interface SelectionRange {
  start: CellPosition;
  end: CellPosition;
}

export interface GridState {
  data: string[][]; // 2D array of cell values
  rows: number;
  cols: number;
  activeCell: CellPosition | null;
  isEditing: boolean;
  editingValue: string;
  selection: SelectionRange | null;
  clipboard: string | null;
}

export interface GridConfig {
  defaultRows: number;
  defaultCols: number;
  defaultCellWidth: number;
  defaultCellHeight: number;
  minCellWidth: number;
  minCellHeight: number;
}
