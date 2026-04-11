import { ColumnDefinition } from "../types/table.types";

const ROW_NUMBER_WIDTH = 40;

const getColumnMinWidth = (columnId: string) => {
  if (columnId === "exercise") return 340;
  if (columnId === "notes") return 320;
  if (columnId === "load") return 200;
  return 140;
};

export const getGridStyle = (columns: ColumnDefinition[]) => {
  const minWidth =
    ROW_NUMBER_WIDTH +
    columns.reduce((total, column) => total + getColumnMinWidth(column.id), 0);

  const gridTemplateColumns = `40px ${columns
    .map((column) => `minmax(${getColumnMinWidth(column.id)}px, ${column.width})`)
    .join(" ")}`;

  return {
    minWidth: `${minWidth}px`,
    gridTemplateColumns,
  };
};
