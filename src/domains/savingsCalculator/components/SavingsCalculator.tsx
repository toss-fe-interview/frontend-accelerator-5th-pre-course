import { round1000 } from '../utils/calculate';

interface SavingsCalculatorInputs {
  targetAmount: number;
  monthlyPayment: number;
  term: number;
}

interface SavingsCalculatorOutputs {
  toExpectedProfit: (annualRate: number) => number;
  toDiffFromTargetAmount: (annualRate: number) => number;
  toRecommendedMonthlyPayment: (annualRate: number) => number;
}

interface SavingsCalculatorProps {
  inputs: SavingsCalculatorInputs;
  ouptuts: (results: SavingsCalculatorOutputs) => React.ReactNode;
}

export const savingsCalculator = ({ targetAmount, monthlyPayment, term }: SavingsCalculatorInputs) => {
  return {
    toExpectedProfit(annualRate: number) {
      const totalUserPayment = monthlyPayment * term;
      const averageInterestRate = annualRate * 0.5;
      const interestMultiplier = averageInterestRate + 1;

      return totalUserPayment * interestMultiplier;
    },
    toDiffFromTargetAmount(annualRate: number) {
      return targetAmount - this.toExpectedProfit(annualRate); // 목표 금액과 예상 수익간 차이
    },
    toRecommendedMonthlyPayment(annualRate: number) {
      const expectedProfitPerMonthlyPayment = this.toExpectedProfit(annualRate) / monthlyPayment;
      return round1000(targetAmount / expectedProfitPerMonthlyPayment);
    },
  };
};

export default function SavingsCalculator({ inputs, ouptuts }: SavingsCalculatorProps) {
  const { toExpectedProfit, toDiffFromTargetAmount, toRecommendedMonthlyPayment } = savingsCalculator(inputs);

  return ouptuts({ toExpectedProfit, toDiffFromTargetAmount, toRecommendedMonthlyPayment });
}
