import { Suspense } from 'react';
import AcceptInvitePage from './accept-invite-client';
import { Skeleton } from '@/components/ui/skeleton';

export default function Page() {
  return (
    <Suspense fallback={<Skeleton className="mx-auto mt-20 h-64 w-full max-w-md" />}>
      <AcceptInvitePage />
    </Suspense>
  );
}
