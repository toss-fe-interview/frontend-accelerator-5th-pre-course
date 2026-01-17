import { colors, ListRow } from 'tosslib';

// 계산 된 결과 아이템
const CalculatedResultItem = ({ label, amount }: { label: string; amount: number }) => {
  return (
    <ListRow.Texts
      type="2RowTypeA"
      top={label}
      bottom={`${amount.toLocaleString('ko-KR')}원`}
      topProps={{ color: colors.grey600 }}
      bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
    />
  );
};

export default CalculatedResultItem;
