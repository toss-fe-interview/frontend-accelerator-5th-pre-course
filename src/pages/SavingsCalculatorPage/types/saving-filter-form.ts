export type SavingsCalculatorTab = 'products' | 'results';
export interface SavingsFilterForm {
  targetAmount: number | null;
  monthlyPayment: number | null;
  term: 6 | 12 | 24;
}
