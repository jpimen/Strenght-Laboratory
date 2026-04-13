/**
 * useGridCellInteraction Hook
 * Handles mouse interactions (click, double-click) with grid cells
 */

import { useCallback, useRef } from 'react';
import { useGridStore } from '../store/gridStore';

export const useGridCellInteraction = () => {
  const { setActiveCell, startEdit } = useGridStore();
  const doubleClickTimerRef = useRef<NodeJS.Timeout>();

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      setActiveCell(row, col);

      // Check for double-click
      if (doubleClickTimerRef.current) {
        clearTimeout(doubleClickTimerRef.current);
        doubleClickTimerRef.current = undefined;
        startEdit(row, col);
        return;
      }

      // Set timeout for potential double-click
      doubleClickTimerRef.current = setTimeout(() => {
        doubleClickTimerRef.current = undefined;
      }, 300);
    },
    [setActiveCell, startEdit]
  );

  return { handleCellClick };
};
