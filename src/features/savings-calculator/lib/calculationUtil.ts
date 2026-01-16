export const calculateFinalAmount = (args: { monthlyAmount: number; term: number; annualRate: number }): number => {
  const { monthlyAmount, term, annualRate } = args;
  return monthlyAmount * term * (1 + (annualRate / 100) * 0.5);
};

export const calculateDifferenceAmount = (args: { targetAmount: number; finalAmount: number }): number => {
  const { targetAmount, finalAmount } = args;
  return targetAmount - finalAmount;
};

export const calculateRecommendedMonthlyAmount = (args: {
  targetAmount: number;
  term: number;
  annualRate: number;
}): number => {
  const { targetAmount, term, annualRate } = args;
  return Math.round(targetAmount / (term * (1 + (annualRate / 100) * 0.5)) / 1000) * 1000;
};
