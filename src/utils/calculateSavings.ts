export const calculateExpectedIncome = (monthlyAmount: number, term: number, annualRate: number): number => {
  return monthlyAmount * term * (1 + annualRate * 0.01 * 0.5);
};

export const calculateTargetDiff = (targetAmount: number, expectedIncome: number): number => {
  return targetAmount - expectedIncome;
};

export const calculateRecommendedMonthlyPayment = (targetAmount: number, term: number, annualRate: number): number => {
  const rawAmount = targetAmount / (term * (1 + annualRate * 0.01 * 0.5));
  return Math.round(rawAmount / 1000) * 1000;
};
