import { SavingCalculationParams } from 'pages/SavingCalculatorPage/types/SavingCalculationParam';
import { useState } from 'react';

const initialCalculationParams: SavingCalculationParams = {
  targetAmount: 1000000,
  monthlyPayment: 50000,
  term: 12,
};

export const useSavingCalculationParams = () => {
  const [calculationParams, setCalculationParams] = useState<SavingCalculationParams>(initialCalculationParams);

  const updateCalculationParams = (params: Partial<SavingCalculationParams>) => {
    setCalculationParams({ ...calculationParams, ...params });
  };

  return { calculationParams, updateCalculationParams };
};
