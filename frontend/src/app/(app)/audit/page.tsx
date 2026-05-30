'use client';

import { useState } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { useAuditLogs } from '@/hooks/queries/use-audit';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';
import { Search } from 'lucide-react';

export default function AuditPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useAuditLogs({ limit: 100 });

  const logs = (data?.data ?? []).filter((log) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      log.entityType.toLowerCase().includes(q) ||
      log.user?.email?.toLowerCase().includes(q)
    );
  });

  return (
    <AppShell title="Audit Logs" allowedRoles={['ADMIN']}>
      <div className="mb-4 relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search actions, entities, users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">User</th>
                  <th className="px-4 py-3 text-left font-medium">Action</th>
                  <th className="px-4 py-3 text-left font-medium">Entity</th>
                  <th className="px-4 py-3 text-left font-medium">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-border hover:bg-muted/30">
                    <td className="px-4 py-3">{log.user?.email ?? log.userId}</td>
                    <td className="px-4 py-3 font-medium">{log.action.replace(/_/g, ' ')}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {log.entityType} · {log.entityId.slice(0, 8)}…
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(log.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Timeline</h3>
            <div className="relative border-l-2 border-primary/30 pl-4 space-y-4">
              {logs.slice(0, 15).map((log) => (
                <div key={log.id} className="relative">
                  <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-primary" />
                  <p className="text-sm font-medium">{log.action.replace(/_/g, ' ')}</p>
                  <p className="text-xs text-muted-foreground">
                    {log.user?.email} · {formatDate(log.createdAt)}
                  </p>
                  {(log.oldValue || log.newValue) && (
                    <details className="mt-1 text-xs text-muted-foreground">
                      <summary className="cursor-pointer">View changes</summary>
                      {log.oldValue && <pre className="mt-1 overflow-x-auto rounded bg-muted p-2">{JSON.stringify(log.oldValue, null, 2)}</pre>}
                      {log.newValue && <pre className="mt-1 overflow-x-auto rounded bg-muted p-2">{JSON.stringify(log.newValue, null, 2)}</pre>}
                    </details>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
