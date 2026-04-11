"use client";

import { ProgramRow } from "../types/table.types";
import { EditableCell } from "./EditableCell";
import { IntensityBadge } from "./IntensityBadge";
import { useTableStore } from "../store/tableStore";
import { cn } from "@/lib/utils";

interface TableRowProps {
  row: ProgramRow;
  index: number;
}

export const TableRow = ({ row, index }: TableRowProps) => {
  const { zoomLevel, selectionStart, selectionEnd, setSelectionStart, setSelectionEnd, isDraggingSelection, weeks, activeWeekId, columns } = useTableStore();
  
  const activeWeek = weeks.find(w => w.id === activeWeekId);
  const rows = activeWeek?.days[0]?.rows || [];
  const fields = columns.map(c => c.id);

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

  const handleMouseDown = (e: React.MouseEvent, fieldId: string) => {
    e.preventDefault();
    setSelectionStart(row.id, fieldId);
  };

  const handleMouseEnter = (fieldId: string) => {
    if (isDraggingSelection) {
      setSelectionEnd(row.id, fieldId);
    }
  };

  const gridTemplate = `40px ${columns.map(c => c.width).join(' ')}`;

  return (
    <div 
      className="grid border-b border-[#222] hover:bg-[#1a1a1a] transition-colors group relative"
      style={{ fontSize: `${zoomLevel}px`, gridTemplateColumns: gridTemplate }}
    >
      <div className="px-2 py-3 border-r border-[#333] text-center bg-[#181818] text-[#666] font-sans font-bold group-hover:bg-[#222] flex items-center justify-center shrink-0 w-[40px]">
        {index + 1}
      </div>
      
      {columns.map((col) => {
        if (col.id === "intensity") {
          return (
            <div 
              key={col.id}
              onMouseDown={(e) => handleMouseDown(e, col.id)}
              onMouseEnter={() => handleMouseEnter(col.id)}
              className={cn(
                "px-2 py-3 border-r border-[#333] flex items-center justify-center font-sans cursor-cell transition-all duration-75 min-h-[44px]",
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
