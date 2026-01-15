import { ChangeEvent, useCallback, useState } from 'react';

export type SavingsForm = {
  /** 목표 금액 */
  goalAmount: string;
  /** 월 납입액 */
  monthlySaving: string;
  /** 저축 기간 */
  savingPeriod: 6 | 12 | 24;
};

export const SAVINGS_FORM = {
  GOAL_AMOUNT: 'goalAmount',
  MONTHLY_SAVING: 'monthlySaving',
  SAVING_PERIOD: 'savingPeriod',
} as const;

const initialForm: SavingsForm = {
  goalAmount: '',
  monthlySaving: '',
  savingPeriod: 12,
};

export const useSavingsForm = () => {
  const [savingsForm, setSavingsForm] = useState<SavingsForm>(initialForm);

  const handleChangeGoalAmount = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setSavingsForm(prev => ({ ...prev, [SAVINGS_FORM.GOAL_AMOUNT]: value }));
  }, []);

  const handleChangeMonthlySaving = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setSavingsForm(prev => ({ ...prev, [SAVINGS_FORM.MONTHLY_SAVING]: value }));
  }, []);

  const handleChangeSavingPeriod = useCallback((value: 6 | 12 | 24) => {
    setSavingsForm(prev => ({ ...prev, [SAVINGS_FORM.SAVING_PERIOD]: value }));
  }, []);

  return {
    savingsForm,
    handleChanges: {
      [SAVINGS_FORM.GOAL_AMOUNT]: handleChangeGoalAmount,
      [SAVINGS_FORM.MONTHLY_SAVING]: handleChangeMonthlySaving,
      [SAVINGS_FORM.SAVING_PERIOD]: handleChangeSavingPeriod,
    },
  };
};
