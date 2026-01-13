import { Border, colors, ListRow, Spacing } from 'tosslib';
import { calculateDifference, calculateExpectedAmount, calculateRecommendedMonthlyAmount } from '../utils/savings';
import { formatCurrency } from 'utils/format';
import { SavingsCalculatorFormData } from 'hooks/useSavingsCalculatorForm';
import { SavingsProduct } from 'type';
import { RecommendedProductList } from './RecommendedProductList';

type SavingsCalculatorResultsProps = SavingsCalculatorFormData & {
  selectedProduct?: SavingsProduct;
};

export function SavingsCalculatorResults({
  targetAmount,
  monthlyAmount,
  availableTerms,
  selectedProduct,
}: SavingsCalculatorResultsProps) {
  if (!selectedProduct) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />;
  }

  const expectedAmount = calculateExpectedAmount(monthlyAmount, availableTerms, selectedProduct.annualRate);
  const difference = calculateDifference(targetAmount, expectedAmount);
  const recommendedMonthlyAmount = calculateRecommendedMonthlyAmount(
    targetAmount,
    availableTerms,
    selectedProduct.annualRate
  );

  return (
    <>
      <Spacing size={8} />

      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익 금액"
            topProps={{ color: colors.grey600 }}
            bottom={formatCurrency(expectedAmount)}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="목표 금액과의 차이"
            topProps={{ color: colors.grey600 }}
            bottom={formatCurrency(difference)}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="추천 월 납입 금액"
            topProps={{ color: colors.grey600 }}
            bottom={formatCurrency(recommendedMonthlyAmount)}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />

      <Spacing size={8} />
      <Border height={16} />
      <Spacing size={8} />

      <RecommendedProductList
        monthlyAmount={monthlyAmount}
        availableTerms={availableTerms}
        selectedProductId={selectedProduct?.id}
      />

      <Spacing size={40} />
    </>
  );
}
