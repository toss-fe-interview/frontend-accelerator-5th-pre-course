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
  const totalUserPayment = monthlyPayment * term;

  return {
    toExpectedProfit(annualRate: number) {
      return totalUserPayment * toInterestMultiplier(annualRate);
    },
    toDiffFromTargetAmount(annualRate: number) {
      return targetAmount - this.toExpectedProfit(annualRate); // 목표 금액과 예상 수익간 차이
    },
    toRecommendedMonthlyPayment(annualRate: number) {
      return round1000(targetAmount / (term * toInterestMultiplier(annualRate)));
    },
  };
};

export { round1000, toInterestMultiplier, savingsCalculator };
