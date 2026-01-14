export type SavingsCalculatorTab = 'products' | 'results';
export type SavingsCalculatorTerm = 6 | 12 | 24;

export interface SavingsFilterForm {
  targetAmount: number | null;
  monthlyPayment: number | null;
  term: SavingsCalculatorTerm;
}
