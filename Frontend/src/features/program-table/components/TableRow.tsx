"use client";

import { MouseEvent as ReactMouseEvent, useEffect, useState } from "react";
import { ProgramRow } from "../types/table.types";
import { EditableCell } from "./EditableCell";
import { IntensityBadge } from "./IntensityBadge";
import { useTableStore } from "../store/tableStore";
import { cn } from "@/lib/utils";
import { DEFAULT_ROW_HEIGHT, getGridStyle } from "../utils/grid";

interface RowResizeState {
  startY: number;
  startHeight: number;
}

interface TableRowProps {
  row: ProgramRow;
  index: number;
}

export const TableRow = ({ row, index }: TableRowProps) => {
  const { zoomLevel, selectionStart, selectionEnd, setSelectionStart, setSelectionEnd, isDraggingSelection, weeks, activeWeekId, columns, rowHeights, setRowHeight } = useTableStore();
  const [resizeState, setResizeState] = useState<RowResizeState | null>(null);
  
  const activeWeek = weeks.find(w => w.id === activeWeekId);
  const rows = activeWeek?.days[0]?.rows || [];
  const fields = columns.map(c => c.id);
  const rowHeight = rowHeights[row.id] ?? DEFAULT_ROW_HEIGHT;

  const isSelected = (fieldId: string) => {
    if (!selectionStart || !selectionEnd) return false;
    
    const startRowIdx = rows.findIndex(r => r.id === selectionStart.rowId);
    const endRowIdx = rows.findIndex(r => r.id === selectionEnd.rowId);
    
    const fStartIdx = fields.indexOf(selectionStart.field);
    const fEndIdx = fields.indexOf(selectionEnd.field);
    
    const currentRowIdx = index;
    const currentFieldIdx = fields.indexOf(fieldId);
    
    if (currentRowIdx === -1 || startRowIdx === -1 || endRowIdx === -1) return false;
    
    const rMin = Math.min(startRowIdx, endRowIdx);
    const rMax = Math.max(startRowIdx, endRowIdx);
    const fMin = Math.min(fStartIdx, fEndIdx);
    const fMax = Math.max(fStartIdx, fEndIdx);
    
    return currentRowIdx >= rMin && currentRowIdx <= rMax && currentFieldIdx >= fMin && currentFieldIdx <= fMax;
  };

  const handleMouseDown = (e: ReactMouseEvent, fieldId: string) => {
    e.preventDefault();
    setSelectionStart(row.id, fieldId);
  };

  const handleMouseEnter = (fieldId: string) => {
    if (isDraggingSelection) {
      setSelectionEnd(row.id, fieldId);
    }
  };

  const gridStyle = getGridStyle(columns);

  useEffect(() => {
    if (!resizeState) return;

    const originalCursor = document.body.style.cursor;
    const originalUserSelect = document.body.style.userSelect;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";

    const handleMouseMove = (event: MouseEvent) => {
      const delta = event.clientY - resizeState.startY;
      setRowHeight(row.id, resizeState.startHeight + delta);
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
  }, [resizeState, row.id, setRowHeight]);

  const startRowResize = (event: ReactMouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    setResizeState({
      startY: event.clientY,
      startHeight: rowHeight,
    });
  };

  return (
    <div 
      className="grid w-max border-b border-[#222] hover:bg-[#1a1a1a] transition-colors group relative"
      style={{ fontSize: `${zoomLevel}px`, height: `${rowHeight}px`, ...gridStyle }}
    >
      <div className="border-r border-[#333] text-center bg-[#181818] text-[#666] font-sans font-bold group-hover:bg-[#222] flex items-center justify-center shrink-0 w-[40px] sticky left-0 z-10 h-full relative group/row">
        {index + 1}
        <div
          onMouseDown={startRowResize}
          className="absolute -bottom-1 left-0 w-full h-2 cursor-row-resize z-40 flex items-center justify-center"
        >
          <div
            className={cn(
              "w-full h-px transition-colors duration-150",
              resizeState ? "bg-[#1a73e8]" : "bg-transparent group-hover/row:bg-[#facc15]/80"
            )}
          />
        </div>
      </div>
      
      {columns.map((col) => {
        if (col.id === "intensity") {
          return (
            <div 
              key={col.id}
              onMouseDown={(e) => handleMouseDown(e, col.id)}
              onMouseEnter={() => handleMouseEnter(col.id)}
              className={cn(
                "px-2 py-1 border-r border-[#333] flex items-center justify-center font-sans cursor-cell transition-all duration-75 h-full overflow-hidden",
                isSelected(col.id) && "bg-[#1a73e8]/20 ring-1 ring-[#1a73e8]/50 z-0"
              )}
            >
              <IntensityBadge level={row.intensity} />
            </div>
          );
        }
        
        return (
          <EditableCell 
            key={col.id}
            rowId={row.id} 
            field={col.id as any} 
            value={row[col.id] ?? ""} 
            align={col.id === 'exercise' || col.id === 'notes' ? 'left' : 'center'}
            isHeaderFeature={col.id === 'exercise'}
          />
        );
      })}
    </div>
  );
};
