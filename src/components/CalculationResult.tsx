import { colors, ListRow } from 'tosslib';
import { SavingsProduct } from 'api/product';
import { roundToThousand } from 'util/number';

interface CalculationResultProps {
  selectedSavingsProduct: SavingsProduct | null;
  targetAmount: number;
  monthlyPayment: number;
  savingPeriod: number;
}

const calculateExpectedProfit = (monthlyPayment: number, savingPeriod: number, annualRate: number) => {
  return monthlyPayment * savingPeriod * (1 + annualRate * 0.5);
};

const calculateDifferenceWithTargetAmount = (targetAmount: number, expectedProfit: number) => {
  return targetAmount - expectedProfit;
};

const calculateRecommendedMonthlyPayment = (targetAmount: number, savingPeriod: number, annualRate: number) => {
  const recommendedAmount = targetAmount / (savingPeriod * (1 + annualRate * 0.5));
  return roundToThousand(recommendedAmount);
};

export function CalculationResult({
  selectedSavingsProduct,
  targetAmount,
  monthlyPayment,
  savingPeriod,
}: CalculationResultProps) {
  if (!selectedSavingsProduct) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />;
  }

  const expectedProfit = calculateExpectedProfit(monthlyPayment, savingPeriod, selectedSavingsProduct.annualRate);
  const difference = calculateDifferenceWithTargetAmount(targetAmount, expectedProfit);
  const recommendedMonthly = calculateRecommendedMonthlyPayment(
    targetAmount,
    savingPeriod,
    selectedSavingsProduct.annualRate
  );

  return (
    <>
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`${expectedProfit.toLocaleString()}원`}
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
            bottom={`${difference.toLocaleString()}원`}
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
            bottom={`${recommendedMonthly.toLocaleString()}원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
    </>
  );
}
