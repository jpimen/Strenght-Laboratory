"use client";

import React from "react";
import { SpreadsheetGrid } from "@/features/sheets-selection/components/SpreadsheetGrid";

export default function SheetsSelectionPage() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white text-[#3c4043]">
      {/* Header / Title Bar (Reused from sheets-zoom for consistency) */}
      <div className="flex items-center px-4 py-2 bg-white border-b border-[#dadce0]">
        <div className="w-8 h-8 mr-3 bg-[#0f9d58] rounded-sm flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
            <path d="M19,3H5C3.89,3,3,3.9,3,5v14c0,1.1,0.89,2,2,2h14c0.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M19,19H5V5h14V19z M7,10h2v7H7V10z M11,7h2v10h-2V7z M15,13h2v4h-2V13z" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-normal leading-tight italic">Range Selection Demo</h1>
          <div className="flex space-x-4 text-xs mt-0.5">
            <span className="cursor-pointer hover:bg-[#f1f3f4] px-1.5 py-0.5 rounded transition-colors underline decoration-[#0f9d58]">Selection Lab</span>
            <span className="cursor-pointer hover:bg-[#f1f3f4] px-1.5 py-0.5 rounded transition-colors">Coordinates</span>
            <span className="cursor-pointer hover:bg-[#f1f3f4] px-1.5 py-0.5 rounded transition-colors">Formatting</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <SpreadsheetGrid />
      </div>

      {/* Footer / Status Bar */}
      <div className="bg-[#f8f9fa] border-t border-[#dadce0] px-4 py-1.5 flex items-center justify-between text-xs text-[#70757a]">
        <div className="flex items-center space-x-6">
          <span className="flex items-center space-x-1 font-medium bg-[#e8f0fe] text-[#1a73e8] px-2 py-0.5 rounded cursor-pointer ring-1 ring-[#1a73e8]">
            <span>Selection_v1</span>
          </span>
          <span className="cursor-pointer hover:bg-[#e8eaed] px-2 py-0.5 rounded transition-colors">+</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-[10px] bg-[#1a73e8] text-white px-1.5 py-0.5 rounded font-black uppercase">Active Lab</span>
          <div className="w-4 h-4 rounded-full bg-[#1a73e8] flex items-center justify-center text-[10px] text-white">?</div>
        </div>
      </div>
    </div>
  );
}
