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
  const calculated = targetAmount / getDepositAmount(term, annualRate);
  return Math.round(calculated / 1000) * 1000;
}

export { calculateExpectedProfit, calculateDifference, calculateRecommendedMonthlyAmount };
