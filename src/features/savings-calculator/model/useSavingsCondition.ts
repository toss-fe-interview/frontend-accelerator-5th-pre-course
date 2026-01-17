import { useCallback, useState } from 'react';

import { SavingsCondition } from 'features/savings-calculator/model/types';

export const useSavingsCondition = () => {
  const [condition, setCondition] = useState<SavingsCondition>({
    targetAmount: 0,
    monthlyAmount: 0,
    term: 12,
  });

  const handleTargetAmountChange = useCallback((targetAmount: number) => {
    setCondition(prev => ({ ...prev, targetAmount }));
  }, []);

  const handleMonthlyAmountChange = useCallback((monthlyAmount: number) => {
    setCondition(prev => ({ ...prev, monthlyAmount }));
  }, []);

  const handleTermChange = useCallback((term: number) => {
    setCondition(prev => ({ ...prev, term }));
  }, []);

  return {
    condition,
    handleTargetAmountChange,
    handleMonthlyAmountChange,
    handleTermChange,
  };
};
