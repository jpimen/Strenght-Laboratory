"use client";

import { useState, useRef, useEffect } from "react";
import { useTableStore } from "../store/tableStore";
import { ProgramRow } from "../types/table.types";
import { cn } from "@/lib/utils";

interface EditableCellProps {
  rowId: string;
  field: keyof ProgramRow;
  value: string | number;
  className?: string;
  align?: "left" | "center" | "right";
  isHeaderFeature?: boolean;
}

export const EditableCell = ({ rowId, field, value, className, align = "center", isHeaderFeature }: EditableCellProps) => {
  const { activeCell, setActiveCell, updateRow, activeWeekId, zoomLevel, weeks } = useTableStore();
  const [localValue, setLocalValue] = useState(value);
  const isEditing = activeCell?.rowId === rowId && activeCell?.field === field;
  const inputRef = useRef<HTMLInputElement>(null);

  const row = weeks.find(w => w.id === activeWeekId)?.days[0]?.rows.find(r => r.id === rowId);
  const cellStyle = row?.cellStyles?.[field] || {};

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
    // Don't close active cell here because blurring happens when clicking another cell
  };

  const handleClick = () => {
    setActiveCell(rowId, field);
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "px-2 py-3 border-r border-[#333] flex items-center cursor-cell h-full min-h-[44px]",
        align === "left" && "justify-start px-4",
        align === "center" && "justify-center text-center",
        align === "right" && "justify-end",
        isEditing && "border border-[#facc15] shadow-[inset_0_0_0_1px_rgba(250,204,21,1)] bg-[#1a180a]",
        isHeaderFeature && !isEditing && "text-[#d4d4d4] bg-[#1a180a]", // Special formatting for exercise column
        className
      )}
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
          style={{ fontSize: `${zoomLevel}px` }}
        />
      ) : (
        <span className={cn(
          "truncate w-full transition-all duration-200", 
          (cellStyle.bold || field === "exercise") ? "font-black text-white" : "text-[#d4d4d4]",
          (cellStyle.italic || field === "notes") && "italic text-[#888]",
          cellStyle.underline && "underline decoration-[#facc15]/50"
        )}>
          {value || <span className="text-[#333]">...</span>}
        </span>
      )}
    </div>
  );
};
