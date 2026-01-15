export interface SavingProduct {
  id: string;
  name: string;
  annualRate: number;
  minMonthlyAmount: number;
  maxMonthlyAmount: number;
  availableTerms: number;
}

export const isSuitableSavingProduct = (product: SavingProduct, monthlyPayment: number, term: number) => {
  return (
    product.minMonthlyAmount <= monthlyPayment &&
    product.maxMonthlyAmount >= monthlyPayment &&
    product.availableTerms === term
  );
};
