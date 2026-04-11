import { useTableStore } from "../store/tableStore";
import { getGridStyle } from "../utils/grid";
import { getSpreadsheetColumnLabel } from "../utils/columns";

export const TableHeader = () => {
  const { columns } = useTableStore();
  const gridStyle = getGridStyle(columns);

  return (
    <div 
      className="grid w-max border-b border-[#333] bg-[#1a1a1a] text-[#777] text-[10px] font-sans font-bold tracking-widest uppercase sticky top-0 z-20"
      style={gridStyle}
    >
      <div className="px-3 py-3 border-r border-[#333] sticky left-0 z-30 bg-[#1a1a1a]"></div>
      {columns.map((col, idx) => (
        <div 
          key={col.id} 
          className={`px-3 py-3 ${idx === columns.length - 1 ? '' : 'border-r border-[#333]'} flex items-center justify-center`}
        >
          {getSpreadsheetColumnLabel(idx)}
        </div>
      ))}
    </div>
  );
};
