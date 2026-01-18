import { SavingsProduct, SavingsInput } from '../types/types';

export const isProductMatchingInput = (product: SavingsProduct, savingsInput: SavingsInput): boolean => {
  const hasMonthlyAmountInput = savingsInput.monthlyAmount.trim() !== '';
  const isMonthlyAmountValid = hasMonthlyAmountInput
    ? Number(savingsInput.monthlyAmount) >= product.minMonthlyAmount &&
      Number(savingsInput.monthlyAmount) <= product.maxMonthlyAmount
    : true;
  const isTermMatched = product.availableTerms === savingsInput.savingsTerm;
  return isMonthlyAmountValid && isTermMatched;
};
