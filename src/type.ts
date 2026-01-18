export interface SavingsProduct {
  id: string;
  name: string;
  annualRate: number;
  minMonthlyAmount: number;
  maxMonthlyAmount: number;
  availableTerms: number;
}

export interface SavingsInput {
  goalAmount: number;
  monthlyAmount: number;
  term: number;
}
export type ProductListStatus = 'needsInput' | 'noProducts' | 'hasProducts';
export type ResultsStatus = 'noProduct' | 'hasProduct';
