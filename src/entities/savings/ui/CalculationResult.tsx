import { colors, ListRow } from 'tosslib';

type CalculationResultProps = {
  label: string;
  value: string;
};

const CalculationResult = ({ label, value }: CalculationResultProps) => {
  return (
    <ListRow.Texts
      type="2RowTypeA"
      top={label}
      topProps={{ color: colors.grey600 }}
      bottom={value}
      bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
    />
  );
};

export default CalculationResult;
