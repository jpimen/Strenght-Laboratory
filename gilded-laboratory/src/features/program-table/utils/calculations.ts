import { ProgramRow } from "../types/table.types";

export const getNumericValue = (str: string | number): number => {
  if (typeof str === "number") return str;
  if (!str) return 0;
  
  // Try to extract a pure number from things like "100 KG", "10", "8-10" (take highest?)
  // For simplicity, match first sequence of digits
  const match = str.match(/\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : 0;
};

export const calculateVolume = (rows: ProgramRow[]): number => {
  return rows.reduce((acc, row) => {
    const sets = getNumericValue(row.sets);
    const reps = getNumericValue(row.reps);
    const load = getNumericValue(row.load); // Will ignore "MAX LOAD" parsing easily right now unless coded specifically
    return acc + (sets * reps * load);
  }, 0);
};

export const calculateDuration = (rows: ProgramRow[]): number => {
  // Approximate duration logic:
  // sets * (reps * 4s per rep + rest) + 60s setup time per exercise
  return rows.reduce((acc, row) => {
    const sets = getNumericValue(row.sets);
    const reps = getNumericValue(row.reps);
    const rest = getNumericValue(row.rest);
    
    // Each exercise base setup = 60s
    // active set time = reps * 4s
    // rest time = rest (seconds)
    const activeTimePerSet = reps * 4;
    const timeInSeconds = 60 + sets * (activeTimePerSet + rest);
    
    return acc + Math.round(timeInSeconds / 60); // convert to minutes
  }, 0);
};
