import { useState } from 'react';

export type Term = 6 | 12 | 24;

export default function useSavingsProductFilters() {
  const [targetAmount, setTargetAmount] = useState<number>(0);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [term, setTerm] = useState<Term>(12);

  const handleTargetAmountChange = (value: number) => {
    setTargetAmount(value);
  };
  const handleMonthlyPaymentChange = (value: number) => {
    setMonthlyPayment(value);
  };
  const handleTermChange = (value: Term) => {
    setTerm(value);
  };

  return {
    handleTargetAmountChange,
    handleMonthlyPaymentChange,
    handleTermChange,
    targetAmount,
    monthlyPayment,
    term,
  };
}
