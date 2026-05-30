'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/lib/api/endpoints';
import type { Role } from '@/lib/api/types';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api/client';

export const userKeys = {
  all: ['users'] as const,
  me: ['users', 'me'] as const,
};

export function useUsers() {
  return useQuery({
    queryKey: userKeys.all,
    queryFn: async () => {
      const { data } = await usersApi.list();
      return data;
    },
  });
}

export function useUserMutations() {
  const qc = useQueryClient();
  const invalidate = () => void qc.invalidateQueries({ queryKey: userKeys.all });

  const create = useMutation({
    mutationFn: (data: {
      email: string;
      password: string;
      role: Role;
      firstName?: string;
      lastName?: string;
    }) => usersApi.create(data),
    onSuccess: () => {
      invalidate();
      toast.success('User created');
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const update = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof usersApi.update>[1];
    }) => usersApi.update(id, data),
    onSuccess: () => {
      invalidate();
      toast.success('User updated');
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const resetPassword = useMutation({
    mutationFn: ({ id, newPassword }: { id: string; newPassword: string }) =>
      usersApi.resetPassword(id, newPassword),
    onSuccess: () => toast.success('Password reset'),
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const remove = useMutation({
    mutationFn: (id: string) => usersApi.delete(id),
    onSuccess: () => {
      invalidate();
      toast.success('User deleted');
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  return { create, update, resetPassword, remove };
}
