"use client";

import { ChevronDown, Bold, Italic, Underline, ArrowUp, ArrowDown, Trash2, AlignLeft, AlignCenter, AlignRight, PaintBucket } from "lucide-react";
import { useTableStore } from "../store/tableStore";
import { ColorPicker } from "./ColorPicker";
import { cn } from "@/lib/utils";

export const Toolbar = () => {
  const { activeCell, activeWeekId, deleteRow, zoomLevel, setZoomLevel, weeks, toggleCellStyle, setCellStyle } = useTableStore();
  
  const handleZoomIn = () => setZoomLevel(Math.min(zoomLevel + 1, 24));
  const handleZoomOut = () => setZoomLevel(Math.max(zoomLevel - 1, 8));

  const handleDeleteRow = () => {
    if (activeCell) {
      deleteRow(activeWeekId, activeCell.rowId);
    }
  };

  const handleToggleStyle = (style: 'bold' | 'italic' | 'underline') => {
    if (activeCell) {
      toggleCellStyle(activeWeekId, activeCell.rowId, activeCell.field, style);
    }
  };

  const handleSetColor = (color: string | undefined) => {
    if (activeCell) {
      setCellStyle(activeWeekId, activeCell.rowId, activeCell.field, { color });
    }
  };

  const handleSetBgColor = (backgroundColor: string | undefined) => {
    if (activeCell) {
      setCellStyle(activeWeekId, activeCell.rowId, activeCell.field, { backgroundColor });
    }
  };

  const activeWeek = weeks.find(w => w.id === activeWeekId);
  const activeRow = activeWeek?.days[0]?.rows.find(r => r.id === activeCell?.rowId);
  const activeStyles = (activeCell && activeRow?.cellStyles?.[activeCell.field]) || {};

  return (
    <div className="px-8 py-3 flex items-center space-x-8 border-b border-[#222] bg-[#1a1a1a]">
      {/* ... Inter Dropdown ... */}
      <div className="flex items-center space-x-2 text-white font-sans cursor-pointer group">
        <span className="text-[11px] uppercase font-bold tracking-wider mr-2 group-hover:text-[#facc15] transition-colors">
          Inter
        </span>
        <ChevronDown className="w-3 h-3 text-[#666] group-hover:text-[#facc15] transition-colors" />
      </div>
      <div className="h-5 w-px bg-[#333]"></div>
      
      {/* ... Zoom Controls ... */}
      <div className="flex items-center space-x-4 font-sans text-xs text-white select-none">
        <span className="text-[9px] uppercase font-black text-[#555] tracking-widest mr-1">Zoom:</span>
        <span 
          onClick={handleZoomOut}
          className="cursor-pointer text-[#666] hover:text-[#facc15] font-bold w-4 h-4 flex items-center justify-center transition-colors"
        >—</span>
        <span className="font-bold text-sm min-w-[1.5rem] text-center">{zoomLevel}</span>
        <span 
          onClick={handleZoomIn}
          className="cursor-pointer text-[#666] hover:text-[#facc15] font-bold w-4 h-4 flex items-center justify-center transition-colors"
        >+</span>
      </div>
      <div className="h-5 w-px bg-[#333]"></div>

      {/* Formatting Tools */}
      <div className="flex items-center space-x-5 text-[#888]">
        <Bold 
          onClick={() => handleToggleStyle('bold')}
          className={`w-4 h-4 cursor-pointer transition-colors ${activeStyles.bold ? 'text-[#facc15]' : 'hover:text-white'}`} 
        />
        <Italic 
          onClick={() => handleToggleStyle('italic')}
          className={`w-4 h-4 cursor-pointer transition-colors ${activeStyles.italic ? 'text-[#facc15]' : 'hover:text-white'}`} 
        />
        <Underline 
          onClick={() => handleToggleStyle('underline')}
          className={`w-4 h-4 cursor-pointer transition-colors ${activeStyles.underline ? 'text-[#facc15]' : 'hover:text-white'}`} 
        />
        
        {/* Text Color Picker */}
        <ColorPicker
          title="Text Color"
          selectedColor={activeStyles.color}
          onSelect={handleSetColor}
          trigger={
            <div className="flex flex-col items-center cursor-pointer group">
              <span className={cn(
                "font-serif font-black text-sm leading-none transition-colors",
                activeStyles.color ? "opacity-100" : "text-[#777] group-hover:text-white"
              )} style={{ color: activeStyles.color }}>
                A
              </span>
              <div className="w-4 h-[3px] mt-0.5" style={{ backgroundColor: activeStyles.color || "#facc15" }}></div>
            </div>
          }
        />

        {/* Fill Color Picker */}
        <ColorPicker
          title="Fill Color"
          selectedColor={activeStyles.backgroundColor}
          onSelect={handleSetBgColor}
          trigger={
            <div className="flex flex-col items-center cursor-pointer group">
              <div className={cn(
                "w-4 h-4 rounded-sm flex items-center justify-center transition-all border border-[#444]",
                activeStyles.backgroundColor ? "opacity-100 shadow-sm" : "bg-transparent group-hover:border-white"
              )} style={{ backgroundColor: activeStyles.backgroundColor }}>
                <PaintBucket className={cn("w-2.5 h-2.5", activeStyles.backgroundColor ? "text-white mix-blend-difference" : "text-[#777] group-hover:text-white")} />
              </div>
              <div className="w-4 h-[3px] mt-0.5" style={{ backgroundColor: activeStyles.backgroundColor || "#444" }}></div>
            </div>
          }
        />
      </div>
      <div className="h-5 w-px bg-[#333]"></div>
      <div className="flex items-center space-x-6">
        <span className="text-[9px] uppercase font-black text-[#555] tracking-widest font-sans">
          Row Actions:
        </span>
        <button className="flex items-center space-x-1.5 hover:text-[#facc15] transition-colors group">
          <ArrowUp className="w-3.5 h-3.5 text-[#888] group-hover:text-[#facc15]" />
          <span className="text-[10px] font-black uppercase font-sans tracking-wide text-[#a0a0a0] group-hover:text-[#facc15]">
            Above
          </span>
        </button>
        <button className="flex items-center space-x-1.5 hover:text-[#facc15] transition-colors group">
          <ArrowDown className="w-3.5 h-3.5 text-[#888] group-hover:text-[#facc15]" />
          <span className="text-[10px] font-black uppercase font-sans tracking-wide text-[#a0a0a0] group-hover:text-[#facc15]">
            Below
          </span>
        </button>
        <button 
          onClick={handleDeleteRow}
          className="flex items-center space-x-1.5 text-[#dc2626] hover:text-[#ef4444] transition-colors group"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="text-[10px] font-black uppercase font-sans tracking-wide">
            Delete
          </span>
        </button>
      </div>
      <div className="h-5 w-px bg-[#333]"></div>
      <div className="flex items-center space-x-5 text-[#888]">
        <AlignLeft className="w-4 h-4 cursor-pointer text-white" />
        <AlignCenter className="w-4 h-4 cursor-pointer hover:text-white" />
        <AlignRight className="w-4 h-4 cursor-pointer hover:text-white" />
      </div>
    </div>
  );
};
