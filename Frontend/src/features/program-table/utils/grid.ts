import { ColumnDefinition } from "../types/table.types";

export const ROW_NUMBER_WIDTH = 40;
export const DEFAULT_ROW_HEIGHT = 44;
export const MIN_ROW_HEIGHT = 28;
export const MIN_COLUMN_WIDTH = 80;

export const getDefaultColumnWidth = (columnId: string) => {
  if (columnId === "exercise") return 360;
  if (columnId === "notes") return 360;
  if (columnId === "load") return 220;
  return 150;
};

export const getColumnWidth = (column: ColumnDefinition) => {
  if (typeof column.width === "number") {
    return Math.max(MIN_COLUMN_WIDTH, column.width);
  }

  if (typeof column.width === "string") {
    const trimmed = column.width.trim();

    if (trimmed.endsWith("px")) {
      const px = Number.parseFloat(trimmed.replace("px", ""));
      if (!Number.isNaN(px)) return Math.max(MIN_COLUMN_WIDTH, px);
    }

    if (trimmed.endsWith("fr")) {
      const fr = Number.parseFloat(trimmed.replace("fr", ""));
      if (!Number.isNaN(fr)) {
        return Math.max(MIN_COLUMN_WIDTH, Math.round(fr * 140));
      }
    }

    const numeric = Number.parseFloat(trimmed);
    if (!Number.isNaN(numeric)) return Math.max(MIN_COLUMN_WIDTH, numeric);
  }

  return getDefaultColumnWidth(column.id);
};

export const getGridStyle = (columns: ColumnDefinition[]) => {
  const minWidth =
    ROW_NUMBER_WIDTH +
    columns.reduce((total, column) => total + getColumnWidth(column), 0);

  const gridTemplateColumns = `${ROW_NUMBER_WIDTH}px ${columns.map((column) => `${getColumnWidth(column)}px`).join(" ")}`;

  return {
    minWidth: `${minWidth}px`,
    gridTemplateColumns,
  };
};
