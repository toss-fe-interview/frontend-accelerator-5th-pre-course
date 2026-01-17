import { SavingsCondition } from 'features/savings-calculator/model/types';

export const isSelectionReady = ({ monthlyAmount, term }: SavingsCondition) => monthlyAmount > 0 && term > 0;

export const isCalculationReady = ({ targetAmount, monthlyAmount, term }: SavingsCondition) =>
  targetAmount > 0 && monthlyAmount > 0 && term > 0;
