"use client";

import { ProgramRow } from "../types/table.types";
import { EditableCell } from "./EditableCell";
import { IntensityBadge } from "./IntensityBadge";
import { useTableStore } from "../store/tableStore";

interface TableRowProps {
  row: ProgramRow;
  index: number;
}

export const TableRow = ({ row, index }: TableRowProps) => {
  const { zoomLevel } = useTableStore();
  
  return (
    <div 
      className="grid grid-cols-[40px_2.5fr_1fr_1fr_1.5fr_1fr_1fr_1fr_3.5fr] border-b border-[#222] hover:bg-[#1a1a1a] transition-colors group"
      style={{ fontSize: `${zoomLevel}px` }}
    >
      <div className="px-2 py-3 border-r border-[#333] text-center bg-[#181818] text-[#666] font-sans font-bold group-hover:bg-[#222] flex items-center justify-center">
        {index + 1}
      </div>
      
      <EditableCell rowId={row.id} field="exercise" value={row.exercise} align="left" isHeaderFeature />
      <EditableCell rowId={row.id} field="sets" value={row.sets} />
      <EditableCell rowId={row.id} field="reps" value={row.reps} />
      <EditableCell rowId={row.id} field="load" value={row.load} />
      <EditableCell rowId={row.id} field="rpe" value={row.rpe} />
      
      <div className="px-2 py-3 border-r border-[#333] flex items-center justify-center font-sans cursor-pointer transition-colors min-h-[44px]">
        <IntensityBadge level={row.intensity} />
      </div>
      
      <EditableCell rowId={row.id} field="rest" value={row.rest} />
      <EditableCell rowId={row.id} field="notes" value={row.notes} align="left" />
    </div>
  );
};
