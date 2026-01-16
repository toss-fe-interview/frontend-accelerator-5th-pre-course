import { SavingsProduct } from './queries/types';

interface UseFilteredProductsParams {
  products: SavingsProduct[];
  monthlyDeposit: string;
  term: number;
  selectedProductId: string | null;
}

export function useFilteredProducts({ products, monthlyDeposit, term, selectedProductId }: UseFilteredProductsParams) {
  const depositAmount = Number(monthlyDeposit.replace(/,/g, '')) || 0;

  const filteredProducts = products.filter(product => {
    const termMatch = product.availableTerms === term;
    const depositMatch =
      depositAmount === 0 || (depositAmount > product.minMonthlyAmount && depositAmount < product.maxMonthlyAmount);
    return termMatch && depositMatch;
  });

  const selectedProduct = products.find(product => product.id === selectedProductId) ?? null;
  const recommendedProducts = [...filteredProducts].sort((a, b) => b.annualRate - a.annualRate).slice(0, 2);

  return { filteredProducts, selectedProduct, recommendedProducts };
}
