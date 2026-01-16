export const calculateExpectedAmount = (monthlyAmount: number, term: number, annualRate: number) => {
  const interestFactor = 1 + annualRate * 0.5;
  return monthlyAmount * term * interestFactor;
};

export const calculateGoalDifference = (goalAmount: number, expectedAmount: number) => {
  return goalAmount - expectedAmount;
};

export const calculateRecommendedMonthlyAmount = (goalAmount: number, term: number, annualRate: number) => {
  const interestFactor = 1 + annualRate * 0.5;
  return Math.round(goalAmount / (term * interestFactor) / 1000) * 1000;
};
