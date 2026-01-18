const CALCULATION_CONFIG = {
  PERCENT_TO_DECIMAL: 0.01,
  납임금액계수: 0.5, // 납입 금액 계수
  ROUNDING_VALUE: 1000,
} as const;

function getDepositAmount(term: number, annualRate: number) {
  const { 납임금액계수, PERCENT_TO_DECIMAL } = CALCULATION_CONFIG;
  return term * (1 + annualRate * 납임금액계수 * PERCENT_TO_DECIMAL);
}

function 예상수익계산(monthlyAmount: number, term: number, annualRate: number) {
  return monthlyAmount * getDepositAmount(term, annualRate);
}

function 목표금액과의차이계산(targetAmount: number, expectedProfit: number) {
  return targetAmount - expectedProfit;
}

function 추천월납입액계산(targetAmount: number, term: number, annualRate: number) {
  const { ROUNDING_VALUE } = CALCULATION_CONFIG;
  const calculated = targetAmount / getDepositAmount(term, annualRate);
  return Math.round(calculated / ROUNDING_VALUE) * ROUNDING_VALUE;
}

export { 예상수익계산, 목표금액과의차이계산, 추천월납입액계산 };
