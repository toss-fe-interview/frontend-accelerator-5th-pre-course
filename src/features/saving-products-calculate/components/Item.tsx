import { formatPrice } from 'shared/utils/price';
import { ListRow, colors } from 'tosslib';

type SavingsCalculateItemProps = {
  label: string;
  value: string;
};

export const SavingsCalculateItem = ({ label, value }: SavingsCalculateItemProps) => {
  const isInvalidValue = (value: string) => isNaN(parseInt(value || '0'));

  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="2RowTypeA"
          top={label}
          topProps={{ color: colors.grey600 }}
          bottom={`${formatPrice(isInvalidValue(value) ? 0 : parseInt(value))}원`}
          bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
        />
      }
    />
  );
};
