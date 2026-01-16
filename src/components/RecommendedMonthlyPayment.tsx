import { SavingProduct } from 'queries/types';
import { useWatch } from 'react-hook-form';
import { colors, ListRow } from 'tosslib';
import { calculateRecommendedMonthlyPayment } from 'utils/calculateSavings';

export const RecommendedMonthlyPayment = ({ title, product }: { title: string; product: SavingProduct }) => {
  const { targetAmount, term } = useWatch();
  const recommendedMonthlyPayment = calculateRecommendedMonthlyPayment(targetAmount, term, product.annualRate);

  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="2RowTypeA"
          top={title}
          topProps={{ color: colors.grey600 }}
          bottom={`${recommendedMonthlyPayment.toLocaleString('kr-KR')}원`}
          bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
        />
      }
    />
  );
};
