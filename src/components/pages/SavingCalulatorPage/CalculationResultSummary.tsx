import { useWatch } from 'react-hook-form';
import { colors, ListRow } from 'tosslib';
import { SavingProduct } from 'queries/types';
import { calculateExpectedIncome, calculateTargetDiff, calculateRecommendedMonthlyPayment } from 'utils/savingCalculator';

export const CalculationResultSummary = ({ selectedProduct }: { selectedProduct: SavingProduct }) => {
  const { monthlyAmount, term, targetAmount } = useWatch();

  const expectedIncome = calculateExpectedIncome(monthlyAmount, term, selectedProduct.annualRate);
  const targetDiff = calculateTargetDiff(targetAmount, expectedIncome);
  const recommendedMonthlyPayment = calculateRecommendedMonthlyPayment(targetAmount, term, selectedProduct.annualRate);

  return (
    <>
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`${expectedIncome.toLocaleString('kr-KR')}원`}
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
            bottom={`${targetDiff.toLocaleString('kr-KR')}원`}
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
            bottom={`${recommendedMonthlyPayment.toLocaleString('kr-KR')}원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
    </>
  );
};
