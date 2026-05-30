'use client';

import { useState } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { useInvitations, useInvitationMutations } from '@/hooks/queries/use-invitations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';
import type { Invitation, Role } from '@/lib/api/types';
import { Mail, Trash2 } from 'lucide-react';

function InvitationCard({
  invitation,
  onRevoke,
}: {
  invitation: Invitation;
  onRevoke: (id: string) => void;
}) {
  const statusVariant =
    invitation.status === 'PENDING'
      ? 'warning'
      : invitation.status === 'ACCEPTED'
        ? 'success'
        : 'muted';

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary" />
            <span className="font-medium">{invitation.email}</span>
            <Badge variant={statusVariant}>{invitation.status}</Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Role: {invitation.role} · Expires {formatDate(invitation.expiresAt)}
          </p>
        </div>
        {invitation.status === 'PENDING' && (
          <Button variant="ghost" size="icon" onClick={() => onRevoke(invitation.id)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function InvitationsPage() {
  const { data: invitations, isLoading } = useInvitations();
  const { create, revoke } = useInvitationMutations();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('INVENTORY');

  const pending = (invitations ?? []).filter((i) => i.status === 'PENDING');
  const accepted = (invitations ?? []).filter((i) => i.status === 'ACCEPTED');
  const expired = (invitations ?? []).filter((i) => i.status === 'EXPIRED');

  const handleInvite = () => {
    create.mutate(
      { email, role },
      { onSuccess: () => setEmail('') },
    );
  };

  return (
    <AppShell title="User Invitations" allowedRoles={['ADMIN']}>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Invite User</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="user@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="w-full space-y-2 sm:w-48">
            <Label>Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as Role)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="INVENTORY">Inventory</SelectItem>
                <SelectItem value="PROCUREMENT">Procurement</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleInvite} disabled={!email || create.isPending}>
            Send Invitation
          </Button>
        </CardContent>
      </Card>

      {isLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : (
        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
            <TabsTrigger value="accepted">Accepted ({accepted.length})</TabsTrigger>
            <TabsTrigger value="expired">Expired ({expired.length})</TabsTrigger>
          </TabsList>
          {[
            { key: 'pending', items: pending },
            { key: 'accepted', items: accepted },
            { key: 'expired', items: expired },
          ].map(({ key, items }) => (
            <TabsContent key={key} value={key} className="mt-4 space-y-3">
              {items.length === 0 ? (
                <p className="text-sm text-muted-foreground">No invitations</p>
              ) : (
                items.map((inv) => (
                  <InvitationCard
                    key={inv.id}
                    invitation={inv}
                    onRevoke={(id) => revoke.mutate(id)}
                  />
                ))
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </AppShell>
  );
}
