"use client";

import React, { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface CellPos {
  x: number;
  y: number;
}

const COLUMN_COUNT = 100;
const INITIAL_ROW_COUNT = 100;

const getColumnLabel = (index: number) => {
  let label = "";
  let value = index + 1;

  while (value > 0) {
    const remainder = (value - 1) % 26;
    label = String.fromCharCode(65 + remainder) + label;
    value = Math.floor((value - 1) / 26);
  }

  return label;
};

export const SpreadsheetGrid = () => {
  const [selectionStart, setSelectionStart] = useState<CellPos | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<CellPos | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [rowCount, setRowCount] = useState(INITIAL_ROW_COUNT);

  const COLUMNS = Array.from({ length: COLUMN_COUNT }, (_, i) => getColumnLabel(i));
  const ROWS = Array.from({ length: rowCount }, (_, i) => i + 1);

  const getCellReference = (start: CellPos, end: CellPos) => {
    const minX = Math.min(start.x, end.x);
    const maxX = Math.max(start.x, end.x);
    const minY = Math.min(start.y, end.y);
    const maxY = Math.max(start.y, end.y);

    const startRef = `${COLUMNS[minX]}${ROWS[minY]}`;
    const endRef = `${COLUMNS[maxX]}${ROWS[maxY]}`;

    return startRef === endRef ? startRef : `${startRef}:${endRef}`;
  };

  const handleMouseDown = (x: number, y: number) => {
    setSelectionStart({ x, y });
    setSelectionEnd({ x, y });
    setIsDragging(true);
  };

  const handleMouseEnter = (x: number, y: number) => {
    if (isDragging) {
      setSelectionEnd({ x, y });
    }
  };

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseUp]);

  const getSelectionStyle = () => {
    if (!selectionStart || !selectionEnd) return { display: "none" };

    const minX = Math.min(selectionStart.x, selectionEnd.x);
    const maxX = Math.max(selectionStart.x, selectionEnd.x);
    const minY = Math.min(selectionStart.y, selectionEnd.y);
    const maxY = Math.max(selectionStart.y, selectionEnd.y);

    // Cell dimensions: 100px width, 25px height
    // Headers: 40px width (row numbers), 25px height (column headers)
    const left = 40 + minX * 100;
    const top = 25 + minY * 25;
    const width = (maxX - minX + 1) * 100;
    const height = (maxY - minY + 1) * 25;

    return {
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`,
      display: "block",
    };
  };

  const currentReference = selectionStart && selectionEnd ? getCellReference(selectionStart, selectionEnd) : "";
  const handleAddRow = () => setRowCount((prev) => prev + 1);

  return (
    <div className="flex flex-col h-full bg-[#f1f3f4] font-sans text-[#3c4043] select-none">
      {/* Top Bar with Reference Box */}
      <div className="flex items-center px-4 py-2 bg-white border-b border-[#dadce0] space-x-4">
        <div className="flex items-center space-x-1">
          <div className="text-[11px] font-bold text-[#70757a] uppercase tracking-tighter w-4 text-center italic">fx</div>
          <div className="h-6 w-px bg-[#dadce0] mx-2"></div>
          <div className="min-w-[60px] h-7 bg-white border border-[#dadce0] rounded-sm px-2 flex items-center text-sm font-medium text-[#1a73e8]">
            {currentReference}
          </div>
        </div>
        <div className="flex-1 h-7 bg-white border border-[#dadce0] rounded-sm px-3 flex items-center text-sm italic text-[#aaa]">
          Enter formula or text here...
        </div>
        <button
          type="button"
          onClick={handleAddRow}
          className="h-7 px-3 rounded-sm border border-[#dadce0] bg-white text-[12px] font-medium text-[#1a73e8] hover:bg-[#e8f0fe] transition-colors"
        >
          Add Row
        </button>
      </div>

      {/* Grid Container */}
      <div className="flex-1 overflow-auto relative">
        <div className="inline-block relative bg-white">
          {/* Column Headers */}
          <div className="flex sticky top-0 z-20">
            <div className="w-[40px] h-[25px] bg-[#f8f9fa] border-r border-b border-[#dadce0] sticky left-0 z-30"></div>
            {COLUMNS.map((col, x) => (
              <div
                key={col}
                className={cn(
                  "w-[100px] h-[25px] bg-[#f8f9fa] border-r border-b border-[#dadce0] flex items-center justify-center text-[12px] font-normal hover:bg-[#e8eaed] transition-colors",
                  selectionStart && selectionEnd && x >= Math.min(selectionStart.x, selectionEnd.x) && x <= Math.max(selectionStart.x, selectionEnd.x) && "bg-[#dadce0] font-bold"
                )}
              >
                {col}
              </div>
            ))}
          </div>

          {/* Rows */}
          {ROWS.map((row, y) => (
            <div key={row} className="flex">
              {/* Row Header */}
              <div 
                className={cn(
                  "w-[40px] h-[25px] bg-[#f8f9fa] border-r border-b border-[#dadce0] flex items-center justify-center text-[10px] text-[#70757a] sticky left-0 z-10 font-normal hover:bg-[#e8eaed] transition-colors",
                  selectionStart && selectionEnd && y >= Math.min(selectionStart.y, selectionEnd.y) && y <= Math.max(selectionStart.y, selectionEnd.y) && "bg-[#dadce0] font-bold text-black"
                )}
              >
                {row}
              </div>
              
              {/* Cells */}
              {COLUMNS.map((col, x) => (
                <input
                  key={`${col}${row}`}
                  onMouseDown={() => handleMouseDown(x, y)}
                  onMouseEnter={() => handleMouseEnter(x, y)}
                  className="w-[100px] h-[25px] border-r border-b border-[#dadce0] flex-shrink-0 cursor-cell transition-colors duration-75 px-1 text-[12px] bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#1a73e8]"
                />
              ))}
            </div>
          ))}

          {/* Selection Overlay */}
          <div 
            className="absolute pointer-events-none border-2 border-[#1a73e8] bg-[#1a73e8]/10 z-40"
            style={getSelectionStyle()}
          >
            {/* Range Handle (Optional visual flair) */}
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#1a73e8] border border-white rounded-sm"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
