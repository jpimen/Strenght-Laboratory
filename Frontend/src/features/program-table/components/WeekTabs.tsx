"use client";

import { motion } from "framer-motion";
import { useTableStore } from "../store/tableStore";
import { Activity, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export const WeekTabs = () => {
  const { weeks, activeWeekId, setActiveWeek } = useTableStore();

  return (
    <div className="flex border-b border-[#333] bg-[#0a0a0a] text-[11px] font-black tracking-widest uppercase font-sans mt-0 overflow-x-auto">
      {weeks.map((week) => {
        const isActive = activeWeekId === week.id;
        const isPeakDeload = week.id === "peak" || week.id === "deload";

        return (
          <div
            key={week.id}
            onClick={() => setActiveWeek(week.id)}
            className={cn(
              "relative px-8 py-3 cursor-pointer flex items-center space-x-2 border-t-2 transition-colors",
              isActive ? "bg-[#161616] text-[#facc15] border-[#facc15]" : "hover:bg-[#111] text-[#777] border-transparent"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabOutline"
                className="absolute top-0 left-0 right-0 h-0.5 bg-[#facc15]"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            
            {isPeakDeload ? (
              <Activity className={cn("w-3.5 h-3.5", isActive ? "text-[#facc15]" : "text-[#444]")} />
            ) : (
              <div className={cn("w-1.5 h-1.5 rounded-sm", isActive ? "bg-[#facc15]" : "bg-[#444]")} />
            )}
            <span>{week.weekName}</span>
          </div>
        );
      })}
      <div className="px-8 py-3 cursor-pointer hover:bg-[#1a1a1a] text-[#facc15] flex items-center space-x-2 ml-4">
        <Plus className="w-3.5 h-3.5" />
        <span>NEW CYCLE</span>
      </div>
    </div>
  );
};
