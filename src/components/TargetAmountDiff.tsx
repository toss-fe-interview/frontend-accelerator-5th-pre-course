import { SavingProduct } from 'queries/types';
import { useWatch } from 'react-hook-form';
import { colors, ListRow } from 'tosslib';
import { calculateExpectedIncome, calculateTargetDiff } from 'utils/calculateSavings';

export const TargetAmountDiff = ({ title, product }: { title: string; product: SavingProduct }) => {
  const { monthlyAmount, targetAmount, term } = useWatch();
  const expectedIncome = calculateExpectedIncome(monthlyAmount, term, product.annualRate);
  const targetDiff = calculateTargetDiff(targetAmount, expectedIncome);

  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="2RowTypeA"
          top={title}
          topProps={{ color: colors.grey600 }}
          bottom={`${targetDiff.toLocaleString('kr-KR')}원`}
          bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
        />
      }
    />
  );
};
