import React from 'react';
import type { SavingsProduct } from 'api/savings-products';
import { colors, ListRow } from 'tosslib';
import { addComma } from 'utils/add-comma';
import {
  calculateExpectedProfit,
  calculateRecommendedMonthlyAmount,
  calculateTargetDifference,
} from 'utils/savings-calculator';
import { roundNumber } from 'utils/round-number';

interface CalculationResultProps {
  targetAmount?: number;
  monthlyAmount?: number;
  term: number;
  selectedSavingsProduct?: SavingsProduct;
}

export const CalculationResult = ({
  targetAmount,
  monthlyAmount,
  term,
  selectedSavingsProduct,
}: CalculationResultProps) => {
  /**
   * 적금 상품 선택 안한 경우
   */
  if (!selectedSavingsProduct) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />;
  }

  /**
   * 목표금액, 월 납입액 없는 경우
   */
  if (!(monthlyAmount && targetAmount)) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="적금 계산기를 완료해주세요." />} />;
  }

  const expectedProfit = calculateExpectedProfit(monthlyAmount, term, selectedSavingsProduct?.annualRate);
  const targetDifference = calculateTargetDifference(targetAmount, expectedProfit);
  const recommendedMonthlyAmount = calculateRecommendedMonthlyAmount(
    targetAmount,
    term,
    selectedSavingsProduct?.annualRate
  );
  return (
    <>
      {targetAmount && monthlyAmount && selectedSavingsProduct && (
        <>
          <ListRow
            contents={
              <ListRow.Texts
                type="2RowTypeA"
                top="예상 수익 금액"
                topProps={{ color: colors.grey600 }}
                bottom={`${addComma(roundNumber(expectedProfit, 0))}원`}
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
                bottom={`${addComma(roundNumber(targetDifference, 0))}원`}
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
                bottom={`${addComma(roundNumber(recommendedMonthlyAmount, 3))}원`}
                bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
              />
            }
          />
        </>
      )}
    </>
  );
};
