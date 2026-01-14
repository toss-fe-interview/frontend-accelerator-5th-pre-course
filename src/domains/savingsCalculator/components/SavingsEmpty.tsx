import { ListRow } from 'tosslib';

export default function SavingsEmpty() {
  return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="조건에 맞는 상품이 없어요." />} />;
}
