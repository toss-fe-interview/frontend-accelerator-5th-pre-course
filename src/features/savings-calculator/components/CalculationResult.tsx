import { useQuery } from '@tanstack/react-query';
import { Assets, Border, ListHeader, ListRow, Spacing } from 'tosslib';
import type { SavingsProduct } from '../api/api';
import { savingsProductsQueries } from '../api/queries';
import { useCalculatorParams } from '../hooks/useCalculatorParams';
import { useSelectProductParams } from '../hooks/useSelectProductParams';
import { matchesPaymentRange, matchesPeriod } from '../utils/productFIlters';
import CalculationSummary from './CalculationSummary';
import ProductItem from './ProductItem';

export default function CalculationResult() {
  const { data: products } = useQuery(savingsProductsQueries.listQuery());
  const { selectedProductId } = useSelectProductParams();
  const { monthlyAmount, savingTerms } = useCalculatorParams();

  const selectedProduct = products?.find(product => product.id === selectedProductId);
  const recommendedProducts = products
    ?.filter(matchesPaymentRange(monthlyAmount))
    .filter(matchesPeriod(savingTerms))
    .sort((a, b) => a.annualRate - b.annualRate)
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
      <Spacing size={40} />
    </div>
  );
}

function RecommendedProductList({ products }: { products?: SavingsProduct[] }) {
  const { selectedProductId, setSelectedProductId } = useSelectProductParams();

  return (
    <>
      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />

      {products?.length === 0 ? (
        <ListRow contents={<ListRow.Texts type="1RowTypeA" top="조건에 맞는 상품이 없습니다." />} />
      ) : (
        <div>
          {products?.map(product => (
            <ProductItem
              key={product.id}
              product={product}
              right={selectedProductId === product.id ? <Assets.Icon name="icon-check-circle-green" /> : null}
              onProductSelect={() => setSelectedProductId(product.id)}
            />
          ))}
        </div>
      )}
    </>
  );
}
