import { useQuery } from '@tanstack/react-query';
import { URLS } from 'consts';
import { http } from 'tosslib';
import { SavingProduct } from './types';

export const useSavingProductsQuery = () => {
  return useQuery({
    queryKey: SAVING_PRODUCTS_QUERY_KEY,
    queryFn: () => http.get<SavingProduct[]>(URLS.SAVINGS_PRODUCTS),
  });
};

export const SAVING_PRODUCTS_QUERY_KEY = [URLS.SAVINGS_PRODUCTS];
