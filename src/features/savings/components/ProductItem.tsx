import { ListRow, colors } from 'tosslib';

interface ProductItemProps {
  title: string;
  highlight: string;
  description: string;
}

export default function ProductItem({ title, highlight, description }: ProductItemProps) {
  return (
    <ListRow.Texts
      type="3RowTypeA"
      top={title}
      topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
      middle={highlight}
      middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
      bottom={description}
      bottomProps={{ fontSize: 13, color: colors.grey600 }}
    />
  );
}
