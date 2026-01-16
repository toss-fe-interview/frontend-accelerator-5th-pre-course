import { useSuspenseQuery } from '@tanstack/react-query';
import { ListRow } from 'tosslib';
import { savingsProductsQueries } from '../api/queries';
import { useCalculatorParams } from '../hooks/useCalculatorParams';
import { useSelectProductParams } from '../hooks/useSelectProductParams';
import { matchesPaymentRange, matchesPeriod } from '../utils/productFilters';
import ProductList from './ProductList';

export default function ProductListTab() {
  const { data: products } = useSuspenseQuery(savingsProductsQueries.listQuery());

  const { monthlyAmount, savingTerms } = useCalculatorParams();
  const { selectedProductId, setSelectedProductId } = useSelectProductParams();

  const filteredProducts = products?.filter(matchesPaymentRange(monthlyAmount)).filter(matchesPeriod(savingTerms));

  if (filteredProducts?.length === 0) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="조건에 맞는 상품이 없습니다." />} />;
  }

  return (
    <ProductList
      products={filteredProducts}
      selectedProductId={selectedProductId ?? undefined}
      onProductSelect={setSelectedProductId}
    />
  );
}
