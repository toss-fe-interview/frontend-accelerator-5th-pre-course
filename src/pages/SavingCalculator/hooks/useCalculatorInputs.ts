import { useDeferredValue, useState } from 'react';
import { CalculInputs } from '../components/SavingCalculatorInput';

export function useCalculatorInputs() {
  const [calculInputs, setCalculInputs] = useState<CalculInputs>({
    targetAmount: 0,
    monthlyAmount: 0,
    term: 0,
  });

  const deferredInputs = useDeferredValue(calculInputs);

  return { calculInputs, setCalculInputs, deferredInputs };
}
