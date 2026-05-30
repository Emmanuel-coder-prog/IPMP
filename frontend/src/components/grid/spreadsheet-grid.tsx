'use client';

import type { ColDef, GridApi, GridReadyEvent, CellValueChangedEvent } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Download, Plus, Search, Columns3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export interface SpreadsheetGridProps<T extends { id: string }> {
  rowData: T[];
  columnDefs: ColDef<T>[];
  loading?: boolean;
  onCellValueChanged?: (event: CellValueChangedEvent<T>) => void | Promise<void>;
  onAddRow?: () => void;
  addRowLabel?: string;
  height?: string;
  className?: string;
  quickFilterPlaceholder?: string;
}

export function SpreadsheetGrid<T extends { id: string }>({
  rowData,
  columnDefs,
  loading,
  onCellValueChanged,
  onAddRow,
  addRowLabel = 'Add Row',
  height = 'calc(100vh - 220px)',
  className,
  quickFilterPlaceholder = 'Search...',
}: SpreadsheetGridProps<T>) {
  const gridRef = useRef<AgGridReact<T>>(null);
  const [quickFilter, setQuickFilter] = useState('');
  const [hiddenCols, setHiddenCols] = useState<Record<string, boolean>>({});

  const defaultColDef = useMemo<ColDef>(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      minWidth: 100,
    }),
    [],
  );

  const onGridReady = useCallback((e: GridReadyEvent) => {
    e.api.sizeColumnsToFit();
  }, []);

  const handleExport = () => {
    gridRef.current?.api.exportDataAsCsv({ fileName: 'ipmp-export.csv' });
  };

  const toggleColumn = (field: string, visible: boolean) => {
    setHiddenCols((prev) => ({ ...prev, [field]: !visible }));
    gridRef.current?.api.setColumnsVisible([field], visible);
  };

  const colFields = columnDefs
    .map((c) => c.field)
    .filter((f): f is NonNullable<typeof f> => Boolean(f));

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-9 w-full max-w-md" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder={quickFilterPlaceholder}
            value={quickFilter}
            onChange={(e) => {
              setQuickFilter(e.target.value);
              gridRef.current?.api.setGridOption('quickFilterText', e.target.value);
            }}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {onAddRow && (
            <Button size="sm" onClick={onAddRow}>
              <Plus className="h-4 w-4" />
              {addRowLabel}
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Columns3 className="h-4 w-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {colFields.map((field) => (
                <DropdownMenuCheckboxItem
                  key={field}
                  checked={!hiddenCols[field]}
                  onCheckedChange={(checked) => toggleColumn(field, !!checked)}
                >
                  {field}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="spreadsheet-container rounded-xl border border-border shadow-sm">
        <div className="ag-theme-quartz ag-theme-ipmp" style={{ height, width: '100%' }}>
          <AgGridReact<T>
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            singleClickEdit
            stopEditingWhenCellsLoseFocus
            animateRows
            pagination
            paginationPageSize={50}
            paginationPageSizeSelector={[25, 50, 100]}
            rowSelection={{ mode: 'multiRow', checkboxes: true, headerCheckbox: true }}
            onGridReady={onGridReady}
            onCellValueChanged={onCellValueChanged}
            getRowId={(p) => p.data.id}
            suppressMovableColumns={false}
            enableCellTextSelection
            ensureDomOrder
          />
        </div>
      </div>
    </div>
  );
}
