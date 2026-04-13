'use client';

import { SpreadsheetGrid } from '@/features/spreadsheet-grid/components/SpreadsheetGrid';
import { useGridStore } from '@/features/spreadsheet-grid/store/gridStore';

export default function SpreadsheetPage() {
  const { clear, reset } = useGridStore();

  return (
    <main className="w-screen h-screen bg-[#0d0d0d]">
      <SpreadsheetGrid rows={20} cols={10} />
      
      {/* Floating Action Buttons */}
      <div className="fixed bottom-4 right-4 flex gap-2">
        <button
          onClick={clear}
          className={`
            px-3 py-2 rounded text-xs font-bold
            bg-red-900 hover:bg-red-800 text-red-100
            transition-colors cursor-pointer
            border border-red-700
          `}
        >
          Clear All
        </button>
        <button
          onClick={reset}
          className={`
            px-3 py-2 rounded text-xs font-bold
            bg-slate-700 hover:bg-slate-600 text-slate-100
            transition-colors cursor-pointer
            border border-slate-600
          `}
        >
          Reset
        </button>
      </div>
    </main>
  );
}
