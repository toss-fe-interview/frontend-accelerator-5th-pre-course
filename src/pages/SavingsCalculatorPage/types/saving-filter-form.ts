export interface SavingsFilterForm {
  targetAmount: number | null;
  monthlyPayment: number | null;
  term: 6 | 12 | 24;
}
