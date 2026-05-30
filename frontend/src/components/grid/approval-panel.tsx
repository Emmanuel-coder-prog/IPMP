'use client';

import type { Product } from '@/lib/api/types';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';

interface ApprovalPanelProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove?: (product: Product) => void;
}

export function ApprovalPanel({ product, open, onOpenChange, onApprove }: ApprovalPanelProps) {
  if (!product) return null;

  const breakdown = [
    { label: 'Unit Cost Price', value: product.unitCostPrice },
    { label: 'Total Cost Price', value: product.totalCostPrice },
    { label: 'Investment Fund', value: product.investmentFund },
    { label: 'Operation Profit', value: product.operationProfit },
    { label: 'Net Profit', value: product.netProfit },
    { label: 'Payroll Fund', value: product.payrollFund },
    { label: 'Other Costs', value: product.otherCosts },
    { label: 'Gross Profit', value: product.grossProfit },
    { label: 'Price Before Tax', value: product.priceBeforeTax },
    { label: 'Minimum @ 20%', value: product.minimum20Percent },
    { label: 'Minimum @ 4%', value: product.minimum4Percent },
    { label: 'Final Selling Price', value: product.finalSellingPrice },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{product.name}</SheetTitle>
          <div className="flex items-center gap-2 pt-1">
            <StatusBadge status={product.status} />
            {product.sku && (
              <span className="text-sm text-muted-foreground">SKU: {product.sku}</span>
            )}
          </div>
        </SheetHeader>
        <Separator className="my-4" />
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-secondary">Pricing Breakdown</h4>
          <p className="text-xs text-muted-foreground mb-3">
            Cost Price → Profit Layers → Taxes → Final Minimum Price
          </p>
          {breakdown.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-muted/50"
            >
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-medium">{formatCurrency(item.value)}</span>
            </div>
          ))}
        </div>
        {product.status === 'COSTING_COMPLETED' && onApprove && (
          <Button className="mt-4 w-full" onClick={() => onApprove(product)}>
            Approve Product
          </Button>
        )}
      </SheetContent>
    </Sheet>
  );
}
