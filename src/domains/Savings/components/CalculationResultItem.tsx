import { ListRow, colors } from 'tosslib';

interface CalculationResultItemProps {
  name: string;
  price: number;
  unit?: string;
}

export function CalculationResultItem({ name, price, unit = '원' }: CalculationResultItemProps) {
  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="2RowTypeA"
          top={name}
          topProps={{ color: colors.grey600 }}
          bottom={`${price.toLocaleString()}${unit}`}
          bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
        />
      }
    />
  );
}
