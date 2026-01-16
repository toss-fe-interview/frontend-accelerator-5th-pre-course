import { ChangeEvent } from 'react';
import { SelectBottomSheet, Spacing, TextField } from 'tosslib';
import { formatNumber } from 'shared/utils';

interface SavingsCalculatorInputsProps {
  goalAmount: number | null;
  monthlyAmount: number | null;
  term: number;
  onGoalAmountChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onMonthlyAmountChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onTermChange: (value: number) => void;
}

export function SavingsCalculatorInputs({
  goalAmount,
  monthlyAmount,
  term,
  onGoalAmountChange,
  onMonthlyAmountChange,
  onTermChange,
}: SavingsCalculatorInputsProps) {
  return <></>;
}
