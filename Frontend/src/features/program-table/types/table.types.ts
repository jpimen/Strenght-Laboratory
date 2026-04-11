export type IntensityLevel = "LOW" | "MED" | "HIGH" | "MAX" | "PEAK" | "NONE";

export interface CellStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  color?: string;
  backgroundColor?: string;
}

export interface ColumnDefinition {
  id: string; // The field key in the row object (e.g., 'exercise' or 'A', 'B')
  label?: string; // Legacy display name (headers are auto-generated from index)
  width: number | string; // px width (supports legacy string values from persisted state)
}

export interface ProgramRow {
  id: string;
  [key: string]: any; // Allow unlimited dynamic columns
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
