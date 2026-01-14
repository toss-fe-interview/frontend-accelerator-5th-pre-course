import { colors, ListRow, Spacing } from 'tosslib';
import { formatToKRW } from '../util';

interface CalculationResultProps {
  expectedProfit: number;
  difference: number;
  recommendedMonthly: number;
  isProductSelected: boolean;
}

export function CalculationResult({
  expectedProfit,
  difference,
  recommendedMonthly,
  isProductSelected,
}: CalculationResultProps) {
  return (
    <>
      <Spacing size={8} />
      {isProductSelected ? (
        <>
          <ListRow
            contents={
              <ListRow.Texts
                type="2RowTypeA"
                top="예상 수익 금액"
                topProps={{ color: colors.grey600 }}
                bottom={`${formatToKRW(expectedProfit)}원`}
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
                bottom={`${formatToKRW(difference)}원`}
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
                bottom={`${formatToKRW(recommendedMonthly)}원`}
                bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
              />
            }
          />
        </>
      ) : (
        <NoProductSelected />
      )}
      <Spacing size={8} />{' '}
    </>
  );
}

function NoProductSelected() {
  return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />;
}
