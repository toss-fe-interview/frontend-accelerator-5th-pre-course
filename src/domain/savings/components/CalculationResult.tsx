import { colors, ListRow } from 'tosslib';
import { commaizeNumber, roundToUnit } from '@shared/utils';
import type { SavingsProduct } from '@savings/apis/type';
import type { SavingsResult } from '@savings/utils/calcSavingsResult';

type CalculationResultProps = {
  result: SavingsResult;
  selectedProduct?: SavingsProduct;
};

export const CalculationResult = (props: CalculationResultProps) => {
  const { result, selectedProduct } = props;
  const { expectedReturn, differanceFromGoal, recommendedMonthlySaving } = result;

  if (!selectedProduct) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />;
  }

  return (
    <>
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`${commaizeNumber(roundToUnit(expectedReturn))}원`}
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
            bottom={`${commaizeNumber(roundToUnit(differanceFromGoal))}원`}
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
            bottom={`${commaizeNumber(roundToUnit(recommendedMonthlySaving))}원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
    </>
  );
};
