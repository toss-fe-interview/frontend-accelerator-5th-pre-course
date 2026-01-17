import { colors, ListRow } from 'tosslib';

type Props = {
  title: string;
  result: string;
};

export default function CalculationResult({ title, result }: Props) {
  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="2RowTypeA"
          top={title}
          topProps={{ color: colors.grey600 }}
          bottom={result}
          bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
        />
      }
    />
  );
}
