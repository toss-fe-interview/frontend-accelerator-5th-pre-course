import { SavingProduct } from 'product/type/internal';

export const productFilter = ({
  product,
  monthlyPayment,
  term,
}: {
  product: SavingProduct;
  monthlyPayment: string;
  term: number | null;
}) => {
  const isMonthlyPaymentOverMin = product.minMonthlyAmount <= Number(monthlyPayment.replace(/,/g, ''));
  const isMonthlyPaymentUnderMax = product.maxMonthlyAmount >= Number(monthlyPayment.replace(/,/g, ''));
  const isTermSame = product.availableTerms === term;

  return [isMonthlyPaymentOverMin, isMonthlyPaymentUnderMax, isTermSame].every(Boolean);
};
