import { queryOptions } from '@tanstack/react-query';
import { http } from 'tosslib';
import { SavingProduct } from './types';
import { URLS } from './urls';

export const savingsProductQueryOptions = () => {
  return queryOptions({
    queryKey: [URLS.SAVINGS_PRODUCTS],
    queryFn: () => http.get<SavingProduct[]>(URLS.SAVINGS_PRODUCTS),
  });
};
