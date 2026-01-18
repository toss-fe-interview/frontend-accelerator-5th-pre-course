interface ExpectedAmountParams {
  monthlyAmount: number;
  term: number;
  annualRate: number;
}

interface GoalDifferenceParams {
  goalAmount: number;
  expectedAmount: number;
}

interface RecommendedMonthlyAmountParams {
  goalAmount: number;
  term: number;
  annualRate: number;
}

export const calculateExpectedAmount = ({ monthlyAmount, term, annualRate }: ExpectedAmountParams) => {
  const interestFactor = 1 + annualRate * 0.5;
  return monthlyAmount * term * interestFactor;
};

export const calculateGoalDifference = ({ goalAmount, expectedAmount }: GoalDifferenceParams) => {
  return goalAmount - expectedAmount;
};

export const calculateRecommendedMonthlyAmount = ({ goalAmount, term, annualRate }: RecommendedMonthlyAmountParams) => {
  const interestFactor = 1 + annualRate * 0.5;
  return Math.round(goalAmount / (term * interestFactor) / 1000) * 1000;
};
