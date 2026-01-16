import { useSuspenseQuery } from '@tanstack/react-query';
import { ListHeader, ListRow, Spacing } from 'tosslib';
import { savingsProductsQueries } from '../api/queries';
import { useCalculatorParams } from '../hooks/useCalculatorParams';
import { useSelectProductParams } from '../hooks/useSelectProductParams';
import { byHighestAnnualRate, matchesPaymentRange, matchesPeriod } from '../utils/productFilters';
import ProductList from './ProductList';

export default function RecommendedProductList() {
  const { data: products } = useSuspenseQuery(savingsProductsQueries.listQuery());

  const { monthlyAmount, savingTerms } = useCalculatorParams();
  const { selectedProductId, setSelectedProductId } = useSelectProductParams();

  const recommendedProducts = products
    .filter(matchesPaymentRange(monthlyAmount))
    .filter(matchesPeriod(savingTerms))
    .sort(byHighestAnnualRate)
    .slice(0, 2);

  return (
    <>
      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />

      {recommendedProducts.length > 0 ? (
        <ProductList
          products={recommendedProducts}
          selectedProductId={selectedProductId ?? undefined}
          onProductSelect={setSelectedProductId}
        />
      ) : (
        <ListRow contents={<ListRow.Texts type="1RowTypeA" top="조건에 맞는 상품이 없습니다." />} />
      )}
      <Spacing size={40} />
    </>
  );
}
