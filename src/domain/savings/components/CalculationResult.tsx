import { colors, ListRow } from 'tosslib';
import { commaizeNumber } from '@shared/utils';
import type { SavingsResult } from '@savings/utils/calcSavingsResult';

type CalculationResultProps = {
  result: SavingsResult;
};

export const CalculationResult = (props: CalculationResultProps) => {
  const { result } = props;
  const { expectedReturn, differenceFromGoal, recommendedMonthlySaving } = result;

  return (
    <>
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`${commaizeNumber(expectedReturn)}원`}
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
            bottom={`${commaizeNumber(differenceFromGoal)}원`}
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
            bottom={`${commaizeNumber(recommendedMonthlySaving)}원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
    </>
  );
};
