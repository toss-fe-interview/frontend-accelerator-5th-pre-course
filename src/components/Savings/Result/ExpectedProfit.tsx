import { ListRow, colors } from 'tosslib';

interface ExpectedProfitProps {
  amount: number;
}

export function ExpectedProfit({ amount }: ExpectedProfitProps) {
  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="2RowTypeA"
          top="예상 수익 금액"
          topProps={{ color: colors.grey600 }}
          bottom={`${amount.toLocaleString()}원`}
          bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
        />
      }
    />
  );
}
