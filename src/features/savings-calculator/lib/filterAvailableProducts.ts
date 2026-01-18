import { SavingsProduct } from 'entities/savings/model/types';

import { isAvailableProduct } from 'features/savings-calculator/lib/isAvailableProduct';
import { SavingsCondition } from 'features/savings-calculator/model/types';

export const filterAvailableProducts = (condition: SavingsCondition) => (products: SavingsProduct[]) =>
  products.filter(product => isAvailableProduct({ savingsProduct: product, condition }));
