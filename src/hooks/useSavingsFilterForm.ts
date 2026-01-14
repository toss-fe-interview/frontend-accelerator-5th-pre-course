import { ChangeEvent, useCallback, useState } from 'react';

export type SavingsFilterForm = {
  /** 목표 금액 */
  goalAmount: string;
  /** 월 납입액 */
  monthlySaving: string;
  /** 저축 기간 */
  savingPeriod: 6 | 12 | 24;
};

export const SAVINGS_FILTER_FORM = {
  GOAL_AMOUNT: 'goalAmount',
  MONTHLY_SAVING: 'monthlySaving',
  SAVING_PERIOD: 'savingPeriod',
} as const;

const initialFilterForm: SavingsFilterForm = {
  goalAmount: '',
  monthlySaving: '',
  savingPeriod: 12,
};

export const useSavingsFilterForm = () => {
  const [savingsFilterForm, setSavingsFilterForm] = useState<SavingsFilterForm>(initialFilterForm);

  const handleChangeGoalAmount = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setSavingsFilterForm(prev => ({ ...prev, [SAVINGS_FILTER_FORM.GOAL_AMOUNT]: value }));
  }, []);

  const handleChangeMonthlySaving = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setSavingsFilterForm(prev => ({ ...prev, [SAVINGS_FILTER_FORM.MONTHLY_SAVING]: value }));
  }, []);

  const handleChangeSavingPeriod = useCallback((value: 6 | 12 | 24) => {
    setSavingsFilterForm(prev => ({ ...prev, [SAVINGS_FILTER_FORM.SAVING_PERIOD]: value }));
  }, []);

  return {
    savingsFilterForm,
    handleChanges: {
      [SAVINGS_FILTER_FORM.GOAL_AMOUNT]: handleChangeGoalAmount,
      [SAVINGS_FILTER_FORM.MONTHLY_SAVING]: handleChangeMonthlySaving,
      [SAVINGS_FILTER_FORM.SAVING_PERIOD]: handleChangeSavingPeriod,
    },
  };
};
