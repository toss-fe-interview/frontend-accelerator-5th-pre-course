import { type SavingsProduct } from 'api/savings-products';
import { colors, ListRow } from 'tosslib';
import { addComma } from 'utils/add-comma';
import {
  calculateExpectedProfit,
  calculateRecommendedMonthlyAmount,
  calculateTargetDifference,
} from 'utils/savings-calculator';

export interface UserInputs {
  monthlyAmount: number | undefined;
  term: number;
  targetAmount: number | undefined;
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

/**
 * 예상 수익 금액 컴포넌트
 */
interface ExpectedProfitProps extends UserInputs {
  label: string;
  selectedSavingsProduct: SavingsProduct | null;
}

export const ExpectedProfit = ({ label, monthlyAmount, term, selectedSavingsProduct }: ExpectedProfitProps) => {
  const unableToCalculate = !monthlyAmount || !selectedSavingsProduct;
  if (unableToCalculate) {
    return null;
  }

  const expectedProfit = calculateExpectedProfit(monthlyAmount, term, selectedSavingsProduct.annualRate);
  const expectedProfitToWon = roundToWon(expectedProfit, 0);

  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="2RowTypeA"
          top={label}
          topProps={{ color: colors.grey600 }}
          bottom={`${addComma(expectedProfitToWon)}원`}
          bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
        />
      }
    />
  );
};

/**
 * 예상 수익 금액 컴포넌트
 */
interface TargetDifferenceProps extends UserInputs {
  label: string;
  selectedSavingsProduct: SavingsProduct | null;
}

export const TargetDifference = ({
  label,
  targetAmount,
  monthlyAmount,
  term,
  selectedSavingsProduct,
}: TargetDifferenceProps) => {
  const unableToCalculate = !targetAmount || !monthlyAmount || !selectedSavingsProduct;
  if (unableToCalculate) {
    return null;
  }

  const expectedProfit = calculateExpectedProfit(monthlyAmount, term, selectedSavingsProduct.annualRate);
  const targetDifference = calculateTargetDifference(targetAmount, expectedProfit);
  const targetDifferenceToWon = roundToWon(targetDifference, 0);

  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="2RowTypeA"
          top={label}
          topProps={{ color: colors.grey600 }}
          bottom={`${addComma(targetDifferenceToWon)}원`}
          bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
        />
      }
    />
  );
};

/**
 * 예상 수익 금액 컴포넌트
 */
interface RecommendedMonthlyAmountProps extends UserInputs {
  label: string;
  selectedSavingsProduct: SavingsProduct | null;
}

export const RecommendedMonthlyAmount = ({
  label,
  targetAmount,
  term,
  selectedSavingsProduct,
}: RecommendedMonthlyAmountProps) => {
  const unableToCalculate = !targetAmount || !selectedSavingsProduct;
  if (unableToCalculate) {
    return null;
  }

  const recommendedMonthlyAmount = calculateRecommendedMonthlyAmount(
    targetAmount,
    term,
    selectedSavingsProduct.annualRate
  );
  const recommendedMonthlyAmountToThousandWon = roundToWon(recommendedMonthlyAmount, 3);

  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="2RowTypeA"
          top={label}
          topProps={{ color: colors.grey600 }}
          bottom={`${addComma(recommendedMonthlyAmountToThousandWon)}원`}
          bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
        />
      }
    />
  );
};

export const CalculationResult = {
  ExpectedProfit: ExpectedProfit,
  TargetDifference: TargetDifference,
  RecommendedMonthlyAmount: RecommendedMonthlyAmount,
};
