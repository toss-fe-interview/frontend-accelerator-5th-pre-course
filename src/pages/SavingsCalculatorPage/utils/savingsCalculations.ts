const INTEREST_FACTOR = 0.5;

const ROUNDING_UNIT = 1000;

export const calculateExpectedAmount = ({
  monthlyAmount,
  savingsTerm,
  annualRate,
}: {
  monthlyAmount: number;
  savingsTerm: number;
  annualRate: number;
}): number => {
  return monthlyAmount * savingsTerm * (1 + annualRate * INTEREST_FACTOR);
};

export const calculateDifference = ({
  targetAmount,
  monthlyAmount,
  savingsTerm,
  annualRate,
}: {
  targetAmount: number;
  monthlyAmount: number;
  savingsTerm: number;
  annualRate: number;
}): number => {
  const expectedAmount = calculateExpectedAmount({
    monthlyAmount,
    savingsTerm,
    annualRate,
  });
  return targetAmount - expectedAmount;
};

export const calculateRecommendedMonthlyAmount = ({
  targetAmount,
  savingsTerm,
  annualRate,
}: {
  targetAmount: number;
  savingsTerm: number;
  annualRate: number;
}): number => {
  const recommendedAmount = targetAmount / (savingsTerm * (1 + annualRate * INTEREST_FACTOR));

  return Math.round(recommendedAmount / ROUNDING_UNIT) * ROUNDING_UNIT;
};
