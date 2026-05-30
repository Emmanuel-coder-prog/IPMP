'use client';

import { Sidebar, MobileNav } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { useRequireAuth } from '@/providers/auth-provider';
import type { Role } from '@/lib/api/types';
import { Skeleton } from '@/components/ui/skeleton';

export function AppShell({
  children,
  title,
  allowedRoles,
}: {
  children: React.ReactNode;
  title?: string;
  allowedRoles?: Role[];
}) {
  const { isLoading } = useRequireAuth(allowedRoles);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Skeleton className="h-8 w-48" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col pb-16 lg:pb-0">
        <Topbar title={title} />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
