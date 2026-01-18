import { SavingsProduct } from './queries/types';
import { parseFormattedAmount } from 'utils/number';

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
  const depositAmount = parseFormattedAmount(monthlyDeposit);

  const availableProducts = filterByUserCriteria(products, term, depositAmount);
  const selectedProduct = findById(products, selectedProductId);
  const recommendedProducts = getTopByInterestRate(availableProducts, 2);

  return { availableProducts, selectedProduct, recommendedProducts };
}

function filterByUserCriteria(products: SavingsProduct[], term: number, depositAmount: number): SavingsProduct[] {
  return products.filter(product => {
    const termMatch = product.availableTerms === term;
    const depositMatch =
      depositAmount === 0 || (depositAmount > product.minMonthlyAmount && depositAmount < product.maxMonthlyAmount);
    return termMatch && depositMatch;
  });
}

function findById(products: SavingsProduct[], id: string | null): SavingsProduct | null {
  return products.find(product => product.id === id) ?? null;
}

function getTopByInterestRate(products: SavingsProduct[], count: number): SavingsProduct[] {
  return [...products].sort((a, b) => b.annualRate - a.annualRate).slice(0, count);
}
