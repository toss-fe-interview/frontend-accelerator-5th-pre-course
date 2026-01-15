import { Spacing, Border, ListHeader, ListRow } from 'tosslib';
import SavingsProductList from './SavingsProductList';
import { SavingsProduct } from '../schemas/savingsProduct';
import useRecommendedSavingsProducts from '../hooks/useRecommendedSavingsProducts';
import { SavingsValues } from '../types/savingsValues';
import SavingsResult from './SavingsResult';
import {
  calculateEstimatedEaringsAmount,
  calculateDifferenceWithTargetAmount,
  calculateRecommendedMonthlyPayment,
} from '../utils/calculation/savings';

interface CalculationResultProps {
  savingsValues: SavingsValues;
  savingsProducts: SavingsProduct[];
  selectedProductId: string | null;
}

export default function CalculationResult({
  savingsValues,
  savingsProducts,
  selectedProductId,
}: CalculationResultProps) {
  const recommendedSavingsProducts = useRecommendedSavingsProducts(savingsProducts);

  const selectedProduct = savingsProducts.find(product => product.id === selectedProductId);
  const isProductNotSelected = !selectedProductId || !selectedProduct;

  const { targetAmount, monthlyPaymentAmount, savingsPeriod } = savingsValues;

  return (
    <>
      <Spacing size={8} />

      {isProductNotSelected ? (
        <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
      ) : (
        <>
          <SavingsResult
            label="예상 수익 금액"
            value={calculateEstimatedEaringsAmount(monthlyPaymentAmount, savingsPeriod, selectedProduct.annualRate)}
          />
          <SavingsResult
            label="목표 금액과의 차이"
            value={calculateDifferenceWithTargetAmount(
              targetAmount,
              calculateEstimatedEaringsAmount(monthlyPaymentAmount, savingsPeriod, selectedProduct.annualRate)
            )}
          />
          <SavingsResult
            label="추천 월 납입 금액"
            value={calculateRecommendedMonthlyPayment(targetAmount, savingsPeriod, selectedProduct.annualRate)}
          />
        </>
      )}

      <Spacing size={8} />
      <Border height={16} />
      <Spacing size={8} />

      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />

      <SavingsProductList savingsProducts={recommendedSavingsProducts} selectedProductId={selectedProductId} />

      <Spacing size={40} />
    </>
  );
}
