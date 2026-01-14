import { Border, ListHeader, Spacing } from 'tosslib';
import { SavingsProduct } from '../api';
import { CalculInputs } from './SavingCalculatorInput';
import { SavingItem } from './SavingItemList';
import { CalculationResult } from './CalculationResult';
import { useCalculationResult } from '../hooks/useCalculationResult';

interface SavingResultProps {
  selectedProduct: SavingsProduct | null;
  calculInputs: CalculInputs;
  recommendedProducts: SavingsProduct[];
}

/**
 * 선택된 적금 상품과, 적금 계산기 입력을 바탕으로 결과 값만 제공해주자.
 */
export default function SavingResult({ selectedProduct, calculInputs, recommendedProducts }: SavingResultProps) {
  const { expectedProfit, difference, recommendedMonthly } = useCalculationResult({ selectedProduct, calculInputs });

  const isProductSelected = selectedProduct !== null;
  return (
    <>
      <CalculationResult
        expectedProfit={expectedProfit}
        difference={difference}
        recommendedMonthly={recommendedMonthly}
        isProductSelected={isProductSelected}
      />
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
