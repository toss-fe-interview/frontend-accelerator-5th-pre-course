import { useQuery } from '@tanstack/react-query';
import { http } from 'tosslib';
import { QUERY_KEYS } from 'shared/constants';
import type { SavingsProduct } from 'shared/types';

const fetchSavingsProducts = async (): Promise<SavingsProduct[]> => {
  const response = await http.get<SavingsProduct[]>('/api/savings-products');
  return response;
};

export const useSavingsProducts = () => {
  return useQuery({
    queryKey: QUERY_KEYS.savingsProducts,
    queryFn: fetchSavingsProducts,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
  });
};
