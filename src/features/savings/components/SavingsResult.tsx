import { ListRow } from 'tosslib';
import {
  calculateDifferenceWithTargetAmount,
  calculateEstimatedEaringsAmount,
  calculateRecommendedMonthlyPayment,
} from '../utils/calculation/savings';
import { SavingsValues } from '../types/savingsValues';
import { SavingsProduct } from '../schemas/savingsProduct';
import SavingsResultItem from './SavingsResultItem';

interface SavingsResultProps {
  savingsValues: SavingsValues;
  savingsProducts: SavingsProduct[];
  selectedProductId: string | null;
}

export default function SavingsResult({ savingsValues, savingsProducts, selectedProductId }: SavingsResultProps) {
  const selectedProduct = savingsProducts.find(product => product.id === selectedProductId);

  if (!selectedProductId || !selectedProduct) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />;
  }

  const { targetAmount, monthlyPaymentAmount, savingsPeriod } = savingsValues;
  const { annualRate } = selectedProduct;

  const estimatedEaringsAmount = calculateEstimatedEaringsAmount(monthlyPaymentAmount, savingsPeriod, annualRate);
  const differnceWithTargetAmount = calculateDifferenceWithTargetAmount(targetAmount, estimatedEaringsAmount);
  const recommendedMonthlyPayment = calculateRecommendedMonthlyPayment(targetAmount, savingsPeriod, annualRate);

  return (
    <>
      <SavingsResultItem label="예상 수익 금액" value={estimatedEaringsAmount} />
      <SavingsResultItem label="목표 금액과의 차이" value={differnceWithTargetAmount} />
      <SavingsResultItem label="추천 월 납입 금액" value={recommendedMonthlyPayment} />
    </>
  );
}
