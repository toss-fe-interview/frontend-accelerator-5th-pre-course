import { Border, ListHeader, ListRow, Spacing } from 'tosslib';
import { SavingsProduct } from '../api';
import { SavingItem } from './SavingItemList';
import { CalculationResult } from './CalculationResult';

export interface CalculationResult {
  expectedProfit: number;
  difference: number;
  recommendedMonthly: number;
}

interface SavingResultProps {
  calculationResult: CalculationResult | null;
  recommendedProducts: SavingsProduct[];
}

export default function SavingResult({ calculationResult, recommendedProducts }: SavingResultProps) {
  const hasResult = calculationResult !== null;
  return (
    <>
      {hasResult ? <CalculationResult {...calculationResult} /> : <NoProductSelected />}
      <Border height={16} />
      <Spacing size={8} />
      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />
      {recommendedProducts.map(product => (
        <SavingItem key={product.id} product={product} selectedProduct={null} onSelect={() => {}} />
      ))}
      <Spacing size={40} />
    </>
  );
}

function NoProductSelected() {
  return (
    <>
      <Spacing size={8} />
      <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
      <Spacing size={8} />
    </>
  );
}
