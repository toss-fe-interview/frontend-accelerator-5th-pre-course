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
  terms: number;
}

export interface CalculateSavingsParams extends SavingsFormInput {
  annualRate: number;
}

export interface CalculationResult {
  expectedAmount: number;
  difference: number;
  recommendMonthlyAmount: number;
}
