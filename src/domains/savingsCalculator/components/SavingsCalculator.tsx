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
  const 목표금액 = targetAmount;
  const 월_납입금액 = monthlyPayment;
  const 저축기간 = term;

  return {
    toExpectedProfit(연이율: number) {
      const 총_납입금액 = 월_납입금액 * 저축기간;
      const 평균이자율 = 연이율 * 0.5;
      const 이자율계수 = 평균이자율 + 1;

      return 총_납입금액 * 이자율계수;
    },
    toDiffFromTargetAmount(연이율: number) {
      const 총_예상수익 = this.toExpectedProfit(연이율);

      return 목표금액 - 총_예상수익;
    },
    toRecommendedMonthlyPayment(연이율: number) {
      const 총_예상수익 = this.toExpectedProfit(연이율);
      const 월_납입금액당_예상수익 = 총_예상수익 / 월_납입금액;

      return round1000(목표금액 / 월_납입금액당_예상수익);
    },
  };
};

export default function SavingsCalculator({ inputs, ouptuts }: SavingsCalculatorProps) {
  const { toExpectedProfit, toDiffFromTargetAmount, toRecommendedMonthlyPayment } = savingsCalculator(inputs);

  return ouptuts({ toExpectedProfit, toDiffFromTargetAmount, toRecommendedMonthlyPayment });
}
