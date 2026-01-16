import { ListRow } from 'tosslib';

type EmptyMessageProps = {
  message: string;
};

export const EmptyMessage = ({ message }: EmptyMessageProps) => {
  return <ListRow contents={<ListRow.Texts type="1RowTypeA" top={message} />} />;
};
