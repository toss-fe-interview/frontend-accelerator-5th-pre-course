export interface SavingCalculationParams {
  targetAmount: number;
  monthlyPayment: number;
  term: number;
}

export const TERM_OPTIONS = [
  { value: 6, label: '6개월' },
  { value: 12, label: '12개월' },
  { value: 24, label: '24개월' },
];
