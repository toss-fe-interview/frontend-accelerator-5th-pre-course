import { ListRow } from 'tosslib';

type PlaceholderProps = {
  message: string;
};

const Placeholder = ({ message }: PlaceholderProps) => {
  return <ListRow contents={<ListRow.Texts type="1RowTypeA" top={message} />} />;
};

export default Placeholder;
