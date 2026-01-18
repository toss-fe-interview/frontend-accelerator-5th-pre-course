import { ListRow, colors } from 'tosslib';
import { formatNumber } from 'utils/format';

interface CalculateResultItemProps {
  label: string;
  value: number;
}

const CalculateResultItem = ({ label, value }: CalculateResultItemProps) => {
  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="2RowTypeA"
          top={label}
          topProps={{ color: colors.grey600 }}
          bottom={`${formatNumber(Math.round(value))}원`}
          bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
        />
      }
    />
  );
};

export default CalculateResultItem;
