import { ListRow } from 'tosslib';

export const MessageText = ({ message }: { message: string }) => {
  return <ListRow contents={<ListRow.Texts type="1RowTypeA" top={message} />} />;
};
