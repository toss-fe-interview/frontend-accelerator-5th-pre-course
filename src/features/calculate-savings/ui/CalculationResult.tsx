import { formatCurrency } from 'shared/lib/format';
import { Border, colors, ListRow, Spacing } from 'tosslib';

interface ResultItemProps {
  label: string;
  value: number;
}

function ResultItem({ label, value }: ResultItemProps) {
  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="2RowTypeA"
          top={label}
          topProps={{ color: colors.grey600 }}
          bottom={formatCurrency(value)}
          bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
        />
      }
    />
  );
}

interface CalculationResultProps {
  expectedProfit: number;
  difference: number;
  recommendedMonthlyAmount: number;
}

const CalculationResult = ({ expectedProfit, difference, recommendedMonthlyAmount }: CalculationResultProps) => {
  return (
    <>
      <Spacing size={8} />

      <ResultItem label="예상 수익 금액" value={expectedProfit} />
      <ResultItem label="목표 금액과의 차이" value={difference} />
      <ResultItem label="추천 월 납입 금액" value={recommendedMonthlyAmount} />

      <Spacing size={8} />
      <Border height={16} />
      <Spacing size={8} />
    </>
  );
};

export default CalculationResult;
