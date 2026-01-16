import { ListRow } from 'tosslib';

type MessageProps = {
  value: string;
};

const Message = ({ value: message }: MessageProps) => {
  return <ListRow.Texts type="1RowTypeA" top={message} />;
};

export default Message;
