'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { pricingApi } from '@/lib/api/endpoints';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api/client';

export const pricingKeys = {
  active: ['pricing', 'active'] as const,
  history: ['pricing', 'history'] as const,
};

export function useActivePricing() {
  return useQuery({
    queryKey: pricingKeys.active,
    queryFn: async () => {
      const { data } = await pricingApi.getActive();
      return data;
    },
  });
}

export function usePricingHistory() {
  return useQuery({
    queryKey: pricingKeys.history,
    queryFn: async () => {
      const { data } = await pricingApi.list();
      return data;
    },
  });
}

export function usePricingMutations() {
  const qc = useQueryClient();
  const invalidate = () => {
    void qc.invalidateQueries({ queryKey: ['pricing'] });
  };

  const create = useMutation({
    mutationFn: pricingApi.create,
    onSuccess: () => {
      invalidate();
      toast.success('Pricing configuration saved');
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const activate = useMutation({
    mutationFn: (id: string) => pricingApi.activate(id),
    onSuccess: () => {
      invalidate();
      toast.success('Configuration activated');
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  return { create, activate };
}
