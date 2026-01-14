export interface SavingsProduct {
  id: string;
  name: string;
  annualRate: number;
  minMonthlyAmount: number;
  maxMonthlyAmount: number;
  availableTerms: number;
}

export interface SavingsFormInput {
  targetAmount: number;
  monthlyAmount: number;
  savingPeriod: SavingPeriod;
}

export interface SavingsFormData {
  targetAmount: string;
  monthlyAmount: string;
  savingPeriod: SavingPeriod;
}

export interface CalculationResult {
  expectedAmount: number;
  differenceFromTarget: number;
  recommendedMonthlyAmount: number;
}

export const SAVING_PERIODS = [6, 12, 24] as const;
export type SavingPeriod = (typeof SAVING_PERIODS)[number];
