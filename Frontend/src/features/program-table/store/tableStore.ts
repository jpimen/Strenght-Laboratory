import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { ProgramRow, ProgramMeta, WeekPlan, CellStyle } from "../types/table.types";

import { ColumnDefinition } from "../types/table.types";

const INITIAL_COLUMNS: ColumnDefinition[] = [
  { id: "exercise", label: "A: EXERCISE", width: "2.5fr" },
  { id: "sets", label: "B: SETS", width: "1fr" },
  { id: "reps", label: "C: REPS", width: "1fr" },
  { id: "load", label: "D: LOAD (%/KG)", width: "1.5fr" },
  { id: "rpe", label: "E: RPE", width: "1fr" },
  { id: "intensity", label: "F: INTENSITY", width: "1fr" },
  { id: "rest", label: "G: REST (S)", width: "1fr" },
  { id: "notes", label: "H: NOTES", width: "3.5fr" },
];

// Only core columns A through H
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
// No I-Z loop

const generateInitialRows = (count: number): ProgramRow[] => {
  const rows: ProgramRow[] = [];
  // Small set of mock data
  const baseData = [
    { exercise: "BARBELL BACK SQUAT (HIGH BAR)", sets: 4, reps: "8", load: "75", rpe: "8", intensity: "PEAK", rest: 180, notes: "TEMPO 3-1-1-0. FOCUS ON DEPTH." },
    { exercise: "ROMANIAN DEADLIFT", sets: 3, reps: "12", load: "140", rpe: "7", intensity: "MED", rest: 90, notes: "NO STRAPS IF POSSIBLE." },
    { exercise: "LEG PRESS (NEUTRAL STANCE)", sets: 3, reps: "15", load: "100", rpe: "9", intensity: "HIGH", rest: 120, notes: "CONSTANT TENSION, NO LOCKOUT." },
    { exercise: "SEATED CALF RAISES", sets: 5, reps: "20", load: "60", rpe: "10", intensity: "MAX", rest: 60, notes: "STRETCH AT THE BOTTOM FOR 2S." },
    { exercise: "LEG CURLS (LYING)", sets: 4, reps: "12", load: "65", rpe: "8", intensity: "MED", rest: 90, notes: "DROP SET ON FINAL SET." },
  ];

  for (let i = 0; i < count; i++) {
    const data = baseData[i] || {};
    rows.push({
      id: uuidv4(),
      ...data,
    });
  }
  return rows;
};

const INITIAL_ROWS = generateInitialRows(10);

interface TableState {
  meta: ProgramMeta;
  weeks: WeekPlan[];
  activeWeekId: string;
  activeCell: { rowId: string; field: string } | null;
  selectionStart: { rowId: string; field: string } | null;
  selectionEnd: { rowId: string; field: string } | null;
  isDraggingSelection: boolean;
  zoomLevel: number;
  columns: ColumnDefinition[];
  // Actions
  setActiveWeek: (weekId: string) => void;
  setActiveCell: (rowId: string | null, field?: string) => void;
  updateRow: (weekId: string, rowId: string, field: string, value: any) => void;
  addRow: (weekId: string, index?: number) => void;
  deleteRow: (weekId: string, rowId: string) => void;
  duplicateDay: (weekId: string) => void;
  setZoomLevel: (level: number) => void;
  toggleCellStyle: (weekId: string, rowId: string, field: string, style: keyof CellStyle) => void;
  setCellStyle: (weekId: string, rowId: string, field: string, style: Partial<CellStyle>) => void;
  setSelectionStart: (rowId: string, field: string) => void;
  setSelectionEnd: (rowId: string, field: string) => void;
  setIsDraggingSelection: (isDragging: boolean) => void;
  clearSelection: () => void;
}

export const useTableStore = create<TableState>()(
  persist(
    (set) => ({
      meta: {
        name: "Hypertrophy Lab Phase 01",
        duration: "12 Weeks",
        frequency: "5 Days / Week",
        goal: "Mechanical Tension / Sarcoplasmic",
      },
      weeks: [
        {
          id: "w1",
          weekName: "WEEK 1",
          isActive: true,
          days: [
            {
              id: "d1",
              dayName: "DAY 1",
              rows: INITIAL_ROWS,
            },
          ],
        },
        { id: "w2", weekName: "WEEK 2", isActive: false, days: [] },
        { id: "w3", weekName: "WEEK 3", isActive: false, days: [] },
        { id: "w4", weekName: "WEEK 4", isActive: false, days: [] },
        { id: "peak", weekName: "PEAK", isActive: false, days: [] },
        { id: "deload", weekName: "DELOAD", isActive: false, days: [] },
      ],
      activeWeekId: "w1",
      activeCell: null,
      selectionStart: null,
      selectionEnd: null,
      isDraggingSelection: false,
      zoomLevel: 12,
      columns: INITIAL_COLUMNS,
      setActiveWeek: (weekId) => set((state) => ({ activeWeekId: weekId })),
      setActiveCell: (rowId, field) => set(() => {
        if (!rowId || !field) return { activeCell: null };
        return { activeCell: { rowId, field: field as any }, selectionStart: { rowId, field: field as any }, selectionEnd: { rowId, field: field as any } };
      }),
      updateRow: (weekId, rowId, field, value) => set((state) => {
        const newWeeks = state.weeks.map(week => {
          if (week.id !== weekId) return week;
          return {
            ...week,
            days: week.days.map(day => ({
              ...day,
              rows: day.rows.map(row => 
                row.id === rowId ? { ...row, [field]: value } : row
              )
            }))
          };
        });
        return { weeks: newWeeks };
      }),
      addRow: (weekId, index) => set((state) => {
        const newEmptyRow: ProgramRow = {
          id: uuidv4(),
          exercise: "",
          sets: 0,
          reps: "",
          load: "",
          rpe: "",
          intensity: "NONE",
          rest: 0,
          notes: "",
        };
        
        // For simplicity, add to the first day of the week
        const newWeeks = state.weeks.map(week => {
          if (week.id !== weekId) return week;
          if (week.days.length === 0) return week;
          const day = week.days[0];
          const newRows = [...day.rows];
          newRows.push(newEmptyRow); // simply append for now
          return {
            ...week,
            days: [{ ...day, rows: newRows }]
          };
        });
        return { weeks: newWeeks };
      }),
      deleteRow: (weekId, rowId) => set((state) => {
        const newWeeks = state.weeks.map(week => {
          if (week.id !== weekId) return week;
          return {
            ...week,
            days: week.days.map(day => ({
              ...day,
              rows: day.rows.filter(row => row.id !== rowId)
            }))
          };
        });
        return { weeks: newWeeks };
      }),
      duplicateDay: (weekId) => set((state) => {
        // duplicate rows of the currently active day - simplify logic to just append a copy
        // in a real app you'd probably create `DAY 2`
        return state;
      }),
      setZoomLevel: (level) => set({ zoomLevel: level }),

      setSelectionStart: (rowId, field) => set({ 
        selectionStart: { rowId, field }, 
        selectionEnd: { rowId, field },
        isDraggingSelection: true,
        activeCell: { rowId, field } 
      }),
      setSelectionEnd: (rowId, field) => set((state) => {
        if (!state.isDraggingSelection) return state;
        return { selectionEnd: { rowId, field } };
      }),
      setIsDraggingSelection: (isDragging) => set({ isDraggingSelection: isDragging }),
      clearSelection: () => set({ selectionStart: null, selectionEnd: null, isDraggingSelection: false }),

      toggleCellStyle: (weekId, rowId, field, style) => set((state) => {
        // If there's a multi-selection, apply to all. Otherwise apply to specific cell.
        const cellsToUpdate: { rowId: string; field: string }[] = [];
        
        if (state.selectionStart && state.selectionEnd) {
          const activeWeek = state.weeks.find(w => w.id === weekId);
          if (activeWeek && activeWeek.days.length > 0) {
            const rows = activeWeek.days[0].rows;
            const fields = state.columns.map(c => c.id);
            
            const startRowIdx = rows.findIndex(r => r.id === state.selectionStart!.rowId);
            const endRowIdx = rows.findIndex(r => r.id === state.selectionEnd!.rowId);
            const startFieldIdx = fields.indexOf(state.selectionStart!.field);
            const endFieldIdx = fields.indexOf(state.selectionEnd!.field);
            
            const rStart = Math.min(startRowIdx, endRowIdx);
            const rEnd = Math.max(startRowIdx, endRowIdx);
            const fStart = Math.min(startFieldIdx, endFieldIdx);
            const fEnd = Math.max(startFieldIdx, endFieldIdx);
            
            for (let r = rStart; r <= rEnd; r++) {
              for (let f = fStart; f <= fEnd; f++) {
                cellsToUpdate.push({ rowId: rows[r].id, field: fields[f] });
              }
            }
          }
        } else {
          cellsToUpdate.push({ rowId, field });
        }

        const newWeeks = state.weeks.map(week => {
          if (week.id !== weekId) return week;
          return {
            ...week,
            days: week.days.map(day => ({
              ...day,
              rows: day.rows.map(row => {
                const cellUpdate = cellsToUpdate.filter(c => c.rowId === row.id);
                if (cellUpdate.length === 0) return row;
                
                const nextStyles = { ...(row.cellStyles || {}) };
                cellUpdate.forEach(c => {
                  const currentStyle = nextStyles[c.field] || {};
                  nextStyles[c.field] = {
                    ...currentStyle,
                    [style]: !currentStyle[style]
                  };
                });
                
                return { ...row, cellStyles: nextStyles };
              })
            }))
          };
        });
        return { weeks: newWeeks };
      }),
      setCellStyle: (weekId, rowId, field, style) => set((state) => {
        const cellsToUpdate: { rowId: string; field: string }[] = [];
        
        if (state.selectionStart && state.selectionEnd) {
          const activeWeek = state.weeks.find(w => w.id === weekId);
          if (activeWeek && activeWeek.days.length > 0) {
            const rows = activeWeek.days[0].rows;
            const fields = state.columns.map(c => c.id);
            const startRowIdx = rows.findIndex(r => r.id === state.selectionStart!.rowId);
            const endRowIdx = rows.findIndex(r => r.id === state.selectionEnd!.rowId);
            const startFieldIdx = fields.indexOf(state.selectionStart!.field);
            const endFieldIdx = fields.indexOf(state.selectionEnd!.field);
            const rStart = Math.min(startRowIdx, endRowIdx);
            const rEnd = Math.max(startRowIdx, endRowIdx);
            const fStart = Math.min(startFieldIdx, endFieldIdx);
            const fEnd = Math.max(startFieldIdx, endFieldIdx);
            
            for (let r = rStart; r <= rEnd; r++) {
              for (let f = fStart; f <= fEnd; f++) {
                cellsToUpdate.push({ rowId: rows[r].id, field: fields[f] });
              }
            }
          }
        } else {
          cellsToUpdate.push({ rowId, field });
        }

        const newWeeks = state.weeks.map(week => {
          if (week.id !== weekId) return week;
          return {
            ...week,
            days: week.days.map(day => ({
              ...day,
              rows: day.rows.map(row => {
                const cellUpdate = cellsToUpdate.filter(c => c.rowId === row.id);
                if (cellUpdate.length === 0) return row;
                
                const nextStyles = { ...(row.cellStyles || {}) };
                cellUpdate.forEach(c => {
                  const currentStyle = nextStyles[c.field] || {};
                  nextStyles[c.field] = {
                    ...currentStyle,
                    ...style
                  };
                });
                
                return { ...row, cellStyles: nextStyles };
              })
            }))
          };
        });
        return { weeks: newWeeks };
      }),
    }),
    {
      name: "strength-laboratory-limited",
    }
  )
);
