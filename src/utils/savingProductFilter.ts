import { SavingProduct } from 'queries/types';

const isMonthlyAmountMatched = (product: SavingProduct, monthlyAmount?: number) => {
  if (!monthlyAmount) {
    return true;
  }
  return product.minMonthlyAmount <= monthlyAmount && monthlyAmount <= product.maxMonthlyAmount;
};

const isTermMatched = (product: SavingProduct, term: number) => {
  return product.availableTerms === term;
};

export const isAffordableProducts = (product: SavingProduct, monthlyAmount: number, term: number) => {
  return isMonthlyAmountMatched(product, monthlyAmount) && isTermMatched(product, term);
};
