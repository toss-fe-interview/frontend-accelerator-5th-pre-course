import { useSuspenseQuery } from '@tanstack/react-query';
import { ListRow, Spacing } from 'tosslib';
import { savingsProductsQueries } from '../api/queries';
import { useSelectProductParams } from '../hooks/useSelectProductParams';
import CalculationSummary from './CalculationSummary';

export default function CalculationResult() {
  const { data: products } = useSuspenseQuery(savingsProductsQueries.listQuery());
  const { selectedProductId } = useSelectProductParams();

  const selectedProduct = products.find(product => product.id === selectedProductId);

  return (
    <>
      <Spacing size={8} />
      {selectedProduct ? (
        <CalculationSummary product={selectedProduct} />
      ) : (
        <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
      )}
    </>
  );
}
