import { useSuspenseQuery } from '@tanstack/react-query';
import { Border, ListRow, Spacing } from 'tosslib';
import { savingsProductsQueries } from '../api/queries';
import { useCalculatorParams } from '../hooks/useCalculatorParams';
import { useSelectProductParams } from '../hooks/useSelectProductParams';
import { matchesPaymentRange, matchesPeriod } from '../utils/productFIlters';
import CalculationSummary from './CalculationSummary';
import RecommendedProductList from './RecommendProductList';

export default function CalculationResultTab() {
  const { data: products } = useSuspenseQuery(savingsProductsQueries.listQuery());

  const { selectedProductId } = useSelectProductParams();
  const { monthlyAmount, savingTerms } = useCalculatorParams();

  const selectedProduct = products?.find(product => product.id === selectedProductId);
  const recommendedProducts = products
    ?.filter(matchesPaymentRange(monthlyAmount))
    .filter(matchesPeriod(savingTerms))
    .sort((a, b) => b.annualRate - a.annualRate)
    .slice(0, 2);

  return (
    <div>
      <Spacing size={8} />

      {selectedProduct ? (
        <CalculationSummary product={selectedProduct} />
      ) : (
        <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
      )}

      <Spacing size={8} />
      <Border height={16} />
      <Spacing size={8} />

      <RecommendedProductList products={recommendedProducts} />
    </div>
  );
}
