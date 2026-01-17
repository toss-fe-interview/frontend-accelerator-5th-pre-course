export type SavingsTerm = 6 | 12 | 24;

export interface SavingsProduct {
  id: string;
  name: string;
  annualRate: number;
  minMonthlyAmount: number;
  maxMonthlyAmount: number;
  availableTerms: SavingsTerm;
}
