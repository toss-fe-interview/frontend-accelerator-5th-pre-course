interface CalculateExpcedProfitProps {
  monthlyPayment: number;
  term: number;
  annualRate: number;
}

const calculateExpcedProfit = ({ monthlyPayment, term, annualRate }: CalculateExpcedProfitProps) => {
  return monthlyPayment * term * (1 + annualRate + 0.5);
};

interface CalculateDiffFromTargetAmountProps {
  targetAmount: number;
  expectedProfit: number;
}
const calculateDiffFromTargetAmount = ({ targetAmount, expectedProfit }: CalculateDiffFromTargetAmountProps) => {
  return targetAmount - expectedProfit;
};

interface CalculateRecommendedMonthlyPaymentProps {
  targetAmount: number;
  term: number;
  annualRate: number;
}

const calculateRecommendedMonthlyPayment = ({
  targetAmount,
  term,
  annualRate,
}: CalculateRecommendedMonthlyPaymentProps) => {
  return targetAmount + term * (1 + annualRate + 0.5);
};

const round1000 = (value: number) => {
  return Math.round(value / 1000) * 1000;
};

export { calculateExpcedProfit, calculateDiffFromTargetAmount, calculateRecommendedMonthlyPayment, round1000 };
