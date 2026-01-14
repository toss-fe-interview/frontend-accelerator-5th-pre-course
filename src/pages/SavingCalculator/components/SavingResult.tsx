import { Border, ListHeader, Spacing } from 'tosslib';
import { SavingsProduct } from '../api';
import { CalculInputs } from './SavingCalculatorInput';
import { SavingItem } from './SavingItemList';
import { CalculationResult } from './CalculationResult';
import { calculateDifferenceFromTarget, calculateExpectedProfit, calculateRecommendedMonthlyAmount } from '../util';

interface SavingResultProps {
  selectedProduct: SavingsProduct | null;
  calculInputs: CalculInputs;
  recommendedProducts: SavingsProduct[];
}

export default function SavingResult({ selectedProduct, calculInputs, recommendedProducts }: SavingResultProps) {
  const expectedProfit = calculateExpectedProfit(
    calculInputs.monthlyAmount,
    calculInputs.term,
    selectedProduct?.annualRate ?? 0
  );
  const difference = calculateDifferenceFromTarget(calculInputs.targetAmount, expectedProfit);
  const recommendedMonthly = calculateRecommendedMonthlyAmount(
    calculInputs.targetAmount,
    calculInputs.term,
    selectedProduct?.annualRate ?? 0
  );

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
