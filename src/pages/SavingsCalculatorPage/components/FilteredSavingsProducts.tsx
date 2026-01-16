import { SavingsProduct } from '../models/savings-products.dto';
import { filterSavingsProducts } from '../models/savings-products.service';
import { SavingsFilter } from '../types/saving-filter-form';

export type FilteredProductsState =
  | { type: 'empty' } //
  | { type: 'success'; products: SavingsProduct[] };

interface Props {
  savingsProducts: SavingsProduct[];
  filter: SavingsFilter;
  children: (state: FilteredProductsState) => React.ReactNode;
}

export function FilteredSavingsProducts({ savingsProducts, filter, children }: Props) {
  const filteredProducts = filterSavingsProducts(savingsProducts, filter);

  if (filteredProducts.length === 0) {
    return children({ type: 'empty' });
  }

  return children({ type: 'success', products: filteredProducts });
}
