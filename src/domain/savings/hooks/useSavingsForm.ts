import { useState } from 'react';

export type SavingsForm = {
  goalAmount: string;
  monthlySaving: string;
  savingPeriod: 6 | 12 | 24;
};

export const useSavingsForm = () => {
  const [savingsForm, setSavingsForm] = useState<SavingsForm>({
    goalAmount: '',
    monthlySaving: '',
    savingPeriod: 12,
  });

  const updateSavingsForm = (dispatch: Partial<SavingsForm> | ((prev: SavingsForm) => Partial<SavingsForm>)) => {
    setSavingsForm(prev => {
      const updates = typeof dispatch === 'function' ? dispatch(prev) : dispatch;
      return { ...prev, ...updates };
    });
  };

  return { savingsForm, updateSavingsForm };
};
