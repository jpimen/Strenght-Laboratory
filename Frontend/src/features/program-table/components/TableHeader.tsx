import { useTableStore } from "../store/tableStore";

export const TableHeader = () => {
  const { columns } = useTableStore();
  
  const gridTemplate = `40px ${columns.map(c => c.width).join(' ')}`;

  return (
    <div 
      className="grid border-b border-[#333] bg-[#1a1a1a] text-[#777] text-[10px] font-sans font-bold tracking-widest uppercase sticky top-0 z-10"
      style={{ gridTemplateColumns: gridTemplate }}
    >
      <div className="px-3 py-3 border-r border-[#333]"></div>
      {columns.map((col, idx) => (
        <div 
          key={col.id} 
          className={`px-3 py-3 ${idx === columns.length - 1 ? '' : 'border-r border-[#333]'} flex items-center justify-center`}
        >
          {col.label}
        </div>
      ))}
    </div>
  );
};
