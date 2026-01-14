import { TERMS_SELECT_OPTION, TermsValue } from 'pages/SavingsCalculatorPage';
import { create } from 'zustand';

interface SavingsFilterState {
  goal: number;
  monthlyPay: number;
  terms: TermsValue;
}

interface SavingFilterAction {
  changeGoal: (value: number) => void;
  changeMonthlyPay: (value: number) => void;
  changeTerms: (value: TermsValue) => void;
}

export const useSavingsFilterStore = create<SavingsFilterState & SavingFilterAction>(set => ({
  goal: 0,
  monthlyPay: 0,
  terms: 12,
  changeGoal: value => set({ goal: value }),
  changeMonthlyPay: value => set({ monthlyPay: value }),
  changeTerms: value => {
    if (TERMS_SELECT_OPTION.find(opt => opt.value === value)) {
      set({ terms: value });
    }
  },
}));
