"use client";

import { MouseEvent as ReactMouseEvent, useEffect, useState } from "react";
import { useTableStore } from "../store/tableStore";
import { getColumnWidth, getGridStyle } from "../utils/grid";
import { getSpreadsheetColumnLabel } from "../utils/columns";
import { cn } from "@/lib/utils";

interface ColumnResizeState {
  columnId: string;
  startX: number;
  startWidth: number;
}

export const TableHeader = () => {
  const { columns, setColumnWidth } = useTableStore();
  const [resizeState, setResizeState] = useState<ColumnResizeState | null>(null);
  const gridStyle = getGridStyle(columns);

  useEffect(() => {
    if (!resizeState) return;

    const originalCursor = document.body.style.cursor;
    const originalUserSelect = document.body.style.userSelect;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const handleMouseMove = (event: MouseEvent) => {
      const delta = event.clientX - resizeState.startX;
      setColumnWidth(resizeState.columnId, resizeState.startWidth + delta);
    };

    const handleMouseUp = () => {
      setResizeState(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = originalCursor;
      document.body.style.userSelect = originalUserSelect;
    };
  }, [resizeState, setColumnWidth]);

  const startColumnResize = (event: ReactMouseEvent, columnId: string, startWidth: number) => {
    event.preventDefault();
    event.stopPropagation();
    setResizeState({
      columnId,
      startX: event.clientX,
      startWidth,
    });
  };

  return (
    <div 
      className="grid w-max border-b border-[#333] bg-[#1a1a1a] text-[#777] text-[10px] font-sans font-bold tracking-widest uppercase sticky top-0 z-20"
      style={gridStyle}
    >
      <div className="px-3 py-3 border-r border-[#333] sticky left-0 z-30 bg-[#1a1a1a]"></div>
      {columns.map((col, idx) => (
        <div 
          key={col.id} 
          className={cn(
            "px-3 py-3 flex items-center justify-center relative group/col",
            idx === columns.length - 1 ? "" : "border-r border-[#333]"
          )}
        >
          {getSpreadsheetColumnLabel(idx)}
          <div
            onMouseDown={(event) => startColumnResize(event, col.id, getColumnWidth(col))}
            className="absolute top-0 -right-1 h-full w-2 cursor-col-resize z-40 flex items-center justify-center"
          >
            <div
              className={cn(
                "h-full w-px transition-colors duration-150",
                resizeState?.columnId === col.id ? "bg-[#1a73e8]" : "bg-transparent group-hover/col:bg-[#facc15]/80"
              )}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
