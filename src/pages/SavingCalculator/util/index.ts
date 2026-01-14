export function formatToKRW(amount: number): string {
  return amount.toLocaleString('ko-KR');
}

export function calculateExpectedProfit(monthlyAmount: number, term: number, annualRate: number): number {
  return monthlyAmount * term * (1 + annualRate * 0.5);
}

export function calculateDifferenceFromTarget(targetAmount: number, expectedProfit: number): number {
  return targetAmount - expectedProfit;
}

export function calculateRecommendedMonthlyAmount(targetAmount: number, term: number, annualRate: number): number {
  if (term === 0) {
    return 0;
  }
  const factor = term * (1 + annualRate * 0.5);
  const recommendedAmount = targetAmount / factor;
  return Math.round(recommendedAmount / 1000) * 1000;
}
