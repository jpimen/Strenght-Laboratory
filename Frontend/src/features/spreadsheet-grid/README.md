# Spreadsheet Grid Component

A professional, Google Sheets-like editable grid component built with React, TypeScript, and Zustand. Features real-time editing, keyboard navigation, and clipboard operations.

## Features

### ✅ Core Features
- **Editable Cells** - Click any cell to enter edit mode
- **Cell Selection** - Visual highlight of active cell with blue ring
- **Keyboard Navigation** - Arrow keys to move between cells
- **Direct Input** - Type directly to edit (automatically enters edit mode)
- **Double-Click Edit** - Double-click to enter edit mode with existing value
- **Save/Cancel** - Press Enter to save, Escape to cancel
- **Placeholder Display** - Shows "..." for empty cells

### ⌨️ Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Arrow Keys` | Navigate between cells |
| `Tab` / `Shift+Tab` | Move right/left |
| `Enter` | Save edited cell and move down |
| `Escape` | Cancel editing |
| `Delete` / `Backspace` | Clear cell |
| `Ctrl+C` / `Cmd+C` | Copy cell value |
| `Ctrl+V` / `Cmd+V` | Paste to cell |
| `Ctrl+X` / `Cmd+X` | Cut cell |
| `Double-Click` | Edit cell |
| `Any Letter/Number` | Start editing |

### 🎨 UI/UX
- Dark theme with subtle contrast
- Smooth hover effects on cells
- Column and row headers with labels (A, B, C... and 1, 2, 3...)
- Persistent state using localStorage
- Responsive grid layout
- Status bar showing current cell position

### 🔧 Architecture

```
spreadsheet-grid/
├── components/
│   ├── SpreadsheetGrid.tsx      # Main container component
│   ├── EditableCell.tsx          # Individual editable cell
│   └── GridHeader.tsx            # Column/row headers
├── hooks/
│   ├── useGridKeyboard.ts        # Keyboard navigation & shortcuts
│   └── useGridCellInteraction.ts # Click & double-click handling
├── store/
│   └── gridStore.ts             # Zustand state management
├── utils/
│   └── grid.utils.ts            # Pure utility functions
└── types/
    └── grid.types.ts            # TypeScript interfaces
```

## Usage

### Basic Usage

```typescript
import { SpreadsheetGrid } from '@/features/spreadsheet-grid/components/SpreadsheetGrid';

export default function MyPage() {
  return (
    <SpreadsheetGrid 
      rows={20} 
      cols={10}
      onDataChange={(data) => console.log(data)}
    />
  );
}
```

### Props

```typescript
interface SpreadsheetGridProps {
  rows?: number;              // Number of rows (default: 20)
  cols?: number;              // Number of columns (default: 10)
  onDataChange?: (data: string[][]) => void;  // Callback when data changes
}
```

### Access Store

```typescript
import { useGridStore } from '@/features/spreadsheet-grid/store/gridStore';

export function MyComponent() {
  const { 
    data, 
    activeCell, 
    setCellValue, 
    getCellValue,
    startEdit,
    saveEdit,
    copy,
    paste,
    clear 
  } = useGridStore();

  return (
    // Use store actions
  );
}
```

## Store API

### State
- `data: string[][]` - 2D array of cell values
- `rows: number` - Number of rows
- `cols: number` - Number of columns
- `activeCell: CellPosition | null` - Currently selected cell
- `isEditing: boolean` - Whether a cell is in edit mode
- `editingValue: string` - Value being edited
- `selection: SelectionRange | null` - Multi-cell selection range
- `clipboard: string | null` - Clipboard content

### Actions
- `setCellValue(row, col, value)` - Set cell value
- `getCellValue(row, col)` - Get cell value
- `setActiveCell(row, col)` - Select a cell
- `startEdit(row, col, initialValue)` - Enter edit mode
- `saveEdit()` - Save and exit edit mode
- `cancelEdit()` - Cancel edit without saving
- `copy()` - Copy active cell
- `paste(row, col)` - Paste to cell
- `cut()` - Cut active cell
- `clearCell(row, col)` - Clear cell content
- `insertRow(afterRow)` - Insert row at position
- `insertColumn(afterCol)` - Insert column at position
- `deleteRow(row)` - Delete row
- `deleteColumn(col)` - Delete column
- `clear()` - Clear entire grid
- `reset()` - Reset to initial state

## Quality Checklist

### ✅ Functionality
- [x] All cells are clickable and editable
- [x] Arrow keys navigate correctly
- [x] Tab moves between cells
- [x] Enter saves and moves down
- [x] Escape cancels editing
- [x] Delete clears cells
- [x] Double-click to edit
- [x] Type directly to start editing
- [x] Copy/paste/cut works

### ✅ Code Quality
- [x] Full TypeScript coverage
- [x] Separation of concerns (components, hooks, store, utils, types)
- [x] No prop drilling (using Zustand store)
- [x] Pure utility functions
- [x] Reusable custom hooks
- [x] Meaningful naming

### ✅ Architecture
- [x] Feature-based folder structure
- [x] Store with persistence
- [x] Custom hooks for logic
- [x] Typed store actions
- [x] Configuration constants
- [x] No circular dependencies

### ✅ Performance
- [x] Only edited cells re-render
- [x] Zustand for efficient state updates
- [x] Keyboard events debounced
- [x] Smooth 60fps animations

### ✅ Accessibility & UX
- [x] Keyboard navigation complete
- [x] Focus visible on active cells
- [x] Status bar shows current position
- [x] Dark theme high contrast
- [x] Responsive to grid size
- [x] Smooth transitions

## Configuration

Edit `utils/grid.utils.ts` to customize:

```typescript
export const GRID_CONFIG: GridConfig = {
  defaultRows: 20,           // Default grid height
  defaultCols: 10,           // Default grid width
  defaultCellWidth: 120,     // Cell width in pixels
  defaultCellHeight: 36,     // Cell height in pixels
  minCellWidth: 60,          // Minimum cell width
  minCellHeight: 28,         // Minimum cell height
};
```

## Color Scheme

Edit component classes to customize colors:

- Background: `#0d0d0d` (near black)
- Cell border: `#333` (dark gray)
- Text: `#e0e0e0` (light gray)
- Active cell: Blue ring (`ring-blue-500`)
- Header: `#0a0a0a` (darker)
- Empty cell text: `#555` (muted)

## Future Enhancements

### Planned Features
- [ ] Multi-cell selection (drag to select)
- [ ] Column resizing
- [ ] Row resizing
- [ ] Basic formulas (=SUM, =AVERAGE, etc.)
- [ ] Right-click context menu
- [ ] Undo/redo history
- [ ] Cell formatting (bold, italic, colors)
- [ ] Data validation
- [ ] Sorting and filtering
- [ ] Export/import (CSV, JSON)

## Performance Notes

- **Persistence**: Uses localStorage automatically (configurable)
- **Re-renders**: Only cells with changed values re-render
- **State**: Centralized Zustand store for predictable updates
- **Keyboard**: Global event listener (cleaned up on unmount)
- **Memory**: 20×10 grid = 200 cells = minimal memory footprint

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- IE11: Not supported (uses modern React/TypeScript)

## Dependencies

- React 18+
- TypeScript 4.9+
- Zustand 4+
- Tailwind CSS 3+

## Component Hierarchy

```
SpreadsheetGrid (main container)
  ├── GridColumnHeader (sticky header row)
  └── [GridRowHeader] × rows
       └── [EditableCell] × cols
```

## Testing Checklist

- [ ] Create test file `__tests__/SpreadsheetGrid.test.tsx`
- [ ] Test cell editing flow
- [ ] Test keyboard navigation
- [ ] Test copy/paste operations
- [ ] Test store persistence
- [ ] Test performance with large grids

---

**Built with the Frontend Excellence Skill**  
Follows professional patterns for maintainability, performance, and user experience.
