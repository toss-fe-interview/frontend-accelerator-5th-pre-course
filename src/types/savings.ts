export interface SavingsProduct {
  id: string;
  name: string;
  annualRate: number;
  minMonthlyAmount: number;
  maxMonthlyAmount: number;
  availableTerms: number;
}

export interface SavingsFormData {
  targetAmount: string;
  monthlyAmount: string;
  savingPeriod: SavingPeriod;
}

export const SAVING_PERIODS = [6, 12, 24] as const;
export type SavingPeriod = (typeof SAVING_PERIODS)[number];
