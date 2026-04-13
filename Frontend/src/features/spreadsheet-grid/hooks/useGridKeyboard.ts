/**
 * useGridKeyboard Hook
 * Handles keyboard navigation, editing, and shortcuts for the spreadsheet grid
 */

import { useEffect, useCallback } from 'react';
import { useGridStore } from '../store/gridStore';
import {
  isNavigationKey,
  isEditKey,
  getNextCell,
} from '../utils/grid.utils';

export const useGridKeyboard = () => {
  const {
    activeCell,
    isEditing,
    editingValue,
    rows,
    cols,
    setActiveCell,
    startEdit,
    updateEditValue,
    saveEdit,
    cancelEdit,
    copy,
    paste,
    cut,
    clearCell,
    extendSelection,
  } = useGridStore();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // If not in editing mode and Escape pressed, do nothing (cell already not editing)
      if (!isEditing && e.key === 'Escape') {
        return;
      }

      // Edit mode shortcuts
      if (isEditing) {
        if (e.key === 'Enter') {
          e.preventDefault();
          saveEdit();
          return;
        }

        if (e.key === 'Escape') {
          e.preventDefault();
          cancelEdit();
          return;
        }

        if (e.key === 'Tab') {
          e.preventDefault();
          saveEdit();
          if (activeCell) {
            const nextCell = getNextCell(
              activeCell,
              e.shiftKey ? 'left' : 'right',
              rows,
              cols
            );
            if (nextCell) {
              setActiveCell(nextCell.row, nextCell.col);
            }
          }
          return;
        }

        // Allow normal text input in edit mode
        return;
      }

      // Navigation shortcuts (not in edit mode)
      if (!activeCell) {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          e.preventDefault();
          setActiveCell(0, 0);
        }
        return;
      }

      // Arrow keys
      if (isNavigationKey(e.key)) {
        e.preventDefault();

        if (e.key === 'Tab') {
          const nextCell = getNextCell(
            activeCell,
            e.shiftKey ? 'left' : 'right',
            rows,
            cols
          );
          if (nextCell) {
            setActiveCell(nextCell.row, nextCell.col);
          }
          return;
        }

        if (e.shiftKey) {
          // Extend selection with Shift+Arrow
          let direction: 'up' | 'down' | 'left' | 'right' = 'down';
          if (e.key === 'ArrowUp') direction = 'up';
          else if (e.key === 'ArrowDown') direction = 'down';
          else if (e.key === 'ArrowLeft') direction = 'left';
          else if (e.key === 'ArrowRight') direction = 'right';

          const nextCell = getNextCell(activeCell, direction, rows, cols);
          if (nextCell) {
            extendSelection(nextCell);
          }
          return;
        }

        // Normal navigation
        let direction: 'up' | 'down' | 'left' | 'right' = 'down';
        if (e.key === 'ArrowUp') direction = 'up';
        else if (e.key === 'ArrowDown') direction = 'down';
        else if (e.key === 'ArrowLeft') direction = 'left';
        else if (e.key === 'ArrowRight') direction = 'right';

        const nextCell = getNextCell(activeCell, direction, rows, cols);
        if (nextCell) {
          setActiveCell(nextCell.row, nextCell.col);
        }
        return;
      }

      // Ctrl/Cmd shortcuts
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'c') {
          e.preventDefault();
          copy();
          return;
        }

        if (e.key === 'v') {
          e.preventDefault();
          if (activeCell) {
            paste(activeCell.row, activeCell.col);
          }
          return;
        }

        if (e.key === 'x') {
          e.preventDefault();
          cut();
          return;
        }

        if (e.key === 'a') {
          e.preventDefault();
          // Select all (would need to implement in store)
          return;
        }
      }

      // Delete key
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        if (activeCell) {
          clearCell(activeCell.row, activeCell.col);
        }
        return;
      }

      // Double-click or single char = start editing
      if (isEditKey(e.key)) {
        e.preventDefault();
        startEdit(activeCell.row, activeCell.col, e.key);
      }
    },
    [
      isEditing,
      activeCell,
      rows,
      cols,
      saveEdit,
      cancelEdit,
      setActiveCell,
      startEdit,
      extendSelection,
      copy,
      paste,
      cut,
      clearCell,
    ]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return null;
};
