import { useState } from 'react';

export type Term = 6 | 12 | 24;

export default function useSavingsProductFilters() {
  // TODO: 기본값 되돌리기
  const [targetAmount, setTargetAmount] = useState<number>(1000000);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(100000);
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
