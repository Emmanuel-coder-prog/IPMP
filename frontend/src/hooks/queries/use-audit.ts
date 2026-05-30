'use client';

import { useQuery } from '@tanstack/react-query';
import { auditApi } from '@/lib/api/endpoints';

export function useAuditLogs(params?: {
  page?: number;
  limit?: number;
  entityType?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ['audit', params],
    queryFn: async () => {
      const { data } = await auditApi.list({ limit: 100, ...params });
      return data;
    },
  });
}
