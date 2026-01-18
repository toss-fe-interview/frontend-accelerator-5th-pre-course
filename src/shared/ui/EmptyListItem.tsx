import { ListRow } from 'tosslib';

interface EmptyListItemProps {
  message: string;
}

export function EmptyListItem({ message }: EmptyListItemProps) {
  return <ListRow contents={<ListRow.Texts type="1RowTypeA" top={message} />} />;
}
