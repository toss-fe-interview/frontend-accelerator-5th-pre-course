import { SavingsProduct } from 'entities/savings/model/types';
import { useSavingsProducts } from 'entities/savings/model/useSavingsProducts';

import { isAvailableProduct } from 'features/savings-calculator/lib/isAvailableProduct';
import { SavingsCondition } from 'features/savings-calculator/model/types';

export function useAvailableProducts(condition: SavingsCondition): SavingsProduct[] {
  const { data: savingsProducts } = useSavingsProducts();

  return savingsProducts.filter(savingsProduct => isAvailableProduct({ savingsProduct, condition }));
}
