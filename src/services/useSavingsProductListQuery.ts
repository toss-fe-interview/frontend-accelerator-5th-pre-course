import { useQuery } from '@tanstack/react-query';

type SavingsProductResponse = {
  id: string;
  name: string;
  annualRate: number;
  minMonthlyAmount: number;
  maxMonthlyAmount: number;
  availableTerms: number;
};

async function getSavingsProductList(): Promise<SavingsProductResponse[]> {
  try {
    const response = await fetch('http://localhost:5173/api/savings-products');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function useSavingsProductListQuery() {
  return useQuery({
    queryKey: ['savings-products'],
    queryFn: getSavingsProductList,
  });
}
