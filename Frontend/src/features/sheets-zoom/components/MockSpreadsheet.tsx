"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface MockSpreadsheetProps {
  zoomLevel: number;
}

const COLUMN_COUNT = 100;
const ROW_COUNT = 100;

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

export const MockSpreadsheet = ({ zoomLevel }: MockSpreadsheetProps) => {
  const columns = Array.from({ length: COLUMN_COUNT }, (_, i) => getColumnLabel(i));
  const rows = Array.from({ length: ROW_COUNT }, (_, i) => i + 1);

  const scale = zoomLevel / 100;
  const spreadsheetWidth = 45 + columns.length * 120;
  const spreadsheetHeight = 25 + rows.length * 25;

  return (
    <div className="flex-1 overflow-auto bg-[#f1f3f4] w-full h-full relative border-t border-[#dadce0]">
      <div 
        className="inline-block origin-top-left shadow-lg bg-white"
        style={{ transform: `scale(${scale})` }}
      >
        <table className="border-collapse table-fixed select-none cursor-cell text-[#3c4043] font-sans text-[13px]">
          <thead>
            <tr className="h-[25px]">
              <th className="w-[45px] bg-[#f8f9fa] border-r border-b border-[#dadce0] sticky top-0 left-0 z-30"></th>
              {columns.map((col) => (
                <th
                  key={col}
                  className="w-[120px] bg-[#f8f9fa] border-r border-b border-[#dadce0] text-center font-normal sticky top-0 z-20 hover:bg-[#e8eaed] transition-colors"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row} className="h-[25px]">
                <td className="bg-[#f8f9fa] border-r border-b border-[#dadce0] text-center text-[#70757a] text-[11px] font-normal sticky left-0 z-10 hover:bg-[#e8eaed] transition-colors">
                  {row}
                </td>
                {columns.map((col) => {
                  const isSelected = row === 3 && col === "B";
                  return (
                    <td
                      key={`${col}-${row}`}
                      className={cn(
                        "border-r border-b border-[#dadce0] px-1 overflow-hidden truncate",
                        isSelected ? "bg-[#e8f0fe] ring-2 ring-inset ring-[#1a73e8] z-40" : "bg-white"
                      )}
                    >
                      <input
                        type="text"
                        defaultValue={isSelected ? "Selected Cell" : row === 1 ? `Data ${col}` : ""}
                        className="w-full h-full bg-transparent outline-none text-[13px]"
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Scroll padding to ensure content is reachable at high zoom */}
      <div 
        className="pointer-events-none" 
        style={{ 
          width: `${spreadsheetWidth * scale}px`,
          height: `${spreadsheetHeight * scale}px`
        }}
      ></div>
    </div>
  );
};
