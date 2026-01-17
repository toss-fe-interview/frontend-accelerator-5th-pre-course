import { ListRow } from 'tosslib';

interface EmptyMessageProps {
  message: string;
}

export function EmptyMessage({ message }: EmptyMessageProps) {
  return <ListRow contents={<ListRow.Texts type="1RowTypeA" top={message} />} />;
}
