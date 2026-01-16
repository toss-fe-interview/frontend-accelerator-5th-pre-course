import { ListRow, colors } from 'tosslib';
import { formatPrice } from 'shared/utils/price';

type SavingsResultItemProps = {
  label: string;
  value: number;
};

export const SavingsResultItem = ({ label, value }: SavingsResultItemProps) => {
  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="2RowTypeA"
          top={label}
          topProps={{ color: colors.grey600 }}
          bottom={`${formatPrice(value)}원`}
          bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
        />
      }
    />
  );
};
