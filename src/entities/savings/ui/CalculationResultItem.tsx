import { colors, ListRow } from 'tosslib';

type CalculationResultItemProps = {
  label: string;
  value: string;
};

const CalculationResultItem = ({ label, value }: CalculationResultItemProps) => {
  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="2RowTypeA"
          top={label}
          topProps={{ color: colors.grey600 }}
          bottom={value}
          bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
        />
      }
    />
  );
};

export default CalculationResultItem;
