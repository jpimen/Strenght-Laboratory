"use client";

import { useTableStore } from "../store/tableStore";
import { calculateVolume, calculateDuration } from "../utils/calculations";

export const SummaryPanel = () => {
  const { weeks, activeWeekId } = useTableStore();
  const activeWeek = weeks.find(w => w.id === activeWeekId);
  const rows = activeWeek?.days[0]?.rows || [];

  const totalVolume = calculateVolume(rows);
  const totalDuration = calculateDuration(rows);

  const formatNumber = (num: number) => new Intl.NumberFormat("en-US").format(num);

  return (
    <div className="flex space-x-12 pr-4">
      <div className="text-right">
        <p className="text-[9px] uppercase tracking-widest font-black mb-1 text-[#666]">
          Total Volume
        </p>
        <p className="text-[#facc15] font-black text-sm tracking-wide">
          {formatNumber(totalVolume)} KG
        </p>
      </div>
      <div className="text-right">
        <p className="text-[9px] uppercase tracking-widest font-black mb-1 text-[#666]">
          Estimated Duration
        </p>
        <p className="text-white font-black text-sm tracking-wide">
          {totalDuration} MIN
        </p>
      </div>
    </div>
  );
};
