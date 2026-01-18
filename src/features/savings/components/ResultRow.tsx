import { colors, ListRow } from 'tosslib';

const ResultRow = ({ subject, amount }: { subject: string; amount: number }) => {
  return (
    <ListRow.Texts
      type="2RowTypeA"
      top={subject}
      topProps={{ color: colors.grey600 }}
      bottom={`${amount.toLocaleString()}원`}
      bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
    />
  );
};
export default ResultRow;
