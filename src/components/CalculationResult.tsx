import { colors, ListRow, Spacing } from 'tosslib';
import { roundToThousand } from 'utils/number';

interface CalculationResultProps {
  예상수익금액: number;
  목표금액과의차이: number;
  추천월납입금액: number;
}

export default function CalculationResult({ 예상수익금액, 목표금액과의차이, 추천월납입금액 }: CalculationResultProps) {
  return (
    <>
      <Spacing size={8} />
      <>
        <ListRow
          contents={
            <ListRow.Texts
              type="2RowTypeA"
              top="예상 수익 금액"
              topProps={{ color: colors.grey600 }}
              bottom={`${roundToThousand(예상수익금액).toLocaleString()}원`}
              bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
            />
          }
        />
        <ListRow
          contents={
            <ListRow.Texts
              type="2RowTypeA"
              top="목표 금액과의 차이"
              topProps={{ color: colors.grey600 }}
              bottom={`${roundToThousand(목표금액과의차이).toLocaleString()}원`}
              bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
            />
          }
        />
        <ListRow
          contents={
            <ListRow.Texts
              type="2RowTypeA"
              top="추천 월 납입 금액"
              topProps={{ color: colors.grey600 }}
              bottom={`${roundToThousand(추천월납입금액).toLocaleString()}원`}
              bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
            />
          }
        />
      </>
    </>
  );
}
