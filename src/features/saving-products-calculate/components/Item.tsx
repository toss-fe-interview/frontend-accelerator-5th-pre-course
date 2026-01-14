import { ListRow, colors } from 'tosslib';

type SavingsCalculateItemProps = {
  label: string;
  value: string;
};

export const SavingsCalculateItem = ({ label, value }: SavingsCalculateItemProps) => {
  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="2RowTypeA"
          top={label}
          topProps={{ color: colors.grey600 }}
          bottom={`${value}원`}
          bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
        />
      }
    />
  );
};
