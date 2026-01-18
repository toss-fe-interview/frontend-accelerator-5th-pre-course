const CALCULATION_CONFIG = {
  PERCENT_TO_DECIMAL: 0.01,
  납임금액계수: 0.5, // 납입 금액 계수
  ROUNDING_VALUE: 1000,
} as const;

function getDepositAmount(term: number, annualRate: number) {
  const { 납임금액계수, PERCENT_TO_DECIMAL } = CALCULATION_CONFIG;
  return term * (1 + annualRate * 납임금액계수 * PERCENT_TO_DECIMAL);
}

function calculateExpectedProfit(monthlyAmount: number, term: number, annualRate: number) {
  return monthlyAmount * getDepositAmount(term, annualRate);
}

function calculateDifference(targetAmount: number, expectedProfit: number) {
  return targetAmount - expectedProfit;
}

function calculateRecommendedMonthlyAmount(targetAmount: number, term: number, annualRate: number) {
  const { ROUNDING_VALUE } = CALCULATION_CONFIG;
  const calculated = targetAmount / getDepositAmount(term, annualRate);
  return Math.round(calculated / ROUNDING_VALUE) * ROUNDING_VALUE;
}

export { calculateExpectedProfit, calculateDifference, calculateRecommendedMonthlyAmount };
