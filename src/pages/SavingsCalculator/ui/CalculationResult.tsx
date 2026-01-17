import { colors, ListRow } from 'tosslib';

export const CalculationResult = ({ top, bottom }: { top: string; bottom: string }) => {
  return (
    <ListRow.Texts
      type="2RowTypeA"
      top={top}
      topProps={{ color: colors.grey600 }}
      bottom={bottom}
      bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
    />
  );
};
