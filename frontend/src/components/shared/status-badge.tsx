import type { ProductStatus } from '@/lib/api/types';
import { STATUS_LABELS } from '@/lib/api/types';
import { Badge } from '@/components/ui/badge';

const STATUS_VARIANT: Record<
  ProductStatus,
  'warning' | 'default' | 'success' | 'danger'
> = {
  PENDING_COSTING: 'warning',
  COSTING_COMPLETED: 'default',
  APPROVED: 'success',
  REJECTED: 'danger',
};

export function StatusBadge({ status }: { status: ProductStatus }) {
  return (
    <Badge variant={STATUS_VARIANT[status]}>{STATUS_LABELS[status]}</Badge>
  );
}
