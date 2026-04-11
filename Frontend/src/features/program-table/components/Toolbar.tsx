"use client";

import { ChevronDown, Bold, Italic, Underline, ArrowUp, ArrowDown, Trash2, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { useTableStore } from "../store/tableStore";

export const Toolbar = () => {
  const { activeCell, activeWeekId, deleteRow, zoomLevel, setZoomLevel, weeks, toggleCellStyle } = useTableStore();
  
  const handleZoomIn = () => setZoomLevel(Math.min(zoomLevel + 1, 24));
  const handleZoomOut = () => setZoomLevel(Math.max(zoomLevel - 1, 8));

  const handleDeleteRow = () => {
    if (activeCell) {
      deleteRow(activeWeekId, activeCell.rowId);
    }
  };

  const activeWeek = weeks.find(w => w.id === activeWeekId);
  const activeRow = activeWeek?.days[0]?.rows.find(r => r.id === activeCell?.rowId);
  const activeStyles = (activeCell && activeRow?.cellStyles?.[activeCell.field]) || {};

  const handleToggleStyle = (style: 'bold' | 'italic' | 'underline') => {
    if (activeCell) {
      toggleCellStyle(activeWeekId, activeCell.rowId, activeCell.field, style);
    }
  };

  return (
    <div className="px-8 py-3 flex items-center space-x-8 border-b border-[#222] bg-[#1a1a1a] overflow-x-auto">
      <div className="flex items-center space-x-2 text-white font-sans cursor-pointer group">
        <span className="text-[11px] uppercase font-bold tracking-wider mr-2 group-hover:text-[#facc15] transition-colors">
          Inter
        </span>
        <ChevronDown className="w-3 h-3 text-[#666] group-hover:text-[#facc15] transition-colors" />
      </div>
      <div className="h-5 w-px bg-[#333]"></div>
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
        <div className="flex flex-col items-center cursor-pointer group">
          <span className="font-serif font-black text-sm leading-none text-white group-hover:text-[#facc15] transition-colors">
            A
          </span>
          <div className="w-4 h-[3px] bg-[#facc15] mt-0.5"></div>
        </div>
        <div className="flex flex-col items-center cursor-pointer group">
          <div className="w-4 h-4 bg-[#666] group-hover:bg-[#888] transition-colors rounded-sm flex items-center justify-center text-[10px] text-black font-bold">
            A
          </div>
          <div className="w-4 h-[3px] bg-[#444] mt-0.5 group-hover:bg-[#666] transition-colors"></div>
        </div>
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
