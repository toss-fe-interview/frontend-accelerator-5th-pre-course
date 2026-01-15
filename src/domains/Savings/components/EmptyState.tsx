import { ListRow } from "tosslib";


interface EmptyStateProps {
    message?: string;
  }
  
export function EmptyState({ message = '상품을 선택해주세요.' }: EmptyStateProps) {
  return <ListRow contents={<ListRow.Texts type="1RowTypeA" top={message} />} />;
}