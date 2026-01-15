function calculateExpectedProfit(monthlyAmount: number, term: number, annualRate: number) {
  return monthlyAmount * term * (1 + annualRate * 0.5 * 0.01);
}

function calculateDifference(targetAmount: number, expectedProfit: number) {
  return targetAmount - expectedProfit;
}

function calculateRecommendedMonthlyAmount(targetAmount: number, term: number, annualRate: number) {
  const calculated = targetAmount / (term * (1 + annualRate * 0.5));
  return Math.round(calculated / 1000) * 1000;
}

export { calculateExpectedProfit, calculateDifference, calculateRecommendedMonthlyAmount };
