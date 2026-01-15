import { colors, ListRow } from 'tosslib';

export const AmountDisplay = ({ title, value }: { title: string; value: number }) => {
  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="2RowTypeA"
          top={title}
          topProps={{ color: colors.grey600 }}
          bottom={`${value.toLocaleString('kr-KR')}원`}
          bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
        />
      }
    />
  );
};
