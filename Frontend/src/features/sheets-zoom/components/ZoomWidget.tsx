"use client";

import React from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";

interface ZoomWidgetProps {
  zoom: number;
  onZoomChange: (value: number) => void;
}

export const ZoomWidget = ({ zoom, onZoomChange }: ZoomWidgetProps) => {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onZoomChange(parseInt(e.target.value));
  };

  const handleZoomOut = () => {
    onZoomChange(Math.max(zoom - 10, 50));
  };

  const handleZoomIn = () => {
    onZoomChange(Math.min(zoom + 10, 200));
  };

  const handleReset = () => {
    onZoomChange(100);
  };

  return (
    <div className="flex items-center space-x-4 bg-[#f8f9fa] border-b border-[#e8eaed] px-4 py-2 text-[#3c4043] font-sans h-12 select-none w-full shadow-sm">
      <div className="flex items-center space-x-1">
        <button
          onClick={handleZoomOut}
          disabled={zoom <= 50}
          className="p-1.5 hover:bg-[#e8eaed] rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Zoom out"
        >
          <Minus className="w-4 h-4" />
        </button>
        
        <div className="flex flex-col items-center min-w-[3.5rem]">
          <span className="text-sm font-medium">{zoom}%</span>
        </div>

        <button
          onClick={handleZoomIn}
          disabled={zoom >= 200}
          className="p-1.5 hover:bg-[#e8eaed] rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Zoom in"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="h-6 w-px bg-[#dadce0]"></div>

      <div className="flex items-center flex-1 max-w-[200px] px-2">
        <input
          type="range"
          min="50"
          max="200"
          value={zoom}
          onChange={handleSliderChange}
          className="w-full h-1 bg-[#dadce0] rounded-lg appearance-none cursor-pointer accent-[#1a73e8]"
        />
      </div>

      <div className="h-6 w-px bg-[#dadce0]"></div>

      <button
        onClick={handleReset}
        className="flex items-center space-x-1.5 bg-white border border-[#dadce0] hover:border-[#1a73e8] hover:text-[#1a73e8] px-3 py-1 rounded text-xs font-semibold transition-all shadow-sm active:bg-[#f1f3f4]"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Reset</span>
      </button>

      <style jsx>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          background: #1a73e8;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
        input[type='range']::-moz-range-thumb {
          width: 14px;
          height: 14px;
          background: #1a73e8;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};
