"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface CellPos {
  x: number;
  y: number;
}

interface ColumnDef {
  id: string;
  width: number;
}

interface RowDef {
  id: string;
  height: number;
}

interface ColumnResizeState {
  columnId: string;
  startX: number;
  startWidth: number;
}

interface RowResizeState {
  rowId: string;
  startY: number;
  startHeight: number;
}

interface EditingCell extends CellPos {
  value: string;
  originalValue: string;
}

const ROW_HEADER_WIDTH = 40;
const COLUMN_HEADER_HEIGHT = 25;
const DEFAULT_COLUMN_WIDTH = 100;
const DEFAULT_ROW_HEIGHT = 25;
const MIN_COLUMN_WIDTH = 64;
const MIN_ROW_HEIGHT = 20;
const INITIAL_COLUMN_COUNT = 100;
const INITIAL_ROW_COUNT = 100;

const getColumnLabel = (index: number) => {
  let label = "";
  let value = index + 1;

  while (value > 0) {
    const remainder = (value - 1) % 26;
    label = String.fromCharCode(65 + remainder) + label;
    value = Math.floor((value - 1) / 26);
  }

  return label;
};

const createInitialColumns = (count: number): ColumnDef[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `col-${i + 1}`,
    width: DEFAULT_COLUMN_WIDTH,
  }));

const createInitialRows = (count: number): RowDef[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `row-${i + 1}`,
    height: DEFAULT_ROW_HEIGHT,
  }));

const measureTextWidth = (text: string) => {
  if (typeof document === "undefined") return Math.max(16, text.length * 7);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return Math.max(16, text.length * 7);
  context.font = "12px Arial";
  return Math.ceil(context.measureText(text || " ").width);
};

export const SpreadsheetGrid = () => {
  const [columns, setColumns] = useState<ColumnDef[]>(() => createInitialColumns(INITIAL_COLUMN_COUNT));
  const [rows, setRows] = useState<RowDef[]>(() => createInitialRows(INITIAL_ROW_COUNT));
  const [cellValues, setCellValues] = useState<Record<string, string>>({});
  const [selectionStart, setSelectionStart] = useState<CellPos>({ x: 0, y: 0 });
  const [selectionEnd, setSelectionEnd] = useState<CellPos>({ x: 0, y: 0 });
  const [activeCell, setActiveCell] = useState<CellPos>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [columnResizeState, setColumnResizeState] = useState<ColumnResizeState | null>(null);
  const [rowResizeState, setRowResizeState] = useState<RowResizeState | null>(null);
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);

  const gridRef = useRef<HTMLDivElement>(null);
  const skipBlurCommitRef = useRef(false);

  const columnLabels = useMemo(() => columns.map((_, i) => getColumnLabel(i)), [columns]);
  const rowNumbers = useMemo(() => rows.map((_, i) => i + 1), [rows]);

  const columnOffsets = useMemo(() => {
    const offsets = [0];
    columns.forEach((column) => offsets.push(offsets[offsets.length - 1] + column.width));
    return offsets;
  }, [columns]);

  const rowOffsets = useMemo(() => {
    const offsets = [0];
    rows.forEach((row) => offsets.push(offsets[offsets.length - 1] + row.height));
    return offsets;
  }, [rows]);

  const cellKey = (x: number, y: number) => `${x}:${y}`;
  const getCellValue = (x: number, y: number) => cellValues[cellKey(x, y)] ?? "";

  const clampCell = useCallback(
    (cell: CellPos): CellPos => ({
      x: Math.min(Math.max(cell.x, 0), Math.max(0, columns.length - 1)),
      y: Math.min(Math.max(cell.y, 0), Math.max(0, rows.length - 1)),
    }),
    [columns.length, rows.length]
  );

  const selectSingleCell = useCallback(
    (cell: CellPos) => {
      const clamped = clampCell(cell);
      setActiveCell(clamped);
      setSelectionStart(clamped);
      setSelectionEnd(clamped);
    },
    [clampCell]
  );

  const startEditing = (cell: CellPos) => {
    const clamped = clampCell(cell);
    const value = getCellValue(clamped.x, clamped.y);
    setEditingCell({
      ...clamped,
      value,
      originalValue: value,
    });
    selectSingleCell(clamped);
    gridRef.current?.focus();
  };

  const finishEditing = (commit: boolean, move?: "down" | "right") => {
    if (!editingCell) return;

    const sourceCell = { x: editingCell.x, y: editingCell.y };
    if (commit) {
      const key = cellKey(editingCell.x, editingCell.y);
      const nextValue = editingCell.value;
      setCellValues((prev) => ({
        ...prev,
        [key]: nextValue,
      }));
    }

    setEditingCell(null);

    let nextCell = sourceCell;
    if (move === "down") nextCell = { x: sourceCell.x, y: sourceCell.y + 1 };
    if (move === "right") nextCell = { x: sourceCell.x + 1, y: sourceCell.y };
    selectSingleCell(nextCell);
    gridRef.current?.focus();
  };

  const getCellReference = (start: CellPos, end: CellPos) => {
    const minX = Math.min(start.x, end.x);
    const maxX = Math.max(start.x, end.x);
    const minY = Math.min(start.y, end.y);
    const maxY = Math.max(start.y, end.y);

    const startRef = `${columnLabels[minX]}${rowNumbers[minY]}`;
    const endRef = `${columnLabels[maxX]}${rowNumbers[maxY]}`;
    return startRef === endRef ? startRef : `${startRef}:${endRef}`;
  };

  const handleCellMouseDown = (x: number, y: number) => {
    gridRef.current?.focus();
    const cell = clampCell({ x, y });
    setActiveCell(cell);
    setSelectionStart(cell);
    setSelectionEnd(cell);
    setIsDragging(true);
  };

  const handleCellMouseEnter = (x: number, y: number) => {
    if (!isDragging) return;
    setSelectionEnd(clampCell({ x, y }));
  };

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseUp]);

  useEffect(() => {
    if (!columnResizeState) return;

    const originalCursor = document.body.style.cursor;
    const originalUserSelect = document.body.style.userSelect;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const handleMove = (event: MouseEvent) => {
      const delta = event.clientX - columnResizeState.startX;
      setColumns((prev) =>
        prev.map((column) =>
          column.id === columnResizeState.columnId
            ? { ...column, width: Math.max(MIN_COLUMN_WIDTH, Math.round(columnResizeState.startWidth + delta)) }
            : column
        )
      );
    };

    const handleUp = () => setColumnResizeState(null);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      document.body.style.cursor = originalCursor;
      document.body.style.userSelect = originalUserSelect;
    };
  }, [columnResizeState]);

  useEffect(() => {
    if (!rowResizeState) return;

    const originalCursor = document.body.style.cursor;
    const originalUserSelect = document.body.style.userSelect;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";

    const handleMove = (event: MouseEvent) => {
      const delta = event.clientY - rowResizeState.startY;
      setRows((prev) =>
        prev.map((row) =>
          row.id === rowResizeState.rowId
            ? { ...row, height: Math.max(MIN_ROW_HEIGHT, Math.round(rowResizeState.startHeight + delta)) }
            : row
        )
      );
    };

    const handleUp = () => setRowResizeState(null);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      document.body.style.cursor = originalCursor;
      document.body.style.userSelect = originalUserSelect;
    };
  }, [rowResizeState]);

  const startColumnResize = (event: React.MouseEvent, columnId: string, width: number) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    setColumnResizeState({ columnId, startX: event.clientX, startWidth: width });
  };

  const startRowResize = (event: React.MouseEvent, rowId: string, height: number) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    setRowResizeState({ rowId, startY: event.clientY, startHeight: height });
  };

  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: `row-${prev.length + 1}-${Date.now()}`,
        height: DEFAULT_ROW_HEIGHT,
      },
    ]);
  };

  const handleAddColumn = () => {
    setColumns((prev) => [
      ...prev,
      {
        id: `col-${prev.length + 1}-${Date.now()}`,
        width: DEFAULT_COLUMN_WIDTH,
      },
    ]);
  };

  const handleDeleteColumn = () => {
    if (columns.length <= 1) return;
    const nextMaxIndex = Math.max(0, columns.length - 2);
    setColumns((prev) => prev.slice(0, -1));
    setActiveCell((prev) => ({ ...prev, x: Math.min(prev.x, nextMaxIndex) }));
    setSelectionStart((prev) => ({ ...prev, x: Math.min(prev.x, nextMaxIndex) }));
    setSelectionEnd((prev) => ({ ...prev, x: Math.min(prev.x, nextMaxIndex) }));
    setEditingCell((prev) => (prev ? { ...prev, x: Math.min(prev.x, nextMaxIndex) } : null));
  };

  const handleGridKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (editingCell && event.key !== "F2") return;

    if (event.key === "F2") {
      event.preventDefault();
      startEditing(activeCell);
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      selectSingleCell({ x: activeCell.x + 1, y: activeCell.y });
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectSingleCell({ x: activeCell.x - 1, y: activeCell.y });
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      selectSingleCell({ x: activeCell.x, y: activeCell.y + 1 });
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      selectSingleCell({ x: activeCell.x, y: activeCell.y - 1 });
    }
  };

  const getSelectionStyle = () => {
    const minX = Math.min(selectionStart.x, selectionEnd.x);
    const maxX = Math.max(selectionStart.x, selectionEnd.x);
    const minY = Math.min(selectionStart.y, selectionEnd.y);
    const maxY = Math.max(selectionStart.y, selectionEnd.y);

    const left = ROW_HEADER_WIDTH + columnOffsets[minX];
    const top = COLUMN_HEADER_HEIGHT + rowOffsets[minY];
    const width = columnOffsets[maxX + 1] - columnOffsets[minX];
    const height = rowOffsets[maxY + 1] - rowOffsets[minY];

    return {
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`,
      display: "block",
    };
  };

  const currentReference = getCellReference(selectionStart, selectionEnd);

  const editingStyle = editingCell
    ? {
        left: `${ROW_HEADER_WIDTH + columnOffsets[editingCell.x]}px`,
        top: `${COLUMN_HEADER_HEIGHT + rowOffsets[editingCell.y]}px`,
        width: `${Math.max(columns[editingCell.x]?.width ?? DEFAULT_COLUMN_WIDTH, measureTextWidth(editingCell.value) + 20)}px`,
        height: `${rows[editingCell.y]?.height ?? DEFAULT_ROW_HEIGHT}px`,
      }
    : null;

  return (
    <div className="flex flex-col h-full bg-[#f1f3f4] font-sans text-[#3c4043] select-none">
      <div className="flex items-center px-4 py-2 bg-white border-b border-[#dadce0] space-x-3">
        <div className="flex items-center space-x-1">
          <div className="text-[11px] font-bold text-[#70757a] uppercase tracking-tighter w-4 text-center italic">fx</div>
          <div className="h-6 w-px bg-[#dadce0] mx-2"></div>
          <div className="min-w-[70px] h-7 bg-white border border-[#dadce0] rounded-sm px-2 flex items-center text-sm font-medium text-[#1a73e8]">
            {currentReference}
          </div>
        </div>
        <div className="flex-1 h-7 bg-white border border-[#dadce0] rounded-sm px-3 flex items-center text-sm italic text-[#aaa]">
          Enter formula or text here...
        </div>
        <button
          type="button"
          onClick={handleAddRow}
          className="h-7 px-3 rounded-sm border border-[#dadce0] bg-white text-[12px] font-medium text-[#1a73e8] hover:bg-[#e8f0fe] transition-colors"
        >
          Add Row
        </button>
        <button
          type="button"
          onClick={handleAddColumn}
          className="h-7 px-3 rounded-sm border border-[#dadce0] bg-white text-[12px] font-medium text-[#1a73e8] hover:bg-[#e8f0fe] transition-colors"
        >
          Add Column
        </button>
        <button
          type="button"
          onClick={handleDeleteColumn}
          disabled={columns.length <= 1}
          className={cn(
            "h-7 px-3 rounded-sm border text-[12px] font-medium transition-colors",
            columns.length <= 1
              ? "border-[#eceff1] bg-[#f8f9fa] text-[#b0b7bd] cursor-not-allowed"
              : "border-[#dadce0] bg-white text-[#1a73e8] hover:bg-[#e8f0fe]"
          )}
        >
          Delete Column
        </button>
      </div>

      <div
        ref={gridRef}
        tabIndex={0}
        onKeyDown={handleGridKeyDown}
        className="flex-1 overflow-auto relative outline-none"
      >
        <div className="inline-block relative bg-white">
          <div className="flex sticky top-0 z-20">
            <div
              className="bg-[#f8f9fa] border-r border-b border-[#dadce0] sticky left-0 z-40"
              style={{ width: `${ROW_HEADER_WIDTH}px`, height: `${COLUMN_HEADER_HEIGHT}px` }}
            ></div>
            {columns.map((column, x) => (
              <div
                key={column.id}
                className={cn(
                  "bg-[#f8f9fa] border-r border-b border-[#dadce0] flex items-center justify-center text-[12px] font-normal hover:bg-[#e8eaed] transition-colors group/col relative",
                  x >= Math.min(selectionStart.x, selectionEnd.x) &&
                    x <= Math.max(selectionStart.x, selectionEnd.x) &&
                    "bg-[#dadce0] font-bold"
                )}
                style={{ width: `${column.width}px`, height: `${COLUMN_HEADER_HEIGHT}px` }}
              >
                {columnLabels[x]}
                <div
                  onMouseDown={(event) => startColumnResize(event, column.id, column.width)}
                  className="absolute top-0 -right-1 h-full w-2 cursor-col-resize z-40 flex items-center justify-center"
                >
                  <div
                    className={cn(
                      "h-full w-px transition-colors duration-150",
                      columnResizeState?.columnId === column.id
                        ? "bg-[#1a73e8]"
                        : "bg-transparent group-hover/col:bg-[#1a73e8]/70"
                    )}
                  />
                </div>
              </div>
            ))}
          </div>

          {rows.map((row, y) => (
            <div key={row.id} className="flex" style={{ height: `${row.height}px` }}>
              <div
                className={cn(
                  "bg-[#f8f9fa] border-r border-b border-[#dadce0] flex items-center justify-center text-[10px] text-[#70757a] sticky left-0 z-40 font-normal hover:bg-[#e8eaed] transition-colors group/row relative",
                  y >= Math.min(selectionStart.y, selectionEnd.y) &&
                    y <= Math.max(selectionStart.y, selectionEnd.y) &&
                    "bg-[#dadce0] font-bold text-black"
                )}
                style={{ width: `${ROW_HEADER_WIDTH}px`, height: "100%" }}
              >
                {rowNumbers[y]}
                <div
                  onMouseDown={(event) => startRowResize(event, row.id, row.height)}
                  className="absolute -bottom-1 left-0 w-full h-2 cursor-row-resize z-40 flex items-center justify-center"
                >
                  <div
                    className={cn(
                      "w-full h-px transition-colors duration-150",
                      rowResizeState?.rowId === row.id
                        ? "bg-[#1a73e8]"
                        : "bg-transparent group-hover/row:bg-[#1a73e8]/70"
                    )}
                  />
                </div>
              </div>

              {columns.map((column, x) => {
                const value = getCellValue(x, y);
                const isEditingCell = editingCell?.x === x && editingCell?.y === y;

                return (
                  <div
                    key={`${column.id}-${row.id}`}
                    onMouseDown={() => handleCellMouseDown(x, y)}
                    onMouseEnter={() => handleCellMouseEnter(x, y)}
                    onDoubleClick={() => startEditing({ x, y })}
                    className={cn(
                      "border-r border-b border-[#dadce0] flex-shrink-0 cursor-cell bg-white px-1 flex items-center text-[12px] text-left overflow-hidden whitespace-nowrap text-clip",
                      isEditingCell && "bg-[#e8f0fe]"
                    )}
                    style={{ width: `${column.width}px`, height: "100%" }}
                  >
                    {value ? <span className="overflow-hidden whitespace-nowrap text-clip w-full">{value}</span> : <span className="text-[#bdc1c6]">...</span>}
                  </div>
                );
              })}
            </div>
          ))}

          <div
            className="absolute pointer-events-none border-2 border-[#1a73e8] bg-[#1a73e8]/10 z-30"
            style={getSelectionStyle()}
          >
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#1a73e8] border border-white rounded-sm"></div>
          </div>

          {editingCell && editingStyle && (
            <div
              className="absolute z-50"
              style={editingStyle}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <input
                autoFocus
                value={editingCell.value}
                onChange={(event) =>
                  setEditingCell((prev) => (prev ? { ...prev, value: event.target.value } : prev))
                }
                onBlur={() => {
                  if (skipBlurCommitRef.current) {
                    skipBlurCommitRef.current = false;
                    return;
                  }
                  finishEditing(true);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    finishEditing(true, "down");
                    return;
                  }

                  if (event.key === "Tab") {
                    event.preventDefault();
                    finishEditing(true, "right");
                    return;
                  }

                  if (event.key === "Escape") {
                    event.preventDefault();
                    skipBlurCommitRef.current = true;
                    finishEditing(false);
                  }
                }}
                className="w-full h-full px-1 text-[12px] text-left bg-white border-2 border-[#1a73e8] outline-none"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
