import { SavingsProduct } from './queries/types';

interface SavingsProductOptionsParams {
  products: SavingsProduct[];
  monthlyDeposit: string;
  term: number;
  selectedProductId: string | null;
}

export function useSavingsProductOptions({
  products,
  monthlyDeposit,
  term,
  selectedProductId,
}: SavingsProductOptionsParams) {
  const depositAmount = Number(monthlyDeposit.replace(/,/g, '')) || 0;

  const availableProducts = products.filter(product => {
    const termMatch = product.availableTerms === term;
    const depositMatch =
      depositAmount === 0 || (depositAmount > product.minMonthlyAmount && depositAmount < product.maxMonthlyAmount);
    return termMatch && depositMatch;
  });

  const selectedProduct = products.find(product => product.id === selectedProductId) ?? null;
  const recommendedProducts = [...availableProducts].sort((a, b) => b.annualRate - a.annualRate).slice(0, 2);

  return { availableProducts, selectedProduct, recommendedProducts };
}

