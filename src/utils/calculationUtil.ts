export const calculateFinalAmount = (monthlyAmount: number, term: number, annualRate: number): number =>
  monthlyAmount * term * (1 + (annualRate / 100) * 0.5);

export const calculateDifferenceAmount = (targetAmount: number, finalAmount: number): number =>
  targetAmount - finalAmount;

export const calculateRecommendedMonthlyAmount = (targetAmount: number, term: number, annualRate: number): number =>
  Math.round(targetAmount / (term * (1 + (annualRate / 100) * 0.5)) / 1000) * 1000;
