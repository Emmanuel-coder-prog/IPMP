'use client';

import { useCallback, useMemo, useState } from 'react';
import type { CellValueChangedEvent } from 'ag-grid-community';
import { AppShell } from '@/components/layout/app-shell';
import { SpreadsheetGrid } from '@/components/grid/spreadsheet-grid';
import { buildAdminColumns } from '@/components/grid/product-columns';
import { useProducts, useProductMutations } from '@/hooks/queries/use-products';
import type { Product } from '@/lib/api/types';
import { WorkflowPipeline } from '@/components/shared/workflow-pipeline';
import { ApprovalPanel } from '@/components/grid/approval-panel';
import { formatCurrency } from '@/lib/utils';

type DraftRow = Product & { _isDraft?: boolean };

export default function WorkspacePage() {
  const { data, isLoading } = useProducts();
  const { create, update, approve, reject, updatePrinted, updateFinalPrice } =
    useProductMutations();
  const [draftRows, setDraftRows] = useState<DraftRow[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const rows = useMemo(() => {
    return [...draftRows, ...(data?.data ?? [])];
  }, [data, draftRows]);

  const handleApprove = useCallback(
    (product: Product) => {
      const finalPrice = parseFloat(
        product.finalSellingPrice ?? product.minimum20Percent ?? '0',
      );
      approve.mutate({
        id: product.id,
        finalSellingPrice: finalPrice,
        printed: product.printed,
      });
    },
    [approve],
  );

  const handleReject = useCallback(
    (product: Product) => {
      reject.mutate({ id: product.id });
    },
    [reject],
  );

  const columnDefs = useMemo(
    () =>
      buildAdminColumns(
        (p) => {
          setSelected(p);
          setPanelOpen(true);
        },
        handleReject,
      ),
    [handleReject],
  );

  const handleAddRow = () => {
    setDraftRows((prev) => [
      {
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
      },
      ...prev,
    ]);
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
          await create.mutateAsync({
            name: row.name,
            quantity: Number(row.quantity),
            unit: row.unit,
            sku: row.sku || undefined,
            oldSellingPrice: row.oldSellingPrice
              ? parseFloat(row.oldSellingPrice)
              : undefined,
          });
          setDraftRows((prev) => prev.filter((d) => d.id !== row.id));
        } catch {
          // handled
        }
        return;
      }

      if (field === 'printed') {
        updatePrinted.mutate({ id: row.id, printed: !!event.newValue });
        return;
      }

      if (field === 'finalSellingPrice' && row.status === 'APPROVED') {
        updateFinalPrice.mutate({
          id: row.id,
          finalSellingPrice: parseFloat(String(event.newValue)) || 0,
        });
        return;
      }

      const payload: Record<string, unknown> = {};
      if (['oldSellingPrice', 'unitCostPrice'].includes(field)) {
        payload[field] = parseFloat(String(event.newValue)) || 0;
      } else if (field === 'quantity') {
        payload.quantity = parseInt(String(event.newValue), 10);
      } else {
        payload[field] = event.newValue;
      }

      update.mutate({
        id: row.id,
        data: payload as Parameters<typeof update.mutate>[0]['data'],
      });

      setSelected(row);
    },
    [create, update, updatePrinted, updateFinalPrice],
  );

  return (
    <AppShell title="Admin Workspace" allowedRoles={['ADMIN']}>
      <WorkflowPipeline />
      <div className="mb-4 mt-4">
        <p className="text-sm text-muted-foreground">
          Unified spreadsheet — manage products, costing, approvals, and pricing inline.
        </p>
      </div>
      <SpreadsheetGrid
        rowData={rows}
        columnDefs={columnDefs}
        loading={isLoading}
        onAddRow={handleAddRow}
        onCellValueChanged={handleCellChange}
      />
      <ApprovalPanel
        product={selected}
        open={panelOpen}
        onOpenChange={setPanelOpen}
        onApprove={handleApprove}
      />
    </AppShell>
  );
}
