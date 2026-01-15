export function calculateExpectedRevenue(monthlyAmount: number, termsInMonths: number, annualRate: number) {
  return monthlyAmount * termsInMonths * (1 + annualRate * 0.5);
}

export function calculateDiffFromTarget(targetAmount: number, expectedRevenue: number) {
  return targetAmount - expectedRevenue;
}

export function calculateRecommendedMonthlyAmount(targetAmount: number, termsInMonths: number, annualRate: number) {
  const rawAmount = targetAmount / (termsInMonths * (1 + annualRate * 0.5));
  return Math.round(rawAmount / 1000) * 1000;
}
