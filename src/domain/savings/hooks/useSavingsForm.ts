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

  const createHandler = useCallback(<K extends keyof SavingsForm>(key: K, ...funcs: Array<(arg: any) => any>) => {
    return (initialValue: any) => {
      const value = funcs.reduce((acc, func) => func(acc), initialValue);

      if (value === undefined) {
        return;
      }

      setSavingsForm(prev => ({ ...prev, [key]: value }));
    };
  }, []);

  return {
    savingsForm,
    handleChanges: {
      [SAVINGS_FORM.GOAL_AMOUNT]: createHandler(SAVINGS_FORM.GOAL_AMOUNT, parseEventValue, mustNumber),
      [SAVINGS_FORM.MONTHLY_SAVING]: createHandler(SAVINGS_FORM.MONTHLY_SAVING, parseEventValue, mustNumber),
      [SAVINGS_FORM.SAVING_PERIOD]: createHandler(SAVINGS_FORM.SAVING_PERIOD),
    },
  };
};

const parseEventValue = (e: ChangeEvent<HTMLInputElement>) => e.target.value;
const mustNumber = (v: string) => (/^\d*$/.test(v) ? v : undefined);
