import { queryOptions } from '@tanstack/react-query';
import { SavingProduct } from 'models/SavingProduct';
import { http } from 'tosslib';

export const savingProductsQuery = () =>
  queryOptions({
    queryKey: ['saving-products'],
    queryFn: () => http.get<SavingProduct[]>('/api/savings-products'),
  });
