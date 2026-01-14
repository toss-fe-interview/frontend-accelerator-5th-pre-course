import { ListRow, colors } from 'tosslib';

interface RecommendedDepositProps {
  amount: number;
}

export function RecommendedDeposit({ amount }: RecommendedDepositProps) {
  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="2RowTypeA"
          top="추천 월 납입 금액"
          topProps={{ color: colors.grey600 }}
          bottom={`${amount.toLocaleString()}원`}
          bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
        />
      }
    />
  );
}
