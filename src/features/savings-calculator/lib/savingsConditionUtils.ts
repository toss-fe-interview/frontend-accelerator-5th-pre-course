import { SavingsCondition } from 'features/savings-calculator/model/types';

export const getConditionEmptyText = (condition: SavingsCondition) => {
  const { targetAmount, monthlyAmount, term } = condition;

  if (targetAmount <= 0) {
    return '목표 금액을 입력해주세요.';
  }

  if (monthlyAmount <= 0) {
    return '월 납입액을 입력해주세요.';
  }

  if (term <= 0) {
    return '저축 기간을 선택해주세요.';
  }
};
