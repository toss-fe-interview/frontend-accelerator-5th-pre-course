import { SavingProduct } from 'queries/types';
import { useWatch } from 'react-hook-form';
import { colors, ListRow } from 'tosslib';
import { calculateExpectedIncome } from 'utils/calculateSavings';

export const ExpectedIncome = ({ title, product }: { title: string; product: SavingProduct }) => {
  const { monthlyAmount, term } = useWatch();
  const expectedIncome = calculateExpectedIncome(monthlyAmount, term, product.annualRate);

  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="2RowTypeA"
          top={title}
          topProps={{ color: colors.grey600 }}
          bottom={`${expectedIncome.toLocaleString('kr-KR')}원`}
          bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
        />
      }
    />
  );
};
