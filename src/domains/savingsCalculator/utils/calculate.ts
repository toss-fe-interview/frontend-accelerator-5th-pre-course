const round1000 = (value: number) => {
  return Math.round(value / 1000) * 1000;
};

const toInterestMultiplier = (annualRate: number) => {
  const averageInterestRate = annualRate * 0.5;
  return averageInterestRate + 1;
};

interface CalculatorInput {
  targetAmount: number;
  monthlyPayment: number;
  term: number;
}

const savingsCalculator = ({ targetAmount, monthlyPayment, term }: CalculatorInput) => {
  return {
    toExpectedProfit(annualRate: number) {
      const totalUserPayment = monthlyPayment * term;
      return totalUserPayment * toInterestMultiplier(annualRate);
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

export { round1000, toInterestMultiplier, savingsCalculator };
