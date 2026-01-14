export const calculateEstimatedEaringsAmount = (
  monthlyPaymentAmount: number,
  savingsPeriod: number,
  annualRate: number
) => {
  const result = monthlyPaymentAmount * savingsPeriod * (1 + annualRate * 0.5);

  return Math.round(result / 1000) * 1000;
};

export const calculateDifferenceWithTargetAmount = (targetAmount: number, estimatedEarginsAmount: number) => {
  const result = targetAmount - estimatedEarginsAmount;

  return Math.round(result / 1000) * 1000;
};

export const calculateRecommendedMonthlyPayment = (targetAmount: number, savingsPeriod: number, annualRate: number) => {
  const result = targetAmount / (savingsPeriod * (1 + annualRate * 0.5));

  return Math.round(result / 1000) * 1000;
};
