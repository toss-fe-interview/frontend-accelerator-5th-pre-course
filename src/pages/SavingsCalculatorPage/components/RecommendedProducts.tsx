import { SavingsProduct } from '../models/savings-products.dto';
import { filterSavingsProducts } from '../models/savings-products.service';
import { SavingsFilter } from '../types/saving-filter-form';

export type RecommendedProductsState = { type: 'empty' } | { type: 'success'; products: SavingsProduct[] };

interface Props {
  savingsProducts: SavingsProduct[];
  filter: SavingsFilter;
  children: (state: RecommendedProductsState) => React.ReactNode;
}

const MAX_RECOMMENDED_COUNT = 2;

export function RecommendedProducts({ savingsProducts, filter, children }: Props) {
  const recommendedProducts = filterSavingsProducts(savingsProducts, filter)
    .sort(byAnnualRateDesc)
    .slice(0, MAX_RECOMMENDED_COUNT);

  if (recommendedProducts.length === 0) {
    return children({ type: 'empty' });
  }

  return children({ type: 'success', products: recommendedProducts });
}

const byAnnualRateDesc = (a: SavingsProduct, b: SavingsProduct) => b.annualRate - a.annualRate;
