'use client';

import { useCallback, useMemo, useState } from 'react';
import type { CellValueChangedEvent } from 'ag-grid-community';
import { AppShell } from '@/components/layout/app-shell';
import { SpreadsheetGrid } from '@/components/grid/spreadsheet-grid';
import { buildInventoryColumns } from '@/components/grid/product-columns';
import { useProducts, useProductMutations } from '@/hooks/queries/use-products';
import type { Product } from '@/lib/api/types';
import { toast } from 'sonner';

type DraftRow = Product & { _isDraft?: boolean };

export default function InventoryPage() {
  const { data, isLoading } = useProducts();
  const { create, update } = useProductMutations();
  const [draftRows, setDraftRows] = useState<DraftRow[]>([]);

  const rows = useMemo(() => {
    const server = data?.data ?? [];
    return [...draftRows, ...server];
  }, [data, draftRows]);

  const columnDefs = useMemo(() => buildInventoryColumns(), []);

  const handleAddRow = () => {
    const draft: DraftRow = {
      id: `temp-${crypto.randomUUID()}`,
      name: '',
      quantity: 1,
      unit: '',
      sku: null,
      status: 'PENDING_COSTING',
      unitCostPrice: null,
      totalCostPrice: null,
      oldSellingPrice: null,
      investmentFund: null,
      operationProfit: null,
      netProfit: null,
      payrollFund: null,
      otherCosts: null,
      grossProfit: null,
      priceBeforeTax: null,
      minimum4Percent: null,
      minimum20Percent: null,
      finalSellingPrice: null,
      printed: false,
      createdById: '',
      approvedById: null,
      costingCompletedById: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      _isDraft: true,
    };
    setDraftRows((prev) => [draft, ...prev]);
  };

  const handleCellChange = useCallback(
    async (event: CellValueChangedEvent<DraftRow>) => {
      const row = event.data;
      if (!row) return;
      const field = event.colDef.field;
      if (!field) return;

      if (row._isDraft || row.id.startsWith('temp-')) {
        if (!row.name || !row.unit || !row.quantity) return;
        try {
          const { data: created } = await create.mutateAsync({
            name: row.name,
            quantity: Number(row.quantity),
            unit: row.unit,
            sku: row.sku || undefined,
            oldSellingPrice: row.oldSellingPrice
              ? parseFloat(row.oldSellingPrice)
              : undefined,
          });
          setDraftRows((prev) => prev.filter((d) => d.id !== row.id));
          void created;
        } catch {
          // toast handled in mutation
        }
        return;
      }

      const payload: Record<string, unknown> = {};
      if (field === 'oldSellingPrice') {
        payload.oldSellingPrice = parseFloat(String(event.newValue)) || 0;
      } else if (field === 'quantity') {
        payload.quantity = parseInt(String(event.newValue), 10);
      } else {
        payload[field] = event.newValue;
      }

      update.mutate({ id: row.id, data: payload as Parameters<typeof update.mutate>[0]['data'] });
    },
    [create, update],
  );

  return (
    <AppShell title="Inventory Spreadsheet" allowedRoles={['INVENTORY']}>
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Product creation and inventory data entry. Click Add Row to create products inline.
        </p>
      </div>
      <SpreadsheetGrid
        rowData={rows}
        columnDefs={columnDefs}
        loading={isLoading}
        onAddRow={handleAddRow}
        onCellValueChanged={handleCellChange}
      />
    </AppShell>
  );
}
