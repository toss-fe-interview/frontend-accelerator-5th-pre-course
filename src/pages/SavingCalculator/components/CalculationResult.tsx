import { colors, ListRow, Spacing } from 'tosslib';
import { formatToKRW } from '../util';

export interface CalculationResultData {
  expectedProfit: number;
  difference: number;
  recommendedMonthly: number;
}

interface CalculationResultProps {
  result: CalculationResultData;
}

export function NoProductSelected() {
  return (
    <>
      <Spacing size={8} />
      <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
      <Spacing size={8} />
    </>
  );
}

export function CalculationResult({ result }: CalculationResultProps) {
  return (
    <>
      <Spacing size={8} />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`${formatToKRW(result.expectedProfit)}원`}
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
            bottom={`${formatToKRW(result.difference)}원`}
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
            bottom={`${formatToKRW(result.recommendedMonthly)}원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
      <Spacing size={8} />
    </>
  );
}
