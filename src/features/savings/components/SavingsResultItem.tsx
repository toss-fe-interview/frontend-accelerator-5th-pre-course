import { ListRow, colors } from 'tosslib';
import { formatPrice } from 'shared/utils/price';

type SavingsResultItemProps = {
  label: string;
  amount: number;
};

export const SavingsResultItem = ({ label, amount }: SavingsResultItemProps) => {
  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="2RowTypeA"
          top={label}
          topProps={{ color: colors.grey600 }}
          bottom={`${formatPrice(amount)}원`}
          bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
        />
      }
    />
  );
};
