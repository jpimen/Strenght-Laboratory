"use client";

import { useState, useRef, useEffect } from "react";
import { useTableStore } from "../store/tableStore";
import { cn } from "@/lib/utils";

interface EditableCellProps {
  rowId: string;
  field: string;
  value: string | number;
  className?: string;
  align?: "left" | "center" | "right";
  isHeaderFeature?: boolean;
}

export const EditableCell = ({ rowId, field, value, className, align = "center", isHeaderFeature }: EditableCellProps) => {
  const { activeCell, setActiveCell, updateRow, activeWeekId, zoomLevel, weeks, selectionStart, selectionEnd, setSelectionStart, setSelectionEnd, isDraggingSelection } = useTableStore();
  const [localValue, setLocalValue] = useState(value);
  const isEditing = activeCell?.rowId === rowId && activeCell?.field === field;
  const inputRef = useRef<HTMLInputElement>(null);

  const activeWeek = weeks.find(w => w.id === activeWeekId);
  const rows = activeWeek?.days[0]?.rows || [];
  const { columns } = useTableStore();
  const fields = columns.map(c => c.id);

  const row = rows.find(r => r.id === rowId);
  const cellStyle = row?.cellStyles?.[field] || {};

  const isSelected = (() => {
    if (!selectionStart || !selectionEnd) return false;
    
    const startRowIdx = rows.findIndex(r => r.id === selectionStart.rowId);
    const endRowIdx = rows.findIndex(r => r.id === selectionEnd.rowId);
    const startFieldIdx = fields.indexOf(selectionStart.field);
    const endFieldIdx = fields.indexOf(selectionEnd.field);
    
    const currentRowIdx = rows.findIndex(r => r.id === rowId);
    const currentFieldIdx = fields.indexOf(field);
    
    if (currentRowIdx === -1 || startRowIdx === -1 || endRowIdx === -1) return false;
    
    const rMin = Math.min(startRowIdx, endRowIdx);
    const rMax = Math.max(startRowIdx, endRowIdx);
    const fMin = Math.min(startFieldIdx, endFieldIdx);
    const fMax = Math.max(startFieldIdx, endFieldIdx);
    
    return currentRowIdx >= rMin && currentRowIdx <= rMax && currentFieldIdx >= fMin && currentFieldIdx <= fMax;
  })();

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleBlur = () => {
    updateRow(activeWeekId, rowId, field, localValue);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // If it's a right click, don't start selection override
    if (e.button !== 0) return;
    e.preventDefault(); // Stop native browser text selection
    setSelectionStart(rowId, field);
  };

  const handleMouseEnter = () => {
    if (isDraggingSelection) {
      setSelectionEnd(rowId, field);
    }
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      className={cn(
        "px-2 py-3 border-r border-[#333] flex items-center cursor-cell h-full min-h-[44px] transition-all duration-75 relative",
        align === "left" && "justify-start px-4",
        align === "center" && "justify-center text-center",
        align === "right" && "justify-end",
        isEditing && "z-10 ring-1 ring-[#facc15] bg-[#1a180a]",
        isSelected && "bg-[#1a73e8]/20 ring-1 ring-[#1a73e8]/50 inset-shadow-sm",
        isHeaderFeature && !isEditing && !isSelected && "text-[#d4d4d4] bg-[#1a180a]", 
        className
      )}
        style={{ backgroundColor: isEditing ? undefined : cellStyle.backgroundColor }}
      >
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onBlur={handleBlur}
            className={cn(
              "w-full bg-transparent border-none outline-none font-sans transition-all duration-200",
              align === "left" && "text-left",
              align === "center" && "text-center",
              align === "right" && "text-right",
              (cellStyle.bold || field === "exercise") && "font-black",
              (cellStyle.italic || field === "notes") && "italic",
              cellStyle.underline && "underline"
            )}
            style={{ fontSize: `${zoomLevel}px`, color: cellStyle.color }}
          />
        ) : (
          <span className={cn(
            "truncate w-full transition-all duration-200", 
            (cellStyle.bold || field === "exercise") ? "font-black" : "font-normal",
            (cellStyle.italic || field === "notes") && "italic",
            cellStyle.underline && "underline decoration-[#facc15]/50"
          )} style={{ color: cellStyle.color }}>
            {value || <span className="text-[#333]">...</span>}
          </span>
        )}
    </div>
  );
};
