import { SavingsProduct } from 'shared/api/type';
import { colors, ListRow, Spacing } from 'tosslib';

interface CalculatorProps {
  monthlyDeposit: number;
  savingPeriod: number;
  annualRate: SavingsProduct['annualRate'];
  targetAmount: number;
}

export const CalculationResults = ({ monthlyDeposit, savingPeriod, annualRate, targetAmount }: CalculatorProps) => {
  const calculated = calculate({ monthlyDeposit, savingPeriod, annualRate, targetAmount });

  return (
    <>
      <Spacing size={8} />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`${calculated.예상_수익_금액.toLocaleString()} 원`}
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
            bottom={`${calculated.목표_금액과의_차이.toLocaleString()} 원`}
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
            bottom={`${calculated.추천_월_납입_금액.toLocaleString()} 원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
      <Spacing size={8} />
    </>
  );
};

const calculate = ({ monthlyDeposit, savingPeriod, annualRate, targetAmount }: CalculatorProps) => {
  const interestFactor = 1 + annualRate * 0.5;
  const expectedAmount = monthlyDeposit * savingPeriod * interestFactor;

  return {
    예상_수익_금액: expectedAmount,
    목표_금액과의_차이: targetAmount - expectedAmount,
    추천_월_납입_금액: Math.round(targetAmount / (savingPeriod * interestFactor) / 1000) * 1000,
  };
};
