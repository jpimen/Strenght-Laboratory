"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Check, RotateCcw } from "lucide-react";

interface ColorPickerProps {
  onSelect: (color: string | undefined) => void;
  selectedColor?: string;
  trigger: React.ReactNode;
  title: string;
}

const COLORS = [
  // Standard Row
  "#000000", "#434343", "#666666", "#999999", "#b7b7b7", "#cccccc", "#d9d9d9", "#efefef", "#f3f3f3", "#ffffff",
  // Google Sheets Row 1
  "#980000", "#ff0000", "#ff9900", "#ffff00", "#00ff00", "#00ffff", "#4a86e8", "#0000ff", "#9900ff", "#ff00ff",
  // Google Sheets Row 2
  "#e6b8af", "#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#c9daf8", "#cfe2f3", "#d9d2e9", "#ead1dc",
  // Google Sheets Row 3 (Middle)
  "#dd7e6b", "#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#a4c2f4", "#9fc5e8", "#b4a7d6", "#d5a6bd",
  // Google Sheets Row 4 (Darker)
  "#cc4125", "#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6d9eeb", "#6fa8dc", "#8e7cc3", "#c27ba0",
  // Gilded Lab Brand Colors
  "#facc15", "#eab308", "#ca8a04", "#222222", "#1a1a1a", "#111111", "#0d0d0d", "#0a0a0a", "#333333", "#444444"
];

export const ColorPicker = ({ onSelect, selectedColor, trigger, title }: ColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={containerRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-[#222] border border-[#333] shadow-2xl rounded-sm p-3 w-[260px] animate-in fade-in zoom-in duration-100">
          <p className="text-[10px] uppercase tracking-widest font-black text-[#666] mb-3">{title}</p>
          
          <div className="grid grid-cols-10 gap-1 mb-3">
            {COLORS.map((color) => (
              <button
                key={color}
                onClick={() => {
                  onSelect(color);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-5 h-5 rounded-sm border border-transparent hover:border-white transition-all relative flex items-center justify-center",
                  selectedColor === color && "ring-1 ring-[#facc15] ring-offset-1 ring-offset-[#222]"
                )}
                style={{ backgroundColor: color }}
                title={color}
              >
                {selectedColor === color && <Check className="w-3 h-3 text-white mix-blend-difference" />}
              </button>
            ))}
          </div>

          <div className="border-t border-[#333] pt-3 flex justify-between">
            <button
              onClick={() => {
                onSelect(undefined);
                setIsOpen(false);
              }}
              className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-wide text-[#888] hover:text-white transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to Default</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
