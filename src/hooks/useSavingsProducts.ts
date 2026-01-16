import { useQuery } from '@tanstack/react-query';

export interface SavingsProduct {
  id: string;
  name: string;
  annualRate: number;
  minMonthlyAmount: number;
  maxMonthlyAmount: number;
  availableTerms: number;
}

async function fetchSavingsProducts(): Promise<SavingsProduct[]> {
  const response = await fetch('/api/savings-products');
  if (!response.ok) {
    throw new Error('Failed to fetch savings products');
  }
  return response.json();
}

export function useSavingsProducts() {
  return useQuery({
    queryKey: ['savings-products'],
    queryFn: fetchSavingsProducts,
  });
}
