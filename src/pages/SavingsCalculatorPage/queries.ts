import { queryOptions } from '@tanstack/react-query';
import { getSavingsProducts } from './api';
import { SavingsProduct, SavingsTerm } from './domain/types';

interface SavingsProductsQueryParams {
  monthlyAmount?: SavingsProduct['minMonthlyAmount'];
  savingsTerm?: SavingsTerm;
}

export const savingsProductsQueryOptions = (params?: SavingsProductsQueryParams) =>
  queryOptions({
    queryKey: ['savings-products', params] as const,
    queryFn: () => getSavingsProducts(), // 나중에 getSavingsProducts(params)로 확장 가능
  });
