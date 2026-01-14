import { SavingProduct } from 'product/type/internal';

export const getFilteredProducts = (products: SavingProduct[], monthlyPayment: string, term: number) => {
  return products.filter(product => {
    if (
      product.minMonthlyAmount > Number(monthlyPayment.replace(/,/g, '')) ||
      product.maxMonthlyAmount < Number(monthlyPayment.replace(/,/g, ''))
    ) {
      return;
    }
    return product.availableTerms === term;
  });
};
