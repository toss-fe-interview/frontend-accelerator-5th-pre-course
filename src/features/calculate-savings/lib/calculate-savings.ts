import { CALCULATION_CONFIG } from '../model/constants';

function getDepositAmount(term: number, annualRate: number) {
  const { DEPOSIT_AMOUNT_COEFFICIENT, PERCENT_TO_DECIMAL } = CALCULATION_CONFIG;
  return term * (1 + annualRate * DEPOSIT_AMOUNT_COEFFICIENT * PERCENT_TO_DECIMAL);
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
