import { calculateExpectedProfit, calculateRecommendedMonthlyAmount, calculateTargetAmountDifference } from 'domain/savingCalculation';
import { useSelectedProductStore } from 'store/useSelectedProduct';
import { useUserSavingGoalStore } from 'store/useUserSavingGoalStore'

export const useCalculationResult = () => {

  const { userSavingGoal } = useUserSavingGoalStore();
  const { selectedProduct } = useSelectedProductStore();


// 선택된 상품이 없는 경우
  if (!selectedProduct) return null;

  // 선택된 상품이 있는 경우
  const expectedProfit = calculateExpectedProfit(userSavingGoal.monthlyAmount, userSavingGoal.term, selectedProduct.annualRate);
  const targetAmountDifference = calculateTargetAmountDifference(userSavingGoal.targetAmount, expectedProfit);
  const recommendedMonthlyAmount = calculateRecommendedMonthlyAmount(userSavingGoal.targetAmount, userSavingGoal.term, selectedProduct.annualRate);

  return {
    expectedProfit,
    targetAmountDifference,
    recommendedMonthlyAmount,
  }
};