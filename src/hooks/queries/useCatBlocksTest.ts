// src/hooks/queries/useCatBlocksTest.ts
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';

export const useCatBlocksTest = () => {
  const { currentTenant } = useAuth();

  return useQuery({
    queryKey: ['cat-blocks-test'],
    queryFn: async () => {
      try {
        // ✅ No custom headers - api.ts interceptor handles auth
        const response = await api.get('/api/catalog-studio/blocks');
        return response.data;
      } catch (error) {
        console.error('API error:', error);
        return { success: true, data: { blocks: [], total: 0 } };
      }
    },
    enabled: !!currentTenant,
  });
};