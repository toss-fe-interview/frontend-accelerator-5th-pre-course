import { SavingsProduct } from 'apis/type';
import { SavingsFilterForm } from 'hooks/useSavingsFilterForm';

type CalcSavingResultProps = {
  savingsFilterForm: SavingsFilterForm;
  selectedProduct?: SavingsProduct;
};

export type SavingsResult = {
  /** 예상 수익 금액 */
  expectedReturn: number;
  /** 목표 금액과의 차이 */
  differanceFromGoal: number;
  /** 추천 월 납입 금액 */
  recommendedMonthlySaving: number;
};

export const calcSavingResult = (props: CalcSavingResultProps): SavingsResult => {
  const { savingsFilterForm, selectedProduct } = props;

  if (!selectedProduct) {
    return { differanceFromGoal: 0, expectedReturn: 0, recommendedMonthlySaving: 0 };
  }
  const { goalAmount, monthlySaving, savingPeriod } = savingsFilterForm;
  const { annualRate } = selectedProduct;

  const expectedReturn = Number(monthlySaving) * savingPeriod * (1 + annualRate + 0.5);
  const differanceFromGoal = Number(goalAmount) - expectedReturn;
  const recommendedMonthlySaving = Number(goalAmount) / (savingPeriod * (1 + annualRate + 0.5));

  return {
    expectedReturn,
    differanceFromGoal,
    recommendedMonthlySaving,
  };
};
