import { useState } from 'react';

export interface SavingCalculationParams {
  targetAmount: number;
  monthlyPayment: number;
  term: number;
}

const DEFAULT_SAVING_CALCULATION_PARAMS: SavingCalculationParams = {
  targetAmount: 1000000,
  monthlyPayment: 50000,
  term: 12,
};

export const useSavingCalculationParams = () => {
  const [calculationParams, setCalculationParams] = useState<SavingCalculationParams>(
    DEFAULT_SAVING_CALCULATION_PARAMS
  );

  const updateCalculationParams = (params: Partial<SavingCalculationParams>) => {
    setCalculationParams({ ...calculationParams, ...params });
  };

  return { calculationParams, updateCalculationParams };
};
