'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { invitationsApi } from '@/lib/api/endpoints';
import type { Role } from '@/lib/api/types';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api/client';

export function useInvitations() {
  return useQuery({
    queryKey: ['invitations'],
    queryFn: async () => {
      const { data } = await invitationsApi.list();
      return data;
    },
  });
}

export function useInvitationMutations() {
  const qc = useQueryClient();
  const invalidate = () => void qc.invalidateQueries({ queryKey: ['invitations'] });

  const create = useMutation({
    mutationFn: ({ email, role }: { email: string; role: Role }) =>
      invitationsApi.create(email, role),
    onSuccess: () => {
      invalidate();
      toast.success('Invitation sent');
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const revoke = useMutation({
    mutationFn: (id: string) => invitationsApi.revoke(id),
    onSuccess: () => {
      invalidate();
      toast.success('Invitation revoked');
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  return { create, revoke };
}
