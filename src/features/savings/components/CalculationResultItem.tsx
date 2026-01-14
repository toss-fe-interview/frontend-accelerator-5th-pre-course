import { toNumber } from 'shared/utils/format';
import { formatPrice } from 'shared/utils/price';
import { ListRow, colors } from 'tosslib';

type CalculationResultItemProps = {
  label: string;
  value: string | number;
};

export const CalculationResultItem = ({ label, value }: CalculationResultItemProps) => {
  const isInvalidValue = (value: string | number) => isNaN(toNumber(value));

  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="2RowTypeA"
          top={label}
          topProps={{ color: colors.grey600 }}
          bottom={`${formatPrice(isInvalidValue(value) ? 0 : toNumber(value))}원`}
          bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
        />
      }
    />
  );
};
