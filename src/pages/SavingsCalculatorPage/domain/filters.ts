import { SavingsProduct, SavingsTerm } from './types';
import { inRange } from 'utils/inRange';

export const matchesMonthlyAmountAndTerm = (
  product: SavingsProduct,
  monthlyAmount: number,
  savingsTerm: SavingsTerm
) => {
  if (monthlyAmount === 0) {
    return product.availableTerms === savingsTerm;
  }

  return (
    inRange(monthlyAmount, product.minMonthlyAmount, product.maxMonthlyAmount) && product.availableTerms === savingsTerm
  );
};
