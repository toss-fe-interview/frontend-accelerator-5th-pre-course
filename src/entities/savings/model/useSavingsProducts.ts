import { useSuspenseQuery } from '@tanstack/react-query';

import { getSavingsProducts } from 'entities/savings/api/SavingsProduct.api';

const queryKey = ['savings-products'];

export const useSavingsProducts = () => {
  return useSuspenseQuery({
    queryKey,
    queryFn: getSavingsProducts,
  });
};
