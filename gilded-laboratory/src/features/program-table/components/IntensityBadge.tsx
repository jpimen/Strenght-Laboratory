import { IntensityLevel } from "../types/table.types";

export const IntensityBadge = ({ level }: { level: IntensityLevel | string }) => {
  switch (level) {
    case "PEAK":
      return (
        <span className="text-[#facc15] border border-[#facc15] px-2 py-0.5 text-[9px] bg-[#facc15]/10 font-bold tracking-widest inline-block text-center min-w-[50px]">
          PEAK
        </span>
      );
    case "MED":
      return (
        <span className="text-[#ccc] border border-[#ccc] px-2 py-0.5 text-[9px] bg-white/10 font-bold tracking-widest inline-block text-center min-w-[50px]">
          MED
        </span>
      );
    case "HIGH":
      return (
        <span className="text-black border border-[#facc15] px-2 py-0.5 text-[9px] bg-[#facc15] font-bold tracking-widest inline-block text-center min-w-[50px]">
          HIGH
        </span>
      );
    case "MAX":
      return (
        <span className="text-[#facc15] border border-[#facc15] px-2 py-0.5 text-[9px] bg-[#333] font-bold tracking-widest inline-block text-center min-w-[50px]">
          MAX
        </span>
      );
    default:
      return <span>{level !== "NONE" ? level : ""}</span>;
  }
};
