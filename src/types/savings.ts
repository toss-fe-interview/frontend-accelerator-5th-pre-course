export interface SavingsProduct {
  id: string;
  name: string;
  annualRate: number;
  minMonthlyAmount: number;
  maxMonthlyAmount: number;
  availableTerms: number;
}

export interface SavingsFormInput {
  targetAmount: number;
  monthlyAmount: number;
  savingPeriod: number;
}

export interface CalculationResult {
  expectedAmount: number;
  differenceFromTarget: number;
  recommendedMonthlyAmount: number;
}
