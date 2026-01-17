import { colors, ListRow } from 'tosslib';
import { formatToKRW } from '../util';

export type CalculationResultData = {
  [key: string]: {
    label: string;
    value: number;
  };
};

export function CalculationResultItem({ label, value }: { label: string; value: number }) {
  return (
    <ListRow.Texts
      type="2RowTypeA"
      top={label}
      topProps={{ color: colors.grey600 }}
      bottom={`${formatToKRW(value)}원`}
      bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
    />
  );
}
