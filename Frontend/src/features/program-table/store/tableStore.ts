import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { ProgramRow, ProgramMeta, WeekPlan } from "../types/table.types";

const MOCK_ROWS: ProgramRow[] = [
  {
    id: "mock-1",
    exercise: "BARBELL BACK SQUAT (HIGH BAR)",
    sets: 4,
    reps: "8",
    load: "75",
    rpe: "8",
    intensity: "PEAK",
    rest: 180,
    notes: "TEMPO 3-1-1-0. FOCUS ON DEPTH.",
  },
  {
    id: "mock-2",
    exercise: "ROMANIAN DEADLIFT",
    sets: 3,
    reps: "12",
    load: "140",
    rpe: "7",
    intensity: "MED",
    rest: 90,
    notes: "NO STRAPS IF POSSIBLE.",
  },
  {
    id: "mock-3",
    exercise: "LEG PRESS (NEUTRAL STANCE)",
    sets: 3,
    reps: "15",
    load: "100",
    rpe: "9",
    intensity: "HIGH",
    rest: 120,
    notes: "CONSTANT TENSION, NO LOCKOUT.",
  },
  {
    id: "mock-4",
    exercise: "SEATED CALF RAISES",
    sets: 5,
    reps: "20",
    load: "60",
    rpe: "10",
    intensity: "MAX",
    rest: 60,
    notes: "STRETCH AT THE BOTTOM FOR 2S.",
  },
  {
    id: "mock-5",
    exercise: "LEG CURLS (LYING)",
    sets: 4,
    reps: "12",
    load: "65",
    rpe: "8",
    intensity: "MED",
    rest: 90,
    notes: "DROP SET ON FINAL SET.",
  },
];

interface TableState {
  meta: ProgramMeta;
  weeks: WeekPlan[];
  activeWeekId: string;
  activeCell: { rowId: string; field: keyof ProgramRow } | null;
  zoomLevel: number;
  isHydrated: boolean;
  // Actions
  setActiveWeek: (weekId: string) => void;
  setActiveCell: (rowId: string | null, field?: keyof ProgramRow) => void;
  updateRow: (weekId: string, rowId: string, field: keyof ProgramRow, value: any) => void;
  addRow: (weekId: string, index?: number) => void;
  deleteRow: (weekId: string, rowId: string) => void;
  duplicateDay: (weekId: string) => void;
  setZoomLevel: (level: number) => void;
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
              rows: MOCK_ROWS,
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
      zoomLevel: 12,
      isHydrated: false,
      setActiveWeek: (weekId) => set((state) => ({ activeWeekId: weekId })),
      setActiveCell: (rowId, field) => set(() => {
        if (!rowId || !field) return { activeCell: null };
        return { activeCell: { rowId, field } };
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
      set: (fn: any) => set(fn),
    }),
    {
      name: "strength-laboratory-storage",
      onRehydrateStorage: () => (state) => {
        state?.set({ isHydrated: true });
      },
    }
  )
);
