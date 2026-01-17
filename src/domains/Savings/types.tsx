export interface SavingsProduct {
  id: string;
  name: string;
  annualRate: number;
  minMonthlyAmount: number;
  maxMonthlyAmount: number;
  availableTerms: number;
}

export type SavingsTabValue = 'products' | 'results';

export type SavingTabListType = {
  value: SavingsTabValue;
  name: string;
}[];
