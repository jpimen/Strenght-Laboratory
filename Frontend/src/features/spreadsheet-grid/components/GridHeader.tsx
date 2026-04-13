'use client';

import React from 'react';
import { getColumnLabel, GRID_CONFIG } from '../utils/grid.utils';

interface GridHeaderProps {
  cols: number;
}

export const GridColumnHeader: React.FC<GridHeaderProps> = ({ cols }) => {
  return (
    <div
      className="flex bg-[#111] border-b border-[#333] sticky top-0 z-20"
      style={{
        gridColumn: '1 / -1',
        display: 'grid',
        gridTemplateColumns: `40px ${Array(cols)
          .fill(GRID_CONFIG.defaultCellWidth)
          .map((w) => `${w}px`)
          .join(' ')}`,
      }}
    >
      {/* Corner cell (row headers header) */}
      <div
        className="
          flex items-center justify-center
          border-r border-[#333] bg-[#0a0a0a]
          font-mono text-xs font-bold text-[#666]
          select-none
        "
      />

      {/* Column headers */}
      {Array.from({ length: cols }).map((_, col) => (
        <div
          key={`col-header-${col}`}
          className="
            flex items-center justify-center
            border-r border-[#333] bg-[#0a0a0a]
            font-mono text-xs font-bold text-[#999]
            select-none hover:bg-[#151515] cursor-pointer
            transition-colors
          "
        >
          {getColumnLabel(col)}
        </div>
      ))}
    </div>
  );
};

interface GridRowHeaderProps {
  row: number;
}

export const GridRowHeader: React.FC<GridRowHeaderProps> = ({ row }) => {
  return (
    <div
      className="
        flex items-center justify-center h-full
        border-r border-[#333] bg-[#0a0a0a]
        font-mono text-xs font-bold text-[#999]
        select-none hover:bg-[#151515] cursor-pointer
        transition-colors
      "
    >
      {row + 1}
    </div>
  );
};
