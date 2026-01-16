import { ListRow } from 'tosslib';
import { SavingsProduct } from '../models/savings-products.dto';
import { filterSavingsProducts } from '../models/savings-products.service';
import { SavingsFilter } from '../types/saving-filter-form';

interface Props {
  savingsProducts: SavingsProduct[];
  filter: SavingsFilter;
  children: (products: SavingsProduct[]) => React.ReactNode;
}

export function FilteredSavingsProducts({ savingsProducts, filter, children }: Props) {
  const filteredProducts = filterSavingsProducts(savingsProducts, filter);

  if (filteredProducts.length === 0) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="조건에 맞는 상품이 없습니다." />} />;
  }

  return <>{children(filteredProducts)}</>;
}
