import { useEffect } from "react";
import { useTableStore } from "../store/tableStore";
import { ProgramRow } from "../types/table.types";

const editableFields: (keyof ProgramRow)[] = [
  "exercise",
  "sets",
  "reps",
  "load",
  "rpe",
  "rest",
  "notes",
];

export const useKeyboardNav = () => {
  const { activeWeekId, weeks, activeCell, setActiveCell, updateRow, duplicateDay, deleteRow } = useTableStore();
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ctrl+d duplication
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        duplicateDay(activeWeekId);
        return;
      }
      
      if (!activeCell) return;
      
      const activeWeek = weeks.find(w => w.id === activeWeekId);
      if (!activeWeek || activeWeek.days.length === 0) return;
      
      const rows = activeWeek.days[0].rows;
      const rowIndex = rows.findIndex(r => r.id === activeCell.rowId);
      const colIndex = editableFields.indexOf(activeCell.field);
      
      if (rowIndex === -1 || colIndex === -1) return;

      if (e.key === "Escape") {
        setActiveCell(null);
        // focus out pseudo-logic would happen via blurred input
      }

      // If they are not actively typing in an input (we assume if it is an input event, we should not hijack everything)
      // Actually we will hijack standard arrow keys unless they are inside an input?
      // For a real spreadsheet, if in edit mode, arrow left/right moves cursor, and enter confirms.
      // If NOT in edit mode, arrow keys move cell selection.
      // Let's implement simple enter to move down, shift+enter to move up
      if (e.key === "Enter") {
        e.preventDefault();
        if (e.shiftKey) {
          if (rowIndex > 0) setActiveCell(rows[rowIndex - 1].id, activeCell.field);
        } else {
          if (rowIndex < rows.length - 1) setActiveCell(rows[rowIndex + 1].id, activeCell.field);
        }
      }
      
      if (e.key === "Tab") {
        e.preventDefault();
        if (e.shiftKey) {
          if (colIndex > 0) setActiveCell(rows[rowIndex].id, editableFields[colIndex - 1]);
        } else {
          if (colIndex < editableFields.length - 1) setActiveCell(rows[rowIndex].id, editableFields[colIndex + 1]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeCell, activeWeekId, weeks, setActiveCell, duplicateDay]);
};
