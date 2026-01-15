import type { SavingsProduct } from 'api/savings-products';
import { colors, ListRow } from 'tosslib';
import { addComma } from 'utils/add-comma';
import {
  calculateExpectedProfit,
  calculateRecommendedMonthlyAmount,
  calculateTargetDifference,
} from 'utils/savings-calculator';
import { MessageText } from './MessageText';

interface CalculationResultProps {
  targetAmount?: number;
  monthlyAmount?: number;
  term: number;
  selectedSavingsProduct: SavingsProduct | null;
}

interface CalculationResultItemProps {
  label: string;
  value: number;
}

/*
 * 원 단위로 반올림하는 함수
 * @param value 숫자
 * @param precision 소수점 자리수 (0: 원 단위, 1: 십원 단위, 2: 백원 단위, 3: 천원 단위)
 */
const roundToWon = (value: number, precision: number) => {
  const multiplier = 10 ** precision;
  return Math.round(value / multiplier) * multiplier;
};

const CalculationResultItem = ({ label, value }: CalculationResultItemProps) => {
  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="2RowTypeA"
          top={label}
          topProps={{ color: colors.grey600 }}
          bottom={`${addComma(value)}원`}
          bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
        />
      }
    />
  );
};

export const CalculationResult = ({
  targetAmount,
  monthlyAmount,
  term,
  selectedSavingsProduct,
}: CalculationResultProps) => {
  // 적금 상품 선택 안한 경우
  const isNoSavingsProductSelected = !selectedSavingsProduct;
  // 목표금액, 월 납입액 없는 경우
  const isNoAmountInput = !(monthlyAmount && targetAmount);

  if (isNoSavingsProductSelected) {
    return <MessageText message="상품을 선택해주세요." />;
  }

  if (isNoAmountInput) {
    return <MessageText message="적금 계산기를 완료해주세요." />;
  }

  // 계산
  const expectedProfit = calculateExpectedProfit(monthlyAmount, term, selectedSavingsProduct?.annualRate);
  const targetDifference = calculateTargetDifference(targetAmount, expectedProfit);
  const recommendedMonthlyAmount = calculateRecommendedMonthlyAmount(
    targetAmount,
    term,
    selectedSavingsProduct?.annualRate
  );

  return (
    <>
      <CalculationResultItem label="예상 수익 금액" value={roundToWon(expectedProfit, 0)} />
      <CalculationResultItem label="목표 금액과의 차이" value={roundToWon(targetDifference, 0)} />
      <CalculationResultItem label="추천 월 납입 금액" value={roundToWon(recommendedMonthlyAmount, 3)} />
    </>
  );
};
