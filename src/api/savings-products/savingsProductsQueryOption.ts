import { queryOptions } from '@tanstack/react-query';
import { URLS } from 'api/urls';
import { SavingsProductsResponse } from './types';
import { http } from 'tosslib';

const getSavingsProducts = () => {
  return http.get<SavingsProductsResponse>(URLS.SAVINGS_PRODUCTS);
};

export const savingsProductQueryOptions = () => {
  return queryOptions({
    queryKey: [URLS.SAVINGS_PRODUCTS],
    queryFn: getSavingsProducts,
  });
};
