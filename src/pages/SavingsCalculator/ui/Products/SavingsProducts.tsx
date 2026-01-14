import { SavingsProduct } from 'shared/api/type';
import { colors, ListRow } from 'tosslib';

export const SavingsProducts = ({
  data,
  right,
  onClick,
}: {
  data: SavingsProduct[];
  right: (product: SavingsProduct) => React.ReactNode;
  onClick: (value: SavingsProduct) => void;
}) => {
  return (
    <>
      {data.map(amount => (
        <ListRow
          key={amount.id}
          contents={
            <ListRow.Texts
              type="3RowTypeA"
              top={amount.name}
              topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
              middle={`연 이자율: ${amount.annualRate}%`}
              middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
              bottom={`${amount.minMonthlyAmount.toLocaleString()}원 ~ ${amount.maxMonthlyAmount.toLocaleString()}원 | ${amount.availableTerms}개월`}
              bottomProps={{ fontSize: 13, color: colors.grey600 }}
            />
          }
          right={right(amount)}
          onClick={() => onClick(amount)}
        />
      ))}
    </>
  );
};
