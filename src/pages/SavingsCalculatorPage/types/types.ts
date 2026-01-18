export interface SavingsProduct {
  id: string;
  name: string;
  annualRate: number;
  minMonthlyAmount: number;
  maxMonthlyAmount: number;
  availableTerms: number;
}

export interface SavingsInput {
  targetAmount: string;
  monthlyAmount: string;
  savingsTerm: number;
}
