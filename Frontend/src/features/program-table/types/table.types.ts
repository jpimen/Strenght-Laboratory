export type IntensityLevel = "LOW" | "MED" | "HIGH" | "MAX" | "PEAK" | "NONE";

export interface CellStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

export interface ProgramRow {
  id: string;
  exercise: string;
  sets: number;
  reps: string; // string to accommodate "8-10" or "FAIL"
  load: string; // string to accommodate "75% 1RM" or "60 KG"
  rpe: string; // string for "8.5"
  intensity: IntensityLevel;
  rest: number; // in seconds
  notes: string;
  cellStyles?: Record<string, CellStyle>;
}

export interface DayPlan {
  id: string;
  dayName: string;
  rows: ProgramRow[];
}

export interface WeekPlan {
  id: string;
  weekName: string;
  isActive: boolean;
  days: DayPlan[];
}

export interface ProgramMeta {
  name: string;
  duration: string;
  frequency: string;
  goal: string;
}
