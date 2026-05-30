'use client';

import { useCallback, useMemo } from 'react';
import type { CellValueChangedEvent } from 'ag-grid-community';
import { AppShell } from '@/components/layout/app-shell';
import { SpreadsheetGrid } from '@/components/grid/spreadsheet-grid';
import { buildProcurementColumns } from '@/components/grid/product-columns';
import { useProducts, useProductMutations } from '@/hooks/queries/use-products';
import type { Product } from '@/lib/api/types';

export default function ProcurementPage() {
  const { data, isLoading } = useProducts({ status: 'PENDING_COSTING' });
  const { applyCosting } = useProductMutations();

  const allProducts = useProducts();
  const rows = useMemo(() => {
    const pending = data?.data ?? [];
    const recent = (allProducts.data?.data ?? []).filter(
      (p) => p.status === 'COSTING_COMPLETED',
    );
    const map = new Map<string, Product>();
    [...pending, ...recent].forEach((p) => map.set(p.id, p));
    return Array.from(map.values());
  }, [data, allProducts.data]);

  const columnDefs = useMemo(() => buildProcurementColumns(), []);

  const handleCellChange = useCallback(
    (event: CellValueChangedEvent<Product>) => {
      const row = event.data;
      if (!row || event.colDef.field !== 'unitCostPrice') return;
      const value = parseFloat(String(event.newValue));
      if (Number.isNaN(value) || value < 0) return;
      applyCosting.mutate({ id: row.id, unitCostPrice: value });
    },
    [applyCosting],
  );

  return (
    <AppShell title="Procurement Spreadsheet" allowedRoles={['PROCUREMENT']}>
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Costing operations. Only Unit Cost Price is editable.
        </p>
      </div>
      <SpreadsheetGrid
        rowData={rows}
        columnDefs={columnDefs}
        loading={isLoading || allProducts.isLoading}
        onCellValueChanged={handleCellChange}
        quickFilterPlaceholder="Search inventory..."
      />
    </AppShell>
  );
}
