export const TableHeader = () => {
  return (
    <div className="grid grid-cols-[40px_2.5fr_1fr_1fr_1.5fr_1fr_1fr_1fr_3.5fr] border-b border-[#333] bg-[#1a1a1a] text-[#777] text-[10px] font-sans font-bold tracking-widest uppercase sticky top-0 z-10">
      <div className="px-3 py-3 border-r border-[#333]"></div>
      <div className="px-3 py-3 border-r border-[#333] flex items-center justify-center">
        A: EXERCISE
      </div>
      <div className="px-3 py-3 border-r border-[#333] flex items-center justify-center">
        B: SETS
      </div>
      <div className="px-3 py-3 border-r border-[#333] flex items-center justify-center">
        C: REPS
      </div>
      <div className="px-3 py-3 border-r border-[#333] flex items-center justify-center">
        D: LOAD (%/KG)
      </div>
      <div className="px-3 py-3 border-r border-[#333] flex items-center justify-center">
        E: RPE
      </div>
      <div className="px-3 py-3 border-r border-[#333] flex items-center justify-center">
        F: INTENSITY
      </div>
      <div className="px-3 py-3 border-r border-[#333] flex items-center justify-center">
        G: REST (S)
      </div>
      <div className="px-3 py-3 flex items-center justify-center">
        H: NOTES
      </div>
    </div>
  );
};
