import { ListRow, Spacing } from 'tosslib';
import type { SavingsProduct } from '../api/schema';
import CalculationSummary from './CalculationSummary';

interface CalculationResultProps {
  product: SavingsProduct | undefined;
}

export default function CalculationResult({ product }: CalculationResultProps) {
  return (
    <>
      <Spacing size={8} />
      {product ? (
        <CalculationSummary product={product} />
      ) : (
        <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
      )}
    </>
  );
}
