import { useDeferredValue, useState } from 'react';
import { CalculInputs } from '../SavingsCalculatorPage';

export function useCalculatorInputs() {
  const [calcInputs, setCalcInputs] = useState<CalculInputs>({
    targetAmount: 0,
    monthlyAmount: 0,
    term: 0,
  });

  const deferredInputs = useDeferredValue(calcInputs);

  return { calcInputs, setCalcInputs, deferredInputs };
}
