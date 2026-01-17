import { SavingsProduct } from 'entities/savings/model/types';

import { isAvailableProduct } from 'features/savings-calculator/lib/isAvailableProduct';
import { SavingsCondition } from 'features/savings-calculator/model/types';

export function useAvailableProducts({
  products,
  condition,
}: {
  products: SavingsProduct[];
  condition: SavingsCondition;
}): SavingsProduct[] {
  return products.filter(savingsProduct => isAvailableProduct({ savingsProduct, condition }));
}
