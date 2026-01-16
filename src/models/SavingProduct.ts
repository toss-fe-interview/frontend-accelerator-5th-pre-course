export interface SavingProduct {
  id: string;
  name: string;
  annualRate: number;
  minMonthlyAmount: number;
  maxMonthlyAmount: number;
  availableTerms: number;
}

export const compareByHighestRate = (a: SavingProduct, b: SavingProduct): number => {
  return b.annualRate - a.annualRate;
};
