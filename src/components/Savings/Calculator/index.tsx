import { ReactNode } from 'react';
import { GoalAmountInput } from './GoalAmountInput';
import { MonthlyDepositInput } from './MonthlyDepositInput';
import { PeriodSelector } from './PeriodSelector';
export { useSavingsCalculator } from './useSavingsCalculator';

interface CalculatorProps {
  children: ReactNode;
}

function CalculatorRoot({ children }: CalculatorProps) {
  return <>{children}</>;
}

export const Calculator = Object.assign(CalculatorRoot, {
  GoalAmountInput,
  MonthlyDepositInput,
  PeriodSelector,
});
