import { ChangeEvent, useState } from 'react';

const parseNumericInput = (value: string): number | null => {
  const numericString = value.replace(/,/g, '').replace(/[^0-9]/g, '');
  if (numericString === '') {
    return null;
  }
  return parseInt(numericString, 10);
};

export function useSavingsForm() {
  const [goalAmount, setGoalAmount] = useState<number | null>(null);
  const [monthlyAmount, setMonthlyAmount] = useState<number | null>(null);
  const [term, setTerm] = useState<number>(12);

  const handleGoalAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGoalAmount(parseNumericInput(e.target.value));
  };

  const handleMonthlyAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMonthlyAmount(parseNumericInput(e.target.value));
  };

  const handleTermChange = (value: number) => {
    setTerm(value);
  };

  return {
    goalAmount,
    monthlyAmount,
    term,
    handleGoalAmountChange,
    handleMonthlyAmountChange,
    handleTermChange,
  };
}
