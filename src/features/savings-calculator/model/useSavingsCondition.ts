import { useState } from 'react';

import { SavingsCondition } from 'features/savings-calculator/model/types';

export const useSavingsCondition = () => {
  const [condition, setCondition] = useState<SavingsCondition>({
    targetAmount: 0,
    monthlyAmount: 0,
    term: 12,
  });

  const handleTargetAmountChange = (targetAmount: number) => {
    setCondition(prev => ({ ...prev, targetAmount }));
  };

  const handleMonthlyAmountChange = (monthlyAmount: number) => {
    setCondition(prev => ({ ...prev, monthlyAmount }));
  };

  const handleTermChange = (term: number) => {
    setCondition(prev => ({ ...prev, term }));
  };

  return {
    condition,
    handleTargetAmountChange,
    handleMonthlyAmountChange,
    handleTermChange,
  };
};
