import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const STEPS = [
  { label: 'Inventory', desc: 'Create products' },
  { label: 'Procurement', desc: 'Fill unit cost' },
  { label: 'Admin Approval', desc: 'Review & approve' },
];

export function WorkflowPipeline() {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-muted/30 p-4">
      {STEPS.map((step, i) => (
        <div key={step.label} className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1">
            <span className="font-medium">{step.label}</span>
            <span className="ml-2 text-muted-foreground">{step.desc}</span>
          </Badge>
          {i < STEPS.length - 1 && (
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      ))}
    </div>
  );
}
