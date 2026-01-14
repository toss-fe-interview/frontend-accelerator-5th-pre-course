import { useState } from 'react';

export interface SavingsCalculatorState {
  goalAmount: string;
  monthlyDeposit: string;
  savingsPeriod: number;
}

export function useSavingsCalculator() {
  const [goalAmount, setGoalAmount] = useState<string>('');
  const [monthlyDeposit, setMonthlyDeposit] = useState<string>('');
  const [savingsPeriod, setSavingsPeriod] = useState<number>(12);

  const state: SavingsCalculatorState = {
    goalAmount,
    monthlyDeposit,
    savingsPeriod,
  };

  return {
    state,
    setGoalAmount,
    setMonthlyDeposit,
    setSavingsPeriod,
  };
}
