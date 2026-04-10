"use client";

import { useTableStore } from "../store/tableStore";
import { useKeyboardNav } from "../hooks/useKeyboardNav";
import { TableHeader } from "./TableHeader";
import { TableRow } from "./TableRow";
import { Toolbar } from "./Toolbar";
import { WeekTabs } from "./WeekTabs";
import { SummaryPanel } from "./SummaryPanel";
import { Copy, Plus, RotateCcw, Settings, Download } from "lucide-react";

export const ProgramTable = () => {
  useKeyboardNav();
  const { meta, weeks, activeWeekId, addRow, duplicateDay } = useTableStore();
  
  const activeWeek = weeks.find(w => w.id === activeWeekId);
  const rows = activeWeek?.days[0]?.rows || [];

  return (
    <div className="h-screen w-full bg-[#0d0d0d] text-[#a0a0a0] font-mono flex flex-col">
      {/* Top Navbar */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-[#222] bg-[#111]">
        <h1 className="text-2xl font-black text-[#facc15] tracking-[0.1em] font-sans">
          THE GILDED LABORATORY
        </h1>
        <div className="flex space-x-10 font-black font-sans tracking-widest text-xs">
          <span className="hover:text-white cursor-pointer uppercase text-[#a0a0a0]">Programs</span>
          <span className="text-[#facc15] border-b-2 border-[#facc15] pb-1 uppercase">Analytics</span>
          <span className="hover:text-white cursor-pointer uppercase text-[#a0a0a0]">Inventory</span>
          <span className="hover:text-white cursor-pointer uppercase text-[#a0a0a0]">Profile</span>
        </div>
        <div className="flex items-center space-x-5">
          <RotateCcw className="w-4 h-4 cursor-pointer hover:text-white" />
          <Settings className="w-4 h-4 cursor-pointer hover:text-white" />
          <button className="text-xs bg-[#222] hover:bg-[#333] px-3 py-1.5 rounded text-white font-sans ml-4 transition-colors font-bold tracking-widest uppercase">
            Exit
          </button>
        </div>
      </div>

      {/* Program Info & Actions */}
      <div className="px-8 py-8 border-b border-[#222] bg-[#141414]">
        <div className="flex justify-between items-start">
          <div className="flex space-x-16">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold mb-2 text-[#666] font-sans">Program Name</p>
              <p className="text-[#facc15] font-black font-sans uppercase text-lg tracking-wide">{meta.name}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold mb-2 text-[#666] font-sans">Duration</p>
              <p className="text-white font-black font-sans uppercase text-lg tracking-wide">{meta.duration}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold mb-2 text-[#666] font-sans">Frequency</p>
              <p className="text-white font-black font-sans uppercase text-lg tracking-wide">{meta.frequency}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold mb-2 text-[#666] font-sans">Goal</p>
              <p className="text-white font-black font-sans uppercase text-lg tracking-wide">{meta.goal}</p>
            </div>
          </div>
          <div className="flex space-x-4 pt-2">
            <button className="bg-[#facc15] text-black font-black uppercase text-[11px] tracking-widest px-6 py-2.5 flex items-center space-x-2 font-sans hover:bg-[#eab308] transition-colors rounded-sm shadow-md">
              <Copy className="w-4 h-4" />
              <span>Save Program</span>
            </button>
            <button className="bg-[#333] text-white font-black uppercase text-[11px] tracking-widest px-6 py-2.5 flex items-center space-x-2 font-sans hover:bg-[#444] transition-colors rounded-sm border border-[#444]">
              <Download className="w-4 h-4" />
              <span>Export to CSV</span>
            </button>
          </div>
        </div>
      </div>

      <Toolbar />
      <WeekTabs />

      {/* Grid Content */}
      <div className="flex-1 overflow-x-auto overflow-y-auto bg-[#141414]">
        <div className="min-w-[1200px]">
          <TableHeader />
          {rows.map((row, idx) => (
            <TableRow key={row.id} row={row} index={idx} />
          ))}
          {/* Empty padding rows for look and feel */}
          {Array.from({ length: Math.max(0, 15 - rows.length) }).map((_, idx) => (
            <div key={`empty-${idx}`} className="grid grid-cols-[40px_2.5fr_1fr_1fr_1.5fr_1fr_1fr_1fr_3.5fr] border-b border-[#222] text-[11px] h-11 hover:bg-[#1a1a1a] transition-colors pointer-events-none">
              <div className="px-2 py-3 border-r border-[#333] text-center bg-[#181818] text-[#555] font-sans font-bold">{rows.length + idx + 1}</div>
              <div className="px-4 py-3 border-r border-[#333]"></div>
              <div className="px-2 py-3 border-r border-[#333]"></div>
              <div className="px-2 py-3 border-r border-[#333]"></div>
              <div className="px-2 py-3 border-r border-[#333]"></div>
              <div className="px-2 py-3 border-r border-[#333]"></div>
              <div className="px-2 py-3 border-r border-[#333]"></div>
              <div className="px-2 py-3 border-r border-[#333]"></div>
              <div className="px-4 py-3"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 py-5 bg-[#0a0a0a] flex justify-between items-center border-t border-[#333] font-sans shrink-0">
        <div className="flex space-x-4">
          <button onClick={() => addRow(activeWeekId)} className="bg-[#facc15] hover:bg-[#eab308] text-black font-black uppercase text-[11px] tracking-widest px-5 py-2 flex items-center space-x-2 transition-colors rounded-sm shadow-md">
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Row</span>
          </button>
          <button onClick={() => duplicateDay(activeWeekId)} className="bg-[#222] text-white hover:bg-[#333] font-black uppercase text-[11px] tracking-widest px-5 py-2 flex items-center space-x-2 transition-colors rounded-sm border border-[#333]">
            <Copy className="w-4 h-4" />
            <span>Duplicate Day</span>
          </button>
        </div>
        <SummaryPanel />
      </div>
    </div>
  );
};
