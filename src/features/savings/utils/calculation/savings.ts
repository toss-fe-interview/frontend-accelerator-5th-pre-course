export const calculateEstimatedEaringsAmount = (
  monthlyPaymentAmount: number,
  savingsPeriod: number,
  annualRate: number
) => {
  const result = monthlyPaymentAmount * savingsPeriod * (1 + annualRate * 0.5);

  return Math.round(result);
};
