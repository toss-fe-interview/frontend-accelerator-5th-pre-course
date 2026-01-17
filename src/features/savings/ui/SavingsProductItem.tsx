import { ListRow, colors } from 'tosslib';

const SavingsProductItem = ({
  상품이름,
  상품이율,
  납입조건,
}: {
  상품이름: string;
  상품이율: number;
  납입조건: string;
}) => {
  return (
    <ListRow.Texts
      type="3RowTypeA"
      top={상품이름}
      middle={`연 이자율: ${상품이율}%`}
      bottom={납입조건}
      topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
      middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
      bottomProps={{ fontSize: 13, color: colors.grey600 }}
    />
  );
};

export default SavingsProductItem;
